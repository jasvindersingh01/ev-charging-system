import { useEffect, useState } from "react";
import API from "../api/axios";
import StationCard from "../components/sections/StationCard";
import MapView from "../components/sections/MapView";
import {
  Search, MapPin, Zap, Battery, Filter,
  Map, LayoutGrid, SlidersHorizontal
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

function Stations() {
  const [stations, setStations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState("grid"); // grid or map
  const [filterOpen, setFilterOpen] = useState(false);
  const [availabilityFilter, setAvailabilityFilter] = useState("all");

  useEffect(() => {
    setLoading(true);
    API.get("/api/stations")
      .then((res) => { setStations(res.data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  // Search + Filter
  const filtered = stations.filter((s) => {
    const matchSearch =
      s.name?.toLowerCase().includes(search.toLowerCase()) ||
      s.location?.toLowerCase().includes(search.toLowerCase());

    const matchAvailability =
      availabilityFilter === "all"
        ? true
        : availabilityFilter === "available"
        ? s.availableChargers > 0
        : s.availableChargers === 0;

    return matchSearch && matchAvailability;
  });

  // Stats
  const totalStations = stations.length;
  const totalChargers = stations.reduce((a, s) => a + (s.totalChargers || 0), 0);
  const availableNow = stations.filter((s) => s.availableChargers > 0).length;

  // Skeleton
  if (loading) return (
    <div className="min-h-screen bg-gray-50 pt-24 px-6">
      <div className="max-w-7xl mx-auto animate-pulse space-y-6">
        <div className="h-10 w-72 bg-gray-200 rounded-xl" />
        <div className="grid grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => <div key={i} className="h-24 bg-gray-200 rounded-2xl" />)}
        </div>
        <div className="h-12 bg-gray-200 rounded-xl" />
        <div className="grid md:grid-cols-3 gap-5">
          {[...Array(6)].map((_, i) => <div key={i} className="h-64 bg-gray-200 rounded-2xl" />)}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">

        {/* ── Header ───────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 pt-4"
        >
          <h1 className="text-3xl font-bold text-gray-900">
            Charging Stations
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            Find and book EV charging stations near you
          </p>
        </motion.div>

        {/* ── Stats ─────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-3 gap-4 mb-6"
        >
          {[
            { label: "Total Stations", value: totalStations, icon: MapPin, color: "cyan" },
            { label: "Total Chargers", value: totalChargers, icon: Battery, color: "blue" },
            { label: "Available Now", value: availableNow, icon: Zap, color: "emerald" },
          ].map((stat, i) => (
            <div key={i} className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 flex items-center gap-3">
              <div className={`h-10 w-10 rounded-xl bg-${stat.color}-50 flex items-center justify-center`}>
                <stat.icon size={18} className={`text-${stat.color}-600`} />
              </div>
              <div>
                <div className="text-xl font-bold text-gray-900">{stat.value}</div>
                <div className="text-xs text-gray-400 font-medium">{stat.label}</div>
              </div>
            </div>
          ))}
        </motion.div>

        {/* ── Search + Filter + View Toggle ─────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col sm:flex-row gap-3 mb-6"
        >
          {/* Search */}
          <div className="flex-1 flex items-center gap-2 px-4 py-3 bg-white border border-gray-200 rounded-xl shadow-sm focus-within:border-cyan-400 focus-within:ring-2 focus-within:ring-cyan-100 transition">
            <Search size={18} className="text-gray-400" />
            <input
              type="text"
              placeholder="Search by station name or location..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full text-sm outline-none text-gray-700 placeholder-gray-400"
            />
            {search && (
              <button onClick={() => setSearch("")} className="text-gray-300 hover:text-gray-500">
                ✕
              </button>
            )}
          </div>

          {/* Filter */}
          <div className="relative">
            <button
              onClick={() => setFilterOpen(!filterOpen)}
              className="flex items-center gap-2 px-4 py-3 bg-white border border-gray-200 rounded-xl shadow-sm text-sm text-gray-600 hover:border-gray-300 transition"
            >
              <SlidersHorizontal size={16} />
              Filter
              {availabilityFilter !== "all" && (
                <span className="h-2 w-2 rounded-full bg-cyan-500" />
              )}
            </button>

            <AnimatePresence>
              {filterOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-xl shadow-lg z-20 overflow-hidden"
                >
                  {[
                    { label: "All Stations", value: "all" },
                    { label: "Available", value: "available" },
                    { label: "Fully Booked", value: "full" },
                  ].map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => { setAvailabilityFilter(opt.value); setFilterOpen(false); }}
                      className={`w-full text-left px-4 py-2.5 text-sm transition ${
                        availabilityFilter === opt.value
                          ? "bg-cyan-50 text-cyan-600 font-medium"
                          : "text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* View Toggle */}
          <div className="flex bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
            <button
              onClick={() => setViewMode("grid")}
              className={`flex items-center gap-1.5 px-4 py-3 text-sm transition ${
                viewMode === "grid"
                  ? "bg-cyan-50 text-cyan-600 font-medium"
                  : "text-gray-500 hover:bg-gray-50"
              }`}
            >
              <LayoutGrid size={16} />
              Grid
            </button>
            <button
              onClick={() => setViewMode("map")}
              className={`flex items-center gap-1.5 px-4 py-3 text-sm transition border-l border-gray-200 ${
                viewMode === "map"
                  ? "bg-cyan-50 text-cyan-600 font-medium"
                  : "text-gray-500 hover:bg-gray-50"
              }`}
            >
              <Map size={16} />
              Map
            </button>
          </div>
        </motion.div>

        {/* ── Active Filters ────────────────────────────────── */}
        {(search || availabilityFilter !== "all") && (
          <div className="flex items-center gap-2 mb-5 flex-wrap">
            <span className="text-xs text-gray-400">Active filters:</span>

            {search && (
              <span className="flex items-center gap-1 px-3 py-1 bg-cyan-50 text-cyan-700 text-xs rounded-lg border border-cyan-100">
                Search: "{search}"
                <button onClick={() => setSearch("")} className="ml-1 hover:text-cyan-900">✕</button>
              </span>
            )}

            {availabilityFilter !== "all" && (
              <span className="flex items-center gap-1 px-3 py-1 bg-cyan-50 text-cyan-700 text-xs rounded-lg border border-cyan-100">
                {availabilityFilter === "available" ? "Available" : "Fully Booked"}
                <button onClick={() => setAvailabilityFilter("all")} className="ml-1 hover:text-cyan-900">✕</button>
              </span>
            )}

            <button
              onClick={() => { setSearch(""); setAvailabilityFilter("all"); }}
              className="text-xs text-gray-400 hover:text-gray-600 underline"
            >
              Clear all
            </button>
          </div>
        )}

        {/* ── Content ───────────────────────────────────────── */}
        <AnimatePresence mode="wait">

          {/* Map View */}
          {viewMode === "map" && (
            <motion.div
              key="map"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden mb-6"
            >
              <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Map size={16} className="text-cyan-600" />
                  <span className="text-sm font-medium text-gray-700">Map View</span>
                </div>
                <span className="text-xs text-gray-400">
                  {filtered.length} stations shown
                </span>
              </div>
              <MapView stations={filtered} />
            </motion.div>
          )}

          {/* Grid View */}
          {viewMode === "grid" && (
            <motion.div
              key="grid"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {/* Results count */}
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-medium text-gray-500">
                  Showing {filtered.length} of {totalStations} stations
                </h2>
              </div>

              {filtered.length === 0 ? (
                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-16 text-center">
                  <MapPin size={40} className="mx-auto text-gray-200 mb-3" />
                  <h3 className="text-gray-500 font-medium">No stations found</h3>
                  <p className="text-sm text-gray-400 mt-1">Try adjusting your search or filter</p>
                  <button
                    onClick={() => { setSearch(""); setAvailabilityFilter("all"); }}
                    className="mt-4 px-4 py-2 bg-cyan-50 text-cyan-600 text-sm rounded-xl border border-cyan-100 hover:bg-cyan-100 transition"
                  >
                    Clear filters
                  </button>
                </div>
              ) : (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {filtered.map((station, i) => (
                    <motion.div
                      key={station._id}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                    >
                      <StationCard station={station} />
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default Stations;