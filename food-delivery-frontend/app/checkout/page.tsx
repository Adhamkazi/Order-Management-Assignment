"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/store/cart-store";
import { DeliveryDetails } from "@/lib/types";
import { API } from "@/lib/api";
import { MapPin, Phone, User, ArrowRight } from "lucide-react";
import Link from "next/link";

interface FormErrors {
  name?: string;
  address?: string;
  phone?: string;
}

function validate(data: DeliveryDetails): FormErrors {
  const errors: FormErrors = {};
  if (!data.name || data.name.trim().length < 2)
    errors.name = "Name must be at least 2 characters";
  if (!data.address || data.address.trim().length < 5)
    errors.address = "Please enter a valid address";
  if (!data.phone || !/^\+?[\d\s\-()]{7,15}$/.test(data.phone.trim()))
    errors.phone = "Please enter a valid phone number";
  return errors;
}

export default function CheckoutPage() {
  const router = useRouter();
  const { items, totalPrice, clearCart } = useCartStore();
  const [form, setForm] = useState<DeliveryDetails>({
    name: "",
    address: "",
    phone: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-24 text-center">
        <p className="text-gray-500 mb-4">Nothing to checkout.</p>
        <Link href="/" className="text-orange-500 underline">
          Go to menu
        </Link>
      </div>
    );
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setErrors((prev) => ({ ...prev, [e.target.name]: undefined }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validate(form);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    setServerError("");

    try {
      const res = await fetch(API.orders, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items,
          delivery: form,
          total: totalPrice(),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setServerError(data.errors?.join(", ") || "Something went wrong");
        return;
      }

      clearCart();
      router.push(`/order-status/${data.data.id}`);
    } catch {
      setServerError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-10 grid grid-cols-1 lg:grid-cols-5 gap-8">
      {/* Form */}
      <div className="lg:col-span-3">
        <h1 className="font-display text-4xl font-bold text-gray-900 mb-8">
          Delivery Details
        </h1>

        <form onSubmit={handleSubmit} className="space-y-5" noValidate>
          {/* Name */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Full Name
            </label>
            <div className="relative">
              <User
                size={16}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                data-testid="input-name"
                placeholder="John Doe"
                className={`w-full pl-10 pr-4 py-3 rounded-xl border ${
                  errors.name ? "border-red-400 bg-red-50" : "border-gray-200"
                } focus:outline-none focus:ring-2 focus:ring-orange-300 bg-white text-gray-900 placeholder-gray-400`}
              />
            </div>
            {errors.name && (
              <p data-testid="error-name" className="text-red-500 text-xs mt-1">
                {errors.name}
              </p>
            )}
          </div>

          {/* Address */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Delivery Address
            </label>
            <div className="relative">
              <MapPin
                size={16}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                name="address"
                value={form.address}
                onChange={handleChange}
                data-testid="input-address"
                placeholder="123 Main Street, City"
                className={`w-full pl-10 pr-4 py-3 rounded-xl border ${
                  errors.address ? "border-red-400 bg-red-50" : "border-gray-200"
                } focus:outline-none focus:ring-2 focus:ring-orange-300 bg-white text-gray-900 placeholder-gray-400`}
              />
            </div>
            {errors.address && (
              <p data-testid="error-address" className="text-red-500 text-xs mt-1">
                {errors.address}
              </p>
            )}
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Phone Number
            </label>
            <div className="relative">
              <Phone
                size={16}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="tel"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                data-testid="input-phone"
                placeholder="+91 98765 43210"
                className={`w-full pl-10 pr-4 py-3 rounded-xl border ${
                  errors.phone ? "border-red-400 bg-red-50" : "border-gray-200"
                } focus:outline-none focus:ring-2 focus:ring-orange-300 bg-white text-gray-900 placeholder-gray-400`}
              />
            </div>
            {errors.phone && (
              <p data-testid="error-phone" className="text-red-500 text-xs mt-1">
                {errors.phone}
              </p>
            )}
          </div>

          {serverError && (
            <p className="text-red-500 text-sm bg-red-50 p-3 rounded-xl">
              {serverError}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            data-testid="place-order-button"
            className="w-full flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 disabled:opacity-60 disabled:cursor-not-allowed text-white py-4 rounded-xl font-semibold text-lg transition-all hover:shadow-md mt-2"
          >
            {loading ? (
              "Placing Order..."
            ) : (
              <>
                Place Order <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>
      </div>

      {/* Order Summary */}
      <div className="lg:col-span-2">
        <div className="bg-white rounded-2xl p-6 shadow-sm sticky top-24">
          <h2 className="font-display text-xl font-bold text-gray-900 mb-5">
            Order Summary
          </h2>
          <div className="space-y-3 mb-5">
            {items.map((item) => (
              <div key={item.id} className="flex justify-between text-sm">
                <span className="text-gray-600">
                  {item.name}{" "}
                  <span className="text-gray-400">×{item.quantity}</span>
                </span>
                <span className="font-medium text-gray-900">
                  ${(item.price * item.quantity).toFixed(2)}
                </span>
              </div>
            ))}
          </div>
          <div className="border-t border-gray-100 pt-4 flex justify-between font-bold text-gray-900">
            <span>Total</span>
            <span>${totalPrice().toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
