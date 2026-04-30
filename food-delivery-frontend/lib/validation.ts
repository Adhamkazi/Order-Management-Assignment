import { PlaceOrderPayload } from "./types";

export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

export function validateOrderPayload(body: unknown): ValidationResult {
  const errors: string[] = [];

  if (!body || typeof body !== "object") {
    return { valid: false, errors: ["Request body must be a JSON object"] };
  }

  const payload = body as Partial<PlaceOrderPayload>;

  // Validate items
  if (!Array.isArray(payload.items) || payload.items.length === 0) {
    errors.push("Order must contain at least one item");
  } else {
    payload.items.forEach((item, i) => {
      if (!item.id) errors.push(`Item ${i + 1}: missing id`);
      if (!item.name) errors.push(`Item ${i + 1}: missing name`);
      if (typeof item.price !== "number" || item.price <= 0)
        errors.push(`Item ${i + 1}: invalid price`);
      if (typeof item.quantity !== "number" || item.quantity < 1)
        errors.push(`Item ${i + 1}: quantity must be at least 1`);
    });
  }

  // Validate delivery
  const d = payload.delivery;
  if (!d) {
    errors.push("Delivery details are required");
  } else {
    if (!d.name || d.name.trim().length < 2)
      errors.push("Delivery name must be at least 2 characters");
    if (!d.address || d.address.trim().length < 5)
      errors.push("Delivery address must be at least 5 characters");
    if (!d.phone || !/^\+?[\d\s\-()]{7,15}$/.test(d.phone.trim()))
      errors.push("Phone number is invalid");
  }

  // Validate total
  if (typeof payload.total !== "number" || payload.total <= 0) {
    errors.push("Order total must be a positive number");
  }

  return { valid: errors.length === 0, errors };
}
