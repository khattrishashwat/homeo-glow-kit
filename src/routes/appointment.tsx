import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CheckCircle2, ChevronLeft, ChevronRight, Scissors, Flower2, Activity, Sparkles, Video, Building2, ShieldCheck, MessageCircle, Calendar, Clock, Phone, User, MapPin, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { z } from "zod";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const bookingSchema = z.object({
  problem: z.string().min(2).max(100),
  name: z.string().trim().min(2, "Name is too short").max(100),
  phone: z.string().regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit Indian mobile number"),
  age: z.coerce.number().int().min(1).max(120),
  city: z.string().trim().min(2).max(100),
  mode: z.enum(["Online", "Clinic Visit"]),
  day: z.string().min(1),
  slot: z.string().min(1),
});

export const Route = createFileRoute("/appointment")({
  head: () => ({
    meta: [
      { title: "Book Appointment — Aarogya Homeopathy" },
      { name: "description", content: "Book your homeopathy consultation in 4 easy steps. Online or in-clinic. Trusted by 1000+ patients." },
      { property: "og:title", content: "Book a Homeopathy Consultation" },
      { property: "og:description", content: "Multi-step booking · online & clinic options · WhatsApp quick booking." },
    ],
  }),
  component: AppointmentPage,
});

const problems = [
  { icon: Scissors, name: "Hair Fall" },
  { icon: Flower2, name: "PCOD" },
  { icon: Activity, name: "Thyroid" },
  { icon: Sparkles, name: "Skin Issues" },
];
const slots = ["10:00 AM", "11:30 AM", "1:00 PM", "3:00 PM", "4:30 PM", "6:00 PM"];
const days = ["Today", "Tomorrow", "Wed", "Thu", "Fri"];

