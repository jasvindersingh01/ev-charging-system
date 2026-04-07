import { useParams } from "react-router-dom";
import { MapPin, Zap, Clock } from "lucide-react";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import API from "../api/axios";

function StationDetails() {
  const { id } = useParams();

  const [selectedSlot, setSelectedSlot] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [station, setStation] = useState(null);
  const [bookings, setBookings] = useState([]);

  const timeSlots = [
    "10:00 AM",
    "11:00 AM",
    "12:00 PM",
    "01:00 PM",
    "02:00 PM",
    "03:00 PM",
  ];

  useEffect(() => {
    API.get(`/api/stations/${id}`)
      .then((res) => {
        console.log("Station data:", res.data); // 👈 CHECK
        setStation(res.data);
      })
      .catch((err) => {
        console.log("Error:", err); // 👈 CHECK
      });
  }, [id]);

  useEffect(() => {
    API.get(`/bookings/station/${id}`)
      .then((res) => {
        setBookings(res.data);
      })
      .catch((err) => console.log(err));
  }, [id]);

  const bookedSlots = bookings.map((b) => b.timeSlot);

  if (!station) {
    return (
      <div className="pt-28 text-center text-gray-500">
        Loading station details...
      </div>
    );
  }

  const percentage =
    (station.availableChargers / station.totalChargers) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-cyan-50 pt-28 px-6 py-16">
      <div className="max-w-6xl mx-auto">

        {/* 🔥 HEADER */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100"
        >
          <div className="flex flex-col md:flex-row justify-between gap-4">

            <div>
              <h1 className="text-4xl font-bold text-gray-900">
                {station.name}
              </h1>

              <div className="flex items-center gap-2 text-gray-500 mt-3">
                <MapPin size={18} />
                {station.location}
              </div>
            </div>

            {/* STATUS BADGE */}
            <div className="flex items-center">
              <span className="bg-green-100 text-green-600 px-4 py-2 rounded-full text-sm font-medium">
                ⚡ Active Station
              </span>
            </div>

          </div>
        </motion.div>

        {/* ⚡ MAIN GRID */}
        <div className="grid md:grid-cols-3 gap-6 mt-8">

          {/* LEFT (INFO) */}
          <div className="md:col-span-2 space-y-6">

            {/* Charging Card */}
            <motion.div
              whileHover={{ scale: 1.01 }}
              className="bg-white p-6 rounded-2xl shadow border border-gray-100"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-lg flex items-center gap-2">
                  <Zap className="text-cyan-500" />
                  Charging Status
                </h3>

                <span className="text-sm text-gray-500">
                  {station.availableChargers} Available
                </span>
              </div>

              {/* Progress */}
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 h-3 rounded-full"
                  style={{ width: `${percentage}%` }}
                ></div>
              </div>

              <p className="text-sm text-gray-500 mt-3">
                {station.availableChargers} out of {station.totalChargers} chargers are free
              </p>
            </motion.div>

            {/* About */}
            <motion.div
              whileHover={{ scale: 1.01 }}
              className="bg-white p-6 rounded-2xl shadow border border-gray-100"
            >
              <h3 className="font-semibold text-lg mb-3">
                About This Station
              </h3>

              <p className="text-gray-600 text-sm leading-relaxed">
                {station.description}
              </p>
            </motion.div>
          </div>

          {/* RIGHT (BOOKING PANEL) */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white p-6 rounded-2xl shadow-xl border border-gray-100 h-fit"
          >
            <h3 className="text-lg font-semibold mb-4">
              Book Charging Slot
            </h3>

            {/* ⏱️ TIME SLOTS */}
            <div className="grid grid-cols-2 gap-3 mb-5">
              {timeSlots.map((slot, index) => {
                const isBooked = bookedSlots.includes(slot);

                return (
                  <button
                    key={index}
                    onClick={() => !isBooked && setSelectedSlot(slot)}
                    disabled={isBooked}
                    className={`py-2 rounded-lg border text-sm transition ${isBooked
                      ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                      : selectedSlot === slot
                        ? "bg-cyan-600 text-white border-cyan-600"
                        : "border-gray-300 hover:border-cyan-500"
                      }`}
                  >
                    {slot} {isBooked && "❌"}
                  </button>
                );
              })}
            </div>

            {/* 🚀 BOOK BUTTON */}
            <button
              onClick={() => selectedSlot && setShowModal(true)}
              disabled={!selectedSlot}
              className={`w-full py-3 rounded-xl font-semibold transition shadow-md ${selectedSlot
                ? "bg-gradient-to-r from-cyan-600 to-blue-600 text-white hover:opacity-90"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
                }`}
            >
              {selectedSlot ? "Confirm Booking ⚡" : "Select a Time Slot"}
            </button>
          </motion.div>

        </div>
      </div>
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white p-6 rounded-2xl shadow-xl w-[90%] max-w-md"
          >
            <h2 className="text-xl font-semibold mb-3">
              Confirm Booking
            </h2>

            <p className="text-gray-600 text-sm mb-4">
              You are booking a charging slot at{" "}
              <span className="font-medium text-gray-800">
                {station.name}
              </span>
            </p>

            <div className="bg-gray-100 rounded-lg p-3 text-sm mb-4">
              ⏱️ Time: <strong>{selectedSlot}</strong>
            </div>

            {/* ACTION BUTTONS */}
            <div className="flex gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 py-2 border rounded-lg"
              >
                Cancel
              </button>

              <button
                onClick={async () => {
                  try {
                    const res = await API.post("/bookings", {
                      stationId: station._id,
                      timeSlot: selectedSlot,
                    });

                    setBookings((prev) => [...prev, res.data]);

                    setSelectedSlot(null);

                    setShowModal(false);

                    toast.success("Booking Confirmed ⚡");

                  } catch (err) {
                    toast.error("Booking Failed ❌");
                  }
                }}
                className="flex-1 py-2 bg-cyan-600 text-white rounded-lg"
              >
                Confirm
              </button>
            </div>
          </motion.div>

        </div>
      )}
    </div>


  );
}

export default StationDetails;