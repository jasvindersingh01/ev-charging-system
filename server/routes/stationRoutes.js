import express from "express";
import Station from "../models/Station.js";
import { protect } from "../middleware/auth.js";
import { isAdmin } from "../middleware/admin.js";
import upload from "../middleware/upload.js";
import cloudinary from "../config/cloudinary.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const stations = await Station.find();
    res.json(stations);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

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

router.post("/", async (req, res) => {
  const station = new Station(req.body);
  await station.save();
  res.json(station);
});

// ➕ Add station
router.post("/", protect, isAdmin, async (req, res) => {
  const station = new Station(req.body);
  await station.save();
  res.json(station);
});

// ❌ Delete station
router.delete("/:id", protect, isAdmin, async (req, res) => {
  await Station.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
});

// ➕ Add station with image upload
router.post("/", protect, isAdmin, upload.single("image"), async (req, res) => {
  try {
    console.log("BODY:", req.body); // 🔥 DEBUG
    console.log("FILE:", req.file);

    let imageUrl = "";

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

    const station = new Station({
      name: req.body.name,
      location: req.body.location,
      lat: Number(req.body.lat),
      lng: Number(req.body.lng),
      totalChargers: Number(req.body.totalChargers),
      availableChargers: Number(req.body.availableChargers),
      image: imageUrl,
    });

    await station.save();

    res.json(station);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
});

export default router;