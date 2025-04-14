import json


class Usersfile:
    def __init__(self):
        self.__file = 'React&py_project/beck-end/data/Users.json'

    def get_all_users(self):
        with open(self.__file, 'r') as fp:
            data = json.load(fp)
        return data["users"]

    def add_users(self, obj):
        users = self.get_all_users()
        # Check if permission with same ID already exists
        if any(p.get("id") == obj.get("id") for p in users):
            return {"message": "Permission with this ID already exists"}

        users.append(obj)
        data = {"users": users}
        with open(self.__file, 'w') as fp:
            json.dump(data, fp)
        return {"message": "created"}

    def update_user(self, obj, id):
        users = self.get_all_users()
        # Find the user by ID
        for i, user in enumerate(users):
            if user.get("id") == id:
                # Update the user data while preserving the ID
                obj["id"] = id
                users[i] = obj
                data = {"users": users}
                with open(self.__file, 'w') as fp:
                    json.dump(data, fp)
                return {"message": "updated"}
        return {"message": "user not found"}

    def delete_user(self, id):
        try:
            users = self.get_all_users()
            # Find and remove the user by ID
            for i, user in enumerate(users):
                if user.get("id") == id:
                    users.pop(i)
                    data = {"users": users}
                    with open(self.__file, 'w') as fp:
                        json.dump(data, fp)
                    return {"message": "deleted"}
            return {"message": "user not found"}
        except Exception as e:
            print(f"Error in delete_user file operation: {str(e)}")
            return {"message": "error deleting user", "error": str(e)}



