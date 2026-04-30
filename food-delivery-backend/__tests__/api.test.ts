import { describe, it, expect, beforeAll } from "vitest";
import supertest from "supertest";
import app from "../src/app";

const request = supertest(app);

const validOrder = {
  items: [
    {
      id: "1",
      name: "Margherita Pizza",
      price: 14.99,
      quantity: 2,
      description: "Delicious",
      image: "",
      category: "Pizza",
    },
  ],
  delivery: {
    name: "John Doe",
    address: "123 Main Street",
    phone: "9876543210",
  },
  total: 29.98,
};

// ─── Health ───────────────────────────────────────────────────────────────────
describe("GET /health", () => {
  it("returns 200 and success message", async () => {
    const res = await request.get("/health");
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toContain("running");
  });
});

// ─── Menu ─────────────────────────────────────────────────────────────────────
describe("GET /api/menu", () => {
  it("returns 200 with menu items array", async () => {
    const res = await request.get("/api/menu");
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBeGreaterThan(0);
  });

  it("each item has required fields", async () => {
    const res = await request.get("/api/menu");
    res.body.data.forEach((item: Record<string, unknown>) => {
      expect(item).toHaveProperty("id");
      expect(item).toHaveProperty("name");
      expect(item).toHaveProperty("price");
      expect(item).toHaveProperty("description");
      expect(item).toHaveProperty("category");
      expect(item).toHaveProperty("image");
    });
  });
});

// ─── Place Order ──────────────────────────────────────────────────────────────
describe("POST /api/orders", () => {
  it("creates an order and returns 201", async () => {
    const res = await request.post("/api/orders").send(validOrder);
    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty("id");
    expect(res.body.data.status).toBe("Order Received");
    expect(res.body.data.delivery.name).toBe("John Doe");
  });

  it("returns 400 when items array is empty", async () => {
    const res = await request.post("/api/orders").send({ ...validOrder, items: [] });
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.errors).toContain("Order must contain at least one item");
  });

  it("returns 400 when delivery is missing", async () => {
    const { delivery: _, ...noDelivery } = validOrder;
    const res = await request.post("/api/orders").send(noDelivery);
    expect(res.status).toBe(400);
    expect(res.body.errors).toContain("Delivery details are required");
  });

  it("returns 400 for invalid phone number", async () => {
    const res = await request.post("/api/orders").send({
      ...validOrder,
      delivery: { ...validOrder.delivery, phone: "abc" },
    });
    expect(res.status).toBe(400);
    expect(res.body.errors.some((e: string) => e.includes("Phone"))).toBe(true);
  });

  it("returns 400 for short name", async () => {
    const res = await request.post("/api/orders").send({
      ...validOrder,
      delivery: { ...validOrder.delivery, name: "A" },
    });
    expect(res.status).toBe(400);
    expect(res.body.errors.some((e: string) => e.includes("name"))).toBe(true);
  });

  it("returns 400 for negative total", async () => {
    const res = await request.post("/api/orders").send({ ...validOrder, total: -5 });
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it("returns 400 for item with invalid price", async () => {
    const res = await request.post("/api/orders").send({
      ...validOrder,
      items: [{ ...validOrder.items[0], price: -1 }],
    });
    expect(res.status).toBe(400);
    expect(res.body.errors.some((e: string) => e.includes("invalid price"))).toBe(true);
  });

  it("returns 400 for empty body", async () => {
    const res = await request.post("/api/orders").send({});
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });
});

// ─── Get Order ────────────────────────────────────────────────────────────────
describe("GET /api/orders/:id", () => {
  let orderId: string;

  beforeAll(async () => {
    const res = await request.post("/api/orders").send(validOrder);
    orderId = res.body.data.id;
  });

  it("returns the order by id", async () => {
    const res = await request.get(`/api/orders/${orderId}`);
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.id).toBe(orderId);
  });

  it("returns 404 for unknown id", async () => {
    const res = await request.get("/api/orders/nonexistent-id-123");
    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
    expect(res.body.errors).toContain("Order not found");
  });
});

// ─── List Orders ──────────────────────────────────────────────────────────────
describe("GET /api/orders", () => {
  it("returns all orders as an array", async () => {
    const res = await request.get("/api/orders");
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
  });
});

// ─── Unknown routes ───────────────────────────────────────────────────────────
describe("Unknown routes", () => {
  it("returns 404 for unknown route", async () => {
    const res = await request.get("/api/unknown-route");
    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
  });
});
