from fastapi import APIRouter
from sqlalchemy.orm import Session
from database.db import SessionLocal
from models.shipment_model import Shipment
from utils.ports_data import PORTS
from utils.shipment_ai_engine import (analyze_shipment_ai)
import random
from datetime import date
from models.notification_model import Notification
router = APIRouter()
@router.get("/api/ports/{country}")
def get_ports(country: str):
    return {
        "ports":
        PORTS.get(country, [])
    }
@router.post("/api/analyze-shipment")
def analyze_shipment(data: dict):
    result = analyze_shipment_ai(data)
    return result
@router.post("/api/create-shipment")
def create_shipment(data: dict):
    db: Session = SessionLocal()
    try:
        tracking_id = (
            "TRK-" +
            str(random.randint(100000, 999999))
        )
        shipment = Shipment(
            tracking_id=tracking_id,
            invoice_number= data.get("invoice_number"),
            buyer_name= data.get("buyer_name"),
            origin_country=data.get("origin_country"),
            destination_country=data.get("destination_country"),
            hsn_code= data.get("hsn_code"),
            product= data.get("product"),
            shipment_value= data.get("shipment_value"),
            shipping_company= data.get("shipping_company"),
            container_number= data.get("container_number"),
            origin_port= data.get("origin_port"),
            destination_port= data.get("destination_port"),
            transport_mode= data.get("transport_mode"),
            estimated_delivery= data.get("estimated_delivery"),
            remarks= data.get("remarks"),
            shipment_status="Processing",
            approval_status="Pending"   
        )
        db.add(shipment)
        db.commit()
        return {
            "message": "Shipment Created",
            "tracking_id": tracking_id
        }
    finally:
        db.close()
@router.get("/api/shipments")
def get_shipments():
    db: Session = SessionLocal()
    try:
        shipments = db.query(
            Shipment
        ).order_by(
            Shipment.id.desc()
        ).all()
        today = date.today()
        for shipment in shipments:
            if (
                shipment.shipment_status != "Delivered"
                and shipment.estimated_delivery
            ):
                delay = (
                    today - shipment.estimated_delivery
                ).days
                if delay > 3:
                    shipment.is_delayed = True
                    shipment.delay_days = delay
                    existing_notification = db.query(
                        Notification
                    ).filter(
                        Notification.tracking_id == shipment.tracking_id,
                        Notification.type == "shipment_delay"
                    ).first()
                    if not existing_notification:
                        notification = Notification(
                            type="shipment_delay",
                            title="Shipment Delay Risk",
                            message=
                            "Inform customs duty department to resolve shipment clearance issue.",
                            invoice_number=shipment.invoice_number,
                            buyer_name=shipment.buyer_name,
                            tracking_id=shipment.tracking_id,
                            department="Customs"
                        )
                        db.add(notification)
                        db.commit()
                else:
                    shipment.is_delayed = False
                    shipment.delay_days = 0
        db.commit()
        result = []
        for shipment in shipments:
            result.append({
                "id": shipment.id,
                "tracking_id": shipment.tracking_id,
                "invoice_number": shipment.invoice_number,
                "buyer_name": shipment.buyer_name,
                "country": shipment.country,
                "origin_country":shipment.origin_country,
                "destination_country":shipment.destination_country,
                "hsn_code": shipment.hsn_code,
                "product": shipment.product,
                "shipment_value": float(
                    shipment.shipment_value
                ) if shipment.shipment_value else 0,
                "shipping_company": shipment.shipping_company,
                "container_number": shipment.container_number,
                "origin_port": shipment.origin_port,
                "destination_port": shipment.destination_port,
                "transport_mode": shipment.transport_mode,
                "shipment_status": shipment.shipment_status,
                "estimated_delivery":shipment.estimated_delivery,
                "actual_delivery":shipment.actual_delivery,
                "delay_days":shipment.delay_days,
                "is_delayed":shipment.is_delayed,
                "approval_status":shipment.approval_status,
                "approved_by":shipment.approved_by,
                "approved_at":shipment.approved_at,
                "hold_reason":shipment.hold_reason,
                "remarks":shipment.remarks
            })
        return result
    finally:
        db.close()
@router.put("/api/update-shipment-status/{shipment_id}")
def update_shipment_status(
    shipment_id: int,
    data: dict
):
    db: Session = SessionLocal()
    try:
        shipment = db.query(
            Shipment
        ).filter(
            Shipment.id == shipment_id
        ).first()
        if not shipment:
            return {
                "message":
                    "Shipment Not Found"
            }
        shipment.shipment_status = data.get(
            "shipment_status"
        )
        db.commit()
        return {
            "message":
                "Shipment Updated"
        }
    finally:
        db.close()
@router.put("/api/deliver-shipment/{shipment_id}")
def deliver_shipment(shipment_id: int):
    db: Session = SessionLocal()
    try:
        shipment = db.query(
            Shipment
        ).filter(
            Shipment.id == shipment_id
        ).first()
        if not shipment:
            return {
                "message":
                    "Shipment Not Found"
            }
        shipment.shipment_status = "Delivered"
        shipment.actual_delivery = date.today()
        shipment.is_delayed = False
        shipment.delay_days = 0
        db.commit()
        return {
            "message":
                "Shipment Delivered Successfully"
        }
    finally:
        db.close()
@router.put("/api/approve-shipment/{shipment_id}")
def approve_shipment(
    shipment_id: int,
    data: dict
):
    db: Session = SessionLocal()
    try:
        shipment = db.query(
            Shipment
        ).filter(
            Shipment.id == shipment_id
        ).first()
        if not shipment:
            return {"message":"Shipment Not Found"}
        from datetime import datetime
        shipment.approval_status = "Approved"
        shipment.approved_by = data.get(
            "manager_name"
        )
        shipment.approved_at = datetime.now()
        db.commit()
        return {"message":"Shipment Approved"}
    finally:
        db.close()
@router.put("/api/hold-shipment/{shipment_id}")
def hold_shipment(shipment_id: int, data: dict):
    db: Session = SessionLocal()
    try:
        shipment = db.query(Shipment).filter(
            Shipment.id == shipment_id
        ).first()
        if not shipment:
            return {"message": "Shipment Not Found"}
        shipment.approval_status = "Hold"
        shipment.hold_reason = data.get("reason")
        db.commit()
        return {"message": "Shipment Put On Hold"}
    finally:
        db.close()