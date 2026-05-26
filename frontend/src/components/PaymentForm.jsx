import { useState } from "react";
import API from "../services/api";
export default function PaymentForm({result, documentData, onClose, onSaved}) {
    const [destinationCountry,setDestinationCountry]= useState(result.destination_country || "");
    const [dueDate, setDueDate] =useState("");
    const handleSavePayment = async () => {
        try {
            await API.post("/api/payments",{
                invoice_number:documentData.invoice_number,
                buyer_name:documentData.buyer_name,
                hsn_code:result.hsn_code,
                product:result.product,
                category:result.category,
                destination_country:destinationCountry,
                origin_country:result.origin_country,
                final_total_usd:result.final_total_usd,
                final_total_local:result.final_total_local,
                destination_currency:result.destination_currency,
                due_date:dueDate
            });
            alert("Payment Saved Successfully");
            const oldNotifications =
    JSON.parse(
        localStorage.getItem(
            "notifications"
        )
    ) || [];
const newNotification = {
    id: Date.now(),
    invoice:
        documentData.invoice_number,
    message:
        "Payment created successfully",
    time:
        new Date().toLocaleString()
};
localStorage.setItem(
    "notifications",
    JSON.stringify([
        newNotification,...oldNotifications])
);
            onSaved();
            onClose();
        } catch (error) {
            console.log(error);
        }
    };
    return (
         <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white w-[700px] rounded-2xl p-8">
                <h2 className="text-3xl font-bold mb-8">
                    Payment Application Form
                </h2>
                <div className="grid grid-cols-2 gap-5">
                    <input value={documentData?.invoice_number || ""} disabled className="border p-3 rounded-xl bg-gray-100" />
                    <input value={documentData?.buyer_name || ""} disabled className="border p-3 rounded-xl bg-gray-100" />
                    <input value={result.hsn_code} disabled className="border p-3 rounded-xl bg-gray-100" />
                    <input value={result.product} disabled className="border p-3 rounded-xl bg-gray-100" />
                    <input value={result.category} disabled className="border p-3 rounded-xl bg-gray-100" />
                <input value={result.origin_country}disabled className="border p-3 rounded-xl bg-gray-100"/>
<input
placeholder="Destination Country"
value={
    destinationCountry
    ||
    result.destination_country
    ||
    ""
}
onChange={(e) =>
setDestinationCountry(
    e.target.value
)
}
className="border p-3 rounded-xl"/>
                <input value={`USD ${result.final_total_usd}`}disabled className="border p-3 rounded-xl bg-gray-100"/>
            <input value={`${result.destination_currency} ${result.final_total_local}`}disabled className="border p-3 rounded-xl bg-gray-100"/>
                    <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} className="border p-3 rounded-xl" />
                </div>
                <div className="flex gap-4 mt-8">
                    <button onClick={handleSavePayment} className="flex-1 bg-black text-white py-4 rounded-xl font-bold">Save Payment</button>
                    <button onClick={onClose} className="flex-1 bg-red-500 text-white py-4 rounded-xl font-bold">Close</button>
                </div>
            </div>
        </div>
    );
}


                    