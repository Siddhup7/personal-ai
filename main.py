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

client = Groq(
    api_key=os.environ.get("GROQ_API_KEY")
)

class Message(BaseModel):
    message: str

@app.get("/")
def home():
    return {
        "message": "Brain AI Running"
    }

@app.post("/chat")
async def chat(data: Message):

    user_message = data.message

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

    return {
        "response": ai_reply
    }