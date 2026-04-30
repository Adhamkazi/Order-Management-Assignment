import { describe, it, expect, beforeEach } from "vitest";
import { useCartStore } from "@/store/cart-store";
import { MenuItem } from "@/lib/types";

const item1: MenuItem = {
  id: "1",
  name: "Pizza",
  price: 12.99,
  description: "Delicious",
  image: "",
  category: "Pizza",
};

const item2: MenuItem = {
  id: "2",
  name: "Burger",
  price: 9.99,
  description: "Juicy",
  image: "",
  category: "Burgers",
};

describe("cart-store", () => {
  beforeEach(() => {
    useCartStore.setState({ items: [] });
  });

  it("starts with empty cart", () => {
    expect(useCartStore.getState().items).toHaveLength(0);
  });

  it("adds an item", () => {
    useCartStore.getState().addItem(item1);
    expect(useCartStore.getState().items).toHaveLength(1);
    expect(useCartStore.getState().items[0].quantity).toBe(1);
  });

  it("increments quantity when same item added", () => {
    useCartStore.getState().addItem(item1);
    useCartStore.getState().addItem(item1);
    expect(useCartStore.getState().items).toHaveLength(1);
    expect(useCartStore.getState().items[0].quantity).toBe(2);
  });

  it("adds multiple distinct items", () => {
    useCartStore.getState().addItem(item1);
    useCartStore.getState().addItem(item2);
    expect(useCartStore.getState().items).toHaveLength(2);
  });

  it("removes an item", () => {
    useCartStore.getState().addItem(item1);
    useCartStore.getState().removeItem("1");
    expect(useCartStore.getState().items).toHaveLength(0);
  });

  it("updates quantity", () => {
    useCartStore.getState().addItem(item1);
    useCartStore.getState().updateQuantity("1", 5);
    expect(useCartStore.getState().items[0].quantity).toBe(5);
  });

  it("removes item when quantity set to 0", () => {
    useCartStore.getState().addItem(item1);
    useCartStore.getState().updateQuantity("1", 0);
    expect(useCartStore.getState().items).toHaveLength(0);
  });

  it("clears the cart", () => {
    useCartStore.getState().addItem(item1);
    useCartStore.getState().addItem(item2);
    useCartStore.getState().clearCart();
    expect(useCartStore.getState().items).toHaveLength(0);
  });

  it("computes totalItems", () => {
    useCartStore.getState().addItem(item1);
    useCartStore.getState().addItem(item1);
    useCartStore.getState().addItem(item2);
    expect(useCartStore.getState().totalItems()).toBe(3);
  });

  it("computes totalPrice", () => {
    useCartStore.getState().addItem(item1); // 12.99
    useCartStore.getState().addItem(item2); // 9.99
    expect(useCartStore.getState().totalPrice()).toBeCloseTo(22.98);
  });

  it("computes totalPrice with quantities", () => {
    useCartStore.getState().addItem(item1);
    useCartStore.getState().updateQuantity("1", 3);
    expect(useCartStore.getState().totalPrice()).toBeCloseTo(38.97);
  });
});
