import { useQuery, useMutation } from '@tanstack/react-query';
import { API_URL, blogsApi } from '@/services/api';

export function useBlogs(filters: Record<string, string | number | boolean | undefined> = {}) {
  return useQuery({
    queryKey: ['blogs', filters],
    queryFn: async () => {
      const response = await blogsApi.list(filters);
      return response;
    },
  });
}

export function useBlogBySlug(slug?: string) {
  return useQuery({
    queryKey: ['blog', slug],
    queryFn: async () => {
      const response = await blogsApi.bySlug(slug!);
      return response;
    },
    enabled: !!slug,
  });
}

export function useCreateBlog() {
  return useMutation({
    mutationFn: async (data: {
      title: string;
      excerpt: string;
      content: string;
      category: string;
      author: string;
      meta_description: string;
      meta_keywords: string;
      published: string;
      featured_image?: File;
    }) => {
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
