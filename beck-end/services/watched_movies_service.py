from repositories.watched_movies_MDB import WatchedMoviesDB


class WatchedMoviesService:
    def __init__(self):
        self.__watched_movies_db = WatchedMoviesDB()

    def get_all_watched_movies(self):
        return self.__watched_movies_db.get_all_watched_movies()

    def add_watched_movie(self, obj):
        return self.__watched_movies_db.add_watched_movie(obj)

    def delete_watched_movie(self, member_id, movie_id):
        return self.__watched_movies_db.delete_watched_movie(member_id, movie_id)