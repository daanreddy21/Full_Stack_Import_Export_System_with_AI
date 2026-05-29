from sqlalchemy import Column, Integer, String, Text, Boolean, TIMESTAMP, Date
from datetime import datetime
from database.db import Base
class Notification(Base):
    __tablename__ = "notifications"
    id = Column(Integer, primary_key=True, index=True)
    type = Column(String)
    title = Column(String)
    message = Column(Text)
    invoice_number = Column(String)
    buyer_name = Column(String)
    tracking_id = Column(String)
    department = Column(String)
    is_read = Column(Boolean, default=False)
    notification_date = Column(Date)
    created_at = Column(
        TIMESTAMP,
        default=datetime.utcnow
    )