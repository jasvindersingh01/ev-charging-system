import { useParams } from "react-router-dom";
import { MapPin, Zap } from "lucide-react";
import { motion } from "framer-motion";

function StationDetails() {
  const { id } = useParams();

  // 🔥 Dummy Data (later replace with API)
  const station = {
    _id: id,
    name: "Voltify Station A",
    location: "Kota, Rajasthan",
    totalChargers: 10,
    availableChargers: 6,
    description:
      "Fast EV charging station with modern equipment and 24/7 availability.",
  };

  return (
    <div className="min-h-screen bg-gray-50 py-16 px-6">
      
      <div className="max-w-5xl mx-auto">

        {/* 🔥 HEADER */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100"
        >
          <h1 className="text-3xl font-bold text-gray-800">
            {station.name}
          </h1>

          <div className="flex items-center gap-2 text-gray-500 mt-2">
            <MapPin size={18} />
            {station.location}
          </div>
        </motion.div>

        {/* ⚡ INFO CARDS */}
        <div className="grid md:grid-cols-2 gap-6 mt-6">

          {/* Charger Info */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-white p-6 rounded-2xl shadow border border-gray-100"
          >
            <div className="flex items-center gap-2 text-gray-700 mb-2">
              <Zap className="text-cyan-500" />
              <h3 className="font-semibold text-lg">Charging Status</h3>
            </div>

            <p className="text-gray-600">
              {station.availableChargers} / {station.totalChargers} chargers available
            </p>

            {/* Progress Bar */}
            <div className="w-full bg-gray-200 rounded-full h-2 mt-4">
              <div
                className="bg-cyan-500 h-2 rounded-full"
                style={{
                  width: `${
                    (station.availableChargers / station.totalChargers) * 100
                  }%`,
                }}
              ></div>
            </div>
          </motion.div>

          {/* Description */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-white p-6 rounded-2xl shadow border border-gray-100"
          >
            <h3 className="font-semibold text-lg mb-2">About Station</h3>
            <p className="text-gray-600 text-sm">
              {station.description}
            </p>
          </motion.div>
        </div>

        {/* 🚀 BOOKING SECTION */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8 bg-white p-6 rounded-2xl shadow border border-gray-100 flex flex-col md:flex-row items-center justify-between gap-4"
        >
          <div>
            <h3 className="text-xl font-semibold text-gray-800">
              Ready to Charge?
            </h3>
            <p className="text-gray-500 text-sm">
              Book your slot and start charging instantly.
            </p>
          </div>

          <button className="px-6 py-3 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl font-semibold transition shadow-md">
            Book Slot ⚡
          </button>
        </motion.div>

      </div>
    </div>
  );
}

export default StationDetails;