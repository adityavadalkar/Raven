import json

from flask import Flask, render_template
from flask_cors import CORS

from .routes import rest_api

app = Flask(__name__)

app.config.from_object("api.config.BaseConfig")


# Temporary used for demo
@app.route("/")
def index():
    return render_template("./index.html")


rest_api.init_app(app)
CORS(app)


# Setup database
@app.before_first_request
def initialize_database():
    pass


# Setup embeddings and reverse indexing
@app.before_first_request
def initialize():
    # TODO: initialize model and embeddings
    print("Embeddings and reverse indexing initialized")


"""
   Custom responses
"""


@app.after_request
def after_request(response):
    """
    Sends back a custom error with {"success", "msg"} format
    """

    if int(response.status_code) >= 400:
        response_data = json.loads(response.get_data())
        if "errors" in response_data:
            response_data = {
                "success": False,
                "msg": list(response_data["errors"].items())[0][1],
            }
            response.set_data(json.dumps(response_data))
        response.headers.add("Content-Type", "application/json")
    return response
