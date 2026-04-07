import Hero from "../components/sections/Hero";
import MapView from "../components/sections/MapView";
import StationCard from "../components/sections/StationCard";
import { useEffect, useState } from "react";
import API from "../api/axios";

export default function Home() {
  const [stations, setStations] = useState([]);

  // 🔥 FETCH FROM BACKEND
  useEffect(() => {
    API.get("/api/stations")
      .then((res) => {
        console.log("Stations:", res.data);
        setStations(res.data);
      })
      .catch((err) => console.log(err));
  }, []);

  return (
    <>
      <Hero />

      {/* 🗺️ MAP SECTION */}
      <section className="py-16 px-6 bg-gray-50">
        <h2 className="text-2xl font-bold text-center mb-8">
          Find Charging Stations Near You ⚡
        </h2>

        <div className="max-w-6xl mx-auto">
          <MapView stations={stations} /> {/* ✅ pass data */}
        </div>
      </section>

      {/* ⚡ CARDS SECTION */}
      <section className="bg-gray-50 py-16 px-6">
        <h2 className="text-2xl font-bold text-center mb-10">
          Nearby Charging Stations ⚡
        </h2>

        <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-6">
          {stations.map((station) => (
            <StationCard key={station._id} station={station} />
          ))}
        </div>
      </section>
    </>
  );
}