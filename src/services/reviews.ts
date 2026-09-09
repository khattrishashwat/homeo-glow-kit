import { apiRequest } from "@/services/api";

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

export const productReviewsApi = {
  async list(productSlug: string): Promise<ProductReview[]> {
    try {
      const res = await apiRequest<ProductReview[]>(`/api/products/${productSlug}/reviews`);
      return res.data || [];
    } catch {
      return [];
    }
  },
  async create(payload: NewProductReview): Promise<ProductReview> {
    const res = await apiRequest<ProductReview>(`/api/products/${payload.productSlug}/reviews`, {
      method: "POST",
      body: JSON.stringify(payload),
    });
    return res.data;
  },
};

export const reviewSummary = (reviews: ProductReview[]) => {
  const total = reviews.length;
  const average =
    total === 0 ? 0 : reviews.reduce((sum, r) => sum + r.rating, 0) / total;
  return { total, average };
};
