import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { MapPin, Zap, Star } from "lucide-react";

function StationCard({ station }) {
  const isAvailable = station.availableChargers > 0;

  const percentage =
    station.totalChargers > 0
      ? (station.availableChargers / station.totalChargers) * 100
      : 0;

  return (
    <Link to={`/stations/${station._id}`}>
      <motion.div
        whileHover={{ y: -6 }}
        className="group bg-white/80 backdrop-blur-md rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 p-5 border border-gray-100 hover:border-cyan-200 cursor-pointer relative overflow-hidden"
      >
        {/* 🔥 GLOW EFFECT */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition bg-gradient-to-br from-cyan-100/40 to-transparent"></div>

        {/* 🔝 TOP */}
        <div className="flex justify-between items-start mb-3 relative z-10">
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

        {/* ⭐ RATING + DISTANCE */}
        <div className="flex items-center justify-between text-xs text-gray-500 mb-3 relative z-10">
          <div className="flex items-center gap-1">
            <Star size={14} className="text-yellow-400" />
            4.5
          </div>
          <span>~2.3 km</span> {/* later dynamic */}
        </div>

        {/* 📍 LOCATION */}
        <div className="flex items-center gap-2 text-gray-500 text-sm mb-3 relative z-10">
          <MapPin size={16} />
          {station.location}
        </div>

        {/* ⚡ CHARGERS */}
        <div className="mb-4 relative z-10">
          <div className="flex justify-between text-xs text-gray-500 mb-1">
            <span>Charging Availability</span>
            <span>
              {station.availableChargers}/{station.totalChargers}
            </span>
          </div>

          {/* Progress */}
          <div className="w-full h-2 bg-gray-200 rounded-full">
            <div
              className={`h-2 rounded-full ${
                isAvailable
                  ? "bg-gradient-to-r from-cyan-500 to-blue-500"
                  : "bg-red-400"
              }`}
              style={{ width: `${percentage}%` }}
            ></div>
          </div>
        </div>

        {/* ⚡ TYPE */}
        <div className="flex items-center gap-2 text-xs text-gray-500 mb-4 relative z-10">
          <Zap size={14} className="text-cyan-500" />
          Fast Charging • 50kW
        </div>

        {/* 🚀 CTA */}
        <div className="mt-4 relative z-10">
          <button
            disabled={!isAvailable}
            className={`w-full py-2.5 rounded-xl text-sm font-medium shadow-md transition ${
              isAvailable
                ? "bg-gradient-to-r from-cyan-600 to-blue-600 text-white group-hover:scale-[1.02]"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }`}
          >
            {isAvailable ? "View Details ⚡" : "No Slots Available"}
          </button>
        </div>
      </motion.div>
    </Link>
  );
}

export default StationCard;