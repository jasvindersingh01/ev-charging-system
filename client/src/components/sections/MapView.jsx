import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

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

  useEffect(() => {
    API.get("/stations")
      .then((res) => {
        console.log("Stations:", res.data); 
        setStations(res.data);
      })
      .catch((err) => console.log(err));
  }, []);

  const stations = [
    {
      _id: "1",
      name: "Voltify Station A",
      location: "Kota",
      lat: 25.2138,
      lng: 75.8648,
    },
    {
      _id: "2",
      name: "City Charge Hub",
      location: "Jaipur",
      lat: 26.9124,
      lng: 75.7873,
    },
  ];

  return (
    <div className="h-[500px] w-full rounded-2xl overflow-hidden shadow-lg">
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
          <Marker key={station._id} position={[station.lat, station.lng]}>
            <Popup>
              <div className="text-sm">
                <h3 className="font-semibold">{station.name}</h3>
                <p>{station.location}</p>

                <button
                  onClick={() => navigate(`/stations/${station._id}`)}
                  className="mt-2 px-3 py-1 bg-cyan-600 text-white rounded"
                >
                  Book Now ⚡
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