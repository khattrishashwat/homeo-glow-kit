import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { ArrowRight, Calendar, Clock, Loader2, Search } from "lucide-react";
import { Section } from "@/components/site/Section";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import heroBg from "@/assets/hero-clinic-bg.jpg";
import { blogPosts, blogCategories, formatBlogDate } from "@/data/blogs";
import { useBlogs } from "@/hooks/useBlogs";
import { assetUrl } from "@/services/api";

export const Route = createFileRoute("/blog")({
  component: BlogPage,
});

export default function BlogPage() {
  const [q, setQ] = useState("");
  const [category, setCategory] = useState("All");

  const { data: blogResponse, isLoading, error } = useBlogs({ limit: 50 });
  const backendBlogs = blogResponse?.data || [];

  const allBlogs = useMemo(() => {
    if (backendBlogs.length > 0) {
      return backendBlogs.map((b) => ({
        slug: b.slug,
        title: b.title,
        excerpt: b.excerpt,
        category: typeof b.category === "object" && b.category ? b.category.name : (b.category as string) || "General",
        featuredImage: b.featured_image ? assetUrl(b.featured_image) : "/placeholder.jpg",
        publishDate: b.published_at || b.createdAt || new Date().toISOString(),
        readingTime: b.reading_time || 5,
      }));
    }
    return blogPosts;
  }, [backendBlogs]);

  const categories = useMemo(() => {
    const fromBlogs = Array.from(new Set(allBlogs.map((b) => b.category).filter(Boolean)));
    return ["All", ...Array.from(new Set([...fromBlogs, ...blogCategories.filter((c) => c !== "All")]))];
  }, [allBlogs]);

  const filtered = useMemo(() => {
    return allBlogs.filter((b) => {
      const matchCat = category === "All" || b.category.toLowerCase() === category.toLowerCase();
      const matchQ =
        !q ||
        b.title.toLowerCase().includes(q.toLowerCase()) ||
        b.excerpt.toLowerCase().includes(q.toLowerCase());
      return matchCat && matchQ;
    });
  }, [allBlogs, category, q]);

  return (
    <>
      <Helmet>
        <title>Health & Wellness Blog | MD's Homoeopathy </title>
        <meta
          name="description"
          content="Insights from our doctors on natural healing, women's health, nutrition and lifestyle. Read the MD's Homoeopathy  health journal."
        />
      </Helmet>

      {/* HERO SECTION WITH HOMEPAGE EXACT BACKGROUND */}
      <section className="relative overflow-hidden">
        {/* 1. Background image */}
        <div
          className="absolute inset-0 bg-cover bg-bottom bg-no-repeat"
          style={{ backgroundImage: `url(${heroBg})` }}
        />
        {/* 2. Soft Gradient overlay for readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-background/85 via-background/75 to-background/60" />

        {/* 3. Hero Content */}
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 md:py-24 text-center">
          <span className="inline-block px-4 py-1.5 rounded-full bg-leaf-soft/80 shadow-soft text-xs font-semibold text-primary uppercase tracking-wide">
            Health Journal
          </span>
          <h1 className="mt-5 font-display text-4xl md:text-6xl font-bold text-balance text-foreground">
            Insights for Natural Healing
          </h1>
          <p className="mt-5 max-w-2xl mx-auto text-lg text-muted-foreground text-pretty">
            Expert advice on Homoeopathy , wellness, women's health and everyday
            habits for a healthier life.
          </p>
        </div>
      </section>

      <Section className="py-10">
        {/* Search and Category filter */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search articles..."
              className="pl-9 rounded-full h-11"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                  category.toLowerCase() === cat.toLowerCase()
                    ? "bg-primary text-primary-foreground shadow-soft"
                    : "bg-muted text-muted-foreground hover:bg-accent"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Loading state */}
        {isLoading && !allBlogs.length ? (
          <div className="flex items-center justify-center gap-2 py-16 text-muted-foreground">
            <Loader2 className="h-5 w-5 animate-spin" /> Loading articles...
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-16 text-center text-muted-foreground">
            No articles match your search or filter.
          </div>
        ) : (
          /* Blog grid */
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filtered.map((blog) => (
              <article
                key={blog.slug}
                className="group flex flex-col overflow-hidden rounded-3xl bg-card shadow-soft transition hover:-translate-y-1 hover:shadow-card"
              >
                <Link
                  to="/blog/$slug"
                  params={{ slug: blog.slug }}
                  className="relative block aspect-[16/10] overflow-hidden"
                >
                  <img
                    src={blog.featuredImage}
                    alt={blog.title}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <span className="absolute left-4 top-4 rounded-full bg-card/90 px-3 py-1 text-xs font-semibold text-primary shadow-soft backdrop-blur">
                    {blog.category}
                  </span>
                </Link>
                <div className="flex flex-1 flex-col p-5">
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="inline-flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5" />
                      {formatBlogDate(blog.publishDate)}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" />
                      {blog.readingTime} min
                    </span>
                  </div>
                  <h2 className="mt-3 font-display text-lg font-bold leading-snug group-hover:text-primary">
                    <Link to="/blog/$slug" params={{ slug: blog.slug }}>
                      {blog.title}
                    </Link>
                  </h2>
                  <p className="mt-2 flex-1 text-sm text-muted-foreground line-clamp-3">
                    {blog.excerpt}
                  </p>
                  <Button
                    asChild
                    variant="outline"
                    size="sm"
                    className="mt-5 w-fit rounded-full"
                  >
                    <Link to="/blog/$slug" params={{ slug: blog.slug }}>
                      Read More <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </article>
            ))}
          </div>
        )}
      </Section>
    </>
  );
}