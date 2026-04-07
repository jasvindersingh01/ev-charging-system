import express from "express";
import Station from "../models/Station.js";

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

export default router;