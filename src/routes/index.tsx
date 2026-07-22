import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Section, SectionHeader } from "@/components/site/Section";
import { GoogleReviews } from "@/components/site/GoogleReviews";
import doctorImg from "@/assets/doctor-heros.png";
// Doctor image intentionally used ONLY in the FAQ/doctor-profile block below.
import productHair from "@/assets/product-hair.jpg";
import heroBg from "@/assets/hero-clinic-bg.jpg";
import mdLogo from "@/assets/md-logo.png";
import {
  Calendar, MessageCircle, ShieldCheck, Award, Users, Globe, Sparkles, Leaf, User,
  HeartPulse, Activity, Brain, Flower2, Scissors, Stethoscope,
  ClipboardList, Microscope, Pill, Repeat, ArrowRight, CheckCircle2, ChevronDown, Phone,
  MapPin, X, ImageIcon, Star
} from "lucide-react";
import { useState } from "react";
import { useProducts } from "@/hooks/useProducts";
import { assetUrl, formatINR, productMrp, productSummary } from "@/services/api";
import { conditions } from "@/data/conditions";
import { blogPosts, formatBlogDate } from "@/data/blogs";
import { FeaturedProducts } from "@/components/site/FeaturedProducts";
import { featuredProducts } from "@/data/featuredProducts";

const GOOGLE_REVIEW_URL =
  "https://www.google.com/maps/search/?api=1&query=MD%27s+Homoeopathy+Mathura";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "MD's Homoeopathy  — Natural Treatment for Long-Term Relief" },
      { name: "description", content: "Safe, personalized Homoeopathy  for hair fall, PCOD, thyroid, skin & anxiety. Online & clinic consultations. Book today." },
    ],
  }),
  component: HomePage,
});

const trust = [
  { icon: Award, value: "5+", label: "Years Experience" },
  { icon: Users, value: "1000+", label: "Patients Treated" },
  { icon: ShieldCheck, value: "100%", label: "Safe & Side-Effect Free" },
  { icon: Globe, value: "Online", label: "Consultation Available" },
];

const steps = [
  { icon: Calendar, title: "Book Appointment", desc: "Pick a slot online or call us." },
  { icon: Stethoscope, title: "Consultation", desc: "Detailed discussion of symptoms." },
  { icon: Microscope, title: "Diagnosis", desc: "Root-cause analysis of your issue." },
  { icon: Pill, title: "Medicine Delivery", desc: "Personalized remedies at your door." },
  { icon: Repeat, title: "Follow-up", desc: "Regular reviews to track progress." },
];

const why = [
  "Personalized treatment plans",
  "Root cause approach, not just symptoms",
  "Zero side effects, 100% natural",
  "Experienced & certified doctors",
  "Online consultation across India",
  "Doorstep medicine delivery",
];

const faqs = [
  { q: "How long does Homoeopathy treatment take?", a: "The duration of treatment completely depends upon the pathogenicity, severity, and condition of the disease. Every patient responds differently, therefore treatment duration may vary from case to case." },
  { q: "How long does homeopathic treatment take?", a: "Duration depends on the condition — chronic issues typically need 3–6 months, acute conditions resolve faster. We share a personalized timeline after consultation." },
  { q: "Are there any side effects?", a: "Homoeopathy  is 100% natural and free of side effects when prescribed by a qualified doctor. Safe for all ages, including children and pregnant women." },
  { q: "How is the medicine delivered?", a: "After consultation, your personalized medicine is shipped via express courier across India, typically within 2–4 business days." },
  { q: "Can I consult online?", a: "Yes! We offer secure video consultations. You'll receive a prescription and medicines at your doorstep." },
];

// Helper function to strip HTML and get plain text excerpt
const getPlainTextExcerpt = (html: string, maxLength: number = 120): string => {
  // Remove HTML tags
  const plainText = html.replace(/<[^>]*>/g, '');
  // Remove extra whitespace
  const trimmed = plainText.replace(/\s+/g, ' ').trim();
  // Truncate
  if (trimmed.length <= maxLength) return trimmed;
  return trimmed.substring(0, maxLength) + '...';
};

