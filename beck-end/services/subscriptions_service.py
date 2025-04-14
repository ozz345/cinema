from bson import ObjectId
from repositories.members_MDB import MembersDB

# from repositories.members_ws import MembersWS


class SubscriptionsService:
    def __init__(self):
        self.__member_db = MembersDB()

    # Members services
    def add_member(self, obj):
        return self.__member_db.add_member(obj)

    def get_all_members(self):
        return self.__member_db.get_all_members()

    def sync_members_from_ws(self):
        return self.__member_db.sync_members_from_ws()

    def update_member(self, member_id, obj):
        return self.__member_db.update_member(member_id, obj)

    def delete_member(self, member_id):
        return self.__member_db.delete_member(member_id)
