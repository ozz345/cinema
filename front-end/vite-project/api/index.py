import os

from flask import Flask, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Import your routes
from routes import *


@app.route('/')
def home():
    return jsonify({"message": "Welcome to the API"})

if __name__ == '__main__':
    app.run(debug=True)