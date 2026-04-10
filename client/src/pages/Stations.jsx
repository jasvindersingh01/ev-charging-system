import { useEffect, useState } from "react";
import API from "../api/axios";
import StationCard from "../components/sections/StationCard";
import MapView from "../components/sections/MapView";

function Stations() {
  const [stations, setStations] = useState([]);

  useEffect(() => {
    API.get("/api/stations")
      .then((res) => setStations(res.data))
      .catch((err) => console.log(err));
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 pt-28 px-6 py-10">
      <div className="max-w-7xl mx-auto">

        {/* 🔥 PAGE TITLE */}
        <h1 className="text-3xl font-bold mb-8 text-gray-800">
          Explore Charging Stations ⚡
        </h1>

        {/* 🗺️ MAP */}
        <div className="mb-10">
          <MapView stations={stations} />
        </div>

        {/* 📋 STATION LIST */}
        <h2 className="text-xl font-semibold mb-6 text-gray-700">
          Available Stations
        </h2>

        <div className="grid md:grid-cols-3 gap-6">
          {stations.map((station) => (
            <StationCard key={station._id} station={station} />
          ))}
        </div>

      </div>
    </div>
  );
}

export default Stations;