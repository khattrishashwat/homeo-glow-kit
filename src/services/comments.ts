import { apiRequest } from "@/services/api";

export type BlogComment = {
  id: string;
  blogSlug: string;
  name: string;
  email?: string;
  comment: string;
  date: string; // ISO string
};

export type NewBlogComment = {
  blogSlug: string;
  name: string;
  email?: string;
  comment: string;
};

export const blogCommentsApi = {
  async list(blogSlug: string): Promise<BlogComment[]> {
    try {
      const res = await apiRequest<BlogComment[]>(`/api/blog/${blogSlug}/comments`);
      return res.data || [];
    } catch {
      return [];
    }
  },
  async create(payload: NewBlogComment): Promise<BlogComment> {
    const res = await apiRequest<BlogComment>(`/api/blog/${payload.blogSlug}/comments`, {
      method: "POST",
      body: JSON.stringify(payload),
    });
    return res.data;
  },
};
