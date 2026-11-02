import dns from "dns";
dns.setServers(["8.8.8.8", "1.1.1.1"]);

import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import dotenv from "dotenv";
import multer from "multer";
import axios from "axios";
import FormData from "form-data";

import connectDB from "./config/db.js";
import Scan from "./models/Scan.js";
import authRoutes from "./routes/auth.js";
import auth from "./middleware/auth.js";

dotenv.config();

connectDB();

const app = express();
const PORT = process.env.PORT || 5003;

// =====================
// CORS CONFIGURATION
// =====================

const configuredOrigins = (process.env.CLIENT_URL || "")
  .split(",")
  .map((url) => url.trim().replace(/\/+$/, ""))
  .filter(Boolean);

const allowedOrigins = [
  ...configuredOrigins,
  "https://client-ac7vqa94x-shahnaz-s-team.vercel.app",
  "http://localhost:5173",
  "http://localhost:5174",
];

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.error("Blocked CORS origin:", origin);
      callback(new Error("Origin not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  optionsSuccessStatus: 204,
};

// CORS must be registered before API routes
app.use(cors(corsOptions));

app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());

// =====================
// AUTHENTICATION ROUTES
// =====================

app.use("/api/auth", authRoutes);

// =====================
// FILE UPLOAD
// =====================

const upload = multer({
  storage: multer.memoryStorage(),
});

// =====================
// HEALTH CHECK
// =====================

app.get("/", (req, res) => {
  res.send("PlantSense API Running");
});

app.get("/api/health", (req, res) => {
  res.json({
    status: "healthy",
  });
});

// =====================
// GET ALL SCANS
// =====================

app.get("/api/scans", auth, async (req, res) => {
  try {
    const scans = await Scan.find({
      user: req.user.id,
    }).sort({ date: -1 });

    res.status(200).json(scans);
  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

// =====================
// GET SINGLE SCAN
// =====================

app.get("/api/scans/:id", auth, async (req, res) => {
  try {
    const scan = await Scan.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!scan) {
      return res.status(404).json({
        success: false,
        message: "Scan not found",
      });
    }

    res.status(200).json(scan);
  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

// =====================
// IDENTIFY PLANT
// =====================

app.post(
  "/api/scan",
  auth,
  upload.single("image"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: "No image uploaded",
        });
      }

      const form = new FormData();

      form.append("images", req.file.buffer, {
        filename: req.file.originalname,
        contentType: req.file.mimetype,
      });

      const response = await axios.post(
        `https://my-api.plantnet.org/v2/identify/all?api-key=${process.env.PLANTNET_API_KEY}`,
        form,
        {
          headers: form.getHeaders(),
        }
      );

      const result = response.data.results[0];

      if (!result) {
        return res.json({
          success: false,
          message: "Plant not identified",
        });
      }

      const commonName =
        result.species.commonNames?.[0] || "Unknown";

      const confidence = Number(
        (result.score * 100).toFixed(2)
      );

      const family =
        result.species.family?.scientificNameWithoutAuthor ||
        "Unknown";

      const genus =
        result.species.genus?.scientificNameWithoutAuthor ||
        "Unknown";

      await Scan.create({
        user: req.user.id,
        name: commonName,
        type: family,
        confidence,
      });

      res.json({
        success: true,
        commonName,
        scientificName:
          result.species.scientificNameWithoutAuthor,
        confidence,
        family,
        genus,
      });
    } catch (error) {
      console.error(
        error.response?.data || error.message
      );

      res.status(500).json({
        success: false,
        error: error.response?.data || error.message,
      });
    }
  }
);

// =====================
// START SERVER
// =====================

app.listen(PORT, () => {
  console.log(
    `PlantSense Backend running on port ${PORT}`
  );
});