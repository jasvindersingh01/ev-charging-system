import { useEffect, useState } from "react";
import API from "../api/axios";
import { motion } from "framer-motion";

function Dashboard() {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    API.get("/bookings")
      .then((res) => setBookings(res.data))
      .catch((err) => console.log(err));
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 pt-28 px-6 py-10">
      <div className="max-w-6xl mx-auto">

        <h1 className="text-3xl font-bold mb-8">
          My Bookings ⚡
        </h1>

        {/* 🔥 BOOKING LIST */}
        <div className="grid gap-5">

          {bookings.length === 0 && (
            <p className="text-gray-500">No bookings yet.</p>
          )}

          {bookings.map((booking) => (
            <motion.div
              key={booking._id}
              whileHover={{ scale: 1.01 }}
              className="bg-white p-5 rounded-xl shadow border border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4"
            >
              {/* LEFT */}
              <div>
                <h2 className="text-lg font-semibold text-gray-800">
                  {booking.stationId?.name || "Station"}
                </h2>

                <p className="text-gray-500 text-sm">
                  ⏱️ {booking.timeSlot}
                </p>
              </div>

              {/* STATUS */}
              <div>
                <span className="px-3 py-1 bg-green-100 text-green-600 rounded-full text-sm">
                  {booking.status}
                </span>
              </div>
            </motion.div>
          ))}

        </div>
      </div>
    </div>
  );
}

export default Dashboard;