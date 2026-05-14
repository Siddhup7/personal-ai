from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from openai import OpenAI
import os

# =========================
# OPENAI CLIENT
# =========================

client = OpenAI(
    api_key=os.getenv("OPENAI_API_KEY")
)

# =========================
# FASTAPI
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

    response = client.chat.completions.create(
        model="gpt-4.1-mini",
        messages=[
            {
                "role": "system",
                "content": "You are Brain AI, a smart and friendly AI assistant created by Siddhu."
            },
            {
                "role": "user",
                "content": user_message
            }
        ]
    )

    ai_reply = response.choices[0].message.content

    return {
        "response": ai_reply
    }

# =========================
# ROOT
# =========================

@app.get("/")
def home():
    return {
        "message": "Brain AI Backend Running"
    }