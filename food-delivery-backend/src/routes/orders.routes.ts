import { Router } from "express";
import {
  placeOrder,
  listOrders,
  getOrder,
  streamOrderStatus,
} from "../controllers/orders.controller";

const router = Router();

// GET  /api/orders
router.get("/", listOrders);

// POST /api/orders
router.post("/", placeOrder);

// GET  /api/orders/:id
router.get("/:id", getOrder);

// GET  /api/orders/:id/stream  — SSE real-time
router.get("/:id/stream", streamOrderStatus);

export default router;
