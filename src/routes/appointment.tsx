
import { createFileRoute } from "@tanstack/react-router";
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  CheckCircle2, ChevronLeft, ChevronRight, Scissors, Flower2,
  Activity, Sparkles, Video, Building2, ShieldCheck, MessageCircle,
  Calendar, Clock, Phone, User, MapPin, Loader2, ArrowDown, Stethoscope,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { z } from "zod";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import { appointmentsApi, slotsApi, type Slot } from "@/services/api";

const bookingSchema = z.object({
  problem: z.string().min(2).max(100),
  name: z.string().trim().min(2, "Name is too short").max(100),
  phone: z.string().regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit Indian mobile number"),
  age: z.coerce.number().int().min(1).max(120),
  city: z.string().trim().min(2).max(100),
  mode: z.enum(["Online", "Clinic Visit"]),
  day: z.string().min(1),
  slot: z.string().min(1),
  slotId: z.string().min(1),
});

export const Route = createFileRoute("/appointment")({
  head: () => ({
    meta: [
      { title: "Book Appointment — MD's HOMOEOPATHY" },
      { name: "description", content: "Book your Homoeopathy  consultation in 4 easy steps. Online or in-clinic. Trusted by 1000+ patients." },
      { property: "og:title", content: "Book a Homoeopathy  Consultation" },
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

const formatDay = (value: string) =>
  new Intl.DateTimeFormat("en-IN", { weekday: "short", day: "numeric", month: "short" }).format(new Date(value));

const formatTime = (value: string) =>
  new Intl.DateTimeFormat("en-IN", { hour: "numeric", minute: "2-digit", hour12: true }).format(new Date(value));

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

function AppointmentPage() {
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [data, setData] = useState({
    problem: "", name: "", phone: "", age: "", city: "", mode: "", day: "", slot: "", slotId: "",
  });
  const [done, setDone] = useState(false);
  const bookingRef = useRef<HTMLDivElement>(null);

  const { data: slotResponse, isLoading: loadingSlots, error: slotsError } = useQuery({
    queryKey: ["available-slots"],
    queryFn: async () => {
      const response = await slotsApi.available();
      return response.data;
    },
    refetchInterval: 15000,
  });

  const slotsByDay = (slotResponse || []).reduce<Record<string, Slot[]>>((acc, slot) => {
    const day = new Date(slot.startTime).toISOString().slice(0, 10);
    acc[day] = [...(acc[day] || []), slot].sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());
    return acc;
  }, {});
  const days = Object.keys(slotsByDay).sort().slice(0, 7);

  const update = (k: string, v: string) =>
    setData(d => k === "day" ? { ...d, day: v, slot: "", slotId: "" } : { ...d, [k]: v });

  const canNext = () => {
    if (step === 1) return !!data.problem;
    if (step === 2) {
      return data.name.trim().length >= 2 &&
        /^[6-9]\d{9}$/.test(data.phone) &&
        Number(data.age) >= 1 && Number(data.age) <= 120 &&
        data.city.trim().length >= 2;
    }
    if (step === 3) return data.mode === "Online" || data.mode === "Clinic Visit";
    if (step === 4) return !!data.day && !!data.slot && !!data.slotId;
    return true;
  };

  const totalSteps = 5;

  const scrollToBooking = () => {
    bookingRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleConfirm = async () => {
    const parsed = bookingSchema.safeParse(data);
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "Please check your details");
      return;
    }

    setSubmitting(true);
    try {
      await appointmentsApi.create({
        name: parsed.data.name,
        phone: parsed.data.phone,
        slotId: parsed.data.slotId,
        reason: parsed.data.problem,
        consultation_type: parsed.data.mode === "Online" ? "online" : "offline",
        notes: `Age: ${parsed.data.age}; City: ${parsed.data.city}`,
      });

      toast.success("Appointment confirmed!");
      setDone(true);
    } catch (error) {
      console.error("[booking] error:", error);
      toast.error("Could not save your booking. Please contact us on WhatsApp.");
    } finally {
      setSubmitting(false);
    }
  };

  const waMessage = encodeURIComponent(
    `Hi, I want to book a Homoeopathy  consultation.\nName: ${data.name || "-"}\nPhone: ${data.phone || "-"}\nConcern: ${data.problem || "-"}\nMode: ${data.mode || "-"}\nWhen: ${data.day || "-"} ${data.slot || ""}`.trim()
  );

  return (
    <section className="min-h-screen" style={{ backgroundImage: `url(${heroBg})`, backgroundSize: "cover", backgroundPosition: "center", backgroundRepeat: "no-repeat" }}>
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        {/* Consultation Info Section */}
        <div className="text-center mb-10 animate-fade-up">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-card shadow-soft text-xs font-semibold text-primary">
            <Stethoscope className="h-3.5 w-3.5" /> Expert Homeopathic Care
          </span>
          <h1 className="mt-4 font-display text-3xl md:text-5xl font-bold text-balance">Schedule an Appointment</h1>
          <p className="mt-2 text-lg md:text-xl font-medium text-foreground/80">Consult with Expert Doctors</p>
          <p className="mt-3 text-muted-foreground max-w-xl mx-auto text-pretty">
            Get in touch with us, schedule your appointment and consult with doctors.
            For any query and questions, <a href="tel:+917668610031" className="text-primary font-medium hover:underline">contact us</a>.
          </p>
        </div>

        {/* Consultation Cards */}
        <div className="grid sm:grid-cols-2 gap-4 md:gap-6 mb-12 animate-fade-up">
          {/* Online Card */}
          <div className="bg-card rounded-3xl p-6 md:p-8 shadow-card border border-border flex flex-col">
            <div className="flex items-center gap-3 mb-4">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-sky-soft shadow-soft">
                <Video className="h-5 w-5 text-secondary" />
              </div>
              <h3 className="font-display text-lg md:text-xl font-bold text-foreground">Online Homoeopathic Consultation</h3>
            </div>
            <div className="space-y-2 text-sm text-muted-foreground mb-6 flex-1">
              <p><span className="font-semibold text-foreground">Consultation Charges</span> – ₹200 + Medicine Charges (included) + Courier Charges (₹100)</p>
              <p><span className="font-semibold text-foreground">Online Consultation</span> – ₹500 for 14 Days of Medicine</p>
            </div>
            <Button variant="hero" className="w-full rounded-full" onClick={scrollToBooking}>
              <Calendar className="h-4 w-4" /> Book Online Appointment
            </Button>
          </div>

          {/* Offline Card */}
          <div className="bg-card rounded-3xl p-6 md:p-8 shadow-card border border-border flex flex-col">
            <div className="flex items-center gap-3 mb-4">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-leaf-soft shadow-soft">
                <Building2 className="h-5 w-5 text-primary" />
              </div>
              <h3 className="font-display text-lg md:text-xl font-bold text-foreground">Offline Homoeopathic Consultation</h3>
            </div>
            <div className="space-y-2 text-sm text-muted-foreground mb-6 flex-1">
              <p><span className="font-semibold text-foreground">Consultation Charges</span> – ₹200 with Medicine</p>
              <p><span className="font-semibold text-foreground">Offline Consultation</span> – ₹200 for 6 Days of Medicine</p>
            </div>
            <Button variant="hero" className="w-full rounded-full bg-gradient-leaf" onClick={scrollToBooking}>
              <Calendar className="h-4 w-4" /> Book Offline Appointment – Visit Clinic
            </Button>
          </div>
        </div>

        {/* Scroll hint */}
        <div className="flex justify-center mb-10 animate-fade-up">
          <button
            onClick={scrollToBooking}
            className="inline-flex items-center gap-2 text-xs font-semibold text-muted-foreground hover:text-primary transition-colors"
          >
            <ArrowDown className="h-3.5 w-3.5 animate-bounce" /> Proceed to booking form
          </button>
        </div>

        {/* Existing Booking Form */}
        <div ref={bookingRef} id="booking-form">
          <div className="text-center mb-10">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-card shadow-soft text-xs font-semibold text-primary">
              <ShieldCheck className="h-3.5 w-3.5" /> Trusted by 1000+ patients
            </span>
            <h2 className="mt-4 font-display text-3xl md:text-5xl font-bold text-balance">Book Your Consultation</h2>
            <p className="mt-3 text-muted-foreground">Just 5 quick steps. No payment required.</p>
          </div>

          {/* Progress */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-primary">Step {Math.min(step, totalSteps)} of {totalSteps}</span>
              <a href={`https://wa.me/917668610031?text=${waMessage}`} target="_blank" rel="noreferrer" className="text-xs font-semibold text-whatsapp inline-flex items-center gap-1.5"><MessageCircle className="h-3.5 w-3.5" /> Quick book on WhatsApp</a>
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
                    <a href={`https://wa.me/917668610031?text=${waMessage}`} target="_blank" rel="noreferrer">
                      <MessageCircle /> Confirm on WhatsApp
                    </a>
                  </Button>
                  <Button asChild variant="outline">
                    <a href="tel:+917668610031"><Phone /> Call clinic</a>
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
                        {loadingSlots && <span className="px-5 py-3 text-sm text-muted-foreground">Loading dates...</span>}
                        {slotsError && <span className="px-5 py-3 text-sm text-destructive">Slots unavailable</span>}
                        {days.map(d=>(
                          <button key={d} onClick={()=>update("day",d)}
                            className={cn("px-5 py-3 rounded-xl border-2 text-sm font-semibold whitespace-nowrap transition",
                              data.day===d ? "border-primary bg-primary text-primary-foreground" : "border-border hover:border-primary/40")}>{formatDay(d)}</button>
                        ))}
                      </div>
                    </div>
                    <div className="mt-6">
                      <Label className="text-xs uppercase tracking-wide text-muted-foreground flex items-center gap-2">
                        Available slots {loadingSlots && <Loader2 className="h-3 w-3 animate-spin" />}
                      </Label>
                      <div className="mt-2 grid grid-cols-2 md:grid-cols-3 gap-2">
                        {(slotsByDay[data.day] || []).map(s=>{
                          const label = formatTime(s.startTime);
                          return (
                            <button key={s._id} disabled={!data.day} onClick={()=>setData(d => ({ ...d, slot: label, slotId: s._id }))}
                              className={cn("py-3 rounded-xl border-2 text-sm font-medium transition flex items-center justify-center gap-1.5",
                                data.slotId===s._id ? "border-primary bg-leaf-soft text-primary" : "border-border hover:border-primary/40",
                                !data.day && "opacity-50 cursor-not-allowed")}>
                              <Clock className="h-3.5 w-3.5" />{label}
                            </button>
                          );
                        })}
                        {data.day && !slotsByDay[data.day]?.length && (
                          <p className="col-span-full mt-3 text-xs text-destructive">No slots available for {formatDay(data.day)}. Please pick another date.</p>
                        )}
                      </div>
                      {!loadingSlots && days.length === 0 && (
                        <p className="mt-3 text-xs text-destructive">No appointment slots are currently available. Please contact us on WhatsApp.</p>
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
      </div>
    </section>
  );
}
