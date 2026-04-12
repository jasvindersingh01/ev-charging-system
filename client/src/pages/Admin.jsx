import { useEffect, useState } from "react";
import API from "../api/axios";
import { toast } from "react-toastify";
import LocationPicker from "../components/sections/LocationPicker";

function Admin() {
  const [stations, setStations] = useState([]);
  const [form, setForm] = useState({
    name: "",
    location: "",
    lat: null,
    lng: null,
    totalChargers: "",
    availableChargers: "",
    image: "",
  });

  const fetchStations = () => {
    API.get("/api/stations")
      .then((res) => setStations(res.data));
  };

  useEffect(() => {
    fetchStations();
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();

    const formData = new FormData();

    formData.append("name", form.name);
    formData.append("location", form.location);
    formData.append("lat", form.lat);
    formData.append("lng", form.lng);
    formData.append("totalChargers", form.totalChargers);
    formData.append("availableChargers", form.availableChargers);

    if (form.image) {
      formData.append("image", form.image);
    }

    if (!form.name || !form.location) {
      toast.error("Please fill all fields ❌");
      return;
    }

    if (!form.lat || !form.lng) {
      toast.error("Select location on map 📍");
      return;
    }

    try {
      await API.post("/api/stations", formData);

      toast.success("Station Added ⚡");

      fetchStations();
    } catch {
      toast.error("Error ❌");
    }
  };

  const handleDelete = async (id) => {
    try {
      await API.delete(`/api/stations/${id}`);
      toast.success("Deleted ✅");
      fetchStations();
    } catch (err) {
      console.log(err);
      toast.error(err.response?.data?.message || "Delete failed ❌");
    }
  };

  return (
    <div className="min-h-screen pt-28 px-6">
      <h1 className="text-2xl font-bold mb-6">Admin Panel ⚡</h1>

      {/* ➕ ADD FORM */}
      <form onSubmit={handleAdd} className="grid gap-3 mb-8">
        <input placeholder="Name" onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <input placeholder="Location" onChange={(e) => setForm({ ...form, location: e.target.value })} />
        <input type="number" placeholder="Total Chargers" onChange={(e) => setForm({ ...form, totalChargers: e.target.value })} />
        <input type="number" placeholder="Available Chargers" onChange={(e) => setForm({ ...form, availableChargers: e.target.value })} />
        <input
          type="file"
          onChange={(e) =>
            setForm({ ...form, image: e.target.files[0] })
          }
        />
        <LocationPicker setForm={setForm} />
        <p className="text-sm text-gray-500">
          Lat: {form.lat || "-"} | Lng: {form.lng || "-"}
        </p>

        <button className="bg-cyan-600 text-white py-2 rounded">
          Add Station
        </button>
      </form>

      {/* 📋 LIST */}
      <div className="grid md:grid-cols-3 gap-4">
        {stations.map((s) => (
          <div key={s._id} className="p-4 bg-white shadow rounded">
            <h2>{s.name}</h2>
            <p>{s.location}</p>

            <button
              onClick={() => handleDelete(s._id)}
              className="mt-2 text-red-500"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Admin;