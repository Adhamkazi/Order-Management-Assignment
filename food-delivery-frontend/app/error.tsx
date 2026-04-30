"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="max-w-xl mx-auto px-4 py-32 text-center">
      <p className="text-6xl mb-6">😵</p>
      <h2 className="font-display text-3xl font-bold text-gray-900 mb-3">
        Something went wrong
      </h2>
      <p className="text-gray-500 mb-8">
        {error.message || "An unexpected error occurred."}
      </p>
      <div className="flex gap-3 justify-center">
        <button
          onClick={reset}
          className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-full font-semibold transition-all"
        >
          Try Again
        </button>
        <Link
          href="/"
          className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-full font-semibold transition-all"
        >
          Go Home
        </Link>
      </div>
    </div>
  );
}
