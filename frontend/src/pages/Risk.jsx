import { useEffect, useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import API from "../services/api";
export default function Risk() {
    const [riskData, setRiskData] = useState([]);
    const [selectedClient, setSelectedClient] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        fetchRiskHistory();
    }, []);
const fetchRiskHistory = async () => {
    try {
        const response = await API.get(
            "/api/risk-analysis-history"
        );
        setRiskData(response.data);
    } catch (error) {
        console.log(error);
    }
};
const generateRiskAnalysis = async () => {
    try {
        setLoading(true);
        await API.post(
            "/api/generate-risk-analysis"
        );
        await fetchRiskHistory();
        alert(
            "AI Risk Analysis Generated"
        );
    } catch (error) {
        console.log(error);
    } finally {
        setLoading(false);
    }
};
    const filteredData = riskData.filter(
        (item) =>
            item.buyer_name
                ?.toLowerCase()
                .includes(search.toLowerCase())
    );
    const highRiskCount = riskData.filter(
        (item) => item.risk_level === "HIGH"
    ).length;
    const totalPending = riskData.reduce(
        (total, item) =>
            total + Number(item.total_pending_amount),
        0
    );
    const overduePayments = riskData.reduce(
        (total, item) =>
            total + Number(item.overdue_payments),
        0
    );
    return (
        <DashboardLayout>
    <div className="p-6 bg-gray-100 min-h-screen">
<div className="mb-8">
        <h1 className="text-4xl font-bold"> Client Payment Risk Analysis </h1>
            <p className="text-gray-600 mt-2">
                AI-powered payment risk intelligence system
        </p>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-red-100 p-6 rounded-2xl shadow">
        <h3 className="text-gray-600">  High Risk Clients </h3>
<h1 className="text-5xl font-bold text-red-600 mt-3">
            {highRiskCount}
        </h1>
        </div>
        <div className="bg-yellow-100 p-6 rounded-2xl shadow">
            <h3 className="text-gray-600">  Total Pending </h3>
            <h1 className="text-5xl font-bold text-yellow-700 mt-3">
        USD {totalPending}
        </h1>
        </div>
        <div className="bg-blue-100 p-6 rounded-2xl shadow">
            <h3 className="text-gray-600">  Overdue Payments </h3>
            <h1 className="text-5xl font-bold text-blue-700 mt-3">
                {overduePayments}
            </h1>
        </div>
    </div>
        <div className="bg-white p-6 rounded-2xl shadow mb-8">
        <input
            type="text"
            placeholder="Search Buyer..."
            value={search}
                onChange={(e) =>
            setSearch(e.target.value)}className="w-full border rounded-xl px-5 py-4"/>
    </div>
    <button onClick={generateRiskAnalysis}
            disabled={loading}
            className="bg-black text-white px-6 py-3 rounded-xl font-bold disabled:opacity-50">{
                        loading
                        ? "Generating Report..."
                        : "Generate Risk"
                    }
                </button>
                <div className="bg-white rounded-2xl shadow overflow-x-auto">
                        <table className="w-full text-center">
            <thead className="bg-gray-100">
                    <tr>
                        <th className="p-4">Buyer Name</th>
                        <th className="p-4">Pending</th>
                        <th className="p-4">Overdue</th>
                        <th className="p-4">Risk Score</th>
                        <th className="p-4">Risk Level</th>
                            <th className="p-4">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredData.map((item, index) => (
                    <tr key={index} className="border-t">
                                <td className="p-4 font-semibold">  {item.buyer_name} </td>
                        <td className="p-4"> {item.pending_payments} </td>
                    <td className="p-4"> {item.overdue_payments} </td>
                        <td className="p-4 font-bold"> {item.client_risk || item.risk_score} </td>
                        <td className="p-4">
                            {item.risk_level === "HIGH"
                            ? (
                            <span className="bg-red-100 text-red-700 px-4 py-2 rounded-full font-bold">
                            HIGH
                            </span>
                                )
                    : item.risk_level === "MEDIUM"
                            ? (
                            <span className="bg-yellow-100 text-yellow-700 px-4 py-2 rounded-full font-bold">
                                MEDIUM
                            </span>
                                ): (
                            <span className="bg-green-100 text-green-700 px-4 py-2 rounded-full font-bold">
                                LOW
                            </span>
                                )
                                }
                            </td>
                    <td className="p-4">
                        <button
                        onClick={() => {
                            setSelectedClient(item);
                                setShowModal(true);
                                }}
                                className="bg-black text-white px-5 py-2 rounded-xl">
                                View Report
                        </button>
                        </td>
                    </tr>
                    ))
                    }
            </tbody>
        </table>
        </div>
            </div>
            {
            showModal && selectedClient && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white w-[900px] max-h-[90vh] overflow-y-auto rounded-2xl p-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold"> Client Risk Report </h1>
                <button
                                onClick={() =>
                                    setShowModal(false)
                                }
                                className="bg-red-500 text-white px-5 py-2 rounded-xl"
                            >
                                Close
                            </button>
                </div>
                    <div className="grid grid-cols-2 gap-6 mb-8">
                        <div className="bg-gray-100 p-5 rounded-xl">
                            <p className="text-gray-500"> Buyer Name </p>
                        <h3 className="text-2xl font-bold">
                                {selectedClient.buyer_name}
                                </h3>
                            </div>
                <div className="bg-gray-100 p-5 rounded-xl">
                    <p className="text-gray-500"> Risk Level </p>
                        <h3 className="text-2xl font-bold text-red-600">
                            {selectedClient.risk_level}
                        </h3>
                </div>
                <div className="bg-gray-100 p-5 rounded-xl">
                    <p className="text-gray-500"> Risk Score </p> 
                        <h3 className="text-2xl font-bold">
                            {selectedClient.client_risk|| selectedClient.risk_score}</h3>
                </div>
                <div className="bg-gray-100 p-5 rounded-xl">
                    <p className="text-gray-500"> Total Pending </p>  
                        <h3 className="text-2xl font-bold">
                        {selectedClient.total_pending_amount}
                </h3>
                </div>
                </div>
                        <div className="bg-red-50 p-6 roundd-xl">
                    <h2 className="text-2xl font-bold mb-4"> AI Risk Insights </h2>
                        <div className="space-y-4 text-lg">
                                {
                        Array.isArray(selectedClient.risk_reasons)
                            ? (
                            selectedClient.risk_reasons.map(
                                (reason, index) => (
                                    <p key={index}>   • {reason} </p> 
                                )
                            )
                            ): (
                        <p> • {selectedClient.risk_reasons} </p>  
                                    )
                                }
                                <div className="mt-6 bg-white p-5 rounded-xl">
                                    <h3 className="font-bold text-xl mb-2"> Recommendation </h3>
                                    <p> {selectedClient.recommendation} </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
            )
            }
        </DashboardLayout>
    );
}