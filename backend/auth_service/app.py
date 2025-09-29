# auth_service/app.py
import os
import time
import psycopg2 # type: ignore
import psycopg2.extras # type: ignore
from fastapi import FastAPI, HTTPException # type: ignore
from pydantic import BaseModel # type: ignore
from dotenv import load_dotenv # type: ignore
from shared.config import settings
#from backend.shared.config import settings

load_dotenv()

app = FastAPI(title="Auth Service")

# ---------- Database Utilities ----------
def get_db_connection():
    conn = psycopg2.connect(
        host=os.environ.get("DB_HOST", "localhost"),
        database=os.environ.get("DB_NAME", "votewave"),
        user=os.environ.get("DB_USER", "postgres"),
        password=os.environ.get("DB_PASSWORD", "postgres")
    )
    return conn

def test_db_connection():
    try:
        conn = get_db_connection()
        conn.close()
        return True
    except Exception:
        return False

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

# ---------- Pydantic Models ----------
class RegisterRequest(BaseModel):
    username: str

# ---------- Routes ----------
@app.post("/register")
def register_user(req: RegisterRequest):
    username = req.username.strip()
    if not username:
        raise HTTPException(status_code=400, detail="Username is required")

    conn = get_db_connection()
    cur = conn.cursor()

    cur.execute("SELECT username FROM users WHERE username = %s;", (username,))
    if cur.fetchone():
        cur.close()
        conn.close()
        raise HTTPException(status_code=400, detail="Username already exists")

    cur.execute("INSERT INTO users (username) VALUES (%s);", (username,))
    conn.commit()

    cur.close()
    conn.close()

    return {"message": f"User '{username}' registered successfully"}

@app.get("/health")
def health_check():
    return {
        "status": "ok",
        "service": "auth_service",
        "db_connected": test_db_connection(),
        "env": settings.APP_ENV
    }

# ---------- Entrypoint ----------
if __name__ == "__main__":
    init_db()
    import uvicorn # type: ignore
    uvicorn.run("app:app", host="0.0.0.0", port=8000, reload=True)
