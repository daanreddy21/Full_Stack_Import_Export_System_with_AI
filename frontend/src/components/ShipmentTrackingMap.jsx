import {
    MapContainer,
    TileLayer,
    Marker,
    Popup,
    Polyline
} from "react-leaflet";
import {
    useEffect,
    useState
} from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import API from "../services/api";
export default function ShipmentTrackingMap({
    shipment,
    onClose
}) {
const portCoordinates = {
    "Vizag Port": [17.6868, 83.2185],
    "Mumbai Port": [18.9388, 72.8354],
    "Chennai Port": [13.0827, 80.2707],
    "Kolkata Port": [22.5726, 88.3639],
    "Cochin Port": [9.9312, 76.2673],
    "Los Angeles Port": [33.7405, -118.2755],
    "New York Port": [40.6840, -74.0062],
    "Houston Port": [29.7604, -95.3698],
    "Miami Port": [25.7781, -80.1794],
    "Seattle Port": [47.6062, -122.3321],
    "Shanghai Port": [31.2304, 121.4737],
    "Shenzhen Port": [22.5431, 114.0579],
    "Guangzhou Port": [23.1291, 113.2644],
    "Ningbo Port": [29.8683, 121.5440],
    "Qingdao Port": [36.0671, 120.3826],
    "Dubai Port": [25.2697, 55.3095],
    "Jebel Ali Port": [25.0657, 55.1713],
    "Abu Dhabi Port": [24.4539, 54.3773],
    "Singapore Port": [1.2644, 103.8200],
    "Hamburg Port": [53.5461, 9.9661],
    "Bremerhaven Port": [53.5396, 8.5809],
    "Tokyo Port": [35.6762, 139.6503],
    "Osaka Port": [34.6937, 135.5023],
    "Yokohama Port": [35.4437, 139.6380],
    "Busan Port": [35.1796, 129.0756],
    "Incheon Port": [37.4563, 126.7052],
    "Rotterdam Port": [51.9244, 4.4777],
    "London Port": [51.5072, -0.1276],
    "Liverpool Port": [53.4084, -2.9916],
    "Marseille Port": [43.2965, 5.3698],
    "Le Havre Port": [49.4944, 0.1079],
    "Santos Port": [-23.9608, -46.3336],
    "Rio Port": [-22.9068, -43.1729],
    "Sydney Port": [-33.8688, 151.2093],
    "Melbourne Port": [-37.8136, 144.9631],
    "Vancouver Port": [49.2827, -123.1207],
    "Montreal Port": [45.5017, -73.5673],
    "Durban Port": [-29.8587, 31.0218],
    "Cape Town Port": [-33.9249, 18.4241],
    "Colombo Port": [6.9271, 79.8612]
};
const countryCoordinates = {
    "USA": [37.0902, -95.7129],
    "India": [20.5937, 78.9629],
    "China": [35.8617, 104.1954],
    "UAE": [23.4241, 53.8478],
    "Germany": [51.1657, 10.4515],
    "Japan": [36.2048, 138.2529],
    "Singapore": [1.3521, 103.8198],
    "Australia": [-25.2744, 133.7751],
    "Canada": [56.1304, -106.3468],
    "UK": [55.3781, -3.4360],
    "France": [46.2276, 2.2137],
    "Brazil": [-14.2350, -51.9253]
};
const originPosition =
    shipment.origin_port &&
    portCoordinates[shipment.origin_port]
    ? portCoordinates[shipment.origin_port]
    : shipment.origin_country &&
      countryCoordinates[shipment.origin_country]
    ? countryCoordinates[shipment.origin_country]
    : [17.6868, 83.2185];

const destinationPosition =
    shipment.destination_port &&
    portCoordinates[shipment.destination_port]
    ? portCoordinates[shipment.destination_port]
    : shipment.destination_country &&
      countryCoordinates[shipment.destination_country]
    ? countryCoordinates[shipment.destination_country]
    : [35.8617, 104.1954];
    const route = [
    originPosition,
    [
        originPosition[0] + 3,
        originPosition[1] + 10
    ],
    [
        (
            originPosition[0] +
            destinationPosition[0]
        ) / 2,
        (
            originPosition[1] +
            destinationPosition[1]
        ) / 2
    ],
    [
        destinationPosition[0] - 2,
        destinationPosition[1] - 5
    ],
    destinationPosition
];
const shipmentSteps = [
    "Processing",
    "Picked Up",
    "In Transit",
    "Customs Clearance",
    "Delivered"
];
    const [currentIndex, setCurrentIndex] = useState(0);
    const [currentPosition, setCurrentPosition] = useState(
        route[0]
    );
    const [currentStatus, setCurrentStatus] = useState(
        shipment.shipment_status || "Processing"
    );
    const updateShipmentStatus = async (
        status
    ) => {
        try {
            await API.put(
                `/api/update-shipment-status/${shipment.id}`,
                {
                    shipment_status: status
                }
            );
        } catch (error) {
            console.log(error);
        }
    };
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prev) => {
                const next = prev + 1;
                if (next < route.length) {
                    setCurrentPosition(
                        route[next]
                    );
                    if (next === 1) {
                        setCurrentStatus(
                            "Picked Up"
                        );
                        updateShipmentStatus(
                            "Picked Up"
                        );
                    }
                    else if (next === 2) {
                        setCurrentStatus(
                            "In Transit"
                        );
                        updateShipmentStatus(
                            "In Transit"
                        );
                    }
                    else if (next === 3) {
                        setCurrentStatus(
                            "Customs Clearance"
                        );
                        updateShipmentStatus(
                            "Customs Clearance"
                        );
                    }
                    else if (next === 4) {
                        setCurrentStatus(
                            "Delivered"
                        );
                        updateShipmentStatus(
                            "Delivered"
                        );
                    }
                    return next;
                }
                return prev;
            });
        }, 3000);
        return () => clearInterval(interval);
    }, []);
    const shipIcon = new L.Icon({
        iconUrl:
            "https://cdn-icons-png.flaticon.com/512/2920/2920349.png",
        iconSize: [40, 40]
    });
    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white w-[1150px] max-h-[95vh] overflow-y-auto rounded-2xl p-5">
                <div className="flex justify-between items-center mb-5">
                    <div>
                        <h2 className="text-3xl font-bold">
                            Live Shipment Tracking
                        </h2>
                        <p className="text-gray-500 mt-1">
                            Tracking ID:
                            {" "}
                            {shipment.tracking_id}
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-xl"
                    >
                        Close
                    </button>
                </div>
                <div className="grid grid-cols-4 gap-4 mb-6">
                    <div className="bg-blue-100 p-4 rounded-xl">
                        <h3 className="text-gray-600">
                            Buyer
                        </h3>
                        <h2 className="text-xl font-bold mt-2">
                            {shipment.buyer_name}
                        </h2>
                    </div>
                    <div className="bg-yellow-100 p-4 rounded-xl">
                        <h3 className="text-gray-600">
                            Product
                        </h3>
                        <h2 className="text-xl font-bold mt-2">
                            {shipment.product}
                        </h2>
                    </div>
                    <div className="bg-green-100 p-4 rounded-xl">
                        <h3 className="text-gray-600">
                            Shipment Status
                        </h3>
                        <h2 className="text-xl font-bold mt-2">
                            {currentStatus}
                        </h2>
                    </div>
                    <div className="bg-purple-100 p-4 rounded-xl">
                        <h3 className="text-gray-600">
                            Transport
                        </h3>
                        <h2 className="text-xl font-bold mt-2">
                            {shipment.transport_mode}
                        </h2>
                    </div>
                </div>
                <MapContainer
          center={[(
        originPosition[0] +
        destinationPosition[0]
    ) / 2,
    (
        originPosition[1] +
        destinationPosition[1]
    ) / 2
]}
                    zoom={4}
                    style={{
                        height: "500px",
                        width: "100%"
                    }}
                >
                    <TileLayer
                        attribution='&copy; OpenStreetMap contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
