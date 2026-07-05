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
  BookOpen,
  User,
  Tag,
  Eye,
  Heart,
  Bookmark,
  Send,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Section } from "@/components/site/Section";
import {
  getBlogBySlug,
  getRelatedBlogs,
  getAdjacentBlogs,
  formatBlogDate,
} from "@/data/blogs";
import { useState, useEffect } from "react";

export const Route = createFileRoute("/blog_/$slug")({
  component: BlogDetailPage,
});

export default function BlogDetailPage() {
  const { slug } = Route.useParams();
  const blog = getBlogBySlug(slug);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  // Load saved states from localStorage
  useEffect(() => {
    const savedBookmarks = JSON.parse(localStorage.getItem('bookmarkedPosts') || '[]');
    const savedLikes = JSON.parse(localStorage.getItem('likedPosts') || '[]');
    setIsBookmarked(savedBookmarks.includes(slug));
    setIsLiked(savedLikes.includes(slug));
  }, [slug]);

  const handleBookmark = () => {
    const savedBookmarks = JSON.parse(localStorage.getItem('bookmarkedPosts') || '[]');
    let newBookmarks;
    if (isBookmarked) {
      newBookmarks = savedBookmarks.filter((s: string) => s !== slug);
    } else {
      newBookmarks = [...savedBookmarks, slug];
    }
    localStorage.setItem('bookmarkedPosts', JSON.stringify(newBookmarks));
    setIsBookmarked(!isBookmarked);
  };

  const handleLike = () => {
    const savedLikes = JSON.parse(localStorage.getItem('likedPosts') || '[]');
    let newLikes;
    if (isLiked) {
      newLikes = savedLikes.filter((s: string) => s !== slug);
    } else {
      newLikes = [...savedLikes, slug];
    }
    localStorage.setItem('likedPosts', JSON.stringify(newLikes));
    setIsLiked(!isLiked);
  };

  if (!blog) {
    return (
      <div className="min-h-screen bg-background px-4 py-24 text-center">
        <div className="mx-auto max-w-md">
          <div className="mb-6 text-6xl">🔍</div>
          <h1 className="font-display text-3xl font-bold text-destructive">
            Blog Post Not Found
          </h1>
          <p className="mt-4 text-muted-foreground">
            The article you are looking for does not exist or has been moved.
          </p>
          <Button asChild className="mt-6 rounded-full px-8">
            <Link to="/blog">Back to Blog</Link>
          </Button>
        </div>
      </div>
    );
  }

  const related = getRelatedBlogs(blog.slug, 3);
  const { prev, next } = getAdjacentBlogs(blog.slug);
  const shareUrl =
    typeof window !== "undefined" ? window.location.href : `/blog/${blog.slug}`;
  const shareText = encodeURIComponent(blog.title);
  const encodedUrl = encodeURIComponent(shareUrl);

  const shareLinks = [
    {
      icon: Facebook,
      label: "Facebook",
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      color: "hover:bg-[#1877f2] hover:text-white",
    },
    {
      icon: Twitter,
      label: "Twitter",
      href: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${shareText}`,
      color: "hover:bg-[#000000] hover:text-white",
    },
    {
      icon: Linkedin,
      label: "LinkedIn",
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      color: "hover:bg-[#0a66c2] hover:text-white",
    },
    {
      icon: MessageCircle,
      label: "WhatsApp",
      href: `https://wa.me/?text=${shareText}%20${encodedUrl}`,
      color: "hover:bg-[#25d366] hover:text-white",
    },
  ];

  // Calculate estimated reading time in minutes
  const readingTime = Math.ceil(blog.content.split(/\s+/).length / 200);

  return (
    <>
      <Helmet>
        <title>{blog.title} | MD's Homoeopathy</title>
        <meta name="description" content={blog.excerpt} />
        <meta property="og:title" content={blog.title} />
        <meta property="og:description" content={blog.excerpt} />
        <meta property="og:image" content={blog.featuredImage} />
        <meta property="og:type" content="article" />
        <meta name="twitter:card" content="summary_large_image" />
      </Helmet>

      <article className="bg-background">
        {/* Enhanced Header with Gradient - Fixed Spacing */}
        <header className="relative overflow-visible bg-gradient-to-br from-primary/5 via-primary/10 to-secondary/5 pb-8 md:pb-12">
          <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-5" />
          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 md:py-16">
            {/* Breadcrumb */}
            <nav aria-label="Breadcrumb" className="mb-4">
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
              className="inline-flex items-center gap-2 text-sm font-medium text-primary transition hover:gap-3 hover:underline"
            >
              <ArrowLeft className="h-4 w-4" /> Back to Blog
            </Link>

            <div className="mt-4 flex flex-wrap items-center gap-3">
              <Badge variant="secondary" className="px-4 py-1.5 text-sm">
                {blog.category}
              </Badge>
              <Badge variant="outline" className="px-4 py-1.5 text-sm">
                <Clock className="mr-1.5 h-3.5 w-3.5" />
                {readingTime} min read
              </Badge>
            </div>

            <h1 className="mt-4 font-display text-3xl md:text-5xl lg:text-6xl font-bold leading-tight text-balance">
              {blog.title}
            </h1>

            <div className="mt-6 flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <User className="h-5 w-5" />
                </div>
                <div>
                  <span className="block font-medium text-foreground">By {blog.author}</span>
                  <span className="text-xs">Author</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>{formatBlogDate(blog.publishDate)}</span>
              </div>
            </div>

            {/* Interaction Buttons */}
            <div className="mt-6 flex flex-wrap items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleLike}
                className={`gap-2 rounded-full ${isLiked ? 'border-red-500 bg-red-50 text-red-500 hover:bg-red-100' : ''}`}
              >
                <Heart className={`h-4 w-4 ${isLiked ? 'fill-red-500' : ''}`} />
                {isLiked ? 'Liked' : 'Like'}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleBookmark}
                className={`gap-2 rounded-full ${isBookmarked ? 'border-primary bg-primary/10 text-primary' : ''}`}
              >
                <Bookmark className={`h-4 w-4 ${isBookmarked ? 'fill-primary' : ''}`} />
                {isBookmarked ? 'Saved' : 'Save'}
              </Button>
              <Button variant="outline" size="sm" className="gap-2 rounded-full">
                <Send className="h-4 w-4" />
                Share
              </Button>
            </div>
          </div>
        </header>

        {/* Featured Image & Article Summary - Fixed Spacing */}
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-6 md:pt-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
            {/* Article Summary - Left Side */}
            <div className="flex items-center">
              <div className="w-full rounded-2xl border-l-4 border-primary bg-primary/5 p-6 h-full flex flex-col justify-center">
                <div className="flex items-start gap-3">
                  <BookOpen className="mt-1 h-5 w-5 flex-shrink-0 text-primary" />
                  <div>
                    <span className="text-xs font-semibold uppercase tracking-wider text-primary">
                      Article Summary
                    </span>
                    <p className="mt-1 text-lg leading-relaxed text-foreground/90">
                      {blog.excerpt}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Featured Image - Right Side */}
            <div className="relative overflow-hidden rounded-2xl shadow-2xl">
              <img
                src={blog.featuredImage}
                alt={blog.title}
                className="aspect-[16/9] w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            </div>
          </div>
        </div>

        {/* Content Section - Fixed Spacing */}
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          {/* Tags Section */}
          <div className="mb-8 flex flex-wrap gap-2">
            <span className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground">
              <Tag className="h-4 w-4" /> Tags:
            </span>
            {blog.tags.map((tag) => (
              <Badge key={tag} variant="outline" className="px-3 py-1">
                #{tag}
              </Badge>
            ))}
          </div>

          {/* Optional embedded video */}
          {blog.videoUrl && (
            <div className="mb-10 overflow-hidden rounded-2xl shadow-xl">
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

          {/* Article Content */}
          <div
            className="prose prose-lg max-w-none 
              prose-headings:font-display prose-headings:text-foreground 
              prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl
              prose-p:text-foreground/80 prose-p:leading-relaxed
              prose-li:text-foreground/80 prose-a:text-primary prose-a:no-underline hover:prose-a:underline
              prose-strong:text-foreground prose-strong:font-semibold
              prose-blockquote:border-l-primary prose-blockquote:bg-primary/5 prose-blockquote:px-6 prose-blockquote:py-3 prose-blockquote:not-italic
              prose-img:rounded-xl prose-img:shadow-lg
              prose-ul:list-disc prose-ol:list-decimal
              prose-li:marker:text-primary"
            dangerouslySetInnerHTML={{ __html: blog.content }}
          />

          {/* Share Section */}
          <div className="mt-12 rounded-2xl bg-gradient-to-r from-primary/5 to-secondary/5 p-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <Share2 className="h-5 w-5 text-primary" />
                <span className="font-semibold">Share this article</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {shareLinks.map(({ icon: Icon, label, href, color }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={`Share on ${label}`}
                    className={`grid h-10 w-10 place-items-center rounded-full bg-background text-muted-foreground shadow-sm transition-all hover:scale-110 hover:shadow-md ${color}`}
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Author Bio */}
          <div className="mt-12 rounded-2xl bg-card p-6 shadow-md">
            <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
              <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-full bg-primary/10 text-2xl font-bold text-primary">
                {blog.author.charAt(0)}
              </div>
              <div className="flex-1">
                <h3 className="font-semibold">{blog.author}</h3>
                <p className="text-sm text-muted-foreground">
                  Health & Wellness Writer at MD's Homoeopathy
                </p>
                <p className="mt-1 text-sm text-foreground/70">
                  Passionate about natural healing and holistic wellness.
                </p>
              </div>
              <Button variant="outline" size="sm" className="rounded-full">
                Follow
              </Button>
            </div>
          </div>

          {/* Previous / Next navigation */}
          {(prev || next) && (
            <div className="mt-12 grid gap-4 border-t border-border/60 pt-8 sm:grid-cols-2">
              {prev ? (
                <Link
                  to="/blog/$slug"
                  params={{ slug: prev.slug }}
                  className="group flex flex-col rounded-2xl bg-card p-6 shadow-sm transition-all hover:shadow-lg hover:-translate-y-0.5"
                >
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-primary">
                    <ArrowLeft className="h-3.5 w-3.5" /> Previous Article
                  </span>
                  <span className="mt-2 font-semibold leading-snug group-hover:text-primary line-clamp-2">
                    {prev.title}
                  </span>
                  <span className="mt-1 text-xs text-muted-foreground">
                    {formatBlogDate(prev.publishDate)}
                  </span>
                </Link>
              ) : (
                <span className="hidden sm:block" />
              )}
              {next && (
                <Link
                  to="/blog/$slug"
                  params={{ slug: next.slug }}
                  className="group flex flex-col items-end rounded-2xl bg-card p-6 text-right shadow-sm transition-all hover:shadow-lg hover:-translate-y-0.5"
                >
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-primary">
                    Next Article <ArrowRight className="h-3.5 w-3.5" />
                  </span>
                  <span className="mt-2 font-semibold leading-snug group-hover:text-primary line-clamp-2">
                    {next.title}
                  </span>
                  <span className="mt-1 text-xs text-muted-foreground">
                    {formatBlogDate(next.publishDate)}
                  </span>
                </Link>
              )}
            </div>
          )}
        </div>

        {/* Comments */}
        <Section className="pt-0 pb-4">
          <div className="mx-auto max-w-3xl">
            <BlogComments blogSlug={blog.slug} />
          </div>
        </Section>



        {/* Related Articles - Fixed Spacing */}
        {related.length > 0 && (
          <Section className="bg-gradient-to-b from-leaf-soft/30 to-background py-16 md:py-20">
            <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between">
                <h2 className="font-display text-2xl md:text-3xl font-bold">
                  Related Articles
                </h2>
                <Link
                  to="/blog"
                  className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
                >
                  View all <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
              <div className="mt-8 grid gap-6 md:grid-cols-3">
                {related.map((post) => (
                  <Link
                    key={post.slug}
                    to="/blog/$slug"
                    params={{ slug: post.slug }}
                    className="group flex flex-col overflow-hidden rounded-2xl bg-card shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl"
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
                      <Badge variant="secondary" className="self-start text-xs">
                        {post.category}
                      </Badge>
                      <h3 className="mt-2 font-semibold leading-snug group-hover:text-primary line-clamp-2">
                        {post.title}
                      </h3>
                      <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                        {post.excerpt}
                      </p>
                      <div className="mt-3 flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">
                          {formatBlogDate(post.publishDate)}
                        </span>
                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-primary">
                          Read more <ArrowRight className="h-3 w-3" />
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </Section>
        )}

        {/* Enhanced CTA - Fixed Spacing */}
        <Section className="py-16 md:py-20">
          <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-primary via-primary/90 to-secondary p-10 md:p-16 text-center shadow-2xl">
            <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
            <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/5 blur-3xl" />
            <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-white/5 blur-3xl" />
            
            <div className="relative">
              <Badge variant="secondary" className="mb-4 bg-white/20 text-white">
                Get Started Today
              </Badge>
              <h2 className="font-display text-2xl md:text-4xl lg:text-5xl font-bold text-white">
                Ready to start your healing journey?
              </h2>
              <p className="mx-auto mt-3 max-w-xl text-white/90">
                Book a consultation with our experienced homeopathic doctors and take the first step towards natural wellness.
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-4">
                <Button asChild size="lg" className="rounded-full bg-white text-primary hover:bg-white/90 hover:scale-105 transition-transform">
                  <Link to="/appointment">Book Appointment</Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="rounded-full border-white/30 bg-white/10 text-white hover:bg-white/20">
                  <Link to="/contact">Contact Us</Link>
                </Button>
              </div>
            </div>
          </div>
        </Section>
      </article>
    </>
  );
}