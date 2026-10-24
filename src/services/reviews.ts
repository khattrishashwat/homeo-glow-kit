import { apiRequest } from "@/services/api";

export type ProductReview = {
  id: string;
  productSlug: string;
  name: string;
  email?: string;
  rating: number;
  message: string;
  verifiedPurchase?: boolean;
  date: string; // ISO string
};

export type NewProductReview = {
  productSlug: string;
  name: string;
  email?: string;
  rating: number;
  message: string;
};

export interface ReviewApiResponse {
  success: boolean;
  message?: string;
  data: ProductReview[];
  summary?: {
    total: number;
    average: number;
  };
}

export const productReviewsApi = {
  async list(productSlug: string): Promise<ProductReview[]> {
    try {
      const res = await apiRequest<any>(`/api/products/${productSlug}/reviews`);
      if (Array.isArray(res?.data)) {
        return res.data;
      }
      if (res?.data && Array.isArray((res.data as any).data)) {
        return (res.data as any).data;
      }
      return [];
    } catch {
      return [];
    }
  },

  async create(payload: NewProductReview): Promise<{ success: boolean; message?: string; data: ProductReview }> {
    const res = await apiRequest<any>(`/api/products/${payload.productSlug}/reviews`, {
      method: "POST",
      body: JSON.stringify(payload),
    });
    return res;
  },
};

export const reviewSummary = (reviews: ProductReview[] = []) => {
  const total = reviews.length;
  const average =
    total === 0 ? 0 : Number((reviews.reduce((sum, r) => sum + (Number(r.rating) || 5), 0) / total).toFixed(1));
  return { total, average };
};
