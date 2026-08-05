import { createFileRoute, Link } from "@tanstack/react-router";
import { Helmet } from "react-helmet-async";
import {
  ArrowLeft,
  ArrowRight,
  Calendar,
  CheckCircle2,
  MessageCircle,
  Phone,
  PlayCircle,
  FlaskConical,
  Stethoscope,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Section } from "@/components/site/Section";
import { VideoGallery } from "@/components/site/VideoGallery";
import { conditions, getConditionBySlug } from "@/data/conditions";

export const Route = createFileRoute("/conditions/$slug")({
  component: ConditionDetailPage,
});

function ConditionDetailPage() {
  const { slug } = Route.useParams();
  const condition = getConditionBySlug(slug);

  if (!condition) {
    return (
      <div className="min-h-screen bg-background px-4 py-24 text-center">
        <h1 className="font-display text-3xl font-bold text-destructive">
          Condition Not Found
        </h1>
        <p className="mt-4 text-muted-foreground">
          The condition you are looking for does not exist.
        </p>
        <Button asChild className="mt-6 rounded-full">
          <Link to="/">Back to Home</Link>
        </Button>
      </div>
    );
  }

  const Icon = condition.icon;
  const others = conditions.filter((c) => c.slug !== condition.slug).slice(0, 3);

  return (
    <>
      <Helmet>
        <title>{condition.name} Treatment | MD's Homoeopathy </title>
        <meta name="description" content={condition.shortDescription} />
      </Helmet>

      {/* BANNER WITH HIGH-READABILITY OVERLAY */}
      <section className="relative overflow-hidden">
        <img
          src={condition.banner}
          alt={`${condition.name} homeopathic treatment`}
          className="absolute inset-0 h-full w-full object-cover"
        />
        {/* Soft Theme Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/85 to-background/60" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 md:py-28">
          <Link
            to="/"
            className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline mb-4"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Home
          </Link>
          
          <div className="flex items-center gap-4">
            <div
              className={`grid h-16 w-16 place-items-center rounded-2xl bg-gradient-to-br ${condition.color} text-white shadow-glow`}
            >
              <Icon className="h-8 w-8" />
            </div>
            <span className="rounded-full bg-leaf-soft px-4 py-1.5 text-xs font-bold uppercase tracking-wide text-primary shadow-soft">
              Conditions We Heal Naturally
            </span>
          </div>

          <h1 className="mt-6 max-w-2xl font-display text-4xl md:text-6xl font-bold text-balance text-foreground">
            {condition.name}
          </h1>
          <p className="mt-4 max-w-xl text-lg text-muted-foreground text-pretty">
            {condition.shortDescription}
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild size="xl" variant="hero" className="rounded-full">
              <Link to="/appointment">
                <Calendar /> Book Appointment
              </Link>
            </Button>
            <Button asChild size="xl" variant="outline" className="rounded-full bg-card hover:bg-card text-whatsapp border-card shadow-soft">
              <a href="https://wa.me/917668610031" target="_blank" rel="noreferrer">
                <MessageCircle /> Consult on WhatsApp
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* OVERVIEW & TREATMENT APPROACH */}
      <Section>
        <div className="grid gap-12 lg:grid-cols-2 lg:items-start">
          <div>
            <span className="inline-block rounded-full bg-leaf-soft px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary">
              Overview
            </span>
            <h2 className="mt-4 font-display text-3xl md:text-4xl font-bold text-balance">
              Understanding {condition.name}
            </h2>
            <p className="mt-5 text-muted-foreground text-pretty leading-relaxed">
              {condition.detailedDescription}
            </p>

            {/* Treatment info */}
            <h3 className="mt-10 font-display text-xl font-bold">
              Our Root-Cause Treatment Approach
            </h3>
            <ul className="mt-4 space-y-3">
              {condition.treatments.map((t) => (
                <li key={t} className="flex gap-3 rounded-2xl bg-card p-4 shadow-soft border border-border/60">
                  <CheckCircle2 className="h-5 w-5 shrink-0 text-primary" />
                  <span className="text-sm font-medium">{t}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Right Column: Videos & Benefits */}
          <div className="space-y-8">
            {condition.comingSoon || condition.videos.length === 0 ? (
              <div className="rounded-3xl border-2 border-dashed border-primary/30 bg-leaf-soft/40 p-10 text-center shadow-soft">
                <PlayCircle className="mx-auto h-10 w-10 text-primary/60" />
                <h3 className="mt-4 font-display text-lg font-bold">Video Coming Soon</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Detailed treatment videos for {condition.name.toLowerCase()} will be added shortly. Meanwhile, book a consultation to learn more.
                </p>
              </div>
            ) : (
              condition.videos.map((v) => (
                <div key={v.url} className="overflow-hidden rounded-3xl shadow-card border border-border">
                  <div className="relative aspect-video">
                    <iframe
                      src={v.url}
                      title={`${condition.name} — ${v.title}`}
                      className="h-full w-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                  <div className="flex items-center gap-2 bg-card px-5 py-3 text-sm font-medium text-foreground">
                    <PlayCircle className="h-4 w-4 text-primary" />
                    {v.title}
                  </div>
                </div>
              ))
            )}

            <div className="rounded-3xl bg-leaf-soft/50 p-7 border border-primary/10">
              <h3 className="font-display text-xl font-bold">Key Health Benefits</h3>
              <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                {condition.benefits.map((b) => (
                  <li key={b} className="flex gap-2 text-sm font-medium">
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-primary" />
                    {b}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </Section>

      {/* DIAGNOSTIC TEST ADVICE FOR THIS CONDITION */}
      <Section className="bg-sky-soft/40">
        <div className="rounded-3xl bg-card p-8 md:p-10 shadow-soft border border-border">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-leaf-soft text-primary text-xs font-bold uppercase tracking-wider">
                <FlaskConical className="h-3.5 w-3.5" /> Doctor Test Guidance
              </span>
              <h3 className="font-display text-2xl font-bold">
                Need Medical Lab Tests for {condition.name}?
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Unsure which blood or pathology tests are necessary for your condition? Our doctors guide you on <b>which exact tests to take and which unnecessary tests to avoid</b> to save you money.
              </p>
            </div>
            
            <div className="shrink-0 flex flex-col sm:flex-row gap-3">
              <Button asChild variant="hero" className="rounded-full">
                <Link to="/appointment">
                  <Stethoscope className="mr-1.5 h-4 w-4" /> Ask Doctor About Tests
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </Section>

      {/* CALL TO ACTION BANNER */}
      <Section>
        <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-leaf p-10 md:p-16 text-center shadow-glow">
          <h2 className="font-display text-3xl md:text-5xl font-bold text-primary-foreground text-balance">
            Take the first step towards lasting relief
          </h2>
          <p className="mt-4 max-w-xl mx-auto text-primary-foreground/90">
            Get a personalized homeopathic treatment plan for {condition.name.toLowerCase()} from our expert doctors.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button asChild size="xl" className="bg-card text-primary hover:bg-card/90 rounded-full">
              <Link to="/appointment">
                <Calendar /> Book Appointment
              </Link>
            </Button>
            <Button asChild size="xl" variant="outline" className="border-card text-white hover:bg-white/10 rounded-full">
              <a href="tel:+917668610031">
                <Phone /> Call Clinic
              </a>
            </Button>
          </div>
        </div>
      </Section>

      {/* PATIENT VIDEO TESTIMONIALS */}
      <VideoGallery
        title="Patient Video Testimonials"
        subtitle={`Watch how Homoeopathy has helped patients with ${condition.name.toLowerCase()} and other conditions.`}
      />

      {/* OTHER CONDITIONS WE TREAT */}
      <Section>
        <h2 className="font-display text-2xl md:text-3xl font-bold">
          Other Conditions We Treat Naturally
        </h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          {others.map((c) => {
            const OIcon = c.icon;
            return (
              <Link
                key={c.slug}
                to="/conditions/$slug"
                params={{ slug: c.slug }}
                className="group rounded-3xl bg-card p-6 shadow-soft transition hover:-translate-y-1 hover:shadow-glow border border-border/60"
              >
                <div
                  className={`grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br ${c.color} text-white shadow-soft`}
                >
                  <OIcon className="h-6 w-6" />
                </div>
                <h3 className="mt-4 font-semibold text-foreground">{c.name}</h3>
                <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                  {c.shortDescription}
                </p>
                <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-primary">
                  Learn more <ArrowRight className="h-3 w-3" />
                </span>
              </Link>
            );
          })}
        </div>
      </Section>
    </>
  );
}