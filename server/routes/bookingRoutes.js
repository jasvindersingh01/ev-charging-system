import express from "express";
import Booking from "../models/Booking.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const booking = new Booking(req.body);
    await booking.save();
    res.json(booking);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/", async (req, res) => {
  const bookings = await Booking.find().populate("stationId");
  res.json(bookings);
});

// Get bookings by station
router.get("/station/:stationId", async (req, res) => {
  try {
    const bookings = await Booking.find({
      stationId: req.params.stationId,
    });

    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/", protect, async (req, res) => {
  try {
    const { stationId, timeSlot } = req.body;

    const booking = new Booking({
      stationId,
      timeSlot,
      userId: req.user.id, // 🔥 important
    });

    await booking.save();

    res.json(booking);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/", protect, async (req, res) => {
  const bookings = await Booking.find({
    userId: req.user.id,
  }).populate("stationId");

  res.json(bookings);
}); 


export default router;