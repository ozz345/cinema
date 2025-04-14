from flask import Blueprint, jsonify, request
from services.subscriptions_service import SubscriptionsService

members_bp = Blueprint("add_members", __name__)
update_mem = Blueprint("update_mem", __name__)
delete_mem = Blueprint("delete_mem", __name__)
add_member_bp = Blueprint("add_mem", __name__)

subscriptions_service = SubscriptionsService()


# Members routers
@add_member_bp.route("/", methods=["POST"])
def add_member_route():
    try:
        obj = request.json
        if not obj:
            return jsonify({"message": "No data provided"}), 400

        result = subscriptions_service.add_member(obj)
        return jsonify(result)
    except Exception as e:
        print(f"Error adding member: {str(e)}")
        return jsonify({"message": "Error adding member"}), 500

@members_bp.route("/sync", methods=["POST"])
def sync_members():
    try:
        result = subscriptions_service.sync_members_from_ws()
        return jsonify(result)
    except Exception as e:
        print(f"Error syncing members: {str(e)}")
        return jsonify({"message": "Error syncing members"}), 500

@members_bp.route("/", methods=["GET"])
def get_all_members():
    try:
        result = subscriptions_service.get_all_members()
        return jsonify(result)
    except Exception as e:
        print(f"Error getting members: {str(e)}")
        return jsonify({"message": "Error getting members"}), 500

@update_mem.route("/<member_id>", methods=["PUT"])
def update_member(member_id):
    try:
        obj = request.json
        if not obj:
            return jsonify({"message": "No data provided"}), 400

        result = subscriptions_service.update_member(member_id, obj)
        return jsonify(result)
    except Exception as e:
        print(f"Error updating member: {str(e)}")
        return jsonify({"message": "Error updating member"}), 500

@delete_mem.route("/<member_id>", methods=["DELETE"])
def delete_member(member_id):
    try:
        result = subscriptions_service.delete_member(member_id)
        return jsonify(result)
    except Exception as e:
        print(f"Error deleting member: {str(e)}")
        return jsonify({"message": "Error deleting member"}), 500

