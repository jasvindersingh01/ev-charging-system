import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  stationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Station",
  },
  timeSlot: String,
  status: {
    type: String,
    default: "booked",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("Booking", bookingSchema);