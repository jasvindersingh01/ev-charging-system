import express from "express";
import Booking from "../models/Booking.js";

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
  const bookings = await Booking.find();
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

export default router;