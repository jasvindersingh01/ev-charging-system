import { useEffect, useState } from "react";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft, Calendar, MapPin, User,
  Clock, CheckCircle2, XCircle,
  Search, Filter, Zap
} from "lucide-react";
import { motion } from "framer-motion";

function AdminBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const navigate = useNavigate();

  useEffect(() => {
    API.get("/bookings/admin/all")
      .then((res) => { setBookings(res.data); setLoading(false); })
      .catch((err) => { console.log(err); setLoading(false); });
  }, []);

  // Filter + Search
  const filtered = bookings.filter((b) => {
    const matchSearch =
      b.stationId?.name?.toLowerCase().includes(search.toLowerCase()) ||
      b.userId?.name?.toLowerCase().includes(search.toLowerCase()) ||
      b.userId?.email?.toLowerCase().includes(search.toLowerCase());

    const currentStatus = (b.status || "confirmed").toLowerCase();
    const matchStatus = 
      filterStatus === "all" || currentStatus === filterStatus;

    return matchSearch && matchStatus;
  });

  const getStatusConfig = (status) => {
    const currentStatus = (status || "confirmed").toLowerCase();

    switch (currentStatus) {
      case "confirmed":
        return { icon: CheckCircle2, color: "emerald", label: "Confirmed" };
      case "cancelled":
        return { icon: XCircle, color: "red", label: "Cancelled" };
      default:
        return { icon: CheckCircle2, color: "emerald", label: "Confirmed" };
    }
  };

  // Stats (Only Confirmed & Cancelled)
  const total = bookings.length;
  const confirmed = bookings.filter((b) => (b.status || "confirmed").toLowerCase() === "confirmed").length;
  const cancelled = bookings.filter((b) => (b.status || "").toLowerCase() === "cancelled").length;

  if (loading) return (
    <div className="min-h-screen bg-gray-50 pt-24 px-6">
      <div className="max-w-6xl mx-auto animate-pulse space-y-4">
        <div className="h-10 w-36 bg-gray-200 rounded-xl" />
        <div className="grid grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => <div key={i} className="h-24 bg-gray-200 rounded-2xl" />)}
        </div>
        {[...Array(5)].map((_, i) => <div key={i} className="h-20 bg-gray-200 rounded-2xl" />)}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">

        {/* Back Button */}
        <button
          onClick={() => navigate("/admin")}
          className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl border border-gray-200 text-sm text-gray-600 hover:border-gray-300 shadow-sm transition mb-6"
        >
          <ArrowLeft size={16} /> Back to Dashboard
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="h-11 w-11 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/25">
            <Calendar size={20} className="text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">All Bookings</h1>
            <p className="text-sm text-gray-400">{total} total bookings</p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {[
            { label: "Total", value: total, color: "cyan", icon: Zap },
            { label: "Confirmed", value: confirmed, color: "emerald", icon: CheckCircle2 },
            { label: "Cancelled", value: cancelled, color: "red", icon: XCircle },
          ].map((stat, i) => (
            <div key={i} className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 flex items-center gap-3">
              <div className={`h-10 w-10 rounded-xl bg-${stat.color}-50 flex items-center justify-center`}>
                <stat.icon size={18} className={`text-${stat.color}-600`} />
              </div>
              <div>
                <div className="text-xl font-bold text-gray-900">{stat.value}</div>
                <div className="text-xs text-gray-400">{stat.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Search + Filter */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="flex-1 flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-xl shadow-sm">
            <Search size={16} className="text-gray-400" />
            <input
              type="text"
              placeholder="Search by station, user name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full text-sm outline-none text-gray-700 placeholder-gray-400"
            />
          </div>

          <div className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-xl shadow-sm">
            <Filter size={16} className="text-gray-400" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="text-sm outline-none text-gray-700 bg-transparent"
            >
              <option value="all">All Status</option>
              <option value="confirmed">Confirmed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        {/* Bookings List */}
        {filtered.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-16 text-center">
            <Calendar size={40} className="mx-auto text-gray-200 mb-3" />
            <h3 className="text-gray-500 font-medium">No bookings found</h3>
            <p className="text-sm text-gray-400 mt-1">Try changing your search or filter</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((b, i) => {
              const statusConfig = getStatusConfig(b.status);
              const StatusIcon = statusConfig.icon;

              return (
                <motion.div
                  key={b._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.03 }}
                  className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 hover:shadow-md transition"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">

                    <div className="flex items-start gap-4">
                      <div className="h-14 w-14 rounded-xl overflow-hidden flex-shrink-0 bg-gray-100">
                        {b.stationId?.image ? (
                          <img
                            src={b.stationId.image}
                            alt={b.stationId?.name}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="h-full w-full flex items-center justify-center bg-cyan-50">
                            <Zap size={22} className="text-cyan-400" />
                          </div>
                        )}
                      </div>

                      <div className="space-y-1">
                        <h3 className="font-semibold text-gray-900 text-sm">
                          {b.stationId?.name || "Unknown Station"}
                        </h3>
                        <div className="flex items-center gap-1 text-xs text-gray-400">
                          <MapPin size={11} />
                          {b.stationId?.location || "N/A"}
                        </div>
                        <div className="flex items-center gap-1 text-xs text-gray-500">
                          <User size={11} />
                          {b.userId?.name || "Unknown"} • {b.userId?.email || "N/A"}
                        </div>
                        <div className="flex items-center gap-1 text-xs text-gray-500">
                          <Clock size={11} />
                          {b.timeSlot}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-${statusConfig.color}-50 text-${statusConfig.color}-600 border border-${statusConfig.color}-100`}>
                        <StatusIcon size={13} />
                        {statusConfig.label}
                      </span>
                    </div>

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

export default AdminBookings;