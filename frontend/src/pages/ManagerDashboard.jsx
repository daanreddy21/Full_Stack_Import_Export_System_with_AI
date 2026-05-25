import { useEffect, useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import API from "../services/api";

export default function ManagerDashboard() {

    const [analytics, setAnalytics] = useState(null);
    const [countryData, setCountryData] = useState(null);

    useEffect(() => {
        fetchDashboard();
        fetchCountryAnalytics();
    }, []);

    const fetchDashboard = async () => {
        try {

            const response = await API.get(
                "/api/dashboard-analytics"
            );

            setAnalytics(response.data);

        } catch (error) {
            console.log(error);
        }
    };

    const fetchCountryAnalytics = async () => {
        try {

            const response = await API.get(
                "/api/country-analytics"
            );

            setCountryData(response.data);

        } catch (error) {
            console.log(error);
        }
    };

    if (!analytics || !countryData) {

        return (
            <DashboardLayout>
                <div className="p-10 text-3xl font-bold">
                    Loading Manager Dashboard...
                </div>
            </DashboardLayout>
        );
    }

    const summary = countryData.summary;

    const shipmentTotal =
        analytics.shipments.total_shipments || 1;

    const deliveredPercent = Math.round(
        (
            analytics.shipments.delivered_shipments /
            shipmentTotal
        ) * 100
    );

    const transitPercent = Math.round(
        (
            analytics.shipments.in_transit_shipments /
            shipmentTotal
        ) * 100
    );

    return (

        <DashboardLayout>

            <div className="p-6 bg-gray-100 min-h-screen">

                {/* HEADER */}

                <div className="mb-10">

                    <h1 className="text-4xl font-bold text-gray-800">
                        Manager Dashboard
                    </h1>

                    <p className="text-gray-500 mt-2">
                        Import Export Operations Intelligence
                    </p>

                </div>


                {/* MAIN KPI CARDS */}

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
                            USD {
                                analytics.payments.total_revenue.toFixed(2)
                            }
                        </h1>
                    </div>

                    <div className="bg-white p-6 rounded-2xl shadow">
                        <h2 className="text-gray-500">
                            Pending Amount
                        </h2>

                        <h1 className="text-5xl font-bold mt-4 text-red-600">
                            USD {
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

                </div>


                {/* SECONDARY KPI */}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">

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
                            Risk Escalations
                        </h2>

                        <h1 className="text-5xl font-bold mt-4 text-orange-600">
                            {
                                analytics.risk.risk_escalations
                            }
                        </h1>
                    </div>

                    <div className="bg-purple-50 p-6 rounded-2xl shadow">
                        <h2 className="text-gray-500">
                            High Risk Clients
                        </h2>

                        <h1 className="text-5xl font-bold mt-4 text-purple-600">
                            {
                                summary.high_risk_clients
                            }
                        </h1>
                    </div>

                </div>


                {/* COUNTRY KPI ONLY UNIQUE */}

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">

                    <div className="bg-blue-50 p-6 rounded-2xl shadow">
                        <h2 className="text-gray-500">
                            Countries Trading
                        </h2>

                        <h1 className="text-5xl font-bold mt-4 text-blue-600">
                            {
                                summary.total_countries
                            }
                        </h1>
                    </div>

                    <div className="bg-yellow-50 p-6 rounded-2xl shadow">
                        <h2 className="text-gray-500">
                            Total Clients
                        </h2>

                        <h1 className="text-5xl font-bold mt-4 text-yellow-600">
                            {
                                summary.total_clients
                            }
                        </h1>
                    </div>

                    <div className="bg-indigo-50 p-6 rounded-2xl shadow">
                        <h2 className="text-gray-500">
                            Delivered Shipments
                        </h2>

                        <h1 className="text-5xl font-bold mt-4 text-indigo-600">
                            {
                                summary.delivered_shipments
                            }
                        </h1>
                    </div>

                </div>


                {/* ANALYTICS SECTION */}

                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-6 mb-10">

                    <div className="bg-white rounded-2xl shadow p-6">
                        <h2 className="text-2xl font-bold mb-6">
                            Document Intelligence
                        </h2>

                        <div className="space-y-5">

                            <div className="flex justify-between">
                                <span>OCR Success</span>

                                <span className="font-bold text-green-600">
                                    {
                                        analytics.documents.ocr_success
                                    }
                                </span>
                            </div>

                            <div className="flex justify-between">
                                <span>Validation Passed</span>

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
                                <span>Paid Payments</span>

                                <span className="font-bold text-green-600">
                                    {
                                        analytics.payments.paid_payments
                                    }
                                </span>
                            </div>

                            <div className="flex justify-between">
                                <span>Pending Payments</span>

                                <span className="font-bold text-yellow-600">
                                    {
                                        analytics.payments.pending_payments
                                    }
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
                                <span>Total Calculations</span>

                                <span className="font-bold text-blue-600">
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
                                <span>Delivered</span>

                                <span className="font-bold text-green-600">
                                    {
                                        analytics.shipments.delivered_shipments
                                    }
                                </span>
                            </div>

                            <div className="flex justify-between">
                                <span>In Transit</span>

                                <span className="font-bold text-blue-600">
                                    {
                                        analytics.shipments.in_transit_shipments
                                    }
                                </span>
                            </div>

                        </div>
                    </div>

                </div>


                {/* SHIPMENT PERFORMANCE */}

                <div className="bg-white rounded-3xl shadow p-8 mb-10 border">

                    <h2 className="text-3xl font-bold mb-8 text-gray-800">
                        Shipment Performance
                    </h2>

                    <div className="space-y-8">

                        <div>

                            <div className="flex justify-between mb-2">
                                <span className="font-semibold">
                                    Delivered Shipments
                                </span>

                                <span className="font-bold text-green-500">
                                    {deliveredPercent}%
                                </span>
                            </div>

                            <div className="w-full bg-gray-200 h-4 rounded-full overflow-hidden">
                                <div
                                    className="bg-green-500 h-4 rounded-full"
                                    style={{
                                        width: `${deliveredPercent}%`
                                    }}
                                />
                            </div>

                        </div>

                        <div>

                            <div className="flex justify-between mb-2">
                                <span className="font-semibold">
                                    In Transit Shipments
                                </span>

                                <span className="font-bold text-blue-500">
                                    {transitPercent}%
                                </span>
                            </div>

                            <div className="w-full bg-gray-200 h-4 rounded-full overflow-hidden">
                                <div
                                    className="bg-blue-500 h-4 rounded-full"
                                    style={{
                                        width: `${transitPercent}%`
                                    }}
                                />
                            </div>

                        </div>

                    </div>

                </div>


                {/* RECENT SECTION */}

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


                {/* COUNTRY ANALYTICS */}

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                    {
                        countryData.countries.map(
                            (country, index) => (

                                <div
                                    key={index}
                                    className="bg-white rounded-3xl shadow-xl p-8 border"
                                >

                                    <div className="flex items-center justify-between mb-6">

                                        <h1 className="text-3xl font-bold">
                                            🌍 {country.country}
                                        </h1>

                                        {
                                            country.delayed > 0
                                            ? (
                                                <span className="bg-red-100 text-red-700 px-4 py-2 rounded-full font-bold">
                                                    Attention Needed
                                                </span>
                                            )
                                            : (
                                                <span className="bg-green-100 text-green-700 px-4 py-2 rounded-full font-bold">
                                                    Stable
                                                </span>
                                            )
                                        }

                                    </div>

                                    <div className="space-y-3 text-lg">

                                        <p>
                                            <strong>
                                                Revenue:
                                            </strong>

                                            {" "}
                                            {country.currency}

                                            {" "}
                                            {
                                                country.revenue.toLocaleString()
                                            }
                                        </p>

                                        <p>
                                            <strong>
                                                Pending:
                                            </strong>

                                            {" "}
                                            {country.currency}

                                            {" "}
                                            {
                                                country.pending.toLocaleString()
                                            }
                                        </p>

                                        <p>
                                            <strong>
                                                Clients:
                                            </strong>

                                            {" "}
                                            {country.clients}
                                        </p>

                                    </div>

                                </div>
                            )
                        )
                    }

                </div>

            </div>

        </DashboardLayout>
    );
}