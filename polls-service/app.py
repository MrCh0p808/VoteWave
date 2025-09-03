# polls-service/app.py
import os
import psycopg2
from flask import Flask, request, jsonify

app = Flask(__name__)

def get_db_connection():
    conn = psycopg2.connect(
        host=os.environ.get("DB_HOST"),
        database=os.environ.get("DB_NAME"),
        user=os.environ.get("DB_USER"),
        password=os.environ.get("DB_PASSWORD")
    )
    return conn

@app.route("/poll", methods=["POST"])
def create_poll():
    # In a real microservice architecture, you'd verify the user exists
    # by calling the auth-service or using a shared JWT token.
    # For Phase 2, we'll keep the simple header check.
    if not request.headers.get("X-Username"):
         return jsonify({"error": "User authentication required"}), 401

    data = request.json
    question = data.get("question")
    options = data.get("options")
    if not question or not options or not isinstance(options, list):
        return jsonify({"error": "Poll requires a 'question' and a list of 'options'"}), 400

    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute("INSERT INTO polls (question, options) VALUES (%s, %s) RETURNING id;",
                (question, psycopg2.extras.Json(options)))
    poll_id = cur.fetchone()[0]
    conn.commit()
    cur.close()
    conn.close()

    return jsonify({"message": "Poll created", "poll_id": poll_id}), 201

# Add other routes for getting polls and voting later...

if __name__ == "__main__":
    # CREATE TABLE polls (id SERIAL PRIMARY KEY, question TEXT NOT NULL, options JSONB NOT NULL);
    app.run(host="0.0.0.0", port=5002, debug=True)
