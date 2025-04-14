from datetime import datetime

from bson import ObjectId
from pymongo import MongoClient


class WatchedMoviesDB:
    def __init__(self):
        self.__client = MongoClient(port=27017)
        self.__db = self.__client["final_project"]
        self.__collection = self.__db["SubscriptionDB"]

    def get_all_watched_movies(self):
        try:
            watched_movies = list(self.__collection.find())
            # Convert ObjectId to string for JSON serialization
            for movie in watched_movies:
                movie['_id'] = str(movie['_id'])
                movie['MemberId'] = str(movie['MemberId'])
                for m in movie['Movies']:
                    m['movieId'] = str(m['movieId'])
                    if isinstance(m['date'], datetime):
                        m['date'] = m['date'].strftime('%Y-%m-%d')
            return watched_movies
        except Exception as e:
            print(f"Error getting all watched movies: {str(e)}")
            return []

    def add_watched_movie(self, obj):
        try:
            # Check if subscription already exists
            existing_sub = self.__collection.find_one({"MemberId": ObjectId(obj["MemberId"])})

            if existing_sub:
                # Convert date string to datetime
                watch_date = datetime.strptime(obj["watch_date"], "%Y-%m-%d")

                # Add new movie to the Movies array
                result = self.__collection.update_one(
                    {"MemberId": ObjectId(obj["MemberId"])},
                    {"$push": {
                        "Movies": {
                            "movieId": ObjectId(obj["movie_id"]),
                            "date": watch_date
                        }
                    }}
                )
                return {"message": "success", "id": str(existing_sub["_id"])}
            else:
                # Create new subscription with first movie
                watch_date = datetime.strptime(obj["watch_date"], "%Y-%m-%d")
                new_sub = {
                    "MemberId": ObjectId(obj["MemberId"]),
                    "Movies": [{
                        "movieId": ObjectId(obj["movie_id"]),
                        "date": watch_date
                    }]
                }
                result = self.__collection.insert_one(new_sub)
                return {"message": "success", "id": str(result.inserted_id)}
        except Exception as e:
            print(f"Error adding watched movie: {str(e)}")
            return {"message": "error", "error": str(e)}

    def delete_watched_movie(self, member_id, movie_id):
        try:
            result = self.__collection.update_one(
                {"MemberId": ObjectId(member_id)},
                {"$pull": {"Movies": {"movieId": ObjectId(movie_id)}}}
            )
            if result.modified_count > 0:
                return {"message": "deleted"}
            return {"message": "movie not found"}
        except Exception as e:
            print(f"Error deleting watched movie: {str(e)}")
            return {"message": "error", "error": str(e)}