/**
 * Blog comment service.
 *
 * localStorage-backed with seed data so the UI works without a backend.
 * The async signatures mirror a REST API for easy future integration.
 */

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

const STORAGE_KEY = "md_blog_comments_v1";

const seed: BlogComment[] = [];

const read = (): BlogComment[] => {
  if (typeof window === "undefined") return seed;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return seed;
    return JSON.parse(raw) as BlogComment[];
  } catch {
    return seed;
  }
};

const write = (all: BlogComment[]) => {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
};

const delay = (ms = 400) => new Promise((r) => setTimeout(r, ms));

export const blogCommentsApi = {
  async list(blogSlug: string): Promise<BlogComment[]> {
    await delay();
    return read()
      .filter((c) => c.blogSlug === blogSlug)
      .sort((a, b) => +new Date(b.date) - +new Date(a.date));
  },
  async create(payload: NewBlogComment): Promise<BlogComment> {
    await delay();
    const comment: BlogComment = {
      id: `cmt-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      date: new Date().toISOString(),
      ...payload,
    };
    write([comment, ...read()]);
    return comment;
  },
};
