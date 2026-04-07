import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { MapPin, Zap } from "lucide-react";

function StationCard({ station }) {
  const isAvailable = station.availableChargers > 0;

  return (
    <Link to={`/stations/${station._id}`}>
      <motion.div
        whileHover={{ y: -6 }}
        className="group bg-white/80 backdrop-blur-md rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 p-5 border border-gray-100 hover:border-cyan-200 cursor-pointer"
      >
        {/* 🔥 TOP */}
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-lg font-semibold text-gray-800 group-hover:text-cyan-600 transition">
            {station.name}
          </h2>

          <span
            className={`text-xs px-3 py-1 rounded-full font-medium ${
              isAvailable
                ? "bg-green-100 text-green-600"
                : "bg-red-100 text-red-600"
            }`}
          >
            {isAvailable ? "Available" : "Full"}
          </span>
        </div>

        {/* 📍 LOCATION */}
        <div className="flex items-center gap-2 text-gray-500 text-sm mb-4">
          <MapPin size={16} />
          {station.location}
        </div>

        {/* ⚡ CHARGER PROGRESS */}
        <div className="mb-4">
          <div className="flex justify-between text-xs text-gray-500 mb-1">
            <span>Charging Availability</span>
            <span>
              {station.availableChargers}/{station.totalChargers}
            </span>
          </div>

          {/* Progress Bar */}
          <div className="w-full h-2 bg-gray-200 rounded-full">
            <div
              className={`h-2 rounded-full ${
                isAvailable
                  ? "bg-gradient-to-r from-cyan-500 to-blue-500"
                  : "bg-red-400"
              }`}
              style={{
                width: `${
                  (station.availableChargers /
                    station.totalChargers) *
                  100
                }%`,
              }}
            ></div>
          </div>
        </div>

        {/* 🚀 CTA */}
        <div className="mt-5">
          <button className="w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 text-white text-sm font-medium shadow-md group-hover:scale-[1.02] transition">
            View Details ⚡
          </button>
        </div>
      </motion.div>
    </Link>
  );
}

export default StationCard;