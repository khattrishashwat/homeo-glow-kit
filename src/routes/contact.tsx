import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Section } from "@/components/site/Section";
import { Phone, Mail, MapPin, Clock, MessageCircle, Send, Loader2 } from "lucide-react";
import { z } from "zod";
import { toast } from "sonner";
import { whatsappLink } from "@/components/site/FloatingActions";
import { contactApi } from "@/services/api";
import { useSettings } from "@/hooks/useSettings";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact Us — MD's HOMOEOPATHY Clinic" },
      {
        name: "description",
        content:
          "Reach MD's HOMOEOPATHY by phone, WhatsApp, email, or visit our Mathura clinic. Working hours and Google Map included.",
      },
      { property: "og:title", content: "Contact MD's HOMOEOPATHY" },
      {
        property: "og:description",
        content: "Talk to us — phone, WhatsApp, email or in-clinic visits available.",
      },
    ],
  }),
  component: ContactPage,
});

const contactSchema = z.object({
  name: z.string().trim().min(2, "Please enter your name").max(100),
  phone: z.string().regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit mobile number"),
  email: z.string().trim().email("Enter a valid email").max(255).or(z.literal("")),
  message: z.string().trim().min(5, "Message is too short").max(1000),
});

function ContactPage() {
  const [form, setForm] = useState({ name: "", phone: "", email: "", message: "" });
  const [submitting, setSubmitting] = useState(false);
  const { data: settings } = useSettings();
  const upd = (k: keyof typeof form, v: string) => setForm((f) => ({ ...f, [k]: v }));
  const phone = settings?.phone || "+91 7668610031";
  const email = settings?.email || "mdshomoeopathy13@gmail.com";
  const address = settings?.address || "1262/3A, Deeg Gali, Shahganj Darwaza, Mathura, Uttar Pradesh - 281001, India";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = contactSchema.safeParse(form);
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "Please check your details");
      return;
    }
    setSubmitting(true);
    try {
      await contactApi.create(parsed.data);
      const msg = `Hi, I'd like to get in touch.\nName: ${parsed.data.name}\nPhone: ${parsed.data.phone}${parsed.data.email ? `\nEmail: ${parsed.data.email}` : ""}\nMessage: ${parsed.data.message}`;
      window.open(whatsappLink(msg), "_blank");
      toast.success("Message submitted. Opening WhatsApp for quick follow-up.");
      setForm({ name: "", phone: "", email: "", message: "" });
    } catch (error) {
      console.error(error);
      toast.error("Could not submit your message. Please try WhatsApp or phone.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <section style={{ backgroundImage: `url(${heroBg})`, backgroundSize: "cover", backgroundPosition: "center", backgroundRepeat: "no-repeat" }}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 md:py-20 text-center">
          <span className="inline-block px-4 py-1.5 rounded-full bg-card shadow-soft text-xs font-semibold text-primary uppercase tracking-wide">
            Contact
          </span>
          <h1 className="mt-5 font-display text-4xl md:text-5xl font-bold">
            We're here to help you heal
          </h1>
          <p className="mt-4 text-muted-foreground">
            Reach us anytime — we usually reply in under an hour.
          </p>
        </div>
      </section>

      <Section>
        <div className="grid lg:grid-cols-3 gap-6 mb-10">
          {[
            { i: Phone, t: "Call us", d: phone, a: `tel:${phone}` },
            { i: MessageCircle, t: "WhatsApp", d: "Quick reply, 9am–9pm", a: whatsappLink() },
            {
              i: Mail,
              t: "Email",
              d: email,
              a: `mailto:${email}`,
            },
          ].map((c) => (
            <a
              key={c.t}
              href={c.a}
              target={c.a.startsWith("http") ? "_blank" : undefined}
              rel="noreferrer"
              className="group bg-card rounded-3xl p-6 shadow-soft hover:shadow-card transition hover:-translate-y-1"
            >
              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-leaf text-primary-foreground">
                <c.i className="h-5 w-5" />
              </div>
              <div className="mt-4 text-xs font-semibold uppercase text-muted-foreground tracking-wide">
                {c.t}
              </div>
              <div className="mt-1 font-display text-xl font-bold group-hover:text-primary transition">
                {c.d}
              </div>
            </a>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <div className="bg-card rounded-3xl p-6 md:p-8 shadow-card">
            <h2 className="font-display text-2xl font-bold">Send us a message</h2>
            <p className="text-sm text-muted-foreground mt-1">
              We'll get back within 1 business hour.
            </p>
            <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <Label className="text-xs font-semibold uppercase tracking-wide">Name</Label>
                  <Input
                    value={form.name}
                    onChange={(e) => upd("name", e.target.value)}
                    placeholder="Your name"
                    className="mt-1.5 h-11 rounded-xl"
                    maxLength={100}
                  />
                </div>
                <div>
                  <Label className="text-xs font-semibold uppercase tracking-wide">Phone</Label>
                  <Input
                    value={form.phone}
                    onChange={(e) => upd("phone", e.target.value.replace(/\D/g, "").slice(0, 10))}
                    placeholder="9876543210"
                    className="mt-1.5 h-11 rounded-xl"
                    inputMode="numeric"
                  />
                </div>
              </div>
              <div>
                <Label className="text-xs font-semibold uppercase tracking-wide">
                  Email (optional)
                </Label>
                <Input
                  value={form.email}
                  onChange={(e) => upd("email", e.target.value)}
                  type="email"
                  placeholder="you@example.com"
                  className="mt-1.5 h-11 rounded-xl"
                  maxLength={255}
                />
              </div>
              <div>
                <Label className="text-xs font-semibold uppercase tracking-wide">Message</Label>
                <Textarea
                  value={form.message}
                  onChange={(e) => upd("message", e.target.value)}
                  placeholder="How can we help?"
                  className="mt-1.5 rounded-xl min-h-[120px]"
                  maxLength={1000}
                />
              </div>
              <Button
                variant="hero"
                size="lg"
                type="submit"
                className="w-full"
                disabled={submitting}
              >
                {submitting ? (
                  <>
                    <Loader2 className="animate-spin" /> Sending...
                  </>
                ) : (
                  <>
                    Send via WhatsApp <Send />
                  </>
                )}
              </Button>
            </form>
          </div>

          <div className="space-y-4">
            <div className="bg-card rounded-3xl p-6 shadow-soft">
              <div className="flex items-start gap-4">
                <div className="grid h-12 w-12 place-items-center rounded-2xl bg-leaf-soft shrink-0">
                  <MapPin className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">Visit our clinic</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {address}
                    Mathura, Uttar Pradesh – 281001, India
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-card rounded-3xl p-6 shadow-soft">
              <div className="flex items-start gap-4">
                <div className="grid h-12 w-12 place-items-center rounded-2xl bg-leaf-soft shrink-0">
                  <Clock className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">Working hours</h3>
                  <ul className="text-sm text-muted-foreground mt-1 space-y-0.5">
                    <li>Mon – Sat: 9:00 AM – 8:00 PM</li>
                    <li>Sunday: 10:00 AM – 2:00 PM</li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="rounded-3xl overflow-hidden shadow-card aspect-[4/3]">
              <iframe
                title="MD's Homoeopathy  Clinic - Mathura Location"
                src="https://www.google.com/maps?q=MD%27s+HOMOEOPATHY%2C+1262%2F3A+Deeg+Gali+Shahganj+Darwaza+Mathura+Uttar+Pradesh+281001+India&output=embed&entry=ttu&g_ep=EgoyMDI0MDgyMS4wIKXMDSoASAFQAw%3D%3D"
                className="w-full h-full border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}
