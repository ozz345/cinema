from repositories.users_MDB import UsersDB
from repositories.premission_file import Premissionfile
from repositories.users_file import Usersfile
from bson import ObjectId


class UsersService:
    def __init__(self):
        # self.__users_ws = UsersWS()
        self.__premission_file = Premissionfile()
        self.__users_file = Usersfile()
        self.__users_db = UsersDB()

    # Users services
    def add_premissions(self, obj):
        return self.__premission_file.add_premissions(obj)

    def add_users(self, obj):
        return self.__users_file.add_users(obj)


    def update_user(self,obj,id):
        return self.__users_file.update_user(obj,id)

    def update_premissions(self, obj, id):
        return self.__premission_file.update_premissions(obj, id)

    def delete_user(self, id):
        try:
            # Delete from users file
            user_result = self.__users_file.delete_user(id)
            print(f"Delete user result: {user_result}")

            # Delete from permissions file
            permission_result = self.__premission_file.delete_permissions(id)
            print(f"Delete permissions result: {permission_result}")

            # Delete from users database
            try:
                db_result = self.__users_db.delete_username(id)
                print(f"Delete from DB result: {db_result}")
            except Exception as db_error:
                print(f"Error deleting from DB: {str(db_error)}")
                # Continue even if DB delete fails

            if user_result["message"] == "deleted" and permission_result["message"] == "deleted":
                return {"message": "deleted"}
            elif user_result["message"] == "user not found":
                return {"message": "user not found"}
            elif permission_result["message"] == "permissions not found":
                return {"message": "permissions not found"}
            else:
                return {"message": "error deleting user", "details": {
                    "user_result": user_result,
                    "permission_result": permission_result
                }}
        except Exception as e:
            print(f"Error in delete_user service: {str(e)}")
            return {"message": "error deleting user", "error": str(e)}

    def get_all_users(self):
        all_users = self.__users_file.get_all_users()
        all_permissions = self.__premission_file.get_all_premissions()
        users = []

        for user in all_users:
            user_data = {
                "id": user["id"],
                "firstname": user["firstname"],
                "lastname": user["lastname"],
                "username": user["username"],
                "createddate": user["createddate"],
                "sessiontimeout": user["sessiontimeout"]
            }

            # Find matching permissions for this user
            user_permissions = next((per["permissions"] for per in all_permissions if per["id"] == user["id"]), {})
            user_data["permissions"] = user_permissions
            users.append(user_data)

        return users

    # Usernames and passwords services
    def get_all_usersname(self):
        users_db = self.__users_db.get_all_usersnames()
        return users_db

    def add_username(self, obj):
        # Check if username already exists
        existing_user = self.__users_db.get_user_by_username(obj["username"])
        if existing_user:
            return {"message": "try again"}

        # Add the new user
        result = self.__users_db.add_username(obj)
        if result.inserted_id:
            return {"message": "success", "id": str(result.inserted_id)}
        return {"message": "error"}


