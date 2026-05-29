from sqlalchemy import ( Column, Integer, String, Numeric, TIMESTAMP, Date )
from sqlalchemy.sql import func
from database.db import Base
class Payment(Base):
    __tablename__ = "payments"
    id = Column( Integer, primary_key=True )
    payment_reference = Column(String, unique=True)
    invoice_number = Column( String )
    buyer_name = Column( String )
    hsn_code = Column( String )
    product = Column( String )
    category = Column( String )
    destination_country = Column( String )
    origin_country = Column(String)
    final_total_usd = Column(Numeric(12,2))
    final_total_local = Column(Numeric(12,2))
    destination_currency = Column(String)
    due_date = Column( Date )
    payment_status = Column( String )
    paid_date = Column( TIMESTAMP )
    created_at = Column( TIMESTAMP, server_default=func.now() )
