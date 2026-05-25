
import axios from "axios";
import { useEffect, useState, useRef } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import API from "../services/api";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import PaymentForm from "../components/PaymentForm";
import PaymentsTable from "../components/PaymentsTable";
import ShipmentForm from "../components/ShipmentForm";

export default function DutyHistory() {
    const billRef = useRef();
    const [history, setHistory] = useState([]);
    const [filteredHistory, setFilteredHistory]= useState([]);
    const [search, setSearch] = useState("");
    const [countryFilter, setCountryFilter]= useState("");
    const [hsnFilter, setHsnFilter]= useState("");
    const [selectedRecord, setSelectedRecord]= useState(null);
    const [showModal, setShowModal]= useState(false);
    const [showPaymentForm, setShowPaymentForm]= useState(false);
    const [selectedDocument, setSelectedDocument]= useState(null);
    const [payments, setPayments]= useState([]);
    const [showShipmentForm, setShowShipmentForm]= useState(false);
    const [selectedPayment, setSelectedPayment]= useState(null);
    useEffect(() => {
        fetchHistory();
        fetchPayments();
    }, []);
    useEffect(() => {
        let filtered = [...history];
        if (search) {
            filtered = filtered.filter(
                (item) =>
                    item.product
                    ?.toLowerCase()
                    .includes(search.toLowerCase())
                    ||
                    item.country
                    ?.toLowerCase()
                    .includes(search.toLowerCase())
                    ||
                    item.hsn_code
                    ?.toLowerCase()
                    .includes(search.toLowerCase())
            );
        }
        if (countryFilter) {
            filtered = filtered.filter(
                (item) =>
                    item.country === countryFilter
            );
        }
        if (hsnFilter) {
            filtered = filtered.filter(
                (item) =>
                    item.hsn_code === hsnFilter
            );
        }
        setFilteredHistory(filtered);
    }, [
        search,
        countryFilter,
        hsnFilter,
        history
    ]);
    const fetchHistory = async () => {
        try {
            const response = await API.get(
                "/api/duty-history"
            );
const approvedOnly = response.data.filter(
    (item) =>
        item.compliance_status === "APPROVED"
);

setHistory(approvedOnly);
setFilteredHistory(approvedOnly);
        } catch (error) {
            console.log(error);
        }
    };
    const fetchPayments = async () => {
        try {
            const response = await API.get(
                "/api/payments"
            );
            setPayments(response.data);
        } catch (error) {
            console.log(error);
        }
    };
    const getDocumentDetails = async (
        hsnCode
    ) => {
        try {
            const response = await API.get(
                `/api/document-by-hsn/${hsnCode}`
            );
            setSelectedDocument(response.data);
        } catch (error) {
            console.log(error);
        }
    };
    const downloadBill = async () => {
        const canvas = await html2canvas(
            billRef.current
        );
        const imgData =
            canvas.toDataURL("image/png");
        const pdf = new jsPDF(
            "p",
            "mm",
            "a4"
        );
        const imgWidth = 190;
        const pageHeight = 295;
        const imgHeight =
            (canvas.height * imgWidth)
            / canvas.width;
        let heightLeft = imgHeight;
        let position = 10;
        pdf.addImage(
            imgData,
            "PNG",
            10,
            position,
            imgWidth,
            imgHeight
        );
        heightLeft -= pageHeight;
        while (heightLeft >= 0) {
            position = heightLeft - imgHeight;
            pdf.addPage();
            pdf.addImage(
                imgData,
                "PNG",
                10,
                position,
                imgWidth,
                imgHeight
            );
            heightLeft -= pageHeight;
        }
        pdf.save(
            "customs-duty-report.pdf"
        );
    };
const handleUpload = async (
    id,
    file
) => {
    try {
        const formData = new FormData();
        formData.append(
            "file",
            file
        );
            await API.post(
                `/api/upload-compliance-document/${id}`,
                formData,
            {
                headers: {
                    "Content-Type":
                    "multipart/form-data"
                }
            }
        );
        fetchHistory();
    }
    catch (error) {
        console.log(error);
    }
};
const handleView = (record) => {
    setSelectedRecord(record);
    setShowModal(true);
};
    return (
        <DashboardLayout>
            <div className="p-6 bg-gray-100 min-h-screen">
                <div className="bg-white rounded-2xl shadow p-6 mb-8">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                        <h2 className="text-3xl font-bold">
                            Calculation History
                        </h2>
                        <div className="flex flex-col md:flex-row gap-4">
                            <input
                                type="text"
                                placeholder="Search..."
                                value={search}
                                onChange={(e) =>
                                    setSearch(e.target.value)
                                }
                                className="border rounded-lg px-4 py-2"
                            />
                            <select
                                value={countryFilter}
                                onChange={(e) =>
                                    setCountryFilter(
                                        e.target.value
                                    )
                                }
                                className="border rounded-lg px-4 py-2"
                            >
                                <option value="">
                                    All Countries
                                </option>
                                {
                                    [...new Set(
                                        history.map(
                                            (item) =>
                                                item.country
                                        )
                                    )].map((country) => (
                                        <option
                                            key={country}
                                            value={country}
                                        >
                                            {country}
                                        </option>
                                    ))
                                }
                            </select>
                            <select
                                value={hsnFilter}
                                onChange={(e) =>
                                    setHsnFilter(
                                        e.target.value
                                    )
                                }
                                className="border rounded-lg px-4 py-2"
                            >
                                <option value="">
                                    All HSN
                                </option>
                                {
                                    [...new Set(
                                        history.map(
                                            (item) =>
                                                item.hsn_code
                                        )
                                    )].map((hsn) => (
                                        <option
                                            key={hsn}
                                            value={hsn}
                                        >
                                            {hsn}
                                        </option>
                                    ))
                                }
                            </select>
                        </div>
                    </div>
                    <div className="w-full overflow-hidden rounded-2xl border">
    <div className="overflow-auto max-h-[600px]">
                        <table className="w-[2600px] text-center border-collapse">
                            <thead className="bg-gray-100">
<tr>
    <th className="p-4 ">
        Date
    </th>
    <th className="p-4">
        Origin
    </th>
    <th className="p-4">
        Destination
    </th>
    <th className="p-4">
        HSN
    </th>
    <th className="p-4">
        Product
    </th>
    <th className="p-4">
        Qty
    </th>
    <th className="p-4">
        Trade Agreement
    </th>
    <th className="p-4">
        Compliance
    </th>
    <th className="p-4">
        Restricted
    </th>
    <th className="p-4">
        Prohibited
    </th>
    <th className="p-4">
        Missing Documents
    </th>
    <th className="p-4">
        Hold Status
    </th>
    <th className="p-4">
        Hold Reason
    </th>
    <th className="p-4">
        USD Total
    </th>
    <th className="p-4">
        Local Total
    </th>
    <th className="p-4">
        Action
    </th>
</tr>
                            </thead>
                            <tbody>
                                {
                                    filteredHistory.map(
                                        (item) => (
                                        <tr
                                            key={item.id}
                                            className="border-t hover:bg-gray-50"
                                        >
<td className="p-4">
    {
        new Date(
            item.created_at
        ).toLocaleDateString()
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
    <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">
        {
            item.trade_agreement
            || "No Agreement"
        }
    </span>
</td>
<td className="p-4">
    <span className={`px-3 py-1 rounded-full text-sm font-bold
        ${
            item.compliance_status === "APPROVED"
            ? "bg-green-100 text-green-700"
            : "bg-yellow-100 text-yellow-700"
        }
    `}>
        {item.compliance_status}
    </span>
</td>
<td className="p-4">
    <span className={`px-3 py-1 rounded-full text-sm font-bold
        ${
            item.restricted_flag === "YES"
            ? "bg-orange-100 text-orange-700"
            : "bg-green-100 text-green-700"
        }
    `}>
        {item.restricted_flag}
    </span>
</td>
<td className="p-4">
    <span className={`px-3 py-1 rounded-full text-sm font-bold
        ${
            item.prohibited_flag === "YES"
            ? "bg-red-100 text-red-700"
            : "bg-green-100 text-green-700"
        }
    `}>
        {item.prohibited_flag}
    </span>
</td>
<td className="p-4 text-red-600 max-w-[220px] text-sm">
    {
        item.missing_documents
        &&
        item.missing_documents !== "[]"
        ? item.missing_documents
        : "No Missing Docs"
    }
</td>
<td className="p-4">
    <span className={`px-3 py-1 rounded-full text-sm font-bold
        ${
            item.customs_hold_status === "CLEAR"
            ||
            item.customs_hold_status === "NO HOLD"
            ? "bg-green-100 text-green-700"
            : "bg-red-100 text-red-700"
        }
    `}>
        {item.customs_hold_status}
    </span>
</td>
<td className="p-4 text-sm text-red-600 max-w-[240px]">
    {
        item.hold_reason
        || "No Hold Reason"
    }
</td>
<td className="p-4 font-bold text-green-700">
    USD
    {" "}
    {item.final_total_usd}
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
    handleView(item

    )
}
className="bg-black text-white px-3 py-2 rounded-lg text-sm"
>
View
</button>
<label
className="bg-blue-600 text-white px-3 py-2 rounded-lg cursor-pointer text-sm"
>
Upload
<input
type="file"
hidden
onChange={(e) =>
handleUpload(
    item.id,
    e.target.files[0]
)
}
/>
</label>
{
item.uploaded_document && (
<a
href={`${import.meta.env.VITE_API_URL}/${item.uploaded_document}`}
target="_blank"
rel="noreferrer"
className="bg-gray-700 text-white px-3 py-2 rounded-lg text-sm"
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
<label
className="bg-orange-500 text-white px-3 py-2 rounded-lg cursor-pointer text-sm"
>
Reupload
<input
type="file"
hidden
onChange={(e) =>
handleUpload(
    item.id,
    e.target.files[0]
)
}
/>
</label>
<button
onClick={async () => {
    setSelectedRecord(item);
    await getDocumentDetails(
        item.hsn_code
    );
    setShowPaymentForm(true);
}}
disabled={
    item.compliance_status !== "APPROVED"
}
className={`
px-3 py-2 rounded-lg text-sm text-white
${
item.compliance_status === "APPROVED"
? "bg-purple-600"
: "bg-gray-400 cursor-not-allowed"
}
`}
>
Create Payment
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
                <div className="mt-10">
                    <PaymentsTable
                        payments={payments}
                        fetchPayments={fetchPayments}
                        setShowShipmentForm={setShowShipmentForm}
                        setSelectedPayment={setSelectedPayment}
                    />
                </div>
            </div>
            {
                showModal && selectedRecord && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white w-[95vw] max-h-[95vh] overflow-auto rounded-2xl p-8">
<div
    ref={billRef}
    className="bg-white p-10 rounded-2xl min-w-[1300px]"
>
<h1 className="text-5xl font-bold text-center mb-10">
    ENTERPRISE AI CUSTOMS DUTY REPORT
</h1>
<div className="border rounded-2xl overflow-hidden mb-10">
<table className="w-full">
<tbody>
<tr className="bg-gray-100">
<td className="p-4 font-bold">
Origin Country
</td>
<td className="p-4">
{selectedRecord.origin_country}
</td>
<td className="p-4 font-bold">
Destination Country
</td>
<td className="p-4">
{selectedRecord.destination_country}
</td>
</tr>
<tr>
<td className="p-4 font-bold">
HSN Code
</td>
<td className="p-4">
{selectedRecord.hsn_code}
</td>
<td className="p-4 font-bold">
Product
</td>
<td className="p-4">
{selectedRecord.product}
</td>
</tr>
<tr className="bg-gray-100">
<td className="p-4 font-bold">
Quantity
</td>
<td className="p-4">
{selectedRecord.quantity}
</td>
<td className="p-4 font-bold">
Incoterm
</td>
<td className="p-4">
{selectedRecord.incoterm}
</td>
</tr>
</tbody>
</table>
</div>
<h2 className="text-3xl font-bold mb-6">
Cost Breakdown
</h2>
<div className="border rounded-2xl overflow-hidden mb-10">
<table className="w-full text-center">
<thead className="bg-gray-200">
<tr>
<th className="p-4">
Description
</th>
<th className="p-4">
USD
</th>
<th className="p-4">
{selectedRecord.destination_currency}
</th>
</tr>
</thead>
<tbody>
<tr>
<td className="p-4">
Unit Price
</td>
<td className="p-4">
USD {selectedRecord.unit_price_usd}
</td>
<td className="p-4">
{selectedRecord.destination_currency}
{" "}
{selectedRecord.unit_price_local}
</td>
</tr>
<tr className="bg-gray-50">
<td className="p-4">
Base Total
</td>
<td className="p-4">
USD {selectedRecord.base_total_usd}
</td>
<td className="p-4">
{selectedRecord.destination_currency}
{" "}
{selectedRecord.base_total_local}
</td>
</tr>
<tr>
<td className="p-4">
Shipping Cost
</td>
<td className="p-4">
USD {selectedRecord.shipping_cost_usd}
</td>
<td className="p-4">
{selectedRecord.destination_currency}
{" "}
{selectedRecord.shipping_cost_local}
</td>
</tr>
<tr className="bg-gray-50">
<td className="p-4">
Insurance Cost
</td>
<td className="p-4">
USD {selectedRecord.insurance_cost_usd}
</td>
<td className="p-4">
{selectedRecord.destination_currency}
{" "}
{selectedRecord.insurance_cost_local}
</td>
</tr>
<tr>
<td className="p-4 font-bold">
CIF Value
</td>
<td className="p-4 font-bold">
USD {selectedRecord.cif_value_usd}
</td>
<td className="p-4 font-bold">
{selectedRecord.destination_currency}
{" "}
{selectedRecord.cif_value_local}
</td>
</tr>
</tbody>
</table>
</div>
<h2 className="text-3xl font-bold mb-6">
Customs Tax Breakdown
</h2>
<div className="border rounded-2xl overflow-hidden mb-10">
<table className="w-full text-center">
<thead className="bg-red-100">
<tr>
<th className="p-4">
Tax Type
</th>
<th className="p-4">
Formula
</th>
<th className="p-4">
%
</th>
<th className="p-4">
USD
</th>
<th className="p-4">
Local
</th>
</tr>
</thead>
<tbody>
<tr>
<td className="p-4">
BCD
</td>
<td className="p-4">
CIF × Duty %
</td>
<td className="p-4">
{selectedRecord.bcd_percent}%
</td>
<td className="p-4">
USD {selectedRecord.bcd_amount_usd}
</td>
<td className="p-4">
{selectedRecord.destination_currency}
{" "}
{selectedRecord.bcd_amount_local}
</td>
</tr>
<tr className="bg-gray-50">
<td className="p-4">
SWS
</td>
<td className="p-4">
BCD × SWS %
</td>
<td className="p-4">
{selectedRecord.sws_percent}%
</td>
<td className="p-4">
USD {selectedRecord.sws_amount_usd}
</td>
<td className="p-4">
{selectedRecord.destination_currency}
{" "}
{selectedRecord.sws_amount_local}
</td>
</tr>
<tr>
<td className="p-4">
IGST
</td>
<td className="p-4">
Taxable Value × IGST %
</td>
<td className="p-4">
{selectedRecord.igst_percent}%
</td>
<td className="p-4">
USD {selectedRecord.igst_amount_usd}
</td>
<td className="p-4">
{selectedRecord.destination_currency}
{" "}
{selectedRecord.igst_amount_local}
</td>
</tr>
<tr className="bg-gray-50">
<td className="p-4">
VAT
</td>
<td className="p-4">
Taxable Value × VAT %
</td>
<td className="p-4">
{selectedRecord.vat_percent}%
</td>
<td className="p-4">
USD {selectedRecord.vat_amount_usd}
</td>
<td className="p-4">
{selectedRecord.destination_currency}
{" "}
{selectedRecord.vat_amount_local}
</td>
</tr>
<tr>
<td className="p-4">
Anti Dumping
</td>
<td className="p-4">
Taxable Value × ADD %
</td>
<td className="p-4">
{selectedRecord.anti_dumping_percent}%
</td>
<td className="p-4">
USD {selectedRecord.anti_dumping_amount_usd}
</td>
<td className="p-4">
{selectedRecord.destination_currency}
{" "}
{selectedRecord.anti_dumping_amount_local}
</td>
</tr>
<tr className="bg-gray-50">
<td className="p-4">
Safeguard
</td>
<td className="p-4">
Taxable Value × SGD %
</td>
<td className="p-4">
{selectedRecord.safeguard_percent}%
</td>
<td className="p-4">
USD {selectedRecord.safeguard_amount_usd}
</td>
<td className="p-4">
{selectedRecord.destination_currency}
{" "}
{selectedRecord.safeguard_amount_local}
</td>
</tr>
<tr className="bg-green-100 font-bold">
<td className="p-4">
TOTAL TAX
</td>
<td className="p-4">
-
</td>
<td className="p-4">
-
</td>
<td className="p-4">
USD {selectedRecord.total_tax_usd}
</td>
<td className="p-4">
{selectedRecord.destination_currency}
{" "}
{selectedRecord.total_tax_local}
</td>
</tr>
</tbody>
</table>
</div>
<div className="bg-green-100 p-8 rounded-2xl text-center">
<h2 className="text-3xl font-bold mb-4">
Final Landed Cost
</h2>
<h1 className="text-5xl font-bold text-green-700">
USD
{" "}
{selectedRecord.final_total_usd}
</h1>
<h2 className="text-4xl font-bold text-blue-700 mt-4">
{selectedRecord.destination_currency}
{" "}
{selectedRecord.final_total_local}
</h2>
</div>
</div>
                            <div className="flex gap-4">
                                <button
                                    onClick={downloadBill}
                                    className="flex-1 bg-black text-white py-4 rounded-xl font-bold"
                                >
                                    Download Report
                                </button>
                                <button
                                    onClick={() =>
                                        setShowModal(false)
                                    }
                                    className="flex-1 bg-red-500 text-white py-4 rounded-xl font-bold"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                )
            }

            {
                showPaymentForm && selectedRecord && (

                <PaymentForm
                    result={selectedRecord}
                    documentData={selectedDocument}
                    onClose={() =>
                        setShowPaymentForm(false)
                    }
                    onSaved={fetchPayments}
                />
                )
            }

            {
                showShipmentForm && selectedPayment && (

                <ShipmentForm
                    payment={selectedPayment}
                    onClose={() =>
                        setShowShipmentForm(false)
                    }
                    onSaved={() => {}}
                />
                )
            }

        </DashboardLayout>
    );
}