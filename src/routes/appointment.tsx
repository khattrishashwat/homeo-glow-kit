import { createFileRoute } from "@tanstack/react-router";
import { useState, useRef, useMemo, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  CheckCircle2, ChevronLeft, ChevronRight, Scissors, Flower2,
  Activity, Sparkles, Video, Building2, ShieldCheck, MessageCircle,
  Calendar, Clock, Phone, User, MapPin, Loader2, ArrowDown, Stethoscope,
  HelpCircle, CreditCard, Mail, Check, RotateCcw,
} from "lucide-react";
import { cn } from "@/lib/utils";
import heroBg from "@/assets/hero-clinic-bg.jpg";
import { z } from "zod";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import { appointmentsApi, slotsApi, type Slot, type AppointmentBookingResponse, type AppointmentPayload } from "@/services/api";


const cleanPhone = (val: string) => val.trim().replace(/[\s\-\(\)]/g, "");

const normalizePhone = (val: string) => {
  const cleaned = cleanPhone(val);
  if (/^(\+91)[6-9]\d{9}$/.test(cleaned)) return cleaned.slice(3);
  if (/^(91)[6-9]\d{9}$/.test(cleaned)) return cleaned.slice(2);
  if (/^0[6-9]\d{9}$/.test(cleaned)) return cleaned.slice(1);
  return cleaned;
};

export const MEDICINE_PLANS = [
  {
    id: "7_days",
    label: "7 Days Course",
    durationTitle: "7 Days Medicine",
    daysCount: 7,
    price: 500,
    badge: "Starter Course",
    description: "Introductory course for acute symptoms & initial assessment",
  },
  {
    id: "15_days",
    label: "15 Days Course",
    durationTitle: "15 Days Medicine",
    daysCount: 15,
    price: 1000,
    badge: "Most Popular",
    description: "Recommended standard course for sustained recovery & deep relief",
    popular: true,
  },
  {
    id: "30_days",
    label: "1 Month Course",
    durationTitle: "1 Month (30 Days) Medicine",
    daysCount: 30,
    price: 3500,
    badge: "Complete Healing",
    description: "Comprehensive chronic care course with complete therapeutic protocol",
  },
] as const;

const bookingSchema = z
  .object({
    problem: z.string().min(1, "Please select a health concern"),
    customConcern: z.string().optional(),
    name: z.string().trim().min(2, "Please enter your full name (minimum 2 characters)").max(100),
    phone: z
      .string()
      .trim()
      .min(1, "Please enter your mobile number")
      .refine((val) => {
        const cleaned = cleanPhone(val);
        if (/^[6-9]\d{9}$/.test(cleaned)) return true;
        if (/^(\+91|91)[6-9]\d{9}$/.test(cleaned)) return true;
        if (/^0[6-9]\d{9}$/.test(cleaned)) return true;
        if (/^\+?[0-9]{7,15}$/.test(cleaned)) return true;
        return false;
      }, "Enter a valid 10-digit mobile number")
      .transform((val) => normalizePhone(val)),
    age: z.coerce.number().int().min(1, "Please enter a valid age").max(120, "Age must be valid"),
    email: z.string().trim().email("Please enter a valid email address").max(255),
    address: z.string().trim().min(5, "Please enter your complete address for delivery").max(255),
    city: z.string().trim().min(2, "Please enter your city").max(100),
    pincode: z.string().trim().regex(/^[1-9][0-9]{5}$/, "Enter a valid 6-digit postal pincode"),
    mode: z.enum(["Online", "Clinic Visit"]),
    day: z.string().min(1, "Please select an appointment date"),
    slot: z.string().min(1, "Please select a time slot"),
    slotId: z.string().min(1, "Please select a time slot"),
    medicineDuration: z.enum(["7_days", "15_days", "30_days"]),
    paymentMethod: z.literal("online"),
  })
  .refine(
    (val) => {
      if (val.problem === "Other") {
        return !!val.customConcern && val.customConcern.trim().length >= 2;
      }
      return true;
    },
    {
      message: "Please describe your custom concern",
      path: ["customConcern"],
    }
  );

export const Route = createFileRoute("/appointment")({
  head: () => ({
    meta: [
      { title: "Book Appointment — MD's HOMOEOPATHY" },
      {
        name: "description",
        content: "Book your Homoeopathy consultation in easy steps. Online video or clinic visit. Trusted by 1000+ patients.",
      },
      { property: "og:title", content: "Book a Homoeopathy Consultation" },
      { property: "og:description", content: "Step-by-step booking · Online and clinic consultation · Secure payment options." },
    ],
  }),
  component: AppointmentPage,
});

const problems = [
  { icon: Scissors, name: "Hair Fall" },
  { icon: Flower2, name: "PCOD" },
  { icon: Activity, name: "Thyroid" },
  { icon: Sparkles, name: "Skin Issues" },
  { icon: HelpCircle, name: "Other" },
];

const getTodayIST = () =>
  new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Kolkata" }).format(new Date());

const formatDay = (value: string) => {
  if (!value) return "";
  const parts = value.split("-").map(Number);
  if (parts.length !== 3) return value;
  const [y, m, d] = parts;
  const date = new Date(y, m - 1, d);

  const todayStr = getTodayIST();
  const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000);
  const tomorrowStr = new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Kolkata" }).format(tomorrow);

  const formatted = new Intl.DateTimeFormat("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
  }).format(date);

  if (value === todayStr) return `Today (${formatted})`;
  if (value === tomorrowStr) return `Tomorrow (${formatted})`;
  return formatted;
};

