import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CheckCircle2, ChevronLeft, ChevronRight, Scissors, Flower2, Activity, Sparkles, Video, Building2, ShieldCheck, MessageCircle, Calendar, Clock, Phone, User, MapPin, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { z } from "zod";
import { toast } from "sonner";

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
      { title: "Book Appointment —MD's HOMOEOPATHY" },
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
  const [submitting, setSubmitting] = useState(false);
  const [data, setData] = useState({
    problem: "", name: "", phone: "", age: "", city: "", mode: "", day: "", slot: "",
  });
  const [done, setDone] = useState(false);
  const [bookedSlots, setBookedSlots] = useState<Set<string>>(new Set());
  const [loadingSlots, setLoadingSlots] = useState(false);

  const slotKey = (day: string, slot: string, mode: string) => `${day}|${slot}|${mode}`;

  // Fetch booked slots for chosen mode in real time
  useEffect(() => {
    if (!data.mode) return;
    let active = true;
    const fetchBooked = async () => {
      setLoadingSlots(true);
      const { data: rows, error } = await supabase
        .from("slot_availability" as never)
        .select("preferred_day, preferred_slot, mode")
        .eq("mode", data.mode);
      if (!active) return;
      if (!error && rows) {
        setBookedSlots(new Set((rows as Array<{ preferred_day: string; preferred_slot: string; mode: string }>).map(r => slotKey(r.preferred_day, r.preferred_slot, r.mode))));
      }
      setLoadingSlots(false);
    };
    fetchBooked();
    // Poll periodically to keep availability fresh without exposing PII via realtime
    const interval = setInterval(fetchBooked, 15000);
    return () => {
      active = false;
      clearInterval(interval);
    };
  }, [data.mode]);

  const isSlotTaken = (day: string, slot: string) =>
    !!data.mode && bookedSlots.has(slotKey(day, slot, data.mode));

  const update = (k: string, v: string) => setData(d => ({ ...d, [k]: v }));
  const canNext = () => {
    if (step === 1) return !!data.problem;
    if (step === 2) {
      return data.name.trim().length >= 2 &&
        /^[6-9]\d{9}$/.test(data.phone) &&
        Number(data.age) >= 1 && Number(data.age) <= 120 &&
        data.city.trim().length >= 2;
    }
    if (step === 3) return data.mode === "Online" || data.mode === "Clinic Visit";
    if (step === 4) return !!data.day && !!data.slot && !isSlotTaken(data.day, data.slot);
    return true;
  };

  const totalSteps = 5;

  const handleConfirm = async () => {
    const parsed = bookingSchema.safeParse(data);
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "Please check your details");
      return;
    }
    if (isSlotTaken(data.day, data.slot)) {
      toast.error("That slot was just taken. Please pick another.");
      setStep(4);
      return;
    }
    setSubmitting(true);
    const { error } = await supabase.from("appointments").insert({
      name: parsed.data.name,
      phone: parsed.data.phone,
      age: parsed.data.age,
      city: parsed.data.city,
      problem: parsed.data.problem,
      mode: parsed.data.mode,
      preferred_day: parsed.data.day,
      preferred_slot: parsed.data.slot,
    });
    setSubmitting(false);
    if (error) {
      // 23505 = unique_violation (double-booking caught by DB)
      if ((error as { code?: string }).code === "23505") {
        toast.error("That slot was just booked by someone else. Please pick another.");
        setBookedSlots(prev => new Set(prev).add(slotKey(data.day, data.slot, data.mode)));
        update("slot", "");
        setStep(4);
        return;
      }
      console.error("[booking] insert error:", error);
      toast.error("Could not save your booking. Please try again or contact us on WhatsApp.");
      return;
    }
    toast.success("Appointment confirmed!");
    setDone(true);
  };

  const waMessage = encodeURIComponent(
    `Hi, I want to book a homeopathy consultation.\nName: ${data.name || "-"}\nPhone: ${data.phone || "-"}\nConcern: ${data.problem || "-"}\nMode: ${data.mode || "-"}\nWhen: ${data.day || "-"} ${data.slot || ""}`.trim()
  );

  return (
    <section className="bg-gradient-hero min-h-screen">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        <div className="text-center mb-10">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-card shadow-soft text-xs font-semibold text-primary">
            <ShieldCheck className="h-3.5 w-3.5" /> Trusted by 1000+ patients
          </span>
          <h1 className="mt-4 font-display text-3xl md:text-5xl font-bold text-balance">Book Your Consultation</h1>
          <p className="mt-3 text-muted-foreground">Just 5 quick steps. No payment required.</p>
        </div>

        {/* Progress */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-primary">Step {Math.min(step, totalSteps)} of {totalSteps}</span>
            <a href={`https://wa.me/919876543210?text=${waMessage}`} target="_blank" rel="noreferrer" className="text-xs font-semibold text-whatsapp inline-flex items-center gap-1.5"><MessageCircle className="h-3.5 w-3.5" /> Quick book on WhatsApp</a>
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
              <div className="mt-6 flex flex-wrap gap-3 justify-center">
                <Button asChild variant="hero">
                  <a href={`https://wa.me/919876543210?text=${waMessage}`} target="_blank" rel="noreferrer">
                    <MessageCircle /> Confirm on WhatsApp
                  </a>
                </Button>
                <Button asChild variant="outline">
                  <a href="tel:+919876543210"><Phone /> Call clinic</a>
                </Button>
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
                    <Label className="text-xs uppercase tracking-wide text-muted-foreground flex items-center gap-2">
                      Available slots {loadingSlots && <Loader2 className="h-3 w-3 animate-spin" />}
                    </Label>
                    <div className="mt-2 grid grid-cols-2 md:grid-cols-3 gap-2">
                      {slots.map(s=>{
                        const taken = !!data.day && isSlotTaken(data.day, s);
                        return (
                          <button key={s} disabled={taken || !data.day} onClick={()=>update("slot",s)}
                            className={cn("py-3 rounded-xl border-2 text-sm font-medium transition flex items-center justify-center gap-1.5",
                              taken ? "border-border bg-muted text-muted-foreground line-through cursor-not-allowed opacity-60" :
                              data.slot===s ? "border-primary bg-leaf-soft text-primary" : "border-border hover:border-primary/40",
                              !data.day && "opacity-50 cursor-not-allowed")}>
                            <Clock className="h-3.5 w-3.5" />{s}{taken && <span className="text-[10px] ml-1">(booked)</span>}
                          </button>
                        );
                      })}
                    </div>
                    {data.day && slots.every(s => isSlotTaken(data.day, s)) && (
                      <p className="mt-3 text-xs text-destructive">All slots booked for {data.day}. Please pick another date.</p>
                    )}
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
                <Button variant="ghost" disabled={step===1 || submitting} onClick={()=>setStep(s=>s-1)}><ChevronLeft /> Back</Button>
                {step < totalSteps ? (
                  <Button variant="hero" disabled={!canNext()} onClick={()=>setStep(s=>s+1)}>Continue <ChevronRight /></Button>
                ) : (
                  <Button variant="hero" disabled={submitting} onClick={handleConfirm}>
                    {submitting ? <><Loader2 className="animate-spin" /> Booking...</> : <>Confirm Booking <CheckCircle2 /></>}
                  </Button>
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