<Marker position={originPosition}>
    <Popup>
        Origin:
        {" "}
        {
            shipment.origin_port
            || shipment.origin_country
            || "Origin"
        }
    </Popup>
</Marker>
                    <Marker position={destinationPosition}>
                        <Popup>
                            Destination:
                            {" "}
                            {
                                shipment.destination_port
                                || shipment.country
                                || "Unknown Destination"
                            }
                        </Popup>
                    </Marker>
                    <Polyline
                        positions={route}
                        pathOptions={{
                            color: "blue",
                            weight: 4
                        }}
                    />
                    <Marker
                        position={currentPosition}
                        icon={shipIcon}
                    >
                        <Popup>
                            Shipment In Transit
                        </Popup>
                    </Marker>
                </MapContainer>
                <div className="mt-8">
                    <h2 className="text-2xl font-bold mb-6">    Shipment Timeline </h2>
                    <div className="flex justify-between items-center">
                        {
                            shipmentSteps.map((step, index) => (
                                <div
                                    key={index}
                                    className="flex flex-col items-center flex-1"
                                >
                                    <div
                                        className={`
                                            w-12 h-12 rounded-full flex items-center justify-center text-white font-bold
                                            ${
                                                shipmentSteps.indexOf(
                                                    currentStatus
                                                ) >= index
                                                ? "bg-green-500"
                                                : "bg-gray-300"
                                            }
                                        `}
                                    >
                                        {index + 1}
                                    </div>
                                    <p className="mt-3 text-center text-sm font-semibold">
                                        {step}
                                    </p>
                                </div>
                            ))
                        }
                    </div>
                </div>
            </div>
        </div>
    );
}