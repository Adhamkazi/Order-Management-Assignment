import { v4 as uuidv4 } from "uuid";
import { Order, OrderStatus, PlaceOrderPayload } from "../lib/types";

// ─── In-memory store ──────────────────────────────────────────────────────────
const orders = new Map<string, Order>();

// SSE subscribers: orderId → set of status callbacks
const subscribers = new Map<string, Set<(status: OrderStatus) => void>>();

// ─── Status progression ───────────────────────────────────────────────────────
const STATUS_TIMELINE: OrderStatus[] = [
  "Order Received",
  "Preparing",
  "Out for Delivery",
  "Delivered",
];

const STATUS_DELAYS_MS = [0, 8000, 20000, 35000];

// ─── Public API ───────────────────────────────────────────────────────────────
export function createOrder(payload: PlaceOrderPayload): Order {
  const id = uuidv4();
  const order: Order = {
    id,
    items: payload.items,
    delivery: payload.delivery,
    total: payload.total,
    status: "Order Received",
    createdAt: new Date().toISOString(),
  };

  orders.set(id, order);
  simulateStatusProgression(id);

  return order;
}

export function getOrderById(id: string): Order | undefined {
  return orders.get(id);
}

export function getAllOrders(): Order[] {
  return Array.from(orders.values());
}

export function subscribeToOrder(
  orderId: string,
  callback: (status: OrderStatus) => void
): () => void {
  if (!subscribers.has(orderId)) {
    subscribers.set(orderId, new Set());
  }
  subscribers.get(orderId)!.add(callback);

  // Return unsubscribe function
  return () => {
    subscribers.get(orderId)?.delete(callback);
    if (subscribers.get(orderId)?.size === 0) {
      subscribers.delete(orderId);
    }
  };
}

// ─── Private helpers ──────────────────────────────────────────────────────────
function notifySubscribers(orderId: string, status: OrderStatus): void {
  subscribers.get(orderId)?.forEach((cb) => cb(status));
}

function simulateStatusProgression(orderId: string): void {
  STATUS_TIMELINE.forEach((status, index) => {
    setTimeout(() => {
      const order = orders.get(orderId);
      if (!order) return;

      order.status = status;
      orders.set(orderId, order);
      notifySubscribers(orderId, status);
    }, STATUS_DELAYS_MS[index]);
  });
}
