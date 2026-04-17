import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { MapPin, Zap, Battery, ArrowRight, Loader2 } from "lucide-react";
import L from "leaflet";
import API from "../../api/axios";

// Fix default marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

// Custom marker icon
const customIcon = new L.DivIcon({
  className: "custom-marker",
  html: `
    <div style="
      width: 36px; height: 36px;
      background: linear-gradient(135deg, #06b6d4, #2563eb);
      border-radius: 50% 50% 50% 0;
      transform: rotate(-45deg);
      display: flex; align-items: center; justify-content: center;
      box-shadow: 0 4px 12px rgba(6,182,212,0.4);
      border: 3px solid white;
    ">
      <span style="transform: rotate(45deg); color: white; font-size: 14px;">⚡</span>
    </div>
  `,
  iconSize: [36, 36],
  iconAnchor: [18, 36],
  popupAnchor: [0, -36],
});

function MapView() {
  const navigate = useNavigate();
  const [stations, setStations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get("/api/stations")
      .then((res) => { setStations(res.data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const validStations = stations.filter((s) => {
    const lat = Number(s.lat);
    const lng = Number(s.lng);
    return !isNaN(lat) && !isNaN(lng) && s.lat != null && s.lng != null;
  });

  if (loading) return (
    <div className="h-[500px] w-full rounded-2xl bg-gray-100 border border-gray-200 flex items-center justify-center">
      <div className="flex items-center gap-3 text-gray-400">
        <Loader2 size={20} className="animate-spin" />
        <span className="text-sm font-medium">Loading map...</span>
      </div>
    </div>
  );

  return (
    <div className="relative h-[500px] w-full rounded-2xl overflow-hidden shadow-lg border border-gray-200">

      {/* Station count badge */}
      <div className="absolute top-4 left-4 z-[999] bg-white/95 backdrop-blur-sm border border-gray-200 rounded-xl px-4 py-2.5 shadow-lg flex items-center gap-2.5">
        <div className="h-8 w-8 rounded-lg bg-cyan-50 flex items-center justify-center">
          <MapPin size={16} className="text-cyan-600" />
        </div>
        <div>
          <p className="text-sm font-bold text-gray-900">{validStations.length} Stations</p>
          <p className="text-xs text-gray-400">On the map</p>
        </div>
      </div>

      {/* Legend */}
      <div className="absolute bottom-4 left-4 z-[999] bg-white/95 backdrop-blur-sm border border-gray-200 rounded-xl px-3 py-2 shadow-lg flex items-center gap-3">
        <div className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
          <span className="text-xs text-gray-500">Available</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
          <span className="text-xs text-gray-500">Full</span>
        </div>
      </div>

      <MapContainer
        center={[25.2138, 75.8648]}
        zoom={7}
        scrollWheelZoom={true}
        className="h-full w-full z-0"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {validStations.map((station) => {
          const lat = Number(station.lat);
          const lng = Number(station.lng);
          const pct = Math.round((station.availableChargers / station.totalChargers) * 100) || 0;
          const isAvailable = station.availableChargers > 0;

          return (
            <Marker key={station._id} position={[lat, lng]} icon={customIcon}>
              <Popup>
                <div className="w-64 p-1">

                  {/* Station Image */}
                  {station.image && (
                    <div className="relative h-28 -mx-1 -mt-1 mb-3 rounded-xl overflow-hidden">
                      <img
                        src={station.image}
                        alt={station.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                      <span className={`absolute top-2 right-2 px-2 py-0.5 rounded-md text-[10px] font-bold text-white ${
                        isAvailable ? "bg-emerald-500" : "bg-red-500"
                      }`}>
                        {isAvailable ? "OPEN" : "FULL"}
                      </span>
                    </div>
                  )}

                  {/* Name & Location */}
                  <h3 className="text-sm font-bold text-gray-900 leading-tight">
                    {station.name}
                  </h3>
                  <div className="flex items-center gap-1 text-xs text-gray-400 mt-1">
                    <MapPin size={10} />
                    {station.location}
                  </div>

                  {/* Stats */}
                  <div className="flex items-center gap-3 mt-3">
                    <div className="flex items-center gap-1.5 text-xs text-gray-600">
                      <Battery size={12} className={isAvailable ? "text-emerald-500" : "text-red-400"} />
                      <span className="font-medium">
                        {station.availableChargers}/{station.totalChargers}
                      </span>
                      <span className="text-gray-400">chargers</span>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="mt-2 w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        pct > 50 ? "bg-emerald-500" : pct > 20 ? "bg-amber-500" : "bg-red-500"
                      }`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>

                  {/* Price */}
                  <div className="flex items-center justify-between mt-3">
                    <span className="text-xs text-gray-400">
                      ₹{station.price || 200}/hr
                    </span>
                    <span className={`text-xs font-medium ${
                      isAvailable ? "text-emerald-600" : "text-red-500"
                    }`}>
                      {pct}% free
                    </span>
                  </div>

                  {/* Book Button */}
                  <button
                    onClick={() => navigate(`/stations/${station._id}`)}
                    className={`w-full mt-3 py-2 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition ${
                      isAvailable
                        ? "bg-gradient-to-r from-cyan-600 to-blue-600 text-white hover:opacity-90"
                        : "bg-gray-100 text-gray-400 cursor-not-allowed"
                    }`}
                    disabled={!isAvailable}
                  >
                    {isAvailable ? (
                      <>View & Book <ArrowRight size={12} /></>
                    ) : (
                      "Fully Booked"
                    )}
                  </button>

                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}

export default MapView;