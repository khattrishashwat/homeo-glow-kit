// Simple sessionStorage-backed checkout state shared across shop → checkout → payment → success.
export type CheckoutDraft = {
  productSlug: string;
  quantity: number;
  coupon?: string;
  customer?: {
    name: string;
    phone: string;
    email: string;
    address_line: string;
    city: string;
    state: string;
    pincode: string;
    consultation_mode: "Online" | "Offline";
  };
};

const KEY = "mdh_checkout_draft";
const ORDER_KEY = "mdh_last_order";

export const saveDraft = (d: CheckoutDraft) => {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(KEY, JSON.stringify(d));
};
export const loadDraft = (): CheckoutDraft | null => {
  if (typeof window === "undefined") return null;
  const v = sessionStorage.getItem(KEY);
  return v ? (JSON.parse(v) as CheckoutDraft) : null;
};
export const clearDraft = () => {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(KEY);
};

export type SavedOrder = {
  id: string;
  order_number?: string;
  product_name: string;
  quantity: number;
  total: number;
  payment_method: string;
  payment_status: string;
  consultation_mode: string;
  name: string;
  phone: string;
};
export const saveLastOrder = (o: SavedOrder) => {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(ORDER_KEY, JSON.stringify(o));
};
export const loadLastOrder = (): SavedOrder | null => {
  if (typeof window === "undefined") return null;
  const v = sessionStorage.getItem(ORDER_KEY);
  return v ? (JSON.parse(v) as SavedOrder) : null;
};
