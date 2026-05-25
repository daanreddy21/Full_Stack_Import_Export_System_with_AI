import { useEffect, useState } from "react";
import ShipmentTrackingMap from "../components/ShipmentTrackingMap";
import DashboardLayout from "../layouts/DashboardLayout";
import API from "../services/api";
export default function Shipments() {
    const [shipments, setShipments] = useState([]);
    const [showTrackingMap, setShowTrackingMap] = useState(false);
    const [selectedShipment, setSelectedShipment] = useState(null);
    useEffect(() => {
        fetchShipments();
    }, []);
    const fetchShipments = async () => {
        try {
            const response = await API.get(
                "/api/shipments"
            );
            setShipments(response.data);
        } catch (error) {
            console.log(error);
        }
    };
const markDelivered = async (id) => {
    try {
        await API.put(
            `/api/deliver-shipment/${id}`
        );
        fetchShipments();
    } catch (error) {
        console.log(error);
    }
};
    return (
        <DashboardLayout>
            <div className="p-6 bg-gray-100 min-h-screen">
                <div className="mb-8">
                    <h1 className="text-4xl font-bold"> Shipment Tracking </h1>
                    <p className="text-gray-600 mt-2">
                        End-to-end shipment management system
                    </p>
                </div>
                <div className="grid grid-cols-4 gap-6 mb-8">
                    <div className="bg-blue-100 p-6 rounded-2xl shadow">
                        <h3>Total Shipments</h3>
                        <h1 className="text-5xl font-bold mt-3">
                            {shipments.length}
                        </h1>
                    </div>
                    <div className="bg-yellow-100 p-6 rounded-2xl shadow">
                        <h3>Processing</h3>
                        <h1 className="text-5xl font-bold mt-3">
                            {
                        shipments.filter(
                                    (s) =>
                    s.shipment_status === "Processing"                            ).length
                            }
                        </h1>
                    </div>
                    <div className="bg-blue-100 p-6 rounded-2xl shadow">
            <h3>In Transit</h3>
                <h1 className="text-5xl font-bold mt-3">
                    {
                    shipments.filter(
                    (s) =>
                    s.shipment_status === "In Transit"
                    ).length
                    }
                </h1>
            </div>
            <div className="bg-green-100 p-6 rounded-2xl shadow">
            <h3>Delivered</h3>
            <h1 className="text-5xl font-bold mt-3">
                {
                shipments.filter(
                (s) =>
                s.shipment_status === "Delivered"
                ).length
                }
            </h1>
            </div>
            </div>
        <div className="bg-white rounded-2xl shadow overflow-x-scroll">
            <table className="min-w-[2200px] text-center">
                <thead className="bg-gray-100">
                <tr>
                <th className="p-4">  Tracking ID </th>
                <th className="p-4"> Buyer </th>

<th className="p-4">
Origin Country
</th>

<th className="p-4">
Origin Port
</th>

<th className="p-4">
Destination Country
</th>

<th className="p-4">
Destination Port
</th>

<th className="p-4"> Product </th>
                <th className="p-4"> Transport </th>
                <th className="p-4"> Status </th>
                <th className="p-4"> ETA </th>
                <th className="p-4"> Action </th>
            </tr>
            </thead>
            <tbody>
            {
            shipments.map((item, index) => (
            <tr key={index} className="border-t hover:bg-gray-50">
                <td className="p-4 font-bold">  {item.tracking_id} </td>
<td className="p-4">
{item.buyer_name}
</td>

<td className="p-4 text-blue-700 font-bold">
{item.origin_country}
</td>

<td className="p-4">
{item.origin_port}
</td>

<td
className={
item.is_delayed
? "p-4 text-red-600 font-bold"
: "p-4 text-green-600 font-bold"
}
>
{item.destination_country}
</td>

<td className="p-4">
{item.destination_port}
</td>

<td className="p-4">
{item.product}
</td>
            <td className="p-4"> {item.transport_mode} </td>
<td className="p-4">
    <div className="flex flex-col gap-2 items-center">{
            item.shipment_status === "Delivered" ? (
                <span className="bg-green-100 text-green-700 px-4 py-2 rounded-full font-bold">
                    Delivered
                </span>
            ) : item.shipment_status === "Picked Up" ? (
                <span className="bg-purple-100 text-purple-700 px-4 py-2 rounded-full font-bold">
                    Picked Up
                </span>
            ) : item.shipment_status === "In Transit" ? (
                <span className="bg-blue-100 text-blue-700 px-4 py-2 rounded-full font-bold">
                    In Transit
                </span>
            ) : item.shipment_status === "Customs Clearance" ? (
                <span className="bg-orange-100 text-orange-700 px-4 py-2 rounded-full font-bold">
                    Customs Clearance
                </span>
            ) : (
                <span className="bg-yellow-100 text-yellow-700 px-4 py-2 rounded-full font-bold">
                    Processing
                </span>
            )
        }
        {
            item.shipment_status === "Delivered" && (
                <span className="bg-green-50 text-green-700 px-4 py-1 rounded-full text-sm font-bold border border-green-300">
                    Shipment Successfully Delivered
                </span>
            )
        }
        {
            item.is_delayed &&
            item.shipment_status !== "Delivered" && (
                <span className="bg-red-100 text-red-700 px-4 py-1 rounded-full text-sm font-bold">
                    Delayed ({item.delay_days} days)
                </span>
            )
        }
        {
            !item.is_delayed &&
            item.shipment_status !== "Delivered" && (
                <span className="bg-green-100 text-green-700 px-4 py-1 rounded-full text-sm font-bold">
                    On Time
                </span>
            )
        }

    </div>
</td>
            <td className="p-4"> {item.estimated_delivery} </td>
<td className="p-4">
{
item.approval_status === "Approved"
? (
    <button
        onClick={() => {
            setSelectedShipment(item);
            setShowTrackingMap(true);
        }}
        className="bg-blue-500 hover:bg-blue-600 text-white px-5 py-2 rounded-xl font-bold"
    >
        Track Shipment
    </button>
) : (
    <span className="bg-yellow-100 text-yellow-700 px-4 py-2 rounded-full font-bold">
        Waiting Manager Approval
    </span>
)
}
{
item.approval_status === "Approved"
? (
    item.shipment_status !== "Delivered" && (
        <button
            onClick={() => markDelivered(item.id)}
            className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-xl font-bold ml-2"
        >
            Delivered
        </button>
    )
)
: (
    item.shipment_status !== "Delivered" && (
        <button
            disabled
            className="bg-gray-300 text-gray-600 px-5 py-2 rounded-xl font-bold ml-2 cursor-not-allowed"
        >
            Delivered
        </button>
    )
)
}
</td>
            </tr>
            ))}
            </tbody>
                </table>
                </div>
            </div>
            {
            showTrackingMap && selectedShipment && (
                <ShipmentTrackingMap
                    shipment={selectedShipment}
                    onClose={() =>
                        setShowTrackingMap(false)
                    }

                />
            )
            }
        </DashboardLayout>
    );
}