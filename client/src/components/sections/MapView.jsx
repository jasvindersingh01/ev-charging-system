import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

import L from "leaflet";
import API from "../../api/axios";

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  iconUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

function MapView() {
  const navigate = useNavigate();
  const [stations, setStations] = useState([]);

  useEffect(() => {
    API.get("/api/stations")
      .then((res) => {
        console.log("Stations:", res.data);
        setStations(res.data);
      })
      .catch((err) => console.log(err));
  }, []);
  return (
    <div className="h-[500px] w-full rounded-2xl overflow-hidden shadow-lg z-0">
      <MapContainer
        center={[25.2138, 75.8648]}
        zoom={7}
        scrollWheelZoom={true}
        className="h-full w-full"
      >
        <TileLayer
          attribution="&copy; OpenStreetMap"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {stations.map((station) => (
          <Marker
            key={station._id}
            position={[station.lat, station.lng]}
          >
         <Popup>
  <div className="w-56 space-y-2">

    {/* 🔥 Station Name */}
    <h3 className="text-sm font-semibold text-gray-800">
      {station.name}
    </h3>

    {/* 📍 Location */}
    <p className="text-xs text-gray-500">
      📍 {station.location}
    </p>

    {/* ⚡ Chargers Info */}
    <div className="text-xs text-gray-600">
      ⚡ {station.availableChargers} / {station.totalChargers} available
    </div>

    {/* 🟢 Status */}
    <span className={`inline-block text-xs px-2 py-1 rounded-full ${
      station.availableChargers > 0
        ? "bg-green-100 text-green-600"
        : "bg-red-100 text-red-600"
    }`}>
      {station.availableChargers > 0 ? "Available" : "Full"}
    </span>

    {/* 🚀 CTA BUTTON */}
    <button
      onClick={() => navigate(`/stations/${station._id}`)}
      className="w-full mt-2 py-2 text-xs font-medium bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-lg hover:opacity-90 transition"
    >
      View & Book ⚡
    </button>

  </div>
</Popup>
          </Marker>
        ))}

      </MapContainer>
    </div>
  );
}

export default MapView;