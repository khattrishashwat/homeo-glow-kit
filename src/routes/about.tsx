import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Section, SectionHeader } from "@/components/site/Section";
import doctorImg from "@/assets/doctor-heros.png";
import clinicImg from "@/assets/clinic.jpg";
import { Award, Users, ShieldCheck, Heart, Leaf, Microscope, Stethoscope, ClipboardList, Pill, CheckCircle2, Star, ArrowRight, Calendar } from "lucide-react";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "AboutMD's HOMOEOPATHY — 20+ Years of Trusted Care" },
      { name: "description", content: "Learn about our clinic, our doctors, and our root-cause approach to homeopathic healing." },
      { property: "og:title", content: "AboutMD's HOMOEOPATHY" },
      { property: "og:description", content: "20+ years, 1000+ patients. Personalized homeopathy with a root-cause approach." },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <>
      <section className="bg-gradient-hero">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 md:py-24 text-center">
          <span className="inline-block px-4 py-1.5 rounded-full bg-card shadow-soft text-xs font-semibold text-primary uppercase tracking-wide">About Us</span>
          <h1 className="mt-5 font-display text-4xl md:text-6xl font-bold text-balance">20+ Years of Trusted Homeopathy Care</h1>
          <p className="mt-5 max-w-2xl mx-auto text-lg text-muted-foreground text-pretty">A clinic built on classical homeopathy, modern diagnostics, and deep human empathy.</p>
        </div>
      </section>

      <Section>
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <img src={clinicImg} alt="MD's Homeopathy clinic interior" className="rounded-3xl shadow-card object-cover w-full aspect-[5/4]" loading="lazy" />
          <div>
            <SectionHeader eyebrow="Our clinic" title="A safe, modern space for natural healing" center={false} />
            <p className="mt-4 text-muted-foreground text-pretty">Founded in 2003,MD's HOMOEOPATHY is a multi-specialty clinic dedicated to chronic disease management through classical homeopathy. Our team combines 20+ years of clinical experience with continuous research.</p>
            <div className="mt-6 grid grid-cols-2 gap-4">
              {[{i:Award,t:"BHMS & MD certified"},{i:Heart,t:"Patient-first ethos"},{i:Leaf,t:"100% natural remedies"},{i:ShieldCheck,t:"NABH-aligned protocols"}].map(({i:Ic,t})=>(
                <div key={t} className="flex gap-3 items-center text-sm"><div className="h-9 w-9 grid place-items-center rounded-xl bg-leaf-soft"><Ic className="h-4 w-4 text-primary" /></div>{t}</div>
              ))}
            </div>
          </div>
        </div>
      </Section>

      <Section className="bg-leaf-soft/40">
        <SectionHeader eyebrow="Philosophy" title="Heal the cause, not the symptom" subtitle="We believe true healing happens when we treat the person — not just the disease." />
        <div className="mt-12 grid md:grid-cols-3 gap-6">
          {[
            { i: Microscope, t: "Root-Cause Diagnosis", d: "We dig deeper to understand triggers, lifestyle, and emotional health." },
            { i: Heart, t: "Personalized Care", d: "Every patient gets a remedy mix tailored to their unique constitution." },
            { i: Leaf, t: "Gentle & Natural", d: "Zero side effects. Safe for children, elderly, and pregnant women." },
          ].map(({i:Ic,t,d}) => (
            <div key={t} className="bg-card rounded-3xl p-6 shadow-soft">
              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-leaf text-primary-foreground"><Ic className="h-5 w-5" /></div>
              <h3 className="mt-4 font-semibold text-lg">{t}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{d}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section>
        <SectionHeader eyebrow="Our story" title="Why we started MD's" />
        <div className="mt-10 max-w-3xl mx-auto space-y-6 text-muted-foreground text-pretty">
          <p>Two decades ago, Dr. Mehta started MD's with a single belief: medicine should heal, not mask. After years of seeing patients shuffle from one prescription to another, he set out to build a clinic where time, listening, and personalization came first.</p>
          <p>Today, that belief drives a team of four doctors and a network of patients across India — many of whom we've watched grow from chronic illness to complete recovery.</p>
        </div>
      </Section>

      <Section className="bg-sky-soft/40">
        <SectionHeader eyebrow="Meet the doctor" title="Dr. Aarav Mehta" subtitle="Senior Homeopath · BHMS, MD (Hom.) · 20+ years experience" />
        <div className="mt-10 grid lg:grid-cols-2 gap-10 items-center">
          <div className="relative max-w-md mx-auto">
            <div className="absolute -inset-4 bg-gradient-leaf opacity-20 blur-2xl rounded-full" />
            <img src={doctorImg} alt="Dr. Aarav Mehta" className="relative rounded-3xl shadow-card aspect-square object-cover w-full" loading="lazy" />
          </div>
          <div>
            <p className="text-muted-foreground text-pretty">Dr. Mehta specializes in chronic conditions including PCOD, thyroid disorders, autoimmune diseases, and dermatological issues. His patient-first approach has helped thousands return to a life of balance and vitality.</p>
            <ul className="mt-6 space-y-3">
              {["Specialist in PCOD, Thyroid & Skin","Published in 12+ medical journals","International conference speaker","Member, Central Council of Homeopathy"].map(t=>(
                <li key={t} className="flex gap-2 items-center text-sm"><CheckCircle2 className="h-4 w-4 text-primary" />{t}</li>
              ))}
            </ul>
            <Button asChild variant="hero" size="lg" className="mt-8"><Link to="/appointment"><Calendar /> Book a Consultation</Link></Button>
          </div>
        </div>
      </Section>

      <Section>
        <SectionHeader eyebrow="Our approach" title="Five-step treatment path" />
        <div className="mt-12 grid md:grid-cols-5 gap-4">
          {[
            { i: Stethoscope, t: "Listen" }, { i: ClipboardList, t: "Analyze" }, { i: Microscope, t: "Diagnose" }, { i: Pill, t: "Prescribe" }, { i: Heart, t: "Follow-up" },
          ].map(({i:Ic,t}, idx)=>(
            <div key={t} className="bg-card rounded-3xl p-6 shadow-soft text-center">
              <div className="mx-auto h-12 w-12 grid place-items-center rounded-2xl bg-leaf-soft"><Ic className="h-5 w-5 text-primary" /></div>
              <div className="mt-3 text-xs font-bold text-primary">STEP {idx+1}</div>
              <div className="font-semibold">{t}</div>
            </div>
          ))}
        </div>
      </Section>

      <Section className="bg-leaf-soft/40">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[{v:"1000+",l:"Patients Treated"},{v:"20+",l:"Years Experience"},{v:"4.9★",l:"Avg. Rating"},{v:"30+",l:"Cities Served"}].map(s=>(
            <div key={s.l} className="bg-card rounded-3xl p-6 text-center shadow-soft">
              <div className="font-display text-3xl md:text-4xl font-bold text-primary">{s.v}</div>
              <div className="text-sm text-muted-foreground mt-1">{s.l}</div>
            </div>
          ))}
        </div>
      </Section>

      <Section>
        <SectionHeader eyebrow="What patients say" title="Stories of healing" />
        <div className="mt-10 grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {[{n:"Sneha R.",t:"Dr. Mehta changed my life. After years of struggle with thyroid, I finally feel myself again."},
            {n:"Karan T.",t:"The team is incredibly thorough. My skin condition is 90% better in just 4 months."}].map(x=>(
            <div key={x.n} className="bg-card rounded-3xl p-6 shadow-soft">
              <div className="flex gap-1 mb-3">{[...Array(5)].map((_,i)=><Star key={i} className="h-4 w-4 fill-warning text-warning" />)}</div>
              <p className="text-sm">"{x.t}"</p>
              <div className="mt-4 text-sm font-semibold">{x.n}</div>
            </div>
          ))}
        </div>
      </Section>

      <Section className="bg-sky-soft/40">
        <SectionHeader eyebrow="Certifications" title="Recognized & accredited" />
        <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-4">
          {["BHMS","MD (Hom.)","CCH Member","ISO 9001"].map(c=>(
            <div key={c} className="bg-card rounded-2xl py-8 text-center shadow-soft font-display font-bold text-primary">{c}</div>
          ))}
        </div>
      </Section>

      <Section>
        <div className="rounded-3xl bg-gradient-leaf p-10 md:p-14 text-center shadow-glow">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-primary-foreground">Ready to start healing?</h2>
          <Button asChild size="xl" className="mt-6 bg-card text-primary hover:bg-card/90"><Link to="/appointment">Book Appointment <ArrowRight /></Link></Button>
        </div>
      </Section>
    </>
  );
}
