import { Request, Response } from "express";
import {
  createOrder,
  getAllOrders,
  getOrderById,
  subscribeToOrder,
} from "../services/orders.service";
import { validateOrderPayload } from "../lib/validation";
import { ApiResponse, Order } from "../lib/types";

// POST /api/orders
export function placeOrder(req: Request, res: Response): void {
  const { valid, errors } = validateOrderPayload(req.body);

  if (!valid) {
    const response: ApiResponse<null> = { success: false, errors };
    res.status(400).json(response);
    return;
  }

  const order = createOrder(req.body);
  const response: ApiResponse<Order> = { success: true, data: order };
  res.status(201).json(response);
}

// GET /api/orders
export function listOrders(_req: Request, res: Response): void {
  const orders = getAllOrders();
  const response: ApiResponse<Order[]> = { success: true, data: orders };
  res.status(200).json(response);
}

// GET /api/orders/:id
export function getOrder(req: Request, res: Response): void {
  const order = getOrderById(req.params.id);

  if (!order) {
    const response: ApiResponse<null> = {
      success: false,
      errors: ["Order not found"],
    };
    res.status(404).json(response);
    return;
  }

  const response: ApiResponse<Order> = { success: true, data: order };
  res.status(200).json(response);
}

// GET /api/orders/:id/stream  (Server-Sent Events)
export function streamOrderStatus(req: Request, res: Response): void {
  const order = getOrderById(req.params.id);

  if (!order) {
    res.status(404).json({ success: false, errors: ["Order not found"] });
    return;
  }

  // SSE headers
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.flushHeaders();

  // Send current status immediately on connect
  res.write(`data: ${JSON.stringify({ status: order.status })}\n\n`);

  // Subscribe to future status updates
  const unsubscribe = subscribeToOrder(req.params.id, (status) => {
    res.write(`data: ${JSON.stringify({ status })}\n\n`);

    // Close stream when order is delivered
    if (status === "Delivered") {
      res.end();
    }
  });

  // Clean up when client disconnects
  req.on("close", () => {
    unsubscribe();
  });
}
