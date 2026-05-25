import { useEffect, useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import API from "../services/api";

export default function Duty() {

    const [country, setCountry]
    = useState("");
const [originCountry,
setOriginCountry]
= useState("");

const [destinationCountry,
setDestinationCountry]
= useState("");
    const [hsnCode, setHsnCode]
    = useState("");

    const [product, setProduct]
    = useState("");

    const [category, setCategory]
    = useState("");

    const [quantity, setQuantity]
    = useState("");

    const [productPrice, setProductPrice]
    = useState("");

    const [hsnCodes, setHsnCodes]
    = useState([]);

    const [result, setResult]
    = useState(null);

    const [showCountryDropdown,
        setShowCountryDropdown]
    = useState(false);
    const [showDestinationDropdown,
    setShowDestinationDropdown]
= useState(false);

    const [showHSNDropdown,
        setShowHSNDropdown]
    = useState(false);

    const countries = [
        "India",
        "USA",
        "UAE",
        "China",
        "Germany",
        "Japan",
        "Singapore",
        "Australia",
        "Canada",
        "UK",
        "France",
        "Italy",
        "South Korea",
        "Brazil",
        "Mexico"
    ];

    useEffect(() => {

        fetchHSNCodes();

    }, []);

    const fetchHSNCodes = async () => {

        try {

            const response =
                await API.get(
                    "/api/hsn-codes"
                );

            setHsnCodes(
                response.data
            );

        } catch (error) {

            console.log(error);
        }
    };

    const handleHSNChange = async (
        value
    ) => {

        const selectedHSN =
            typeof value === "string"
                ? value
                : value.target.value;

        setHsnCode(selectedHSN);

        try {

            const response =
                await API.get(
                    `/api/hsn-details/${selectedHSN}`
                );

            setProduct(
                response.data.product || ""
            );

            setCategory(
                response.data.category || ""
            );

        } catch {

            setProduct("");

            setCategory("");
        }
    };

    const handleCalculate =
        async () => {

        try {

            const response =
await API.post(
    "/api/calculate-duty",
    {

        origin_country:
            originCountry,

        destination_country:
            destinationCountry,

        country,

        hsn_code:
            hsnCode,

        product,

        category,

        quantity,

        product_price:
            productPrice,

    }
)

            setResult(
                response.data
            );
            console.log(response.data);

        } catch (error) {

            console.log(error);
        }
    };

const handleSave =
    async () => {

    try {

        await API.post(
            "/api/save-duty-calculation",
            {

                ...result,

            }
        );

        alert(
            "Calculation Saved Successfully"
        );

    } catch (error) {

        console.log(error);
    }
};

    return (

        <DashboardLayout>

            <div className="p-6 bg-gray-100 min-h-screen">

                <div className="mb-6">

                    <h1 className="text-4xl font-bold">
                        AI Duty & Tax Engine
                    </h1>

                    <p className="text-gray-600 mt-2">
                        Smart import/export customs calculation system
                    </p>

                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                    <div className="bg-white rounded-2xl shadow p-6">

                        <h2 className="text-2xl font-bold mb-6">
                            Duty Calculation Form
                        </h2>

                        <div className="space-y-4">

                            <div className="relative">

                                <label className="font-semibold">
                                    Country
                                </label>

                                <input
                                    type="text"
                                    value={country}
                                    onFocus={() =>
                                        setShowCountryDropdown(true)
                                    }
onChange={(e) => {

    setCountry(
        e.target.value
    );

    setOriginCountry(
        e.target.value
    );

}}
                                    placeholder="Select or type country"
                                    className="w-full border p-3 rounded-xl"
                                />
                                {
                                    showCountryDropdown && (
                                    <div className="absolute z-50 bg-white border rounded-xl shadow-lg w-full max-h-60 overflow-y-auto">
                                        {
                                            countries
                                            .filter((c) =>
                                                c.toLowerCase()
                                                .includes(
                                                    country.toLowerCase()
                                                )
                                            )
                                            .map((c, index) => (

                                            <div
                                                key={index}
onClick={() => {
    setCountry(c);
    setOriginCountry(c);
    setShowCountryDropdown(false);
}}
                                                className="p-3 hover:bg-gray-100 cursor-pointer"
                                            >
                                                {c}
                                            </div>
                                            ))
                                        }
                                    </div>
                                    )
                                }
                            </div>
                            <div className="relative">
                                <label className="font-semibold">
                                    HSN Code
                                </label>
                                <input
                                    type="text"
                                    value={hsnCode}
                                    onFocus={() =>
                                        setShowHSNDropdown(true)
                                    }
                                    onChange={(e) =>
                                        handleHSNChange(
                                            e.target.value
                                        )
                                    }
                                    placeholder="Select or type HSN"
                                    className="w-full border p-3 rounded-xl"
                                />
                                {
                                    showHSNDropdown && (
                                    <div className="absolute z-50 bg-white border rounded-xl shadow-lg w-full max-h-60 overflow-y-auto">
                                        {
                                            hsnCodes
                                            .filter((code) =>
                                                code.toLowerCase()
                                                .includes(
                                                    hsnCode.toLowerCase()
                                                )
                                            )
                                            .map((code, index) => (
                                            <div
                                                key={index}
                                                onClick={() => {
                                                    handleHSNChange(code);
                                                    setShowHSNDropdown(false);
                                                }}
                                                className="p-3 hover:bg-gray-100 cursor-pointer"
                                            >
                                                {code}
                                            </div>
                                            ))
                                        }
                                    </div>
                                    )
                                }
                            </div>
                            <input
type="text"
placeholder="Origin Country"
value={originCountry}
onChange={(e) =>
setOriginCountry(e.target.value)
}
className="w-full border rounded-lg px-4 py-3"
/>
<div className="relative">
<label className="font-semibold">
Destination Country
</label>
<input
type="text"
value={destinationCountry}
onFocus={() =>
setShowDestinationDropdown(true)
}
onChange={(e) =>
setDestinationCountry(
e.target.value
)
}
placeholder="Select Destination Country"
className="w-full border p-3 rounded-xl"
/>
{
showDestinationDropdown && (
<div className="absolute z-50 bg-white border rounded-xl shadow-lg w-full max-h-60 overflow-y-auto">
{
countries
.filter((c) =>
c.toLowerCase().includes(
destinationCountry.toLowerCase()
)
)
.map((c, index) => (
<div
key={index}
onClick={() => {
setDestinationCountry(c);
setShowDestinationDropdown(false);
}}
className="p-3 hover:bg-gray-100 cursor-pointer"
>
{c}
</div>
))
}
</div>
)
}
</div>
                            <input 
                                type="text"
                                placeholder="Product"
                                value={product}
                                onChange={(e) =>
                                    setProduct(e.target.value)
                                }
                                className="w-full border rounded-lg px-4 py-3"
                            />
                            <input
                                type="text"
                                placeholder="Category"
                                value={category}
                                onChange={(e) =>
                                    setCategory(e.target.value)
                                }
                                className="w-full border rounded-lg px-4 py-3"
                            />
                            <input
                                type="number"
                                placeholder="Quantity"
                                value={quantity}
                                onChange={(e) =>
                                    setQuantity(e.target.value)
                                }
                                className="w-full border rounded-lg px-4 py-3"
                            />

                            <input
                                type="number"
                                placeholder="Unit Price (USD)"
                                value={productPrice}
                                onChange={(e) =>
                                    setProductPrice(e.target.value)
                                }
                                className="w-full border rounded-lg px-4 py-3"
                            />

                            <button
                                onClick={handleCalculate}
                                className="w-full bg-black text-white py-3 rounded-xl font-bold hover:bg-gray-800"
                            >
                                Calculate Duty
                            </button>

                            {
                                result && (

                                <button
                                    onClick={handleSave}
                                    className="w-full bg-green-600 text-white py-3 rounded-xl font-bold hover:bg-green-700"
                                >
                                    Save Calculation
                                </button>
                                )
                            }

                        </div>

                    </div>

<div className="bg-white rounded-2xl shadow p-6">
    <h2 className="text-3xl font-bold mb-6">
        AI Customs Tax Report
    </h2>
    {
        result ? (
        <div className="space-y-6">
            <div className="grid grid-cols-3 gap-4">
                <div className="bg-blue-50 p-5 rounded-2xl shadow-sm">
                    <p className="text-gray-500">
                        BCD %
                    </p>
                    <h3 className="text-3xl font-bold text-blue-700">
                        {result.bcd_percent}%
                    </h3>
                </div>
                <div className="bg-green-50 p-5 rounded-2xl shadow-sm">
                    <p className="text-gray-500">
                        IGST %
                    </p>
                    <h3 className="text-3xl font-bold text-green-700">
                        {result.igst_percent}%
                    </h3>
                </div>
                <div className="bg-purple-50 p-5 rounded-2xl shadow-sm">
                    <p className="text-gray-500">
                        SWS %
                    </p>
                    <h3 className="text-3xl font-bold text-purple-700">
                        {result.sws_percent}%
                    </h3>
                </div>
            </div>
            <div className="bg-gray-50 rounded-2xl p-6">
    <h3 className="text-2xl font-bold mb-4">
        Currency Exchange
    </h3>
    <div className="flex justify-between items-center">
        <span className="text-lg">
            Exchange Rate
        </span>
        <span className="text-2xl font-bold text-blue-700">
            1 USD =
            {" "}
            {result.exchange_rate}
            {" "}
            {result.destination_currency}
        </span>
    </div>
</div>
            <div className="bg-orange-50 rounded-2xl p-6">
                <h3 className="font-bold text-2xl mb-5">
                    Cost Breakdown
                </h3>
                <div className="space-y-4">
                    <div className="flex justify-between">
                        <span>
                            Base Product Total
                        </span>
                        <div className="text-right">
                            <p>
                                USD {result.base_total_usd}
                            </p>
                            <p className="text-blue-700 font-semibold">
                                {result.destination_currency}
                                {" "}
                                {result.base_total_local}
                            </p>
                        </div>
                    </div>
                    <div className="flex justify-between">
                        <span>
                            Shipping Cost
                        </span>
                        <div className="text-right">
                            <p>
                                USD {result.shipping_cost_usd}
                            </p>
                            <p className="text-blue-700 font-semibold">
                                {result.destination_currency}
                                {" "}
                                {result.shipping_cost_local}
                            </p>
                        </div>
                    </div>
                    <div className="flex justify-between">
                        <span>
                            Insurance Cost
                        </span>
                        <div className="text-right">
                            <p>
                                USD {result.insurance_cost_usd}
                            </p>
                            <p className="text-blue-700 font-semibold">
                                {result.destination_currency}
                                {" "}
                                {result.insurance_cost_local}
                            </p>
                        </div>
                    </div>
                    <div className="flex justify-between">
                        <span>
                            Handling Fee
                        </span>
                        <div className="text-right">
                            <p>
                                USD {result.handling_fee}
                            </p>
                        </div>
                    </div>
                    <div className="flex justify-between border-t pt-4">
                        <span className="font-bold">
                            CIF Value
                        </span>
                        <div className="text-right">
                            <p className="font-bold">
                                USD {result.cif_value_usd}
                            </p>
                            <p className="text-blue-700 font-bold">
                                {result.destination_currency}
                                {" "}
                                {result.cif_value_local}
                            </p>
</div>
</div>
</div>
<div className="bg-red-50 rounded-2xl p-6">
                <h3 className="font-bold text-2xl mb-5">
                    Customs Tax Breakdown
                </h3>
                <div className="space-y-5">
                    <div className="bg-white rounded-xl p-5 border">
                        <div className="flex justify-between mb-3">
                            <h4 className="font-bold text-lg">
                                Basic Customs Duty (BCD)
                            </h4>
                            <span className="font-bold text-blue-700">
                                {result.bcd_percent}%
                            </span>
                        </div>
                        <div className="flex justify-between text-sm text-gray-500 mb-4">
                            <span>
                                Formula
                            </span>
                            <span>
                                CIF × Duty %
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span>
                                BCD Amount
                            </span>
                            <div className="text-right">
                                <p>
                                    USD {result.bcd_amount_usd}
                                </p>
                                <p className="text-blue-700 font-semibold">
                                    {result.destination_currency}
                                    {" "}
                                    {result.bcd_amount_local}
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-xl p-5 border">
                        <div className="flex justify-between mb-3">
                            <h4 className="font-bold text-lg">
                                Social Welfare Surcharge
                            </h4>
                            <span className="font-bold text-purple-700">
                                {result.sws_percent}%
                            </span>
                        </div>
                        <div className="flex justify-between text-sm text-gray-500 mb-4">
                            <span>
                                Formula
                            </span>
                            <span>
                                BCD × SWS %
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span>
                                SWS Amount
                            </span>
                            <div className="text-right">
                                <p>
                                    USD {result.sws_amount_usd}
                                </p>
                                <p className="text-blue-700 font-semibold">
                                    {result.destination_currency}
                                    {" "}
                                    {result.sws_amount_local}
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-xl p-5 border">

                        <div className="flex justify-between mb-3">

                            <h4 className="font-bold text-lg">
                                Integrated GST (IGST)
                            </h4>

                            <span className="font-bold text-green-700">
                                {result.igst_percent}%
                            </span>

                        </div>

                        <div className="flex justify-between text-sm text-gray-500 mb-4">

                            <span>
                                Formula
                            </span>

                            <span>
                                Taxable Value × IGST %
                            </span>

                        </div>

                        <div className="flex justify-between">

                            <span>
                                IGST Amount
                            </span>

                            <div className="text-right">

                                <p>
                                    USD {result.igst_amount_usd}
                                </p>

                                <p className="text-blue-700 font-semibold">
                                    {result.destination_currency}
                                    {" "}
                                    {result.igst_amount_local}
                                </p>

                            </div>

                        </div>

                    </div>
                    <div className="bg-white rounded-xl p-5 border">
                        <div className="flex justify-between mb-3">
                            <h4 className="font-bold text-lg">
                                Anti Dumping Duty
                            </h4>
                            <span className="font-bold text-red-700">
                                {result.anti_dumping_percent}%
                            </span>
                        </div>
                        <div className="flex justify-between text-sm text-gray-500 mb-4">
                            <span>
                                Formula
                            </span>
                            <span>
                                Taxable Value × ADD %
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span>
                                Anti Dumping Amount
                            </span>
                            <div className="text-right">
                                <p>
                                    USD {result.anti_dumping_amount_usd}
                                </p>
                                <p className="text-blue-700 font-semibold">
                                    {result.destination_currency}
                                    {" "}
                                    {result.anti_dumping_amount_local}
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-xl p-5 border">
                        <div className="flex justify-between mb-3">
                            <h4 className="font-bold text-lg">
                                Safeguard Duty
                            </h4>
                            <span className="font-bold text-orange-700">
                                {result.safeguard_percent}%
                            </span>
                        </div>
                        <div className="flex justify-between text-sm text-gray-500 mb-4">
                            <span>
                                Formula
                            </span>
                            <span>
                                Taxable Value × SGD %
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span>
                                Safeguard Amount
                            </span>
                            <div className="text-right">
                                <p>
                                    USD {result.safeguard_amount_usd}
                                </p>
                                <p className="text-blue-700 font-semibold">
                                    {result.destination_currency}
                                    {" "}
                                    {result.safeguard_amount_local}
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-black text-white rounded-2xl p-6">
                        <div className="flex justify-between items-center">
                            <div>
                                <h3 className="text-2xl font-bold">
                                    Total Customs Tax
                                </h3>
                                <p className="text-gray-300 mt-1">
                                    Combined customs duties and taxes
                                </p>
                            </div>
                            <div className="text-right">
                                <h2 className="text-4xl font-bold">
                                    USD {result.total_tax_usd}
                                </h2>
                                <p className="text-green-400 text-2xl font-bold">
                                    {result.destination_currency}
                                    {" "}
                                    {result.total_tax_local}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* <div className="bg-purple-50 rounded-2xl p-6">

                <h3 className="font-bold text-2xl mb-5">
                    Per Unit Costing
                </h3>

                <div className="space-y-4">

                    <div className="flex justify-between">

                        <span>
                            Unit Price
                        </span>

                        <div className="text-right">

                            <p>
                                USD {result.unit_price_usd}
                            </p>

                            <p className="text-blue-700 font-semibold">
                                {result.destination_currency}
                                {" "}
                                {result.unit_price_local}
                            </p>

                        </div>

                    </div>

                    <div className="flex justify-between">

                        <span>
                            Tax Per Unit
                        </span>

                        <div className="text-right">

                            <p>
                                USD {result.tax_per_unit}
                            </p>

                        </div>

                    </div>

                    <div className="flex justify-between border-t pt-4">

                        <span className="font-bold">
                            Final Unit Cost
                        </span>

                        <div className="text-right">

                            <p className="font-bold">
                                USD {result.final_unit_cost}
                            </p>

                        </div>

                    </div>

                </div>

            </div> */}
            <div className="bg-green-100 rounded-2xl p-8 text-center">
                <h2 className="text-3xl font-bold mb-5">
                    Final Landed Cost
                </h2>
                <div className="space-y-5">
                    <div>
                        <p className="text-gray-500 mb-2">
                            Universal Revenue Currency
                        </p>
                        <h1 className="text-5xl font-bold text-green-700">
                            USD
                            {" "}
                            {result.final_total_usd}
                        </h1>
                    </div>
                    <div>
                        <p className="text-gray-500 mb-2">
                            Destination Country Currency
                        </p>
                        <h2 className="text-4xl font-bold text-blue-700">
                            {result.destination_currency}
                            {" "}
                            {result.final_total_local}
                        </h2>
                    </div>
                </div>
            </div>
            <div className="bg-yellow-50 rounded-2xl p-6">
                <h3 className="text-2xl font-bold mb-5">
                    Compliance Status
                </h3>
                <div className="space-y-4">
<div className="flex justify-between">
    <span>
        Compliance Score
    </span>
    <span className="font-bold text-green-700">
        {result.compliance_score}%
    </span>
</div>
                    <div className="flex justify-between">
                        <span>
                            Customs Hold
                        </span>
                        <span className="font-bold text-red-600">
                            {result.customs_hold_status}
                        </span>
                    </div>
                    <div className="flex justify-between">
                        <span>
                            Trade Agreement
                        </span>
                        <span className="font-bold">
                            {result.trade_agreement || "NONE"}
                        </span>
                    </div>
                </div>
            </div>
        </div>
        <div className="bg-red-50 rounded-2xl p-6">
    <h3 className="text-2xl font-bold mb-5">
        Missing Compliance Documents
    </h3>
    {
        result.missing_documents?.length > 0 ? (
        <div className="space-y-3">
            {
                result.missing_documents.map(
                    (doc, index) => (
                    <div
                        key={index}
                        className="bg-white p-4 rounded-xl border"
                    >
                        {doc}
                    </div>
                ))
            }
        </div>
        ) : (
        <div className="bg-green-100 p-5 rounded-xl text-green-700 font-bold">
            No Missing Documents
        </div>
        )
    }
    <div className="bg-blue-50 rounded-2xl p-6">
    <h3 className="text-2xl font-bold mb-5">
        AI Recommendation
    </h3>
    <div className="bg-white rounded-xl p-5 border">
        <p className="text-lg leading-8 text-gray-700">
            {result.ai_recommendation}
        </p>
    </div>
</div>
</div>
</div>
        ) : (
        <div className="h-full flex items-center justify-center text-gray-400 text-xl">
            No Calculation Yet
    </div>)}
</div>
                </div>
            </div>
        </DashboardLayout>
    );
}