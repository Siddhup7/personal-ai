from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from groq import Groq
import os

app = FastAPI()

# VERY IMPORTANT CORS
origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# GROQ CLIENT
client = Groq(
    api_key=os.environ.get("GROQ_API_KEY")
)

# MODEL
class Message(BaseModel):
    message: str

# HOME
@app.get("/")
def home():
    return {
        "message": "Brain AI Running"
    }

# CHAT
@app.post("/chat")
async def chat(data: Message):

    try:

        completion = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {
                    "role": "user",
                    "content": data.message
                }
            ]
        )

        reply = completion.choices[0].message.content

        return {
            "response": reply
        }

    except Exception as e:

        return {
            "response": str(e)
        }