from flask import Blueprint, jsonify, request
from services.users_service import UsersService

create_account = Blueprint("create_account", __name__)
login_page = Blueprint("login", __name__)
add_user_premissions = Blueprint("add_user", __name__)
add_users = Blueprint("add_users", __name__)
get_all_users = Blueprint("get_all_users", __name__)
update_user_by_id = Blueprint("update_user_by_id", __name__)
update_premission_by_id = Blueprint("update_premission_by_id", __name__)
delete_user_by_id = Blueprint("delete_user_by_id", __name__)
get_all_usersnames =  Blueprint("get_all_usersnames", __name__)
users_service = UsersService()


# Users routers
@add_user_premissions.route("/", methods=["POST"])
def add_premissions():
    try:
        obj = request.json
        if not obj:
            return jsonify({"message": "No data provided"}), 400

        result = users_service.add_premissions(obj)
        return jsonify(result)
    except Exception as e:
        print(f"Error adding permissions: {str(e)}")
        return jsonify({"message": "Error adding permissions"}), 500

@add_users.route("/", methods=["POST"])
def add_user():
    try:
        obj = request.json
        if not obj:
            return jsonify({"message": "No data provided"}), 400

        result = users_service.add_users(obj)
        return jsonify(result)
    except Exception as e:
        print(f"Error adding permissions: {str(e)}")
        return jsonify({"message": "Error adding permissions"}), 500

@get_all_users.route("/", methods=["GET", 'OPTIONS'], strict_slashes=False )
def get_all_users_route():
    users = users_service.get_all_users()
    return jsonify(users)

@update_user_by_id.route("/<p_id>", methods=["PUT"])
def update_user(p_id):
    obj = request.json
    result = users_service.update_user(obj, p_id)
    return jsonify(result)

@update_premission_by_id.route("/<p_id>", methods=["PUT"])
def update_user(p_id):
    obj = request.json
    result = users_service.update_premissions(obj, p_id)
    return jsonify(result)

@delete_user_by_id.route("/<p_id>", methods=["DELETE"])
def delete_user(p_id):
    try:
        if not p_id:
            return jsonify({"message": "error", "error": "No user ID provided"}), 400

        result = users_service.delete_user(p_id)

        if result["message"] == "deleted":
            return jsonify(result), 200
        elif result["message"] in ["user not found", "permissions not found"]:
            return jsonify(result), 404
        else:
            return jsonify(result), 500

    except Exception as e:
        print(f"Error in delete_user route: {str(e)}")
        return jsonify({"message": "error", "error": str(e)}), 500

@add_user_premissions.route("/<p_id>", methods=["PUT"])
def update_premissions(p_id):
    obj = request.json
    result = users_service.update_premissions(obj, p_id)
    return jsonify(result)


# Usernames and passwords routers
@login_page.route("/", methods=["GET"])
def get_all_usersname():
    pers = users_service.get_all_usersname()
    return jsonify(pers)

@get_all_usersnames.route("/", methods=["GET"])
def get_all_usersname():
    pers = users_service.get_all_usersname()
    return jsonify(pers)


@create_account.route("/", methods=["POST"])
def add_username():
    try:
        obj = request.json
        if not obj:
            return jsonify({"message": "try again"}), 400

        result = users_service.add_username(obj)
        return jsonify(result)
    except Exception as e:
        return jsonify({"message": "try again"}), 500




# @persons.route("/<p_id>", methods=["DELETE"])
# def delete_person(p_id):
#     result = persons_service.delete_person(p_id)
#     return jsonify(result)

# @persons.route("/<p_id>", methods=["GET"])
# def get_person(p_id):
#     person = persons_service.get_person(p_id)
#     return jsonify(person)