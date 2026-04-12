import { useEffect, useState } from "react";
import API from "../api/axios";
import { toast } from "react-toastify";
import LocationPicker from "../components/sections/LocationPicker";

function Admin() {
  const [stations, setStations] = useState([]);
  const [preview, setPreview] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  const [form, setForm] = useState({
    name: "",
    location: "",
    lat: null,
    lng: null,
    totalChargers: "",
    availableChargers: "",
    image: null,
  });

  const fetchStations = () => {
    API.get("/api/stations").then((res) => setStations(res.data));
  };

  useEffect(() => {
    fetchStations();
  }, []);

  // 🔥 INPUT HANDLER
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

  // ➕ ADD STATION
  const handleAdd = async (e) => {
    e.preventDefault();

    if (!form.name || !form.location) {
      toast.error("Fill all fields ❌");
      return;
    }

    if (!form.lat || !form.lng) {
      toast.error("Select location on map 📍");
      return;
    }

    const formData = new FormData();

    Object.keys(form).forEach((key) => {
      if (form[key] !== null) {
        formData.append(key, form[key]);
      }
    });

    try {
      await API.post("/api/stations", formData);
      toast.success("Station Added ⚡");

      fetchStations();

      // reset form
      setForm({
        name: "",
        location: "",
        lat: null,
        lng: null,
        totalChargers: "",
        availableChargers: "",
        image: null,
      });

      setPreview(null);

    } catch (err) {
      console.log(err);
      toast.error("Error ❌");
    }
  };

  // ❌ DELETE
  const handleDelete = async (id) => {
    try {
      await API.delete(`/api/stations/${id}`);
      toast.success("Deleted ✅");
      fetchStations();
    } catch (err) {
      toast.error("Delete failed ❌");
    }
  };

  const handleEdit = (station) => {
    setIsEditing(true);
    setEditingId(station._id);

    setForm({
      name: station.name,
      location: station.location,
      lat: station.lat,
      lng: station.lng,
      totalChargers: station.totalChargers,
      availableChargers: station.availableChargers,
      image: null,
    });

    setPreview(station.image);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    const formData = new FormData();

    Object.keys(form).forEach((key) => {
      if (form[key] !== null) {
        formData.append(key, form[key]);
      }
    });

    try {
      await API.put(`/api/stations/${editingId}`, formData);

      toast.success("Updated Successfully ✏️");

      fetchStations();
      resetForm();

    } catch (err) {
      toast.error("Update failed ❌");
    }
  };

  const resetForm = () => {
    setForm({
      name: "",
      location: "",
      lat: null,
      lng: null,
      totalChargers: "",
      availableChargers: "",
      image: null,
    });

    setPreview(null);
    setIsEditing(false);
    setEditingId(null);
  };

  return (
    <div className="min-h-screen pt-28 px-6 bg-gradient-to-br from-white to-cyan-50">
      <div className="max-w-7xl mx-auto">

        {/* 🔥 HEADER */}
        <h1 className="text-3xl font-bold mb-8 text-gray-800">
          Admin Dashboard ⚡
        </h1>

        {/* ➕ ADD FORM */}
        <form
          onSubmit={isEditing ? handleUpdate : handleAdd}
          className="bg-white/80 backdrop-blur-md p-6 rounded-3xl shadow-xl border mb-10 space-y-5"
        >
          <h2 className="text-xl font-semibold">Add New Station</h2>

          <div className="grid md:grid-cols-2 gap-4">
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Station Name"
              className="p-3 border rounded-lg focus:outline-cyan-500"
            />

            <input
              name="location"
              value={form.location}
              onChange={handleChange}
              placeholder="Location"
              className="p-3 border rounded-lg focus:outline-cyan-500"
            />

            <input
              name="totalChargers"
              type="number"
              value={form.totalChargers}
              onChange={handleChange}
              placeholder="Total Chargers"
              className="p-3 border rounded-lg"
            />

            <input
              name="availableChargers"
              type="number"
              value={form.availableChargers}
              onChange={handleChange}
              placeholder="Available Chargers"
              className="p-3 border rounded-lg"
            />
          </div>

          {/* 📸 IMAGE */}
          <div>
            <input
              type="file"
              name="image"
              onChange={handleChange}
              className="mb-2"
            />

            {preview && (
              <img
                src={preview}
                className="w-40 h-24 object-cover rounded-lg shadow"
              />
            )}
          </div>

          {/* 🗺️ MAP */}
          <LocationPicker setForm={setForm} />

          {/* 📍 LAT LNG */}
          <p className="text-sm text-gray-500">
            Lat: {form.lat || "-"} | Lng: {form.lng || "-"}
          </p>

          <button className="px-6 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-xl">
            {isEditing ? "Update Station ✏️" : "Add Station ⚡"}
          </button>
        </form>

        {/* 📋 STATIONS GRID */}
        <div className="grid md:grid-cols-3 gap-6">
          {stations.map((s) => (
            <div
              key={s._id}
              className="bg-white rounded-2xl shadow-lg overflow-hidden border hover:shadow-xl transition group"
            >
              {/* IMAGE */}
              <img
                src={s.image || "https://via.placeholder.com/400"}
                className="w-full h-40 object-cover group-hover:scale-105 transition"
              />

              {/* CONTENT */}
              <div className="p-4 space-y-2">
                <h2 className="font-semibold text-gray-800">{s.name}</h2>

                <p className="text-sm text-gray-500">{s.location}</p>

                <p className="text-xs text-gray-500">
                  ⚡ {s.availableChargers}/{s.totalChargers} chargers
                </p>

                {/* ACTIONS */}
                <div className="flex gap-2 mt-3">
                  <button
                    onClick={() => handleEdit(s)}
                    className="flex-1 py-2 text-sm bg-yellow-400 rounded-lg"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => setDeleteId(s._id)}
                    className="flex-1 py-2 text-sm bg-red-500 text-white rounded-lg"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>

          ))}
          {deleteId && (
            <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
              <div className="bg-white p-6 rounded-xl shadow-lg w-80 text-center space-y-4">
                <h2 className="text-lg font-semibold">Confirm Delete</h2>
                <p className="text-sm text-gray-500">
                  Are you sure you want to delete this station?
                </p>

                <div className="flex gap-3">
                  <button
                    onClick={() => setDeleteId(null)}
                    className="flex-1 py-2 bg-gray-200 rounded-lg"
                  >
                    Cancel
                  </button>

                  <button
                    onClick={async () => {
                      await handleDelete(deleteId);
                      setDeleteId(null);
                    }}
                    className="flex-1 py-2 bg-red-500 text-white rounded-lg"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

export default Admin;