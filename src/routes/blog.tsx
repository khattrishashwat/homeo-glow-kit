import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { ArrowRight, Calendar, Clock } from "lucide-react";
import { Section } from "@/components/site/Section";
import { Button } from "@/components/ui/button";
import { blogPosts, blogCategories, formatBlogDate } from "@/data/blogs";

export const Route = createFileRoute("/blog")({
  component: BlogPage,
});

export default function BlogPage() {
  const [category, setCategory] = useState("All");

  const filtered =
    category === "All"
      ? blogPosts
      : blogPosts.filter((b) => b.category === category);

  return (
    <>
      <Helmet>
        <title>Health & Wellness Blog | MD's Homeopathy</title>
        <meta
          name="description"
          content="Insights from our doctors on natural healing, women's health, nutrition and lifestyle. Read the MD's Homeopathy health journal."
        />
      </Helmet>

      {/* Hero */}
      <section className="bg-gradient-hero">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 md:py-24 text-center">
          <span className="inline-block px-4 py-1.5 rounded-full bg-card shadow-soft text-xs font-semibold text-primary uppercase tracking-wide">
            Health Journal
          </span>
          <h1 className="mt-5 font-display text-4xl md:text-6xl font-bold text-balance">
            Insights for Natural Healing
          </h1>
          <p className="mt-5 max-w-2xl mx-auto text-lg text-muted-foreground text-pretty">
            Expert advice on homeopathy, wellness, women's health and everyday
            habits for a healthier life.
          </p>
        </div>
      </section>

      <Section>
        {/* Category filter */}
        <div className="flex flex-wrap justify-center gap-2">
          {blogCategories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={
                category === cat
                  ? "rounded-full bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground shadow-soft"
                  : "rounded-full bg-card px-5 py-2 text-sm font-medium text-muted-foreground shadow-soft transition hover:text-foreground"
              }
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Blog grid */}
        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
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
      </Section>
    </>
  );
}
