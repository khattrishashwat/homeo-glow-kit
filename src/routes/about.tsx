import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Section, SectionHeader } from "@/components/site/Section";
import godfatherImg from "@/assets/godfathers.jpeg";

import clinicImg from "@/assets/clinic.jpg";
import { Award, Users, ShieldCheck, Heart, Leaf, Microscope, Stethoscope, ClipboardList, Pill, CheckCircle2, Star, ArrowRight, Calendar } from "lucide-react";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About MD's HOMOEOPATHY — 20+ Years of Trusted Care" },
      { name: "description", content: "Learn about our clinic, our doctors, and our root-cause approach to homeopathic healing." },
      { property: "og:title", content: "About MD's HOMOEOPATHY" },
      { property: "og:description", content: "20+ years, 1000+ patients. Personalized Homoeopathy  with a root-cause approach." },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <>
      <section style={{ backgroundImage: `url(${heroBg})`, backgroundSize: "cover", backgroundPosition: "center", backgroundRepeat: "no-repeat" }}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 md:py-24 text-center">
          <span className="inline-block px-4 py-1.5 rounded-full bg-card shadow-soft text-xs font-semibold text-primary uppercase tracking-wide">About Us</span>
          <h1 className="mt-5 font-display text-4xl md:text-6xl font-bold text-balance">20+ Years of Trusted Homoeopathy  Care</h1>
          <p className="mt-5 max-w-2xl mx-auto text-lg text-muted-foreground text-pretty">A clinic built on classical Homoeopathy , modern diagnostics, and deep human empathy.</p>
        </div>
      </section>
<Section>
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
    
    {/* Left Content */}
    <div>
      <p className="text-primary font-semibold uppercase tracking-wide mb-3">
        In The Loving Memory of
      </p>

      <h2 className="text-4xl md:text-5xl font-bold leading-tight">
        Late Smt. Manjusha Bhargava
      </h2>

      <p className="mt-6 text-muted-foreground text-lg leading-relaxed">
        The name MD's HOMOEOPATHY is dedicated to the loving memory of our
        beloved Mother, Late Smt. Manjusha Bhargava. Her values, kindness,
        and inspiration continue to guide us in serving humanity with
        compassion and care.
      </p>

      <div className="mt-10">
        <p className="text-primary font-semibold uppercase tracking-wide mb-3">
          In The Loving Memory of
        </p>

        <h2 className="text-4xl md:text-5xl font-bold leading-tight">
          Late Dr. Durgendra Nath Bhargava
        </h2>

        <p className="mt-6 text-muted-foreground text-lg leading-relaxed">
          The name MD's HOMOEOPATHY is also dedicated to the loving memory of
          our beloved Father, Late Dr. Durgendra Nath Bhargava. He was a
          respected Researcher and Professor at Pt. Deen Dayal Upadhyay
          Veterinary College, Mathura. His dedication to education,
          research, and healing remains a constant source of inspiration
          for us.
        </p>
      </div>
    </div>

    {/* Right Image */}
    <div className="flex justify-center lg:justify-end">
      <img
                          src={godfatherImg}
        alt="Late Smt. Manjusha Bhargava and Late Dr. Durgendra Nath Bhargava"
        className="w-full max-w-md rounded-3xl shadow-2xl object-cover"
      />
    </div>

  </div>
</Section>

      <Section>
        <SectionHeader eyebrow="Our Mission" title="Safe, natural, and effective healthcare with compassion" />
        <p className="mt-8 max-w-3xl mx-auto text-muted-foreground text-pretty text-center">At MD's Homoeopathy , our mission is to provide safe, natural, and effective homeopathic treatment with compassion and trust. We are committed to improving the health and well-being of every patient through personalized care, holistic healing, and long-term wellness solutions. Our goal is to make quality homeopathic healthcare accessible while maintaining the highest standards of ethics, dedication, and patient satisfaction.</p>
      </Section>

      <Section className="bg-leaf-soft/40">
        <SectionHeader eyebrow="Core Values" title="Principles that guide our practice" />
        <div className="mt-12 grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {[
            "Patient-first approach with compassionate care",
            "Commitment to natural and holistic healing",
            "Trust, transparency, and ethical medical practice",
            "Personalized treatment for every individual",
            "Continuous learning and medical excellence",
            "Dedication to long-term health and wellness",
            "Respect, empathy, and professionalism in healthcare"
          ].map(value => (
            <div key={value} className="flex gap-3 items-start">
              <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
              <span className="text-muted-foreground">{value}</span>
            </div>
          ))}
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
        <SectionHeader eyebrow="Our story" title="Why We Started MD's HOMOEOPATHY" />
        <div className="mt-10 max-w-3xl mx-auto space-y-6 text-muted-foreground text-pretty">
          <p>Two decades ago, Dr. Mehta started MD's with a single belief: medicine should heal, not mask. After years of seeing patients shuffle from one prescription to another, he set out to build a clinic where time, listening, and personalization came first.</p>
          <p>Today, that belief drives a team of four doctors and a network of patients across India — many of whom we've watched grow from chronic illness to complete recovery.</p>
        </div>
      </Section>

      <Section className="bg-sky-soft/40">
        <SectionHeader eyebrow="Meet the doctor" title="Dr. Parth Bhargava" subtitle="Senior Homeopath · BHMS, MD (Hom.) · 20+ years experience" />
        <div className="mt-10 grid lg:grid-cols-2 gap-10 items-center">
          <div className="relative max-w-md mx-auto w-full">
            <div className="absolute -inset-4 bg-gradient-sky opacity-15 blur-2xl rounded-full" />
            <div className="relative rounded-3xl shadow-card aspect-square w-full bg-gradient-hero grid place-items-center p-10 text-center">
              <div>
                <div className="mx-auto inline-flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-sky text-primary-foreground shadow-glow">
                  <CheckCircle2 className="h-9 w-9" />
                </div>
                <p className="mt-5 font-display text-3xl text-foreground">Dr. Parth Bhargava</p>
                <p className="mt-1 text-sm text-muted-foreground">BHMS · Homoeopathic Consultant</p>
                <p className="mt-4 text-xs uppercase tracking-wider text-primary font-semibold">5000+ Patients Treated</p>
              </div>
            </div>
          </div>
          <div>
            <p className="text-muted-foreground text-pretty">Dr. Parth Bhargava specializes in chronic conditions including PCOD, thyroid disorders, autoimmune diseases, and dermatological issues. His patient-first approach has helped thousands return to a life of balance and vitality.</p>
            <ul className="mt-6 space-y-3">
              {["Specialist in PCOD, Thyroid & Skin","Published in 12+ medical journals","International conference speaker","Member, Central Council of Homoeopathy "].map(t=>(
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
          {[{v:"1000+",l:"Patients Treated"},{v:"5+",l:"Years Experience"},{v:"4.9★",l:"Avg. Rating"},{v:"30+",l:"Cities Served"}].map(s=>(
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