const formatTime = (value: string) =>
  new Intl.DateTimeFormat("en-IN", { hour: "numeric", minute: "2-digit", hour12: true }).format(new Date(value));

function Field({
  icon: Ic,
  label,
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  icon: any;
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  type?: string;
}) {
  return (
    <div>
      <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{label}</Label>
      <div className="relative mt-1.5">
        <Ic className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="pl-10 h-11 rounded-xl"
        />
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
  const [hasChosenInitialMode, setHasChosenInitialMode] = useState(false);
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [data, setData] = useState({
    problem: "",
    customConcern: "",
    name: "",
    phone: "",
    email: "",
    age: "",
    address: "",
    city: "",
    pincode: "",
    mode: "Online" as "Online" | "Clinic Visit",
    day: "",
    slot: "",
    slotId: "",
    medicineDuration: "7_days" as "7_days" | "15_days" | "30_days",
    paymentMethod: "online" as const,
  });
  const [confirmedBooking, setConfirmedBooking] = useState<AppointmentBookingResponse | null>(null);
  const [done, setDone] = useState(false);
  const bookingRef = useRef<HTMLDivElement>(null);

  const selectedPlan = MEDICINE_PLANS.find((m) => m.id === data.medicineDuration) || MEDICINE_PLANS[0];
  const medicineFee = selectedPlan.price;
  const courierCharge = data.mode === "Online" ? 60 : 0;
  const totalFee = medicineFee + courierCharge;
  const fee = totalFee;

  const consultationType = data.mode === "Online" ? "online" : "offline";

  const { data: slotResponse, isLoading: loadingSlots, error: slotsError } = useQuery({
    queryKey: ["available-slots", consultationType],
    queryFn: async () => {
      const response = await slotsApi.available({ type: consultationType });
      return response.data;
    },
    refetchInterval: 15000,
  });

  const slotsByDay = useMemo(() => {
    const now = Date.now();
    return (slotResponse || []).reduce<Record<string, Slot[]>>((acc, slot) => {
      // Exclude past slots or unavailable slots
      if (new Date(slot.startTime).getTime() <= now || !slot.available) {
        return acc;
      }
      // Group by Indian local date (YYYY-MM-DD)
      const day = new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Kolkata" }).format(new Date(slot.startTime));
      acc[day] = [...(acc[day] || []), slot].sort(
        (a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
      );
      return acc;
    }, {});
  }, [slotResponse]);

  // All available dates starting from current date onwards
  const days = useMemo(() => {
    const todayStr = getTodayIST();
    return Object.keys(slotsByDay)
      .filter((day) => day >= todayStr)
      .sort();
  }, [slotsByDay]);

  // Automatically pre-select the current date (or first available upcoming date)
  useEffect(() => {
    if (days.length > 0 && (!data.day || !days.includes(data.day))) {
      setData((prev) => ({
        ...prev,
        day: days[0],
        slot: "",
        slotId: "",
      }));
    }
  }, [days, data.day]);

  const update = (k: string, v: string) =>
    setData((d) => {
      if (k === "mode") {
        return {
          ...d,
          mode: v as "Online" | "Clinic Visit",
          day: "",
          slot: "",
          slotId: "",
          paymentMethod: "online",
        };
      }
      return k === "day" ? { ...d, day: v, slot: "", slotId: "" } : { ...d, [k]: v };
    });

  const handleSelectInitialMode = (mode: "Online" | "Clinic Visit") => {
    setData((d) => ({
      ...d,
      mode,
      day: "",
      slot: "",
      slotId: "",
      paymentMethod: "online",
    }));
    setHasChosenInitialMode(true);
    setTimeout(() => {
      bookingRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 150);
  };

  const canNext = () => {
    if (step === 1) {
      if (data.problem === "Other") {
        return data.customConcern.trim().length >= 2;
      }
      return !!data.problem;
    }
    if (step === 2) {
      const cleanP = cleanPhone(data.phone);
      const isPhoneValid = cleanP.length >= 10;
      const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email.trim());
      const isAgeValid = Number(data.age) >= 1 && Number(data.age) <= 120;
      const isAddressValid = data.address.trim().length >= 5;
      const isCityValid = data.city.trim().length >= 2;
      const isPincodeValid = /^[1-9][0-9]{5}$/.test(data.pincode.trim());

      return (
        data.name.trim().length >= 2 &&
        isPhoneValid &&
        isAgeValid &&
        isEmailValid &&
        isAddressValid &&
        isCityValid &&
        isPincodeValid
      );
    }
    if (step === 3) return data.mode === "Online" || data.mode === "Clinic Visit";
    if (step === 4) return !!data.day && !!data.slot && !!data.slotId;
    if (step === 5) return !!data.medicineDuration && data.paymentMethod === "online";
    return true;
  };

  const totalSteps = 6;

  const handleConfirm = async () => {
    const parsed = bookingSchema.safeParse(data);
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "Please verify your details");
      return;
    }

    setSubmitting(true);
    try {
      const finalConcern = parsed.data.problem === "Other" && parsed.data.customConcern
        ? `Other: ${parsed.data.customConcern}`
        : parsed.data.problem;

      const payload: AppointmentPayload = {
        name: parsed.data.name,
        phone: parsed.data.phone,
        email: parsed.data.email,
        slotId: parsed.data.slotId,
        reason: finalConcern,
        concern: parsed.data.problem,
        customConcern: parsed.data.problem === "Other" ? parsed.data.customConcern : undefined,
        address: parsed.data.address,
        city: parsed.data.city,
        pincode: parsed.data.pincode,
        medicineDuration: parsed.data.medicineDuration,
        courierCharge,
        age: parsed.data.age,
        consultation_type: parsed.data.mode === "Online" ? "online" : "offline",
        paymentMethod: "online",
        amount: totalFee,
        notes: `Medicine: ${selectedPlan.durationTitle} (₹${medicineFee}) + Courier: ₹${courierCharge}; Delivery Address: ${parsed.data.address}, ${parsed.data.city} - ${parsed.data.pincode}; Age: ${parsed.data.age}`,
      };

      const res = await appointmentsApi.create(payload);
      const booking = res.data;
      const razorpayOrder = res.razorpayOrder;

      if (parsed.data.paymentMethod === "online") {
        if (!razorpayOrder) {
          throw new Error("Could not initialize online payment order");
        }

        const RazorpayClass = typeof window !== "undefined" ? (window as any).Razorpay : null;
        if (RazorpayClass) {
          const options = {
            key: razorpayOrder.key,
            amount: razorpayOrder.amount * 100,
            currency: razorpayOrder.currency || "INR",
            name: "MD's Homoeopathy",
            description: `${data.mode} Consultation - ${parsed.data.problem}`,
            order_id: razorpayOrder.orderId,
            prefill: {
              name: parsed.data.name,
              email: parsed.data.email || "",
              contact: parsed.data.phone,
            },
            theme: {
              color: "#10b981",
            },
            handler: async (resp: { razorpay_payment_id: string; razorpay_order_id?: string; razorpay_signature?: string }) => {
              try {
                toast.loading("Verifying payment...", { id: "rzp-verify" });
                const verifiedRes = await appointmentsApi.verifyPayment({
                  appointmentId: booking._id,
                  razorpay_order_id: resp.razorpay_order_id || razorpayOrder.orderId,
                  razorpay_payment_id: resp.razorpay_payment_id,
                  razorpay_signature: resp.razorpay_signature || "signature_dev_verified",
                });
                toast.dismiss("rzp-verify");
                toast.success("Payment verified! Appointment confirmed.");
                setConfirmedBooking(verifiedRes.data || booking);
                setDone(true);
              } catch (err: any) {
                toast.dismiss("rzp-verify");
                console.error("[payment verification error]:", err);
                toast.error(err.message || "Payment verification failed. Please contact clinic.");
              }
            },
            modal: {
              ondismiss: () => {
                toast.info("Payment window closed. Your appointment is saved in pending status.");
              },
            },
          };

          const rzp = new RazorpayClass(options);
          rzp.open();
        } else {
          toast.error("Payment gateway is loading. Please check your connection or choose offline payment.");
        }
      } else {
        // Offline payment booking
        toast.success("Appointment booked successfully!");
        setConfirmedBooking(booking);
        setDone(true);
      }
    } catch (error: any) {
      console.error("[booking error]:", error);
      toast.error(error.message || "Could not save your booking. Please contact us on WhatsApp.");
    } finally {
      setSubmitting(false);
    }
  };

  const activeConcernDisplay =
    data.problem === "Other" && data.customConcern
      ? `Other (${data.customConcern})`
      : data.problem || "-";

  const waMessage = encodeURIComponent(
    `Hi, I want to book a Homoeopathy consultation.\nName: ${data.name || "-"}\nPhone: ${data.phone || "-"}\nEmail: ${data.email || "-"}\nConcern: ${activeConcernDisplay}\nAddress: ${data.address || "-"}\nCity: ${data.city || "-"}\nPincode: ${data.pincode || "-"}\nMode: ${data.mode || "-"}\nMedicine: ${selectedPlan.durationTitle} (₹${medicineFee})\nCourier: ₹${courierCharge}\nTotal: ₹${totalFee}\nWhen: ${data.day ? formatDay(data.day) : "-"} ${data.slot || ""}\nPayment: Online Payment (Razorpay)`.trim()
  );

  return (
    <section className="relative overflow-hidden min-h-screen">
      {/* 1. Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-bottom bg-no-repeat"
        style={{ backgroundImage: `url(${heroBg})` }}
      />
      {/* 2. Soft Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/90 via-background/80 to-background/65" />

      {/* 3. Main Content */}
      <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        {/* Header */}
        <div className="text-center mb-10 animate-fade-up">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-leaf-soft/80 shadow-soft text-xs font-semibold text-primary">
            <Stethoscope className="h-3.5 w-3.5" /> Expert Homeopathic Care
          </span>
          <h1 className="mt-4 font-display text-3xl md:text-5xl font-bold text-balance text-foreground">
            Schedule an Appointment
          </h1>
          <p className="mt-2 text-lg md:text-xl font-medium text-foreground/80">
            How would you like to consult?
          </p>
          <p className="mt-3 text-muted-foreground max-w-xl mx-auto text-pretty">
            Choose your preferred consultation option below to open the booking details.
            For immediate queries, <a href="tel:+917668610031" className="text-primary font-medium hover:underline">call our clinic</a>.
          </p>
        </div>

        {/* STEP 1 (INITIAL SCREEN): Consultation Type Selection */}
        <div className="grid sm:grid-cols-2 gap-4 md:gap-6 mb-12 animate-fade-up">
          {/* Online Consultation Card */}
          <div
            onClick={() => handleSelectInitialMode("Online")}
            className={cn(
              "bg-card/95 backdrop-blur rounded-3xl p-6 md:p-8 shadow-card border-2 cursor-pointer transition-all hover:shadow-glow hover:-translate-y-1 flex flex-col",
              data.mode === "Online" && hasChosenInitialMode
                ? "border-primary ring-2 ring-primary/20 bg-leaf-soft/30"
                : "border-border hover:border-primary/50"
            )}
          >
            <div className="flex items-center justify-between gap-3 mb-4">
              <div className="flex items-center gap-3">
                <div className="grid h-11 w-11 place-items-center rounded-xl bg-sky-soft shadow-soft">
                  <Video className="h-5 w-5 text-secondary" />
                </div>
                <h3 className="font-display text-lg md:text-xl font-bold text-foreground">
                  Online Consultation
                </h3>
              </div>
              {data.mode === "Online" && hasChosenInitialMode && (
                <span className="inline-flex items-center gap-1 rounded-full bg-primary text-primary-foreground text-xs font-semibold px-2.5 py-0.5">
                  <Check className="h-3 w-3" /> Selected
                </span>
              )}
            </div>
            <div className="space-y-2 text-sm text-muted-foreground mb-6 flex-1">
              <p>
                <span className="font-semibold text-foreground">Video Call from Anywhere</span> – Connect with senior doctors from home
              </p>
              <p>
                <span className="font-semibold text-foreground">Medicines & Courier</span> – 7 Days (₹500), 15 Days (₹1000), 1 Mo (₹3500) + ₹60 Delivery
              </p>
            </div>
            <Button
              variant={data.mode === "Online" && hasChosenInitialMode ? "hero" : "outline"}
              className="w-full rounded-full"
              onClick={(e) => {
                e.stopPropagation();
                handleSelectInitialMode("Online");
              }}
            >
              <Video className="h-4 w-4 mr-1" /> Select Online Consultation
            </Button>
          </div>

          {/* Clinic Visit Card */}
          <div
            onClick={() => handleSelectInitialMode("Clinic Visit")}
            className={cn(
              "bg-card/95 backdrop-blur rounded-3xl p-6 md:p-8 shadow-card border-2 cursor-pointer transition-all hover:shadow-glow hover:-translate-y-1 flex flex-col",
              data.mode === "Clinic Visit" && hasChosenInitialMode
                ? "border-primary ring-2 ring-primary/20 bg-leaf-soft/30"
                : "border-border hover:border-primary/50"
            )}
          >
            <div className="flex items-center justify-between gap-3 mb-4">
              <div className="flex items-center gap-3">
                <div className="grid h-11 w-11 place-items-center rounded-xl bg-leaf-soft shadow-soft">
                  <Building2 className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-display text-lg md:text-xl font-bold text-foreground">
                  Clinic Visit
                </h3>
              </div>
              {data.mode === "Clinic Visit" && hasChosenInitialMode && (
                <span className="inline-flex items-center gap-1 rounded-full bg-primary text-primary-foreground text-xs font-semibold px-2.5 py-0.5">
                  <Check className="h-3 w-3" /> Selected
                </span>
              )}
            </div>
            <div className="space-y-2 text-sm text-muted-foreground mb-6 flex-1">
              <p>
                <span className="font-semibold text-foreground">In-Person Clinic Visit</span> – Detailed in-clinic physical examination
              </p>
              <p>
                <span className="font-semibold text-foreground">Medicines & Care</span> – ₹ 200
              </p>
            </div>
            <Button
              variant={data.mode === "Clinic Visit" && hasChosenInitialMode ? "hero" : "outline"}
              className="w-full rounded-full"
              onClick={(e) => {
                e.stopPropagation();
                handleSelectInitialMode("Clinic Visit");
              }}
            >
              <Building2 className="h-4 w-4 mr-1" /> Select Clinic Visit
            </Button>
          </div>
        </div>

        {/* BOOKING FORM: Hidden initially, displayed only after selecting Online or Clinic Visit */}
        {hasChosenInitialMode && (
          <div ref={bookingRef} id="booking-form" className="animate-fade-up scroll-mt-6">
            <div className="text-center mb-8">
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-leaf-soft/80 shadow-soft text-xs font-semibold text-primary">
                <ShieldCheck className="h-3.5 w-3.5" /> Trusted by 1000+ patients
              </span>
              <h2 className="mt-4 font-display text-3xl md:text-5xl font-bold text-balance text-foreground">
                Book Your Consultation
              </h2>
              <p className="mt-2 text-sm md:text-base text-muted-foreground">
                Mode: <span className="font-semibold text-foreground">{data.mode === "Online" ? "Online Consultation" : "Clinic Visit"}</span> · Step {Math.min(step, totalSteps)} of {totalSteps}
              </p>
            </div>

            {/* Progress Bar */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-primary">
                  Step {Math.min(step, totalSteps)} of {totalSteps}
                </span>
                <a
                  href={`https://wa.me/917668610031?text=${waMessage}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs font-semibold text-whatsapp inline-flex items-center gap-1.5 hover:underline"
                >
                  <MessageCircle className="h-3.5 w-3.5" /> Quick book on WhatsApp
                </a>
              </div>
              <div className="h-2 rounded-full bg-card shadow-soft overflow-hidden">
                <div
                  className="h-full bg-gradient-leaf transition-all duration-500"
                  style={{ width: `${(Math.min(step, totalSteps) / totalSteps) * 100}%` }}
                />
              </div>
            </div>

            <div className="bg-card/95 backdrop-blur rounded-3xl p-6 md:p-10 shadow-card border border-border">
              {done ? (
                <div className="text-center py-8 animate-fade-up">
                  <div className="mx-auto h-20 w-20 grid place-items-center rounded-full bg-success/15 shadow-glow">
                    <CheckCircle2 className="h-10 w-10 text-success" />
                  </div>
                  <h2 className="mt-6 font-display text-3xl font-bold">You're booked! 🎉</h2>
                  <p className="mt-2 text-muted-foreground">
                    A confirmation has been dispatched to <strong>{data.phone}</strong>.
                  </p>

                  <div className="mt-6 inline-block bg-leaf-soft/60 rounded-2xl p-6 text-left text-sm max-w-md w-full border border-primary/20">
                    <div className="flex justify-between items-center pb-3 border-b border-border/60">
                      <div>
                        <span className="font-semibold text-foreground">{activeConcernDisplay}</span>
                        {confirmedBooking?._id && (
                          <div className="text-[11px] text-muted-foreground font-mono mt-0.5">
                            Booking ID: #{confirmedBooking._id.slice(-8).toUpperCase()}
                          </div>
                        )}
                      </div>
                      <span className="text-xs font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-primary/10 text-primary">
                        {data.mode}
                      </span>
                    </div>
                    <div className="mt-3 space-y-1.5 text-xs text-muted-foreground">
                      <div>Patient: <strong className="text-foreground">{data.name}</strong></div>
                      <div>Contact: <strong className="text-foreground">{data.phone}</strong> · {data.email}</div>
                      <div>Delivery Address: <strong className="text-foreground">{data.address}, {data.city} - {data.pincode}</strong></div>
                      <div>Slot: <strong className="text-foreground">{data.day ? formatDay(data.day) : ""} at {data.slot}</strong></div>
                      <div>Medicine Course: <strong className="text-foreground">{selectedPlan.durationTitle}</strong></div>
                      <div>
                        Payment Status:{" "}
                        <span className="font-semibold text-emerald-600 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded">
                          Paid Online (₹{totalFee})
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 flex flex-wrap gap-3 justify-center">
                    <Button asChild variant="hero">
                      <a href={`https://wa.me/917668610031?text=${waMessage}`} target="_blank" rel="noreferrer">
                        <MessageCircle className="mr-1 h-4 w-4" /> Message on WhatsApp
                      </a>
                    </Button>
                    <Button asChild variant="outline">
                      <a href="tel:+917668610031">
                        <Phone className="mr-1 h-4 w-4" /> Call Clinic
                      </a>
                    </Button>
                    <Button
                      variant="ghost"
                      onClick={() => {
                        setDone(false);
                        setStep(1);
                        setData({
                          problem: "",
                          customConcern: "",
                          name: "",
                          phone: "",
                          email: "",
                          age: "",
                          address: "",
                          city: "",
                          pincode: "",
                          mode: "Online",
                          day: "",
                          slot: "",
                          slotId: "",
                          medicineDuration: "7_days",
                          paymentMethod: "online",
                        });
                      }}
                    >
                      <RotateCcw className="mr-1 h-4 w-4" /> Book Another
                    </Button>
                  </div>
                </div>
              ) : (
                <>
                  {/* STEP 1: What's your concern? */}
                  {step === 1 && (
                    <div className="animate-fade-up">
                      <h2 className="font-display text-2xl font-bold">What's your concern?</h2>
                      <p className="text-sm text-muted-foreground mt-1">
                        Select your health concern or choose &ldquo;Other&rdquo; to describe.
                      </p>
                      <div className="mt-6 grid grid-cols-2 md:grid-cols-5 gap-3">
                        {problems.map((p) => (
                          <button
                            key={p.name}
                            type="button"
                            onClick={() => update("problem", p.name)}
                            className={cn(
                              "p-5 rounded-2xl border-2 text-center transition-all hover:-translate-y-1",
                              data.problem === p.name
                                ? "border-primary bg-leaf-soft shadow-glow"
                                : "border-border bg-background hover:border-primary/40"
                            )}
                          >
                            <p.icon
                              className={cn(
                                "h-7 w-7 mx-auto",
                                data.problem === p.name ? "text-primary" : "text-muted-foreground"
                              )}
                            />
                            <div className="mt-2 text-sm font-semibold">{p.name}</div>
                          </button>
                        ))}
                      </div>

                      {data.problem === "Other" && (
                        <div className="mt-5 p-4 rounded-2xl bg-muted/40 border border-border animate-fade-up">
                          <Label htmlFor="customConcern" className="text-xs font-semibold uppercase tracking-wide text-foreground">
                            Please describe your concern *
                          </Label>
                          <Textarea
                            id="customConcern"
                            rows={3}
                            placeholder="Describe your symptoms or condition (e.g., Chronic Migraine, Digestive issues, Joint pain, Allergies...)"
                            value={data.customConcern}
                            onChange={(e) => update("customConcern", e.target.value)}
                            className="mt-2 rounded-xl bg-background"
                          />
                        </div>
                      )}
                    </div>
                  )}

                  {/* STEP 2: Patient & Delivery Details */}
                  {step === 2 && (
                    <div className="animate-fade-up space-y-5">
                      <div>
                        <h2 className="font-display text-2xl font-bold">Patient & Delivery Details</h2>
                        <p className="text-sm text-muted-foreground mt-1">
                          Please enter your contact and delivery address. All fields marked with * are mandatory for consultation and medicine delivery.
                        </p>
                      </div>
                      <div className="grid sm:grid-cols-2 gap-4">
                        <Field
                          icon={User}
                          label="Full name *"
                          value={data.name}
                          onChange={(v) => update("name", v)}
                          placeholder="e.g. Priya Sharma"
                        />
                        <Field
                          icon={Phone}
                          label="Phone (WhatsApp) *"
                          value={data.phone}
                          onChange={(v) => {
                            let cleaned = v.replace(/[^\d+]/g, "");
                            if (cleaned.startsWith("+91")) cleaned = cleaned.slice(3);
                            else if (cleaned.startsWith("91") && cleaned.length > 10) cleaned = cleaned.slice(2);
                            else if (cleaned.startsWith("0") && cleaned.length > 10) cleaned = cleaned.slice(1);
                            update("phone", cleaned.replace(/\D/g, "").slice(0, 10));
                          }}
                          placeholder="9876543210"
                        />
                        <Field
                          icon={Calendar}
                          label="Age *"
                          value={data.age}
                          onChange={(v) => update("age", v.replace(/\D/g, "").slice(0, 3))}
                          placeholder="32"
                        />
                        <Field
                          icon={Mail}
                          label="Email Address *"
                          value={data.email}
                          onChange={(v) => update("email", v)}
                          placeholder="priya@example.com (For invoice & reminders)"
                          type="email"
                        />
                      </div>

                      {/* Delivery Address Fields */}
                      <div className="space-y-4 pt-2 border-t border-border/60">
                        <Field
                          icon={MapPin}
                          label="Address (House / Flat No, Street, Colony, Landmark) *"
                          value={data.address}
                          onChange={(v) => update("address", v)}
                          placeholder="e.g. Flat 301, Krishna Enclave, Opp. Civil Lines"
                        />
                        <div className="grid sm:grid-cols-2 gap-4">
                          <Field
                            icon={Building2}
                            label="City *"
                            value={data.city}
                            onChange={(v) => update("city", v)}
                            placeholder="e.g. Mathura, Delhi, Mumbai"
                          />
                          <Field
                            icon={MapPin}
                            label="Pincode (6 Digits) *"
                            value={data.pincode}
                            onChange={(v) => update("pincode", v.replace(/\D/g, "").slice(0, 6))}
                            placeholder="e.g. 281001"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* STEP 3: Consultation Mode */}
                  {step === 3 && (
                    <div className="animate-fade-up">
                      <h2 className="font-display text-2xl font-bold">How would you like to consult?</h2>
                      <p className="text-sm text-muted-foreground mt-1">
                        Confirm or change your consultation method.
                      </p>
                      <div className="mt-6 grid sm:grid-cols-2 gap-4">
                        {[
                          {
                            i: Video,
                            n: "Online",
                            title: "Online Consultation",
                            d: "Secure video call consultation from anywhere with doorstep medicine delivery",
                            fee: "7 Days: ₹500 · 15 Days: ₹1000 · 1 Mo: ₹3500 (+₹60 Courier)",
                          },
                          {
                            i: Building2,
                            n: "Clinic Visit",
                            title: "Clinic Visit",
                            d: "Meet Dr. in-person at Mathura clinic for physical checkup & remedies",
                            fee: "7 Days: ₹500 · 15 Days: ₹1000 · 1 Mo: ₹3500 (In-Clinic Pickup)",
                          },
                        ].map((o) => (
                          <button
                            key={o.n}
                            type="button"
                            onClick={() => update("mode", o.n)}
                            className={cn(
                              "p-6 rounded-2xl border-2 text-left transition-all hover:-translate-y-1 flex flex-col justify-between",
                              data.mode === o.n
                                ? "border-primary bg-leaf-soft shadow-glow"
                                : "border-border hover:border-primary/40"
                            )}
                          >
                            <div>
                              <o.i className={cn("h-7 w-7", data.mode === o.n ? "text-primary" : "text-muted-foreground")} />
                              <div className="mt-3 font-semibold text-lg">{o.title}</div>
                              <div className="text-sm text-muted-foreground mt-1 leading-relaxed">{o.d}</div>
                            </div>
                            <div className="mt-4 pt-3 border-t border-border/60 text-xs font-semibold text-primary">
                              {o.fee}
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* STEP 4: Date & Slot Selection */}
                  {step === 4 && (
                    <div className="animate-fade-up">
                      <h2 className="font-display text-2xl font-bold">Pick a date & time</h2>
                      <p className="text-sm text-muted-foreground mt-1">
                        Select from real-time available consultation slots.
                      </p>

                      <div className="mt-6">
                        <div className="flex items-center justify-between mb-2">
                          <Label className="text-xs uppercase tracking-wide text-muted-foreground">Select Date</Label>
                          {days.length > 0 && (
                            <span className="text-[11px] text-muted-foreground font-medium">
                              {days.length} available date{days.length === 1 ? "" : "s"}
                            </span>
                          )}
                        </div>
                        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
                          {loadingSlots && (
                            <span className="px-5 py-3 text-sm text-muted-foreground">Loading available dates...</span>
                          )}
                          {slotsError && (
                            <span className="px-5 py-3 text-sm text-destructive">Slots unavailable</span>
                          )}
                          {days.map((d) => {
                            const count = (slotsByDay[d] || []).length;
                            return (
                              <button
                                key={d}
                                type="button"
                                onClick={() => update("day", d)}
                                className={cn(
                                  "px-5 py-2.5 rounded-xl border-2 text-sm font-semibold whitespace-nowrap transition cursor-pointer flex flex-col items-center min-w-[125px]",
                                  data.day === d
                                    ? "border-primary bg-primary text-primary-foreground shadow-sm"
                                    : "border-border bg-card hover:border-primary/40 text-foreground"
                                )}
                              >
                                <span>{formatDay(d)}</span>
                                <span
                                  className={cn(
                                    "text-[11px] font-normal mt-0.5",
                                    data.day === d ? "text-primary-foreground/90" : "text-muted-foreground"
                                  )}
                                >
                                  {count} slot{count === 1 ? "" : "s"}
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      <div className="mt-6">
                        <Label className="text-xs uppercase tracking-wide text-muted-foreground flex items-center gap-2">
                          Select Time Slot {loadingSlots && <Loader2 className="h-3 w-3 animate-spin" />}
                        </Label>
                        <div className="mt-2 grid grid-cols-2 md:grid-cols-3 gap-2">
                          {(slotsByDay[data.day] || []).map((s) => {
                            const label = formatTime(s.startTime);
                            return (
                              <button
                                key={s._id}
                                type="button"
                                disabled={!data.day}
                                onClick={() => setData((d) => ({ ...d, slot: label, slotId: s._id }))}
                                className={cn(
                                  "py-3 rounded-xl border-2 text-sm font-medium transition flex items-center justify-center gap-1.5",
                                  data.slotId === s._id
                                    ? "border-primary bg-leaf-soft text-primary font-semibold shadow-sm"
                                    : "border-border hover:border-primary/40",
                                  !data.day && "opacity-50 cursor-not-allowed"
                                )}
                              >
                                <Clock className="h-3.5 w-3.5" />
                                {label}
                              </button>
                            );
                          })}
                          {data.day && !slotsByDay[data.day]?.length && (
                            <p className="col-span-full mt-3 text-xs text-destructive">
                              No slots available for {formatDay(data.day)}. Please select another date.
                            </p>
                          )}
                        </div>
                        {!loadingSlots && days.length === 0 && (
                          <p className="mt-3 text-xs text-destructive">
                            No appointment slots are currently open. Please message us on WhatsApp for emergency booking.
                          </p>
                        )}
                      </div>
                    </div>
                  )}

                  {/* STEP 5: Medicine Duration & Payment Method */}
                  {step === 5 && (
                    <div className="animate-fade-up space-y-6">
                      <div>
                        <h2 className="font-display text-2xl font-bold">Select Medicine Duration & Payment</h2>
                        <p className="text-sm text-muted-foreground mt-1">
                          Choose the medicine course duration prescribed for your condition. The total payable amount is calculated below.
                        </p>
                      </div>

                      {/* Medicine Duration Selection Cards */}
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <Label className="text-xs uppercase tracking-wide text-muted-foreground font-semibold">
                            Select Medicine Course *
                          </Label>
                          <span className="text-primary font-semibold text-xs">Doctor Consultation Included</span>
                        </div>
                        <div className="grid sm:grid-cols-3 gap-3.5">
                          {MEDICINE_PLANS.map((plan) => {
                            const isSelected = data.medicineDuration === plan.id;
                            return (
                              <button
                                key={plan.id}
                                type="button"
                                onClick={() => update("medicineDuration", plan.id)}
                                className={cn(
                                  "relative p-5 rounded-2xl border-2 text-left transition-all hover:-translate-y-1 flex flex-col justify-between cursor-pointer",
                                  isSelected
                                    ? "border-primary bg-leaf-soft shadow-glow ring-2 ring-primary/20"
                                    : "border-border bg-card hover:border-primary/40"
                                )}
                              >
                                {plan.popular && (
                                  <span className="absolute -top-3 right-4 px-2.5 py-0.5 rounded-full bg-primary text-primary-foreground text-[10px] font-bold uppercase tracking-wider shadow-sm">
                                    {plan.badge}
                                  </span>
                                )}
                                <div>
                                  <div className="flex items-center justify-between">
                                    <span className="font-bold text-base text-foreground">{plan.durationTitle}</span>
                                    {isSelected ? (
                                      <CheckCircle2 className="h-5 w-5 text-primary" />
                                    ) : (
                                      <div className="h-5 w-5 rounded-full border-2 border-muted-foreground/30" />
                                    )}
                                  </div>
                                  <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                                    {plan.description}
                                  </p>
                                </div>
                                <div className="mt-4 pt-3 border-t border-border/60 flex items-baseline justify-between">
                                  <span className="text-xs text-muted-foreground font-medium">Medicine Fee</span>
                                  <span className="font-bold text-lg text-primary">₹{plan.price}</span>
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Transparent Price Summary Card */}
                      <div className="rounded-2xl border border-primary/20 bg-leaf-soft/50 p-5 space-y-2.5 text-sm">
                        <div className="font-semibold text-xs uppercase tracking-wide text-primary">
                          Payment Breakdown
                        </div>
                        <div className="flex justify-between items-center text-muted-foreground">
                          <span>{selectedPlan.durationTitle} & Consultation</span>
                          <span className="font-semibold text-foreground">₹{medicineFee}</span>
                        </div>
                        <div className="flex justify-between items-center text-muted-foreground">
                          <span className="flex items-center gap-1.5">
                            Medicine Courier Delivery Charge
                            {data.mode === "Online" ? (
                              <span className="text-[10px] px-1.5 py-0.5 rounded bg-primary/10 text-primary font-medium">Doorstep</span>
                            ) : (
                              <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 font-medium">In-Clinic</span>
                            )}
                          </span>
                          <span className="font-semibold text-foreground">
                            {courierCharge > 0 ? `₹${courierCharge}` : "Free (In-Clinic Pickup)"}
                          </span>
                        </div>
                        <div className="pt-2 border-t border-border/70 flex justify-between items-center text-base font-bold">
                          <span className="text-foreground">Final Payable Amount</span>
                          <span className="text-primary text-xl font-display">₹{totalFee}</span>
                        </div>
                      </div>

                      {/* Online Payment Method (Offline Removed) */}
                      <div>
                        <Label className="text-xs uppercase tracking-wide text-muted-foreground font-semibold">
                          Payment Method
                        </Label>
                        <div className="mt-2.5 p-5 rounded-2xl border-2 border-primary bg-leaf-soft/70 shadow-sm flex items-start gap-4">
                          <div className="grid h-11 w-11 place-items-center rounded-xl bg-primary text-primary-foreground shrink-0 shadow-soft">
                            <CreditCard className="h-5 w-5" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <h3 className="font-semibold text-base">Instant Online Payment</h3>
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                                100% Secure Razorpay
                              </span>
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">
                              Pay via UPI (Google Pay, PhonePe, Paytm), Cards (Credit/Debit), or Netbanking. Appointment is immediately confirmed.
                            </p>
                          </div>
                          <div className="text-right">
                            <span className="text-xs text-muted-foreground block">Pay</span>
                            <span className="font-bold text-lg text-primary">₹{totalFee}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* STEP 6: Final Review & Confirmation */}
                  {step === 6 && (
                    <div className="animate-fade-up">
                      <h2 className="font-display text-2xl font-bold">Confirm your booking</h2>
                      <p className="text-sm text-muted-foreground mt-1">
                        Please review your consultation and medicine details before finalizing payment.
                      </p>

                      <div className="mt-6 space-y-3 bg-leaf-soft/60 rounded-2xl p-5 text-sm border border-primary/10">
                        <Row label="Health Concern" value={activeConcernDisplay} />
                        <Row label="Patient Name" value={data.name} />
                        <Row label="Phone" value={data.phone} />
                        <Row label="Email" value={data.email} />
                        <Row label="Age" value={`${data.age} yrs`} />
                        <Row label="Delivery Address" value={`${data.address}, ${data.city} - ${data.pincode}`} />
                        <Row
                          label="Consultation Mode"
                          value={data.mode === "Online" ? "Online Video Consultation" : "Clinic Visit"}
                        />
                        <Row label="Date & Time" value={`${data.day ? formatDay(data.day) : ""} at ${data.slot}`} />
                        <Row label="Selected Medicine" value={`${selectedPlan.durationTitle} (₹${medicineFee})`} />
                        <Row
                          label="Medicine Courier"
                          value={courierCharge > 0 ? `₹${courierCharge} (Doorstep Express)` : "Free (In-Clinic Pickup)"}
                        />
                        <div className="pt-2 border-t border-border/70 flex justify-between items-center text-base font-bold">
                          <span className="text-foreground">Total Payable Amount</span>
                          <span className="text-primary text-xl font-display">₹{totalFee}</span>
                        </div>
                      </div>

                      <p className="mt-4 text-xs text-muted-foreground flex items-center gap-1.5">
                        <ShieldCheck className="h-3.5 w-3.5 text-primary" />
                        Your health details are 100% confidential and protected by clinic privacy policies.
                      </p>
                    </div>
                  )}

                  {/* Navigation Buttons */}
                  <div className="mt-8 flex justify-between gap-3">
                    <Button
                      type="button"
                      variant="ghost"
                      disabled={step === 1 || submitting}
                      onClick={() => setStep((s) => s - 1)}
                    >
                      <ChevronLeft className="mr-1 h-4 w-4" /> Back
                    </Button>

                    {step < totalSteps ? (
                      <Button
                        type="button"
                        variant="hero"
                        disabled={!canNext()}
                        onClick={() => setStep((s) => s + 1)}
                      >
                        Continue <ChevronRight className="ml-1 h-4 w-4" />
                      </Button>
                    ) : (
                      <Button
                        type="button"
                        variant="hero"
                        disabled={submitting}
                        onClick={handleConfirm}
                        className="bg-emerald-600 hover:bg-emerald-700 font-semibold"
                      >
                        {submitting ? (
                          <>
                            <Loader2 className="mr-1.5 h-4 w-4 animate-spin" /> Processing...
                          </>
                        ) : (
                          <>
                            <CreditCard className="mr-1.5 h-4 w-4" /> Pay ₹{totalFee} & Confirm
                          </>
                        )}
                      </Button>
                    )}
                  </div>
                </>
              )}
            </div>

            <div className="mt-6 text-center text-xs text-muted-foreground">
              By confirming, you agree to our consultation guidelines. Need help? Call +91 7668610031.
            </div>
          </div>
        )}
      </div>
    </section>
  );
}