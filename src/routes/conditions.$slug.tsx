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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Section } from "@/components/site/Section";
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
        <title>{condition.name} Treatment | MD's Homeopathy</title>
        <meta name="description" content={condition.shortDescription} />
      </Helmet>

      {/* Banner */}
      <section className="relative overflow-hidden">
        <img
          src={condition.banner}
          alt={`${condition.name} homeopathic treatment`}
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/90 via-primary/70 to-primary/40" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 md:py-28">
          <Link
            to="/"
            className="inline-flex items-center gap-1 text-sm font-medium text-primary-foreground/90 hover:text-primary-foreground"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Home
          </Link>
          <div className="mt-6 flex items-center gap-4">
            <div
              className={`grid h-16 w-16 place-items-center rounded-2xl bg-gradient-to-br ${condition.color} text-white shadow-glow`}
            >
              <Icon className="h-8 w-8" />
            </div>
            <span className="rounded-full bg-card/90 px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-primary shadow-soft">
              Conditions We Heal Naturally
            </span>
          </div>
          <h1 className="mt-6 max-w-2xl font-display text-4xl md:text-6xl font-bold text-balance text-primary-foreground">
            {condition.name}
          </h1>
          <p className="mt-4 max-w-xl text-lg text-primary-foreground/90 text-pretty">
            {condition.shortDescription}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild size="xl" className="rounded-full bg-card text-primary hover:bg-card/90">
              <Link to="/appointment">
                <Calendar /> Book Appointment
              </Link>
            </Button>
            <Button asChild size="xl" variant="whatsapp" className="rounded-full">
              <a href="https://wa.me/919876543210" target="_blank" rel="noreferrer">
                <MessageCircle /> Consult on WhatsApp
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* Description */}
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
              Our Treatment Approach
            </h3>
            <ul className="mt-4 space-y-3">
              {condition.treatments.map((t) => (
                <li key={t} className="flex gap-3 rounded-2xl bg-card p-4 shadow-soft">
                  <CheckCircle2 className="h-5 w-5 shrink-0 text-primary" />
                  <span className="text-sm font-medium">{t}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Video + benefits */}
          <div className="space-y-8">
            <div className="overflow-hidden rounded-3xl shadow-card">
              <div className="relative aspect-video">
                <iframe
                  src={condition.videoUrl}
                  title={`${condition.name} treatment video`}
                  className="h-full w-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
              <div className="flex items-center gap-2 bg-card px-5 py-3 text-sm text-muted-foreground">
                <PlayCircle className="h-4 w-4 text-primary" />
                Watch how homeopathy helps with {condition.name.toLowerCase()}
              </div>
            </div>

            <div className="rounded-3xl bg-leaf-soft/50 p-7">
              <h3 className="font-display text-xl font-bold">Benefits</h3>
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

      {/* CTA */}
      <Section className="bg-sky-soft/30">
        <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-leaf p-10 md:p-16 text-center shadow-glow">
          <h2 className="font-display text-3xl md:text-5xl font-bold text-primary-foreground text-balance">
            Take the first step towards lasting relief
          </h2>
          <p className="mt-4 max-w-xl mx-auto text-primary-foreground/90">
            Get a personalized homeopathic treatment plan for {condition.name.toLowerCase()} from our expert doctors.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button asChild size="xl" className="bg-card text-primary hover:bg-card/90">
              <Link to="/appointment">
                <Calendar /> Book Appointment
              </Link>
            </Button>
            <Button asChild size="xl" variant="whatsapp">
              <a href="tel:+919876543210">
                <Phone /> Call Now
              </a>
            </Button>
          </div>
        </div>
      </Section>

      {/* Other conditions */}
      <Section>
        <h2 className="font-display text-2xl md:text-3xl font-bold">
          Other Conditions We Treat
        </h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          {others.map((c) => {
            const OIcon = c.icon;
            return (
              <Link
                key={c.slug}
                to="/conditions/$slug"
                params={{ slug: c.slug }}
                className="group rounded-3xl bg-card p-6 shadow-soft transition hover:-translate-y-1 hover:shadow-glow"
              >
                <div
                  className={`grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br ${c.color} text-white shadow-soft`}
                >
                  <OIcon className="h-6 w-6" />
                </div>
                <h3 className="mt-4 font-semibold">{c.name}</h3>
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
