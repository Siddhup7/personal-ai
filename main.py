from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from groq import Groq
import os

app = FastAPI()

# CORS FIX

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# GROQ CLIENT

client = Groq(
    api_key=os.environ.get("GROQ_API_KEY")
)

# REQUEST MODEL

class ChatRequest(BaseModel):
    message: str

# HOME ROUTE

@app.get("/")
def home():
    return {
        "message": "Brain AI Running"
    }

# CHAT ROUTE

@app.post("/chat")
async def chat(request: ChatRequest):

    user_message = request.message

    completion = client.chat.completions.create(
        model="llama3-8b-8192",

        messages=[
            {
                "role": "user",
                "content": user_message
            }
        ]
    )

    ai_reply = completion.choices[0].message.content

    return ai_reply