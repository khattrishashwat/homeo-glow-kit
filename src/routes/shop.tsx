import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Loader2, Search, Star, ShieldCheck, Sparkles, Package } from "lucide-react";
import { Section, SectionHeader } from "@/components/site/Section";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useProducts } from "@/hooks/useProducts";
import { assetUrl, discountPercent, formatINR, productMrp, productSummary, type Product } from "@/services/api";

export const Route = createFileRoute("/shop")({
  component: ShopPage,
});

function ProductCard({ p }: { p: Product }) {
  const mrp = productMrp(p);
  const off = discountPercent(mrp, p.price);
  const image = assetUrl(p.image || p.gallery?.[0]?.url);

  return (
    <article className="group flex flex-col overflow-hidden rounded-3xl bg-card shadow-card border border-border/60 transition-all hover:-translate-y-1 hover:shadow-glow">
      <div className="relative aspect-[4/3] overflow-hidden bg-leaf-soft">
        {image ? (
          <img
            src={image}
            alt={p.image_alt || p.name}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : null}
        {off > 0 && (
          <span className="absolute top-3 left-3 rounded-full bg-destructive text-destructive-foreground text-xs font-bold px-3 py-1 shadow-soft">
            {off}% OFF
          </span>
        )}
        {p.attributes?.recommended && (
          <span className="absolute top-3 right-3 inline-flex items-center gap-1 rounded-full bg-card/95 backdrop-blur text-primary text-[10px] font-bold px-2.5 py-1 shadow-soft">
            <ShieldCheck className="h-3 w-3" /> Doctor Recommended
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-center gap-1 text-warning text-xs font-semibold">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star key={i} className="h-3.5 w-3.5 fill-current" />
          ))}
          <span className="ml-1 text-muted-foreground font-medium">(4.9)</span>
        </div>
        <h3 className="mt-2 font-display text-lg font-bold text-foreground">{p.name}</h3>
        <div className="mt-1 text-sm text-muted-foreground line-clamp-2">
          {typeof p.category === 'object' && p.category !== null ? p.category.name : p.category}
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-xl font-bold text-foreground">{formatINR(p.price)}</span>
          {mrp > p.price && (
            <span className="text-sm text-muted-foreground line-through">
              {formatINR(mrp)}
            </span>
          )}
        </div>
        <div className="mt-4 flex flex-col sm:flex-row gap-2">
          <Button asChild variant="outline" size="sm" className="flex-1">
            <Link to="/shop/$slug" params={{ slug: p.slug }}>
              View Details
            </Link>
          </Button>
          <Button asChild variant="hero" size="sm" className="flex-1">
            <Link to="/checkout" search={{ slug: p.slug }}>Buy Now</Link>
          </Button>
        </div>
      </div>
    </article>
  );
}

function ShopPage() {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("All");
  const { data, isLoading, error } = useProducts({ limit: 50 });
  const products = data?.data || [];
  const categories = useMemo(() => {
    const values = Array.from(new Set(products.map((p) => {
      const cat = p.category;
      return typeof cat === 'object' && cat !== null ? cat.name : cat;
    }).filter(Boolean))) as string[];
    return ["All", ...values];
  }, [products]);

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const productCat = typeof p.category === 'object' && p.category !== null ? p.category.name : p.category;
      const matchCat = cat === "All" || productCat === cat;
      const summary = productSummary(p);
      const matchQ =
        !q ||
        p.name.toLowerCase().includes(q.toLowerCase()) ||
        summary.toLowerCase().includes(q.toLowerCase());
      return matchCat && matchQ;
    });
  }, [products, q, cat]);

  const featured = products.filter((p) => p.featured);

   return (
     <>
       <Helmet>
         <title>Shop Homeopathy Treatment Kits | MD's Homeopathy</title>
       </Helmet>

      <Section className="pt-12 pb-8 bg-gradient-hero">
        <SectionHeader
          eyebrow="Shop"
          title="Doctor-Recommended Treatment Kits"
          subtitle="100% natural homeopathic kits, formulated by expert doctors and delivered to your door."
        />
      </Section>

      <Section className="py-10">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search packages..."
              className="pl-9 rounded-full h-11"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setCat(c)}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                  cat === c
                    ? "bg-primary text-primary-foreground shadow-soft"
                    : "bg-muted text-muted-foreground hover:bg-accent"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center gap-2 py-12 text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" /> Loading products...
          </div>
        ) : error ? (
          <p className="text-center text-destructive py-12">
            Failed to load products. Please try again later.
          </p>
        ) : filtered.length === 0 ? (
          <p className="text-center text-muted-foreground py-12">
            No products match your search.
          </p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((p) => (
              <ProductCard key={p.slug} p={p} />
            ))}
          </div>
        )}
      </Section>

      {featured.length > 0 && (
        <Section className="py-10">
          <div className="mb-6 flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            <h2 className="font-display text-2xl font-bold">Featured Packages</h2>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((p) => (
              <ProductCard key={p.slug} p={p} />
            ))}
          </div>
        </Section>
      )}
    </>
  );
}