function AppointmentPage() {
  const [step, setStep] = useState(1);
  const [data, setData] = useState({
    problem: "", name: "", phone: "", age: "", city: "", mode: "", day: "", slot: "",
  });
  const [done, setDone] = useState(false);

  const update = (k: string, v: string) => setData(d => ({ ...d, [k]: v }));
  const canNext = () => {
    if (step === 1) return !!data.problem;
    if (step === 2) return data.name && data.phone.length >= 10 && data.age && data.city;
    if (step === 3) return !!data.mode;
    if (step === 4) return data.day && data.slot;
    return true;
  };

  const totalSteps = 5;

  return (
    <section className="bg-gradient-hero min-h-screen">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        <div className="text-center mb-10">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-card shadow-soft text-xs font-semibold text-primary">
            <ShieldCheck className="h-3.5 w-3.5" /> Trusted by 1000+ patients
          </span>
          <h1 className="mt-4 font-display text-3xl md:text-5xl font-bold text-balance">Book Your Consultation</h1>
          <p className="mt-3 text-muted-foreground">Just 4 quick steps. No payment required.</p>
        </div>

        {/* Progress */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-primary">Step {Math.min(step, totalSteps)} of {totalSteps}</span>
            <a href="https://wa.me/919876543210" className="text-xs font-semibold text-whatsapp inline-flex items-center gap-1.5"><MessageCircle className="h-3.5 w-3.5" /> Quick book on WhatsApp</a>
          </div>
          <div className="h-2 rounded-full bg-card shadow-soft overflow-hidden">
            <div className="h-full bg-gradient-leaf transition-all duration-500" style={{ width: `${(Math.min(step, totalSteps)/totalSteps)*100}%` }} />
          </div>
        </div>

        <div className="bg-card rounded-3xl p-6 md:p-10 shadow-card">
          {done ? (
            <div className="text-center py-10 animate-fade-up">
              <div className="mx-auto h-20 w-20 grid place-items-center rounded-full bg-success/15">
                <CheckCircle2 className="h-10 w-10 text-success" />
              </div>
              <h2 className="mt-6 font-display text-3xl font-bold">You're booked! 🎉</h2>
              <p className="mt-2 text-muted-foreground">We'll send a confirmation to {data.phone} shortly.</p>
              <div className="mt-6 inline-block bg-leaf-soft/60 rounded-2xl p-5 text-left text-sm">
                <div><b>{data.problem}</b> · {data.mode}</div>
                <div className="text-muted-foreground">{data.day} at {data.slot}</div>
              </div>
            </div>
          ) : (
            <>
              {step === 1 && (
                <div className="animate-fade-up">
                  <h2 className="font-display text-2xl font-bold">What's your concern?</h2>
                  <p className="text-sm text-muted-foreground mt-1">Pick the area you'd like help with.</p>
                  <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-3">
                    {problems.map(p => (
                      <button key={p.name} onClick={() => update("problem", p.name)}
                        className={cn("p-5 rounded-2xl border-2 text-center transition-all hover:-translate-y-1",
                          data.problem === p.name ? "border-primary bg-leaf-soft shadow-glow" : "border-border bg-background hover:border-primary/40")}>
                        <p.icon className={cn("h-7 w-7 mx-auto", data.problem === p.name ? "text-primary" : "text-muted-foreground")} />
                        <div className="mt-2 text-sm font-semibold">{p.name}</div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="animate-fade-up space-y-5">
                  <h2 className="font-display text-2xl font-bold">Tell us about you</h2>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <Field icon={User} label="Full name" value={data.name} onChange={v=>update("name",v)} placeholder="Priya Sharma" />
                    <Field icon={Phone} label="Phone (WhatsApp)" value={data.phone} onChange={v=>update("phone",v.replace(/\D/g,""))} placeholder="9876543210" />
                    <Field icon={Calendar} label="Age" value={data.age} onChange={v=>update("age",v.replace(/\D/g,""))} placeholder="32" />
                    <Field icon={MapPin} label="City" value={data.city} onChange={v=>update("city",v)} placeholder="Mumbai" />
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="animate-fade-up">
                  <h2 className="font-display text-2xl font-bold">How would you like to consult?</h2>
                  <div className="mt-6 grid sm:grid-cols-2 gap-4">
                    {[{i:Video,n:"Online",d:"Secure video consultation from anywhere"},{i:Building2,n:"Clinic Visit",d:"Visit our Mumbai clinic in person"}].map(o=>(
                      <button key={o.n} onClick={()=>update("mode",o.n)}
                        className={cn("p-6 rounded-2xl border-2 text-left transition-all hover:-translate-y-1",
                          data.mode === o.n ? "border-primary bg-leaf-soft shadow-glow" : "border-border hover:border-primary/40")}>
                        <o.i className={cn("h-7 w-7", data.mode === o.n ? "text-primary" : "text-muted-foreground")} />
                        <div className="mt-3 font-semibold text-lg">{o.n}</div>
                        <div className="text-sm text-muted-foreground">{o.d}</div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {step === 4 && (
                <div className="animate-fade-up">
                  <h2 className="font-display text-2xl font-bold">Pick a date & time</h2>
                  <div className="mt-6">
                    <Label className="text-xs uppercase tracking-wide text-muted-foreground">Date</Label>
                    <div className="mt-2 flex gap-2 overflow-x-auto pb-2">
                      {days.map(d=>(
                        <button key={d} onClick={()=>update("day",d)}
                          className={cn("px-5 py-3 rounded-xl border-2 text-sm font-semibold whitespace-nowrap transition",
                            data.day===d ? "border-primary bg-primary text-primary-foreground" : "border-border hover:border-primary/40")}>{d}</button>
                      ))}
                    </div>
                  </div>
                  <div className="mt-6">
                    <Label className="text-xs uppercase tracking-wide text-muted-foreground">Available slots</Label>
                    <div className="mt-2 grid grid-cols-2 md:grid-cols-3 gap-2">
                      {slots.map(s=>(
                        <button key={s} onClick={()=>update("slot",s)}
                          className={cn("py-3 rounded-xl border-2 text-sm font-medium transition flex items-center justify-center gap-1.5",
                            data.slot===s ? "border-primary bg-leaf-soft text-primary" : "border-border hover:border-primary/40")}>
                          <Clock className="h-3.5 w-3.5" />{s}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {step === 5 && (
                <div className="animate-fade-up">
                  <h2 className="font-display text-2xl font-bold">Confirm your booking</h2>
                  <div className="mt-6 space-y-3 bg-leaf-soft/60 rounded-2xl p-5 text-sm">
                    <Row label="Concern" value={data.problem} />
                    <Row label="Name" value={data.name} />
                    <Row label="Phone" value={data.phone} />
                    <Row label="Age · City" value={`${data.age} · ${data.city}`} />
                    <Row label="Mode" value={data.mode} />
                    <Row label="When" value={`${data.day} at ${data.slot}`} />
                  </div>
                  <p className="mt-4 text-xs text-muted-foreground flex items-center gap-1.5"><ShieldCheck className="h-3.5 w-3.5 text-primary" /> Your details are 100% secure and never shared.</p>
                </div>
              )}

              <div className="mt-8 flex justify-between gap-3">
                <Button variant="ghost" disabled={step===1} onClick={()=>setStep(s=>s-1)}><ChevronLeft /> Back</Button>
                {step < totalSteps ? (
                  <Button variant="hero" disabled={!canNext()} onClick={()=>setStep(s=>s+1)}>Continue <ChevronRight /></Button>
                ) : (
                  <Button variant="hero" onClick={()=>setDone(true)}>Confirm Booking <CheckCircle2 /></Button>
                )}
              </div>
            </>
          )}
        </div>

        <div className="mt-6 text-center text-xs text-muted-foreground">
          By continuing you agree to our terms. We'll never spam you.
        </div>
      </div>
    </section>
  );
}

function Field({ icon: Ic, label, value, onChange, placeholder }: {
  icon: any; label: string; value: string; onChange: (v: string) => void; placeholder: string;
}) {
  return (
    <div>
      <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{label}</Label>
      <div className="relative mt-1.5">
        <Ic className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder} className="pl-10 h-11 rounded-xl" />
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-semibold text-right">{value}</span>
    </div>
  );
}
