import mongoose from "mongoose";

const stationSchema = new mongoose.Schema({
  name: String,
  location: String,
  lat: Number,
  lng: Number,
  totalChargers: Number,
  availableChargers: Number,
  image: String,
  description: {
  type: String,
  default: "",
},
});

export default mongoose.model("Station", stationSchema);