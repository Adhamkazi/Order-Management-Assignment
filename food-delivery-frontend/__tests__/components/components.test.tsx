import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import MenuItemCard from "@/components/MenuItemCard";
import OrderStatusTracker from "@/components/OrderStatusTracker";
import { useCartStore } from "@/store/cart-store";
import { MenuItem, OrderStatus } from "@/lib/types";

const mockItem: MenuItem = {
  id: "test-1",
  name: "Test Pizza",
  description: "A test pizza",
  price: 12.99,
  image: "https://example.com/pizza.jpg",
  category: "Pizza",
};

// ──────────────────────────────────────────
// MenuItemCard
// ──────────────────────────────────────────
describe("MenuItemCard", () => {
  beforeEach(() => {
    useCartStore.setState({ items: [] });
  });

  it("renders the item name and price", () => {
    render(<MenuItemCard item={mockItem} />);
    expect(screen.getByText("Test Pizza")).toBeInTheDocument();
    expect(screen.getByText("$12.99")).toBeInTheDocument();
  });

  it("renders the category label", () => {
    render(<MenuItemCard item={mockItem} />);
    expect(screen.getByText("Pizza")).toBeInTheDocument();
  });

  it("renders the description", () => {
    render(<MenuItemCard item={mockItem} />);
    expect(screen.getByText("A test pizza")).toBeInTheDocument();
  });

  it("adds item to cart on click", () => {
    render(<MenuItemCard item={mockItem} />);
    fireEvent.click(screen.getByTestId("add-to-cart-test-1"));
    const { items } = useCartStore.getState();
    expect(items).toHaveLength(1);
    expect(items[0].id).toBe("test-1");
    expect(items[0].quantity).toBe(1);
  });

  it("increments quantity when added twice", () => {
    render(<MenuItemCard item={mockItem} />);
    fireEvent.click(screen.getByTestId("add-to-cart-test-1"));
    fireEvent.click(screen.getByTestId("add-to-cart-test-1"));
    const { items } = useCartStore.getState();
    expect(items[0].quantity).toBe(2);
  });

  it("renders badge when provided", () => {
    render(<MenuItemCard item={{ ...mockItem, badge: "Popular" }} />);
    expect(screen.getByText("Popular")).toBeInTheDocument();
  });
});

// ──────────────────────────────────────────
// OrderStatusTracker
// ──────────────────────────────────────────
describe("OrderStatusTracker", () => {
  const statuses: OrderStatus[] = [
    "Order Received",
    "Preparing",
    "Out for Delivery",
    "Delivered",
  ];

  statuses.forEach((status) => {
    it(`renders correctly for status: ${status}`, () => {
      render(<OrderStatusTracker status={status} />);
      expect(screen.getByTestId("order-status-tracker")).toBeInTheDocument();
      expect(screen.getByText(status)).toBeInTheDocument();
    });
  });

  it("shows all 4 steps", () => {
    render(<OrderStatusTracker status="Preparing" />);
    expect(screen.getByText("Order Received")).toBeInTheDocument();
    expect(screen.getByText("Preparing")).toBeInTheDocument();
    expect(screen.getByText("Out for Delivery")).toBeInTheDocument();
    expect(screen.getByText("Delivered")).toBeInTheDocument();
  });
});
