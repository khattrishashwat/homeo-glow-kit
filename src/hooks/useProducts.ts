import { useQuery } from '@tanstack/react-query';

const API_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

export function useProducts(filters = {}) {
  return useQuery({
    queryKey: ['products', filters],
    queryFn: async () => {
      const params = new URLSearchParams(filters);
      const response = await fetch(`${API_URL}/api/products?${params}`);
      if (!response.ok) throw new Error('Failed to fetch products');
      return response.json();
    },
  });
}

export function useProductBySlug(slug) {
  return useQuery({
    queryKey: ['product', slug],
    queryFn: async () => {
      const response = await fetch(`${API_URL}/api/products/${slug}`);
      if (!response.ok) throw new Error('Failed to fetch product');
      return response.json();
    },
    enabled: !!slug,
  });
}
