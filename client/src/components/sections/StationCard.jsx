import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { MapPin, Zap, Star, Navigation, ChevronRight, BatteryCharging } from "lucide-react";

function StationCard({ station }) {
  const isAvailable = station.availableChargers > 0;
  const percentage = station.totalChargers > 0 
    ? (station.availableChargers / station.totalChargers) * 100 
    : 0;

  // Calculate status color
  const getStatusColor = () => {
    if (!isAvailable) return "bg-red-500";
    if (percentage > 50) return "bg-emerald-500";
    if (percentage > 20) return "bg-amber-500";
    return "bg-orange-500";
  };

  return (
    <motion.div
      whileHover={{ y: -8, scale: 1.01 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="group relative bg-white rounded-2xl shadow-sm hover:shadow-xl 
                 border border-slate-200/60 overflow-hidden flex flex-col h-full
                 transition-shadow duration-300"
    >
      {/* 🖼️ IMAGE HEADER */}
      <Link to={`/stations/${station._id}`} className="relative block h-48 overflow-hidden">
        <img
          src={station.image}
          alt={station.name}
          className="w-full h-full object-cover transition-transform duration-500 
                     group-hover:scale-110"
        />
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        
        {/* Availability Badge - Top Right */}
        <div className={`absolute top-3 right-3 px-3 py-1.5 rounded-full text-xs font-semibold 
                        backdrop-blur-md border shadow-lg flex items-center gap-1.5
                        ${isAvailable 
                          ? "bg-emerald-500/90 text-white border-emerald-400/50" 
                          : "bg-red-500/90 text-white border-red-400/50"}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${isAvailable ? "bg-white animate-pulse" : "bg-white/50"}`} />
          {isAvailable ? `${station.availableChargers} Available` : "Full"}
        </div>

        {/* Station Name Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h3 className="text-white font-bold text-lg leading-tight drop-shadow-md">
            {station.name}
          </h3>
          <div className="flex items-center gap-2 text-white/90 text-xs mt-1">
            <Navigation size={12} className="opacity-80" />
            <span>~2.3 km away</span>
          </div>
        </div>
      </Link>

      {/* 📋 CONTENT BODY */}
      <div className="p-5 flex flex-col flex-grow">
        {/* Rating & Price Row */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-1.5 bg-amber-50 px-2 py-1 rounded-lg border border-amber-100">
            <Star size={14} className="text-amber-500 fill-amber-500" />
            <span className="text-sm font-bold text-amber-700">
              {station.rating || "4.5"}
            </span>
            <span className="text-xs text-amber-600/70">
              ({station.reviewCount || "12"})
            </span>
          </div>
          
          <div className="text-right">
            <div className="text-xs text-slate-500 font-medium">Starting at</div>
            <div className="text-sm font-bold text-slate-800">
              {station.pricePerKwh ? `₹${station.pricePerKwh}/kWh` : "₹15/kWh"}
            </div>
          </div>
        </div>

        {/* Location */}
        <div className="flex items-start gap-2 mb-4 text-slate-600">
          <MapPin size={16} className="mt-0.5 text-slate-400 shrink-0" />
          <p className="text-sm leading-relaxed line-clamp-2">
            {station.location || "123 Electric Avenue, Green City"}
          </p>
        </div>

        {/* ⚡ Charging Stats */}
        <div className="mb-4 bg-slate-50 rounded-xl p-3 border border-slate-100">
          <div className="flex justify-between items-center mb-2">
            <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
              <BatteryCharging size={16} className="text-cyan-600" />
              <span>Chargers</span>
            </div>
            <span className="text-sm font-bold text-slate-800">
              {station.availableChargers}/{station.totalChargers}
            </span>
          </div>
          
          {/* Progress Bar */}
          <div className="relative h-2 bg-slate-200 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${percentage}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
              className={`absolute h-full rounded-full ${getStatusColor()}`}
            />
          </div>
          <div className="flex justify-between mt-1.5 text-xs text-slate-500">
            <span>{Math.round(percentage)}% Available</span>
            <span className="text-cyan-600 font-medium">50kW Fast</span>
          </div>
        </div>

        {/* Connector Types (Optional) */}
        {station.connectorTypes && (
          <div className="flex flex-wrap gap-2 mb-4">
            {station.connectorTypes.map((type) => (
              <span key={type} className="px-2 py-1 bg-slate-100 text-slate-600 
                                           text-xs rounded-md font-medium border border-slate-200">
                {type}
              </span>
            ))}
          </div>
        )}

        {/* 🚀 CTA - Fixed: No nested buttons, using div styled as button */}
        <Link 
          to={`/stations/${station._id}`}
          className={`mt-auto flex items-center justify-center gap-2 w-full py-3 rounded-xl 
                     font-semibold text-sm transition-all duration-200
                     ${isAvailable 
                       ? "bg-slate-900 text-white hover:bg-slate-800 hover:shadow-lg hover:shadow-slate-900/20" 
                       : "bg-slate-100 text-slate-400 cursor-not-allowed"}`}
          onClick={(e) => !isAvailable && e.preventDefault()}
        >
          {isAvailable ? (
            <>
              <Zap size={16} className={isAvailable ? "fill-current" : ""} />
              View Details
              <ChevronRight size={16} className="opacity-60" />
            </>
          ) : (
            "No Slots Available"
          )}
        </Link>
      </div>
    </motion.div>
  );
}

export default StationCard;