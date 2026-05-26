from fastapi import APIRouter
from sqlalchemy.orm import Session
from sqlalchemy import func

from database.db import SessionLocal

from models.document_model import Document
from models.payment_model import Payment
from models.shipment_model import Shipment
from models.risk_model import RiskAnalysis
from models.duty_calculation_model import DutyCalculation

router = APIRouter()


@router.get("/api/dashboard-analytics")
def dashboard_analytics():

    db: Session = SessionLocal()

    try:

        total_documents = db.query(
            Document
        ).count()

        ocr_success = db.query(
            Document
        ).filter(
            Document.ocr_status == "Success"
        ).count()

        validation_passed = db.query(
            Document
        ).filter(
            Document.validation_status == "Passed"
        ).count()

        total_payments = db.query(
            Payment
        ).count()

        pending_payments = db.query(
            Payment
        ).filter(
            Payment.payment_status == "Pending"
        ).count()

        paid_payments = db.query(
            Payment
        ).filter(
            Payment.payment_status == "Paid"
        ).count()

        total_revenue = db.query(
            func.sum(
                Payment.final_total_usd
            )
        ).filter(
            Payment.payment_status == "Paid"
        ).scalar() or 0

        pending_amount = db.query(
            func.sum(
                Payment.final_total_usd
            )
        ).filter(
            Payment.payment_status == "Pending"
        ).scalar() or 0

        total_shipments = db.query(
            Shipment
        ).count()

        delivered_shipments = db.query(
            Shipment
        ).filter(
            Shipment.shipment_status == "Delivered"
        ).count()

        in_transit_shipments = db.query(
            Shipment
        ).filter(
            Shipment.shipment_status == "In Transit"
        ).count()

        delayed_shipments = db.query(
            Shipment
        ).filter(
            Shipment.is_delayed == True
        ).count()

        customs_holds = db.query(
            Shipment
        ).filter(
            Shipment.approval_status == "Hold"
        ).count()

        active_ports = db.query(
            Shipment.destination_port
        ).distinct().count()

        countries_trading = db.query(
            Shipment.destination_country
        ).distinct().count()

        average_delivery = 12

        compliance_rate = 92

        high_risk_clients = db.query(
            RiskAnalysis
        ).filter(
            RiskAnalysis.risk_level == "HIGH"
        ).count()

        shipment_risks = db.query(
            Shipment
        ).filter(
            Shipment.is_delayed == True
        ).count()

        risk_escalations = db.query(
            RiskAnalysis
        ).filter(
            RiskAnalysis.risk_level == "HIGH"
        ).count()

        total_duty_calculations = db.query(
            DutyCalculation
        ).count()

        recent_documents = db.query(
            Document
        ).order_by(
            Document.id.desc()
        ).limit(5).all()

        recent_shipments = db.query(
            Shipment
        ).order_by(
            Shipment.id.desc()
        ).limit(5).all()

        collection_rate = 0

        if total_payments > 0:

            collection_rate = round(
                (
                    paid_payments
                    /
                    total_payments
                ) * 100
            )

        return {

            "documents": {

                "total_documents":
                    total_documents,

                "ocr_success":
                    ocr_success,

                "validation_passed":
                    validation_passed
            },

            "payments": {

                "total_payments":
                    total_payments,

                "pending_payments":
                    pending_payments,

                "paid_payments":
                    paid_payments,

                "total_revenue":
                    float(total_revenue),

                "pending_amount":
                    float(pending_amount),

                "collection_rate":
                    collection_rate
            },

            "shipments": {

                "total_shipments":
                    total_shipments,

                "delivered_shipments":
                    delivered_shipments,

                "in_transit_shipments":
                    in_transit_shipments,

                "delayed_shipments":
                    delayed_shipments,

                "customs_holds":
                    customs_holds,

                "countries_trading":
                    countries_trading,

                "active_ports":
                    active_ports,

                "average_delivery":
                    average_delivery
            },

            "risk": {

                "high_risk_clients":
                high_risk_clients,

                "risk_escalations":
                (
                    high_risk_clients
                    + shipment_risks
                ),

                "compliance_rate":
                compliance_rate
            },

            "duty": {

                "total_duty_calculations":
                    total_duty_calculations
            },

            "recent_documents": [

                {

                    "file_name":
                        item.file_name,

                    "buyer_name":
                        item.buyer_name,

                    "product":
                        item.product

                }

                for item in recent_documents
            ],

            "recent_shipments": [

                {

                    "tracking_id":
                        item.tracking_id,

                    "buyer_name":
                        item.buyer_name,

                    "status":
                        item.shipment_status,

                    "origin_country":
                        item.origin_country,

                    "destination_country":
                        item.destination_country,

                    "origin_port":
                        item.origin_port,

                    "destination_port":
                        item.destination_port

                }

                for item in recent_shipments
            ]
        }

    finally:

        db.close()

