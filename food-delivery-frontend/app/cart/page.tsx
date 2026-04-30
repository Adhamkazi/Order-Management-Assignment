"use client";

import { useCartStore } from "@/store/cart-store";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function CartPage() {
  const { items, removeItem, updateQuantity, totalPrice, totalItems } = useCartStore();

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-24 text-center">
        <div className="text-6xl mb-4">🛒</div>
        <h2 className="font-display text-3xl font-bold text-gray-900 mb-2">
          Your cart is empty
        </h2>
        <p className="text-gray-500 mb-8">Add something delicious from the menu!</p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-full font-semibold transition-all hover:shadow-md"
        >
          <ShoppingBag size={18} />
          Browse Menu
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="font-display text-4xl font-bold text-gray-900 mb-8">
        Your Cart
      </h1>

      <div className="space-y-4 mb-8">
        {items.map((item) => (
          <div
            key={item.id}
            data-testid="cart-item"
            className="bg-white rounded-2xl p-4 flex items-center gap-4 shadow-sm animate-fade-in"
          >
            <div className="relative w-20 h-20 rounded-xl overflow-hidden flex-shrink-0">
              <Image src={item.image} alt={item.name} fill className="object-cover" />
            </div>

            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-900 truncate">{item.name}</h3>
              <p className="text-sm text-gray-500">${item.price.toFixed(2)} each</p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                data-testid={`decrease-qty-${item.id}`}
                className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center hover:border-orange-400 hover:text-orange-500 transition-colors"
              >
                <Minus size={14} />
              </button>
              <span
                data-testid={`item-quantity-${item.id}`}
                className="w-8 text-center font-bold text-gray-900"
              >
                {item.quantity}
              </span>
              <button
                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                data-testid={`increase-qty-${item.id}`}
                className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center hover:border-orange-400 hover:text-orange-500 transition-colors"
              >
                <Plus size={14} />
              </button>
            </div>

            <div className="text-right min-w-[60px]">
              <p className="font-bold text-gray-900">
                ${(item.price * item.quantity).toFixed(2)}
              </p>
            </div>

            <button
              onClick={() => removeItem(item.id)}
              data-testid={`remove-item-${item.id}`}
              className="text-gray-300 hover:text-red-400 transition-colors ml-1"
            >
              <Trash2 size={18} />
            </button>
          </div>
        ))}
      </div>

      {/* Summary */}
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <div className="flex justify-between items-center mb-2 text-gray-500 text-sm">
          <span>Items ({totalItems()})</span>
          <span>${totalPrice().toFixed(2)}</span>
        </div>
        <div className="flex justify-between items-center mb-2 text-gray-500 text-sm">
          <span>Delivery fee</span>
          <span className="text-green-600 font-medium">Free</span>
        </div>
        <div className="border-t border-gray-100 mt-4 pt-4 flex justify-between items-center">
          <span className="font-bold text-gray-900 text-lg">Total</span>
          <span className="font-bold text-gray-900 text-2xl">
            ${totalPrice().toFixed(2)}
          </span>
        </div>

        <Link
          href="/checkout"
          data-testid="checkout-button"
          className="mt-6 w-full flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white py-4 rounded-xl font-semibold text-lg transition-all hover:shadow-md"
        >
          Proceed to Checkout →
        </Link>
      </div>
    </div>
  );
}
