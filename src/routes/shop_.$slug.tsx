import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import {
  Award,
  Check,
  Heart,
  MessageCircle,
  Minus,
  Plus,
  Share2,
  ShieldCheck,
  Star,
  Truck,
  Loader2,
} from "lucide-react";
import { Section } from "@/components/site/Section";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useProductBySlug, useProducts } from "@/hooks/useProducts";
import { assetUrl, discountPercent, formatINR, productMrp } from "@/services/api";
import { whatsappLink } from "@/components/site/FloatingActions";

export const Route = createFileRoute("/shop_/$slug")({
  component: ProductDetailPage,
  notFoundComponent: () => (
    <Section>
      <div className="text-center">
        <p>Product not found. <Link to="/shop" className="text-primary underline">Back to shop</Link></p>
      </div>
    </Section>
  ),
});

function ProductDetailPage() {
  const { slug } = Route.useParams();
  const { data, isLoading, error } = useProductBySlug(slug);
  const { data: relatedData } = useProducts({ limit: 6 });
  const [qty, setQty] = useState(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [wishlist, setWishlist] = useState(false);
  const [lens, setLens] = useState({ visible: false, left: 0, top: 0, x: 50, y: 50 });

  const p = data?.data;

  useEffect(() => {
    if (!p) return;
    setSelectedImageIndex(0);
  }, [p]);

  const mainImage = p ? assetUrl(p.image) : undefined;
  const gallery = p
    ? [
        mainImage,
        ...(p.gallery?.map((item) => assetUrl(item.url)) ?? []),
        ...((p as any).images?.map((img: string) => assetUrl(img)) ?? []),
      ]
        .filter(Boolean)
        .filter((value, index, self) => self.indexOf(value) === index) as string[]
    : [];

  useEffect(() => {
    if (selectedImageIndex >= gallery.length) {
      setSelectedImageIndex(0);
    }
  }, [gallery.length, selectedImageIndex]);

  if (isLoading) {
    return (
      <Section className="py-20 text-center text-muted-foreground">
        <Loader2 className="mx-auto mb-3 h-5 w-5 animate-spin" />Loading product...
      </Section>
    );
  }

  if (error || !p) {
    return (
      <Section>
        <div className="text-center">
          <p>
            Product not found. <Link to="/shop" className="text-primary underline">Back to shop</Link>
          </p>
        </div>
      </Section>
    );
  }

  const mrp = productMrp(p);
  const off = discountPercent(mrp, p.price);
  const previewImage = gallery[selectedImageIndex] || mainImage;
  const categoryName = typeof p.category === "string" ? p.category : p.category?.name || "Uncategorized";
  const rating = p.average_rating ?? 4.9;
  const reviews = p.total_reviews ?? 1240;
  const related = (relatedData?.data || []).filter((x) => x.slug !== p.slug).slice(0, 4);
  
  // Safely access attributes with fallbacks
  const benefits = p.attributes?.benefits || [];
  const ingredients = p.attributes?.ingredients || [];
  const durationWeeks = p.attributes?.durationWeeks ?? "N/A";
  const isRecommended = p.attributes?.recommended ?? false;
  const usage = p.attributes?.usage || "Use as directed by the doctor after consultation.";

  const specs = [
    { label: "Category", value: categoryName },
    { label: "Course Duration", value: durationWeeks === "N/A" ? "N/A" : `${durationWeeks} weeks` },
    { label: "Availability", value: p.in_stock ? `${p.stock ?? "Many"} available` : "Out of stock" },
    { label: "SKU", value: p.sku || p.slug.toUpperCase() },
  ];

  const handleImageMouseMove = (event: any) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;
    setLens({ visible: true, left: event.clientX - rect.left - 72, top: event.clientY - rect.top - 72, x, y });
  };

  return (
    <>
      <Helmet>
        <title>{p.name}</title>
      </Helmet>

      <Section className="pt-10 pb-6">
        <nav className="text-xs text-muted-foreground mb-6 flex flex-wrap items-center gap-2">
          <Link to="/" className="hover:text-foreground">Home</Link>
          <span>/</span>
          <Link to="/shop" className="hover:text-foreground">Shop</Link>
          <span>/</span>
          <span className="text-foreground">{p.name}</span>
        </nav>

        <div className="grid gap-10 xl:grid-cols-[1.1fr_0.95fr]">
          <div className="space-y-6">
            <div className="group relative overflow-hidden rounded-[2rem] border border-border bg-leaf-soft">
              <div
                className="relative aspect-[4/3] overflow-hidden bg-slate-50 cursor-zoom-in"
                onMouseMove={handleImageMouseMove}
                onMouseEnter={() => setLens((current) => ({ ...current, visible: true }))}
                onMouseLeave={() => setLens((current) => ({ ...current, visible: false }))}
              >
                <img
                  src={previewImage}
                  alt={p.image_alt || p.name}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />

                <div
                  className={`pointer-events-none absolute inset-0 rounded-[2rem] transition-opacity duration-300 ${lens.visible ? "opacity-100" : "opacity-0"}`}
                  style={{
                    boxShadow: lens.visible ? "inset 0 0 0 9999px rgba(0,0,0,0.04)" : "none",
                  }}
                />

                <div
                  className={`pointer-events-none absolute z-10 h-36 w-36 rounded-full border border-white/80 bg-white/10 shadow-2xl transition-opacity duration-300 ${lens.visible ? "opacity-100" : "opacity-0"}`}
                  style={{
                    left: `${lens.left}px`,
                    top: `${lens.top}px`,
                    backgroundImage: `url(${previewImage})`,
                    backgroundSize: "220%",
                    backgroundPosition: `${lens.x}% ${lens.y}%`,
                    backgroundRepeat: "no-repeat",
                  }}
                />

                <div className="absolute bottom-4 left-4 hidden items-center gap-2 rounded-full bg-background/90 px-3 py-2 text-xs text-muted-foreground shadow-soft md:flex">
                  <span className="font-semibold">Hover to zoom</span>
                  <span className="inline-flex h-2.5 w-2.5 rounded-full bg-primary" />
                </div>
              </div>
            </div>

            {gallery.length > 1 && (
              <div className="grid grid-cols-4 gap-3">
                {gallery.map((src, index) => (
                  <button
                    key={src}
                    type="button"
                    onClick={() => setSelectedImageIndex(index)}
                    className={`aspect-square overflow-hidden rounded-3xl border transition ${selectedImageIndex === index ? "border-primary" : "border-border hover:border-primary"}`}
                  >
                    <img src={src} alt={`${p.name} preview ${index + 1}`} className="h-full w-full object-cover transition duration-300" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <aside className="lg:sticky lg:top-24">
            <div className="rounded-[2rem] border border-border bg-card p-8">
              <div className="flex flex-wrap items-center gap-3 text-sm">
                <span className="rounded-full bg-leaf-soft px-3 py-1 font-semibold text-foreground">{categoryName}</span>
                {isRecommended && (
                  <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                    <ShieldCheck className="h-4 w-4" /> Doctor Recommended
                  </span>
                )}
              </div>

              <h1 className="mt-6 text-3xl font-display font-bold leading-tight text-foreground md:text-4xl">{p.name}</h1>

              <div className="mt-5 flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-1 text-warning">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <Star key={index} className="h-4 w-4 fill-current" />
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">{rating.toFixed(1)} / 5</span>
                <span className="text-sm text-muted-foreground">({reviews} reviews)</span>
              </div>

              <div className="mt-6 flex flex-wrap items-end gap-3">
                <div>
                  <p className="text-4xl font-bold text-foreground">{formatINR(p.price)}</p>
                  {mrp > p.price && (
                    <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                      <span className="line-through">{formatINR(mrp)}</span>
                      <span className="rounded-full bg-destructive/10 px-2 py-1 text-xs font-semibold text-destructive">{off}% OFF</span>
                    </div>
                  )}
                </div>
                <span className={`rounded-full px-3 py-1 text-sm font-semibold ${p.in_stock ? "bg-emerald-500/10 text-emerald-700" : "bg-destructive/10 text-destructive"}`}>
                  {p.in_stock ? "In Stock" : "Out of Stock"}
                </span>
              </div>

              <div className="mt-6 flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-2 rounded-full border border-border bg-leaf-soft px-4 py-2">
                  <span className="text-sm font-semibold">Qty</span>
                  <button
                    type="button"
                    onClick={() => setQty(Math.max(1, qty - 1))}
                    className="rounded-full p-2 text-muted-foreground transition hover:bg-accent"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="w-10 text-center font-semibold">{qty}</span>
                  <button
                    type="button"
                    onClick={() => setQty(Math.min(p.stock ?? 20, qty + 1))}
                    className="rounded-full p-2 text-muted-foreground transition hover:bg-accent"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
                <span className="text-sm text-muted-foreground">{p.stock ?? "20"} available</span>
              </div>

              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                <Button asChild variant="hero" size="lg" className="w-full" disabled={!p.in_stock}>
                  <Link to="/checkout" search={{ slug: p.slug, qty }}>
                    Buy Now
                  </Link>
                </Button>
              </div>

              <div className="mt-4 flex flex-wrap gap-3">
                <Button asChild variant="outline" size="sm" className="flex-1 min-w-[10rem]">
                  <a href={whatsappLink(`Hi, I want to know more about ${p.name}.`)} target="_blank" rel="noreferrer">
                    <MessageCircle className="mr-2 h-4 w-4" /> Chat
                  </a>
                </Button>
              </div>

              <div className="mt-6 rounded-[1.75rem] border border-border bg-leaf-soft p-5 text-sm text-muted-foreground">
                <div className="flex items-center gap-3">
                  <Check className="h-4 w-4 text-emerald-500" />
                  <span>Doctor-formulated homeopathy kit.</span>
                </div>
                <div className="mt-3 flex items-center gap-3">
                  <Truck className="h-4 w-4 text-primary" />
                  <span>Ready to ship across India.</span>
                </div>
                <div className="mt-3 flex items-center gap-3">
                  <Award className="h-4 w-4 text-warning" />
                  <span>Trusted by thousands of patients.</span>
                </div>
              </div>

              <div className="mt-6 flex items-center gap-3 text-sm text-muted-foreground">
                <Share2 className="h-4 w-4" />
                <span>Share this product with your family and friends.</span>
              </div>
            </div>
          </aside>
        </div>
      </Section>

      <Section className="py-10">
        <div className="grid gap-8 xl:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-6">
            <div className="rounded-[2rem] border border-border bg-card p-8">
              <h2 className="font-display text-2xl font-bold">Product Overview</h2>
              {p.description ? (
                <div 
                  className="mt-4 prose prose-sm prose-gray max-w-none [&_ul]:list-disc [&_ul]:pl-5 [&_li]:mb-1 [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:mt-4 [&_h3]:mb-2 [&_strong]:text-foreground"
                  dangerouslySetInnerHTML={{ __html: p.description }}
                />
              ) : (
                <p className="mt-4 text-sm leading-7 text-muted-foreground">
                  No description available.
                </p>
              )}
              
              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                <div className="rounded-3xl bg-leaf-soft p-5">
                  <h3 className="text-base font-semibold">Category</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{categoryName}</p>
                </div>
                <div className="rounded-3xl bg-leaf-soft p-5">
                  <h3 className="text-base font-semibold">Duration</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{durationWeeks === "N/A" ? "N/A" : `${durationWeeks} weeks`}</p>
                </div>
                <div className="rounded-3xl bg-leaf-soft p-5">
                  <h3 className="text-base font-semibold">Recommended</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{isRecommended ? "Doctor recommended" : "Natural formula"}</p>
                </div>
                <div className="rounded-3xl bg-leaf-soft p-5">
                  <h3 className="text-base font-semibold">Stock</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{p.in_stock ? `${p.stock ?? 0} units available` : "Out of stock"}</p>
                </div>
              </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              {benefits.length > 0 && (
                <div className="rounded-[2rem] border border-border bg-card p-8">
                  <h2 className="font-display text-2xl font-bold">Benefits</h2>
                  <ul className="mt-5 space-y-3">
                    {benefits.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-3 text-sm text-muted-foreground">
                        <span className="mt-1 inline-flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600">✓</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {ingredients.length > 0 && (
                <div className="rounded-[2rem] border border-border bg-card p-8">
                  <h2 className="font-display text-2xl font-bold">Ingredients</h2>
                  <ul className="mt-5 space-y-3 text-sm text-muted-foreground">
                    {ingredients.map((item, idx) => (
                      <li key={idx} className="rounded-2xl bg-leaf-soft p-4">{item}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          <aside className="space-y-6">
            <div className="rounded-[2rem] border border-border bg-card p-8">
              <h2 className="font-display text-2xl font-bold">Specifications</h2>
              <dl className="mt-6 space-y-4 text-sm text-muted-foreground">
                {specs.map((spec) => (
                  <div key={spec.label} className="grid gap-1">
                    <dt className="font-medium text-foreground">{spec.label}</dt>
                    <dd>{spec.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </aside>
        </div>
      </Section>

      {related.length > 0 && (
        <Section className="py-10">
          <h2 className="font-display text-2xl font-bold mb-6">Related Products</h2>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((r) => (
              <Link
                key={r.slug}
                to="/shop/$slug"
                params={{ slug: r.slug }}
                className="group overflow-hidden rounded-[1.75rem] border border-border bg-card transition hover:-translate-y-1"
              >
                <div className="aspect-[4/3] overflow-hidden bg-leaf-soft">
                  {assetUrl(r.image || (r as any).images?.[0]) && (
                    <img
                      src={assetUrl(r.image || (r as any).images?.[0])}
                      alt={r.name}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                  )}
                </div>
                <div className="space-y-2 p-4">
                  <div className="text-sm font-semibold text-foreground">{r.name}</div>
                  <div className="text-sm font-bold text-primary">{formatINR(r.price)}</div>
                </div>
              </Link>
            ))}
          </div>
        </Section>
      )}
    </>
  );
}