import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import {
  Award,
  Check,
  CheckCircle2,
  Heart,
  MessageCircle,
  Minus,
  Plus,
  Share2,
  ShieldCheck,
  Star,
  Truck,
  Loader2,
  Leaf,
  AlertTriangle,
  Info,
  Compass,
  Sparkles,
} from "lucide-react";
import { Section } from "@/components/site/Section";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useProductBySlug, useProducts } from "@/hooks/useProducts";
import { assetUrl, discountPercent, formatINR, productMrp } from "@/services/api";
import { whatsappLink } from "@/components/site/FloatingActions";
import { ProductReviews } from "@/components/site/ProductReviews";
import ReactMarkdown from "react-markdown";

interface MarkdownSection {
  type: "lead" | "benefits" | "directions" | "caution" | "note" | "why-choose" | "general";
  title?: string;
  content: string;
}

function cleanHtmlDescription(raw?: string): string {
  if (!raw || typeof raw !== "string") return "";
  if (!/<[a-z][\s\S]*>/i.test(raw)) {
    return raw;
  }
  let text = raw;
  text = text.replace(/<br\s*\/?>/gi, "\n");
  text = text.replace(/<\/p>/gi, "\n\n");
  text = text.replace(/<\/h[1-6]>/gi, "\n\n");
  text = text.replace(/<\/div>/gi, "\n");
  text = text.replace(/<li[^>]*>/gi, "- ");
  text = text.replace(/<\/li>/gi, "\n");
  text = text.replace(/<[^>]+>/g, "");
  text = text
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;|&apos;/gi, "'");
  text = text.replace(/\r\n|\r/g, "\n");
  text = text.replace(/\n{3,}/g, "\n\n");
  return text.trim();
}

function getSectionType(title: string): MarkdownSection["type"] {
  const lower = title.toLowerCase();
  if (lower.includes("benefit")) return "benefits";
  if (
    lower.includes("direction") ||
    lower.includes("how to use") ||
    lower.includes("usage") ||
    lower.includes("dosage") ||
    lower.includes("dose")
  ) {
    return "directions";
  }
  if (
    lower.includes("caution") ||
    lower.includes("warning") ||
    lower.includes("precaut") ||
    lower.includes("contraind")
  ) {
    return "caution";
  }
  if (lower.includes("note") || lower.includes("important")) return "note";
  if (lower.includes("why choose") || lower.includes("why we choose")) return "why-choose";
  return "general";
}

function parseMarkdownSections(markdown?: string): {
  lead: { title?: string; content: string } | null;
  sections: MarkdownSection[];
} {
  const cleaned = cleanHtmlDescription(markdown);
  if (!cleaned.trim()) {
    return { lead: null, sections: [] };
  }

  const lines = cleaned.split(/\r?\n/);
  let currentTitle = "";
  let currentLines: string[] = [];
  let isLead = true;

  let leadTitle: string | undefined = undefined;
  const leadLines: string[] = [];
  const sections: MarkdownSection[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const h2Match = line.match(/^##\s+(.+)$/);

    if (h2Match) {
      if (isLead) {
        isLead = false;
      } else if (currentTitle || currentLines.length > 0) {
        sections.push({
          type: getSectionType(currentTitle),
          title: currentTitle,
          content: currentLines.join("\n").trim(),
        });
        currentLines = [];
      }
      currentTitle = h2Match[1].trim();
    } else if (isLead) {
      const h1Match = line.match(/^#\s+(.+)$/);
      if (h1Match && !leadTitle) {
        leadTitle = h1Match[1].trim();
      } else {
        leadLines.push(line);
      }
    } else {
      currentLines.push(line);
    }
  }

  if (currentTitle || currentLines.length > 0) {
    sections.push({
      type: getSectionType(currentTitle),
      title: currentTitle,
      content: currentLines.join("\n").trim(),
    });
  }

  const leadContent = leadLines.join("\n").trim();
  const lead = leadTitle || leadContent ? { title: leadTitle, content: leadContent } : null;

  return { lead, sections };
}

function parseWhyWeChooseThis(text?: string): string[] {
  if (!text) return [];
  return text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0)
    .map((line) => line.replace(/^[-*•✓]\s*|^\d+[\.)]\s*/, "").trim())
    .filter((item) => item.length > 0);
}

