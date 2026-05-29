from apscheduler.schedulers.background import (
    BackgroundScheduler
)

from routes.payment_routes import (
    check_overdue_payments
)

from routes.shipment_routes import (
    check_delayed_shipments
)

scheduler = BackgroundScheduler()

def start_notification_scheduler():

    scheduler.add_job(
        check_overdue_payments,
        "interval",
        seconds=10
    )

    scheduler.add_job(
        check_delayed_shipments,
        "interval",
        seconds=15
    )

    scheduler.start()