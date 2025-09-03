# auth-service/app.py
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

@app.route("/register", methods=["POST"])
def register_user():
    data = request.json
    username = data.get("username")
    if not username:
        return jsonify({"error": "Username is required"}), 400

    conn = get_db_connection()
    cur = conn.cursor()
    
    # Check if user exists
    cur.execute("SELECT username FROM users WHERE username = %s;", (username,))
    if cur.fetchone():
        return jsonify({"error": "Username already exists"}), 400

    # Insert new user
    cur.execute("INSERT INTO users (username) VALUES (%s);", (username,))
    conn.commit()
    
    cur.close()
    conn.close()
    
    return jsonify({"message": f"User '{username}' registered successfully"}), 201

if __name__ == "__main__":
    # The DB schema needs to be created manually or via a migration tool
    # For this phase, we'll create it via SSH on the RDS instance.
    # CREATE TABLE users (id SERIAL PRIMARY KEY, username VARCHAR(80) UNIQUE NOT NULL);
    app.run(host="0.0.0.0", port=5001, debug=True)
