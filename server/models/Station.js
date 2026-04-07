import mongoose from "mongoose";

const stationSchema = new mongoose.Schema({
  name: String,
  location: String,
  lat: Number,
  lng: Number,
  totalChargers: Number,
  availableChargers: Number,
});

export default mongoose.model("Station", stationSchema);