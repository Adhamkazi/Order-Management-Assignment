"use client";

import Link from "next/link";
import { ShoppingCart, UtensilsCrossed } from "lucide-react";
import { useCartStore } from "@/store/cart-store";

export default function Navbar() {
  const totalItems = useCartStore((s) => s.totalItems)();

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-orange-100 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <span className="bg-orange-500 text-white p-1.5 rounded-lg group-hover:bg-orange-600 transition-colors">
            <UtensilsCrossed size={18} />
          </span>
          <span className="font-display text-xl font-bold text-gray-900">
            Feastly
          </span>
        </Link>

        <nav className="flex items-center gap-6">
          <Link
            href="/"
            className="text-sm font-medium text-gray-600 hover:text-orange-500 transition-colors"
          >
            Menu
          </Link>
          <Link
            href="/cart"
            className="relative flex items-center gap-1.5 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-full text-sm font-medium transition-all hover:shadow-md"
            data-testid="cart-nav-link"
          >
            <ShoppingCart size={16} />
            <span>Cart</span>
            {totalItems > 0 && (
              <span
                data-testid="cart-badge"
                className="absolute -top-1.5 -right-1.5 bg-gray-900 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold"
              >
                {totalItems}
              </span>
            )}
          </Link>
        </nav>
      </div>
    </header>
  );
}
