import os
from fastapi import APIRouter
from pydantic import BaseModel
from dotenv import load_dotenv
from groq import Groq

load_dotenv()
client = Groq()

router = APIRouter()

class PromptRequest(BaseModel):
    user_input: str

@router.post("/generate-code")
def generate_code(request: PromptRequest):
    chat_history = [
        {
            "role": "system",
            "content": (
                "You are a Python programmer tasked with generating high quality Python code. "
                "Your task is to generate the best content possible for the user's request. If the user provides critique, "
                "respond with a revised version of your previous attempt."
            )
        },
        {"role": "user", "content": request.user_input}
    ]

    try:
        response = client.chat.completions.create(
            messages=chat_history,
            model="llama3-70b-8192"
        )
        result = response.choices[0].message.content
        return {"output": result}
    except Exception as e:
        return {"error": str(e)}
