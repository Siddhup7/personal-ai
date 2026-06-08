from fastapi import (
    FastAPI,
    UploadFile,
    File
)

from fastapi.middleware.cors import (
    CORSMiddleware
)

from pydantic import BaseModel

from groq import Groq

from pypdf import PdfReader

from docx import Document

import tempfile
import os

# MEMORY IMPORTS

from memory import (
    save_conversation,
    load_recent_conversations,
    save_profile_memory,
    load_profile_memory
)

app = FastAPI()

# =========================
# CORS
# =========================

origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# =========================
# GROQ CLIENT
# =========================

client = Groq(
    api_key=os.environ.get(
        "GROQ_API_KEY"
    )
)

# =========================
# REQUEST MODEL
# =========================

class Message(BaseModel):

    message: str

# =========================
# HOME
# =========================

@app.get("/")
def home():

    return {
        "message":
        "Brain AI Running"
    }

# =========================
# CHAT
# =========================

@app.post("/chat")
async def chat(data: Message):

    try:

        user_message =
        data.message

        # SAVE PROFILE MEMORY

        save_profile_memory(
            user_message
        )

        # LOAD MEMORY

        profile_memory =
        load_profile_memory()

        recent_conversations = (
            load_recent_conversations()
        )

        # SYSTEM PROMPT

        system_prompt = f"""

You are Siddhu's personal AI assistant.

Profile Memory:
{profile_memory}

Recent Conversations:
{recent_conversations}

Speak naturally and intelligently.
"""

        # AI RESPONSE

        completion = (
            client.chat.completions.create(

                model=
                "llama-3.3-70b-versatile",

                messages=[

                    {
                        "role":
                        "system",

                        "content":
                        system_prompt
                    },

                    {
                        "role":
                        "user",

                        "content":
                        user_message
                    }
                ]
            )
        )

        reply = (
            completion
            .choices[0]
            .message.content
        )

        # SAVE CONVERSATION

        save_conversation(
            user_message,
            reply
        )

        return {
            "response":
            reply
        }

    except Exception as e:

        return {
            "response":
            str(e)
        }

# =========================
# FILE UPLOAD
# =========================

@app.post("/upload")
async def upload_file(
    file: UploadFile = File(...)
):

    try:

        text = ""

        # TXT

        if file.filename.endswith(
            ".txt"
        ):

            content =
            await file.read()

            text = content.decode(
                "utf-8"
            )

        # PDF

        elif file.filename.endswith(
            ".pdf"
        ):

            with tempfile.NamedTemporaryFile(
                delete=False,
                suffix=".pdf"
            ) as temp:

                temp.write(
                    await file.read()
                )

                temp_path =
                temp.name

            reader =
            PdfReader(temp_path)

            for page in (
                reader.pages
            ):

                page_text = (
                    page.extract_text()
                )

                if page_text:

                    text += (
                        page_text
                        + "\n"
                    )

        # DOCX

        elif file.filename.endswith(
            ".docx"
        ):

            with tempfile.NamedTemporaryFile(
                delete=False,
                suffix=".docx"
            ) as temp:

                temp.write(
                    await file.read()
                )

                temp_path =
                temp.name

            doc =
            Document(temp_path)

            for para in (
                doc.paragraphs
            ):

                text += (
                    para.text
                    + "\n"
                )

        else:

            return {

                "error":

                "Only PDF, DOCX and TXT files are supported."
            }

        return {

            "filename":
            file.filename,

            "content":
            text[:20000]
        }

    except Exception as e:

        return {

            "error":
            str(e)
        }