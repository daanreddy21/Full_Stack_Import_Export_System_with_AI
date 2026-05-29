from apscheduler.schedulers.background import BackgroundScheduler
from routes.payment_routes import (
    check_overdue_payments
)
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database.db import Base, engine
from routes.auth_routes import router as auth_router
from routes.document_routes import router as document_router
from models.document_model import Document
from routes.duty_routes import router as duty_router
from routes.chatbot_routes import router as chatbot_router
from routes.payment_routes import router as payment_router
from routes.risk_routes import router as risk_router
from routes.shipment_routes import router as shipment_router
from routes.dashboard_routes import router as dashboard_router
from routes.shipment_routes import (router as shipment_router)
from routes.insight_routes import router as insight_router
from models.ai_insight_model import AIInsight
from routes.country_analytics_routes import router as country_analytics_router
from routes.notification_routes import router as notification_router
from models.customs_tax_rules_model import *
from models.country_master_model import *
from models.required_documents_model import *
from models.restricted_products_model import *
from models.trade_agreements_model import *
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.gzip import GZipMiddleware
from utils.notification_scheduler import start_notification_scheduler
app = FastAPI()
@app.on_event("startup")
def startup_event():
    start_notification_scheduler()
Base.metadata.create_all(bind=engine)

app.add_middleware(CORSMiddleware,
                   allow_origins=["*"],allow_credentials=True,allow_methods=["*"],allow_headers=["*"],)
app.add_middleware(
    GZipMiddleware,
    minimum_size=1000
)
app.include_router(auth_router)
app.include_router(document_router)
app.include_router(duty_router)
app.include_router(chatbot_router)
app.include_router(payment_router)
app.include_router(risk_router)
app.include_router(shipment_router)
app.include_router(dashboard_router)
app.include_router(insight_router)
app.include_router(country_analytics_router)
app.include_router(notification_router)
app.mount("/uploads",StaticFiles(directory="uploads"),name="uploads")
@app.get("/")
def home():
    return {
        "message": "Auth Service Running"
    }
active_connections = []
