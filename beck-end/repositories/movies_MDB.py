from datetime import datetime

import requests
from bson import ObjectId
from pymongo import MongoClient


class MoviesDB:
    def __init__(self):
        self.__client = MongoClient(port=27017)
        self.__db = self.__client["final_project"]
        self.__collection = self.__db["MoviesDB"]
        self.__ws_url = 'https://api.tvmaze.com/shows'

    def get_all_movies(self):
        try:
            movies = list(self.__collection.find())
            # Convert ObjectId to string for JSON serialization
            for movie in movies:
                movie['_id'] = str(movie['_id'])
                if 'premiered' in movie and isinstance(movie['premiered'], datetime):
                    movie['premiered'] = movie['premiered'].strftime('%Y-%m-%d')
            return movies
        except Exception as e:
            print(f"Error getting all movies: {str(e)}")
            return []

    def add_movie(self, obj):
        try:
            # Convert premiered string to datetime if it exists
            if "premiered" in obj:
                obj["premiered"] = datetime.strptime(obj["premiered"], "%Y-%m-%d")

            # Ensure genres is an array
            if "genres" in obj and not isinstance(obj["genres"], list):
                obj["genres"] = [obj["genres"]]

            result = self.__collection.insert_one(obj)
            return {"message": "success", "id": str(result.inserted_id)}
        except Exception as e:
            print(f"Error adding movie: {str(e)}")
            return {"message": "error", "error": str(e)}

    def get_movie_by_name(self, name):
        try:
            movie = self.__collection.find_one({"name": name})
            if movie:
                movie['_id'] = str(movie['_id'])
                if 'premiered' in movie and isinstance(movie['premiered'], datetime):
                    movie['premiered'] = movie['premiered'].strftime('%Y-%m-%d')
            return movie
        except Exception as e:
            print(f"Error getting movie by name: {str(e)}")
            return None

    def get_movie_by_id(self, movie_id):
        try:
            object_id = ObjectId(movie_id)
            movie = self.__collection.find_one({"_id": object_id})
            if movie:
                movie['_id'] = str(movie['_id'])
                if 'premiered' in movie and isinstance(movie['premiered'], datetime):
                    movie['premiered'] = movie['premiered'].strftime('%Y-%m-%d')
            return movie
        except Exception as e:
            print(f"Error getting movie by ID: {str(e)}")
            return None

    def update_movie(self, movie_id, obj):
        try:
            # Convert premiered string to datetime if it exists
            if "premiered" in obj:
                obj["premiered"] = datetime.strptime(obj["premiered"], "%Y-%m-%d")

            # Ensure genres is an array
            if "genres" in obj and not isinstance(obj["genres"], list):
                obj["genres"] = [obj["genres"]]

            object_id = ObjectId(movie_id)
            result = self.__collection.update_one(
                {"_id": object_id},
                {"$set": obj}
            )
            if result.modified_count > 0:
                return {"message": "updated"}
            return {"message": "movie not found"}
        except Exception as e:
            print(f"Error updating movie: {str(e)}")
            return {"message": "error", "error": str(e)}

    def delete_movie(self, movie_id):
        try:
            object_id = ObjectId(movie_id)
            result = self.__collection.delete_one({"_id": object_id})
            if result.deleted_count > 0:
                return {"message": "deleted"}
            return {"message": "movie not found"}
        except Exception as e:
            print(f"Error deleting movie: {str(e)}")
            return {"message": "error", "error": str(e)}

    def sync_movies_from_ws(self):
        try:
            # Get all movies from web service
            response = requests.get(self.__ws_url)
            if response.status_code != 200:
                return {"message": "error", "error": "Failed to fetch from web service"}

            movies = response.json()
            results = []

            # Insert each movie into MongoDB
            for movie in movies:
                # Extract required fields
                movie_data = {
                    "name": movie["name"],
                    "genres": movie["genres"],
                    "image": movie["image"]["medium"],
                    "premiered": movie["premiered"]
                }

                # Check if movie already exists by name
                existing_movie = self.get_movie_by_name(movie_data["name"])
                if not existing_movie:
                    # Add the movie to MongoDB
                    result = self.add_movie(movie_data)
                    results.append({
                        "name": movie_data["name"],
                        "status": "added",
                        "id": str(result["id"])
                    })
                else:
                    results.append({
                        "name": movie_data["name"],
                        "status": "already exists",
                        "id": str(existing_movie["_id"])
                    })

            return {
                "message": "success",
                "total_processed": len(movies),
                "results": results
            }
        except Exception as e:
            print(f"Error syncing movies from web service: {str(e)}")
            return {"message": "error", "error": str(e)}



