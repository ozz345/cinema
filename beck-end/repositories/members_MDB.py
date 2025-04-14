import requests
from bson import ObjectId
from pymongo import MongoClient


class MembersDB:
    def __init__(self):
        self.__client = MongoClient(port=27017)
        self.__db = self.__client["final_project"]
        self.__collection = self.__db["MembersDB"]
        self.__ws_url = 'https://jsonplaceholder.typicode.com/users'

    def get_all_members(self):
        return list(self.__collection.find())

    def get_member_by_email(self, email):
        return self.__collection.find_one({"email": email})

    def add_member(self, obj):
        try:
            # Check if member with same email already exists
            existing_member = self.get_member_by_email(obj["email"])
            if existing_member:
                return {"message": "error", "error": "Email already exists"}

            result = self.__collection.insert_one(obj)
            return {"message": "success", "id": str(result.inserted_id)}
        except Exception as e:
            print(f"Error adding member: {str(e)}")
            return {"message": "error", "error": str(e)}

    def get_member_by_name(self, name):
        return self.__collection.find_one({"name": name})

    def get_member_by_id(self, member_id):
        try:
            # Convert string ID to ObjectId
            object_id = ObjectId(member_id)
            return self.__collection.find_one({"_id": object_id})
        except Exception as e:
            print(f"Error getting member by ID: {str(e)}")
            return None

    def update_member(self, member_id, obj):
        try:
            # Convert string ID to ObjectId
            object_id = ObjectId(member_id)
            result = self.__collection.update_one(
                {"_id": object_id},
                {"$set": obj}
            )
            if result.modified_count > 0:
                return {"message": "updated"}
            return {"message": "member not found"}
        except Exception as e:
            print(f"Error updating member: {str(e)}")
            return {"message": "error", "error": str(e)}

    def delete_member(self, member_id):
        try:
            # Convert string ID to ObjectId
            object_id = ObjectId(member_id)
            result = self.__collection.delete_one({"_id": object_id})
            if result.deleted_count > 0:
                return {"message": "deleted"}
            return {"message": "member not found"}
        except Exception as e:
            print(f"Error deleting member: {str(e)}")
            return {"message": "error", "error": str(e)}

    def sync_members_from_ws(self):
        try:
            # Get all members from web service
            response = requests.get(self.__ws_url)
            if response.status_code != 200:
                return {"message": "error", "error": "Failed to fetch from web service"}

            members = response.json()
            results = []

            # Insert each member into MongoDB
            for member in members:
                # Extract only name, email, and city
                member_data = {
                    "name": member["name"],
                    "email": member["email"],
                    "city": member["address"]["city"]
                }

                # Check if member already exists by name
                existing_member = self.get_member_by_name(member_data["name"])
                if not existing_member:
                    # Add the member to MongoDB
                    result = self.add_member(member_data)
                    results.append({
                        "name": member_data["name"],
                        "status": "added",
                        "id": str(result.inserted_id)
                    })
                else:
                    # Update existing member with new data
                    self.update_member(str(existing_member["_id"]), member_data)
                    results.append({
                        "name": member_data["name"],
                        "status": "updated",
                        "id": str(existing_member["_id"])
                    })

            return {
                "message": "success",
                "total_processed": len(members),
                "results": results
            }
        except Exception as e:
            print(f"Error syncing members from web service: {str(e)}")
            return {"message": "error", "error": str(e)}