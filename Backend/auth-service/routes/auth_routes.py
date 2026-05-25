from fastapi import APIRouter, HTTPException
from sqlalchemy.orm import Session
from database.db import SessionLocal
from models.user_model import User
from schemas.user_schema import LoginSchema
router = APIRouter()
@router.post("/api/login")
def login(user: LoginSchema):
    db: Session = SessionLocal()
    try:
        db_user = db.query(User).filter( User.email == user.email,User.password == user.password).first()
        if not db_user:
            raise HTTPException( status_code=401, detail="Invalid Email or Password")
        return {
            "message": "Login Successful",
            "user": {
                "id": db_user.id,
                "name": db_user.name,
                "email": db_user.email,
                "role": db_user.role
            }
        }
    except:
        raise HTTPException( status_code=401, detail="Invalid Email or Password")
