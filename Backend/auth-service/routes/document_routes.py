import os
import shutil
from fastapi import APIRouter, UploadFile, File
from sqlalchemy.orm import Session
from database.db import SessionLocal
from models.document_model import Document
from utils.ocr_engine import extract_text_from_pdf
from utils.ai_extraction_engine import extract_invoice_ai
from utils.validation_engine import validate_invoice_data   
router = APIRouter()
UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
@router.post("/api/documents/upload")
async def upload_document(file: UploadFile = File(...)):
    file_path = f"{UPLOAD_FOLDER}/{file.filename}"
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    text = extract_text_from_pdf(file_path)
    print("\n========== RAW OCR TEXT ==========\n")
    print(text)
    print("\n=================================\n")
    data = extract_invoice_ai(text)
    print("\n========== INVOICE DATA ==========\n")
    print(data)
    print("\n=================================\n")
    validation_result = validate_invoice_data(data)
    print(validation_result)
    db: Session = SessionLocal()
    new_document = Document(
        file_name=file.filename,
        file_path=file_path,
        ocr_status="Success",
        validation_status=validation_result["status"],
        raw_text=text,
        invoice_number=data.get("invoice_number"),
        buyer_name=data.get("buyer_name"),
        seller_name=data.get("seller_name"),
        country=data.get("country"),
        product=data.get("product"),
        category=data.get("category"),
        hsn_code=data.get("hsn_code"),
        quantity=data.get("quantity"),
        currency=data.get("currency"),
        unit_price=data.get("unit_price"),
        total_amount=data.get("total_amount")
    )
    db.add(new_document)
    db.commit()
    db.refresh(new_document)
    new_document.product_code = (
        f"PROD-{new_document.id:03d}"
    )
    db.commit()
    return {
        "message": "Document Uploaded Successfully",
        "validation_result": validation_result,
        "data": data
    }
@router.get("/api/documents")
def get_documents():
    db: Session = SessionLocal()
    documents = db.query(Document).all()
    return documents
@router.get("/api/documents/stats")
def get_document_stats():
    db: Session = SessionLocal()
    total_documents = db.query(Document).count()
    ocr_success_count = db.query(Document).filter(
        Document.ocr_status == "Success"
    ).count()
    validation_passed_count = db.query(Document).filter(
        Document.validation_status == "Passed"
    ).count()
    ocr_percentage = 0
    validation_percentage = 0
    if total_documents > 0:
        ocr_percentage = int(
            (ocr_success_count / total_documents) * 100
        )
        validation_percentage = int(
            (validation_passed_count / total_documents) * 100
        )
    return {
        "total_uploads": total_documents,
        "ocr_success": ocr_percentage,
        "validation_passed": validation_percentage
    }
@router.get("/api/documents/{document_id}")
def get_document(document_id):
    db: Session = SessionLocal()
    document = db.query(Document).filter(Document.id == document_id).first()
    if not document:
        return {"message": "Document Not Found"}
    return document
@router.get("/api/document-by-hsn/{hsn_code}")
def get_document_by_hsn(hsn_code: str):
    db: Session = SessionLocal()
    document = db.query(
        Document
    ).filter(
        Document.hsn_code == hsn_code
    ).first()
    if not document:
        return {}
    return {
        "invoice_number": document.invoice_number,
        "buyer_name": document.buyer_name,
        "seller_name": document.seller_name,
        "country": document.country,
        "product": document.product,
        "category": document.category,
        "quantity": document.quantity,
        "currency": document.currency,
        "unit_price": document.unit_price,
        "total_amount": document.total_amount,
        "hsn_code": document.hsn_code
    }