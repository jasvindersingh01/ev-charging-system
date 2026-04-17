import { useEffect, useState } from "react";
import API from "../api/axios";
import { toast } from "react-toastify";
import LocationPicker from "../components/sections/LocationPicker";
import {
  Plus, Pencil, Trash2, Zap, MapPin, X, LayoutDashboard,
  ImagePlus, ChevronRight, AlertTriangle, Battery
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

function Admin() {
  const [stations, setStations] = useState([]);
  const [preview, setPreview] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const [form, setForm] = useState({
    name: "", location: "", lat: null, lng: null,
    totalChargers: "", availableChargers: "", image: null, description: "",
  });

  const fetchStations = () => {
    API.get("/api/stations").then((res) => setStations(res.data));
  };

  useEffect(() => { fetchStations(); }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      const file = files[0];
      setForm({ ...form, image: file });
      setPreview(URL.createObjectURL(file));
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!form.name || !form.location) return toast.error("Fill all required fields");
    if (form.lat === null || form.lng === null) return toast.error("Select location on map 📍");

    const formData = new FormData();
    Object.keys(form).forEach((key) => {
      if (key === "image") { if (form.image) formData.append("image", form.image); }
      else if (form[key] !== null && form[key] !== "") formData.append(key, form[key]);
    });

    try {
      await API.post("/api/stations", formData);
      toast.success("Station Added ⚡");
      fetchStations();
      resetForm();
    } catch { toast.error("Something went wrong"); }
  };

  const handleDelete = async (id) => {
    try {
      await API.delete(`/api/stations/${id}`);
      toast.success("Station Deleted");
      fetchStations();
    } catch { toast.error("Delete failed"); }
  };

  const handleEdit = (station) => {
    setIsEditing(true);
    setEditingId(station._id);
    setShowForm(true);
    setForm({
      name: station.name, location: station.location,
      lat: station.lat, lng: station.lng,
      totalChargers: station.totalChargers,
      availableChargers: station.availableChargers,
      image: null, description: station.description || "",
    });
    setPreview(station.image);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    Object.keys(form).forEach((key) => {
      if (form[key] !== null) formData.append(key, form[key]);
    });
    try {
      await API.put(`/api/stations/${editingId}`, formData);
      toast.success("Station Updated ✏️");
      fetchStations();
      resetForm();
    } catch { toast.error("Update failed"); }
  };

  const resetForm = () => {
    setForm({ name: "", location: "", lat: null, lng: null, totalChargers: "", availableChargers: "", image: null, description: "" });
    setPreview(null);
    setIsEditing(false);
    setEditingId(null);
    setShowForm(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">

        {/* ── Header ───────────────────────────────────────── */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/25">
              <LayoutDashboard size={22} className="text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-sm text-gray-400">{stations.length} stations managed</p>
            </div>
          </div>

          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={() => { resetForm(); setShowForm(!showForm); }}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold shadow-sm transition ${
              showForm
                ? "bg-gray-100 text-gray-600 hover:bg-gray-200"
                : "bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-cyan-500/25 hover:opacity-90"
            }`}
          >
            {showForm ? <><X size={16} /> Close</> : <><Plus size={16} /> Add Station</>}
          </motion.button>
        </div>

        {/* ── Stats Row ─────────────────────────────────────── */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
          {[
            { label: "Total Stations", value: stations.length, icon: Zap, color: "cyan" },
            { label: "Total Chargers", value: stations.reduce((a, s) => a + (s.totalChargers || 0), 0), icon: Battery, color: "blue" },
            { label: "Available Now", value: stations.reduce((a, s) => a + (s.availableChargers || 0), 0), icon: MapPin, color: "emerald" },
          ].map((stat, i) => (
            <div key={i} className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 flex items-center gap-4">
              <div className={`h-11 w-11 rounded-xl bg-${stat.color}-50 flex items-center justify-center`}>
                <stat.icon size={20} className={`text-${stat.color}-600`} />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                <div className="text-xs text-gray-400 font-medium">{stat.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* ── Add / Edit Form ───────────────────────────────── */}
        <AnimatePresence>
          {showForm && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden mb-8"
            >
              {/* Form Header */}
              <div className="h-1 bg-gradient-to-r from-cyan-500 to-blue-500" />
              <div className="p-6 border-b border-gray-100">
                <h2 className="text-lg font-semibold text-gray-900">
                  {isEditing ? "Edit Station" : "Add New Station"}
                </h2>
                <p className="text-sm text-gray-400 mt-0.5">
                  {isEditing ? "Update the station details below" : "Fill in the details to add a new charging station"}
                </p>
              </div>

              <form onSubmit={isEditing ? handleUpdate : handleAdd} className="p-6 space-y-6">

                {/* Basic Info */}
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Station Name *</label>
                    <input
                      name="name" value={form.name} onChange={handleChange}
                      placeholder="e.g. Green Charge Hub"
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-400 transition"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Location *</label>
                    <input
                      name="location" value={form.location} onChange={handleChange}
                      placeholder="e.g. Sector 21, Noida"
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-400 transition"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Total Chargers</label>
                    <input
                      name="totalChargers" type="number" value={form.totalChargers} onChange={handleChange}
                      placeholder="e.g. 10"
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-400 transition"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Available Chargers</label>
                    <input
                      name="availableChargers" type="number" value={form.availableChargers} onChange={handleChange}
                      placeholder="e.g. 6"
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-400 transition"
                    />
                  </div>
                  <div className="space-y-1.5 sm:col-span-2">
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Description</label>
                    <textarea
                      name="description" value={form.description} onChange={handleChange}
                      placeholder="Brief description about the station..."
                      rows={3}
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-400 transition resize-none"
                    />
                  </div>
                </div>

                {/* Image Upload */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Station Image</label>
                  <div className="flex items-center gap-4">
                    <label className="flex items-center gap-2 px-4 py-2.5 border border-dashed border-gray-300 rounded-xl text-sm text-gray-500 hover:border-cyan-400 hover:text-cyan-600 cursor-pointer transition">
                      <ImagePlus size={16} />
                      Choose Image
                      <input type="file" name="image" onChange={handleChange} className="hidden" accept="image/*" />
                    </label>
                    {preview && (
                      <div className="relative">
                        <img src={preview} className="h-16 w-24 object-cover rounded-xl border border-gray-200" />
                        <button type="button" onClick={() => { setPreview(null); setForm({ ...form, image: null }); }}
                          className="absolute -top-2 -right-2 h-5 w-5 bg-red-500 text-white rounded-full flex items-center justify-center">
                          <X size={10} />
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Map */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Pin Location on Map *</label>
                  <div className="rounded-xl overflow-hidden border border-gray-200">
                    <LocationPicker setForm={setForm} />
                  </div>
                  {form.lat && form.lng && (
                    <div className="flex items-center gap-2 text-xs text-emerald-600 bg-emerald-50 px-3 py-2 rounded-lg border border-emerald-100">
                      <MapPin size={12} />
                      Location pinned: {Number(form.lat).toFixed(4)}, {Number(form.lng).toFixed(4)}
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3 pt-2 border-t border-gray-100">
                  <button type="button" onClick={resetForm}
                    className="px-5 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-50 transition">
                    Cancel
                  </button>
                  <button type="submit"
                    className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-xl text-sm font-semibold shadow-lg shadow-cyan-500/25 hover:opacity-90 transition">
                    {isEditing ? <><Pencil size={15} /> Update Station</> : <><Plus size={15} /> Add Station</>}
                  </button>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Stations Grid ─────────────────────────────────── */}
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-800">All Stations</h2>
          <span className="text-sm text-gray-400">{stations.length} total</span>
        </div>

        {stations.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-16 text-center">
            <Zap size={40} className="mx-auto text-gray-200 mb-3" />
            <h3 className="text-gray-500 font-medium">No stations yet</h3>
            <p className="text-sm text-gray-400 mt-1">Click "Add Station" to get started</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {stations.map((s) => {
              const pct = Math.round((s.availableChargers / s.totalChargers) * 100) || 0;
              const color = pct > 50 ? "emerald" : pct > 20 ? "amber" : "red";
              return (
                <motion.div
                  key={s._id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition group"
                >
                  {/* Image */}
                  <div className="relative h-44 overflow-hidden">
                    <img
                      src={s.image || "https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=600&auto=format&fit=crop"}
                      alt={s.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                    <div className={`absolute top-3 right-3 px-2.5 py-1 bg-${color}-500 text-white text-xs font-semibold rounded-lg`}>
                      {pct}% Free
                    </div>
                    <div className="absolute bottom-3 left-3">
                      <h3 className="text-white font-semibold text-base">{s.name}</h3>
                      <div className="flex items-center gap-1 text-white/70 text-xs mt-0.5">
                        <MapPin size={11} /> {s.location}
                      </div>
                    </div>
                  </div>

                  {/* Body */}
                  <div className="p-4 space-y-3">
                    {/* Progress */}
                    <div>
                      <div className="flex justify-between text-xs text-gray-500 mb-1.5">
                        <span>Charger Availability</span>
                        <span className="font-medium">{s.availableChargers}/{s.totalChargers}</span>
                      </div>
                      <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full bg-${color}-500 transition-all`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 pt-1">
                      <button
                        onClick={() => handleEdit(s)}
                        className="flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-semibold bg-amber-50 text-amber-600 border border-amber-100 rounded-xl hover:bg-amber-100 transition"
                      >
                        <Pencil size={13} /> Edit
                      </button>
                      <button
                        onClick={() => setDeleteId(s._id)}
                        className="flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-semibold bg-red-50 text-red-500 border border-red-100 rounded-xl hover:bg-red-100 transition"
                      >
                        <Trash2 size={13} /> Delete
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* ── Delete Confirm Modal ──────────────────────────── */}
      <AnimatePresence>
        {deleteId && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setDeleteId(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden"
            >
              <div className="h-1 bg-red-500" />
              <div className="p-6 text-center space-y-4">
                <div className="h-14 w-14 rounded-2xl bg-red-50 flex items-center justify-center mx-auto">
                  <AlertTriangle size={26} className="text-red-500" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-900">Delete Station?</h2>
                  <p className="text-sm text-gray-400 mt-1">This action cannot be undone. The station will be permanently removed.</p>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => setDeleteId(null)}
                    className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 transition"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={async () => { await handleDelete(deleteId); setDeleteId(null); }}
                    className="flex-1 py-2.5 bg-red-500 text-white rounded-xl text-sm font-semibold hover:bg-red-600 transition"
                  >
                    Yes, Delete
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

export default Admin;