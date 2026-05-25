import { useEffect, useState } from "react";
import API from "../services/api";
export default function ShipmentForm({
    payment,
    onClose,
    onSaved
}) {
    const [shippingCompany, setShippingCompany] = useState("");
    const [containerNumber, setContainerNumber] = useState("");
    const [originPort, setOriginPort] = useState("");
    const [destinationPort, setDestinationPort] = useState("");
    const [originCountry,
setOriginCountry]
= useState(
    payment.origin_country || ""
);
const [destinationCountry,
setDestinationCountry]
= useState(
    payment.destination_country || ""
);
    const [transportMode, setTransportMode] = useState("");
    const [estimatedDelivery, setEstimatedDelivery] = useState("");
    const [remarks, setRemarks] = useState("");
const countryPorts = {
    "India": [
        "Mumbai Port",
        "Chennai Port",
        "Vizag Port",
        "Kandla Port",
        "Cochin Port"
    ],

    "USA": [
        "Los Angeles Port",
        "New York Port",
        "Houston Port",
        "Miami Port"
    ],
    "China": [
        "Shanghai Port",
        "Shenzhen Port",
        "Guangzhou Port",
        "Ningbo Port"
    ],
    "UAE": [
        "Jebel Ali Port",
        "Dubai Port",
        "Abu Dhabi Port"
    ],
    "Germany": [
        "Hamburg Port",
        "Bremerhaven Port",
        "Wilhelmshaven Port"
    ],
    "Singapore": [
        "Singapore Port"
    ],
    "Japan": [
        "Tokyo Port",
        "Osaka Port",
        "Yokohama Port"
    ],
    "Australia": [
        "Sydney Port",
        "Melbourne Port",
        "Brisbane Port"
    ],
    "South Korea": [
        "Busan Port",
        "Incheon Port"
    ],
    "Canada": [
        "Vancouver Port",
        "Montreal Port"
    ],
    "Brazil": [
        "Santos Port",
        "Rio de Janeiro Port"
    ],
    "United Kingdom": [
        "Port of London",
        "Port of Liverpool"
    ],
    "France": [
        "Le Havre Port",
        "Marseille Port"
    ],
    "Netherlands": [
        "Rotterdam Port",
        "Amsterdam Port"
    ],
    "Saudi Arabia": [
        "Jeddah Islamic Port",
        "King Abdulaziz Port"
    ]
};
    const [analysis, setAnalysis] = useState(null);
    const [loading, setLoading] = useState(false);
    const handleAnalyzeShipment = async () => {
        if (
            !shippingCompany ||
            !containerNumber ||
            !originPort ||
            !destinationPort ||
            !transportMode ||
            !estimatedDelivery
        ) {
            alert("Please fill all shipment details");
            return;
        }
        setLoading(true);
        try {
            const response = await API.post("/analyze-shipment",{
                product: payment.product,
                hsn_code: payment.hsn_code,
                destination_country: payment.destination_country,                    destination_port: destinationPort,
                origin_port: originPort,
                transport_mode: transportMode,
                estimated_delivery: estimatedDelivery,
               shipment_value: payment.amount
                });
            setAnalysis(
                response.data
            );
            if (
    response.data.possible_issues?.length > 0
) {
    const oldNotifications =
        JSON.parse(
            localStorage.getItem(
                "notifications"
            )
        ) || [];
    const riskNotification = {
        id: Date.now(),
        invoice:payment.invoice_number,
        message:"AI detected shipment risks",
        time:new Date().toLocaleString()
    };
    localStorage.setItem(
        "notifications",
        JSON.stringify([
            riskNotification,
            ...oldNotifications
        ])
    );
}
        } catch (error) {
            console.log(error);
        } finally {
        setLoading(false);
}};
    const handleCreateShipment = async () => {
        try {
            await API.post("/create-shipment",{
                invoice_number: payment.invoice_number,
                buyer_name: payment.buyer_name,
                country: payment.destination_country,
                origin_country:
    originCountry,

destination_country:
    destinationCountry,
                hsn_code: payment.hsn_code,
                product: payment.product,
                shipment_value: payment.amount,
                shipping_company: shippingCompany,                    container_number: containerNumber,
                origin_port: originPort,
                destination_port: destinationPort,
                transport_mode: transportMode,
                estimated_delivery: estimatedDelivery,
                remarks: remarks
                });
            alert("Shipment Created Successfully");
        const oldNotifications =
    JSON.parse(
        localStorage.getItem(
            "notifications"
        )
    ) || [];
const shipmentNotification = {
    id: Date.now(),
    invoice:payment.invoice_number,
    message:"Shipment created successfully",
    time: new Date().toLocaleString()
};
localStorage.setItem(
    "notifications",
    JSON.stringify([
        shipmentNotification,
        ...oldNotifications
    ])
);
            onSaved();
            onClose();
        } catch (error) {
            console.log(error);
        }
    };
    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-6">
            <div className="bg-white max-w-7xl w-full rounded-[32px] shadow-2xl overflow-hidden">
                <div className="grid grid-cols-1 lg:grid-cols-2">
                <div className="p-10 border-r border-gray-200 max-h-[850px] overflow-y-auto">
                <div className="mb-10">
                    <h1 className="text-3xl font-black text-gray-900 leading-tight">
                                Smart Shipment
                                Intelligence
                            </h1>
                            <p className="text-gray-500 mt-4 text-lg leading-8">
                                Analyze customs verification,
                                shipment routing, geopolitical
                                conditions, and delivery impact
                                before confirming cargo movement.
                            </p>
                        </div>
                        <div className="space-y-5">
                            <input value={payment.invoice_number} disabled className="w-full border border-gray-200 bg-gray-100 p-4 rounded-2xl shadow-sm"/>
                            <input value={payment.buyer_name} disabled className="w-full border border-gray-200 bg-gray-100 p-4 rounded-2xl shadow-sm"/>
                            <input value={payment.product} disabled className="w-full border border-gray-200 bg-gray-100 p-4 rounded-2xl shadow-sm"/>
                            <input value={payment.hsn_code} disabled className="w-full border border-gray-200 bg-gray-100 p-4 rounded-2xl shadow-sm"/>
                            <input placeholder="Shipping Company"value={shippingCompany}onChange={(e) =>setShippingCompany(e.target.value)}
                                className="w-full border border-gray-200 bg-white p-4 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-black"/>
                            <input placeholder="Container Number"value={containerNumber}onChange={(e) =>setContainerNumber(e.target.value)}
                                className="w-full border border-gray-200 bg-white p-4 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-black"/>
<input
value={originCountry}
disabled
className="w-full border border-gray-200 bg-gray-100 p-4 rounded-2xl shadow-sm"
/>
<select
value={originPort}
onChange={(e) =>
setOriginPort(
    e.target.value
)
}
className="w-full border border-gray-200 bg-white p-4 rounded-2xl shadow-sm"
>
<option value="">
Select Origin Port
</option>
{
countryPorts[
originCountry
]?.map((port, index) => (
<option
key={index}
value={port}
>
{port}
</option>
))
}
<option value="Manual">
Other / Manual Entry
</option>
</select>
<input
value={destinationCountry}
disabled
className="w-full border border-gray-200 bg-gray-100 p-4 rounded-2xl shadow-sm"
/>
<select
    value={destinationPort}
    onChange={(e) =>
        setDestinationPort(e.target.value)}
    className="w-full border border-gray-200 bg-white p-4 rounded-2xl shadow-sm">
    <option value="">
        Select Destination Port
    </option>{
        countryPorts[
            destinationCountry
        ]?.map((port, index) => (
            <option
                key={index}
                value={port}
            >
                {port}
            </option>
        ))}
    <option value="Manual">
        Other / Manual Entry
    </option>
</select>{
    destinationPort === "Manual" && (
        <input
            placeholder="Enter Port Name"
            onChange={(e) =>
                setDestinationPort(e.target.value)
            }
            className="w-full border border-gray-200 bg-white p-4 rounded-2xl shadow-sm mt-3"/>
    )
}
                            <select
                                value={transportMode}
                                onChange={(e) =>setTransportMode(e.target.value)}
                                className="w-full border border-gray-200 bg-white p-4 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-black">
                                <option value=""> Select Transport</option>
                                <option value="Air">Air Cargo</option>
                                <option value="Sea">Sea Cargo</option>
                                <option value="Road">Road Transport</option>
                            </select>
                            <input
                                type="date"
                                value={estimatedDelivery}
                                onChange={(e) =>setEstimatedDelivery(e.target.value)}
                                className="w-full border border-gray-200 bg-white p-4 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-black"/>
                            <textarea
                                placeholder="Shipment Remarks"
                                value={remarks}
                                onChange={(e) =>setRemarks(e.target.value)}
                                className="w-full border border-gray-200 bg-white p-4 rounded-2xl h-32 shadow-sm focus:outline-none focus:ring-2 focus:ring-black"/>
                        </div>
                        <div className="flex gap-4 mt-8">
                            <button
                                onClick={handleAnalyzeShipment}
                                className="flex-1 bg-black hover:bg-gray-900 text-white py-4 rounded-2xl font-bold text-lg transition-all duration-300">
                                Analyze Shipment
                            </button>
                            <button
                                onClick={onClose}
                                className="flex-1 bg-red-500 hover:bg-red-600 text-white py-4 rounded-2xl font-bold text-lg transition-all duration-300">
                                Close
                            </button>
                        </div>
                    </div>
                    <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-10 max-h-[850px] overflow-y-auto">
                        {
                            loading ? (
                                <div className="flex flex-col items-center justify-center h-full">
                                    <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-black mb-8"></div>
                                    <h1 className="text-4xl font-black">
                                        Analyzing Shipment...
                                    </h1>
                                    <p className="text-gray-500 text-center mt-8 leading-9 text-lg">
                                        Checking customs verification...
                                        <br />
                                        Evaluating shipment routing...
                                        <br />
                                        Analyzing destination conditions...
                                        <br />
                                        Predicting delivery impacts...
                                        <br />
                                        Checking geopolitical situations...
                                    </p>
                                </div>
                            ) : analysis ? (
<div className="bg-white border border-gray-200 rounded-2xl p-6">
    <h1 className="text-lg font-semibold text-gray-900">Shipment Intelligence</h1>
    <div className="border-t border-gray-200 my-4"></div>
    <div className="space-y-4 text-[13px] leading-7 text-gray-700">
        <p>{analysis.shipment_advisory}</p>
        <p>{analysis.customs_observation}</p>
        <p>{analysis.delivery_expectation}</p>
        <p>
    Tax & Duty:
    {" "}
    {analysis.tax_observation}
</p>
<p> Port Analysis:{" "}{analysis.port_analysis}</p>
        <p>Recommendation:{" "}{analysis.recommendation}</p>
    </div>
    <div className="border-t border-gray-200 my-5"></div>
    <div>
        <h2 className="text-sm font-semibold text-gray-900 mb-4">
            Verification Report
        </h2>
        <div className="space-y-2 text-[12px] text-gray-700">
            <div className="flex items-center gap-2">
                <p> - Payment details verified</p>
            </div>
            <div className="flex items-center gap-2">
            <p>- Cargo declaration matched</p>
            </div>
            <div className="flex items-center gap-2">
            <p>- HSN classification validated</p>
            </div>
            <div className="flex items-center gap-2">
            <p>- Container information verified</p>
            </div>
            <div className="flex items-center gap-2">
                <p>- Shipment route checked</p>
            </div>
            <div className="flex items-center gap-2">
            <span className="text-orange-500">
                    ⚠
            </span>
            <p>Customs verification possible</p>
            </div>
            <div className="flex items-center gap-2">
            <span className="text-orange-500">
                ⚠
            </span>
            <p>Regional congestion detected</p>
            </div>
        </div>
    </div>
    {
        analysis.possible_issues?.length > 0 && (
            <>
                <div className="border-t border-gray-200 my-5"></div>
                <div>
                    <h2 className="text-sm font-semibold text-gray-900 mb-4">Possible Issues</h2>
                    <div className="space-y-2 text-[12px] text-gray-700">
                        {
                            analysis.possible_issues.map(
                                (
                                    issue,
                                    index
                                ) => (
                                    <div key={index} className="flex items-center gap-2">
                                        <span>•</span>
                                        <p>{issue}</p>
                                    </div>
                                )
                            )
                        }
                    </div>
                </div>
            </>
        )
    }
    <button
        onClick={handleCreateShipment}
        className="w-full mt-6 bg-black text-white py-3 rounded-xl text-sm font-medium">
        Continue
    </button>
</div>
) : (
<div className="flex flex-col justify-center h-full">
<div className="bg-white rounded-[32px] p-10 shadow-sm border border-gray-200">
<h3 className="text-4xl font-black leading-tight">AI Shipment Intelligence</h3>
        <p className="text-gray-500 leading-9 text-xl mt-8">
            Fill shipment details and click
        <span className="font-bold text-black">
            {" "}Analyze Shipment{" "}
                </span>
                to verify customs conditions,
                shipment routing, geopolitical
                impact, delivery timelines,
                and cargo movement risks.
</p>
<div className="mt-10 space-y-4">
<div className="bg-gray-50 p-5 rounded-2xl text-l">
Customs verification checks
            </div>
                <div className="bg-gray-50 p-5 rounded-2xl text-l">
                Shipment route conditions
</div>
<div className="bg-gray-50 p-5 rounded-2xl text-l">
Geopolitical shipment impact
</div>
<div className="bg-gray-50 p-5 rounded-2xl text-l">
Delivery delay prediction
</div>
<div className="bg-gray-50 p-5 rounded-2xl text-l">
Port congestion analysis
</div>
</div>
</div>
</div>
)
}
</div>
</div>
        </div>
        </div>
    );
}