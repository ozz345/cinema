from bson import ObjectId
from flask import Flask, jsonify
from flask.json.provider import DefaultJSONProvider
from flask_cors import CORS
from routers.movies__router import add_movies, movies_bp
from routers.subscriptions__router import (add_member_bp, delete_mem,
                                           members_bp, update_mem)
from routers.Users_router import (add_user_premissions, add_users,
                                  create_account, delete_user_by_id,
                                  get_all_users, get_all_usersnames,
                                  login_page, update_premission_by_id,
                                  update_user_by_id)
from routers.watched_movies_router import watched_movies_bp


class CustomJSONEncoder(DefaultJSONProvider):
    def __init__(self, app):
        super().__init__(app)

    def default(self, obj):
        if isinstance(obj, ObjectId):
            return str(obj)
        return super().default(self, obj)

app = Flask(__name__)
# Configure CORS with specific origin and methods
CORS(app, resources={
    r"/*": {
        "origins": ["http://localhost:5173", "https://cinema-dxea.vercel.app"],
        "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        "allow_headers": ["Content-Type", "Authorization"],
        "supports_credentials": True
    }
})

app.json = CustomJSONEncoder(app)

# Test route
@app.route('/test', methods=['GET'])
def test():
    return jsonify({"message": "Server is running!"})

# Register blueprints
app.register_blueprint(create_account, url_prefix="/create_account")
app.register_blueprint(add_user_premissions, url_prefix="/add_user")
app.register_blueprint(add_users, url_prefix="/add_users")
app.register_blueprint(get_all_users, url_prefix="/get_all_users")
app.register_blueprint(login_page, url_prefix="/")
app.register_blueprint(update_user_by_id, url_prefix="/update_user")
app.register_blueprint(update_premission_by_id, url_prefix="/update_premission")
app.register_blueprint(delete_user_by_id, url_prefix="/delete_user")
app.register_blueprint(members_bp, url_prefix="/add_members/")
app.register_blueprint(add_member_bp, url_prefix="/add_member/")
app.register_blueprint(update_mem, url_prefix="/update_member")
app.register_blueprint(delete_mem, url_prefix="/delete_member")
app.register_blueprint(movies_bp, url_prefix="/movies")
app.register_blueprint(add_movies, url_prefix="/add_movies")
app.register_blueprint(get_all_usersnames, url_prefix="/get_all_users_MDB")

app.register_blueprint(watched_movies_bp, url_prefix="/watched_movies")

if __name__ == '__main__':
    print("Starting Flask server...")
    app.run(debug=True, host='0.0.0.0', port=5000)