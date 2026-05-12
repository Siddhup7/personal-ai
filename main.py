from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import requests
import mysql.connector
from datetime import datetime

# MYSQL CONNECTION
db = mysql.connector.connect(
    host="localhost",
    user="root",
    password="Siddhu*2006",
    database="personal_ai"
)

cursor = db.cursor()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ChatRequest(BaseModel):
    message: str

@app.get("/")
def home():
    return {
        "message": "Personal AI Running"
    }

@app.post("/chat")
def chat(request: ChatRequest):

    # Load recent memory
    cursor.execute("""
        SELECT user_message, ai_response
        FROM memory
        ORDER BY id DESC
        LIMIT 5
    """)

    rows = cursor.fetchall()

    memory_text = ""

    for row in rows:
        memory_text += f"""
User: {row[0]}
AI: {row[1]}
"""

    # System prompt
    system_prompt = f"""
You are Siddhu's personal AI assistant.

Be smart, friendly, and conversational.

Remember previous conversations.

Today's date is:
{datetime.now().strftime("%d %B %Y")}
"""

    # Final prompt
    prompt = system_prompt + "\n" + memory_text + f"\nUser: {request.message}"

    # Ask Ollama
    response = requests.post(
        "http://localhost:11434/api/generate",
        json={
            "model": "phi3",
            "prompt": prompt,
            "stream": False
        }
    )

    data = response.json()

    ai_response = data["response"]

    # Save memory
    sql = """
        INSERT INTO memory
        (user_message, ai_response)
        VALUES (%s, %s)
    """

    values = (request.message, ai_response)

    cursor.execute(sql, values)

    db.commit()

    return {
        "response": ai_response
    }