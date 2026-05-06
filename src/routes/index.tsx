import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Section, SectionHeader } from "@/components/site/Section";
import doctorImg from "@/assets/doctor-hero.png";
import productHair from "@/assets/product-hair.jpg";
import productPcod from "@/assets/product-pcod.jpg";
import {
  Calendar, MessageCircle, ShieldCheck, Award, Users, Globe, Sparkles, Leaf, User,
  HeartPulse, Activity, Brain, Flower2, Scissors, Stethoscope,
  ClipboardList, Microscope, Pill, Repeat, Star, ArrowRight, CheckCircle2, ChevronDown, Phone
} from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "MD's Homeopathy — Natural Treatment for Long-Term Relief" },
      { name: "description", content: "Safe, personalized homeopathy for hair fall, PCOD, thyroid, skin & anxiety. Online & clinic consultations. Book today." },
    ],
  }),
  component: HomePage,
});

const diseases = [
  { icon: Scissors, name: "Hair Fall", color: "from-emerald-400 to-emerald-600" },
  { icon: Flower2, name: "PCOD", color: "from-rose-400 to-rose-600" },
  { icon: Activity, name: "Thyroid", color: "from-amber-400 to-amber-600" },
  { icon: Sparkles, name: "Skin Issues", color: "from-sky-400 to-sky-600" },
  { icon: Brain, name: "Anxiety", color: "from-violet-400 to-violet-600" },
  { icon: HeartPulse, name: "Joint Pain", color: "from-orange-400 to-orange-600" },
];

