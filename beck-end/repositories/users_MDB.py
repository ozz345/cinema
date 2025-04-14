from bson import ObjectId
from pymongo import MongoClient


class UsersDB:
    def __init__(self):
        self.__client = MongoClient(port=27017)
        self.__db = self.__client["final_project"]
        self.__collection = self.__db["UsersDB"]

    def get_all_usersnames(self):
        return list(self.__collection.find())

    def add_username(self, obj):
        return self.__collection.insert_one(obj)

    def get_user_by_username(self, username):
        return self.__collection.find_one({"username": username})

    def update_username(self, user_id, obj):
        return self.__collection.update_one({"_id": ObjectId(user_id)}, {"$set": obj})

    def delete_username(self, user_id):
        try:
            # Convert string ID to ObjectId
            object_id = ObjectId(user_id)
            result = self.__collection.delete_one({"_id": object_id})
            if result.deleted_count > 0:
                return {"message": "deleted"}
            return {"message": "user not found"}
        except Exception as e:
            print(f"Error deleting user from DB: {str(e)}")
            return {"message": "error", "error": str(e)}







