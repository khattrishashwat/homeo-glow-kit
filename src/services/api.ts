export const API_URL = import.meta.env.VITE_BACKEND_URL || "https://homopatic-backend-1.onrender.com";

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
  short_description?: string;
  description?: string;
  whyWeChooseThis?: string;
  why_we_choose_this?: string;
  price: number;
  compare_price?: number;
  category?: { _id: string; name: string; slug: string } | string;
  stock?: number;
  in_stock?: boolean;
  image?: string;
  image_alt?: string;
  gallery?: { url: string; alt: string }[];
  active?: boolean;
  featured?: boolean;
  recommended?: boolean;
  sku?: string;
   attributes?: {
     shortDescription?: string;
     benefits?: string[];
     ingredients?: string[];
     usage?: string;
     faqs?: Array<{ q: string; a: string }>;
     recommended?: boolean;
     durationWeeks?: number;
   };
   average_rating?: number;
  total_reviews?: number;
  views?: number;
  created_by?: { name: string; email: string };
  createdAt?: string;
  updatedAt?: string;
};

export type Blog = {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  content?: string;
   category?: { _id: string; name: string; slug: string } | string;
   featured_image?: string;
   featured_image_alt?: string;
   tags?: string[];
   author: string;
   author_bio?: string;
   published?: boolean;
   featured?: boolean;
   views?: number;
   published_at?: string;
   createdAt?: string;
   updatedAt?: string;
   reading_time?: number;
  created_by?: { name: string; email: string };
};

export type Category = {
  _id: string;
  name: string;
  slug: string;
   description?: string;
   image?: string;
   image_alt?: string;
   active: boolean;
  type: "blog" | "product" | "both";
  createdAt?: string;
  updatedAt?: string;
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
  concern?: string;
  customConcern?: string;
  city?: string;
  age?: number | string;
  consultation_type: "online" | "offline";
  paymentMethod?: "online" | "offline";
  amount?: number;
  notes?: string;
};

export type RazorpayOrderInfo = {
  orderId: string;
  amount: number;
  currency: string;
  key: string;
  paymentId?: string;
};

export type AppointmentBookingResponse = {
  _id: string;
  patientName: string;
  patientPhone: string;
  patientEmail?: string;
  status: string;
  payment_status: string;
  paymentMethod: string;
  consultation_type: string;
  concern?: string;
  customConcern?: string;
  city?: string;
  age?: number;
  slot?: Slot;
  amount?: number;
  razorpayOrderId?: string;
};

export type BookingResult = ApiResponse<AppointmentBookingResponse> & {
  razorpayOrder?: RazorpayOrderInfo;
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
    apiRequest<Blog[]>("/api/blog", {}, params),
  bySlug: (slug: string) => apiRequest<Blog>(`/api/blog/${slug}`),
};

export const categoriesApi = {
  list: (params?: Record<string, string | number | boolean | undefined>) =>
    apiRequest<Category[]>("/api/category", {}, params),
  bySlug: (slug: string) => apiRequest<Category>(`/api/category/${slug}`),
};

export const slotsApi = {
  available: () => apiRequest<Slot[]>("/api/web/slots"),
};

export const appointmentsApi = {
  create: (payload: AppointmentPayload) =>
    apiRequest<AppointmentBookingResponse>("/api/web/appointments", {
      method: "POST",
      body: JSON.stringify(payload),
    }) as Promise<BookingResult>,
  verifyPayment: (payload: {
    appointmentId: string;
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
  }) =>
    apiRequest<AppointmentBookingResponse>("/api/web/appointments/verify-payment", {
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
  track: (orderNumber: string, phone?: string) =>
    apiRequest<Record<string, unknown>>(`/api/web/orders/track/${orderNumber}`, {}, { phone }),
};

export const productReviewsApi = {
  list: (productSlug: string) =>
    apiRequest<Array<{ id: string; productSlug: string; name: string; rating: number; message: string; date: string }>>(
      `/api/products/${productSlug}/reviews`
    ),
  create: (payload: { productSlug: string; name: string; rating: number; message: string }) =>
    apiRequest<{ id: string; productSlug: string; name: string; rating: number; message: string; date: string }>(
      `/api/products/${payload.productSlug}/reviews`,
      {
        method: "POST",
        body: JSON.stringify(payload),
      }
    ),
};

export const blogCommentsApi = {
  list: (blogSlug: string) =>
    apiRequest<Array<{ id: string; blogSlug: string; name: string; email?: string; comment: string; date: string }>>(
      `/api/blog/${blogSlug}/comments`
    ),
  create: (payload: { blogSlug: string; name: string; email?: string; comment: string }) =>
    apiRequest<{ id: string; blogSlug: string; name: string; email?: string; comment: string; date: string }>(
      `/api/blog/${payload.blogSlug}/comments`,
      {
        method: "POST",
        body: JSON.stringify(payload),
      }
    ),
};

export const googleReviewsApi = {
  get: () => apiRequest<GoogleReviewsPayload>("/api/web/google-reviews"),
};

export const settingsApi = {
  get: () => apiRequest<SiteSettings>("/api/web/settings"),
};

export type Faq = {
  _id: string;
  question: string;
  answer: string;
  category?: string;
  order?: number;
  active?: boolean;
  createdAt?: string;
  updatedAt?: string;
};

export const faqsApi = {
  list: (params?: Record<string, string | number | boolean | undefined>) =>
    apiRequest<Faq[]>("/api/web/faqs", {}, params),
};

export type ChatConfig = {
  enabled: boolean;
  welcome_message?: string;
  welcomeMessage?: string;
  suggested_questions?: string[];
  suggestedQuestions?: string[];
  phone?: string;
  siteName?: string;
};

export type ChatMessageResponse = {
  reply: string;
  suggestions?: string[];
  action?: {
    type: "appointment" | "products" | "call" | "blog";
    label: string;
    url: string;
  };
};

export const chatApi = {
  getConfig: () => apiRequest<ChatConfig>("/api/web/chat/config"),
  sendMessage: (payload: { message: string; history?: Array<{ role: "user" | "assistant"; content: string }> }) =>
    apiRequest<ChatMessageResponse>("/api/web/chat/message", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
};

