import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Section, SectionHeader } from "@/components/site/Section";
import heroBg from "@/assets/hero-clinic-bg.jpg";
import { Stethoscope, ClipboardList, Microscope, Pill, Heart, CheckCircle2, Calendar } from "lucide-react";

export const Route = createFileRoute("/treatments")({
  head: () => ({
    meta: [
      { title: "Our Treatments — Homeopathic Treatment Process | MD's" },
      { name: "description", content: "Learn about our 5-step treatment process and why patients choose MD's Homoeopathy  for safe, natural healing." },
      { property: "og:title", content: "Homeopathic Treatment Process — MD's" },
      { property: "og:description", content: "Personalized treatment plans for chronic and acute conditions." },
    ],
  }),
  component: TreatmentsPage,
});

function TreatmentsPage() {
  return (
    <>
      <section style={{ backgroundImage: `url(${heroBg})`, backgroundSize: "cover", backgroundPosition: "center", backgroundRepeat: "no-repeat" }}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 md:py-24 text-center">
          <span className="inline-block px-4 py-1.5 rounded-full bg-card shadow-soft text-xs font-semibold text-primary uppercase tracking-wide">Treatments Overview</span>
          <h1 className="mt-5 font-display text-4xl md:text-6xl font-bold text-balance">Specialized Homeopathic Treatments</h1>
          <p className="mt-5 max-w-2xl mx-auto text-lg text-muted-foreground text-pretty">From chronic to acute — care designed around the unique constitution of every patient.</p>
        </div>
      </section>

      <Section>
        <SectionHeader eyebrow="Conditions We Treat" title="Safe, natural, and side-effect-free healing" center={false} />
        <p className="mt-4 text-muted-foreground text-pretty max-w-4xl">We provide specialized homeopathic treatment for acute and chronic health conditions with a focus on safe, natural, and side-effect-free healing. Once your appointment is scheduled, our doctors begin a personalized treatment journey designed specifically for your health concerns. With proper consultation, regular medicines, and guided follow-ups, many patients begin to feel positive improvements within the first few weeks of treatment.</p>
      </Section>

      <Section className="bg-leaf-soft/40">
        <SectionHeader eyebrow="Five-Step Treatment Path" title="Your journey to natural healing" />
        <div className="mt-12 grid md:grid-cols-5 gap-4">
          {[
            { i: Stethoscope, t: "Listen", d: "After your appointment is confirmed, we carefully listen to your symptoms, medical history, lifestyle, and health concerns through a detailed consultation." },
            { i: ClipboardList, t: "Analyze", d: "Our doctors deeply analyze your physical, emotional, and mental health condition to understand the root cause of the problem." },
            { i: Microscope, t: "Diagnose", d: "Based on your consultation and analysis, we prepare a personalized diagnosis and treatment approach focused on long-term healing." },
            { i: Pill, t: "Prescribe", d: "Customized homeopathic medicines and wellness guidance are provided according to your individual condition and body response." },
            { i: Heart, t: "Follow-up", d: "Regular follow-ups help us monitor your recovery and adjust treatment whenever needed. Many patients start feeling better after the initial medicines and gradually experience noticeable improvement in their overall health and well-being." },
          ].map(({i:Ic,t,d}, idx)=>(
            <div key={t} className="bg-card rounded-3xl p-6 shadow-soft text-center">
              <div className="mx-auto h-12 w-12 grid place-items-center rounded-2xl bg-leaf-soft"><Ic className="h-5 w-5 text-primary" /></div>
              <div className="mt-3 text-xs font-bold text-primary">STEP {idx+1}</div>
              <div className="font-semibold text-lg mt-2">{t}</div>
              <p className="mt-3 text-sm text-muted-foreground">{d}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section>
        <SectionHeader eyebrow="Why Choose MD's Homoeopathy " title="Why Patients Trust Us" />
        <div className="mt-12 grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {[
            "Personalized treatment plans",
            "Safe and natural medicines",
            "Holistic healing approach",
            "Experienced medical guidance",
            "Focus on root cause treatment",
            "Suitable for all age groups",
            "Compassionate patient care",
            "Long-term wellness support"
          ].map(value => (
            <div key={value} className="flex gap-3 items-start">
              <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
              <span className="text-muted-foreground">{value}</span>
            </div>
          ))}
        </div>
      </Section>

      <Section className="bg-sky-soft/40">
        <div className="rounded-3xl bg-gradient-leaf p-10 md:p-14 text-center shadow-glow">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-primary-foreground">Ready to start your healing journey?</h2>
          <p className="text-primary-foreground/90 mt-3">Book your personalized consultation today.</p>
          <Button asChild size="xl" className="mt-6 bg-card text-primary hover:bg-card/90"><Link to="/appointment">Book Appointment <Calendar className="ml-2 h-4 w-4" /></Link></Button>
        </div>
      </Section>
    </>
  );
}