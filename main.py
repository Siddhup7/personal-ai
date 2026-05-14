from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from groq import Groq
import os

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

client = Groq(
    api_key=os.environ.get("GROQ_API_KEY")
)

@app.get("/")
def home():
    return {"message": "Brain AI Running"}

@app.post("/chat")
def chat(request: ChatRequest):

    completion = client.chat.completions.create(
        model="llama3-8b-8192",
        messages=[
            {
                "role": "system",
                "content": "You are Brain AI created by Siddhu."
            },
            {
                "role": "user",
                "content": request.message
            }
        ]
    )

    reply = completion.choices[0].message.content

    return {
        "response": reply
    }