import { useQuery } from '@tanstack/react-query';
import { Link, useSearch } from '@tanstack/react-router';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const API_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

export const Route = {
  component: BlogPage,
};

export default function BlogPage() {
  const searchParams = useSearch({ from: '/blog' });
  const [page, setPage] = useState(searchParams?.page || 1);
  const [category, setCategory] = useState(searchParams?.category || 'all');

  const { data, isLoading, error } = useQuery({
    queryKey: ['blogs', page, category],
    queryFn: async () => {
      const params = new URLSearchParams({ page, limit: 10 });
      if (category !== 'all') params.append('category', category);

      const response = await fetch(`${API_URL}/api/blog?${params}`);
      if (!response.ok) throw new Error('Failed to fetch blogs');
      return response.json();
    },
  });

  const blogs = data?.data?.data || [];
  const pagination = data?.data?.pagination;

  const categories = ['all', 'treatment', 'lifestyle', 'wellness', 'news'];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary to-primary/80 px-4 py-16 text-white">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="text-4xl font-bold md:text-5xl">Health & Wellness Blog</h1>
          <p className="mt-4 text-lg text-primary-foreground/90">
            Discover natural health solutions and wellness tips from our expert practitioners
          </p>
        </div>
      </section>

      {/* Categories Filter */}
      <section className="border-b bg-muted/50 px-4 py-6">
        <div className="mx-auto max-w-4xl">
          <h3 className="mb-4 font-semibold">Filter by Category:</h3>
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <Button
                key={cat}
                variant={category === cat ? 'default' : 'outline'}
                onClick={() => {
                  setCategory(cat);
                  setPage(1);
                }}
                className="capitalize"
              >
                {cat}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Grid */}
      <section className="px-4 py-12">
        <div className="mx-auto max-w-6xl">
          {isLoading ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Card key={i} className="h-80 animate-pulse bg-muted" />
              ))}
            </div>
          ) : error ? (
            <div className="rounded-lg border border-destructive bg-destructive/10 p-6 text-center">
              <p className="text-destructive">Failed to load blogs. Please try again later.</p>
            </div>
          ) : blogs.length === 0 ? (
            <div className="text-center">
              <p className="text-lg text-muted-foreground">No blog posts found.</p>
            </div>
          ) : (
            <>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {blogs.map((blog) => (
                  <Link key={blog._id} to={`/blog/${blog.slug}`}>
                    <Card className="group h-full overflow-hidden transition-all hover:shadow-lg">
                      {blog.featured_image && (
                        <img
                          src={`${API_URL}${blog.featured_image}`}
                          alt={blog.title}
                          className="h-48 w-full object-cover transition-transform group-hover:scale-105"
                        />
                      )}
                      <div className="p-4">
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="font-semibold line-clamp-2 group-hover:text-primary">
                            {blog.title}
                          </h3>
                          <Badge variant="secondary" className="capitalize whitespace-nowrap">
                            {blog.category}
                          </Badge>
                        </div>
                        <p className="mt-3 text-sm text-muted-foreground line-clamp-2">
                          {blog.excerpt}
                        </p>
                        <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
                          <span>{blog.author}</span>
                          <span>{blog.views} views</span>
                        </div>
                      </div>
                    </Card>
                  </Link>
                ))}
              </div>

              {/* Pagination */}
              {pagination && pagination.pages > 1 && (
                <div className="mt-8 flex justify-center gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setPage(Math.max(1, page - 1))}
                    disabled={page === 1}
                  >
                    Previous
                  </Button>
                  <div className="flex items-center gap-2">
                    {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((p) => (
                      <Button
                        key={p}
                        variant={page === p ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setPage(p)}
                      >
                        {p}
                      </Button>
                    ))}
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => setPage(Math.min(pagination.pages, page + 1))}
                    disabled={page === pagination.pages}
                  >
                    Next
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </div>
  );
}
