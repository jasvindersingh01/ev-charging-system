import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import { useState } from "react";

function LocationMarker({ setForm }) {
  const [position, setPosition] = useState(null);

  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;

      setPosition([lat, lng]);

      // 🔥 update form
      setForm((prev) => ({
        ...prev,
        lat,
        lng,
      }));
    },
  });

  return position ? <Marker position={position} /> : null;
}

function LocationPicker({ setForm }) {
  return (
    <div className="h-64 w-full rounded-xl overflow-hidden mb-4">
      <MapContainer
        center={[25.2138, 75.8648]}
        zoom={6}
        className="h-full w-full"
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <LocationMarker setForm={setForm} />
      </MapContainer>
    </div>
  );
}

export default LocationPicker;