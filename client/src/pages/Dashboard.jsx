import { useEffect, useState } from "react";
import API from "../api/axios";
import { motion } from "framer-motion";
import { MapPin, Clock, Calendar } from "lucide-react";

function Dashboard() {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    API.get("/bookings")
      .then((res) => setBookings(res.data))
      .catch((err) => console.log(err));
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-cyan-50 pt-28 px-6 py-10">
      <div className="max-w-6xl mx-auto">

        {/* 🔥 HEADER */}
        <h1 className="text-3xl font-bold mb-8 text-gray-800">
          My Bookings ⚡
        </h1>

        {/* EMPTY STATE */}
        {bookings.length === 0 && (
          <div className="text-center text-gray-500 mt-20">
            No bookings yet 🚗⚡
          </div>
        )}

        {/* 🔥 BOOKING CARDS */}
        <div className="grid gap-6">

          {bookings.map((booking) => {
            const date = new Date(booking.createdAt).toLocaleDateString();

            return (
              <motion.div
                key={booking._id}
                whileHover={{ y: -3 }}
                className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-5"
              >
                {/* LEFT INFO */}
                <div className="space-y-2">

                  {/* Station Name */}
                  <h2 className="text-lg font-semibold text-gray-800">
                    {booking.stationId?.name || "Unknown Station"}
                  </h2>

                  {/* Location */}
                  <div className="flex items-center gap-2 text-gray-500 text-sm">
                    <MapPin size={16} />
                    {booking.stationId?.location || "Location not available"}
                  </div>

                  {/* Time */}
                  <div className="flex items-center gap-2 text-gray-500 text-sm">
                    <Clock size={16} />
                    {booking.timeSlot}
                  </div>

                  {/* Date */}
                  <div className="flex items-center gap-2 text-gray-500 text-sm">
                    <Calendar size={16} />
                    {date}
                  </div>
                </div>

                {/* RIGHT STATUS */}
                <div className="flex flex-col items-end gap-2">

                  <span
                    className={`px-4 py-1 rounded-full text-sm font-medium ${
                      booking.status === "booked"
                        ? "bg-green-100 text-green-600"
                        : booking.status === "charging"
                        ? "bg-yellow-100 text-yellow-600"
                        : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    {booking.status}
                  </span>

                  <span className="text-xs text-gray-400">
                    Booking ID: {booking._id.slice(-5)}
                  </span>

                </div>
              </motion.div>
            );
          })}

        </div>
      </div>
    </div>
  );
}

export default Dashboard;