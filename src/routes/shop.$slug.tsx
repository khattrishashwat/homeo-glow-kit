import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Check, ShieldCheck, Truck, Award, MessageCircle, Minus, Plus, Star, Loader2 } from "lucide-react";
import { Section } from "@/components/site/Section";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useProductBySlug, useProducts } from "@/hooks/useProducts";
import { assetUrl, discountPercent, formatINR, productMrp, productSummary } from "@/services/api";
import { whatsappLink } from "@/components/site/FloatingActions";

export const Route = createFileRoute("/shop/$slug")({
  head: () => ({ meta: [{ title: "Treatment Kit | MD's Homeopathy" }] }),
  component: ProductDetailPage,
  notFoundComponent: () => (
    <Section><p className="text-center">Product not found. <Link to="/shop" className="text-primary underline">Back to shop</Link></p></Section>
  ),
});

function ProductDetailPage() {
  const { slug } = Route.useParams();
  const { data, isLoading, error } = useProductBySlug(slug);
  const { data: relatedData } = useProducts({ limit: 4 });
  const [qty, setQty] = useState(1);
  const p = data?.data;

  if (isLoading) {
    return <Section className="py-20 text-center text-muted-foreground"><Loader2 className="mx-auto mb-3 h-5 w-5 animate-spin" />Loading product...</Section>;
  }

  if (error || !p) {
    return <Section><p className="text-center">Product not found. <Link to="/shop" className="text-primary underline">Back to shop</Link></p></Section>;
  }

  const mrp = productMrp(p);
  const off = discountPercent(mrp, p.price);
  const image = assetUrl(p.image || p.images?.[0]);
  const gallery = [p.image, ...(p.images || [])].filter(Boolean).map((src) => assetUrl(src));
  const related = (relatedData?.data || []).filter((x) => x.slug !== p.slug).slice(0, 3);
  const benefits = p.attributes?.benefits || [];
  const ingredients = p.attributes?.ingredients || [];
  const faqs = p.attributes?.faqs || [];

  return (
    <>
      <Section className="pt-10 pb-6">
        <nav className="text-xs text-muted-foreground mb-6">
          <Link to="/" className="hover:text-foreground">Home</Link> /{" "}
          <Link to="/shop" className="hover:text-foreground">Shop</Link> /{" "}
          <span className="text-foreground">{p.name}</span>
        </nav>

        <div className="grid lg:grid-cols-2 gap-10">
          <div>
            <div className="aspect-square overflow-hidden rounded-3xl bg-leaf-soft shadow-card">
              {image ? <img src={image} alt={p.name} className="h-full w-full object-cover" /> : null}
            </div>
            <div className="mt-4 grid grid-cols-4 gap-3">
              {(gallery.length ? gallery : [image]).slice(0, 4).map((src, i) => (
                <div key={i} className="aspect-square overflow-hidden rounded-xl bg-leaf-soft border border-border">
                  <img src={src} alt="" className="h-full w-full object-cover opacity-80" />
                </div>
              ))}
            </div>
          </div>

          <div>
            {p.attributes?.recommended && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-leaf-soft text-primary text-xs font-bold px-3 py-1.5 mb-4">
                <ShieldCheck className="h-3.5 w-3.5" /> Doctor Recommended
              </span>
            )}
            <h1 className="font-display text-3xl md:text-4xl font-bold">{p.name}</h1>
            <div className="mt-3 flex items-center gap-2">
              <div className="flex text-warning">
                {Array.from({ length: 5 }).map((_, i) => <Star key={i} className="h-4 w-4 fill-current" />)}
              </div>
              <span className="text-sm text-muted-foreground">4.9 (1,240 reviews)</span>
            </div>
            <p className="mt-4 text-muted-foreground">{p.description || productSummary(p)}</p>

            <div className="mt-6 flex items-baseline gap-3">
              <span className="text-3xl font-bold text-primary">{formatINR(p.price)}</span>
              {mrp > p.price && (
                <>
                  <span className="text-lg text-muted-foreground line-through">{formatINR(mrp)}</span>
                  <span className="rounded-full bg-destructive text-destructive-foreground text-xs font-bold px-2.5 py-1">{off}% OFF</span>
                </>
              )}
            </div>

            <div className="mt-6 grid grid-cols-3 gap-3">
              {[
                { icon: ShieldCheck, label: "Safe & Natural" },
                { icon: Truck, label: "Free Delivery" },
                { icon: Award, label: `${p.attributes?.durationWeeks || 8}wk Course` },
              ].map((b) => (
                <div key={b.label} className="rounded-2xl bg-card border border-border p-3 text-center shadow-soft">
                  <b.icon className="mx-auto h-5 w-5 text-primary" />
                  <div className="mt-1 text-xs font-semibold">{b.label}</div>
                </div>
              ))}
            </div>

            <div className="mt-6 flex items-center gap-3">
              <span className="text-sm font-semibold">Quantity</span>
              <div className="flex items-center rounded-full border border-border">
                <button onClick={() => setQty(Math.max(1, qty - 1))} className="p-2 hover:bg-accent rounded-l-full"><Minus className="h-4 w-4" /></button>
                <span className="w-10 text-center text-sm font-bold">{qty}</span>
                <button onClick={() => setQty(Math.min(20, qty + 1))} className="p-2 hover:bg-accent rounded-r-full"><Plus className="h-4 w-4" /></button>
              </div>
            </div>

            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <Button asChild variant="hero" size="lg" className="flex-1">
                <Link to="/checkout" search={{ slug: p.slug, qty }}>Buy Now</Link>
              </Button>
              <Button asChild variant="whatsapp" size="lg" className="flex-1">
                <a href={whatsappLink(`Hi, I want to know more about ${p.name}.`)} target="_blank" rel="noreferrer">
                  <MessageCircle className="h-4 w-4" /> WhatsApp
                </a>
              </Button>
            </div>
          </div>
        </div>
      </Section>

      <Section className="py-10">
        <div className="grid lg:grid-cols-2 gap-8">
          <div className="rounded-3xl bg-card shadow-card border border-border p-7">
            <h2 className="font-display text-2xl font-bold">Benefits</h2>
            <ul className="mt-5 space-y-3">
              {benefits.map((b) => (
                <li key={b} className="flex items-start gap-3">
                  <span className="mt-0.5 grid h-6 w-6 place-items-center rounded-full bg-leaf-soft text-primary"><Check className="h-3.5 w-3.5" /></span>
                  <span className="text-sm">{b}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-3xl bg-card shadow-card border border-border p-7">
            <h2 className="font-display text-2xl font-bold">Ingredients</h2>
            <ul className="mt-5 grid grid-cols-2 gap-3">
              {ingredients.map((i) => (
                <li key={i} className="rounded-xl bg-leaf-soft/60 px-3 py-2 text-sm font-medium text-foreground">{i}</li>
              ))}
            </ul>
            <h3 className="mt-6 font-display text-lg font-bold">Usage Instructions</h3>
            <p className="mt-2 text-sm text-muted-foreground">{p.attributes?.usage || "Use as directed by the doctor after consultation."}</p>
          </div>
        </div>
      </Section>

      <Section className="py-10">
        <h2 className="font-display text-2xl font-bold mb-6">Frequently Asked Questions</h2>
        <Accordion type="single" collapsible className="rounded-3xl bg-card border border-border shadow-card px-6">
          {faqs.map((f, i) => (
            <AccordionItem key={i} value={`q-${i}`}>
              <AccordionTrigger className="text-left">{f.q}</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">{f.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </Section>

      <Section className="py-10">
        <h2 className="font-display text-2xl font-bold mb-6">What Patients Say</h2>
        <div className="grid md:grid-cols-3 gap-5">
          {[
            { n: "Priya S.", t: "Saw real results in 4 weeks. Hair fall almost stopped!" },
            { n: "Anjali R.", t: "My cycles are regular now. Truly life changing." },
            { n: "Rakesh M.", t: "Skin feels healthier and acne is gone. Highly recommend." },
          ].map((t) => (
            <div key={t.n} className="rounded-2xl bg-card border border-border p-5 shadow-soft">
              <div className="flex text-warning">{Array.from({ length: 5 }).map((_, i) => <Star key={i} className="h-4 w-4 fill-current" />)}</div>
              <p className="mt-3 text-sm">{t.t}</p>
              <div className="mt-3 text-xs font-semibold text-muted-foreground">— {t.n}</div>
            </div>
          ))}
        </div>
      </Section>

      <Section className="py-10">
        <h2 className="font-display text-2xl font-bold mb-6">Related Packages</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {related.map((r) => (
            <Link key={r.slug} to="/shop/$slug" params={{ slug: r.slug }} className="group rounded-2xl overflow-hidden bg-card border border-border shadow-soft hover:shadow-glow transition">
              <div className="aspect-[4/3] bg-leaf-soft overflow-hidden">
                {assetUrl(r.image || r.images?.[0]) ? <img src={assetUrl(r.image || r.images?.[0])} alt={r.name} className="h-full w-full object-cover transition-transform group-hover:scale-105" /> : null}
              </div>
              <div className="p-4">
                <div className="font-semibold">{r.name}</div>
                <div className="mt-1 text-sm text-primary font-bold">{formatINR(r.price)}</div>
              </div>
            </Link>
          ))}
        </div>
      </Section>
    </>
  );
}
