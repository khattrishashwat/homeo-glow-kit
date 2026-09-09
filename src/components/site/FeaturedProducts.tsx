import { Link } from "@tanstack/react-router";
import { ArrowRight, Package } from "lucide-react";
import { Section, SectionHeader } from "@/components/site/Section";
import { useProducts } from "@/hooks/useProducts";
import { assetUrl, formatINR } from "@/services/api";

export function FeaturedProducts() {
  const { data, isLoading } = useProducts({ featured: true, limit: 2 });
  const products = data?.data || [];

  if (!isLoading && products.length === 0) {
    return null;
  }

  return (
    <Section>
      <SectionHeader
        eyebrow="Featured"
        title="Featured Product Highlights"
        subtitle="Our most-loved homeopathic formulations — natural, safe and effective."
      />

      {isLoading ? (
        <div className="mt-12 grid gap-6 sm:grid-cols-2">
          {[1, 2].map((i) => (
            <div key={i} className="animate-pulse rounded-3xl border border-border bg-card p-5">
              <div className="h-64 w-full rounded-2xl bg-muted" />
              <div className="mt-4 h-6 w-1/2 rounded bg-muted" />
              <div className="mt-2 h-4 w-3/4 rounded bg-muted" />
            </div>
          ))}
        </div>
      ) : (
        <div className="mt-12 grid gap-6 sm:grid-cols-2">
          {products.map((product) => (
            <Link
              key={product.slug || product._id}
              to="/shop/$slug"
              params={{ slug: product.slug }}
              aria-label={`View ${product.name} product details`}
              className="group block overflow-hidden rounded-3xl border border-border bg-card shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-glow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <div className="overflow-hidden bg-leaf-soft aspect-[4/3] flex items-center justify-center">
                {product.image ? (
                  <img
                    src={assetUrl(product.image)}
                    alt={`${product.name} — ${product.short_description || product.name}`}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center text-muted-foreground p-8">
                    <Package className="h-12 w-12 stroke-[1.5] mb-2" />
                    <span className="text-xs">Image coming soon</span>
                  </div>
                )}
              </div>
              <div className="flex items-center justify-between gap-3 p-5">
                <div>
                  <h3 className="font-display text-lg font-bold text-foreground">{product.name}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-1">
                    {product.short_description || product.description || "Natural homeopathic formulation"}
                  </p>
                  <p className="text-sm font-semibold text-primary mt-1">
                    {formatINR(product.price)}
                  </p>
                </div>
                <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-leaf-soft px-3 py-1.5 text-xs font-semibold text-primary transition-all group-hover:gap-2">
                  View <ArrowRight className="h-3.5 w-3.5" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </Section>
  );
}