const baseMarkdownComponents = {
  h1: ({ children, ...props }: any) => (
    <h1 className="font-display text-2xl md:text-3xl font-bold tracking-tight text-foreground mt-4 mb-3" {...props}>
      {children}
    </h1>
  ),
  h2: ({ children, ...props }: any) => (
    <h2 className="font-display text-xl md:text-2xl font-bold tracking-tight text-foreground mt-4 mb-2.5" {...props}>
      {children}
    </h2>
  ),
  h3: ({ children, ...props }: any) => (
    <h3 className="font-display text-lg md:text-xl font-semibold text-foreground mt-3 mb-2" {...props}>
      {children}
    </h3>
  ),
  p: ({ children, ...props }: any) => (
    <p className="text-sm md:text-base leading-relaxed text-muted-foreground my-2.5" {...props}>
      {children}
    </p>
  ),
  ul: ({ children, ...props }: any) => (
    <ul className="space-y-2 my-2.5 pl-1" {...props}>
      {children}
    </ul>
  ),
  ol: ({ children, ...props }: any) => (
    <ol className="list-decimal pl-5 space-y-2 my-2.5 text-sm md:text-base leading-relaxed text-muted-foreground" {...props}>
      {children}
    </ol>
  ),
  li: ({ children, ...props }: any) => (
    <li className="text-sm md:text-base leading-relaxed text-muted-foreground flex items-start gap-2" {...props}>
      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary/70" />
      <span className="flex-1">{children}</span>
    </li>
  ),
  strong: ({ children, ...props }: any) => (
    <strong className="font-semibold text-foreground" {...props}>
      {children}
    </strong>
  ),
  a: ({ children, ...props }: any) => (
    <a className="text-primary underline underline-offset-4 hover:text-primary-hover transition" {...props}>
      {children}
    </a>
  ),
};

const benefitsComponents = {
  ...baseMarkdownComponents,
  ul: ({ children, ...props }: any) => (
    <ul className="space-y-2.5 my-2" {...props}>
      {children}
    </ul>
  ),
  li: ({ children, ...props }: any) => (
    <li className="flex items-start gap-3 rounded-xl bg-white/80 dark:bg-card/80 border border-emerald-500/10 p-3 text-sm md:text-base leading-relaxed text-foreground shadow-2xs" {...props}>
      <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 text-xs font-bold">
        ✓
      </span>
      <span className="flex-1">{children}</span>
    </li>
  ),
};

const directionsComponents = {
  ...baseMarkdownComponents,
  p: ({ children, ...props }: any) => (
    <p className="text-sm md:text-base leading-relaxed text-foreground/90 my-2" {...props}>
      {children}
    </p>
  ),
  ol: ({ children, ...props }: any) => (
    <ol className="list-decimal pl-5 space-y-2 my-2 text-sm md:text-base leading-relaxed text-foreground/90 font-medium" {...props}>
      {children}
    </ol>
  ),
  li: ({ children, ...props }: any) => (
    <li className="pl-1 text-sm md:text-base leading-relaxed text-foreground/90" {...props}>
      {children}
    </li>
  ),
};

const cautionComponents = {
  ...baseMarkdownComponents,
  p: ({ children, ...props }: any) => (
    <p className="text-sm md:text-base leading-relaxed text-amber-950 dark:text-amber-100 my-1.5" {...props}>
      {children}
    </p>
  ),
  ul: ({ children, ...props }: any) => (
    <ul className="space-y-2 my-2" {...props}>
      {children}
    </ul>
  ),
  li: ({ children, ...props }: any) => (
    <li className="flex items-start gap-2.5 text-sm md:text-base leading-relaxed text-amber-950 dark:text-amber-100" {...props}>
      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500" />
      <span className="flex-1">{children}</span>
    </li>
  ),
};

