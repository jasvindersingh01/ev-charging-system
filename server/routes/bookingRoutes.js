import express from "express";
import Booking from "../models/Booking.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

// 🔥 CREATE BOOKING (PROTECTED)
router.post("/", protect, async (req, res) => {
  try {
    const { stationId, timeSlot } = req.body;

    const booking = new Booking({
      stationId,
      timeSlot,
      userId: req.user.id, // ✅ link user
    });

    await booking.save();

    res.json(booking);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🔥 GET USER BOOKINGS ONLY
router.get("/", protect, async (req, res) => {
  try {
    const bookings = await Booking.find({
      userId: req.user.id,
    }).populate("stationId");

    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🔥 BOOKINGS BY STATION (for slot logic)
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