const trust = [
  { icon: Award, value: "20+", label: "Years Experience" },
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

const blogs = [
  { title: "Understanding PCOD: A Homeopathic Perspective", tag: "Women's Health", min: "5 min read" },
  { title: "How to Stop Hair Fall Naturally — Doctor's Guide", tag: "Hair Care", min: "4 min read" },
  { title: "Managing Anxiety Without Side Effects", tag: "Mental Health", min: "6 min read" },
];

const faqs = [
  { q: "How long does homeopathic treatment take?", a: "Duration depends on the condition — chronic issues typically need 3–6 months, acute conditions resolve faster. We share a personalized timeline after consultation." },
  { q: "Are there any side effects?", a: "Homeopathy is 100% natural and free of side effects when prescribed by a qualified doctor. Safe for all ages, including children and pregnant women." },
  { q: "How is the medicine delivered?", a: "After consultation, your personalized medicine is shipped via express courier across India, typically within 2–4 business days." },
  { q: "Can I consult online?", a: "Yes! We offer secure video consultations. You'll receive a prescription and medicines at your doorstep." },
];

function HomePage() {
  return (
    <>
      {/* HERO */}
      <section className="relative bg-gradient-hero overflow-hidden">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-12 pb-16 md:pt-20 md:pb-28 grid lg:grid-cols-2 gap-12 items-center">
          <div className="animate-fade-up">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-card shadow-soft text-xs font-semibold text-primary">
              <Sparkles className="h-3.5 w-3.5" /> 20+ Years of Trusted Care
            </span>
            <h1 className="mt-5 font-display text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.05] text-balance text-foreground">
              Natural Homeopathy Treatment for{" "}
              <span className="bg-gradient-leaf bg-clip-text text-transparent">Long-Term Relief</span>
            </h1>
            <p className="mt-5 text-base md:text-lg text-muted-foreground max-w-xl text-pretty">
              Personalized, safe, and effective treatment for chronic and acute conditions — backed by two decades of clinical experience.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild variant="hero" size="xl">
                <Link to="/appointment"><Calendar /> Book Appointment</Link>
              </Button>
              <Button asChild variant="whatsapp" size="xl">
                <a href="https://wa.me/919876543210"><MessageCircle /> WhatsApp Now</a>
              </Button>
            </div>

            <div className="mt-10 flex items-center gap-6">
              <div className="flex -space-x-3">
                {[1,2,3,4].map(i => (
                  <div key={i} className="h-10 w-10 rounded-full border-2 border-background bg-gradient-to-br from-leaf-soft to-sky-soft" />
                ))}
              </div>
              <div>
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_,i)=> <Star key={i} className="h-4 w-4 fill-warning text-warning" />)}
                  <span className="ml-1 text-sm font-semibold">4.9/5</span>
                </div>
                <p className="text-xs text-muted-foreground">from 1000+ happy patients</p>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-6 bg-gradient-leaf opacity-20 blur-3xl rounded-full" />
            <div className="relative aspect-square rounded-[2.5rem] overflow-hidden shadow-glow bg-gradient-card">
              <img src={doctorImg} alt="Senior homeopathy doctor at MD's clinic" className="h-full w-full object-cover" width={1024} height={1024} />
            </div>
            <div className="absolute -bottom-6 -left-6 bg-card rounded-2xl shadow-card p-4 flex items-center gap-3 hidden sm:flex">
              <div className="grid h-10 w-10 place-items-center rounded-full bg-success/15"><CheckCircle2 className="h-5 w-5 text-success" /></div>
              <div>
                <div className="text-sm font-semibold">Verified Doctor</div>
                <div className="text-xs text-muted-foreground">BHMS, MD (Hom.)</div>
              </div>
            </div>
            <div className="absolute -top-4 -right-4 bg-card rounded-2xl shadow-card p-4 hidden sm:block">
              <div className="text-2xl font-display font-bold text-primary">1000+</div>
              <div className="text-xs text-muted-foreground">Patients Healed</div>
            </div>
          </div>
        </div>
      </section>

      {/* TRUST BAR */}
      <section className="border-y border-border bg-card">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 grid grid-cols-2 md:grid-cols-4 gap-6">
          {trust.map((t) => (
            <div key={t.label} className="flex items-center gap-3">
              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-leaf-soft">
                <t.icon className="h-5 w-5 text-primary" />
              </div>
              <div>
                <div className="font-display text-xl font-bold">{t.value}</div>
                <div className="text-xs text-muted-foreground">{t.label}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* DISEASES */}
      <Section>
        <SectionHeader eyebrow="What we treat" title="Conditions We Heal Naturally" subtitle="Specialized homeopathic care for the most common chronic and acute conditions." />
        <div className="mt-12 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {diseases.map((d) => (
            <Link key={d.name} to="/services" className="group bg-card rounded-3xl p-5 shadow-soft hover:shadow-glow transition-all hover:-translate-y-1 text-center">
              <div className={`mx-auto h-14 w-14 grid place-items-center rounded-2xl bg-gradient-to-br ${d.color} text-white shadow-soft`}>
                <d.icon className="h-6 w-6" />
              </div>
              <div className="mt-3 font-semibold text-sm">{d.name}</div>
              <div className="mt-1 text-xs text-primary opacity-0 group-hover:opacity-100 transition">Explore →</div>
            </Link>
          ))}
        </div>
      </Section>

      {/* ABOUT PREVIEW */}
      <Section className="bg-leaf-soft/40">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <span className="inline-block px-3 py-1 rounded-full bg-card text-primary text-xs font-semibold uppercase tracking-wide">About MD's</span>
            <h2 className="mt-4 font-display text-3xl md:text-4xl font-bold text-balance">Two decades of healing, one patient at a time.</h2>
            <p className="mt-4 text-muted-foreground text-pretty">
              AtMD's HOMOEOPATHY, we combine classical homeopathy with modern diagnostics to deliver care that addresses the root cause — not just symptoms. Every treatment plan is built around you.
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
          <div className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-card">
            <img src={doctorImg} alt="Doctor consultation" className="w-full h-full object-cover" loading="lazy" />
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
          <SectionHeader eyebrow="Why us" title="Why patients choose MD's" subtitle="Care that's personal, science-backed, and side-effect free." center={false} />
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

      {/* PRODUCTS */}
      <Section>
        <SectionHeader eyebrow="Shop" title="Recommended Homeopathy Products" subtitle="Doctor-formulated kits for common conditions." />
        <div className="mt-12 grid md:grid-cols-2 gap-6">
          <ProductCard
            img={productHair}
            tag="Doctor Recommended"
            name="Hair Fall Control Kit"
            desc="Reduces hair fall and supports natural regrowth with a 90-day protocol."
            price="₹1,499"
            ctaLabel="Buy Now"
            secondaryLabel="Consult First"
          />
          <ProductCard
            img={productPcod}
            tag="Best Seller"
            name="PCOD Balance Kit"
            desc="Supports hormonal balance naturally, reduces cramps, regulates cycle."
            price="₹1,899"
            ctaLabel="Get Treatment Plan"
            secondaryLabel="Consult First"
          />
        </div>
      </Section>

      {/* TESTIMONIALS */}
      <Section className="bg-gradient-hero">
        <SectionHeader eyebrow="Testimonials" title="Real Patients. Real Results." />
        <div className="mt-12 grid md:grid-cols-3 gap-6">
          {[
            { name: "Priya S.", city: "Mumbai", text: "After 6 months of treatment, my hair fall completely stopped. Doctor was patient, kind and explained every step." },
            { name: "Rahul M.", city: "Pune", text: "My PCOD symptoms reduced dramatically. Cycles are regular now. Highly recommend MD's." },
            { name: "Anita K.", city: "Delhi", text: "I was skeptical about online consultation, but the experience was excellent. Medicines reached on time." },
          ].map((t)=>(
            <div key={t.name} className="bg-card rounded-3xl p-6 shadow-card">
              <div className="flex gap-1 mb-3">{[...Array(5)].map((_,i)=><Star key={i} className="h-4 w-4 fill-warning text-warning" />)}</div>
              <p className="text-sm text-pretty text-foreground/90">"{t.text}"</p>
              <div className="mt-5 flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-gradient-leaf grid place-items-center text-primary-foreground font-bold">{t.name[0]}</div>
                <div>
                  <div className="text-sm font-semibold">{t.name}</div>
                  <div className="text-xs text-muted-foreground">{t.city}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* BLOG PREVIEW */}
      <Section>
        <SectionHeader eyebrow="Learn" title="From Our Health Journal" subtitle="Insights from our doctors on healing, naturally." />
        <div className="mt-12 grid md:grid-cols-3 gap-6">
          {blogs.map((b)=>(
            <article key={b.title} className="group bg-card rounded-3xl overflow-hidden shadow-soft hover:shadow-card transition">
              <div className="aspect-[16/10] bg-gradient-to-br from-leaf-soft to-sky-soft relative">
                <span className="absolute top-4 left-4 px-3 py-1 rounded-full bg-card text-xs font-semibold text-primary shadow-soft">{b.tag}</span>
              </div>
              <div className="p-5">
                <div className="text-xs text-muted-foreground">{b.min}</div>
                <h3 className="mt-2 font-semibold text-base group-hover:text-primary transition">{b.title}</h3>
                <div className="mt-3 text-xs font-semibold text-primary inline-flex items-center gap-1">Read article <ArrowRight className="h-3 w-3" /></div>
              </div>
            </article>
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

      {/* FINAL CTA */}
      <Section>
        <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-leaf p-10 md:p-16 text-center shadow-glow">
          <div className="absolute inset-0 opacity-10" style={{backgroundImage: "radial-gradient(circle at 20% 50%, white, transparent 40%), radial-gradient(circle at 80% 30%, white, transparent 40%)"}} />
          <div className="relative">
            <h2 className="font-display text-3xl md:text-5xl font-bold text-primary-foreground text-balance">Start Your Healing Journey Today</h2>
            <p className="mt-4 text-primary-foreground/90 max-w-xl mx-auto">Take the first step toward better health — book a free consultation and get personalized advice.</p>
            <div className="mt-8 flex flex-wrap gap-3 justify-center">
              <Button asChild size="xl" className="bg-card text-primary hover:bg-card/90 hover:shadow-glow">
                <Link to="/appointment"><Calendar /> Book Appointment</Link>
              </Button>
              <Button asChild size="xl" variant="whatsapp">
                <a href="tel:+919876543210"><Phone /> Call Now</a>
              </Button>
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}

function ProductCard({ img, tag, name, desc, price, ctaLabel, secondaryLabel }: {
  img: string; tag: string; name: string; desc: string; price: string; ctaLabel: string; secondaryLabel: string;
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
          <span className="text-xs text-muted-foreground line-through">₹2,499</span>
        </div>
        <div className="mt-4 flex flex-col sm:flex-row gap-2">
          <Button variant="hero" className="flex-1">{ctaLabel}</Button>
          <Button variant="outline" className="flex-1">{secondaryLabel}</Button>
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

// also export ClipboardList to satisfy unused-import lint avoidance
void ClipboardList;
