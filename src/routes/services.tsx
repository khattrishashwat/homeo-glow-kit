import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Section, SectionHeader } from "@/components/site/Section";
import heroBg from "@/assets/hero-clinic-bg.jpg";
import { Scissors, Flower2, Activity, Sparkles, Brain, HeartPulse, Bone, Wind, Baby, ArrowRight, CheckCircle2 } from "lucide-react";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "Our Services — Homeopathic Treatments | MD's" },
      { name: "description", content: "Specialized Homoeopathy  for hair fall, PCOD, thyroid, skin, anxiety, joint pain, asthma & pediatric care." },
      { property: "og:title", content: "Homeopathic Services — MD's" },
      { property: "og:description", content: "Personalized treatment plans for chronic and acute conditions." },
    ],
  }),
  component: ServicesPage,
});

const services = [
  { i: Scissors, t: "Hair Fall & Hair Loss", d: "Stop hair fall and stimulate natural regrowth with constitutional remedies." },
  { i: Flower2, t: "PCOD & PCOS", d: "Restore hormonal balance, regulate cycles, reduce cysts naturally." },
  { i: Activity, t: "Thyroid Disorders", d: "Manage hypo & hyperthyroid conditions with personalized care." },
  { i: Sparkles, t: "Skin Conditions", d: "Eczema, psoriasis, acne, vitiligo — gentle long-term treatment." },
  { i: Brain, t: "Anxiety & Stress", d: "Mental wellness without sedation or dependence." },
  { i: HeartPulse, t: "Cardiac Wellness", d: "Support for blood pressure, cholesterol and heart health." },
  { i: Bone, t: "Joint & Arthritis Pain", d: "Reduce inflammation and improve mobility naturally." },
  { i: Wind, t: "Asthma & Allergies", d: "Build immunity and reduce frequency of attacks." },
  { i: Baby, t: "Pediatric Care", d: "Safe homeopathic care for infants and children." },
];

function ServicesPage() {
  return (
    <>
      <section style={{ backgroundImage: `url(${heroBg})`, backgroundSize: "cover", backgroundPosition: "center", backgroundRepeat: "no-repeat" }}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 md:py-24 text-center">
          <span className="inline-block px-4 py-1.5 rounded-full bg-card shadow-soft text-xs font-semibold text-primary uppercase tracking-wide">Services</span>
          <h1 className="mt-5 font-display text-4xl md:text-6xl font-bold text-balance">Specialized Homeopathic Treatments</h1>
          <p className="mt-5 max-w-2xl mx-auto text-lg text-muted-foreground text-pretty">From chronic to acute — care designed around the unique constitution of every patient.</p>
        </div>
      </section>

      <Section>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map(({i:Ic,t,d}) => (
            <div key={t} className="group bg-card rounded-3xl p-6 shadow-soft hover:shadow-card transition hover:-translate-y-1">
              <div className="grid h-14 w-14 place-items-center rounded-2xl bg-gradient-leaf text-primary-foreground shadow-soft"><Ic className="h-6 w-6" /></div>
              <h3 className="mt-5 font-display text-xl font-bold">{t}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{d}</p>
              <ul className="mt-4 space-y-1.5">
                {["Free first consultation","Personalized remedies","Doorstep delivery"].map(x=>(
                  <li key={x} className="flex gap-2 items-center text-xs"><CheckCircle2 className="h-3.5 w-3.5 text-primary" />{x}</li>
                ))}
              </ul>
              <Link to="/appointment" className="mt-5 inline-flex text-sm font-semibold text-primary items-center gap-1 group-hover:gap-2 transition-all">Book consultation <ArrowRight className="h-4 w-4" /></Link>
            </div>
          ))}
        </div>
      </Section>

      <Section className="bg-leaf-soft/40">
        <div className="rounded-3xl bg-gradient-leaf p-10 md:p-14 text-center shadow-glow">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-primary-foreground">Not sure which service you need?</h2>
          <p className="text-primary-foreground/90 mt-3">Book a free 15-minute discovery call with our doctor.</p>
          <Button asChild size="xl" className="mt-6 bg-card text-primary hover:bg-card/90"><Link to="/appointment">Book Free Call</Link></Button>
        </div>
      </Section>
    </>
  );
}
