import { useEffect, useState } from "react";

import axios from "axios";
import API from "../services/api";

import DashboardLayout from "../layouts/DashboardLayout";

import {
FaClipboardCheck,
FaCheckCircle,
FaClock,
FaFileAlt
} from "react-icons/fa";

export default function ComplianceApprovals() {

    const [history, setHistory] =
    useState([]);

    const [selectedRecord, setSelectedRecord] =
    useState(null);

    const fetchHistory = async () => {

        try {

            const response = await API.get("/duty-history");

            setHistory(
                response.data
            );

        }

        catch (error) {

            console.log(error);

        }

    };

    useEffect(() => {

        fetchHistory();

    }, []);

    const handleApprove = async (id) => {

        try {

    API.put(`/api/approve-compliance/${id}`);

            fetchHistory();

        }

        catch (error) {

            console.log(error);

        }

    };

    const handleView = (record) => {

        setSelectedRecord(record);

    };

    const pendingRecords = history.filter(

        (item) =>

        item.compliance_status === "PENDING"

    );

    const approvedRecords = history.filter(

        (item) =>

        item.compliance_status === "APPROVED"

    );

    return (

        <DashboardLayout>

        <div className="space-y-8">

        <div className="flex justify-between items-center">

        <h1 className="text-4xl font-bold">

        Compliance Approvals

        </h1>

        </div>



        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">

        <div className="bg-white p-6 rounded-2xl shadow">

        <div className="flex justify-between items-center">

        <div>

        <p className="text-gray-500">
        Total Records
        </p>

        <h1 className="text-4xl font-bold mt-2">

        {history.length}

        </h1>

        </div>

        <FaFileAlt
        className="text-5xl text-blue-600"
        />

        </div>

        </div>

        <div className="bg-white p-6 rounded-2xl shadow">

        <div className="flex justify-between items-center">

        <div>

        <p className="text-gray-500">
        Pending Approvals
        </p>

        <h1 className="text-4xl font-bold mt-2 text-orange-600">

        {pendingRecords.length}

        </h1>

        </div>

        <FaClock
        className="text-5xl text-orange-500"
        />

        </div>

        </div>

        <div className="bg-white p-6 rounded-2xl shadow">

        <div className="flex justify-between items-center">

        <div>

        <p className="text-gray-500">
        Approved
        </p>

        <h1 className="text-4xl font-bold mt-2 text-green-600">

        {approvedRecords.length}

        </h1>

        </div>

        <FaCheckCircle
        className="text-5xl text-green-600"
        />

        </div>

        </div>

        <div className="bg-white p-6 rounded-2xl shadow">

        <div className="flex justify-between items-center">

        <div>

        <p className="text-gray-500">
        Compliance Score
        </p>

        <h1 className="text-4xl font-bold mt-2 text-purple-600">

        96%

        </h1>

        </div>

        <FaClipboardCheck
        className="text-5xl text-purple-600"
        />

        </div>

        </div>

        </div>

        {/* PENDING SECTION */}

        <div className="bg-white rounded-2xl shadow p-6">

        <h2 className="text-2xl font-bold mb-6 text-orange-600">

        Pending Compliance Approvals

        </h2>

        <div className="w-full overflow-hidden rounded-2xl border">

        <div className="overflow-auto max-h-[500px]">

        <table className="w-[3200px] text-center border-collapse">

        <thead className="bg-orange-100 sticky top-0">

        <tr>

        <th className="p-4">Date</th>
        <th className="p-4">Origin</th>
        <th className="p-4">Destination</th>
        <th className="p-4">HSN</th>
        <th className="p-4">Product</th>
        <th className="p-4">Qty</th>
        <th className="p-4">Trade Agreement</th>
        <th className="p-4">Compliance</th>
        <th className="p-4">Restricted</th>
        <th className="p-4">Prohibited</th>
        <th className="p-4">Missing Documents</th>
        <th className="p-4">Hold Status</th>
        <th className="p-4">Hold Reason</th>
        <th className="p-4">USD Total</th>
        <th className="p-4">Local Total</th>
        <th className="p-4">Actions</th>

        </tr>

        </thead>

        <tbody>

        {

        pendingRecords.map((item) => (

        <tr
        key={item.id}
        className="border-b hover:bg-gray-50"
        >

        <td className="p-4">
        {
        new Date(item.created_at)
        .toLocaleDateString()
        }
        </td>

        <td className="p-4">
        {item.origin_country}
        </td>

        <td className="p-4">
        {item.destination_country}
        </td>

        <td className="p-4">
        {item.hsn_code}
        </td>

        <td className="p-4">
        {item.product}
        </td>

        <td className="p-4">
        {item.quantity}
        </td>

        <td className="p-4">
        {item.trade_agreement}
        </td>

        <td className="p-4 text-orange-600 font-bold">
        {item.compliance_status}
        </td>

        <td className="p-4">
        {item.restricted_flag}
        </td>

        <td className="p-4">
        {item.prohibited_flag}
        </td>

        <td className="p-4 text-red-600">
        {item.missing_documents}
        </td>

        <td className="p-4 text-red-600 font-bold">
        {item.customs_hold_status}
        </td>

        <td className="p-4 text-red-500">
        {item.hold_reason}
        </td>

        <td className="p-4 font-bold text-green-700">
        USD {item.final_total_usd}
        </td>

        <td className="p-4 font-bold text-blue-700">
        {item.destination_currency}
        {" "}
        {item.final_total_local}
        </td>

        <td className="p-4">

        <div className="flex gap-2 justify-center flex-wrap">

        <button

        onClick={() =>
            handleView(item)
        }

        className="bg-black text-white px-3 py-2 rounded-lg text-sm"

        >

        View

        </button>

        {

        item.uploaded_document && (

        <a

        href={`${import.meta.env.VITE_API_URL}/${item.uploaded_document}`}

        target="_blank"

        rel="noreferrer"

        className="bg-blue-600 text-white px-3 py-2 rounded-lg text-sm"

        >

        View Doc

        </a>

        )

        }

        {

        item.uploaded_document && (

        <a

        href={`${import.meta.env.VITE_API_URL}/${item.uploaded_document}`}

        download

        className="bg-green-600 text-white px-3 py-2 rounded-lg text-sm"

        >

        Download

        </a>

        )

        }

        <button

        onClick={() =>
            handleApprove(item.id)
        }

        className="bg-purple-600 text-white px-3 py-2 rounded-lg text-sm"

        >

        Approve

        </button>

        </div>

        </td>

        </tr>

        ))

        }

        </tbody>

        </table>

        </div>

        </div>

        </div>

        <div className="bg-white rounded-2xl shadow p-6">

        <h2 className="text-2xl font-bold mb-6 text-green-600">

        Approved Compliance Records

        </h2>

        <div className="space-y-4">

        {

        approvedRecords.map((item) => (

        <div
        key={item.id}
        className="border rounded-2xl p-6 flex justify-between items-center bg-green-50"
        >

        <div>

        <h1 className="text-xl font-bold">

        {item.product}

        </h1>

        <p className="text-gray-600">

        {item.origin_country}
        {" → "}
        {item.destination_country}

        </p>

        <p className="text-sm text-gray-500 mt-2">

        HSN:
        {" "}
        {item.hsn_code}

        </p>

        </div>

        <div className="text-right">

        <h1 className="text-green-700 font-bold text-2xl">

        APPROVED

        </h1>

        <p className="text-gray-600 mt-2">

        USD
        {" "}
        {item.final_total_usd}

        </p>

        </div>

        </div>

        ))

        }

        </div>

        </div>

        </div>

        </DashboardLayout>

    );

}