"use client";

import { useRouter } from "next/navigation";

interface CategoryFilterProps {
  categories: string[];
  active: string;
}

export default function CategoryFilter({ categories, active }: CategoryFilterProps) {
  const router = useRouter();

  return (
    <div className="flex gap-2 flex-wrap justify-center">
      {categories.map((cat) => (
        <button
          key={cat}
          onClick={() =>
            router.push(cat === "All" ? "/" : `/?category=${cat}`)
          }
          data-testid={`category-filter-${cat}`}
          className={`px-5 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
            active === cat
              ? "bg-orange-500 text-white shadow-md"
              : "bg-white text-gray-600 hover:bg-orange-50 border border-gray-200"
          }`}
        >
          {cat}
        </button>
      ))}
    </div>
  );
}
