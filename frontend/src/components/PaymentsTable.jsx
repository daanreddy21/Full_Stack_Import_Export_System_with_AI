import API from "../services/api";
import ShipmentForm from "../components/ShipmentForm";
export default function PaymentsTable({
    payments,
    fetchPayments,
    setShowShipmentForm,
    setSelectedPayment
}){
    const handlePay = async (id) => {
        try {
            await API.put(
                `/api/payments/pay/${id}`
            );
            const payment =
    payments.find(
        (item) => item.id === id
    );
const oldNotifications =
    JSON.parse(
        localStorage.getItem(
            "notifications"
        )
    ) || [];
const newNotification = {
    id: Date.now(),
    invoice: payment.invoice_number,
    message:"Payment completed successfully",
    time:new Date().toLocaleString()
};
localStorage.setItem(
    "notifications",
    JSON.stringify([
        newNotification,
        ...oldNotifications
    ])
);
            fetchPayments();
        } catch (error) {
            console.log(error);
        }
    };
const getCurrencySymbol = (currency) => {
    switch(currency){
        case "USD": return "$"; 
        case "INR": return "₹"; 
        case "EUR": return "€"; 
        case "GBP": return "£"; 
        case "JPY": return "¥"; 
        case "CNY": return "¥"; 
        case "AED": return "د.إ"; 
        case "SAR": return "﷼"; 
        case "QAR": return "﷼"; 
        case "KWD": return "د.ك"; 
        case "BHD": return ".د.ب"; 
        case "OMR": return "﷼"; 
        case "AUD": return "A$"; 
        case "CAD": return "C$"; 
        case "SGD": return "S$"; 
        case "NZD": return "NZ$"; 
        case "CHF": return "CHF"; 
        case "HKD": return "HK$"; 
        case "KRW": return "₩"; 
        case "THB": return "฿"; 
        case "MYR": return "RM"; 
        case "IDR": return "Rp"; 
        case "PHP": return "₱"; 
        case "VND": return "₫"; 
        case "PKR": return "₨"; 
        case "BDT": return "৳"; 
        case "LKR": return "Rs"; 
        case "NPR": return "₨";
        case "ZAR": return "R";  
        case "RUB": return "₽"; 
        case "TRY": return "₺"; 
        case "BRL": return "R$"; 
        case "MXN": return "Mex$"; 
        default:
            return currency;
    }
}
    return (
        <div className="bg-white rounded-2xl shadow p-6 mt-10">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold">
                    Payments History
                </h2>
            </div>
            <div className="w-full overflow-x-scroll overflow-y-hidden rounded-2xl border">

                <table className="min-w-[2400px] text-left">
                <thead className="bg-gray-100">
                    <tr>
                        <th className="p-4"> Invoice Number</th>
                        <th className="p-4"> Buyer Name</th>
                        <th className="p-4"> HSN Code</th>
                        <th className="p-4"> Product</th>
                        <th className="p-4">Origin Country</th>
                        <th className="p-4"> Destination Country</th>
                        <th className="p-4">USD Total</th>
                        <th className="p-4">Local Total</th>
                        <th className="p-4"> Due Date</th>
                        <th className="p-4"> Status</th>
                        <th className="p-4"> Paid Date</th>
                        <th className="p-4"> Alert</th>
                        <th className="p-4"> Action</th>    
                        <th className="p-4"> Shipment</th>                   
                    </tr>
                </thead>
                <tbody>
                    {
                    payments.map((item) => (
                        <tr key={item.id} className="border-b border-gray-200">
                            <td className="p-4"> {item.invoice_number}</td>
                            <td className="p-4">{item.buyer_name}</td>
                            <td className="p-4">{item.hsn_code}</td>
                            <td className="p-4">{item.product}</td>
                            <td className="p-4">{item.origin_country}</td>
                            <td className="p-4">{item.destination_country}</td>
                            <td className="p-4 font-bold text-green-700">
                            USD
                            {" "}
                            {item.final_total_usd}
                            </td>
                            <td className="p-4 font-bold text-blue-700">
                            {item.destination_currency}
                            {" "}
                            {item.final_total_local}</td>
                            <td className="p-4">
                                {item.due_date}
                            </td>
                            <td className="p-4">
                                {
                                item.payment_status === "Paid"
                                ? (
                                    <span className="text-green-700 font-bold">
                                        Paid
                                    </span>
                                )
                                : (
                                    <span className="text-yellow-600 font-bold">
                                        Pending
                                    </span>
                                )
                                }
                            </td>
                            <td className="p-4">
                                {
                                item.paid_date
                                ? (
                                    new Date(
                                        item.paid_date
                                    ).toLocaleDateString()
                                )
                                : (
                                    "-"
                                )
                                }
                            </td>
                            <td className="p-4">
                                {
                                item.overdue ? (
                                <span className="text-red-600 font-bold">
                                ⚠ Overdue by {
                                item.overdue_days
                                } days
                                </span>
                                ) : (
                                <span className="text-green-600 font-semibold">
                                On Time
                                </span>
                                )
                                }
                                </td>
                            <td className="p-4">
                                {
                                item.payment_status === "Pending"
                                ? (
                                    <button
                                        onClick={() =>
                                            handlePay(item.id)
                                        }
                                        className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg font-semibold">
                                        Pay
                                    </button>
                                )
                                : (
                                    <span className="text-gray-500 font-medium">
                                        Completed
                                    </span>
                                )
                                }
                            </td>
                            <td className="p-4">

                                {
                                item.payment_status === "Paid"
                                ? (

                                    <button

                                        onClick={() => {

                                            setSelectedPayment(item);

                                            setShowShipmentForm(true);
                                        }}

                                        className="bg-black text-white px-4 py-2 rounded-xl">
                                        Create Shipment
                                    </button>
                                )
                                : (

                                    <span className="text-gray-400">
                                        Pending Payment
                                    </span>

                                )
                                }

                                </td>
                        </tr>
                    ))
                    }
                </tbody>
            </table>
            </div>
        </div>
    );
}