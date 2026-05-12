import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Helmet } from "react-helmet-async";
import {
  Check,
  ShieldCheck,
  Truck,
  Award,
  MessageCircle,
  Minus,
  Plus,
  Star,
  Loader2,
} from "lucide-react";
import { Section } from "@/components/site/Section";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useProductBySlug, useProducts } from "@/hooks/useProducts";
import { assetUrl, discountPercent, formatINR, productMrp, productSummary } from "@/services/api";
import { whatsappLink } from "@/components/site/FloatingActions";

export const Route = createFileRoute("/shop/$slug")({
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
  const { data: relatedData } = useProducts({ limit: 4 });
  const [qty, setQty] = useState(1);

  const p = data?.data;

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
          <p>Product not found. <Link to="/shop" className="text-primary underline">Back to shop</Link></p>
        </div>
      </Section>
    );
  }

  const mrp = productMrp(p);
  const off = discountPercent(mrp, p.price);
  const mainImage = assetUrl(p.image);
  // Handle gallery - combine main image with additional images if any
  const additionalImages = (p as any).images || [];
  const gallery = [mainImage, ...additionalImages.map((img: string) => assetUrl(img))].filter(Boolean);
  const related = (relatedData?.data || []).filter((x) => x.slug !== p.slug).slice(0, 3);
  const benefits = p.attributes?.benefits || [];
  const ingredients = p.attributes?.ingredients || [];
  const faqs = p.attributes?.faqs || [];

  // SEO Data
  const siteUrl = "https://mdshomeopathy.com"; // Replace with actual site URL
  const productUrl = `${siteUrl}/shop/${p.slug}`;
  const seoTitle = p.seo_title || p.name;
  const seoDescription = p.seo_description || p.short_description || p.description || productSummary(p);
  const seoKeywords = p.seo_keywords?.join(", ") || "";
  const ogImage = assetUrl(p.og_image || p.image);
  const canonicalUrl = p.canonical_url || productUrl;

  // JSON-LD Schema
  const jsonLd = {
    "@context": "https://schema.org/",
    "@type": "Product",
    name: p.name,
    image: ogImage,
    description: seoDescription,
    sku: p.sku,
    category: p.category?.name || "Health",
    offers: {
      "@type": "Offer",
      price: p.price,
      priceCurrency: "INR",
      availability: p.in_stock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      priceValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: p.average_rating || 4.9,
      reviewCount: p.total_reviews || 0,
    },
  };

  return (
    <>
      <Helmet>
        <title>{seoTitle}</title>
        <meta name="description" content={seoDescription} />
        {seoKeywords && <meta name="keywords" content={seoKeywords} />}
        <link rel="canonical" href={canonicalUrl} />

        {/* OpenGraph */}
        <meta property="og:title" content={seoTitle} />
        <meta property="og:description" content={seoDescription} />
        <meta property="og:image" content={ogImage} />
        <meta property="og:url" content={productUrl} />
        <meta property="og:type" content="product" />
        <meta property="og:site_name" content="MD's Homeopathy" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={seoTitle} />
        <meta name="twitter:description" content={seoDescription} />
        <meta name="twitter:image" content={ogImage} />

        {/* JSON-LD */}
        <script type="application/ld+json">
          {JSON.stringify(jsonLd)}
        </script>
      </Helmet>

      <Section className="pt-10 pb-6">
        {/* Breadcrumb */}
        <nav className="text-xs text-muted-foreground mb-6 flex items-center space-x-2">
          <Link to="/" className="hover:text-foreground">Home</Link>
          <span>/</span>
          <Link to="/shop" className="hover:text-foreground">Shop</Link>
          <span>/</span>
          <span className="text-foreground">{p.name}</span>
        </nav>

        <div className="grid lg:grid-cols-2 gap-10">
         {/* Product Images */}
         <div>
           <div className="aspect-square overflow-hidden rounded-3xl bg-leaf-soft shadow-card">
             {mainImage ? (
               <img
                 src={mainImage}
                 alt={p.image_alt || p.name}
                 className="h-full w-full object-cover"
               />
             ) : null}
           </div>
           {gallery.length > 1 && (
             <div className="mt-4 grid grid-cols-4 gap-3">
               {gallery.slice(0, 4).map((src, i) => (
                 <div key={i} className="aspect-square overflow-hidden rounded-xl bg-leaf-soft border border-border">
                   <img
                     src={src}
                     alt={`${p.name} - Image ${i + 1}`}
                     className="h-full w-full object-cover opacity-80"
                   />
                 </div>
               ))}
             </div>
           )}
         </div>

          {/* Product Info */}
          <div>
            {p.attributes?.recommended && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-leaf-soft text-primary text-xs font-bold px-3 py-1.5 mb-4">
                <ShieldCheck className="h-3.5 w-3.5" /> Doctor Recommended
              </span>
            )}
            <h1 className="font-display text-3xl md:text-4xl font-bold">{p.name}</h1>

            <div className="mt-3 flex items-center gap-2">
              <div className="flex text-warning">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-current" />
                ))}
              </div>
              <span className="text-sm text-muted-foreground">
                4.9 ({p.total_reviews || 1240} reviews)
              </span>
            </div>

            <p className="mt-4 text-muted-foreground">
              {p.description || productSummary(p)}
            </p>

            <div className="mt-6 flex items-baseline gap-3">
              <span className="text-3xl font-bold text-primary">{formatINR(p.price)}</span>
              {mrp > p.price && (
                <>
                  <span className="text-lg text-muted-foreground line-through">{formatINR(mrp)}</span>
                  <span className="rounded-full bg-destructive text-destructive-foreground text-xs font-bold px-2.5 py-1">
                    {off}% OFF
                  </span>
                </>
              )}
            </div>

            <div className="mt-6 grid grid-cols-3 gap-3">
              {[
                { icon: ShieldCheck, label: "Safe & Natural" },
                { icon: Truck, label: p.stock > 0 ? "In Stock" : "Out of Stock" },
                { icon: Award, label: `${p.attributes?.durationWeeks || 8}wk Course` },
              ].map((b) => (
                <div key={b.label} className="rounded-2xl bg-card border border-border p-3 text-center shadow-soft">
                  <b.icon className="mx-auto h-5 w-5 text-primary" />
                  <div className="mt-1 text-xs font-semibold">{b.label}</div>
                </div>
              ))}
            </div>

            {/* Quantity Selector */}
            {p.in_stock && (
              <div className="mt-6 flex items-center gap-3">
                <span className="text-sm font-semibold">Quantity</span>
                <div className="flex items-center rounded-full border border-border">
                  <button
                    onClick={() => setQty(Math.max(1, qty - 1))}
                    className="p-2 hover:bg-accent rounded-l-full"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="w-10 text-center text-sm font-bold">{qty}</span>
                  <button
                    onClick={() => setQty(Math.min(p.stock || 20, qty + 1))}
                    className="p-2 hover:bg-accent rounded-r-full"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
                <span className="text-xs text-muted-foreground">({p.stock} available)</span>
              </div>
            )}

            {/* CTA Buttons */}
            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <Button asChild variant="hero" size="lg" className="flex-1" disabled={!p.in_stock}>
                <Link to="/checkout" search={{ slug: p.slug, qty }}>
                  {p.in_stock ? "Buy Now" : "Out of Stock"}
                </Link>
              </Button>
              <Button asChild variant="whatsapp" size="lg" className="flex-1">
                <a
                  href={whatsappLink(`Hi, I want to know more about ${p.name}.`)}
                  target="_blank"
                  rel="noreferrer"
                >
                  <MessageCircle className="h-4 w-4" /> WhatsApp
                </a>
              </Button>
            </div>
          </div>
        </div>
      </Section>

      {/* Benefits & Ingredients */}
      <Section className="py-10">
        <div className="grid lg:grid-cols-2 gap-8">
          <div className="rounded-3xl bg-card shadow-card border border-border p-7">
            <h2 className="font-display text-2xl font-bold">Benefits</h2>
            <ul className="mt-5 space-y-3">
              {benefits.map((b: string) => (
                <li key={b} className="flex items-start gap-3">
                  <span className="mt-0.5 grid h-6 w-6 place-items-center rounded-full bg-leaf-soft text-primary">
                    <Check className="h-3.5 w-3.5" />
                  </span>
                  <span className="text-sm">{b}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-3xl bg-card shadow-card border border-border p-7">
            <h2 className="font-display text-2xl font-bold">Ingredients</h2>
            <ul className="mt-5 grid grid-cols-2 gap-3">
              {ingredients.map((i: string) => (
                <li key={i} className="rounded-xl bg-leaf-soft/60 px-3 py-2 text-sm font-medium text-foreground">
                  {i}
                </li>
              ))}
            </ul>
            <h3 className="mt-6 font-display text-lg font-bold">Usage Instructions</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              {p.attributes?.usage || "Use as directed by the doctor after consultation."}
            </p>
          </div>
        </div>
      </Section>

      {/* FAQs */}
      {faqs.length > 0 && (
        <Section className="py-10">
          <h2 className="font-display text-2xl font-bold mb-6">Frequently Asked Questions</h2>
          <Accordion type="single" collapsible className="rounded-3xl bg-card border border-border shadow-card px-6">
            {faqs.map((f: { q: string; a: string }, i: number) => (
              <AccordionItem key={i} value={`q-${i}`}>
                <AccordionTrigger className="text-left">{f.q}</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">{f.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Section>
      )}

      {/* Related Products */}
      {related.length > 0 && (
        <Section className="py-10">
          <h2 className="font-display text-2xl font-bold mb-6">Related Products</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {related.map((r) => (
              <Link
                key={r.slug}
                to="/shop/$slug"
                params={{ slug: r.slug }}
                className="group rounded-2xl overflow-hidden bg-card border border-border shadow-soft hover:shadow-glow transition"
              >
                <div className="aspect-[4/3] bg-leaf-soft overflow-hidden">
                  {assetUrl(r.image || (r as any).images?.[0]) && (
                    <img
                      src={assetUrl(r.image || (r as any).images?.[0])}
                      alt={r.name}
                      className="h-full w-full object-cover transition-transform group-hover:scale-105"
                    />
                  )}
                </div>
                <div className="p-4">
                  <div className="font-semibold">{r.name}</div>
                  <div className="mt-1 text-sm text-primary font-bold">{formatINR(r.price)}</div>
                </div>
              </Link>
            ))}
          </div>
        </Section>
      )}
    </>
  );
}
