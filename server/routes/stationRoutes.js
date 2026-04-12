import express from "express";
import Station from "../models/Station.js";
import { protect } from "../middleware/auth.js";
import { isAdmin } from "../middleware/admin.js";
import upload from "../middleware/upload.js";
import cloudinary from "../config/cloudinary.js";

const router = express.Router();


// 📌 GET all stations
router.get("/", async (req, res) => {
  try {
    const stations = await Station.find();
    res.json(stations);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// 📌 GET single station
router.get("/:id", async (req, res) => {
  try {
    const station = await Station.findById(req.params.id);

    if (!station) {
      return res.status(404).json({ message: "Station not found" });
    }

    res.json(station);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// ➕ ADD station (Admin only + Image Upload)
router.post("/", protect, isAdmin, upload.single("image"), async (req, res) => {
  try {
    const {
      name,
      location,
      lat,
      lng,
      totalChargers,
      availableChargers,
    } = req.body;

    // ✅ Basic validation
    if (!name || !location || !lat || !lng) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    let imageUrl = "";

    // 📸 Upload image to Cloudinary
    if (req.file) {
      const result = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "stations" },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        stream.end(req.file.buffer);
      });

      imageUrl = result.secure_url;
    }

    // 💾 Save to DB
    const station = new Station({
      name,
      location,
      lat: Number(lat),
      lng: Number(lng),
      totalChargers: Number(totalChargers) || 0,
      availableChargers: Number(availableChargers) || 0,
      image: imageUrl,
    });

    await station.save();

    res.status(201).json(station);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
});


// ✏️ UPDATE station (Admin only)
router.put("/:id", protect, isAdmin, upload.single("image"), async (req, res) => {
  try {
    const station = await Station.findById(req.params.id);

    if (!station) {
      return res.status(404).json({ message: "Station not found" });
    }

    // 📸 Upload new image if exists
    if (req.file) {
      const result = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "stations" },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        stream.end(req.file.buffer);
      });

      station.image = result.secure_url;
    }

    // 🔄 Update fields
    station.name = req.body.name || station.name;
    station.location = req.body.location || station.location;
    station.lat = req.body.lat ? Number(req.body.lat) : station.lat;
    station.lng = req.body.lng ? Number(req.body.lng) : station.lng;
    station.totalChargers = req.body.totalChargers
      ? Number(req.body.totalChargers)
      : station.totalChargers;
    station.availableChargers = req.body.availableChargers
      ? Number(req.body.availableChargers)
      : station.availableChargers;

    await station.save();

    res.json(station);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// ❌ DELETE station (Admin only)
router.delete("/:id", protect, isAdmin, async (req, res) => {
  try {
    const deleted = await Station.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ message: "Station not found" });
    }

    res.json({ message: "Station deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


export default router;