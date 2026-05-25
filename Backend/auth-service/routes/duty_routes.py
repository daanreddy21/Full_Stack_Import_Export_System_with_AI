import os
from fastapi import (UploadFile,File)
from fastapi import APIRouter
from sqlalchemy.orm import Session
from database.db import SessionLocal
from models.document_model import Document
from models.duty_calculation_model import (DutyCalculation)
from models.customs_tax_rules_model import (CustomsTaxRule)
from models.trade_agreements_model import (TradeAgreement)
from models.required_documents_model import (RequiredDocument)
from utils.customs_engine import (calculate_customs_duty)
router = APIRouter()
UPLOAD_FOLDER = "uploads"
os.makedirs(
    UPLOAD_FOLDER,
    exist_ok=True
)
@router.post(
    "/upload-compliance-document/{id}"
)
def upload_compliance_document(
    id: int,
    file: UploadFile = File(...)
):
    db: Session = SessionLocal()
    try:
        record = db.query(
            DutyCalculation
        ).filter(
            DutyCalculation.id == id
        ).first()
        if not record:
            return {
                "message":
                "Record not found"
            }
        file_path = (
            f"{UPLOAD_FOLDER}/{file.filename}"
        )
        with open(
            file_path,
            "wb"
        ) as buffer:
            buffer.write(
                file.file.read()
            )
        record.uploaded_document = (
            file_path
        )
        record.document_uploaded = (
            "YES"
        )
        db.commit()
        return {
            "message":
            "Document uploaded successfully",
            "file_path":
            file_path
        }
    finally:
        db.close()
@router.put("/api/approve-compliance/{id}")
def approve_compliance(id: int):

    db: Session = SessionLocal()

    try:
        record = db.query(
            DutyCalculation
        ).filter(
            DutyCalculation.id == id
        ).first()

        if not record:

            return {
                "message":
                "Record not found"
            }

        record.compliance_status = (
            "APPROVED"
        )

        record.customs_hold_status = (
            "CLEAR"
        )

        record.missing_documents = (
            "No Missing Docs"
        )

        record.hold_reason = (
            "No Hold Reason"
        )

        db.commit()

        return {
            "message":
            "Compliance Approved"
        }

    finally:

        db.close()
@router.get("/api/hsn-codes")
def get_hsn_codes():
    db: Session = SessionLocal()
    try:
        hsn_codes = db.query(
            Document.hsn_code
        ).distinct().all()
        return [
            code[0]
            for code in hsn_codes
            if code[0]
        ]
    finally:
        db.close()
@router.get("/api/hsn-details/{hsn_code}")
def get_hsn_details(hsn_code: str):
    db: Session = SessionLocal()
    try:
        document = db.query(Document).filter(
            Document.hsn_code == hsn_code
        ).first()
        if not document:
            return {
                "message": "HSN Not Found"
            }
        return {
            "product": document.product,
            "category": document.category
        }
    finally:
        db.close()
@router.post("/api/calculate-duty")
def calculate_duty(data: dict):

    db: Session = SessionLocal()

    try:

        origin_country = data.get(
            "origin_country"
        )

        destination_country = data.get(
            "destination_country"
        )

        hsn_code = data.get(
            "hsn_code"
        )

        product = data.get(
            "product"
        )

        category = data.get(
            "category"
        )

        quantity = float(
            data.get("quantity", 0)
        )

        unit_price = float(
            data.get("product_price", 0)
        )

        shipment_mode = data.get(
            "shipment_mode"
        )

        incoterm = data.get(
            "incoterm"
        )

        rule = db.query(
            CustomsTaxRule
        ).filter(

            CustomsTaxRule.origin_country
            == origin_country,

            CustomsTaxRule.destination_country
            == destination_country,

            CustomsTaxRule.hsn_code.like(f"{hsn_code[:6]}%")

        ).first()

        if not rule:

            return {

                "message":
                "No customs tax rule found",

                "origin_country":
                origin_country,

                "destination_country":
                destination_country,

                "hsn_code":
                hsn_code
            }

        agreement = db.query(
            TradeAgreement
        ).filter(

            TradeAgreement.origin_country
            == origin_country,

            TradeAgreement.destination_country
            == destination_country,

            TradeAgreement.hsn_code
            == hsn_code

        ).first()

        if agreement:

            rule.basic_custom_duty = (
                agreement.reduced_duty
            )

        result = calculate_customs_duty(

            quantity,
            unit_price,
            rule
        )

        documents = db.query(
            RequiredDocument
        ).filter(

            RequiredDocument.destination_country
            == destination_country,

            RequiredDocument.hsn_code.like(
                f"{hsn_code[:4]}%"
            )

        ).all()

        missing_documents = [

            doc.required_document

            for doc in documents
        ]

        compliance_status = (

            "APPROVED"

            if len(missing_documents) == 0

            else

            "PENDING"

        )

        customs_hold_status = (

            "CLEAR"

            if len(missing_documents) == 0

            else

            "ON HOLD"

        )

        hold_reason = None

        if missing_documents:

            hold_reason = (

                "Mandatory compliance documents missing"

            )

        result.update({

            "origin_country":
                origin_country,

            "destination_country":
                destination_country,

            "hsn_code":
                hsn_code,

            "product":
                product,

            "category":
                category,

            "quantity":
                quantity,

            "shipment_mode":
                shipment_mode,

            "incoterm":
                incoterm,

            "trade_agreement":

                result.get(
                    "trade_agreement"
                ),

            "exemption_type":

                result.get(
                    "exemption_type"
                ),

            "compliance_status":
                compliance_status,

            "compliance_score":

                result.get(
                    "compliance_score"
                ),

            "restricted_flag":

                result.get(
                    "restricted_flag"
                ),

            "prohibited_flag":

                result.get(
                    "prohibited_flag"
                ),

            "missing_documents":
                missing_documents,

            "customs_hold_status":
                customs_hold_status,

            "hold_reason":
                hold_reason,

            "ai_recommendation":

                (
                    "Upload required compliance "
                    "documents before customs clearance"
                )

                if missing_documents

                else

                (
                    "Shipment compliant "
                    "for customs clearance."
                )
        })

        return result

    finally:

        db.close()
