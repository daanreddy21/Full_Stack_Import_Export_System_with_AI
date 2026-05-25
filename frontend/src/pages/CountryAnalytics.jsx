import { useEffect, useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import API from "../services/api";
export default function CountryAnalytics() {
    const [data, setData] = useState(null);
    useEffect(() => {
        fetchAnalytics();
    }, []);
    const fetchAnalytics = async () => {
        try {
            const response = await API.get(
                "/api/country-analytics"
            );
            setData(response.data);
        } catch (error) {
            console.log(error);
        }
    };
    if (!data) {
        return (
            <DashboardLayout>
                <div className="p-10 text-2xl font-bold">
                    Loading Analytics...
                </div>
            </DashboardLayout>
        );
    }
    const summary = data.summary;
    return (
        <DashboardLayout>
            <div className="p-6 bg-gray-100 min-h-screen">
        <div className="mb-8">
            <h1 className="text-4xl font-bold">
            Country Intelligence Dashboard
        </h1>
            <p className="text-gray-600 mt-2">
            AI-powered global trade analytics
            </p>
        </div>
        <div className="grid grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl shadow">
        <h3 className="text-gray-500">
            Total Revenue
        </h3>
        <h1 className="text-4xl font-bold text-green-600 mt-3">
            USD {summary.total_revenue.toLocaleString()}
        </h1>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow">
        <h3 className="text-gray-500">
            Total Pending
        </h3>
            <h1 className="text-4xl font-bold text-red-600 mt-3">
                USD {summary.total_pending.toLocaleString()}
            </h1>
        </div>
            <div className="bg-white p-6 rounded-2xl shadow">
        <h3 className="text-gray-500">
            Total Countries
        </h3>
            <h1 className="text-4xl font-bold mt-3">
            {summary.total_countries}
            </h1>
    </div>
        <div className="bg-white p-6 rounded-2xl shadow">
            <h3 className="text-gray-500">
            Total Clients
            </h3>
        <h1 className="text-4xl font-bold mt-3">
            {summary.total_clients}
        </h1>
        </div>
        </div>
        <div className="grid grid-cols-3 gap-6 mb-10">
        <div className="bg-yellow-100 p-6 rounded-2xl shadow">
            <h3>Delayed Shipments</h3>
            <h1 className="text-5xl font-bold mt-3">
                {summary.delayed_shipments}
            </h1>
        </div>
        <div className="bg-green-100 p-6 rounded-2xl shadow">
            <h3>Delivered Shipments</h3>
            <h1 className="text-5xl font-bold mt-3">
                {summary.delivered_shipments}
            </h1>
        </div>
        <div className="bg-red-100 p-6 rounded-2xl shadow">
        <h3>High Risk Clients</h3>
        <h1 className="text-5xl font-bold mt-3">
            {summary.high_risk_clients}
        </h1>
        </div>
        </div>
        <div className="grid grid-cols-2 gap-8">{
            data.countries.map((country, index) => (
            <div key={index}className="bg-white rounded-3xl shadow-xl p-8 border">
        <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold">🌍 {country.country}</h1>{
                        country.delayed > 0
                        ? (
                        <span className="bg-red-100 text-red-700 px-4 py-2 rounded-full font-bold">Attention Needed</span>)
: (
            <span className="bg-green-100 text-green-700 px-4 py-2 rounded-full font-bold">
                Stable
            </span>
        )}
</div>
        <div className="space-y-3 text-lg">
        <p><strong>Revenue Generated:</strong>{country.currency} {country.revenue.toLocaleString()}</p>
<p><strong>Pending Amount:</strong>{country.currency} {country.pending.toLocaleString()}</p>
            <p><strong>No of Clients:</strong>{country.clients}</p>
                                </div>
            <div className="mt-8">
                <h2 className="text-2xl font-bold mb-4">Risk Clients</h2>{
                    country.risk_clients.length === 0? (
                <div className="bg-green-50 p-4 rounded-xl">
                    No Risk Clients Found
                </div>): (
                    country.risk_clients.map((risk, idx) => (
                    <div key={idx}className="bg-gray-50 rounded-2xl p-5 mb-4">
                        <h3 className="text-xl font-bold">{risk.buyer_name}</h3>
                        <p className="mt-2"><strong>Risk:</strong><span className={risk.risk_level === "HIGH" ? "text-red-600 font-bold" : "text-yellow-600 font-bold"}>{" "}{risk.risk_level}</span></p>
                        <p className="mt-3 text-gray-700"><strong>Reason:</strong> {risk.risk_reasons}</p>
                        <p className="mt-3 text-gray-700"><strong>Recommendation:</strong> {risk.recommendation}</p>
                    </div>
                )))}
                </div>                            
<div className="mt-8">
            <h2 className="text-2xl font-bold mb-4">Shipment Analytics</h2>
            <div className="grid grid-cols-3 gap-4">
            <div className="bg-green-100 p-4 rounded-2xl text-center">
                <h3 className="font-bold">Delivered</h3>
                <h1 className="text-3xl font-bold mt-2">{country.delivered}</h1>
            </div>
            <div className="bg-yellow-100 p-4 rounded-2xl text-center">
                <h3 className="font-bold">Pending</h3>
                <h1 className="text-3xl font-bold mt-2">{country.pending_shipments}</h1>
            </div>
            <div className="bg-red-100 p-4 rounded-2xl text-center">
                <h3 className="font-bold">Delayed</h3>
                <h1 className="text-3xl font-bold mt-2">{country.delayed}</h1>
            </div>
            </div>
        </div>
</div>                         
))}
</div>  
</div>
        </DashboardLayout>
    );

}