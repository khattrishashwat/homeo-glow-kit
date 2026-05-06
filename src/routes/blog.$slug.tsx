import { useQuery } from '@tanstack/react-query';
import { useParams } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Link } from '@tanstack/react-router';

const API_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

export const Route = {
  component: BlogDetailPage,
};

export default function BlogDetailPage() {
  const { slug } = useParams({ from: '/blog/$slug' });

  const { data, isLoading, error } = useQuery({
    queryKey: ['blog', slug],
    queryFn: async () => {
      const response = await fetch(`${API_URL}/api/blog/${slug}`);
      if (!response.ok) throw new Error('Blog not found');
      return response.json();
    },
  });

  const blog = data?.data;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background px-4 py-12">
        <div className="mx-auto max-w-2xl animate-pulse">
          <div className="mb-6 h-12 w-3/4 rounded bg-muted" />
          <div className="mb-4 h-80 rounded bg-muted" />
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-4 rounded bg-muted" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="min-h-screen bg-background px-4 py-12">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="text-2xl font-bold text-destructive">Blog Post Not Found</h1>
          <p className="mt-4 text-muted-foreground">
            The blog post you are looking for does not exist.
          </p>
          <Link to="/blog">
            <Button className="mt-6">Back to Blogs</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <article className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="border-b bg-muted/50 px-4 py-8">
        <div className="mx-auto max-w-3xl">
          <Link to="/blog" className="text-sm text-primary hover:underline">
            ← Back to Blog
          </Link>
          <h1 className="mt-4 text-4xl font-bold md:text-5xl">{blog.title}</h1>
          <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            <span>By {blog.author}</span>
            <span>•</span>
            <span>{new Date(blog.published_at).toLocaleDateString()}</span>
            <span>•</span>
            <Badge variant="secondary" className="capitalize">
              {blog.category}
            </Badge>
            <span>•</span>
            <span>{blog.views} views</span>
          </div>
        </div>
      </section>

      {/* Featured Image */}
      {blog.featured_image && (
        <section className="border-b px-4 py-8">
          <div className="mx-auto max-w-3xl">
            <img
              src={`${API_URL}${blog.featured_image}`}
              alt={blog.title}
              className="w-full rounded-lg object-cover"
            />
          </div>
        </section>
      )}

      {/* Content */}
      <section className="px-4 py-12">
        <div className="mx-auto max-w-3xl">
          {/* Excerpt */}
          <div className="mb-8 rounded-lg bg-primary/5 p-6 italic">
            <p className="text-lg">{blog.excerpt}</p>
          </div>

          {/* Body Content */}
          <div
            className="prose dark:prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: blog.content }}
          />
        </div>
      </section>

      {/* SEO Meta Info (optional, can be hidden) */}
      <section className="border-t bg-muted/50 px-4 py-6">
        <div className="mx-auto max-w-3xl text-sm text-muted-foreground">
          {blog.meta_keywords && <p>Keywords: {blog.meta_keywords}</p>}
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-t bg-background px-4 py-12">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-2xl font-bold">Interested in our services?</h2>
          <p className="mt-2 text-muted-foreground">
            Schedule an appointment with our experienced practitioners
          </p>
          <div className="mt-6 flex gap-4 justify-center">
            <Link to="/appointment">
              <Button size="lg">Book Appointment</Button>
            </Link>
            <Link to="/contact">
              <Button variant="outline" size="lg">
                Contact Us
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </article>
  );
}
