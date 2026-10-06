/**
 * Centralized Single Source of Truth for Appointment Booking Pricing (Frontend)
 *
 * Online:
 * - 7 Days Plan: ₹500 (Delivery Included)
 * - 1 Month Plan: ₹1,000 (Delivery Included)
 *
 * Offline:
 * - Offline Appointment: ₹200 (Delivery Charges: Not Applicable)
 */

export type BookingType = "ONLINE" | "OFFLINE";
export type OnlinePlanType = "SEVEN_DAYS" | "ONE_MONTH";

export interface OnlinePlanConfig {
  id: OnlinePlanType;
  name: string;
  duration: string;
  durationDays: number;
  price: number;
  deliveryCharge: number;
  deliveryIncluded: boolean;
  totalAmount: number;
  badge?: string;
  description: string;
}

export interface OfflineConfig {
  name: string;
  duration: string;
  price: number;
  deliveryCharge: number;
  deliveryIncluded: boolean;
  totalAmount: number;
  description: string;
}

export const APPOINTMENT_PRICING = {
  ONLINE: {
    SEVEN_DAYS: {
      id: "SEVEN_DAYS" as OnlinePlanType,
      name: "7 Days Plan",
      duration: "7 Days",
      durationDays: 7,
      price: 500,
      deliveryCharge: 0,
      deliveryIncluded: true,
      totalAmount: 500,
      badge: "Starter Plan",
      description: "Introductory 7-day care protocol with medicines delivered to your doorstep.",
    },
    ONE_MONTH: {
      id: "ONE_MONTH" as OnlinePlanType,
      name: "1 Month Plan",
      duration: "30 Days",
      durationDays: 30,
      price: 1000,
      deliveryCharge: 0,
      deliveryIncluded: true,
      totalAmount: 1000,
      badge: "Most Popular",
      description: "Complete 30-day comprehensive care with medicines delivered to your doorstep.",
    },
  },
  OFFLINE: {
    APPOINTMENT: {
      name: "Offline Appointment",
      duration: "Clinic Consultation",
      price: 200,
      deliveryCharge: 0,
      deliveryIncluded: false,
      totalAmount: 200,
      description: "In-person consultation and physical examination at our clinic.",
    },
  },
} as const;

export const ONLINE_PLANS: OnlinePlanConfig[] = [
  APPOINTMENT_PRICING.ONLINE.SEVEN_DAYS,
  APPOINTMENT_PRICING.ONLINE.ONE_MONTH,
];

export interface CalculatedPricing {
  bookingType: BookingType;
  planType: OnlinePlanType | null;
  planDuration: number | null;
  planName: string;
  durationText: string;
  baseAmount: number;
  deliveryCharge: number;
  deliveryIncluded: boolean;
  totalAmount: number;
}

export function calculatePricing(
  bookingType: BookingType,
  planType?: OnlinePlanType | null
): CalculatedPricing {
  if (bookingType === "ONLINE") {
    const selected = planType === "ONE_MONTH"
      ? APPOINTMENT_PRICING.ONLINE.ONE_MONTH
      : APPOINTMENT_PRICING.ONLINE.SEVEN_DAYS;

    return {
      bookingType: "ONLINE",
      planType: selected.id,
      planDuration: selected.durationDays,
      planName: selected.name,
      durationText: selected.duration,
      baseAmount: selected.price,
      deliveryCharge: 0,
      deliveryIncluded: true,
      totalAmount: selected.totalAmount,
    };
  }

  // OFFLINE
  const offline = APPOINTMENT_PRICING.OFFLINE.APPOINTMENT;
  return {
    bookingType: "OFFLINE",
    planType: null,
    planDuration: null,
    planName: offline.name,
    durationText: offline.duration,
    baseAmount: offline.price,
    deliveryCharge: 0,
    deliveryIncluded: false,
    totalAmount: offline.totalAmount,
  };
}
