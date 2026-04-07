import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { MapPin, Zap } from "lucide-react";

function StationCard({ station }) {
    
  return (
    <Link to={`/stations/${station._id}`}>
      <motion.div
        whileHover={{ y: -8, scale: 1.02 }}
        className="bg-white rounded-2xl shadow-md hover:shadow-xl transition p-5 border border-gray-100 cursor-pointer"
      >
        {/* 🔋 TOP */}
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-lg font-semibold text-gray-800">
            {station.name}
          </h2>

          <span className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded-full">
            Available
          </span>
        </div>

        {/* 📍 LOCATION */}
        <div className="flex items-center gap-2 text-gray-500 text-sm mb-3">
          <MapPin size={16} />
          {station.location}
        </div>

        {/* ⚡ CHARGERS */}
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2 text-gray-600">
            <Zap size={16} className="text-cyan-500" />
            {station.availableChargers} / {station.totalChargers} Available
          </div>
        </div>

        {/* 🚀 CTA */}
        <div className="mt-4">
          <button className="w-full py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-sm font-medium transition">
            View Details
          </button>
        </div>
      </motion.div>
    </Link>
  );
}

export default StationCard;