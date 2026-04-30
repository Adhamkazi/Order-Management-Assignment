"use client";

import Image from "next/image";
import { Plus, Check } from "lucide-react";
import { MenuItem } from "@/lib/types";
import { useCartStore } from "@/store/cart-store";
import { useState } from "react";

interface MenuItemCardProps {
  item: MenuItem;
}

export default function MenuItemCard({ item }: MenuItemCardProps) {
  const { addItem, items } = useCartStore();
  const [added, setAdded] = useState(false);

  const cartItem = items.find((i) => i.id === item.id);
  const quantity = cartItem?.quantity ?? 0;

  const handleAdd = () => {
    addItem(item);
    setAdded(true);
    setTimeout(() => setAdded(false), 1200);
  };

  return (
    <div
      data-testid="menu-item-card"
      className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-0.5 flex flex-col"
    >
      <div className="relative h-48 overflow-hidden">
        <Image
          src={item.image}
          alt={item.name}
          fill
          className="object-cover transition-transform duration-500 hover:scale-105"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
        {item.badge && (
          <span className="absolute top-3 left-3 bg-orange-500 text-white text-xs font-semibold px-2.5 py-1 rounded-full">
            {item.badge}
          </span>
        )}
        {quantity > 0 && (
          <span className="absolute top-3 right-3 bg-gray-900 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center">
            {quantity}
          </span>
        )}
      </div>

      <div className="p-4 flex flex-col flex-1">
        <div className="flex-1">
          <p className="text-xs font-semibold text-orange-500 uppercase tracking-wide mb-1">
            {item.category}
          </p>
          <h3 className="font-display text-lg font-bold text-gray-900 leading-snug">
            {item.name}
          </h3>
          <p className="text-sm text-gray-500 mt-1 leading-relaxed line-clamp-2">
            {item.description}
          </p>
        </div>

        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
          <span className="text-xl font-bold text-gray-900">
            ${item.price.toFixed(2)}
          </span>
          <button
            onClick={handleAdd}
            data-testid={`add-to-cart-${item.id}`}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
              added
                ? "bg-green-500 text-white scale-95"
                : "bg-orange-500 hover:bg-orange-600 text-white hover:shadow-md"
            }`}
          >
            {added ? (
              <>
                <Check size={14} />
                Added!
              </>
            ) : (
              <>
                <Plus size={14} />
                Add
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
