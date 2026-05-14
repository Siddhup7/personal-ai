from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

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

    return {

        "response":

        f"Brain AI received: {user_message}"
    }

# =========================
# ROOT
# =========================

@app.get("/")

def home():

    return {

        "message":

        "Brain AI Backend Running"
    }