function HomePage() {
  const { data: productResponse, isLoading: loadingProducts } = useProducts({ limit: 2 });
  const homeProducts = productResponse?.data || [];

  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden">
        {/* Background image */}
        <div
          className="absolute inset-0 bg-cover bg-bottom bg-no-repeat"
          style={{ backgroundImage: `url(${heroBg})` }}
        />
        {/* Light cream overlay for readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-background/85 via-background/75 to-background/60" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-10 pb-10 md:pt-16 md:pb-16">
          <div className="flex flex-col items-center text-center max-w-3xl mx-auto">
            {/* BRANDING LOGO */}
            <img
              src={mdLogo}
              alt="MD's Homoeopathy logo"
              className="animate-fade-up w-40 sm:w-52 lg:w-64 h-auto object-contain drop-shadow-[0_8px_24px_hsl(var(--primary)/0.15)]"
              width={1279}
              height={1077}
            />

            <div className="animate-fade-up relative z-10 mt-6">
              <span className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-leaf-soft/80 text-xs sm:text-sm font-bold uppercase tracking-wide text-primary shadow-soft">
                <Leaf className="h-4 w-4" /> A DESTINATION FOR PERMANENT CURE AND PERFECT CARE.
              </span>
              {/* <h1 className="mt-6 font-display text-5xl sm:text-6xl lg:text-7xl font-extrabold leading-[1.02] tracking-tight text-primary text-balance">
                MD's<br />HOMOEOPATHY 
              </h1> */}
              <p className="mt-4 font-display text-xl sm:text-2xl text-foreground/80 font-medium">
                We Heal Immunity and Improve Your Health.
              </p>
              <p className="mt-5 text-base text-muted-foreground max-w-md mx-auto text-pretty">
                Safe, natural and effective homeopathic treatment for you and your loved ones. Personalized care for a healthier tomorrow.
              </p>

              <div className="mt-8 flex flex-wrap gap-3 justify-center">
                <Button asChild variant="hero" size="xl" className="rounded-full">
                  <Link to="/appointment"><Calendar /> Book Appointment</Link>
                </Button>
                <Button asChild variant="outline" size="xl" className="rounded-full bg-card hover:bg-card text-whatsapp border-card shadow-soft hover:shadow-glow">
                  <a href="https://wa.me/917668610031" target="_blank" rel="noreferrer"><MessageCircle /> Chat on WhatsApp</a>
                </Button>
              </div>
            </div>
          </div>

          {/* FEATURE CARDS ROW */}
          <div className="mt-10 md:mt-12 grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {[
              { icon: Leaf, title: "Natural Treatment", desc: "Side-effect free homeopathic care" },
              { icon: User, title: "Expert Doctor", desc: "Experienced and trusted homeopath" },
              { icon: Users, title: "All Age Care", desc: "Treatment for kids, adults & seniors" },
              { icon: ShieldCheck, title: "Safe & Effective", desc: "Holistic approach for long lasting results" },
            ].map((f) => (
              <div key={f.title} className="bg-card/80 backdrop-blur rounded-2xl p-4 sm:p-5 shadow-soft hover:shadow-card transition flex items-start gap-3">
                <div className="grid h-11 w-11 place-items-center rounded-full border-2 border-primary/30 bg-leaf-soft/60 shrink-0">
                  <f.icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <div className="font-bold text-sm sm:text-base text-foreground leading-tight">{f.title}</div>
                  <div className="mt-1 text-xs sm:text-sm text-muted-foreground leading-snug">{f.desc}</div>
                </div>
              </div>
            ))}
          </div>

          {/* TRUST STRIP */}
          <div className="mt-4 sm:mt-5 bg-leaf-soft/70 rounded-2xl px-4 sm:px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-soft">
            <div className="flex items-center gap-3">
              <div className="grid h-11 w-11 place-items-center rounded-full bg-card shadow-soft">
                <ShieldCheck className="h-5 w-5 text-primary" />
              </div>
              <div>
                <div className="font-bold text-sm sm:text-base">Trusted Homoeopathy  Clinic</div>
                <div className="text-xs sm:text-sm text-muted-foreground">Thousands of patients healed with care and compassion.</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex -space-x-2">
                {[1,2,3,4,5,6].map(i => (
                  <div key={i} className="h-9 w-9 rounded-full border-2 border-background bg-gradient-to-br from-leaf-soft to-sky-soft" />
                ))}
              </div>
              <div>
                <div className="font-display font-extrabold text-xl text-primary leading-none">5000+</div>
                <div className="text-xs text-muted-foreground">Happy Patients</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* DISEASES */}
      <Section>
        <SectionHeader eyebrow="What we treat" title="Conditions We Heal Naturally" subtitle="Specialized homeopathic care for the most common chronic and acute conditions." />
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {conditions.map((d) => (
            <div key={d.slug} className="group bg-card rounded-3xl p-6 shadow-soft hover:shadow-glow transition-all hover:-translate-y-1">
              <div className={`h-14 w-14 grid place-items-center rounded-2xl bg-gradient-to-br ${d.color} text-white shadow-soft`}>
                <d.icon className="h-6 w-6" />
              </div>
              <h3 className="mt-5 font-display text-xl font-bold">{d.name}</h3>
              <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{d.shortDescription}</p>
              <Link to="/conditions/$slug" params={{ slug: d.slug }} className="mt-5 inline-flex text-sm font-semibold text-primary items-center gap-1 group-hover:gap-2 transition-all">
                Learn More <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          ))}
        </div>
      </Section>

      {/* ABOUT PREVIEW */}
      <Section className="bg-leaf-soft/40">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <span className="inline-block px-3 py-1 rounded-full bg-card text-primary text-xs font-semibold uppercase tracking-wide">About MD's HOMOEOPATHY</span>
            <h2 className="mt-4 font-display text-3xl md:text-4xl font-bold text-balance">Two decades of healing, one patient at a time.</h2>
            <p className="mt-4 text-muted-foreground text-pretty">
              At MD's HOMOEOPATHY, we combine classical Homoeopathy  with modern diagnostics to deliver care that addresses the root cause — not just symptoms. Every treatment plan is built around you.
            </p>
            <div className="mt-6 grid grid-cols-2 gap-4">
              {["Root-cause approach","Personalized care","Online consultations","Trusted by 1000+"].map(t=>(
                <div key={t} className="flex gap-2 items-center text-sm"><CheckCircle2 className="h-4 w-4 text-primary" />{t}</div>
              ))}
            </div>
            <Button asChild variant="outline" size="lg" className="mt-8">
              <Link to="/about">Read More <ArrowRight /></Link>
            </Button>
          </div>
          <div className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-card bg-gradient-hero grid place-items-center">
            <div className="text-center p-8">
              <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-sky text-primary-foreground shadow-glow">
                <Stethoscope className="h-8 w-8" />
              </div>
              <p className="mt-4 font-display text-2xl text-foreground">Root-cause healing.</p>
              <p className="mt-1 text-sm text-muted-foreground">Personalized homoeopathic care since 2019.</p>
            </div>
          </div>
        </div>
      </Section>

      {/* HOW IT WORKS */}
      <Section>
        <SectionHeader eyebrow="Process" title="How It Works" subtitle="Five simple steps from consultation to recovery." />
        <div className="mt-14 grid md:grid-cols-5 gap-4 relative">
          {steps.map((s, i) => (
            <div key={s.title} className="relative bg-card rounded-3xl p-6 shadow-soft hover:shadow-card transition">
              <div className="absolute -top-4 left-6 text-xs font-bold bg-gradient-leaf text-primary-foreground rounded-full h-7 w-7 grid place-items-center shadow-soft">{i+1}</div>
              <s.icon className="h-7 w-7 text-primary" />
              <h3 className="mt-3 font-semibold text-base">{s.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{s.desc}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* WHY CHOOSE US */}
      <Section className="bg-sky-soft/40">
        <div className="grid lg:grid-cols-2 gap-10 items-center">
          <SectionHeader eyebrow="Why us" title="Why Patients Choose MD's HOMOEOPATHY" subtitle="Care that's personal, science-backed, and side-effect free." center={false} />
          <ul className="grid sm:grid-cols-2 gap-4">
            {why.map(w => (
              <li key={w} className="flex gap-3 bg-card rounded-2xl p-4 shadow-soft">
                <div className="grid h-10 w-10 place-items-center rounded-xl bg-leaf-soft shrink-0"><CheckCircle2 className="h-5 w-5 text-primary" /></div>
                <span className="text-sm font-medium pt-2">{w}</span>
              </li>
            ))}
          </ul>
        </div>
      </Section>

      {/* SPECIALISED FACILITIES */}
      <Section>
        <SectionHeader eyebrow="Our Facilities" title="More Than Just Medicine" subtitle="Complete, modern support to make your healing journey effective and convenient." />
        <div className="mt-12 grid md:grid-cols-2 gap-6">
          {[
            {
              icon: ClipboardList,
              title: "Diet Chart by Expert Dietitians",
              points: ["Professional diet guidance", "Personalized nutrition plans"],
            },
            {
              icon: Activity,
              title: "In-house ECG, PFT & BSG Facility",
              points: ["Diagnostic support available", "Advanced health monitoring facilities"],
            },
          ].map((f) => (
            <div key={f.title} className="flex gap-5 rounded-3xl bg-card p-7 shadow-soft hover:shadow-card transition">
              <div className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-gradient-leaf text-primary-foreground shadow-soft">
                <f.icon className="h-7 w-7" />
              </div>
              <div>
                <h3 className="font-display text-xl font-bold">{f.title}</h3>
                <ul className="mt-3 space-y-2">
                  {f.points.map((p) => (
                    <li key={p} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <CheckCircle2 className="h-4 w-4 text-primary" /> {p}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* FEATURED PRODUCT HIGHLIGHTS */}
      <FeaturedProducts />

      {/* PRODUCTS */}
      <Section>
        <SectionHeader
          eyebrow="Shop"
          title="Recommended MD's Homoeopathy Products"
          subtitle="Doctor-formulated remedies for common conditions."
        />

        {/* Highlighted recommended products */}
        <div className="mt-12 grid sm:grid-cols-2 gap-6">
          {featuredProducts.map((p) => (
            <div key={p.slug} className="group relative flex h-full flex-col overflow-hidden rounded-3xl border-2 border-primary/20 bg-gradient-to-br from-leaf-soft/60 to-card p-6 shadow-soft transition hover:shadow-glow">
              <span className="inline-flex w-fit items-center gap-1 rounded-full bg-success px-3 py-1 text-xs font-bold text-white shadow-soft">
                <Sparkles className="h-3 w-3" /> Top Recommended
              </span>
              <div className="mt-4 grid place-items-center overflow-hidden rounded-2xl bg-white p-4">
                <img
                  src={p.bottle}
                  alt={p.image_alt}
                  loading="lazy"
                  className="h-48 w-auto object-contain transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <h3 className="mt-4 font-display text-2xl font-bold text-foreground">{p.name}</h3>
              <p className="mt-2 flex-1 text-sm text-muted-foreground">{p.short_description}</p>
              <div className="mt-5 flex flex-wrap gap-2">
                <Button asChild variant="hero" className="rounded-full">
                  <Link to="/shop/$slug" params={{ slug: p.slug }}>View Product</Link>
                </Button>
                <Button asChild variant="outline" className="rounded-full">
                  <Link to="/appointment">Consult First</Link>
                </Button>
              </div>
            </div>
          ))}
        </div>



        <div className="mt-12 grid md:grid-cols-2 gap-6">
          {loadingProducts ? (
            <p className="md:col-span-2 text-center text-sm text-muted-foreground">Loading products...</p>
          ) : homeProducts.length ? (
            homeProducts.map((product) => {
              // Get the full HTML summary and convert to plain text excerpt
              const fullSummary = productSummary(product);
              const plainTextExcerpt = getPlainTextExcerpt(fullSummary, 120);
              
              return (
                <ProductCard
                  key={product.slug}
                  img={assetUrl(product.image || product.gallery?.[0]?.url)}
                  tag={product.attributes?.recommended ? "Doctor Recommended" : "Treatment Kit"}
                  name={product.name}
                  desc={plainTextExcerpt}
                  price={formatINR(product.price)}
                  mrp={formatINR(productMrp(product))}
                  ctaLabel="Buy Now"
                  secondaryLabel="Consult First"
                  slug={product.slug}
                />
              );
            })
          ) : (
            <p className="md:col-span-2 text-center text-sm text-muted-foreground">Products will be available shortly.</p>
          )}
        </div>
      </Section>

      {/* TESTIMONIALS */}
      <Section className="bg-gradient-hero">
        <SectionHeader eyebrow="Real Reviews" title="Real Patients. Real Results." />
        <GoogleReviews />
        <div className="mt-10 text-center">
          <Button asChild variant="hero" size="lg" className="rounded-full">
            <a href={GOOGLE_REVIEW_URL} target="_blank" rel="noopener noreferrer">
              <Star className="h-4 w-4" /> Write a Google Review
            </a>
          </Button>
        </div>
      </Section>

      {/* BLOG PREVIEW */}
      <Section>
        <SectionHeader eyebrow="Learn" title="From Our Health Journal" subtitle="Insights from our doctors on healing, naturally." />
        <div className="mt-12 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogPosts.slice(0, 5).map((b) => (
            <Link key={b.slug} to="/blog/$slug" params={{ slug: b.slug }} className="group bg-card rounded-3xl overflow-hidden shadow-soft hover:shadow-card transition hover:-translate-y-1">
              <div className="aspect-[16/10] overflow-hidden relative">
                <img src={b.featuredImage} alt={b.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
                <span className="absolute top-4 left-4 px-3 py-1 rounded-full bg-card/90 text-xs font-semibold text-primary shadow-soft backdrop-blur">{b.category}</span>
              </div>
              <div className="p-5">
                <div className="text-xs text-muted-foreground">{formatBlogDate(b.publishDate)}</div>
                <h3 className="mt-2 font-semibold text-base group-hover:text-primary transition line-clamp-2">{b.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{b.excerpt}</p>
                <div className="mt-3 text-xs font-semibold text-primary inline-flex items-center gap-1">Read More <ArrowRight className="h-3 w-3" /></div>
              </div>
            </Link>
          ))}
        </div>
      </Section>

      {/* FAQ */}
      <Section className="bg-leaf-soft/40">
        <SectionHeader eyebrow="FAQ" title="Frequently Asked Questions" />
        <div className="mt-10 max-w-3xl mx-auto space-y-3">
          {faqs.map((f, i)=> <Faq key={i} {...f} />)}
        </div>
      </Section>

      {/* DOCTOR PROFILE */}
      <Section className="bg-leaf-soft/40">
        <SectionHeader eyebrow="Meet Your Doctor" title="Why We Started MD's HOMOEOPATHY" subtitle="Compassionate, root-cause homeopathic care led by an experienced homeopath." />
        <div className="mt-12 grid lg:grid-cols-2 gap-10 items-center">
          <div className="relative max-w-md mx-auto w-full">
            <div className="absolute -inset-4 bg-gradient-leaf opacity-20 blur-2xl rounded-full" />
            <img src={doctorImg} alt="Dr. Parth Bhargava" className="relative rounded-3xl shadow-card aspect-square object-cover w-full" loading="lazy" />
          </div>
          <div>
            <h3 className="font-display text-3xl font-bold">Dr. Parth Bhargava</h3>
            <p className="mt-1 text-primary font-semibold">BHMS · Homoeopathic Consultant</p>
            <div className="mt-4 flex flex-wrap gap-3">
              <span className="inline-flex items-center gap-2 rounded-full bg-card px-4 py-1.5 text-sm font-medium shadow-soft"><Award className="h-4 w-4 text-primary" /> Qualified BHMS</span>
              <span className="inline-flex items-center gap-2 rounded-full bg-card px-4 py-1.5 text-sm font-medium shadow-soft"><Users className="h-4 w-4 text-primary" /> 5000+ Patients Treated</span>
            </div>
            <p className="mt-5 text-muted-foreground text-pretty">
              Dr. Parth Bhargava founded MD's HOMOEOPATHY with a single belief — that medicine should heal the root cause, not just mask symptoms. With deep expertise in chronic conditions like thyroid, nasal, gynecological, neuro, osteo and digestive disorders, he provides personalized, side-effect-free treatment with genuine care and compassion.
            </p>
            <Button asChild variant="hero" size="lg" className="mt-7">
              <Link to="/appointment"><Calendar /> Book a Consultation</Link>
            </Button>
          </div>
        </div>
      </Section>

      {/* TEST REPORTS CHECK */}
      <TestReports />

      {/* REACH US */}
      <Section className="bg-sky-soft/30">
        <SectionHeader eyebrow="Visit Us" title="Reach Us" subtitle="Walk in to our clinic or connect with us online — we're here to help." />
        <div className="mt-12 grid lg:grid-cols-2 gap-6">
          <div className="rounded-3xl bg-card p-7 shadow-soft">
            <div className="flex gap-4">
              <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-gradient-leaf text-primary-foreground"><MapPin className="h-6 w-6" /></div>
              <div>
                <h3 className="font-display text-lg font-bold">Clinic Address</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                  1262/3A, Deeg Gali, Shahganj Darwaza, Mathura, Uttar Pradesh – 281001, India
                </p>
              </div>
            </div>
            <div className="mt-6 grid sm:grid-cols-2 gap-3">
              <a href="tel:+917668610031" className="flex items-center gap-2 rounded-2xl bg-leaf-soft/60 px-4 py-3 text-sm font-medium hover:bg-leaf-soft transition">
                <Phone className="h-4 w-4 text-primary" /> +91 76686 10031
              </a>
            </div>
          </div>
          <div className="overflow-hidden rounded-3xl shadow-soft min-h-[260px]">
            <iframe
              title="MD's Homoeopathy Clinic Location"
              src="https://www.google.com/maps?q=Shahganj%20Darwaza%2C%20Mathura%2C%20Uttar%20Pradesh%20281001&output=embed"
              className="h-full w-full min-h-[260px] border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </Section>
    </>
  );
}

function ProductCard({ img, tag, name, desc, price, mrp, ctaLabel, secondaryLabel, slug }: {
  img: string; tag: string; name: string; desc: string; price: string; mrp: string; ctaLabel: string; secondaryLabel: string; slug: string;
}) {
  return (
    <div className="group bg-card rounded-3xl overflow-hidden shadow-soft hover:shadow-card transition grid md:grid-cols-2">
      <div className="aspect-square md:aspect-auto bg-leaf-soft relative">
        <img src={img} alt={name} className="w-full h-full object-cover" loading="lazy" width={800} height={800} />
        <span className="absolute top-4 left-4 px-3 py-1 rounded-full bg-success text-white text-xs font-semibold shadow-soft">{tag}</span>
      </div>
      <div className="p-6 flex flex-col">
        <h3 className="font-display text-xl font-bold">{name}</h3>
        <p className="mt-2 text-sm text-muted-foreground flex-1">{desc}</p>
        <div className="mt-4 flex items-baseline gap-2">
          <span className="font-display text-2xl font-bold text-primary">{price}</span>
          <span className="text-xs text-muted-foreground line-through">{mrp}</span>
        </div>
        <div className="mt-4 flex flex-col sm:flex-row gap-2">
          <Button asChild variant="hero" className="flex-1">
            <Link to="/checkout" search={{ slug }}>{ctaLabel}</Link>
          </Button>
          <Button asChild variant="outline" className="flex-1">
            <Link to="/appointment">{secondaryLabel}</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

function Faq({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="bg-card rounded-2xl shadow-soft overflow-hidden">
      <button onClick={()=>setOpen(!open)} className="w-full text-left px-5 py-4 flex items-center justify-between gap-4">
        <span className="font-semibold text-sm md:text-base">{q}</span>
        <ChevronDown className={`h-5 w-5 text-primary shrink-0 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && <div className="px-5 pb-5 text-sm text-muted-foreground animate-fade-up">{a}</div>}
    </div>
  );
}

const reportImages = [
  { src: "https://images.unsplash.com/photo-1581595219315-a187dd40c322?auto=format&fit=crop&w=800&q=80", label: "Thyroid Profile — Before & After" },
  { src: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=800&q=80", label: "Blood Sugar Report" },
  { src: "https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&w=800&q=80", label: "Diagnostic Lab Report" },
  { src: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80", label: "Health Recovery Report" },
  { src: "https://images.unsplash.com/photo-1530026405186-ed1f139313f8?auto=format&fit=crop&w=800&q=80", label: "Hormonal Panel Improvement" },
  { src: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?auto=format&fit=crop&w=800&q=80", label: "Follow-up Progress Report" },
];

function TestReports() {
  const [preview, setPreview] = useState<{ src: string; label: string } | null>(null);
  return (
    <Section>
      <SectionHeader
        eyebrow="Proven Results"
        title="Test Reports Check"
        subtitle="Real before & after medical reports showing the impact of our homeopathic treatment."
      />
      <div className="mt-12 grid grid-cols-2 md:grid-cols-3 gap-4">
        {reportImages.map((r) => (
          <button
            key={r.label}
            onClick={() => setPreview(r)}
            className="group relative overflow-hidden rounded-3xl bg-card shadow-soft hover:shadow-glow transition text-left"
          >
            <div className="aspect-[4/3] overflow-hidden">
              <img src={r.src} alt={r.label} loading="lazy" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
            </div>
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-foreground/80 to-transparent p-4">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-white">
                <ImageIcon className="h-3.5 w-3.5" /> {r.label}
              </div>
            </div>
          </button>
        ))}
      </div>

      {preview && (
        <div
          className="fixed inset-0 z-[60] grid place-items-center bg-foreground/70 p-4 backdrop-blur-sm animate-fade-up"
          onClick={() => setPreview(null)}
        >
          <div className="relative max-w-3xl w-full" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setPreview(null)}
              aria-label="Close preview"
              className="absolute -top-3 -right-3 z-10 grid h-10 w-10 place-items-center rounded-full bg-card text-foreground shadow-glow hover:scale-110 transition"
            >
              <X className="h-5 w-5" />
            </button>
            <img src={preview.src} alt={preview.label} className="w-full rounded-3xl shadow-glow" />
            <div className="mt-3 text-center text-sm font-medium text-white">{preview.label}</div>
          </div>
        </div>
      )}
    </Section>
  );
}