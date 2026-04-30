import { describe, it, expect } from "vitest";
import {
  createOrder,
  getOrderById,
  getAllOrders,
} from "../src/services/orders.service";

const payload = {
  items: [
    {
      id: "1",
      name: "Pizza",
      price: 12.99,
      quantity: 1,
      description: "",
      image: "",
      category: "Pizza",
    },
  ],
  delivery: {
    name: "Test User",
    address: "123 Test Street",
    phone: "9876543210",
  },
  total: 12.99,
};

describe("orders.service", () => {
  it("creates an order with correct fields", () => {
    const order = createOrder(payload);
    expect(order.id).toBeTruthy();
    expect(order.status).toBe("Order Received");
    expect(order.delivery.name).toBe("Test User");
    expect(order.total).toBe(12.99);
    expect(order.createdAt).toBeTruthy();
  });

  it("creates orders with unique ids", () => {
    const order1 = createOrder(payload);
    const order2 = createOrder(payload);
    expect(order1.id).not.toBe(order2.id);
  });

  it("retrieves an order by id", () => {
    const order = createOrder(payload);
    const found = getOrderById(order.id);
    expect(found).toBeDefined();
    expect(found?.id).toBe(order.id);
  });

  it("returns undefined for unknown id", () => {
    expect(getOrderById("does-not-exist")).toBeUndefined();
  });

  it("getAllOrders includes newly created orders", () => {
    const before = getAllOrders().length;
    createOrder(payload);
    const after = getAllOrders().length;
    expect(after).toBe(before + 1);
  });

  it("stores all item data correctly", () => {
    const order = createOrder(payload);
    expect(order.items[0].name).toBe("Pizza");
    expect(order.items[0].quantity).toBe(1);
  });
});
