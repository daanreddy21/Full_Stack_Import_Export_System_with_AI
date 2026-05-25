from fastapi import APIRouter
from sqlalchemy.orm import Session
from database.db import SessionLocal
from models.notification_model import Notification
router = APIRouter()
@router.get("/api/notifications")
def get_notifications():
    db: Session = SessionLocal()
    try:
        notifications = db.query(
            Notification
        ).order_by(
            Notification.created_at.desc()
        ).all()
        return notifications
    finally:
        db.close()
@router.put("/api/mark-notification-read/{id}")
def mark_notification_read(id: int):
    db: Session = SessionLocal()
    try:
        notification = db.query( Notification).filter( Notification.id == id ).first()
        if notification:
            notification.is_read = True
            db.commit()
        return {"message":"Notification Updated"}
    finally:
        db.close()
