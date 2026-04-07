import Hero from "../components/sections/Hero";
import MapView from "../components/sections/MapView";
import StationCard from "../components/sections/StationCard";

export default function Home() {

  const stations = [
    {
      _id: "1",
      name: "Voltify Station A",
      location: "Kota, Rajasthan",
      totalChargers: 10,
      availableChargers: 6,
    },
    {
      _id: "2",
      name: "City Charge Hub",
      location: "Jaipur",
      totalChargers: 8,
      availableChargers: 3,
    },
    {
      _id: "3",
      name: "Green Charge Point",
      location: "Delhi",
      totalChargers: 12,
      availableChargers: 9,
    },
  ];

  return (
    <>
      <Hero />

        <section className="py-16 px-6 bg-gray-50">
        <h2 className="text-2xl font-bold text-center mb-8">
          Find Charging Stations Near You ⚡
        </h2>

        <div className="max-w-6xl mx-auto">
          <MapView />
        </div>
      </section>

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