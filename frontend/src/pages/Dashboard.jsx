import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../layouts/DashboardLayout";
import API from "../services/api";
import { motion } from "framer-motion";
export default function Dashboard() {
    const navigate = useNavigate();
    const user = JSON.parse( localStorage.getItem("user") );
    const [analytics, setAnalytics] = useState(null);
    const [insights, setInsights] = useState([]);
    const [loadingInsights, setLoadingInsights] = useState(false);
    const fetchDashboardAnalytics = async () => {
        try {
            const response = await API.get(
                "/api/dashboard-analytics"
            );
            setAnalytics(response.data);
        } catch (error) {
            console.log(error);
        }
    };
const fetchAIInsights = async () => {
    try {
        const response = await API.get(
            "/api/ai-insights"
        );
        setInsights( response.data );
    } catch (error) {
        console.log(error);
    }
};
const generateAIInsights = async () => {
    try {
        setLoadingInsights(true);
        await API.post(
            "/api/generate-ai-insights"
        );
        await fetchAIInsights();
    } catch (error) {
        console.log(error);
    } finally {
        setLoadingInsights(false);
    }
};
    useEffect(() => {
        fetchDashboardAnalytics();
        fetchAIInsights();
        const interval = setInterval(() => {
            fetchDashboardAnalytics();
        }, 30000);
        return () => clearInterval(interval);
    }, []);
    if (!analytics) {
        return (
            <DashboardLayout>
                <div className="p-10 text-3xl font-bold">
                    Loading Dashboard...
                </div>
            </DashboardLayout>
        );
    }
    const shipmentTotal =
        analytics.shipments.total_shipments || 1;
    const deliveredPercent = Math.round(
        (
            analytics.shipments.delivered_shipments
            / shipmentTotal
        ) * 100
    );
    const transitPercent = Math.round(
        (
            analytics.shipments.in_transit_shipments
            / shipmentTotal
        ) * 100
    );
    return (
        <DashboardLayout>
            <div className="p-6 bg-gray-100 min-h-screen">
                <div className="flex justify-between items-center mb-10">
                    <div>
                        <h1 className="text-4xl font-bold text-gray-800">
                            Import Export AI Dashboard
                        </h1>
                        <p className="text-gray-500 mt-2">
                            Welcome back,
                            {" "}
                            {user?.name}
                        </p>
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={() =>
                                navigate("/documents")
                            }
                            className="bg-black text-white px-5 py-3 rounded-xl font-bold hover:bg-gray-800"
                        >
                            Upload Document
                        </button>
                        <button
                            onClick={() =>
                                navigate("/duty")
                            }
                            className="bg-blue-500 text-white px-5 py-3 rounded-xl font-bold hover:bg-blue-600"
                        >
                            Calculate Duty
                        </button>
                        <button
                            onClick={() =>
                                navigate("/risk")
                            }
                            className="bg-red-500 text-white px-5 py-3 rounded-xl font-bold hover:bg-red-600"
                        >
                            Generate Risk
                        </button>
                    </div>
                </div>
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">

<div className="bg-white p-6 rounded-2xl shadow">
<h2 className="text-gray-500">
Total Documents
</h2>

<h1 className="text-5xl font-bold mt-4">
{
analytics.documents.total_documents
}
</h1>
</div>


<div className="bg-white p-6 rounded-2xl shadow">
<h2 className="text-gray-500">
Revenue Generated
</h2>

<h1 className="text-5xl font-bold mt-4 text-green-600">
$
{
analytics.payments.total_revenue.toFixed(2)
}
</h1>
</div>


<div className="bg-white p-6 rounded-2xl shadow">
<h2 className="text-gray-500">
Pending Amount
</h2>

<h1 className="text-5xl font-bold mt-4 text-red-600">
$
{
analytics.payments.pending_amount.toFixed(2)
}
</h1>
</div>


<div className="bg-white p-6 rounded-2xl shadow">
<h2 className="text-gray-500">
Active Shipments
</h2>

<h1 className="text-5xl font-bold mt-4 text-blue-600">
{
analytics.shipments.total_shipments
}
</h1>
</div>


<div className="bg-red-50 p-6 rounded-2xl shadow">
<h2 className="text-gray-500">
Delayed Shipments
</h2>

<h1 className="text-5xl font-bold mt-4 text-red-600">
{
analytics.shipments.delayed_shipments
}
</h1>
</div>


<div className="bg-yellow-50 p-6 rounded-2xl shadow">
<h2 className="text-gray-500">
Customs Holds
</h2>

<h1 className="text-5xl font-bold mt-4 text-yellow-600">
{
analytics.shipments.customs_holds
}
</h1>
</div>


<div className="bg-blue-50 p-6 rounded-2xl shadow">
<h2 className="text-gray-500">
Countries Trading
</h2>

<h1 className="text-5xl font-bold mt-4 text-blue-600">
{
analytics.shipments.countries_trading
}
</h1>
</div>


<div className="bg-purple-50 p-6 rounded-2xl shadow">
<h2 className="text-gray-500">
Active Ports
</h2>

<h1 className="text-5xl font-bold mt-4 text-purple-600">
{
analytics.shipments.active_ports
}
</h1>
</div>


<div className="bg-green-50 p-6 rounded-2xl shadow">
<h2 className="text-gray-500">
Compliance Rate
</h2>

<h1 className="text-5xl font-bold mt-4 text-green-600">
{
analytics.risk.compliance_rate
}%
</h1>
</div>


<div className="bg-orange-50 p-6 rounded-2xl shadow">
<h2 className="text-gray-500">
Avg Delivery
</h2>

<h1 className="text-5xl font-bold mt-4 text-orange-600">
{
analytics.shipments.average_delivery
}
 Days
</h1>
</div>


<div className="bg-red-100 p-6 rounded-2xl shadow">
<h2 className="text-gray-500">
Risk Escalations
</h2>

<h1 className="text-5xl font-bold mt-4 text-red-700">
{
analytics.risk.risk_escalations
}
</h1>
</div>


<div className="bg-white p-6 rounded-2xl shadow">
<h2 className="text-gray-500">
High Risk Clients
</h2>

<h1 className="text-5xl font-bold mt-4 text-red-600">
{
analytics.risk.risk_escalations
}
</h1>
</div>

</div>
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-6 mb-10">
                    <div className="bg-white rounded-2xl shadow p-6">
                        <h2 className="text-2xl font-bold mb-6">
                            Document Intelligence
                        </h2>
                        <div className="space-y-5">
                            <div className="flex justify-between">
                                <span>
                                    OCR Success
                                </span>
                                <span className="font-bold text-green-600">
                                    {
                                        analytics.documents.ocr_success
                                    }
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span>
                                    Validation Passed
                                </span>
                                <span className="font-bold text-blue-600">
                                    {
                                        analytics.documents.validation_passed
                                    }
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-2xl shadow p-6">
                        <h2 className="text-2xl font-bold mb-6">
                            Payment Analytics
                        </h2>
                        <div className="space-y-5">
                            <div className="flex justify-between">
                                <span>
                                    Paid Payments
                                </span>
                                <span className="font-bold text-green-600">
                                    {
                                        analytics.payments.paid_payments
                                    }
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span>
                                    Pending Payments
                                </span>
                                <span className="font-bold text-yellow-600">
                                    {
                                        analytics.payments.pending_payments
                                    }
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span>
                                    Collection Rate
                                </span>
                                <span className="font-bold text-purple-600">
                                    {
                                        analytics.payments.collection_rate
                                    }%
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-2xl shadow p-6">
                        <h2 className="text-2xl font-bold mb-6">
                            Duty Analytics
                        </h2>
                        <div className="space-y-5">
                            <div className="flex justify-between">
                                <span>
                                    Total Calculations
                                </span>
                                <span className="font-bold text-blue-600">
                                    {
                                        analytics.duty.total_duty_calculations
                                    }
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span>
                                    Duty Calculations
                                </span>
                                <span className="font-bold text-green-600">
                                    {
                                        analytics.duty.total_duty_calculations
                                    }
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-2xl shadow p-6">
                        <h2 className="text-2xl font-bold mb-6">
                            Shipment Analytics
                        </h2>
                        <div className="space-y-5">
                            <div className="flex justify-between">
                                <span>
                                    Delivered
                                </span>
                                <span className="font-bold text-green-600">
                                    {
                                        analytics.shipments.delivered_shipments
                                    }
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span>
                                    In Transit
                                </span>
                                <span className="font-bold text-blue-600">{
                                        analytics.shipments.in_transit_shipments}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
<div className="bg-white rounded-3xl shadow p-8 mb-10 border">
    
    <h2 className="text-3xl font-bold mb-8 text-gray-800">
        Shipment Performance
    </h2>

    <div className="mb-7">
        <div className="flex justify-between items-center mb-2">
            <span className="text-lg font-semibold text-gray-700">
                Delivered Shipments
            </span>

            <span className="font-bold text-green-400">
                {deliveredPercent}%
            </span>
        </div>

        <div className="w-full bg-gray-200 h-4 rounded-full overflow-hidden">
            <div
                className="bg-green-500 h-4 rounded-full transition-all duration-700"
                style={{ width: `${deliveredPercent}%` }}
            />
        </div>
    </div>

  
    <div className="mb-7">
        <div className="flex justify-between items-center mb-2">
            <span className="text-lg font-semibold">
                In Transit Shipments
            </span>

            <span className="font-bold text-blue-400">
                {transitPercent}%
            </span>
        </div>

        <div className="w-full bg-gray-200 h-4 rounded-full overflow-hidden">
            <div
                className="bg-blue-500 h-4 rounded-full transition-all duration-700"
                style={{ width: `${transitPercent}%` }}
            />
        </div>
    </div>

    <div className="mb-7">
        <div className="flex justify-between items-center mb-2">
            <span className="text-lg font-semibold">
                Customs Clearance
            </span>

            <span className="font-bold text-yellow-400">
                10%
            </span>
        </div>

        <div className="w-full bg-gray-200 h-4 rounded-full overflow-hidden">
            <div
                className="bg-yellow-500 h-4 rounded-full transition-all duration-700"
                style={{ width: `10%` }}
            />
        </div>
    </div>
    <div>
        <div className="flex justify-between items-center mb-2">
            <span className="text-lg font-semibold">
                Delayed Shipments
            </span>

            <span className="font-bold text-red-400">
                5%
            </span>
        </div>

        <div className="w-full bg-gray-200 h-4 rounded-full overflow-hidden">
            <div
                className="bg-red-500 h-4 rounded-full transition-all duration-700"
                style={{ width: `5%` }}
            />
        </div>
    </div>

</div>
        <div className="bg-white rounded-2xl shadow p-6 mb-10">
    <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold">
            AI Insights
        </h2>
        <button
            onClick={generateAIInsights}
            className="bg-black text-white px-6 py-3 rounded-xl font-bold hover:bg-gray-800">
            {
                loadingInsights
                ? "Generating..."
                : "Generate AI Insights"
            }
        </button>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {
            insights.map((item) => (
<motion.div
    key={item.id}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}  
    transition={{ duration: 0.4 }}
    whileHover={{ scale: 1.02 }}
    className={`
        rounded-3xl p-7 shadow-lg border-l-[10px]
        transition-all duration-300
        ${
            item.insight_type === "payment"
            ? "bg-gradient-to-br from-red-50 to-red-100 border-red-500"
            : item.insight_type === "revenue"
            ? "bg-gradient-to-br from-green-50 to-green-100 border-green-500"
            : item.insight_type === "tax"
            ? "bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-500"
            : "bg-gradient-to-br from-blue-50 to-blue-100 border-blue-500"}`}>
    <div className="flex justify-between items-center mb-5">
        <h2 className="text-2xl font-bold text-gray-800">
            {item.title}
        </h2>
    </div>
    <div className="whitespace-pre-line text-gray-700 leading-5 text-[15px]">
        {item.content}
    </div>
    <div className="mt-6 text-sm text-gray-500">
        Generated:
        {" "}
        {
            new Date(
                item.created_at
            ).toLocaleString()
        }
    </div>
</motion.div>
            ))}
    </div>
</div>
<div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">


    <div className="bg-white rounded-2xl shadow p-6">

        <h2 className="text-2xl font-bold mb-6">
            Recent Documents
        </h2>

        <div className="space-y-5">

            {
                analytics.recent_documents.map(
                    (item, index) => (

                        <div
                            key={index}
                            className="border-b pb-4"
                        >

                            <h3 className="font-bold">
                                {item.file_name}
                            </h3>

                            <p className="text-gray-500">
                                {item.buyer_name}
                            </p>

                            <p className="text-sm text-gray-400">
                                {item.product}
                            </p>

                        </div>
                    )
                )
            }

        </div>

    </div>


  
    <div className="bg-white rounded-2xl shadow p-6">

        <h2 className="text-2xl font-bold mb-6">
            Recent Shipments
        </h2>

        <div className="space-y-5">

            {
                analytics.recent_shipments.map(
                    (item, index) => (

                        <div
                            key={index}
                            className="border-b pb-4"
                        >

                            <h3 className="font-bold">
                                {item.tracking_id}
                            </h3>

                            <p className="text-gray-500">
                                {item.buyer_name}
                            </p>

                            <p className="text-sm text-blue-500">
                                {item.status}
                            </p>

                            <p className="text-sm text-gray-500 mt-2">
                                {item.origin_country}
                                →
                                {item.destination_country}
                            </p>

                            <p className="text-sm text-purple-500">
                                {item.origin_port}
                                →
                                {item.destination_port}
                            </p>

                        </div>
                    )
                )
            }

        </div>

    </div>

</div>
            </div>
        </DashboardLayout>
    );
}