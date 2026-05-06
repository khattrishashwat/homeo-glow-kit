import { useQuery, useMutation } from '@tanstack/react-query';

const API_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

export function useBlogs(filters = {}) {
  return useQuery({
    queryKey: ['blogs', filters],
    queryFn: async () => {
      const params = new URLSearchParams(filters);
      const response = await fetch(`${API_URL}/api/blog?${params}`);
      if (!response.ok) throw new Error('Failed to fetch blogs');
      return response.json();
    },
  });
}

export function useBlogBySlug(slug) {
  return useQuery({
    queryKey: ['blog', slug],
    queryFn: async () => {
      const response = await fetch(`${API_URL}/api/blog/${slug}`);
      if (!response.ok) throw new Error('Failed to fetch blog');
      return response.json();
    },
    enabled: !!slug,
  });
}

export function useCreateBlog() {
  return useMutation({
    mutationFn: async (data) => {
      const formData = new FormData();
      formData.append('title', data.title);
      formData.append('excerpt', data.excerpt);
      formData.append('content', data.content);
      formData.append('category', data.category);
      formData.append('author', data.author);
      formData.append('meta_description', data.meta_description);
      formData.append('meta_keywords', data.meta_keywords);
      formData.append('published', data.published);

      if (data.featured_image) {
        formData.append('featured_image', data.featured_image);
      }

      const response = await fetch(`${API_URL}/api/blog`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: formData,
      });

      if (!response.ok) throw new Error('Failed to create blog');
      return response.json();
    },
  });
}
