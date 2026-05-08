import { useQuery } from '@tanstack/react-query';
import { productsApi } from '@/services/api';

export function useProducts(filters: Record<string, string | number | boolean | undefined> = {}) {
  return useQuery({
    queryKey: ['products', filters],
    queryFn: async () => {
      const response = await productsApi.list(filters);
      return response;
    },
  });
}

export function useProductBySlug(slug?: string) {
  return useQuery({
    queryKey: ['product', slug],
    queryFn: async () => {
      const response = await productsApi.bySlug(slug!);
      return response;
    },
    enabled: !!slug,
  });
}
