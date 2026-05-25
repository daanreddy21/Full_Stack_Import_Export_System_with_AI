import { useEffect, useState } from "react";
import ManagerLayout from "../layouts/DashboardLayout";
import API from "../services/api";
export default function ShipmentApprovals() {
    const [shipments, setShipments] = useState([]);
    const [loading, setLoading] = useState(false);
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
    const approveShipment = async (id) => {
        try {
            setLoading(true);
            const user = JSON.parse(
                localStorage.getItem("user")
            );
            await API.put(
                `/api/approve-shipment/${id}`,
                {
                    manager_name: user?.name
                }
            );
            fetchShipments();
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };
    const holdShipment = async (id) => {
        const reason = prompt(
            "Enter Hold Reason"
        );
        if (!reason) return;
        try {
            setLoading(true);
            await API.put(
                `/api/hold-shipment/${id}`,
                {
                    reason
                }
            );
            fetchShipments();
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };
    return (
        <ManagerLayout>
            <div className="p-6 bg-gray-100 min-h-screen">
                <div className="mb-8">
                    <h1 className="text-4xl font-bold">
                        Shipment Approvals
                    </h1>
                    <p className="text-gray-600 mt-2">
                        Manager shipment approval workflow
                    </p>
                </div>
                <div className="grid grid-cols-3 gap-6 mb-8">
                    <div className="bg-yellow-100 p-6 rounded-2xl shadow">
                        <h3>Pending Approval</h3>
                        <h1 className="text-5xl font-bold mt-3">
                            {shipments.filter(
                                    (item) =>
                                        item.approval_status === "Pending"
                                ).length}
                        </h1>
                    </div>
                    <div className="bg-green-100 p-6 rounded-2xl shadow">
                        <h3>Approved</h3>
                        <h1 className="text-5xl font-bold mt-3">
                            {shipments.filter(
                                    (item) =>
                                        item.approval_status === "Approved"
                                ).length}
                        </h1>
                    </div>
                    <div className="bg-red-100 p-6 rounded-2xl shadow">
                        <h3>On Hold</h3>
                        <h1 className="text-5xl font-bold mt-3">
                            {shipments.filter(
                                    (item) =>
                                        item.approval_status === "Hold"
                                ).length}
                        </h1>
                    </div>
                </div>
    <div className="bg-white rounded-2xl shadow overflow-x-scroll">
        <table className="min-w-[2200px] text-center">
            <thead className="bg-gray-100">
                <tr>
                    <th className="p-4">Tracking ID</th>
                    <th>Buyer</th>

<th>Origin Country</th>

<th>Origin Port</th>

<th>Destination Country</th>

<th>Destination Port</th>

<th>Product</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Approval</th>
                    <th className="p-4">Action</th>
                    </tr>
            </thead>
            <tbody>
    {
        shipments.map((item) => (
                <tr key={item.id}className="border-t hover:bg-gray-50">
                    <td className="p-4 font-bold">{item.tracking_id}</td>
<td>{item.buyer_name}</td>

<td className="text-blue-700 font-bold">
{item.origin_country}
</td>

<td>
{item.origin_port}
</td>

<td className="text-green-700 font-bold">
{item.destination_country}
</td>

<td>
{item.destination_port}
</td>

<td>{item.product}</td>
                    <td className="p-4">{item.shipment_status}</td>
                    <td className="p-4">
                {
                    item.approval_status === "Approved"
                ? (
                <span className="bg-green-100 text-green-700 px-4 py-2 rounded-full font-bold">
                    Approved
                </span>
                )
                    : item.approval_status === "Hold"
                ? (
                <span className="bg-red-100 text-red-700 px-4 py-2 rounded-full font-bold">
                Hold</span>
                ): (
                <span className="bg-yellow-100 text-yellow-700 px-4 py-2 rounded-full font-bold">
                    Pending
                    </span>
                    )}
                    </td>
                <td className="p-4">
                                            {
                    item.approval_status === "Pending"
                    && (<>
                <button onClick={() =>approveShipment(item.id)}disabled={loading}className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-xl font-bold">
                    Approve
                    </button>
                    <button
                    onClick={() =>holdShipment(item.id)}disabled={loading}className="bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-xl font-bold ml-2">
                    Hold
                    </button>
                        </>
)}
                    </td>
                </tr>
))}
            </tbody>
        </table>
                </div>
            </div>
        </ManagerLayout>
    );
}