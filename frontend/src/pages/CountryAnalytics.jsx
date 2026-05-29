import { useEffect, useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import API from "../services/api";
export default function CountryAnalytics() {
    const [data, setData] = useState(null);
    const [view, setView] = useState("countries");
    const [selectedCountry, setSelectedCountry] =useState(null);
    const [countryDetails, setCountryDetails] =useState(null);
    const [shipmentDetails, setShipmentDetails] =useState(null);
    const [selectedShipment, setSelectedShipment] =useState(null);
    const [shipmentFilter, setShipmentFilter] = useState("all");
    const [activeTab, setActiveTab] =
useState("payment");
    const [breadcrumbs, setBreadcrumbs] = useState(["Country Analytics"]);
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
const openCountry = async (country) => {
  try {
    const response =
      await API.get(
        `/api/country-details/${country}`
      );
    setCountryDetails(response.data);
    setSelectedCountry(country);
    setBreadcrumbs([
  "Country Analytics",
  country
]);

setView("country");
  } catch(error) {
    console.log(error);
  }
};
const openShipment = async (
  trackingId
) => {
  try {
    const response =
      await API.get(
        `/api/shipment-details/${trackingId}`
      );
    setShipmentDetails(
      response.data
    );
    setSelectedShipment(
      trackingId
    );
setBreadcrumbs([
  "Country Analytics",
  selectedCountry,
  trackingId
]);

setView("shipment");
  } catch(error) {
    console.log(error);
  }
};
if (
  view === "country" &&
  countryDetails
) {
  return (
    <DashboardLayout>
      <div className="p-6">
        <div className="mb-4 flex items-center gap-2 text-sm font-semibold">

  <span className="text-gray-500">
    Country Analytics
  </span>

  <span className="text-gray-400">
    &gt;
  </span>

  <span className="text-blue-600">
    {selectedCountry}
  </span>

</div>
        <button
          onClick={() =>
            setView("countries")
          }
          className="
          bg-black
          text-white
          px-4
          py-2
          rounded
          mb-6
          "
        >
          ← Back
        </button>
<h1 className="text-4xl font-bold mb-6">
  {selectedCountry} Analytics
</h1>

<div className="grid grid-cols-3 gap-6 mb-8">
  <div className="bg-white p-6 rounded-xl shadow">
    <h3 className="text-gray-500">
      Total Shipments
    </h3>
    <h1 className="text-4xl font-bold mt-3">
      {countryDetails.shipments?.length || 0}
    </h1>
  </div>
  <div className="bg-white p-6 rounded-xl shadow">
    <h3 className="text-gray-500">
      Total Payments
    </h3>
    <h1 className="text-4xl font-bold mt-3">
      {countryDetails.payments?.length || 0}
    </h1>
  </div>
  <div className="bg-white p-6 rounded-xl shadow">
    <h3 className="text-gray-500">
      Risk Clients
    </h3>
    <h1 className="text-4xl font-bold mt-3">
      {countryDetails.risks?.length || 0}
    </h1>
  </div>
</div>
<div className="bg-white rounded-xl shadow p-6">

  <h2 className="text-2xl font-bold mb-4">
    Shipments
  </h2>

  <table className="w-full table-fixed">

    <thead className="bg-gray-100">

      <tr>
        <th className="p-3 ">Tracking ID</th>
        <th className="p-3">Buyer</th>
        <th className="p-3">Status</th>
        <th className="p-3">Delayed</th>
      </tr>

    </thead>

<tbody>

{
countryDetails.shipments
?.filter((shipment) => {

  if (
    shipmentFilter === "all"
  )
    return true;

  if (
    shipmentFilter === "delayed"
  )
    return shipment.is_delayed;

  if (
    shipmentFilter === "delivered"
  )
    return (
      shipment.shipment_status ===
      "Delivered"
    );

  if (
    shipmentFilter === "pending"
  )
    return (
      shipment.shipment_status !==
      "Delivered"
    );

  return true;

})
.map((shipment) => (

<tr
  key={shipment.id}
  className="border-t text-center"
>

<td className="p-3">

<button
 onClick={() =>
   openShipment(
     shipment.tracking_id
   )
 }
 className="
 text-blue-600
 font-bold
 hover:underline
 "
>
 {shipment.tracking_id}
</button>

</td>

<td className="p-3 text-center">
  {shipment.buyer_name}
</td>

<td className="p-3 text-center">
  {shipment.shipment_status}
</td>

<td className="p-3 text-center">
  {shipment.is_delayed
    ? "Yes"
    : "No"}
</td>

</tr>

))
}

</tbody>

  </table>

</div>
      </div>
    </DashboardLayout>
  );
}
if (
  view === "shipment"
  &&
  shipmentDetails
) {

  return (

    <DashboardLayout>

<div className="p-6">

 <div className="mb-6 flex items-center gap-2 text-sm font-semibold">

    <span className="text-gray-500">
      Country Analytics
    </span>

    <span className="text-gray-400">
      &gt;
    </span>

    <span className="text-gray-500">
      {selectedCountry}
    </span>

    <span className="text-gray-400">
      &gt;
    </span>

    <span className="text-blue-600">
      {selectedShipment}
    </span>

  </div>

<button
  onClick={() =>
    setView("country")
  }
  className="
  bg-black
  text-white
  px-4
  py-2
  rounded
  mb-6
  "
>
  ← Back
</button>

<h1 className="text-4xl font-bold mb-6">
  {selectedShipment}
</h1>
<div className="bg-white rounded-xl shadow p-6 mb-8">
  <h2 className="text-2xl font-bold mb-4">
    Shipment Information
  </h2>
  <div className="grid grid-cols-2 gap-6">
    <div>
      <strong>Tracking ID:</strong><br/>
      {shipmentDetails.shipment?.tracking_id}
    </div>
    <div>
      <strong>Invoice Number:</strong><br/>
      {shipmentDetails.shipment?.invoice_number}
    </div>
    <div>
      <strong>Buyer:</strong><br/>
      {shipmentDetails.shipment?.buyer_name}
    </div>
    <div>
      <strong>Status:</strong><br/>
      {shipmentDetails.shipment?.shipment_status}
    </div>
    <div>
      <strong>Container:</strong><br/>
      {shipmentDetails.shipment?.container_number}
    </div>
    <div>
      <strong>Transport Mode:</strong><br/>
      {shipmentDetails.shipment?.transport_mode}
    </div>
    <div>
      <strong>Origin Port:</strong><br/>
      {shipmentDetails.shipment?.origin_port}
    </div>
    <div>
      <strong>Destination Port:</strong><br/>
      {shipmentDetails.shipment?.destination_port}
    </div>
  </div>
</div>
<div className="bg-white rounded-xl shadow p-6 mb-8">

  <h2 className="text-2xl font-bold mb-8">
    Shipment Timeline
  </h2>

  <div className="flex items-center justify-between">

    <div className="flex flex-col items-center">
      <div className="w-10 h-10 rounded-full bg-green-500 text-white flex items-center justify-center">
        ✓
      </div>
      <span className="mt-2 text-sm">
        Created
      </span>
    </div>

    <div className="flex-1 h-1 bg-green-500 mx-2"></div>

    <div className="flex flex-col items-center">
      <div className="w-10 h-10 rounded-full bg-green-500 text-white flex items-center justify-center">
        ✓
      </div>
      <span className="mt-2 text-sm">
        Processing
      </span>
    </div>

    <div className="flex-1 h-1 bg-green-500 mx-2"></div>

    <div className="flex flex-col items-center">
      <div className="w-10 h-10 rounded-full bg-green-500 text-white flex items-center justify-center">
        ✓
      </div>
      <span className="mt-2 text-sm">
        Picked Up
      </span>
    </div>

    <div className="flex-1 h-1 bg-yellow-500 mx-2"></div>

    <div className="flex flex-col items-center">
      <div className="w-10 h-10 rounded-full bg-yellow-500 text-white flex items-center justify-center">
        ⏳
      </div>
      <span className="mt-2 text-sm">
        {shipmentDetails.shipment?.shipment_status}
      </span>
    </div>

    <div className="flex-1 h-1 bg-gray-300 mx-2"></div>

    <div className="flex flex-col items-center">
      <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center">
        ○
      </div>
      <span className="mt-2 text-sm">
        Delivered
      </span>
    </div>

  </div>

</div>
<div className="flex gap-4 mb-6">

<button
  onClick={() => setActiveTab("payment")}
  className={`px-4 py-2 rounded ${
    activeTab === "payment"
      ? "bg-blue-600 text-white"
      : "bg-gray-200"
  }`}
>
Payment
</button>

<button
  onClick={() => setActiveTab("risk")}
  className={`px-4 py-2 rounded ${
    activeTab === "risk"
      ? "bg-red-600 text-white"
      : "bg-gray-200"
  }`}
>
Risk
</button>
<button
  onClick={() => setActiveTab("document")}
  className={`px-4 py-2 rounded ${
    activeTab === "document"
      ? "bg-green-600 text-white"
      : "bg-gray-200"
  }`}
>
Document
</button>
</div>
{
activeTab === "payment" &&
shipmentDetails.payment && (

<div className="bg-white p-6 rounded-xl shadow">

<h2 className="text-2xl font-bold mb-4">
Payment Details
</h2>

<p>
<strong>Invoice:</strong>
{" "}
{shipmentDetails.payment.invoice_number}
</p>

<p>
<strong>Buyer:</strong>
{" "}
{shipmentDetails.payment.buyer_name}
</p>

<p>
<strong>Status:</strong>
{" "}
{shipmentDetails.payment.payment_status}
</p>

<p>
<strong>Amount:</strong>
{" "}
{shipmentDetails.payment.final_total_usd}
</p>

</div>

)}
{
activeTab === "risk" &&
shipmentDetails.risk && (

<div className="bg-white p-6 rounded-xl shadow">

<h2 className="text-2xl font-bold mb-4">
Risk Analysis
</h2>

<p>
<strong>Buyer:</strong>
{" "}
{shipmentDetails.risk.buyer_name}
</p>

<p>
<strong>Risk Level:</strong>
{" "}
{shipmentDetails.risk.risk_level}
</p>

<p>
<strong>Reasons:</strong>
{" "}
{shipmentDetails.risk.risk_reasons}
</p>

<p>
<strong>Recommendation:</strong>
{" "}
{shipmentDetails.risk.recommendation}
</p>

</div>

)}
{
activeTab === "document" &&
shipmentDetails.document && (

<div className="bg-white p-6 rounded-xl shadow">

<h2 className="text-2xl font-bold mb-4">
Document Details
</h2>

<p>
<strong>Invoice:</strong>
{" "}
{shipmentDetails.document.invoice_number}
</p>

<p>
<strong>Buyer:</strong>
{" "}
{shipmentDetails.document.buyer_name}
</p>

<p>
<strong>Product:</strong>
{" "}
{shipmentDetails.document.product}
</p>

<p>
<strong>HSN:</strong>
{" "}
{shipmentDetails.document.hsn_code}
</p>

<p>
<strong>Amount:</strong>
{" "}
{shipmentDetails.payment.final_total_usd}
</p>

</div>

)}
      </div>
    </DashboardLayout>
  );
}
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
        <div
 key={index}
 onClick={() =>
   openCountry(
      country.country
   )
 }
 className="
 bg-white
 rounded-3xl
 shadow-xl
 p-8
 border
 cursor-pointer
 hover:shadow-2xl
 hover:scale-105
 transition
 "
>
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
<div className="grid grid-cols-3 gap-4">

<div
  onClick={() => setShipmentFilter("delivered")}
  className="bg-green-100 p-4 rounded-2xl text-center cursor-pointer hover:shadow-lg"
>
  <h3 className="font-bold">Delivered</h3>
  <h1 className="text-3xl font-bold mt-2">
    {country.delivered}
  </h1>
</div>

<div
  onClick={() => setShipmentFilter("pending")}
  className="bg-yellow-100 p-4 rounded-2xl text-center cursor-pointer hover:shadow-lg"
>
  <h3 className="font-bold">Pending</h3>
  <h1 className="text-3xl font-bold mt-2">
    {country.pending_shipments}
  </h1>
</div>

<div
  onClick={() => setShipmentFilter("delayed")}
  className="bg-red-100 p-4 rounded-2xl text-center cursor-pointer hover:shadow-lg"
>
  <h3 className="font-bold">Delayed</h3>
  <h1 className="text-3xl font-bold mt-2">
    {country.delayed}
  </h1>
</div>

</div>
</div>                         
))}
</div>  
</div>
        </DashboardLayout>
    );

}