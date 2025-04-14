from flask import Blueprint, jsonify, request
from services.movies_service import MoviesService

movies_bp = Blueprint('movies', __name__)
add_movies = Blueprint('add_movies', __name__)
movies_service = MoviesService()

@movies_bp.route("/sync", methods=["POST"])
def sync_movies():
    try:
        result = movies_service.sync_movies_from_ws()
        return jsonify(result)
    except Exception as e:
        print(f"Error syncing movies: {str(e)}")
        return jsonify({"message": "Error syncing movies"}), 500

@movies_bp.route("/", methods=["GET"])
def get_all_movies():
    try:
        result = movies_service.get_all_movies()
        return jsonify(result)
    except Exception as e:
        print(f"Error getting movies: {str(e)}")
        return jsonify({"message": "Error getting movies"}), 500

@add_movies.route("/", methods=["POST"])
def add_movie():
    try:
        data = request.get_json()
        if not data:
            return jsonify({"message": "No data provided"}), 400
        result = movies_service.add_movie(data)
        return jsonify(result)
    except Exception as e:
        print(f"Error adding movie: {str(e)}")
        return jsonify({"message": "Error adding movie"}), 500

@movies_bp.route("/<movie_id>", methods=["PUT"])
def update_movie(movie_id):
    try:
        data = request.get_json()
        if not data:
            return jsonify({"message": "No data provided"}), 400
        result = movies_service.update_movie(movie_id, data)
        return jsonify(result)
    except Exception as e:
        print(f"Error updating movie: {str(e)}")
        return jsonify({"message": "Error updating movie"}), 500

@movies_bp.route("/<movie_id>", methods=["DELETE"])
def delete_movie(movie_id):
    try:
        result = movies_service.delete_movie(movie_id)
        return jsonify(result)
    except Exception as e:
        print(f"Error deleting movie: {str(e)}")
        return jsonify({"message": "Error deleting movie"}), 500

@movies_bp.route("/<movie_id>", methods=["GET"])
def get_movie_by_id(movie_id):
    try:
        result = movies_service.get_movie_by_id(movie_id)
        return jsonify(result)
    except Exception as e:
        print(f"Error getting movie by ID: {str(e)}")
        return jsonify({"message": "Error getting movie by ID"}), 500
