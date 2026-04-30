import { Order, OrderStatus, PlaceOrderPayload } from "./types";
import { v4 as uuidv4 } from "uuid";

// In-memory store — persists for the lifetime of the server process
const orders = new Map<string, Order>();

// SSE subscribers: orderId → set of response writers
const subscribers = new Map<string, Set<(status: OrderStatus) => void>>();

const STATUS_TIMELINE: OrderStatus[] = [
  "Order Received",
  "Preparing",
  "Out for Delivery",
  "Delivered",
];

const STATUS_DELAYS_MS = [0, 8000, 20000, 35000];

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

export function getOrder(id: string): Order | undefined {
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

  // Unsubscribe function
  return () => {
    subscribers.get(orderId)?.delete(callback);
  };
}

function notifySubscribers(orderId: string, status: OrderStatus) {
  subscribers.get(orderId)?.forEach((cb) => cb(status));
}

function simulateStatusProgression(orderId: string) {
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
