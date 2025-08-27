#main application app.py

from flask import Flask, request, jsonify

app = Flask(__name__)
#In-Memory Database Filhaal
#Baad Me Koi Acchi DB use karenge like PostgreSQL
db = {
    "users": {},
    "polls": {},
    "votes": {}
}
#Auto-Incrementing ID's Ke Liye Counters Ka Istemaal
next_user_id = 1
next_poll_id = 1

@app.route("/")
def index():
    return "Welcome to VoteWave Phase 1!"
#----------------------------------------------------------#
#----------------------USER MANAGEMENT---------------------#
#----------------------------------------------------------#
@app.route("/register", methods=["POST"])
def register_user():
    global next_user_id
    data = request.json
    username = data.get("username")
    if not username or username in db["users"]:
        return jsonify({"error": "Username is required or already exists"}), 400

    db["users"][username] = {"id": next_user_id, "username": username}
    next_user_id += 1
    return jsonify({"message": "User registered successfully", "user": db["users"][username]}), 201
#----------------------------------------------------------# #----------------------POLL MANAGEMENT---------------------# #----------------------------------------------------------#
@app.route("/poll", methods=["POST"])
def create_poll():
    global next_poll_id
    data = request.json
#Auth Simulate Karne Ke Liye User Ka Header Check Karenge
 if not request.headers.get("X-Username"):
         return jsonify({"error": "User authentication required"}), 401

    question = data.get("question")
    options = data.get("options")
    if not question or not options or not isinstance(options, list):
        return jsonify({"error": "Poll requires a 'question' and a list of 'options'"}), 400

    poll_id = next_poll_id
    db["polls"][poll_id] = {
        "id": poll_id,
        "question": question,
        "options": {option: 0 for option in options} # Votes Ko Initialize Karega 0 Se
    }
    next_poll_id += 1
    return jsonify({"message": "Poll created", "poll": db["polls"][poll_id]}), 201

@app.route("/poll/<int:poll_id>", methods=["GET"])
def get_poll(poll_id):
    poll = db["polls"].get(poll_id)
    if not poll:
        return jsonify({"error": "Poll not found"}), 404
    return jsonify(poll)
#----------------------------------------------------------# #---------------------------VOTING-------------------------# #----------------------------------------------------------#
@app.route("/vote/<int:poll_id>", methods=["POST"])
def cast_vote(poll_id):
    data = request.json
    option = data.get("option")
    poll = db["polls"].get(poll_id)
    if not poll:
        return jsonify({"error": "Poll not found"}), 404
    if option not in poll["options"]:
        return jsonify({"error": "Invalid option"}), 400

    poll["options"][option] += 1
    return jsonify({"message": "Vote cast successfully", "poll": poll})

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
