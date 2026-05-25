from fastapi import APIRouter

from groq import Groq

from dotenv import load_dotenv

import os


load_dotenv()


router = APIRouter()


client = Groq(

    api_key=os.getenv(
        "GROQ_API_KEY"
    )

)


SOFTWARE_KNOWLEDGE = {

    "document": """
    Document module allows users to upload invoices and trade documents.

    Workflow:
    1. User uploads PDF
    2. OCR engine extracts raw text
    3. AI extraction engine extracts invoice details
    4. Validation engine checks errors
    5. Data stored in PostgreSQL
    6. User can view document details
    """,

    "ocr": """
    OCR engine uses PyMuPDF to extract text from uploaded PDF invoices.

    Raw invoice text is passed to AI extraction engine.
    """,

    "ai extraction": """
    AI extraction engine extracts:
    - invoice number
    - buyer name
    - seller name
    - country
    - product
    - HSN code
    - quantity
    - price
    """,

    "validation": """
    Validation engine checks:
    - missing invoice number
    - missing buyer name
    - missing seller name
    - invalid quantity
    - invalid price
    """,

    "hsn": """
    HSN module manages product classification.

    Features:
    - HSN search
    - Product mapping
    - Category mapping
    - Product intelligence
    """,

    "duty": """
    Duty calculation workflow:

    1. User selects country
    2. User selects HSN code
    3. AI predicts tax rules
    4. System calculates:
       - duty
       - GST
       - shipping
       - insurance
       - landed cost
    5. User can save calculation history
    """,

    "shipment": """
    Shipment module handles:
    - shipment tracking
    - logistics status
    - delivery workflow
    - shipment monitoring
    """,

    "analytics": """
    Analytics module provides:
    - trade analytics
    - tax trends
    - country insights
    - shipment reports
    """,

    "risk": """
    Risk analysis module detects:
    - risky shipments
    - compliance issues
    - suspicious trade activities
    """
}


ALLOWED_KEYWORDS = [

    "document",
    "upload",
    "invoice",
    "ocr",
    "ai",
    "extraction",
    "validation",
    "hsn",
    "tax",
    "duty",
    "shipment",
    "analytics",
    "risk",
    "dashboard",
    "gst",
    "product",
    "country",
    "bill",
    "history",
    "software",
    "workflow",
    "module"
]


def find_software_context(user_message):

    user_message = user_message.lower()

    for key, value in SOFTWARE_KNOWLEDGE.items():

        if key in user_message:

            return value

    return None


@router.post("/api/chat")
def chat(data: dict):

    user_message = data.get(
        "message",
        ""
    )

    is_allowed = any(

        keyword in user_message.lower()

        for keyword in ALLOWED_KEYWORDS

    )

    if not is_allowed:

        return {

            "reply":
            "I can only answer questions related to the Import Export AI software."

        }

    context = find_software_context(
        user_message
    )
    if not context:
        context = """
        This software is an AI-powered Import Export Management System.
        Modules:
        - Documents
        - OCR
        - AI extraction
        - Validation
        - HSN
        - Duty calculation
        - Analytics
        - Shipment tracking
        - Risk analysis
        """
    prompt = f"""
    You are Import Export AI Assistant.
    Answer ONLY software-related questions.
    Software Knowledge:
    {context}
    User Question:
    {user_message}
    Rules:
    - Answer clearly
    - Keep answers professional
    - Explain workflows if asked
    - Reject unrelated topics
    - Keep responses short and fast
    """
    response = client.chat.completions.create(
        model="llama-3.1-8b-instant",
        messages=[
            {
                "role": "system",
                "content":  
                "You are an Import Export AI software assistant."
            },
            {
                "role": "user",
                "content": prompt
            }
        ],
        temperature=0.2,
        max_tokens=300
    )
    reply = response.choices[0].message.content
    return {
        "reply": reply
    }