export const API_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

export type ApiResponse<T> = {
  success: boolean;
  data: T;
  message?: string;
  pagination?: Pagination;
};

export type Pagination = {
  total: number;
  page: number;
  limit: number;
  pages: number;
};

export type Product = {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  price: number;
  compare_price?: number;
  category?: string;
  image?: string;
  images?: string[];
  stock?: number;
  in_stock?: boolean;
  active?: boolean;
  attributes?: {
    shortDescription?: string;
    benefits?: string[];
    ingredients?: string[];
    usage?: string;
    faqs?: Array<{ q: string; a: string }>;
    featured?: boolean;
    recommended?: boolean;
    durationWeeks?: number;
  };
  seo_title?: string;
  seo_description?: string;
};

export type Blog = {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  content?: string;
  category: string;
  featured_image?: string;
  author: string;
  published_at?: string;
  views?: number;
  meta_description?: string;
  meta_keywords?: string;
};

export type Slot = {
  _id: string;
  startTime: string;
  endTime: string;
  available: boolean;
  doctor?: string;
};

export type GoogleReview = {
  id: string;
  reviewerName: string;
  rating: number;
  text?: string;
  profileImage?: string;
  relativeTime?: string;
  reviewDate?: string | null;
  authorUrl?: string;
};

export type GoogleReviewsPayload = {
  placeName?: string;
  placeUrl?: string;
  rating: number | null;
  totalReviews: number;
  reviews: GoogleReview[];
  source: "google" | "fallback";
  cached: boolean;
  updatedAt: string;
};

export type SiteSettings = {
  site_name?: string;
  site_description?: string;
  phone?: string;
  email?: string;
  address?: string;
  city?: string;
  state?: string;
  postal_code?: string;
  country?: string;
  social_links?: {
    facebook?: string;
    instagram?: string;
    youtube?: string;
    whatsapp?: string;
  };
  business_hours?: {
    monday_friday?: string;
    saturday?: string;
    sunday?: string;
  };
  seo_settings?: {
    meta_title?: string;
    meta_description?: string;
    meta_keywords?: string;
  };
};

export type ContactPayload = {
  name: string;
  phone: string;
  email?: string;
  message: string;
};

export type AppointmentPayload = {
  name: string;
  phone: string;
  email?: string;
  slotId: string;
  reason: string;
  consultation_type: "online" | "offline";
  notes?: string;
};

export type OrderPayload = {
  items: Array<{ productId?: string; productSlug?: string; quantity: number }>;
  shipping_cost: number;
  discount: number;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  shipping_address: {
    street: string;
    city: string;
    state: string;
    postal_code: string;
    country: string;
  };
  notes?: string;
  order_status: "pending" | "processing";
  payment_status: "pending" | "completed";
};

const buildUrl = (path: string, params?: Record<string, string | number | boolean | undefined>) => {
  const url = new URL(path, API_URL);
  Object.entries(params || {}).forEach(([key, value]) => {
    if (value !== undefined && value !== "") url.searchParams.set(key, String(value));
  });
  return url.toString();
};

export const assetUrl = (path?: string) => {
  if (!path) return "";
  if (/^https?:\/\//.test(path)) return path;
  return `${API_URL}${path}`;
};

export async function apiRequest<T>(
  path: string,
  options: RequestInit = {},
  params?: Record<string, string | number | boolean | undefined>,
) {
  const response = await fetch(buildUrl(path, params), {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });
  const body = (await response.json().catch(() => null)) as ApiResponse<T> | null;
  if (!response.ok || body?.success === false) {
    throw new Error(body?.message || "Request failed");
  }
  return body as ApiResponse<T>;
}

export const productSummary = (product: Product) =>
  product.attributes?.shortDescription || product.description || "";

export const productMrp = (product: Product) => product.compare_price || product.price;

export const formatINR = (n: number) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);

export const discountPercent = (mrp: number, price: number) =>
  mrp > price ? Math.round(((mrp - price) / mrp) * 100) : 0;

export const productsApi = {
  list: (params?: Record<string, string | number | boolean | undefined>) =>
    apiRequest<Product[]>("/api/products", {}, params),
  bySlug: (slug: string) => apiRequest<Product>(`/api/products/${slug}`),
};

export const blogsApi = {
  list: (params?: Record<string, string | number | boolean | undefined>) =>
    apiRequest<{ data: Blog[]; pagination: Pagination }>("/api/blog", {}, params),
  bySlug: (slug: string) => apiRequest<Blog>(`/api/blog/${slug}`),
};

export const slotsApi = {
  available: () => apiRequest<Slot[]>("/api/web/slots"),
};

export const appointmentsApi = {
  create: (payload: AppointmentPayload) =>
    apiRequest<unknown>("/api/web/appointments", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
};

export const contactApi = {
  create: (payload: ContactPayload) =>
    apiRequest<unknown>("/api/web/contacts", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
};

export const ordersApi = {
  create: (payload: OrderPayload) =>
    apiRequest<{ _id: string; order_number: string }>("/api/web/orders", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
};

export const googleReviewsApi = {
  get: () => apiRequest<GoogleReviewsPayload>("/api/web/google-reviews"),
};

export const settingsApi = {
  get: () => apiRequest<SiteSettings>("/api/web/settings"),
};
