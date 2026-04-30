import { describe, it, expect } from "vitest";
import { validateOrderPayload } from "../src/lib/validation";

const validPayload = {
  items: [
    {
      id: "1",
      name: "Pizza",
      price: 12.99,
      quantity: 2,
      description: "",
      image: "",
      category: "Pizza",
    },
  ],
  delivery: {
    name: "Jane Doe",
    address: "456 Oak Avenue, Delhi",
    phone: "9876543210",
  },
  total: 25.98,
};

describe("validateOrderPayload", () => {
  it("accepts a valid payload", () => {
    const result = validateOrderPayload(validPayload);
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it("rejects non-object input", () => {
    expect(validateOrderPayload(null).valid).toBe(false);
    expect(validateOrderPayload("string").valid).toBe(false);
    expect(validateOrderPayload(42).valid).toBe(false);
  });

  it("rejects empty items array", () => {
    const result = validateOrderPayload({ ...validPayload, items: [] });
    expect(result.valid).toBe(false);
    expect(result.errors).toContain("Order must contain at least one item");
  });

  it("rejects missing items field", () => {
    const { items: _items, ...rest } = validPayload;
    const result = validateOrderPayload(rest);
    expect(result.valid).toBe(false);
  });

  it("rejects item with zero price", () => {
    const result = validateOrderPayload({
      ...validPayload,
      items: [{ ...validPayload.items[0], price: 0 }],
    });
    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.includes("invalid price"))).toBe(true);
  });

  it("rejects item with negative price", () => {
    const result = validateOrderPayload({
      ...validPayload,
      items: [{ ...validPayload.items[0], price: -5 }],
    });
    expect(result.valid).toBe(false);
  });

  it("rejects item with zero quantity", () => {
    const result = validateOrderPayload({
      ...validPayload,
      items: [{ ...validPayload.items[0], quantity: 0 }],
    });
    expect(result.valid).toBe(false);
  });

  it("rejects missing delivery", () => {
    const result = validateOrderPayload({
      ...validPayload,
      delivery: undefined,
    });
    expect(result.valid).toBe(false);
    expect(result.errors).toContain("Delivery details are required");
  });

  it("rejects name shorter than 2 chars", () => {
    const result = validateOrderPayload({
      ...validPayload,
      delivery: { ...validPayload.delivery, name: "J" },
    });
    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.includes("name"))).toBe(true);
  });

  it("rejects address shorter than 5 chars", () => {
    const result = validateOrderPayload({
      ...validPayload,
      delivery: { ...validPayload.delivery, address: "123" },
    });
    expect(result.valid).toBe(false);
  });

  it("rejects invalid phone number", () => {
    const result = validateOrderPayload({
      ...validPayload,
      delivery: { ...validPayload.delivery, phone: "abc" },
    });
    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.includes("Phone"))).toBe(true);
  });

  it("accepts phone with country code", () => {
    const result = validateOrderPayload({
      ...validPayload,
      delivery: { ...validPayload.delivery, phone: "+91 9876543210" },
    });
    expect(result.valid).toBe(true);
  });

  it("rejects zero or negative total", () => {
    expect(
      validateOrderPayload({ ...validPayload, total: 0 }).valid
    ).toBe(false);
    expect(
      validateOrderPayload({ ...validPayload, total: -1 }).valid
    ).toBe(false);
  });
});
