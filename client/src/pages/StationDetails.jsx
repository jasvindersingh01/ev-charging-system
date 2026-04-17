import { useParams, useNavigate } from "react-router-dom";
import {
  MapPin, Zap, Clock, Battery, Shield, Star, ArrowLeft,
  Check, X, Loader2, BatteryCharging, AlertCircle, Info
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import API from "../api/axios";

function StationDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [selectedSlot, setSelectedSlot] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [station, setStation] = useState(null);
  const [bookedSlots, setBookedSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("slots");

  const timeSlots = [
    { time: "09:00 AM", period: "Morning" },
    { time: "10:00 AM", period: "Morning" },
    { time: "11:00 AM", period: "Morning" },
    { time: "12:00 PM", period: "Afternoon" },
    { time: "01:00 PM", period: "Afternoon" },
    { time: "02:00 PM", period: "Afternoon" },
    { time: "04:00 PM", period: "Evening" },
    { time: "05:00 PM", period: "Evening" },
    { time: "06:00 PM", period: "Evening" },
  ];

  const groupedSlots = timeSlots.reduce((acc, slot) => {
    if (!acc[slot.period]) acc[slot.period] = [];
    acc[slot.period].push(slot);
    return acc;
  }, {});

  useEffect(() => {
    setLoading(true);
    API.get(`/api/stations/${id}`)
      .then((res) => { setStation(res.data); setLoading(false); })
      .catch(() => { toast.error("Failed to load station"); setLoading(false); });
  }, [id]);

  useEffect(() => {
    API.get(`/bookings/station/${id}`)
      .then((res) => {
        const active = res.data.filter((b) => b.status !== "cancelled");
        setBookedSlots(active.map((b) => b.timeSlot));
      })
      .catch((err) => console.log(err));
  }, [id]);

  const handleBooking = async () => {
    setBookingLoading(true);
    try {
      await API.post("/bookings", {
        stationId: station._id,
        timeSlot: selectedSlot,
      });
      setStation((prev) => ({ ...prev, availableChargers: prev.availableChargers - 1 }));
      setBookedSlots((prev) => [...prev, selectedSlot]);
      setSelectedSlot(null);
      setShowModal(false);
      toast.success("Slot Booked! Pay at station ⚡");
    } catch {
      toast.error("Booking Failed. Try again.");
    } finally {
      setBookingLoading(false);
    }
  };

  // ── Skeleton ──────────────────────────────────────────────
  if (loading) return (
    <div className="min-h-screen bg-gray-50 pt-24 px-6">
      <div className="max-w-5xl mx-auto animate-pulse space-y-4">
        <div className="h-10 w-36 bg-gray-200 rounded-xl" />
        <div className="h-64 bg-gray-200 rounded-2xl" />
        <div className="grid md:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => <div key={i} className="h-28 bg-gray-200 rounded-2xl" />)}
        </div>
      </div>
    </div>
  );

  // ── Not Found ─────────────────────────────────────────────
  if (!station) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center space-y-3">
        <AlertCircle size={48} className="mx-auto text-red-400" />
        <h2 className="text-xl font-semibold text-gray-800">Station Not Found</h2>
        <button onClick={() => navigate(-1)} className="px-5 py-2 bg-gray-900 text-white rounded-xl text-sm">
          Go Back
        </button>
      </div>
    </div>
  );

  const percentage = (station.availableChargers / station.totalChargers) * 100;
  const statusColor = percentage > 50 ? "emerald" : percentage > 20 ? "amber" : "red";
  const pricePerHour = station.price || 200;

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">

        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl border border-gray-200 text-sm text-gray-600 hover:border-gray-300 shadow-sm transition mb-5"
        >
          <ArrowLeft size={16} /> Back to Stations
        </button>

        {/* ── Station Image + Hero ─────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden mb-5"
        >
          {/* Image */}
          <div className="relative h-56 sm:h-72 w-full overflow-hidden">
            <img
              src={station.image || "https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=1200&auto=format&fit=crop"}
              alt={station.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

            {/* Name on image */}
            <div className="absolute bottom-0 left-0 p-5">
              <div className="flex items-center gap-2 mb-1">
                <span className="flex items-center gap-1.5 px-2.5 py-1 bg-emerald-500 text-white rounded-lg text-xs font-medium">
                  <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" /> Active
                </span>
                <span className="flex items-center gap-1 px-2.5 py-1 bg-white/20 backdrop-blur-sm text-white rounded-lg text-xs font-medium">
                  <Star size={11} fill="white" /> 4.8
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white">{station.name}</h1>
              <div className="flex items-center gap-1.5 text-white/80 text-sm mt-1">
                <MapPin size={14} /> {station.location}
              </div>
            </div>

            {/* Charger badge */}
            <div className="absolute top-4 right-4">
              <div className="px-3 py-1.5 bg-white/90 backdrop-blur-sm rounded-xl text-xs font-bold text-gray-800 shadow">
                ⚡ {station.availableChargers}/{station.totalChargers} Free
              </div>
            </div>
          </div>

          {/* Tags */}
          <div className="px-5 py-3 flex items-center gap-2 flex-wrap border-t border-gray-100">
            <span className="flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-700 rounded-lg text-xs border border-blue-100 font-medium">
              <Zap size={11} /> Fast Charging
            </span>
            <span className="flex items-center gap-1 px-3 py-1 bg-violet-50 text-violet-700 rounded-lg text-xs border border-violet-100 font-medium">
              <Shield size={11} /> Verified
            </span>
            <span className="px-3 py-1 bg-gray-50 text-gray-600 rounded-lg text-xs border border-gray-100 font-medium">
              CCS · CHAdeMO · Type 2
            </span>
          </div>
        </motion.div>

        {/* ── Progress Bar ─────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 mb-5"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Battery className={`text-${statusColor}-500`} size={18} />
              <span className="font-medium text-gray-800 text-sm">Charger Availability</span>
            </div>
            <span className={`text-sm font-semibold text-${statusColor}-600 bg-${statusColor}-50 px-2.5 py-1 rounded-lg border border-${statusColor}-100`}>
              {Math.round(percentage)}% Free
            </span>
          </div>
          <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${percentage}%` }}
              transition={{ duration: 1.2, ease: "easeOut" }}
              className={`h-full rounded-full ${percentage > 50 ? "bg-emerald-500" : percentage > 20 ? "bg-amber-500" : "bg-red-500"}`}
            />
          </div>
          <p className="text-xs text-gray-400 mt-2">
            {station.availableChargers} of {station.totalChargers} chargers available right now
          </p>
        </motion.div>

        {/* ── Main Grid ────────────────────────────────────── */}
        <div className="grid lg:grid-cols-3 gap-5">

          {/* Left - Tabs */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden"
            >
              <div className="flex border-b border-gray-100">
                {[
                  { id: "slots", label: "Time Slots", icon: Clock },
                  { id: "about", label: "About", icon: Shield },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex-1 flex items-center justify-center gap-2 py-4 text-sm font-medium relative transition ${activeTab === tab.id ? "text-cyan-600" : "text-gray-500 hover:text-gray-700"}`}
                  >
                    <tab.icon size={15} /> {tab.label}
                    {activeTab === tab.id && (
                      <motion.div layoutId="tab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-cyan-500" />
                    )}
                  </button>
                ))}
              </div>

              <div className="p-5">
                <AnimatePresence mode="wait">

                  {activeTab === "slots" && (
                    <motion.div key="slots" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                      {Object.entries(groupedSlots).map(([period, slots]) => (
                        <div key={period} className="mb-5 last:mb-0">
                          <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">{period}</h4>
                          <div className="grid grid-cols-3 gap-2">
                            {slots.map((slot, i) => {
                              const isBooked = bookedSlots.includes(slot.time);
                              const isSelected = selectedSlot === slot.time;
                              return (
                                <motion.button
                                  key={i}
                                  whileTap={!isBooked ? { scale: 0.97 } : {}}
                                  onClick={() => !isBooked && setSelectedSlot(isSelected ? null : slot.time)}
                                  disabled={isBooked}
                                  className={`py-2.5 px-3 rounded-xl text-xs font-medium border flex items-center justify-center gap-1.5 transition ${isBooked
                                    ? "bg-gray-50 text-gray-300 border-gray-100 cursor-not-allowed"
                                    : isSelected
                                      ? "bg-cyan-600 text-white border-cyan-600 shadow-md"
                                      : "bg-white text-gray-600 border-gray-200 hover:border-cyan-400"
                                    }`}
                                >
                                  {isBooked ? <X size={12} /> : isSelected ? <Check size={12} /> : <Clock size={12} />}
                                  {slot.time}
                                </motion.button>
                              );
                            })}
                          </div>
                        </div>
                      ))}
                    </motion.div>
                  )}

                  {activeTab === "about" && (
                    <motion.div key="about" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">

                      {/* Description from DB */}
                      <p className="text-gray-600 text-sm leading-relaxed">
                        {station.description || "Premium EV charging station with state-of-the-art fast chargers. Supporting all major EV brands and connector types with 24/7 availability."}
                      </p>

                      {/* Info Grid - DB data with defaults */}
                      <div className="grid grid-cols-2 gap-3">
                        {[
                          { label: "Operating Hours", value: station.operatingHours || "24/7" },
                          { label: "Power Output", value: station.powerOutput || "150kW" },
                          { label: "Connector Types", value: station.connectorTypes || "CCS, CHAdeMO" },
                          { label: "Avg Wait Time", value: station.waitTime || "~12 min" },
                        ].map((info, idx) => (
                          <div key={idx} className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                            <div className="text-xs text-gray-400 font-medium">{info.label}</div>
                            <div className="text-sm font-semibold text-gray-800 mt-0.5">{info.value}</div>
                          </div>
                        ))}
                      </div>

                    </motion.div>
                  )}

                </AnimatePresence>
              </div>
            </motion.div>
          </div>

          {/* ── Right - Booking Panel ─────────────────────── */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden sticky top-24 h-fit"
          >
            <div className="bg-gradient-to-r from-gray-900 to-gray-800 p-5 text-white">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-white/10 flex items-center justify-center">
                  <BatteryCharging size={20} className="text-cyan-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-base">Book a Slot</h3>
                  <p className="text-gray-400 text-xs mt-0.5">Pay at station after arrival</p>
                </div>
              </div>
            </div>

            <div className="p-5 space-y-4">

              {/* Selected Slot */}
              {selectedSlot ? (
                <div className="bg-cyan-50 border border-cyan-100 rounded-xl p-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clock size={16} className="text-cyan-600" />
                    <div>
                      <div className="text-xs text-cyan-500 font-medium">Selected Slot</div>
                      <div className="text-sm font-bold text-cyan-800">{selectedSlot}</div>
                    </div>
                  </div>
                  <button onClick={() => setSelectedSlot(null)} className="text-cyan-400 hover:text-cyan-600">
                    <X size={16} />
                  </button>
                </div>
              ) : (
                <div className="bg-gray-50 border border-dashed border-gray-200 rounded-xl p-4 text-center">
                  <Clock size={22} className="mx-auto text-gray-300 mb-1" />
                  <p className="text-xs text-gray-400">No slot selected yet</p>
                </div>
              )}

              {/* Price Info */}
              <div className="flex justify-between text-sm border-t border-gray-100 pt-3">
                <span className="text-gray-500">Charge per hour</span>
                <span className="font-semibold text-gray-800">₹{pricePerHour}/hr</span>
              </div>

              {/* Offline Payment Note */}
              <div className="flex items-start gap-2 bg-amber-50 border border-amber-100 rounded-xl p-3">
                <Info size={15} className="text-amber-500 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-amber-700 leading-relaxed">
                  Payment is collected <span className="font-semibold">at the station</span>. Book your slot now and pay when you arrive.
                </p>
              </div>

              {/* Book Button */}
              <motion.button
                whileTap={selectedSlot ? { scale: 0.98 } : {}}
                onClick={() => selectedSlot && setShowModal(true)}
                disabled={!selectedSlot || station.availableChargers <= 0}
                className={`w-full py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition ${selectedSlot && station.availableChargers > 0
                  ? "bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-lg hover:opacity-90"
                  : "bg-gray-100 text-gray-400 cursor-not-allowed"
                  }`}
              >
                <Zap size={16} />
                {station.availableChargers <= 0 ? "Fully Booked" : selectedSlot ? "Book Slot" : "Select a Time Slot"}
              </motion.button>

            </div>
          </motion.div>
        </div>
      </div>

      {/* ── Confirm Modal ─────────────────────────────────── */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => !bookingLoading && setShowModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
            >
              <div className="h-1 bg-gradient-to-r from-cyan-500 to-blue-500" />

              <div className="p-6 space-y-4">
                <div>
                  <h2 className="text-lg font-bold text-gray-900">Confirm Booking</h2>
                  <p className="text-gray-400 text-xs mt-1">Review your slot details</p>
                </div>

                {/* Station mini card */}
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100">
                  <img
                    src={station.image || "https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=200&auto=format&fit=crop"}
                    alt={station.name}
                    className="h-12 w-16 rounded-lg object-cover flex-shrink-0"
                  />
                  <div>
                    <div className="text-sm font-semibold text-gray-900">{station.name}</div>
                    <div className="flex items-center gap-1 text-xs text-gray-400 mt-0.5">
                      <MapPin size={11} /> {station.location}
                    </div>
                  </div>
                </div>

                {/* Time Slot */}
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100">
                  <div className="h-9 w-9 rounded-lg bg-cyan-50 flex items-center justify-center">
                    <Clock size={16} className="text-cyan-600" />
                  </div>
                  <div>
                    <div className="text-xs text-gray-400">Time Slot</div>
                    <div className="text-sm font-semibold text-gray-800">{selectedSlot}</div>
                  </div>
                </div>

                {/* Pay at station note */}
                <div className="flex items-start gap-2 bg-green-50 border border-green-100 rounded-xl p-3">
                  <Info size={15} className="text-green-500 flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-green-700 leading-relaxed">
                    No online payment needed. Simply arrive at the station and <span className="font-semibold">pay ₹{pricePerHour}/hr at the counter</span>.
                  </p>
                </div>

                <div className="flex gap-3 pt-1">
                  <button
                    onClick={() => setShowModal(false)}
                    disabled={bookingLoading}
                    className="flex-1 py-3 border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-50 transition"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleBooking}
                    disabled={bookingLoading}
                    className="flex-1 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-xl text-sm font-semibold flex items-center justify-center gap-2 disabled:opacity-70"
                  >
                    {bookingLoading
                      ? <><Loader2 size={16} className="animate-spin" /> Booking...</>
                      : <><Zap size={16} /> Confirm Booking</>
                    }
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default StationDetails;
