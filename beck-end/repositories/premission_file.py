import json


class Premissionfile:
    def __init__(self):
        self.__file = 'React&py_project/beck-end/data/Premission.json'

    def get_all_premissions(self):
        with open(self.__file, 'r') as fp:
            data = json.load(fp)
        return data["premissions"]

    def add_premissions(self, obj):
        premissions = self.get_all_premissions()
        # Check if permission with same ID already exists
        if any(p.get("id") == obj.get("id") for p in premissions):
            return {"message": "Permission with this ID already exists"}

        premissions.append(obj)
        data = {"premissions": premissions}
        with open(self.__file, 'w') as fp:
            json.dump(data, fp)
        return {"message": "created"}

    def update_premissions(self, obj, id):
        premissions = self.get_all_premissions()
        # Find the permission by ID
        for i, permission in enumerate(premissions):
            if permission.get("id") == id:
                # Update the permission data while preserving the ID
                obj["id"] = id
                premissions[i] = obj
                data = {"premissions": premissions}
                with open(self.__file, 'w') as fp:
                    json.dump(data, fp)
                return {"message": "updated"}
        return {"message": "permission not found"}

    def delete_permissions(self, id):
        try:
            premissions = self.get_all_premissions()
            # Find and remove the permissions by ID
            for i, permission in enumerate(premissions):
                if permission.get("id") == id:
                    premissions.pop(i)
                    data = {"premissions": premissions}
                    with open(self.__file, 'w') as fp:
                        json.dump(data, fp)
                    return {"message": "deleted"}
            return {"message": "permissions not found"}
        except Exception as e:
            print(f"Error in delete_permissions file operation: {str(e)}")
            return {"message": "error deleting permissions", "error": str(e)}



