from fastapi import APIRouter
from sqlalchemy.orm import Session
from database.db import SessionLocal
from models.ai_insight_model import AIInsight
from utils.ai_insight_engine import (generate_ai_insights)
router = APIRouter()
@router.post("/api/generate-ai-insights")
def create_ai_insights():
    db: Session = SessionLocal()
    db.query(
        AIInsight
    ).delete()
    db.commit()
    insights = generate_ai_insights(db)
    for item in insights:
        insight = AIInsight(
            insight_type=item["type"],
            title=item["title"],
            content=item["content"]
        )
        db.add(insight)
    db.commit()
    return { 
        "message": "Insights Generated Successfully"
    }
@router.get("/api/ai-insights")
def get_ai_insights():
    db: Session = SessionLocal()
    insights = db.query(
        AIInsight
    ).order_by(
        AIInsight.id.desc()
    ).all()
    return insights