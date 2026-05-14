from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from pydantic import BaseModel

import requests
import mysql.connector

# =========================
# FASTAPI APP
# =========================

app = FastAPI()

# =========================
# CORS
# =========================

app.add_middleware(

    CORSMiddleware,

    allow_origins=["*"],

    allow_credentials=True,

    allow_methods=["*"],

    allow_headers=["*"],
)

# =========================
# MYSQL CONNECTION
# =========================

db = mysql.connector.connect(

    host="localhost",

    user="root",

    password="Siddhu*2006",

    database="personal_ai"
)

cursor = db.cursor()

# =========================
# REQUEST MODEL
# =========================

class ChatRequest(BaseModel):

    message: str

# =========================
# CHAT ENDPOINT
# =========================

@app.post("/chat")

def chat(request: ChatRequest):

    user_message = request.message

    # =========================
    # SAVE USER MESSAGE
    # =========================

    cursor.execute(

        """
        INSERT INTO memory
        (message, role)

        VALUES
        (%s, %s)
        """,

        (
            user_message,
            "user"
        )
    )

    db.commit()

    # =========================
    # OLLAMA REQUEST
    # =========================

    response = requests.post(

        "http://localhost:11434/api/generate",

        json={

            "model": "llama3",

            "prompt": user_message,

            "stream": False
        }
    )

    data = response.json()

    ai_response = data["response"]

    # =========================
    # SAVE AI RESPONSE
    # =========================

    cursor.execute(

        """
        INSERT INTO memory
        (message, role)

        VALUES
        (%s, %s)
        """,

        (
            ai_response,
            "assistant"
        )
    )

    db.commit()

    # =========================
    # RETURN RESPONSE
    # =========================

    return {

        "response": ai_response
    }