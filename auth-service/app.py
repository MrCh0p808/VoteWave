# auth-service/app.py
import os
import time
import psycopg2
import psycopg2.extras          
from flask import Flask, request, jsonify
from dotenv import load_dotenv      

load_dotenv()                          

app = Flask(__name__)

def get_db_connection():
    conn = psycopg2.connect(
        host=os.environ.get("DB_HOST", "localhost"),
        database=os.environ.get("DB_NAME", "votewavedb"),
        user=os.environ.get("DB_USER", "votewaveadmin"),
        password=os.environ.get("DB_PASSWORD")
    )
    return conn

def wait_for_db(max_tries=12, delay=5):
    for i in range(max_tries):
        try:
            conn = get_db_connection()
            conn.close()
            return True
        except Exception as e:
            print(f"[auth] DB not ready ({i+1}/{max_tries}): {e}")
            time.sleep(delay)
    raise RuntimeError("Database not available after retries")

def init_db():
    wait_for_db()
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute("""
        CREATE TABLE IF NOT EXISTS users (
            id SERIAL PRIMARY KEY,
            username VARCHAR(80) UNIQUE NOT NULL
        );
    """)
    conn.commit()
    cur.close()
    conn.close()

@app.route("/register", methods=["POST"])
def register_user():
    data = request.get_json(force=True)
    username = data.get("username")
    if not username:
        return jsonify({"error": "Username is required"}), 400

    conn = get_db_connection()
    cur = conn.cursor()

    cur.execute("SELECT username FROM users WHERE username = %s;", (username,))
    if cur.fetchone():
        cur.close()
        conn.close()
        return jsonify({"error": "Username already exists"}), 400

    cur.execute("INSERT INTO users (username) VALUES (%s);", (username,))
    conn.commit()

    cur.close()
    conn.close()

    return jsonify({"message": f"User '{username}' registered successfully"}), 201

if __name__ == "__main__":
    init_db()   
    app.run(host="0.0.0.0", port=int(os.environ.get("PORT", 5001)), debug=True)

