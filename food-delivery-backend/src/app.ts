import express from "express";
import cors from "cors";
import menuRoutes from "./routes/menu.routes";
import ordersRoutes from "./routes/orders.routes";
import { notFoundHandler, errorHandler } from "./middleware/error.middleware";
import { requestLogger } from "./middleware/logger.middleware";

const app = express();

// ─── Global Middleware ────────────────────────────────────────────────────────
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(requestLogger);

// ─── Health check ─────────────────────────────────────────────────────────────
app.get("/health", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "Food Delivery API is running",
    timestamp: new Date().toISOString(),
  });
});

// ─── API Routes ───────────────────────────────────────────────────────────────
app.use("/api/menu", menuRoutes);
app.use("/api/orders", ordersRoutes);

// ─── Error Handlers (must be last) ───────────────────────────────────────────
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
