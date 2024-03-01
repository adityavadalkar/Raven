import json
import os
import openai
from scipy.spatial.distance import cosine
import pandas as pd
from sentence_transformers import SentenceTransformer


class OutfitSearcher:
    def __init__(self):
        self.model = SentenceTransformer("paraphrase-multilingual-MiniLM-L12-v2")
        self.openai_api_key = os.getenv("OPENAI_API_KEY")
        openai.api_key = self.openai_api_key
        self.initialize()

    def initialize(self):
        self.df = pd.read_csv("./api/styles.csv")
        self.occasion_set = self._load_data()
        self.embedding_dict = self._process_occasion()
        self.outfit_dict = self._reverse_indexing()
        self.occasion_dict = dict(zip(range(len(self.occasion_set)), self.occasion_set))

    def search_outfits(self, query):
        query_embedding = self.model.encode(query)
        similarities = {
            key: 1 - cosine(query_embedding, value)
            for key, value in self.embedding_dict.items()
        }
        sorted_keys = sorted(similarities, key=similarities.get, reverse=True)
        occasions = []
        if similarities[sorted_keys[0]] < 0.5:
            occasions = self._get_occasion(self.occasion_dict, query)
        else:
            for key in sorted_keys[0:10]:
                occasions.append(key)
        outfits = set()
        for occasion in occasions:
            if len(outfits) < 10:
                for outfit in self.outfit_dict[occasion]:
                    if len(outfits) == 10:
                        break
                    outfits.add(outfit)
        return list(outfits)

    def create_embedding(self, query):
        embeddings = self.model.encode(query)
        return embeddings

    def _process_occasion(self):
        embedding_dict = dict()
        for item in self.occasion_set:
            embeddings = self.model.encode(item)
            embedding_dict[item] = embeddings
        return embedding_dict

    def _reverse_indexing(self):
        outfit_dict = dict()
        for item in self.occasion_set:
            outfit_dict[item] = []

        for _, row in self.df.iterrows():
            for item in row["occasions"].split(","):
                outfit_dict[item.strip()].append(row["outfit_image"])

        return outfit_dict

    def _load_data(self):
        occasion_list = self.df["occasions"].tolist()
        occasion_list = [x.split(",") for x in occasion_list]
        occasion_list = [y.strip() for x in occasion_list for y in x]
        occasion_set = set(occasion_list)
        return occasion_set

    def _get_response(
        self, user_message, system_message, temperature=0, model="gpt-3.5-turbo-16k"
    ):
        response = openai.ChatCompletion.create(
            model=model,
            temperature=temperature,
            messages=[
                {"role": "system", "content": system_message},
                {"role": "user", "content": user_message},
            ],
        )
        return response.choices[0].message["content"]

    def _get_occasion(self, occasion_dict, occasion):
        prompt1 = f"""
        You will be provided a dictionary of occasion labels, delimited by triple quotes. \
        Determine the 10 occasions from this set that have the most similar dress code to the following occasion: {occasion}. \
        """

        prompt2 = """
        Return the indices of these 10 occasion in descending order of similarity in dress code. Output a JSON object \
        with the following format:
        {"output": <list of indices>}
        """

        prompt3 = f"""
        \"\"\"{occasion_dict}\"\"\"
        """
        prompt4 = """
        The JSON object is:
        """
        prompt = prompt1 + prompt2 + prompt3 + prompt4

        system_message = "You are ChatGPT."
        user_message = prompt

        result = self._get_response(user_message, system_message)
        ind = json.loads(result)["output"]
        return [occasion_dict[x] for x in ind]
