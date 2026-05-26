from fastapi import APIRouter
from sqlalchemy.orm import Session
from database.db import SessionLocal
from models.payment_model import Payment
from models.risk_model import RiskAnalysis
from datetime import date
from utils.ai_risk_engine import (
    generate_risk_analysis
)
router = APIRouter()
@router.post("/api/generate-risk-analysis")
def generate_risk_report():
    db: Session = SessionLocal()
    try:
        payments = db.query(
            Payment
        ).all()
        buyer_map = {}
        today = date.today()
        for payment in payments:
            buyer = payment.buyer_name
            if not buyer:
                continue
            if buyer not in buyer_map:
                buyer_map[buyer] = {
                    "buyer_name": buyer,
                    "country": payment.destination_country,
                    "hsn_code": payment.hsn_code,
                    "product": payment.product,
                    "category": payment.category,
                    "quantity": 0,
                    "unit_price": 0,
                    "pending_payments": 0,
                    "overdue_payments": 0,
                    "total_pending_amount": 0,
                    "total_pending_usd": 0,
                    "risk_score": 0
                }
            if payment.payment_status == "Pending":
                buyer_map[buyer][
                    "pending_payments"
                ] += 1
                buyer_map[buyer][
                    "total_pending_amount"
                ] += float(payment.final_total_usd or 0)
                buyer_map[buyer][
                    "risk_score"
                ] += 10
                buyer_map[buyer]["quantity"] += 1
                buyer_map[buyer]["unit_price"] = (
                    float(payment.final_total_usd or 0)
                )
                if payment.due_date:
                    overdue_days = (
                        today - payment.due_date
                    ).days
                    if overdue_days > 0:
                        buyer_map[buyer][
                            "overdue_payments"
                        ] += 1
                        buyer_map[buyer][
                            "risk_score"
                        ] += overdue_days
        db.query(RiskAnalysis).delete()
        result = []
        for buyer in buyer_map.values():
            ai_result = generate_risk_analysis(
                buyer["buyer_name"],
                buyer["pending_payments"],
                buyer["overdue_payments"],
                buyer["risk_score"],
                buyer["total_pending_amount"]
            )
            recommendation = ai_result.get(
                "recommendation",
                "Manual review recommended"
            )
            if isinstance(recommendation, dict):
                recommendation = (
                    recommendation.get("maintain")
                    or str(recommendation)
                )
            risk = RiskAnalysis(
                buyer_name= buyer["buyer_name"],
                country= buyer["country"],
                hsn_code= buyer["hsn_code"],
                product= buyer["product"],
                category= buyer["category"],
                quantity= buyer["quantity"],
                unit_price= buyer["unit_price"],
                pending_payments= buyer["pending_payments"],
                overdue_payments= buyer["overdue_payments"],
                total_pending_amount= buyer["total_pending_amount"],
                shipment_risk=0,
                client_risk= ai_result["risk_score"],
                final_risk= ai_result["risk_score"],
                risk_level= ai_result["risk_level"],
                risk_reasons= ai_result["risk_reasons"],
                recommendation= recommendation
            )
            db.add(risk)
            result.append({
                "buyer_name": buyer["buyer_name"],
                "pending_payments": buyer["pending_payments"],
                "overdue_payments": buyer["overdue_payments"],
                "total_pending_amount": buyer["total_pending_amount"],
                "risk_score": ai_result["risk_score"],
                "risk_level": ai_result["risk_level"],
                "risk_reasons": ai_result["risk_reasons"],
                "recommendation": ai_result["recommendation"]
            })
        
        db.commit()
        return {
            "message":
                "AI Risk Analysis Generated",
            "data":
                result
        }
    finally:
        db.close()
@router.get("/api/risk-analysis-history")
def get_risk_history():
    db: Session = SessionLocal()
    try:
        risks = db.query(
            RiskAnalysis
        ).order_by(
            RiskAnalysis.id.desc()
        ).all()
        return risks
    finally:
        db.close()