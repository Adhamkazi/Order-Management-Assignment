import Link from "next/link";

export default function NotFound() {
  return (
    <div className="max-w-xl mx-auto px-4 py-32 text-center">
      <p className="text-8xl mb-6">🍕</p>
      <h1 className="font-display text-5xl font-bold text-gray-900 mb-3">
        404
      </h1>
      <p className="text-gray-500 text-lg mb-8">
        Looks like this page got eaten.
      </p>
      <Link
        href="/"
        className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-full font-semibold transition-all hover:shadow-md"
      >
        Back to Menu
      </Link>
    </div>
  );
}
