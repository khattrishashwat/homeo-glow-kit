/**
 * Product review service.
 *
 * Currently backed by localStorage with seeded demo data so the UI works
 * without a backend. The shape and async signatures mirror a REST API, so
 * swapping in real endpoints later only requires changing the two functions
 * below (list / create) to call `apiRequest`.
 */

export type ProductReview = {
  id: string;
  productSlug: string;
  name: string;
  rating: number;
  message: string;
  date: string; // ISO string
};

export type NewProductReview = {
  productSlug: string;
  name: string;
  rating: number;
  message: string;
};

const STORAGE_KEY = "md_product_reviews_v1";

const seed: ProductReview[] = [
  {
    id: "seed-br-1",
    productSlug: "br-oil",
    name: "Ramesh Gupta",
    rating: 5,
    message:
      "Used BR Oil for my knee pain and stiffness. Within two weeks the discomfort reduced a lot. Non-greasy and easy to apply.",
    date: "2026-05-20T10:00:00.000Z",
  },
  {
    id: "seed-br-2",
    productSlug: "br-oil",
    name: "Sunita Devi",
    rating: 4,
    message: "Good relief for back pain. The smell is mild and it absorbs well.",
    date: "2026-06-02T10:00:00.000Z",
  },
  {
    id: "seed-svs-1",
    productSlug: "scalp-vital-spray",
    name: "Aakash Nair",
    rating: 5,
    message:
      "My dandruff and itchy scalp improved noticeably. Lightweight spray, no oily residue at all.",
    date: "2026-05-28T10:00:00.000Z",
  },
  {
    id: "seed-svs-2",
    productSlug: "scalp-vital-spray",
    name: "Neha Kapoor",
    rating: 5,
    message: "Scalp feels much less dry now. Really happy with the results so far.",
    date: "2026-06-10T10:00:00.000Z",
  },
];

const read = (): ProductReview[] => {
  if (typeof window === "undefined") return seed;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(seed));
      return seed;
    }
    return JSON.parse(raw) as ProductReview[];
  } catch {
    return seed;
  }
};

const write = (all: ProductReview[]) => {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
};

const delay = (ms = 400) => new Promise((r) => setTimeout(r, ms));

export const productReviewsApi = {
  async list(productSlug: string): Promise<ProductReview[]> {
    await delay();
    return read()
      .filter((r) => r.productSlug === productSlug)
      .sort((a, b) => +new Date(b.date) - +new Date(a.date));
  },
  async create(payload: NewProductReview): Promise<ProductReview> {
    await delay();
    const review: ProductReview = {
      id: `rev-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      date: new Date().toISOString(),
      ...payload,
    };
    const all = read();
    write([review, ...all]);
    return review;
  },
};

export const reviewSummary = (reviews: ProductReview[]) => {
  const total = reviews.length;
  const average =
    total === 0 ? 0 : reviews.reduce((sum, r) => sum + r.rating, 0) / total;
  return { total, average };
};
