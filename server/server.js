import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

import stationRoutes from "./routes/stationRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import authRoutes from "./routes/authRoutes.js";

dotenv.config();

const app = express();

app.use(cors({
  origin: "https://voltify-ev.vercel.app",
  credentials: true
}));
app.use(express.json());

app.use("/api/stations", stationRoutes);
app.use("/bookings", bookingRoutes);
app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
  res.send("EV Charging Backend Running");
});

// 🔥 MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected");

    app.listen(process.env.PORT, () => {
      console.log(`Server running on port ${process.env.PORT} 🚀`);
    });
  })
  .catch((err) => {
    console.log("DB Error ❌", err);
  });