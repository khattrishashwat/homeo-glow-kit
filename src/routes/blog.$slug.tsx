import { createFileRoute, Link } from "@tanstack/react-router";
import { Helmet } from "react-helmet-async";
import {
  ArrowLeft,
  ArrowRight,
  Calendar,
  ChevronRight,
  Clock,
  Facebook,
  Linkedin,
  Twitter,
  Share2,
  MessageCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Section } from "@/components/site/Section";
import {
  getBlogBySlug,
  getRelatedBlogs,
  formatBlogDate,
} from "@/data/blogs";

export const Route = createFileRoute("/blog/$slug")({
  component: BlogDetailPage,
});

export default function BlogDetailPage() {
  const { slug } = Route.useParams();
  const blog = getBlogBySlug(slug);

  if (!blog) {
    return (
      <div className="min-h-screen bg-background px-4 py-24 text-center">
        <h1 className="font-display text-3xl font-bold text-destructive">
          Blog Post Not Found
        </h1>
        <p className="mt-4 text-muted-foreground">
          The article you are looking for does not exist.
        </p>
        <Button asChild className="mt-6 rounded-full">
          <Link to="/blog">Back to Blog</Link>
        </Button>
      </div>
    );
  }

  const related = getRelatedBlogs(blog.slug, 3);
  const shareUrl =
    typeof window !== "undefined" ? window.location.href : `/blog/${blog.slug}`;
  const shareText = encodeURIComponent(blog.title);
  const encodedUrl = encodeURIComponent(shareUrl);

  const shareLinks = [
    {
      icon: Facebook,
      label: "Facebook",
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    },
    {
      icon: Twitter,
      label: "Twitter",
      href: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${shareText}`,
    },
    {
      icon: Linkedin,
      label: "LinkedIn",
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    },
    {
      icon: MessageCircle,
      label: "WhatsApp",
      href: `https://wa.me/?text=${shareText}%20${encodedUrl}`,
    },
  ];

  return (
    <>
      <Helmet>
        <title>{blog.title} | MD's Homeopathy</title>
        <meta name="description" content={blog.excerpt} />
      </Helmet>

      <article className="bg-background">
        {/* Header */}
        <section className="bg-gradient-hero">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 pt-10 pb-8">
            {/* Breadcrumb */}
            <nav aria-label="Breadcrumb">
              <ol className="flex flex-wrap items-center gap-1.5 text-sm text-muted-foreground">
                <li>
                  <Link to="/" className="transition hover:text-primary">
                    Home
                  </Link>
                </li>
                <ChevronRight className="h-3.5 w-3.5" aria-hidden />
                <li>
                  <Link to="/blog" className="transition hover:text-primary">
                    Blog
                  </Link>
                </li>
                <ChevronRight className="h-3.5 w-3.5" aria-hidden />
                <li className="font-medium text-foreground line-clamp-1" aria-current="page">
                  {blog.title}
                </li>
              </ol>
            </nav>
            <Link
              to="/blog"
              className="mt-5 inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
            >
              <ArrowLeft className="h-4 w-4" /> Back to Blog
            </Link>
            <Badge variant="secondary" className="mt-6">
              {blog.category}
            </Badge>
            <h1 className="mt-4 font-display text-3xl md:text-5xl font-bold leading-tight text-balance">
              {blog.title}
            </h1>
            <div className="mt-5 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <span>By {blog.author}</span>
              <span className="inline-flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {formatBlogDate(blog.publishDate)}
              </span>
              <span className="inline-flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {blog.readingTime} min read
              </span>
            </div>
          </div>
        </section>

        {/* Featured image */}
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 -mt-2">
          <img
            src={blog.featuredImage}
            alt={blog.title}
            className="aspect-[16/9] w-full rounded-3xl object-cover shadow-card"
          />
        </div>

        {/* Body */}
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-12">
          <div className="mb-8 rounded-2xl bg-leaf-soft/50 p-6">
            <p className="text-lg italic text-foreground/90">{blog.excerpt}</p>
          </div>

          {/* Optional embedded video */}
          {blog.videoUrl && (
            <div className="mb-10 overflow-hidden rounded-3xl shadow-card">
              <div className="aspect-video">
                <iframe
                  src={blog.videoUrl}
                  title={`${blog.title} video`}
                  className="h-full w-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </div>
          )}

          <div
            className="prose prose-lg max-w-none prose-headings:font-display prose-headings:text-foreground prose-p:text-foreground/80 prose-li:text-foreground/80 prose-a:text-primary"
            dangerouslySetInnerHTML={{ __html: blog.content }}
          />

          {/* Tags */}
          <div className="mt-10 flex flex-wrap gap-2">
            {blog.tags.map((tag) => (
              <Badge key={tag} variant="outline">
                #{tag}
              </Badge>
            ))}
          </div>

          {/* Share */}
          <div className="mt-10 flex flex-wrap items-center gap-3 border-t border-border/60 pt-6">
            <span className="inline-flex items-center gap-2 text-sm font-semibold">
              <Share2 className="h-4 w-4 text-primary" /> Share this article
            </span>
            {shareLinks.map(({ icon: Icon, label, href }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noreferrer"
                aria-label={`Share on ${label}`}
                className="grid h-10 w-10 place-items-center rounded-full bg-card text-muted-foreground shadow-soft transition hover:text-primary hover:shadow-glow"
              >
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>

        {/* Related */}
        {related.length > 0 && (
          <Section className="bg-leaf-soft/30">
            <h2 className="font-display text-2xl md:text-3xl font-bold">
              Related Articles
            </h2>
            <div className="mt-8 grid gap-6 md:grid-cols-3">
              {related.map((post) => (
                <Link
                  key={post.slug}
                  to="/blog/$slug"
                  params={{ slug: post.slug }}
                  className="group flex flex-col overflow-hidden rounded-3xl bg-card shadow-soft transition hover:-translate-y-1 hover:shadow-card"
                >
                  <div className="aspect-[16/10] overflow-hidden">
                    <img
                      src={post.featuredImage}
                      alt={post.title}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="flex flex-1 flex-col p-5">
                    <span className="text-xs font-semibold text-primary">
                      {post.category}
                    </span>
                    <h3 className="mt-2 font-semibold leading-snug group-hover:text-primary">
                      {post.title}
                    </h3>
                    <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-primary">
                      Read more <ArrowRight className="h-3 w-3" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </Section>
        )}

        {/* CTA */}
        <Section>
          <div className="rounded-[2.5rem] bg-gradient-leaf p-10 md:p-14 text-center shadow-glow">
            <h2 className="font-display text-2xl md:text-4xl font-bold text-primary-foreground">
              Ready to start your healing journey?
            </h2>
            <p className="mt-3 text-primary-foreground/90">
              Book a consultation with our experienced homeopathic doctors.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Button asChild size="xl" className="bg-card text-primary hover:bg-card/90">
                <Link to="/appointment">Book Appointment</Link>
              </Button>
              <Button asChild size="xl" variant="whatsapp">
                <Link to="/contact">Contact Us</Link>
              </Button>
            </div>
          </div>
        </Section>
      </article>
    </>
  );
}
