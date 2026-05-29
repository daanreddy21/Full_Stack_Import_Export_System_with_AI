from models.duty_calculation_model import DutyCalculation
from fastapi import APIRouter
from sqlalchemy.orm import Session
from database.db import SessionLocal
from models.payment_model import Payment
from models.shipment_model import Shipment
from models.risk_model import RiskAnalysis
router = APIRouter()
@router.get("/api/country-analytics")
def get_country_analytics():
    db: Session = SessionLocal()
    try:
        payments = db.query( Payment).all()
        shipments = db.query(Shipment).all()
        duties = db.query(DutyCalculation).all()
        risks = db.query(RiskAnalysis).all()
        country_map = {}
        total_revenue = 0
        total_pending = 0
        total_clients = set()
        delayed_shipments = 0
        delivered_shipments = 0
        high_risk_clients = 0
        for payment in payments:
            country = (
                payment.destination_country
                or "Unknown"
            ).strip().title()
            if country not in country_map:
                country_map[country] = {
                    "country": country,
                    "revenue": 0,
                    "pending": 0,
                    "clients": set(),
                    "risk_clients": [],
                    "delivered": 0,
                    "pending_shipments": 0,
                    "delayed": 0
                }
            country_map[country][ "clients" ].add( payment.buyer_name )
            total_clients.add( payment.buyer_name )
            if payment.payment_status == "Paid":
                country_map[country][
                    "revenue"
                ] += float(payment.final_total_usd)
                total_revenue += float(
                    payment.final_total_usd
                )
            else:
                country_map[country][ "pending" ] += float(
                    payment.final_total_usd
                )
                total_pending += float(
                    payment.final_total_usd
                )
        for duty in duties:
            country = (
                duty.destination_country
                or "Unknown"
            ).strip().title()
            if country not in country_map:
                country_map[country] = {
                    "country": country,
                    "revenue": 0,
                    "currency": duty.destination_currency,
                    "pending": 0,
                    "clients": set(),
                    "risk_clients": [],
                    "delivered": 0,
                    "pending_shipments": 0,
                    "delayed": 0
                }
            else:
                country_map[country]["currency"] = (
                    duty.destination_currency
                )
        for shipment in shipments:
            country = (
                shipment.destination_country
                or "Unknown"
            ).strip().title()
            if country not in country_map:
                country_map[country] = {
                    "country": country,
                    "revenue": 0,
                    "pending": 0,
                    "clients": set(),
                    "risk_clients": [],
                    "delivered": 0,
                    "pending_shipments": 0,
                    "delayed": 0
                }
            if shipment.shipment_status == "Delivered":
                country_map[country][ "delivered" ] += 1 
                delivered_shipments += 1
            else:
                country_map[country][ "pending_shipments" ] += 1
            if shipment.is_delayed:
                country_map[country][ "delayed" ] += 1
                delayed_shipments += 1
        for risk in risks:
            country = ( risk.country or "Unknown" ).strip().title()
            if country not in country_map:
                country_map[country] = {
                    "country": country,
                    "revenue": 0,
                    "pending": 0,
                    "clients": set(),
                    "risk_clients": [],
                    "delivered": 0,
                    "pending_shipments": 0,
                    "delayed": 0
                }
            country_map[country][ "risk_clients" ].append({
                "buyer_name": risk.buyer_name,
                "risk_level": risk.risk_level,
                "risk_reasons": risk.risk_reasons,
                "recommendation": risk.recommendation
            })
            if risk.risk_level == "HIGH":
                high_risk_clients += 1
        countries = []
        for country_data in country_map.values():
            country_data[ "clients" ] = len( country_data[ "clients" ] )
            countries.append(country_data)
        return {
            "summary": {
                "total_revenue": total_revenue,
                "total_pending": total_pending,
                "total_countries": len(country_map),
                "total_clients": len(total_clients),
                "delayed_shipments": delayed_shipments,
                "delivered_shipments": delivered_shipments, 
                "high_risk_clients": high_risk_clients
            },
            "countries": countries
        }
    finally:
        db.close()
@router.get("/api/country-details/{country}")
def get_country_details(country: str):
    db: Session = SessionLocal()

    try:
        shipments = db.query(
            Shipment
        ).filter(
            Shipment.destination_country == country
        ).all()

        payments = db.query(
            Payment
        ).filter(
            Payment.destination_country == country
        ).all()

        risks = db.query(
            RiskAnalysis
        ).filter(
            RiskAnalysis.country == country
        ).all()

        return {
            "country": country,
            "shipments": [
                {
                    "id": s.id,
                    "tracking_id": s.tracking_id,
                    "buyer_name": s.buyer_name,
                    "shipment_status": s.shipment_status,
                    "is_delayed": s.is_delayed,
                    "invoice_number": s.invoice_number
                }
                for s in shipments
            ],
            "payments": [
                {
                    "invoice_number": p.invoice_number,
                    "buyer_name": p.buyer_name,
                    "status": p.payment_status,
                    "amount": p.final_total_usd
                }
                for p in payments
            ],
            "risks": [
                {
                    "buyer_name": r.buyer_name,
                    "risk_level": r.risk_level
                }
                for r in risks
            ]
        }

    finally:
        db.close()