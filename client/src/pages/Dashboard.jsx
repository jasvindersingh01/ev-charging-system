import { useEffect, useState } from "react";
import API from "../api/axios";
import { motion } from "framer-motion";
import { MapPin, Clock, Calendar, AlertCircle, Loader2, Trash2 } from "lucide-react";
import toast from "react-hot-toast";

/**
 * A reusable status badge component for booking statuses.
 */
function StatusBadge({ status }) {
  const statusStyles = {
    booked: "bg-green-50 border-green-200 text-green-700",
    charging: "bg-yellow-50 border-yellow-200 text-yellow-700",
    completed: "bg-gray-50 border-gray-200 text-gray-600",
    cancelled: "bg-red-50 border-red-200 text-red-600",
  };

  const statusLabels = {
    booked: "Booked",
    charging: "Charging",
    completed: "Completed",
    cancelled: "Cancelled",
  };

  return (
    <span
      className={`px-4 py-1 rounded-full text-sm font-medium border ${statusStyles[status] || statusStyles.cancelled}`}
      aria-label={`Status: ${statusLabels[status] || "Unknown"}`}
    >
      {statusLabels[status] || "Unknown"}
    </span>
  );
}

/**
 * Dashboard — displays the user’s bookings with the ability to cancel if applicable.
 */
function Dashboard() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cancellingId, setCancellingId] = useState(null); // tracks which booking is being cancelled

  // Fetch bookings on mount
  useEffect(() => {
    async function fetchBookings() {
      try {
        setLoading(true);
        setError(null);
        const res = await API.get("/bookings");
        setBookings(res.data || []);
      } catch (err) {
        console.error(err);
        setError(
          err?.response?.data?.message ||
          "Failed to load bookings. Please try again."
        );
        toast.error("Failed to load bookings ❌");
      } finally {
        setLoading(false);
      }
    }

    fetchBookings();
  }, []);

  /**
   * Cancel a booking with optimistic UI update + rollback on failure.
   */
  async function handleCancel(bookingId) {
    // Store the previous state in case we need to rollback
    const previousBookings = bookings;

    // Optimistic update: mark the booking as cancelled immediately
    setBookings((prev) =>
      prev.map((b) =>
        b._id === bookingId ? { ...b, status: "cancelled" } : b
      )
    );

    try {
      setCancellingId(bookingId);
      await API.put(`/bookings/${bookingId}/cancel`);
      toast.success("Booking cancelled ❌");
    } catch (err) {
      console.error(err);
      toast.error(
        err?.response?.data?.message || "Failed to cancel booking ❌"
      );

      // Rollback to previous state if the API call fails
      setBookings(previousBookings);
    } finally {
      setCancellingId(null);
    }
  }

  // Helper to format dates in a consistent way (local time)
  function formatDate(dateString) {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(date);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-cyan-50 pt-28 px-6 py-10">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="bg-white p-4 rounded-xl shadow border mb-6">
            <h1 className="text-xl font-semibold text-gray-800">
              My Bookings
            </h1>
          </div>
          <div className="text-sm text-gray-500">
            {bookings.length > 0 ? `${bookings.length} bookings` : "No bookings"}
          </div>
        </div>

        {/* Loading state */}
        {loading && (
          <div className="flex justify-center items-center py-20 text-gray-500">
            <Loader2 size={28} className="animate-spin mr-2" />
            <span>Loading your bookings…</span>
          </div>
        )}

        {/* Error state */}
        {!loading && error && (
          <div className="flex items-center gap-3 p-6 bg-red-50 border border-red-200 rounded-xl text-red-700">
            <AlertCircle size={20} />
            <div>
              <p className="font-semibold">Error</p>
              <p className="text-sm">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="mt-3 px-4 py-2 rounded-lg bg-red-600 text-white text-sm font-medium transition hover:bg-red-700"
                aria-label="Retry loading bookings"
              >
                Retry
              </button>
            </div>
          </div>
        )}

        {/* Empty state */}
        {!loading && !error && bookings.length === 0 && (
          <div className="text-center py-20 text-gray-500">
            <div className="text-6xl mb-4" aria-hidden>🚗⚡</div>
            <p className="text-lg">No bookings yet</p>
            <p className="text-sm">Start by finding a charging station near you</p>
          </div>
        )}

        {/* Booking cards */}
        {!loading && !error && bookings.length > 0 && (
          <div className="grid gap-6">
            {bookings.map((booking) => {
              const station = booking.stationId || {};
              const isCancellable =
                booking.status !== "cancelled" &&
                booking.status !== "completed";

              return (
                <motion.div
                  key={booking._id}
                  whileHover={{ y: -4 }}
                  transition={{ duration: 0.2 }}
                  className="relative bg-white rounded-2xl shadow-md border border-gray-100 p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-6"
                >
                  {/* Left info */}
                  <div className="flex-1 space-y-3">
                    {/* Station name */}
                    <h2 className="text-lg font-bold text-gray-800">
                      {station.name || "Unknown Station"}
                    </h2>

                    {/* Location */}
                    <div className="flex items-center gap-2 text-gray-600 text-sm">
                      <MapPin size={16} className="text-cyan-600" />
                      <span className="truncate max-w-[60ch]">
                        {station.location || "Location not available"}
                      </span>
                    </div>

                    {/* Time + Date */}
                    <div className="flex flex-wrap items-center gap-x-8 gap-y-2 text-gray-600 text-sm">
                      <div className="flex items-center gap-2">
                        <Clock size={16} className="text-cyan-600" />
                        <span>{booking.timeSlot || "Not specified"}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar size={16} className="text-cyan-600" />
                        <span>{formatDate(booking.createdAt)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Right actions */}
                  <div className="flex flex-col items-start md:items-end gap-3 w-full md:w-auto">
                    {/* Status */}
                    <StatusBadge status={booking.status} />

                    {/* Booking ID (small) */}
                    <span
                      className="text-xs text-gray-400 font-mono"
                      title={booking._id}
                    >
                      Booking ID: {booking._id.slice(-5)}
                    </span>

                    {/* Cancel button */}
                    {isCancellable && (
                      <button
                        onClick={() => handleCancel(booking._id)}
                        disabled={cancellingId === booking._id}
                        className="px-4 py-2 rounded-lg bg-red-600 text-white text-sm font-semibold shadow-sm transition hover:bg-red-700 disabled:bg-red-300 disabled:cursor-not-allowed flex items-center gap-2"
                        aria-label="Cancel booking"
                      >
                        {cancellingId === booking._id ? (
                          <>
                            <Loader2 size={16} className="animate-spin" />
                            <span>Cancelling…</span>
                          </>
                        ) : (
                          <span>Cancel</span>
                        )}
                      </button>
                    )}
                    {booking.status === "cancelled" && (
                      <button
                        onClick={async () => {
                          try {
                            await API.delete(`/bookings/${booking._id}`);

                            // UI se remove
                            setBookings((prev) =>
                              prev.filter((b) => b._id !== booking._id)
                            );

                            toast.success("Removed");
                          } catch (err) {
                            toast.error("Delete failed");
                          }
                        }}
                        className="p-2 bg-red-100 text-red-500 rounded-lg hover:bg-red-200 transition"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}

                    {!isCancellable && booking.status === "completed" && (
                      <span className="px-4 py-2 rounded-lg border border-gray-200 bg-gray-50 text-gray-600 text-sm font-medium">
                        Completed
                      </span>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;