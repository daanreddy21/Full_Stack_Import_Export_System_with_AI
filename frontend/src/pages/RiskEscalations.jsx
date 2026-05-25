import { useEffect, useState } from "react";
import ManagerLayout from "../layouts/DashboardLayout";
import API from "../services/api";
export default function RiskEscalations() {
    const [notifications, setNotifications] = useState([]);
    useEffect(() => {
        fetchNotifications();
    }, []);
    const fetchNotifications = async () => {
        try {
            const response = await API.get(
                "/api/notifications"
            );
            setNotifications(
                response.data
            );
        } catch (error) {
            console.log(error);
        }
    };
    const markAsRead = async (id) => {
        try {
            await API.put(
                `/api/mark-notification-read/${id}`
            );
            fetchNotifications();
        } catch (error) {
            console.log(error);
        }
    };
    return (
        <ManagerLayout>
            <div className="p-6 min-h-screen bg-gray-100">
                <div className="mb-8">
                    <h1 className="text-4xl font-bold">
                        Risk Escalations
                    </h1>
                    <p className="text-gray-600 mt-2">
                        Customs & Finance escalation alerts
                    </p>
                </div>
                <div className="grid grid-cols-3 gap-6 mb-8">
                    <div className="bg-red-100 p-6 rounded-2xl shadow">
            <h3 className="text-lg">
                Total Risks
                </h3>
            <h1 className="text-5xl font-bold mt-3 text-red-700">
                {notifications.length}
            </h1>
                    </div>
        <div className="bg-yellow-100 p-6 rounded-2xl shadow">
            <h3 className="text-lg">
            Shipment Risks
            </h3>
        <h1 className="text-5xl font-bold mt-3 text-yellow-700">
            {
                notifications.filter(
                                    (item) =>item.type === "shipment_delay").length}
                        </h1>
                    </div>
        <div className="bg-blue-100 p-6 rounded-2xl shadow">
                <h3 className="text-lg">
                    Payment Risks
                </h3>
                <h1 className="text-5xl font-bold mt-3 text-blue-700">
                    {
                        notifications.filter(
                            (item) =>
                                item.type === "payment_risk"
                                ).length
                            }
                        </h1>
                    </div>
                </div>
                <div className="space-y-5">
                    {
        notifications.map((item) => (
            <div
                key={item.id}
                className={`p-6 rounded-2xl shadow border-l-8 ${
                item.type === "shipment_delay"
                ? "bg-yellow-50 border-yellow-500"
                : "bg-red-50 border-red-500"}`}>
        <div className="flex justify-between items-start">
        <div>
        <h2 className="text-2xl font-bold">
        {item.title}
        </h2>
        <p className="text-gray-700 mt-3">
            {item.message}
        </p>
        <p className="text-sm text-gray-500 mt-2">
    {
        new Date(
            item.created_at
        ).toLocaleString()
    }
</p>
    <div className="grid grid-cols-2 gap-4 mt-5">
        <div>
            <span className="font-bold">
            Invoice:
        </span>
        {" "}
            {item.invoice_number}
            </div>
        <div>
            <span className="font-bold">
                Buyer:
            </span>
            {" "}
            {item.buyer_name}
</div>
        <div>
            <span className="font-bold">
                Department:
                </span>
                {" "}
            {item.department}
                </div>
{
            item.tracking_id && (
                <div>
                <span className="font-bold">
                    Tracking:
                </span>
                {" "}
                {item.tracking_id}
        </div>
    )}
    </div>

</div>

<div className="flex flex-col items-end gap-3">
    {
        item.is_read
            ? (
                <span className="bg-green-100 text-green-700 px-4 py-2 rounded-full font-bold">
                Resolved
                </span>
                ) : (
                <span className="bg-red-100 text-red-700 px-4 py-2 rounded-full font-bold">
                    Active Risk
                </span>
                )}
{
            !item.is_read && (
                <button
                onClick={() =>markAsRead(item.id)}className="bg-black text-white px-5 py-2 rounded-xl">
                    Mark Resolved
                </button>
                    )}
                </div>
            </div>
        </div>
))}
    </div>
    </div>
        </ManagerLayout>
    );
}