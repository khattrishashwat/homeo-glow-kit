import { useQuery } from "@tanstack/react-query";
import { googleReviewsApi } from "@/services/api";

export function useGoogleReviews() {
  return useQuery({
    queryKey: ["google-reviews"],
    queryFn: async () => {
      const response = await googleReviewsApi.get();
      return response.data;
    },
    staleTime: 1000 * 60 * 30,
  });
}

