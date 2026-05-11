import { useQuery } from '@tanstack/react-query';
import { createFileRoute, Link } from '@tanstack/react-router';
import { Helmet } from 'react-helmet-async';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { assetUrl, blogsApi } from '@/services/api';

export const Route = createFileRoute('/blog/$slug')({
  component: BlogDetailPage,
});

export default function BlogDetailPage() {
  const { slug } = Route.useParams();

  const { data, isLoading, error } = useQuery({
    queryKey: ['blog', slug],
    queryFn: async () => {
      return blogsApi.bySlug(slug);
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

  const siteUrl = "https://mdshomeopathy.com"; // Replace with actual site URL
  const blogUrl = `${siteUrl}/blog/${blog.slug}`;
  const seoTitle = blog.seo_title || blog.title;
  const seoDescription = blog.meta_description || blog.excerpt;
  const seoKeywords = blog.meta_keywords?.join(", ") || "";
  const ogImage = assetUrl(blog.og_image || blog.featured_image);

  // JSON-LD Schema for BlogPosting
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: blog.title,
    description: seoDescription,
    image: ogImage,
    author: {
      "@type": "Person",
      name: blog.author,
    },
    publisher: {
      "@type": "Organization",
      name: "MD's Homeopathy",
      logo: {
        "@type": "ImageObject",
        url: `${siteUrl}/logo.png`,
      },
    },
    datePublished: blog.published_at || blog.createdAt,
    dateModified: blog.updatedAt || blog.createdAt,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": blogUrl,
    },
    wordCount: blog.reading_time ? blog.reading_time * 200 : undefined,
  };

  return (
    <>
      <Helmet>
        <title>{seoTitle}</title>
        <meta name="description" content={seoDescription} />
        {seoKeywords && <meta name="keywords" content={seoKeywords} />}
        {blog.canonical_url && <link rel="canonical" href={blog.canonical_url} />}

        {/* OpenGraph */}
        <meta property="og:title" content={seoTitle} />
        <meta property="og:description" content={seoDescription} />
        <meta property="og:image" content={ogImage} />
        <meta property="og:url" content={blogUrl} />
        <meta property="og:type" content="article" />
        <meta property="og:site_name" content="MD's Homeopathy" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={seoTitle} />
        <meta name="twitter:description" content={seoDescription} />
        <meta name="twitter:image" content={ogImage} />

        {/* Article meta */}
        {blog.category && (
          <meta property="article:section" content={typeof blog.category === 'object' ? blog.category.name : blog.category} />
        )}
        {blog.tags?.map((tag: string, i: number) => (
          <meta key={i} property="article:tag" content={tag} />
        ))}

        {/* JSON-LD */}
        <script type="application/ld+json">
          {JSON.stringify(jsonLd)}
        </script>
      </Helmet>

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
              <span>{blog.published_at ? new Date(blog.published_at).toLocaleDateString() : "Draft"}</span>
              {blog.category && (
                <>
                  <span>•</span>
                  <Badge variant="secondary" className="capitalize">
                    {typeof blog.category === 'object' ? blog.category.name : blog.category}
                  </Badge>
                </>
              )}
              <span>•</span>
              <span>{blog.views || 0} views</span>
              {blog.reading_time && (
                <>
                  <span>•</span>
                  <span>{blog.reading_time} min read</span>
                </>
              )}
            </div>
          </div>
        </section>

        {/* Featured Image */}
        {blog.featured_image && (
          <section className="border-b px-4 py-8">
            <div className="mx-auto max-w-3xl">
              <img
                src={assetUrl(blog.featured_image)}
                alt={blog.featured_image_alt || blog.title}
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
              dangerouslySetInnerHTML={{ __html: blog.content || "" }}
            />
          </div>
        </section>

        {/* Tags */}
        {blog.tags && blog.tags.length > 0 && (
          <section className="border-t bg-muted/50 px-4 py-6">
            <div className="mx-auto max-w-3xl">
              <div className="flex flex-wrap gap-2">
                {blog.tags.map((tag: string, i: number) => (
                  <Badge key={i} variant="outline">{tag}</Badge>
                ))}
              </div>
            </div>
          </section>
        )}

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
    </>
  );
}
