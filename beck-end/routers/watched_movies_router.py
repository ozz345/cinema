from flask import Blueprint, jsonify, request
from services.watched_movies_service import WatchedMoviesService

watched_movies_bp = Blueprint('watched_movies', __name__)
watched_movies_service = WatchedMoviesService()

@watched_movies_bp.route("/", methods=["GET"])
def get_all_watched_movies():
    try:
        result = watched_movies_service.get_all_watched_movies()
        return jsonify(result)
    except Exception as e:
        print(f"Error getting watched movies: {str(e)}")
        return jsonify({"message": "Error getting watched movies"}), 500

@watched_movies_bp.route("/", methods=["POST"])
def add_watched_movie():
    try:
        data = request.get_json()
        if not data:
            return jsonify({"message": "No data provided"}), 400
        result = watched_movies_service.add_watched_movie(data)
        return jsonify(result)
    except Exception as e:
        print(f"Error adding watched movie: {str(e)}")
        return jsonify({"message": "Error adding watched movie"}), 500

@watched_movies_bp.route("/<member_id>/<movie_id>", methods=["DELETE"])
def delete_watched_movie(member_id, movie_id):
    try:
        result = watched_movies_service.delete_watched_movie(member_id, movie_id)
        return jsonify(result)
    except Exception as e:
        print(f"Error deleting watched movie: {str(e)}")
        return jsonify({"message": "Error deleting watched movie"}), 500