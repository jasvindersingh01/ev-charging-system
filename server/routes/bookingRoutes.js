import express from "express";
import Booking from "../models/Booking.js";
import { protect } from "../middleware/auth.js";
import Station from "../models/Station.js";

const router = express.Router();

// 🔥 CREATE BOOKING (PROTECTED)
router.post("/", protect, async (req, res) => {
  try {
    const { stationId, timeSlot } = req.body;

    // 🔥 Find station
    const station = await Station.findById(stationId);

    if (!station) {
      return res.status(404).json({ message: "Station not found" });
    }

    // ❌ If no chargers available
    if (station.availableChargers <= 0) {
      return res.status(400).json({ message: "No chargers available" });
    }

    // ➕ Create booking
    const booking = new Booking({
      stationId,
      timeSlot,
      userId: req.user.id,
    });

    await booking.save();

    // 🔥 DECREASE CHARGER COUNT
    station.availableChargers -= 1;
    await station.save();

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

//Cancle booking
router.put("/:id/cancel", protect, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    if (booking.status === "cancelled") {
      return res.status(400).json({ message: "Already cancelled" });
    }

    // update booking
    booking.status = "cancelled";
    await booking.save();

    // update station chargers
    const station = await Station.findById(booking.stationId);

    if (station) {
      station.availableChargers += 1;
      await station.save();
    }

    res.json({
      message: "Booking cancelled",
      booking, // return updated booking
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete("/:id", protect, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    if (booking.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    await Booking.findByIdAndDelete(req.params.id);

    res.json({ message: "Booking deleted" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
export default router;