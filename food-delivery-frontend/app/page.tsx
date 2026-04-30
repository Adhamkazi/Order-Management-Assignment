import { MenuItem } from "@/lib/types";
import MenuItemCard from "@/components/MenuItemCard";
import CategoryFilter from "@/components/CategoryFilter";
import { API } from "@/lib/api";

async function getMenu(): Promise<MenuItem[]> {
  try {
    const res = await fetch(API.menu, { cache: "no-store" });
    const data = await res.json();
    return data.success ? data.data : [];
  } catch {
    return [];
  }
}

export default async function MenuPage({
  searchParams,
}: {
  searchParams: { category?: string };
}) {
  const menuItems = await getMenu();
  const categories = [...new Set(menuItems.map((i) => i.category))];
  const activeCategory = searchParams.category || "All";
  const filtered =
    activeCategory === "All"
      ? menuItems
      : menuItems.filter((i) => i.category === activeCategory);

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="mb-10 text-center">
        <h1 className="font-display text-5xl font-bold text-gray-900 mb-3">
          What are you craving?
        </h1>
        <p className="text-gray-500 text-lg">
          Fresh ingredients, bold flavours — delivered in minutes.
        </p>
      </div>
      <CategoryFilter categories={["All", ...categories]} active={activeCategory} />
      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((item, i) => (
          <div
            key={item.id}
            className="animate-slide-up"
            style={{ animationDelay: `${i * 60}ms`, animationFillMode: "both", opacity: 0 }}
          >
            <MenuItemCard item={item} />
          </div>
        ))}
      </div>
    </div>
  );
}
