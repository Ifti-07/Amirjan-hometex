import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import path from "node:path";
import fs from "node:fs";
import { fileURLToPath } from "node:url";

// Routes
import authRoutes from "./modules/auth/routes.ts";
import productRoutes from "./modules/products/routes.ts";
import categoryRoutes from "./modules/categories/routes.ts";
import contactRoutes from "./modules/contact/routes.ts";
import offerRoutes from "./modules/offers/routes.ts";
import colorRoutes from "./modules/colors/routes.ts";
import sizeRoutes from "./modules/sizes/routes.ts";
import orderRoutes from "./modules/orders/routes.ts";
import dashboardRoutes from "./modules/dashboard/routes.ts";

import { errorHandler } from "./app/middlewares/error.ts";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Normalized CORS origins
const allowedOrigins = process.env.CLIENT_URL
  ? process.env.CLIENT_URL.split(",")
      .map((u) => u.trim().replace(/\/+$/, ""))
      .filter(Boolean)
  : [];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g. mobile apps, curl, server-to-server, same-origin)
      if (!origin) return callback(null, true);

      if (
        allowedOrigins.length === 0 ||
        allowedOrigins.includes("*") ||
        allowedOrigins.includes(origin) ||
        (process.env.NODE_ENV !== "production" && origin.includes("localhost"))
      ) {
        return callback(null, true);
      }

      // Allow origin dynamically to support multiple preview/custom domains
      return callback(null, true);
    },
    credentials: true,
  })
);

app.use(express.json());
app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));

// Database connection with caching for serverless environments (Vercel)
let isConnected = false;
export const connectDB = async () => {
  if (isConnected || mongoose.connection.readyState === 1) {
    return;
  }
  const MONGODB_URI = process.env.DB_URL || "mongodb://localhost:27017/homtexDB";
  try {
    const db = await mongoose.connect(MONGODB_URI);
    isConnected = db.connections[0].readyState === 1;
    console.log("Connected to MongoDB successfully");
  } catch (err) {
    console.error("MongoDB connection error:", err);
  }
};

// Health check endpoints for deployment liveness probes (Vercel, Render, Railway, etc.)
const healthHandler = (_req: express.Request, res: express.Response) => {
  res.status(200).json({
    status: "ok",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    database: mongoose.connection.readyState === 1 ? "connected" : "connecting/disconnected",
  });
};
app.get("/health", healthHandler);
app.get("/api/v1/health", healthHandler);
app.get("/api/health", healthHandler);

// Ensure DB is connected for API requests
app.use("/api", async (req, _res, next) => {
  if (req.path === "/health" || req.path === "/v1/health") {
    return next();
  }
  await connectDB();
  next();
});

// API Routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/products", productRoutes);
app.use("/api/v1/categories", categoryRoutes);
app.use("/api/v1/contact", contactRoutes);
app.use("/api/v1/offers", offerRoutes);
app.use("/api/v1/colors", colorRoutes);
app.use("/api/v1/sizes", sizeRoutes);
app.use("/api/v1/orders", orderRoutes);
app.use("/api/v1/dashboard", dashboardRoutes);

// Static file serving for Single-Service / Fullstack deployment
const candidateDistPaths = [
  path.resolve(__dirname, "../../client/dist"),
  path.resolve(__dirname, "../client/dist"),
  path.resolve(process.cwd(), "client/dist"),
  path.resolve(process.cwd(), "../client/dist"),
];
const clientDist = candidateDistPaths.find((p) => fs.existsSync(p));

if (clientDist) {
  console.log(`Serving static client files from: ${clientDist}`);
  app.use(express.static(clientDist));

  // Client SPA fallback for non-API routes
  app.get("*", (req, res, next) => {
    if (req.path.startsWith("/api") || req.path === "/health") {
      return next();
    }
    res.sendFile(path.join(clientDist, "index.html"));
  });
}

// Global Error Handler
app.use(errorHandler);

// Only listen if not in a serverless environment (e.g. Vercel)
if (!process.env.VERCEL) {
  // Initiate DB connection asynchronously on server boot
  connectDB();

  const server = app.listen(Number(PORT), "0.0.0.0", () => {
    console.log(`Server running in ${process.env.NODE_ENV || "development"} mode on http://localhost:${PORT}`);
    if (clientDist) {
      console.log(`Single-service mode active: Serving React frontend and API together.`);
    }
  });

  // Graceful shutdown
  const shutdown = async (signal: string) => {
    console.log(`${signal} received. Shutting down gracefully...`);
    server.close(async () => {
      await mongoose.connection.close();
      console.log("Server and database connections closed.");
      process.exit(0);
    });
  };

  process.on("SIGTERM", () => shutdown("SIGTERM"));
  process.on("SIGINT", () => shutdown("SIGINT"));
}

export default app;


