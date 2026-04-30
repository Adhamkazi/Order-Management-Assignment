import { describe, it, expect, beforeEach } from "vitest";
import { validateOrderPayload } from "@/lib/validation";
import { createOrder, getOrder, getAllOrders } from "@/lib/orders-store";

// ──────────────────────────────────────────
// Validation tests
// ──────────────────────────────────────────
describe("validateOrderPayload", () => {
  const validPayload = {
    items: [{ id: "1", name: "Pizza", price: 12.99, quantity: 2, description: "", image: "", category: "Pizza" }],
    delivery: { name: "John Doe", address: "123 Main St", phone: "9876543210" },
    total: 25.98,
  };

  it("accepts a valid payload", () => {
    const result = validateOrderPayload(validPayload);
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it("rejects non-object body", () => {
    const result = validateOrderPayload("bad");
    expect(result.valid).toBe(false);
  });

  it("rejects empty items array", () => {
    const result = validateOrderPayload({ ...validPayload, items: [] });
    expect(result.valid).toBe(false);
    expect(result.errors).toContain("Order must contain at least one item");
  });

  it("rejects item with invalid price", () => {
    const result = validateOrderPayload({
      ...validPayload,
      items: [{ id: "1", name: "Pizza", price: -1, quantity: 1, description: "", image: "", category: "" }],
    });
    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.includes("invalid price"))).toBe(true);
  });

  it("rejects item with zero quantity", () => {
    const result = validateOrderPayload({
      ...validPayload,
      items: [{ id: "1", name: "Pizza", price: 10, quantity: 0, description: "", image: "", category: "" }],
    });
    expect(result.valid).toBe(false);
  });

  it("rejects missing delivery", () => {
    const result = validateOrderPayload({ ...validPayload, delivery: undefined });
    expect(result.valid).toBe(false);
    expect(result.errors).toContain("Delivery details are required");
  });

  it("rejects short name", () => {
    const result = validateOrderPayload({
      ...validPayload,
      delivery: { ...validPayload.delivery, name: "A" },
    });
    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.includes("name"))).toBe(true);
  });

  it("rejects invalid phone", () => {
    const result = validateOrderPayload({
      ...validPayload,
      delivery: { ...validPayload.delivery, phone: "abc" },
    });
    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.includes("Phone"))).toBe(true);
  });

  it("rejects negative total", () => {
    const result = validateOrderPayload({ ...validPayload, total: -5 });
    expect(result.valid).toBe(false);
  });
});

// ──────────────────────────────────────────
// Orders store tests
// ──────────────────────────────────────────
describe("orders-store", () => {
  const payload = {
    items: [{ id: "1", name: "Pizza", price: 12.99, quantity: 1, description: "", image: "", category: "Pizza" }],
    delivery: { name: "Jane Doe", address: "456 Oak Ave", phone: "1234567890" },
    total: 12.99,
  };

  it("creates an order with a unique id", () => {
    const order = createOrder(payload);
    expect(order.id).toBeTruthy();
    expect(order.status).toBe("Order Received");
    expect(order.delivery.name).toBe("Jane Doe");
  });

  it("retrieves an order by id", () => {
    const order = createOrder(payload);
    const retrieved = getOrder(order.id);
    expect(retrieved).toBeDefined();
    expect(retrieved?.id).toBe(order.id);
  });

  it("returns undefined for unknown id", () => {
    expect(getOrder("nonexistent-id")).toBeUndefined();
  });

  it("lists all orders", () => {
    const before = getAllOrders().length;
    createOrder(payload);
    const after = getAllOrders().length;
    expect(after).toBeGreaterThan(before);
  });

  it("stores correct total", () => {
    const order = createOrder({ ...payload, total: 99.99 });
    expect(order.total).toBe(99.99);
  });
});