@router.get("/api/duty-history")
def get_duty_history():
    db: Session = SessionLocal()
    try:
        history = db.query(
            DutyCalculation
        ).order_by(
            DutyCalculation.id.desc()
        ).all()
        return history
    finally:
        db.close()

@router.post("/api/save-duty-calculation")
def save_duty_calculation(data: dict):

    db: Session = SessionLocal()

    try:

        calculation = DutyCalculation(
            origin_country=
                data.get("origin_country"),

            destination_country=
                data.get("destination_country"),

            hsn_code=
                data.get("hsn_code"),

            product=
                data.get("product"),

            category=
                data.get("category"),

            quantity=
                data.get("quantity"),

            shipment_mode=
                data.get("shipment_mode"),

            incoterm=
                data.get("incoterm"),

            base_currency=
                data.get("base_currency"),

            destination_currency=
                data.get("destination_currency"),

            exchange_rate=
                data.get("exchange_rate"),

            unit_price_usd=
                data.get("unit_price_usd"),

            unit_price_local=
                data.get("unit_price_local"),

            base_total_usd=
                data.get("base_total_usd"),

            base_total_local=
                data.get("base_total_local"),

            shipping_cost_usd=
                data.get("shipping_cost_usd"),

            shipping_cost_local= 
                data.get("shipping_cost_local"),

            insurance_cost_usd=
                data.get("insurance_cost_usd"),

            insurance_cost_local=
                data.get("insurance_cost_local"),

            cif_value_usd=
                data.get("cif_value_usd"),

            cif_value_local=
                data.get("cif_value_local"),

            bcd_percent=
                data.get("bcd_percent"),

            bcd_amount_usd=
                data.get("bcd_amount_usd"),

            bcd_amount_local=
                data.get("bcd_amount_local"),

            igst_percent=
                data.get("igst_percent"),

            igst_amount_usd=
                data.get("igst_amount_usd"),

            igst_amount_local=
                data.get("igst_amount_local"),

            vat_percent=
                data.get("vat_percent"),

            vat_amount_usd=
                data.get("vat_amount_usd"),

            vat_amount_local=
                data.get("vat_amount_local"),

            sws_percent=
                data.get("sws_percent"),

            sws_amount_usd=
                data.get("sws_amount_usd"),

            sws_amount_local=
                data.get("sws_amount_local"),

            anti_dumping_percent=
                data.get("anti_dumping_percent"),

            anti_dumping_amount_usd=
                data.get("anti_dumping_amount_usd"),

            anti_dumping_amount_local=
                data.get("anti_dumping_amount_local"),

            safeguard_percent=
                data.get("safeguard_percent"),

            safeguard_amount_usd=
                data.get("safeguard_amount_usd"),

            safeguard_amount_local=
                data.get("safeguard_amount_local"),

            total_tax_usd=
                data.get("total_tax_usd"),

            total_tax_local=
                data.get("total_tax_local"),

            final_total_usd=
                data.get("final_total_usd"),

            final_total_local=
                data.get("final_total_local"),

            trade_agreement=
                data.get("trade_agreement"),

            exemption_type=
                data.get("exemption_type"),

            compliance_status=
                data.get("compliance_status"),

            compliance_score=
                data.get("compliance_score"),

            restricted_flag=
                data.get("restricted_flag"),

            prohibited_flag=
                data.get("prohibited_flag"),

            missing_documents=
                str(data.get("missing_documents")),

            customs_hold_status=
                data.get("customs_hold_status"),

            hold_reason=
                data.get("hold_reason"),

            ai_recommendation=
                data.get("ai_recommendation")
        )

        db.add(calculation)

        db.commit()

        return {

            "message":
            "Duty Calculation Saved Successfully"
        }

    finally:

        db.close()