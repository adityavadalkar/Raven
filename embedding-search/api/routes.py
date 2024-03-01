from flask_restx import Api, Resource, fields
from .outfitsearch import OutfitSearcher


searcher = OutfitSearcher()

rest_api = Api(version="1.0", title="Embedding API")


"""
    Flask-Restx models for api request and response data
"""

embedding_model = rest_api.model(
    "EmbeddingModel",
    {
        "query": fields.String(required=True, min_length=1),
    },
)

"""
    Flask-Restx routes
"""


@rest_api.route("/heartbeat")
class Health(Resource):
    """
    Health check
    """

    def get(self):
        return {"success": True, "msg": "heartbeat"}, 200


@rest_api.route("/v1/embedding")
class Embedding(Resource):
    """
    Create embedding
    """

    @rest_api.expect(embedding_model, validate=True)
    def post(self):
        query = rest_api.payload["query"]
        embedding = searcher.create_embedding(query)
        return {"success": True, "msg": "embedding created", "res": embedding}, 200


@rest_api.route("/v1/search")
class Search(Resource):
    """
    Search for outfits
    """

    @rest_api.expect(embedding_model, validate=True)
    def post(self):
        query = rest_api.payload["query"]
        outfits = searcher.search_outfits(query)
        results = {"outfits": outfits}

        return {"success": True, "msg": "search completed", "res": results}, 200


@rest_api.route("/v1/update_outfits")
class UpdateOutfits(Resource):
    """
    Update outfits
    """

    def post(self):
        searcher.initialize()
        return {"success": True, "msg": "outfits updated"}, 200
