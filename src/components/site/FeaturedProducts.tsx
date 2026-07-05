import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { Section, SectionHeader } from "@/components/site/Section";
import { featuredProducts } from "@/data/featuredProducts";

export function FeaturedProducts() {
  return (
    <Section>
      <SectionHeader
        eyebrow="Featured"
        title="Featured Product Highlights"
        subtitle="Our most-loved homeopathic formulations — natural, safe and effective."
      />

      <div className="mt-12 grid gap-6 sm:grid-cols-2">
        {featuredProducts.map((product) => (
          <Link
            key={product.slug}
            to="/shop/$slug"
            params={{ slug: product.slug }}
            aria-label={`View ${product.name} product details`}
            className="group block overflow-hidden rounded-3xl border border-border bg-card shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-glow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            <div className="overflow-hidden bg-leaf-soft">
              <img
                src={product.poster}
                alt={`${product.name} — ${product.short_description}`}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
            <div className="flex items-center justify-between gap-3 p-5">
              <div>
                <h3 className="font-display text-lg font-bold text-foreground">{product.name}</h3>
                <p className="text-sm text-muted-foreground">{product.short_description}</p>
              </div>
              <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-leaf-soft px-3 py-1.5 text-xs font-semibold text-primary transition-all group-hover:gap-2">
                View <ArrowRight className="h-3.5 w-3.5" />
              </span>
            </div>
          </Link>
        ))}
      </div>
    </Section>
  );
}