const noteComponents = {
  ...baseMarkdownComponents,
  p: ({ children, ...props }: any) => (
    <p className="text-sm md:text-base leading-relaxed text-sky-950/90 dark:text-sky-100/90 my-1.5" {...props}>
      {children}
    </p>
  ),
  strong: ({ children, ...props }: any) => (
    <strong className="font-semibold text-sky-950 dark:text-sky-100" {...props}>
      {children}
    </strong>
  ),
};

function SectionCard({ section }: { section: MarkdownSection }) {
  if (section.type === "benefits") {
    return (
      <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/[0.04] p-6 md:p-7 shadow-xs space-y-4">
        <div className="flex items-center gap-2.5 text-emerald-800 dark:text-emerald-300">
          <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="h-5 w-5" />
          </span>
          <h3 className="font-display text-xl md:text-2xl font-bold tracking-tight text-emerald-950 dark:text-emerald-100">
            {section.title}
          </h3>
        </div>
        <div className="text-sm md:text-base leading-relaxed">
          <ReactMarkdown components={benefitsComponents}>{section.content}</ReactMarkdown>
        </div>
      </div>
    );
  }

  if (section.type === "directions") {
    return (
      <div className="rounded-2xl border border-primary/20 bg-primary/[0.03] p-6 md:p-7 shadow-xs space-y-4">
        <div className="flex items-center gap-2.5 text-primary">
          <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Compass className="h-5 w-5" />
          </span>
          <h3 className="font-display text-xl md:text-2xl font-bold tracking-tight text-foreground">
            {section.title}
          </h3>
        </div>
        <div className="text-sm md:text-base leading-relaxed text-foreground/90">
          <ReactMarkdown components={directionsComponents}>{section.content}</ReactMarkdown>
        </div>
      </div>
    );
  }

  if (section.type === "caution") {
    return (
      <div className="rounded-2xl border border-amber-500/30 bg-amber-500/[0.06] p-6 md:p-7 shadow-xs space-y-4">
        <div className="flex items-center gap-2.5 text-amber-800 dark:text-amber-300">
          <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-500/15 text-amber-600 dark:text-amber-400">
            <AlertTriangle className="h-5 w-5" />
          </span>
          <h3 className="font-display text-xl md:text-2xl font-bold tracking-tight text-amber-950 dark:text-amber-100">
            {section.title}
          </h3>
        </div>
        <div className="text-sm md:text-base leading-relaxed text-amber-950 dark:text-amber-100">
          <ReactMarkdown components={cautionComponents}>{section.content}</ReactMarkdown>
        </div>
      </div>
    );
  }

  if (section.type === "note") {
    return (
      <div className="rounded-2xl border border-sky-500/25 bg-sky-500/[0.05] p-5 md:p-6 shadow-xs space-y-2.5">
        <div className="flex items-center gap-2 text-sky-900 dark:text-sky-200">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-sky-500/15 text-sky-600 dark:text-sky-400">
            <Info className="h-4 w-4" />
          </span>
          <h3 className="font-display text-lg md:text-xl font-bold text-sky-950 dark:text-sky-100">
            {section.title}
          </h3>
        </div>
        <div className="text-sm md:text-base leading-relaxed text-sky-950/90 dark:text-sky-100/90">
          <ReactMarkdown components={noteComponents}>{section.content}</ReactMarkdown>
        </div>
      </div>
    );
  }

  if (section.type === "why-choose") {
    return (
      <div className="rounded-2xl border border-primary/20 bg-leaf-soft/50 p-6 md:p-7 shadow-xs space-y-4">
        <div className="flex items-center gap-2.5 text-primary">
          <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Sparkles className="h-5 w-5" />
          </span>
          <h3 className="font-display text-xl md:text-2xl font-bold tracking-tight text-foreground">
            {section.title}
          </h3>
        </div>
        <div className="text-sm md:text-base leading-relaxed text-muted-foreground">
          <ReactMarkdown components={baseMarkdownComponents}>{section.content}</ReactMarkdown>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-border bg-card p-6 md:p-7 shadow-xs space-y-3">
      <h3 className="font-display text-xl md:text-2xl font-bold tracking-tight text-foreground">
        {section.title}
      </h3>
      <div className="text-sm md:text-base leading-relaxed text-muted-foreground">
        <ReactMarkdown components={baseMarkdownComponents}>{section.content}</ReactMarkdown>
      </div>
    </div>
  );
}

export const Route = createFileRoute("/shop_/$slug")({
  component: ProductDetailPage,
  notFoundComponent: () => (
    <Section className="py-20">
      <div className="text-center max-w-md mx-auto">
        <h2 className="text-2xl font-bold mb-2">Product Not Found</h2>
        <p className="text-muted-foreground mb-6">Product not found. <Link to="/shop" className="text-primary underline">Back to shop</Link></p>
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
        <Loader2 className="mx-auto mb-3 h-5 w-5 animate-spin text-primary" />Loading product...
      </Section>
    );
  }

  if (!p) {
    return (
      <Section className="py-20">
        <div className="text-center max-w-md mx-auto">
          <h2 className="text-2xl font-bold mb-2">Product Not Found</h2>
          <p className="text-muted-foreground mb-6">
            The product you are looking for does not exist or has been moved.
          </p>
          <Button asChild className="rounded-full">
            <Link to="/shop">Back to Shop</Link>
          </Button>
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

  // Parsed markdown sections & Why We Choose This items
  const { lead, sections } = parseMarkdownSections(p.description);
  const whyChooseItems = parseWhyWeChooseThis(p.whyWeChooseThis || (p as any).why_we_choose_this);
  const hasMarkdownBenefits = sections.some((s) => s.type === "benefits");

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
                  <span>Doctor-formulated Homoeopathy  kit.</span>
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
        <div className="grid gap-8 lg:grid-cols-[1.3fr_0.7fr] xl:grid-cols-[1.35fr_0.65fr] items-start">
          {/* Main Left Column: Overview, Markdown Sections, Highlights, Fallback Benefits & Ingredients */}
          <div className="space-y-6">
            <div className="rounded-[2rem] border border-border bg-card p-6 md:p-8 space-y-6">
              <div className="border-b border-border/70 pb-4">
                <span className="text-xs font-semibold uppercase tracking-wider text-primary">Product Details</span>
                <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground">Product Overview</h2>
              </div>

              {!lead && sections.length === 0 ? (
                <p className="text-sm leading-7 text-muted-foreground">
                  No description available.
                </p>
              ) : (
                <div className="space-y-6">
                  {lead && (
                    <div className="space-y-3">
                      {lead.title && (
                        <h3 className="font-display text-2xl md:text-3xl font-bold text-foreground tracking-tight">
                          {lead.title}
                        </h3>
                      )}
                      {lead.content && (
                        <div className="text-sm md:text-base leading-relaxed text-muted-foreground">
                          <ReactMarkdown components={baseMarkdownComponents}>
                            {lead.content}
                          </ReactMarkdown>
                        </div>
                      )}
                    </div>
                  )}

                  {sections.map((section, idx) => (
                    <SectionCard key={idx} section={section} />
                  ))}
                </div>
              )}

              {/* Product Summary Highlight Cards */}
              <div className="pt-2">
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  <div className="rounded-2xl bg-leaf-soft p-4">
                    <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Category</span>
                    <p className="mt-1 text-sm font-semibold text-foreground truncate">{categoryName}</p>
                  </div>
                  <div className="rounded-2xl bg-leaf-soft p-4">
                    <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Duration</span>
                    <p className="mt-1 text-sm font-semibold text-foreground">{durationWeeks === "N/A" ? "N/A" : `${durationWeeks} weeks`}</p>
                  </div>
                  <div className="rounded-2xl bg-leaf-soft p-4">
                    <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Recommended</span>
                    <p className="mt-1 text-sm font-semibold text-foreground">{isRecommended ? "Doctor recommended" : "Natural formula"}</p>
                  </div>
                  <div className="rounded-2xl bg-leaf-soft p-4">
                    <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Stock</span>
                    <p className="mt-1 text-sm font-semibold text-foreground">{p.in_stock ? `${p.stock ?? 0} available` : "Out of stock"}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Structured Benefits (only rendered if description didn't already have a Benefits section) */}
            {!hasMarkdownBenefits && benefits.length > 0 && (
              <div className="rounded-[2rem] border border-emerald-500/20 bg-emerald-500/[0.04] p-6 md:p-8 space-y-4">
                <div className="flex items-center gap-2.5 text-emerald-800 dark:text-emerald-300">
                  <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-600">
                    <CheckCircle2 className="h-5 w-5" />
                  </span>
                  <h2 className="font-display text-xl md:text-2xl font-bold text-emerald-950 dark:text-emerald-100">Key Benefits</h2>
                </div>
                <ul className="space-y-2.5">
                  {benefits.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-3 rounded-xl bg-white/80 dark:bg-card/80 border border-emerald-500/10 p-3 text-sm md:text-base leading-relaxed text-foreground shadow-2xs">
                      <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 text-xs font-bold">✓</span>
                      <span className="flex-1">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Key Ingredients */}
            {ingredients.length > 0 && (
              <div className="rounded-[2rem] border border-border bg-card p-6 md:p-8 space-y-4">
                <div className="flex items-center gap-2.5 text-primary">
                  <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Leaf className="h-5 w-5" />
                  </span>
                  <h2 className="font-display text-xl md:text-2xl font-bold text-foreground">Key Ingredients</h2>
                </div>
                <ul className="grid gap-3 sm:grid-cols-2 text-sm text-muted-foreground">
                  {ingredients.map((item, idx) => (
                    <li key={idx} className="rounded-2xl bg-leaf-soft p-4 font-medium text-foreground">{item}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Right Column (Aside): Why We Choose This card + Specifications Card */}
          <aside className="space-y-6 lg:sticky lg:top-24">
            {/* Why We Choose This Dedicated Card */}
            {whyChooseItems.length > 0 && (
              <div className="rounded-[2rem] border border-border bg-card p-6 md:p-7 shadow-card space-y-4">
                <div className="flex items-center gap-3 border-b border-border/70 pb-4">
                  <div className="grid h-10 w-10 place-items-center rounded-2xl bg-emerald-500/10 text-emerald-600">
                    <Leaf className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="text-xs font-semibold uppercase tracking-wider text-emerald-600">Why Customers Choose It</span>
                    <h2 className="font-display text-xl font-bold text-foreground">Why We Choose This</h2>
                  </div>
                </div>
                <ul className="space-y-2.5">
                  {whyChooseItems.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-3 rounded-xl bg-leaf-soft/60 p-3 text-sm leading-relaxed text-foreground transition hover:bg-leaf-soft">
                      <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-700 text-xs font-bold">
                        ✓
                      </span>
                      <span className="font-medium text-foreground/90">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Specifications Card */}
            <div className="rounded-[2rem] border border-border bg-card p-6 md:p-7 shadow-card space-y-4">
              <div className="flex items-center gap-3 border-b border-border/70 pb-4">
                <div className="grid h-10 w-10 place-items-center rounded-2xl bg-primary/10 text-primary">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Product Details</span>
                  <h2 className="font-display text-xl font-bold text-foreground">Specifications</h2>
                </div>
              </div>
              <dl className="divide-y divide-border/60 text-sm">
                {specs.map((spec) => (
                  <div key={spec.label} className="flex items-center justify-between py-3 first:pt-0 last:pb-0">
                    <dt className="text-muted-foreground font-medium">{spec.label}</dt>
                    <dd className="font-semibold text-foreground text-right">{spec.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </aside>
        </div>
      </Section>

      <Section className="py-10">
        <ProductReviews productSlug={p.slug} />
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