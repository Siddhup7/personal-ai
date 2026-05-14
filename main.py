from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from groq import Groq
import os

# =========================
# GROQ CLIENT
# =========================

client = Groq(
    api_key=os.getenv("GROQ_API_KEY")
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

    response = client.chat.completions.create(

        model="llama3-8b-8192",

        messages=[

            {
                "role": "system",
                "content":
                "You are Brain AI, a smart and friendly AI assistant created by Siddhu."
            },

            {
                "role": "user",
                "content": request.message
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