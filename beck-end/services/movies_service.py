from bson import ObjectId
from repositories.movies_MDB import MoviesDB

# from repositories.members_ws import MembersWS


class MoviesService:
    def __init__(self):
        self.__movie_db = MoviesDB()

    # Movies services
    def get_all_movies(self):
        return self.__movie_db.get_all_movies()

    def add_movie(self, obj):
        return self.__movie_db.add_movie(obj)

    def update_movie(self, movie_id, obj):
        return self.__movie_db.update_movie(movie_id, obj)

    def delete_movie(self, movie_id):
        return self.__movie_db.delete_movie(movie_id)

    def get_movie_by_id(self, movie_id):
        return self.__movie_db.get_movie_by_id(movie_id)

    def sync_movies_from_ws(self):
        return self.__movie_db.sync_movies_from_ws()
