"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Order, OrderStatus } from "@/lib/types";
import OrderStatusTracker from "@/components/OrderStatusTracker";
import Link from "next/link";
import { Home, PackageCheck } from "lucide-react";
import { API } from "@/lib/api";

export default function OrderStatusPage() {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [status, setStatus] = useState<OrderStatus>("Order Received");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(API.order(id))
      .then((r) => r.json())
      .then((data) => {
        if (data.success) {
          setOrder(data.data);
          setStatus(data.data.status);
        } else {
          setError("Order not found.");
        }
      })
      .catch(() => setError("Failed to load order."))
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    if (!id) return;
    const source = new EventSource(API.orderStream(id));
    source.onmessage = (e) => {
      const parsed = JSON.parse(e.data);
      setStatus(parsed.status);
    };
    source.onerror = () => source.close();
    return () => source.close();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-24 text-center">
        <div className="animate-spin w-10 h-10 border-4 border-orange-200 border-t-orange-500 rounded-full mx-auto mb-4" />
        <p className="text-gray-500">Loading your order...</p>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-24 text-center">
        <p className="text-red-500 mb-4">{error}</p>
        <Link href="/" className="text-orange-500 underline">Back to menu</Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-100 rounded-full mb-4">
          <PackageCheck className="text-orange-500" size={28} />
        </div>
        <h1 className="font-display text-4xl font-bold text-gray-900 mb-1">Order Placed!</h1>
        <p className="text-gray-500 text-sm">
          Order ID: <span className="font-mono text-gray-700">{order.id.slice(0, 8)}...</span>
        </p>
      </div>

      <div className="bg-white rounded-2xl p-8 shadow-sm mb-6">
        <h2 className="font-semibold text-gray-700 text-sm uppercase tracking-wide mb-8">Live Status</h2>
        <OrderStatusTracker status={status} />
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-sm mb-6">
        <h2 className="font-semibold text-gray-900 mb-4">Delivery Details</h2>
        <div className="text-sm space-y-1.5 text-gray-600">
          <p><span className="font-medium text-gray-700">Name:</span> {order.delivery.name}</p>
          <p><span className="font-medium text-gray-700">Address:</span> {order.delivery.address}</p>
          <p><span className="font-medium text-gray-700">Phone:</span> {order.delivery.phone}</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-sm mb-8">
        <h2 className="font-semibold text-gray-900 mb-4">Items Ordered</h2>
        <div className="space-y-2">
          {order.items.map((item) => (
            <div key={item.id} className="flex justify-between text-sm">
              <span className="text-gray-600">{item.name} <span className="text-gray-400">×{item.quantity}</span></span>
              <span className="font-medium text-gray-900">${(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
          <div className="border-t border-gray-100 pt-3 mt-3 flex justify-between font-bold text-gray-900">
            <span>Total</span>
            <span>${order.total.toFixed(2)}</span>
          </div>
        </div>
      </div>

      <Link href="/" className="flex items-center justify-center gap-2 bg-gray-900 hover:bg-gray-800 text-white py-3 px-6 rounded-full font-semibold transition-all">
        <Home size={16} />
        Back to Menu
      </Link>
    </div>
  );
}
