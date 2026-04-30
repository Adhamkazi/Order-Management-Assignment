"use client";

import { OrderStatus } from "@/lib/types";
import { CheckCircle2, Clock, ChefHat, Truck } from "lucide-react";

const STEPS: { status: OrderStatus; icon: React.ReactNode; label: string; description: string }[] = [
  {
    status: "Order Received",
    icon: <Clock size={20} />,
    label: "Order Received",
    description: "We got your order!",
  },
  {
    status: "Preparing",
    icon: <ChefHat size={20} />,
    label: "Preparing",
    description: "Chef is cooking your meal",
  },
  {
    status: "Out for Delivery",
    icon: <Truck size={20} />,
    label: "Out for Delivery",
    description: "On the way to you",
  },
  {
    status: "Delivered",
    icon: <CheckCircle2 size={20} />,
    label: "Delivered",
    description: "Enjoy your meal!",
  },
];

const STATUS_INDEX: Record<OrderStatus, number> = {
  "Order Received": 0,
  Preparing: 1,
  "Out for Delivery": 2,
  Delivered: 3,
};

interface OrderStatusTrackerProps {
  status: OrderStatus;
}

export default function OrderStatusTracker({ status }: OrderStatusTrackerProps) {
  const currentIndex = STATUS_INDEX[status];

  return (
    <div data-testid="order-status-tracker" className="w-full">
      <div className="relative flex items-start justify-between">
        {/* Progress line */}
        <div className="absolute top-5 left-0 right-0 h-0.5 bg-gray-200">
          <div
            className="h-full bg-orange-500 transition-all duration-700 ease-in-out"
            style={{ width: `${(currentIndex / (STEPS.length - 1)) * 100}%` }}
          />
        </div>

        {STEPS.map((step, index) => {
          const isCompleted = index < currentIndex;
          const isCurrent = index === currentIndex;

          return (
            <div key={step.status} className="flex flex-col items-center z-10 flex-1">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 ${
                  isCompleted
                    ? "bg-orange-500 text-white shadow-md"
                    : isCurrent
                    ? "bg-orange-500 text-white shadow-lg ring-4 ring-orange-100 animate-pulse"
                    : "bg-white border-2 border-gray-200 text-gray-400"
                }`}
              >
                {step.icon}
              </div>
              <p
                className={`mt-3 text-xs font-semibold text-center leading-tight max-w-[70px] ${
                  isCurrent ? "text-orange-600" : isCompleted ? "text-gray-700" : "text-gray-400"
                }`}
              >
                {step.label}
              </p>
              {isCurrent && (
                <p className="mt-1 text-xs text-gray-400 text-center max-w-[80px]">
                  {step.description}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
