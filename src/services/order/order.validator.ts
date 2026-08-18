import type { Order } from "@/types/order";

export interface ValidationResult {
  valid: boolean;

  errors: string[];
}

export function validateOrder(
  order: Partial<Order>
): ValidationResult {
  const errors: string[] = [];

  if (!order.customer?.fullName) {
    errors.push("Customer name is required.");
  }

  if (!order.customer?.email) {
    errors.push("Customer email is required.");
  }

  if (!order.customer?.phone) {
    errors.push("Customer phone is required.");
  }

  if (!order.referencePhotos?.length) {
    errors.push("At least one reference image is required.");
  }

  if (!order.portrait?.packageId) {
    errors.push("Please select a package.");
  }

  if (!order.portrait?.subjects) {
    errors.push("Number of subjects is required.");
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}