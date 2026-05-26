from fastapi import APIRouter
from sqlalchemy.orm import Session
from database.db import SessionLocal
from models.payment_model import Payment
from models.document_model import Document
from models.payment_model import Payment
from datetime import (datetime, date)
from models.notification_model import Notification
router = APIRouter()
@router.get("/api/payments")
def get_payments():
    db: Session = SessionLocal()
    payments = db.query(
        Payment
    ).order_by(
        Payment.id.desc()
    ).all()
    result = []
    today = date.today()
    for payment in payments:
        overdue = False
        overdue_days = 0
        if (
            payment.payment_status == "Pending"
            and payment.due_date
        ):
            overdue_days = (
                today - payment.due_date
            ).days
            if overdue_days > 0:
                overdue = True
                if overdue_days > 3:
                    notification = Notification(
                        type="payment_risk",
                        title="Payment Collection Risk",
                        message=f"Payment overdue by {overdue_days} days. Inform finance department regarding overdue invoice payment.",
                        invoice_number=payment.invoice_number,
                        buyer_name=payment.buyer_name,
                        department="Finance"
                    )

                    db.add(notification)
        result.append({
            "id": payment.id,
            "invoice_number": payment.invoice_number,
            "buyer_name": payment.buyer_name,
            "hsn_code": payment.hsn_code,
            "product": payment.product,
            "category": payment.category,
            "destination_country": payment.destination_country,
            "origin_country": payment.origin_country,
            "final_total_usd":payment.final_total_usd,
            "final_total_local":payment.final_total_local,
            "destination_currency":payment.destination_currency,
            "due_date": payment.due_date,
            "payment_status": payment.payment_status,
            "paid_date": payment.paid_date,
            "overdue": overdue,
            "overdue_days": overdue_days
        })
    db.commit()
    return result
@router.post("/api/payments")
def create_payment(data: dict):
    db: Session = SessionLocal()
    document = db.query(
        Document
    ).filter(
        Document.hsn_code == data.get("hsn_code"),
        Document.product == data.get("product")
    ).first()
    invoice_number = ""
    buyer_name = ""
    if document:
        invoice_number = document.invoice_number
        buyer_name = document.buyer_name
    payment = Payment(
        invoice_number=invoice_number,
        buyer_name=buyer_name,
        hsn_code=data.get("hsn_code"),
        product=data.get("product"),
        category=data.get("category"),
        destination_country=data.get("destination_country"),
        origin_country=data.get("origin_country"),
        final_total_usd=data.get("final_total_usd"),
        final_total_local=data.get("final_total_local"),
        destination_currency=data.get("destination_currency"),
        due_date=data.get("due_date"),
        payment_status="Pending"
    )
    db.add(payment)
    db.commit()
    return {
        "message": "Payment Created"
    }
@router.put("/api/payments/pay/{payment_id}")
def mark_payment_paid( payment_id: int ):
    db: Session = SessionLocal()
    payment = db.query(Payment).filter(Payment.id == payment_id).first()
    if not payment:
        return {
            "message":"Payment Not Found"
        }
    payment.payment_status = "Paid"
    payment.paid_date = datetime.now()
    db.commit()
    return {
        "message":"Payment Completed"
    }