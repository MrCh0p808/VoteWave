# polls-service/app.py
import os
import time
import psycopg2
import psycopg2.extras                      
from flask import Flask, request, jsonify
from dotenv import load_dotenv      

load_dotenv()                               

app = Flask(__name__)
@app.route("/", methods=["GET"])
def health_check():
    return jsonify({"status": "ok", "service": "VoteWave Polls-Service"}), 200

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
            print(f"[polls] DB not ready ({i+1}/{max_tries}): {e}")
            time.sleep(delay)
    raise RuntimeError("Database not available after retries")

def init_db():
    wait_for_db()
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute("""
    CREATE TABLE IF NOT EXISTS votes (
        id SERIAL PRIMARY KEY,
        poll_id INTEGER NOT NULL REFERENCES polls(id) ON DELETE CASCADE,
        username VARCHAR(80) NOT NULL,
        option TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    """)
    conn.commit()
    cur.close()
    conn.close()

@app.route("/poll", methods=["POST"])
def create_poll():
    if not request.headers.get("X-Username"):
        return jsonify({"error": "User authentication required"}), 401

    data = request.get_json(force=True)
    question = data.get("question")
    options = data.get("options")
    if not question or not options or not isinstance(options, list):
        return jsonify({"error": "Poll requires a 'question' and a list of 'options'"}), 400

    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute(
        "INSERT INTO polls (question, options) VALUES (%s, %s) RETURNING id;",
        (question, psycopg2.extras.Json(options))
    )
    poll_id = cur.fetchone()[0]
    conn.commit()
    cur.close()
    conn.close()

    return jsonify({"message": "Poll created", "poll_id": poll_id}), 201
if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5002))
    print(f"Starting VoteWave Polls-Service on http://127.0.0.1:{port}")
    app.run(debug=True, host="0.0.0.0", port=port)

