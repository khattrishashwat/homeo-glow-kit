import { createFileRoute } from "@tanstack/react-router";
import { useState, useRef, useMemo, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  CheckCircle2, ChevronLeft, ChevronRight, Scissors, Flower2,
  Activity, Sparkles, Video, Building2, ShieldCheck, MessageCircle,
  Calendar, Clock, Phone, User, MapPin, Loader2, Stethoscope,
  HelpCircle, CreditCard, Mail, Check, RotateCcw, Truck,
} from "lucide-react";
import { cn } from "@/lib/utils";
import heroBg from "@/assets/hero-clinic-bg.jpg";
import { z } from "zod";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import {
  appointmentsApi,
  slotsApi,
  formatINR,
  type Slot,
  type AppointmentBookingResponse,
  type AppointmentPayload,
} from "@/services/api";
import {
  APPOINTMENT_PRICING,
  ONLINE_PLANS,
  calculatePricing,
  type BookingType,
  type OnlinePlanType,
} from "@/constants/pricing";

const cleanPhone = (val: string) => val.trim().replace(/[\s\-\(\)]/g, "");

const normalizePhone = (val: string) => {
  const cleaned = cleanPhone(val);
  if (/^(\+91)[6-9]\d{9}$/.test(cleaned)) return cleaned.slice(3);
  if (/^(91)[6-9]\d{9}$/.test(cleaned)) return cleaned.slice(2);
  if (/^0[6-9]\d{9}$/.test(cleaned)) return cleaned.slice(1);
  return cleaned;
};

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
    address: z.string().trim().optional(),
    city: z.string().trim().min(2, "Please enter your city").max(100),
    pincode: z.string().trim().optional(),
    bookingType: z.enum(["ONLINE", "OFFLINE"]),
    planType: z.enum(["SEVEN_DAYS", "ONE_MONTH"]).nullable().optional(),
    day: z.string().min(1, "Please select an appointment date"),
    slot: z.string().min(1, "Please select a time slot"),
    slotId: z.string().min(1, "Please select a time slot"),
    paymentMethod: z.enum(["online", "offline"]),
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
  )
  .refine(
    (val) => {
      if (val.bookingType === "ONLINE") {
        return val.planType === "SEVEN_DAYS" || val.planType === "ONE_MONTH";
      }
      return true;
    },
    {
      message: "Please select a plan for online booking",
      path: ["planType"],
    }
  )
  .refine(
    (val) => {
      if (val.bookingType === "ONLINE") {
        return !!val.address && val.address.trim().length >= 5;
      }
      return true;
    },
    {
      message: "Please enter your complete delivery address",
      path: ["address"],
    }
  )
  .refine(
    (val) => {
      if (val.bookingType === "ONLINE") {
        return !!val.pincode && /^[1-9][0-9]{5}$/.test(val.pincode.trim());
      }
      return true;
    },
    {
      message: "Enter a valid 6-digit postal pincode",
      path: ["pincode"],
    }
  );

export const Route = createFileRoute("/appointment")({
  head: () => ({
    meta: [
      { title: "Book Appointment — MD's HOMOEOPATHY" },
      {
        name: "description",
        content: "Book your Homoeopathy consultation in easy steps. Online subscription plans with medicines included or offline clinic visit.",
      },
      { property: "og:title", content: "Book a Homoeopathy Consultation" },
      { property: "og:description", content: "Online 7 Days (₹500), 1 Month (₹1,000) with delivery included. Clinic Visit (₹200)." },
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

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex justify-between items-baseline gap-4 py-1">
      <span className="text-muted-foreground">{label}:</span>
      <span className="font-semibold text-right text-foreground">{value}</span>
    </div>
  );
}

function AppointmentPage() {
  const [hasChosenInitialMode, setHasChosenInitialMode] = useState(false);
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);

  const [data, setData] = useState<{
    problem: string;
    customConcern: string;
    bookingType: BookingType;
    planType: OnlinePlanType | null;
    name: string;
    phone: string;
    email: string;
    age: string;
    address: string;
    city: string;
    pincode: string;
    day: string;
    slot: string;
    slotId: string;
    paymentMethod: "online" | "offline";
  }>({
    problem: "",
    customConcern: "",
    bookingType: "ONLINE",
    planType: "SEVEN_DAYS",
    name: "",
    phone: "",
    email: "",
    age: "",
    address: "",
    city: "",
    pincode: "",
    day: "",
    slot: "",
    slotId: "",
    paymentMethod: "online",
  });

  const [confirmedBooking, setConfirmedBooking] = useState<AppointmentBookingResponse | null>(null);
  const [done, setDone] = useState(false);
  const bookingRef = useRef<HTMLDivElement>(null);

  // Centralized price calculation
  const pricing = useMemo(() => {
    return calculatePricing(data.bookingType, data.planType);
  }, [data.bookingType, data.planType]);

  const consultationType = data.bookingType === "ONLINE" ? "online" : "offline";

  // Slots query for currently selected consultation mode
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
      if (new Date(slot.startTime).getTime() <= now || !slot.available) {
        return acc;
      }
      const day = new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Kolkata" }).format(new Date(slot.startTime));
      acc[day] = [...(acc[day] || []), slot].sort(
        (a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
      );
      return acc;
    }, {});
  }, [slotResponse]);

  const days = useMemo(() => {
    const todayStr = getTodayIST();
    return Object.keys(slotsByDay)
      .filter((day) => day >= todayStr)
      .sort();
  }, [slotsByDay]);

  // Pre-select first available date if current selected date is invalid
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

  const handleSelectInitialMode = (type: BookingType) => {
    setData((d) => ({
      ...d,
      bookingType: type,
      planType: type === "ONLINE" ? (d.planType || "SEVEN_DAYS") : null,
      day: "",
      slot: "",
      slotId: "",
      paymentMethod: type === "ONLINE" ? "online" : "offline",
    }));
    setHasChosenInitialMode(true);
    setTimeout(() => {
      bookingRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 150);
  };

  const handleSelectBookingType = (type: BookingType) => {
    setData((d) => ({
      ...d,
      bookingType: type,
      planType: type === "ONLINE" ? (d.planType || "SEVEN_DAYS") : null,
      day: "",
      slot: "",
      slotId: "",
      paymentMethod: type === "ONLINE" ? "online" : "offline",
    }));
  };

  const handleSelectPlan = (plan: OnlinePlanType) => {
    setData((d) => ({
      ...d,
      planType: plan,
    }));
  };

  const canNext = () => {
    if (step === 1) {
      if (data.problem === "Other") {
        return data.customConcern.trim().length >= 2;
      }
      return !!data.problem;
    }
    if (step === 2) {
      if (data.bookingType === "ONLINE") {
        return data.planType === "SEVEN_DAYS" || data.planType === "ONE_MONTH";
      }
      return data.bookingType === "OFFLINE";
    }
    if (step === 3) {
      return !!data.day && !!data.slot && !!data.slotId;
    }
    if (step === 4) {
      const cleanP = cleanPhone(data.phone);
      const isPhoneValid = cleanP.length >= 10;
      const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email.trim());
      const isAgeValid = Number(data.age) >= 1 && Number(data.age) <= 120;
      const isCityValid = data.city.trim().length >= 2;

      if (data.bookingType === "ONLINE") {
        const isAddressValid = data.address.trim().length >= 5;
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

      return (
        data.name.trim().length >= 2 &&
        isPhoneValid &&
        isAgeValid &&
        isEmailValid &&
        isCityValid
      );
    }
    return true;
  };

  const totalSteps = 5;

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
        address: parsed.data.address || undefined,
        city: parsed.data.city,
        pincode: parsed.data.pincode || undefined,
        bookingType: pricing.bookingType,
        planType: pricing.planType,
        planDuration: pricing.planDuration,
        baseAmount: pricing.baseAmount,
        deliveryCharge: pricing.deliveryCharge,
        totalAmount: pricing.totalAmount,
        medicineDuration: pricing.planType === "SEVEN_DAYS" ? "7_days" : (pricing.planType === "ONE_MONTH" ? "30_days" : undefined),
        courierCharge: 0,
        age: parsed.data.age,
        consultation_type: consultationType,
        paymentMethod: parsed.data.paymentMethod,
        amount: pricing.totalAmount,
        notes: pricing.bookingType === "ONLINE"
          ? `Online Appointment | Plan: ${pricing.planName} (${formatINR(pricing.baseAmount)}) | Delivery: Included | Address: ${parsed.data.address || "-"}, ${parsed.data.city} - ${parsed.data.pincode || "-"}`
          : `Offline Appointment (${formatINR(pricing.baseAmount)}) | City: ${parsed.data.city}`,
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
            description: pricing.bookingType === "ONLINE"
              ? `Online Consultation - ${pricing.planName}`
              : "Offline Clinic Appointment",
            order_id: razorpayOrder.orderId,
            prefill: {
              name: parsed.data.name,
              email: parsed.data.email || "",
              contact: parsed.data.phone,
            },
            theme: {
              color: "#047857",
            },
            handler: async (resp: { razorpay_payment_id: string; razorpay_order_id?: string; razorpay_signature?: string }) => {
              try {
                toast.loading("Verifying payment...", { id: "rzp-verify" });
                const verifiedRes = await appointmentsApi.verifyPayment({
                  appointmentId: booking._id,
                  razorpay_order_id: resp.razorpay_order_id || razorpayOrder.orderId,
                  razorpay_payment_id: resp.razorpay_payment_id,
                  razorpay_signature: resp.razorpay_signature || "signature_verified",
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
          toast.error("Payment gateway is loading. Please check your internet connection.");
        }
      } else {
        // Offline payment booking (Pay at Clinic)
        toast.success("Appointment booked successfully! Pay at consultation.");
        setConfirmedBooking(booking);
        setDone(true);
      }
    } catch (error: any) {
      console.error("[booking error]:", error);
      toast.error(error.message || "Could not save your booking. Please contact clinic.");
    } finally {
      setSubmitting(false);
    }
  };

  const activeConcernDisplay =
    data.problem === "Other" && data.customConcern
      ? `Other (${data.customConcern})`
      : data.problem || "-";

  const waMessage = encodeURIComponent(
    `Hi, I want to book a Homoeopathy consultation.\nName: ${data.name || "-"}\nPhone: ${data.phone || "-"}\nEmail: ${data.email || "-"}\nConcern: ${activeConcernDisplay}\nBooking Type: ${data.bookingType === "ONLINE" ? "Online Consultation" : "Offline Clinic Visit"}\n${data.bookingType === "ONLINE" ? `Plan: ${pricing.planName} (${formatINR(pricing.totalAmount)})\nDelivery: Included\nAddress: ${data.address || "-"}, ${data.city || "-"} - ${data.pincode || "-"}` : `Fee: ${formatINR(pricing.totalAmount)} (Offline Appointment)`}\nWhen: ${data.day ? formatDay(data.day) : "-"} ${data.slot || ""}`.trim()
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
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/50 shadow-soft text-xs font-semibold text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
            <Stethoscope className="h-3.5 w-3.5" /> Expert Homeopathic Care
          </span>
          <h1 className="mt-4 font-display text-3xl md:text-5xl font-bold text-balance text-foreground">
            Schedule an Appointment
          </h1>
          <p className="mt-2 text-lg md:text-xl font-medium text-foreground/80">
            Choose your preferred consultation option
          </p>
          <p className="mt-3 text-muted-foreground max-w-xl mx-auto text-pretty">
            Select Online Consultation for video consults with doorstep medicines, or visit our clinic in person.
          </p>
        </div>

        {/* HERO CARDS: Online vs Offline Selection */}
        <div className="grid sm:grid-cols-2 gap-4 md:gap-6 mb-12 animate-fade-up">
          {/* Online Booking Card */}
          <div
            onClick={() => handleSelectInitialMode("ONLINE")}
            className={cn(
              "bg-card/95 backdrop-blur rounded-3xl p-6 md:p-8 shadow-card border-2 cursor-pointer transition-all hover:shadow-glow hover:-translate-y-1 flex flex-col justify-between",
              data.bookingType === "ONLINE" && hasChosenInitialMode
                ? "border-emerald-600 ring-2 ring-emerald-500/20 bg-emerald-50/20 dark:bg-emerald-950/20"
                : "border-border hover:border-emerald-500/50"
            )}
          >
            <div>
              <div className="flex items-center justify-between gap-3 mb-4">
                <div className="flex items-center gap-3">
                  <div className="grid h-12 w-12 place-items-center rounded-2xl bg-sky-100 dark:bg-sky-950 text-sky-600 dark:text-sky-400 shadow-soft">
                    <Video className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-display text-lg md:text-xl font-bold text-foreground">
                      Online Consultation
                    </h3>
                    <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1 mt-0.5">
                      <Truck className="h-3 w-3" /> Delivery Included in Plans
                    </span>
                  </div>
                </div>
                {data.bookingType === "ONLINE" && hasChosenInitialMode && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-600 text-white text-xs font-semibold px-2.5 py-0.5">
                    <Check className="h-3 w-3" /> Selected
                  </span>
                )}
              </div>

              <div className="space-y-2.5 text-sm text-muted-foreground mb-6">
                <p className="text-foreground/90">
                  Connect with senior homeopathic doctors from the comfort of your home.
                </p>
                <div className="p-3 rounded-xl bg-muted/50 border border-border/60 space-y-1.5">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-medium text-foreground">7 Days Plan:</span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">
                      {formatINR(APPOINTMENT_PRICING.ONLINE.SEVEN_DAYS.totalAmount)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-medium text-foreground">1 Month Plan:</span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">
                      {formatINR(APPOINTMENT_PRICING.ONLINE.ONE_MONTH.totalAmount)}
                    </span>
                  </div>
                  <div className="text-[11px] text-muted-foreground pt-1 border-t border-border/40">
                    ✓ Medicines & Courier Delivery included in plan price
                  </div>
                </div>
              </div>
            </div>

            <Button
              variant={data.bookingType === "ONLINE" && hasChosenInitialMode ? "hero" : "outline"}
              className="w-full rounded-full"
              onClick={(e) => {
                e.stopPropagation();
                handleSelectInitialMode("ONLINE");
              }}
            >
              <Video className="h-4 w-4 mr-1.5" /> Book Online Consultation
            </Button>
          </div>

          {/* Offline Booking Card */}
          <div
            onClick={() => handleSelectInitialMode("OFFLINE")}
            className={cn(
              "bg-card/95 backdrop-blur rounded-3xl p-6 md:p-8 shadow-card border-2 cursor-pointer transition-all hover:shadow-glow hover:-translate-y-1 flex flex-col justify-between",
              data.bookingType === "OFFLINE" && hasChosenInitialMode
                ? "border-emerald-600 ring-2 ring-emerald-500/20 bg-emerald-50/20 dark:bg-emerald-950/20"
                : "border-border hover:border-emerald-500/50"
            )}
          >
            <div>
              <div className="flex items-center justify-between gap-3 mb-4">
                <div className="flex items-center gap-3">
                  <div className="grid h-12 w-12 place-items-center rounded-2xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 shadow-soft">
                    <Building2 className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-display text-lg md:text-xl font-bold text-foreground">
                      Offline Appointment
                    </h3>
                    <span className="text-xs text-muted-foreground font-medium mt-0.5 block">
                      In-Person Clinic Visit
                    </span>
                  </div>
                </div>
                {data.bookingType === "OFFLINE" && hasChosenInitialMode && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-600 text-white text-xs font-semibold px-2.5 py-0.5">
                    <Check className="h-3 w-3" /> Selected
                  </span>
                )}
              </div>

              <div className="space-y-2.5 text-sm text-muted-foreground mb-6">
                <p className="text-foreground/90">
                  Comprehensive in-person doctor consultation and physical checkup at clinic.
                </p>
                <div className="p-3 rounded-xl bg-muted/50 border border-border/60 space-y-1.5">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-medium text-foreground">Appointment Fee:</span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400 text-sm">
                      {formatINR(APPOINTMENT_PRICING.OFFLINE.APPOINTMENT.totalAmount)}
                    </span>
                  </div>
                  <div className="text-[11px] text-muted-foreground pt-1 border-t border-border/40">
                    Delivery Charges: Not Applicable
                  </div>
                </div>
              </div>
            </div>

            <Button
              variant={data.bookingType === "OFFLINE" && hasChosenInitialMode ? "hero" : "outline"}
              className="w-full rounded-full"
              onClick={(e) => {
                e.stopPropagation();
                handleSelectInitialMode("OFFLINE");
              }}
            >
              <Building2 className="h-4 w-4 mr-1.5" /> Book Offline Appointment
            </Button>
          </div>
        </div>

        {/* BOOKING FORM: Multi-Step Flow */}
        {hasChosenInitialMode && (
          <div ref={bookingRef} id="booking-form" className="animate-fade-up scroll-mt-6">
            <div className="text-center mb-8">
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 shadow-soft text-xs font-semibold text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                <ShieldCheck className="h-3.5 w-3.5" /> Trusted by 1000+ patients
              </span>
              <h2 className="mt-4 font-display text-3xl md:text-4xl font-bold text-foreground">
                Book Your Consultation
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Booking Type: <span className="font-semibold text-foreground">{data.bookingType === "ONLINE" ? "Online Consultation" : "Offline Clinic Visit"}</span> · Step {step} of {totalSteps}
              </p>
            </div>

            {/* Progress Bar */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-3 text-xs font-semibold">
                <span className="text-emerald-600 dark:text-emerald-400">
                  Step {step} of {totalSteps}: {
                    step === 1 ? "Health Concern" :
                    step === 2 ? "Booking Type & Plan" :
                    step === 3 ? "Date & Slot" :
                    step === 4 ? "Patient Details" : "Summary & Payment"
                  }
                </span>
                <a
                  href={`https://wa.me/917668610031?text=${waMessage}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-whatsapp inline-flex items-center gap-1.5 hover:underline"
                >
                  <MessageCircle className="h-3.5 w-3.5" /> Quick book on WhatsApp
                </a>
              </div>
              <div className="h-2 rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full bg-emerald-600 transition-all duration-500"
                  style={{ width: `${(step / totalSteps) * 100}%` }}
                />
              </div>
            </div>

            <div className="bg-card/95 backdrop-blur rounded-3xl p-6 md:p-10 shadow-card border border-border">
              {done ? (
                /* SUCCESS STATE */
                <div className="text-center py-8 animate-fade-up">
                  <div className="mx-auto h-20 w-20 grid place-items-center rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 shadow-glow">
                    <CheckCircle2 className="h-10 w-10" />
                  </div>
                  <h2 className="mt-6 font-display text-3xl font-bold">Appointment Confirmed! 🎉</h2>
                  <p className="mt-2 text-muted-foreground">
                    A confirmation message has been dispatched to <strong>{data.phone}</strong>.
                  </p>

                  <div className="mt-6 inline-block bg-muted/40 rounded-2xl p-6 text-left text-sm max-w-md w-full border border-border">
                    <div className="flex justify-between items-center pb-3 border-b border-border">
                      <div>
                        <span className="font-semibold text-foreground">{activeConcernDisplay}</span>
                        {confirmedBooking?._id && (
                          <div className="text-[11px] text-muted-foreground font-mono mt-0.5">
                            ID: #APPT-{confirmedBooking._id.slice(-8).toUpperCase()}
                          </div>
                        )}
                      </div>
                      <span className="text-xs font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                        {data.bookingType === "ONLINE" ? "Online" : "Offline"}
                      </span>
                    </div>

                    <div className="mt-3 space-y-2 text-xs text-muted-foreground">
                      <div>Patient: <strong className="text-foreground">{data.name}</strong></div>
                      <div>Contact: <strong className="text-foreground">{data.phone}</strong> · {data.email}</div>
                      <div>Appointment Date: <strong className="text-foreground">{data.day ? formatDay(data.day) : "-"}</strong></div>
                      <div>Appointment Time: <strong className="text-foreground">{data.slot || "-"}</strong></div>

                      {data.bookingType === "ONLINE" && (
                        <>
                          <div>Plan: <strong className="text-foreground">{pricing.planName}</strong></div>
                          <div>Delivery Charges: <strong className="text-emerald-600 dark:text-emerald-400">Included</strong></div>
                          <div>Delivery Address: <strong className="text-foreground">{data.address}, {data.city} - {data.pincode}</strong></div>
                        </>
                      )}

                      <div className="pt-2 border-t border-border flex justify-between items-center">
                        <span>Total Paid / Payable:</span>
                        <strong className="text-foreground text-sm font-bold">{formatINR(pricing.totalAmount)}</strong>
                      </div>

                      <div className="flex justify-between items-center">
                        <span>Payment Status:</span>
                        <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                          {data.paymentMethod === "online" ? "Paid Online" : "Pending (Pay at Consultation)"}
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
                          bookingType: "ONLINE",
                          planType: "SEVEN_DAYS",
                          name: "",
                          phone: "",
                          email: "",
                          age: "",
                          address: "",
                          city: "",
                          pincode: "",
                          day: "",
                          slot: "",
                          slotId: "",
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
                      <h2 className="font-display text-2xl font-bold">What's your health concern?</h2>
                      <p className="text-sm text-muted-foreground mt-1">
                        Select a category below or choose &ldquo;Other&rdquo; to describe.
                      </p>

                      <div className="mt-6 grid grid-cols-2 md:grid-cols-5 gap-3">
                        {problems.map((p) => (
                          <button
                            key={p.name}
                            type="button"
                            onClick={() => setData((d) => ({ ...d, problem: p.name }))}
                            className={cn(
                              "p-5 rounded-2xl border-2 text-center transition-all hover:-translate-y-1 cursor-pointer",
                              data.problem === p.name
                                ? "border-emerald-600 bg-emerald-50/50 dark:bg-emerald-950/40 shadow-glow"
                                : "border-border bg-background hover:border-emerald-500/40"
                            )}
                          >
                            <p.icon
                              className={cn(
                                "h-7 w-7 mx-auto",
                                data.problem === p.name ? "text-emerald-600 dark:text-emerald-400" : "text-muted-foreground"
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
                            placeholder="Describe your symptoms (e.g. chronic headache, joint pain, allergy...)"
                            value={data.customConcern}
                            onChange={(e) => setData((d) => ({ ...d, customConcern: e.target.value }))}
                            className="mt-2 rounded-xl bg-background"
                          />
                        </div>
                      )}
                    </div>
                  )}

                  {/* STEP 2: Booking Type & Plan Selection */}
                  {step === 2 && (
                    <div className="animate-fade-up space-y-6">
                      <div>
                        <h2 className="font-display text-2xl font-bold">Select Booking Type & Plan</h2>
                        <p className="text-sm text-muted-foreground mt-1">
                          Choose between an online video consultation with delivered medicines, or an offline clinic visit.
                        </p>
                      </div>

                      {/* Booking Type Selector */}
                      <div>
                        <Label className="text-xs uppercase tracking-wide text-muted-foreground font-semibold">
                          Booking Type
                        </Label>
                        <div className="mt-3 grid sm:grid-cols-2 gap-4">
                          {/* Online Radio Option */}
                          <div
                            onClick={() => handleSelectBookingType("ONLINE")}
                            className={cn(
                              "p-4 rounded-2xl border-2 cursor-pointer transition-all flex items-start gap-3.5",
                              data.bookingType === "ONLINE"
                                ? "border-emerald-600 bg-emerald-50/40 dark:bg-emerald-950/30 ring-2 ring-emerald-500/20"
                                : "border-border hover:border-emerald-500/40 bg-card"
                            )}
                          >
                            <input
                              type="radio"
                              name="bookingType"
                              checked={data.bookingType === "ONLINE"}
                              onChange={() => handleSelectBookingType("ONLINE")}
                              className="mt-1 h-4 w-4 text-emerald-600 focus:ring-emerald-500"
                            />
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <Video className="h-4 w-4 text-sky-600 dark:text-sky-400" />
                                <span className="font-bold text-base text-foreground">Online</span>
                              </div>
                              <p className="text-xs text-muted-foreground mt-1">
                                Video consult + medicines delivered to doorstep. Delivery charges included.
                              </p>
                            </div>
                          </div>

                          {/* Offline Radio Option */}
                          <div
                            onClick={() => handleSelectBookingType("OFFLINE")}
                            className={cn(
                              "p-4 rounded-2xl border-2 cursor-pointer transition-all flex items-start gap-3.5",
                              data.bookingType === "OFFLINE"
                                ? "border-emerald-600 bg-emerald-50/40 dark:bg-emerald-950/30 ring-2 ring-emerald-500/20"
                                : "border-border hover:border-emerald-500/40 bg-card"
                            )}
                          >
                            <input
                              type="radio"
                              name="bookingType"
                              checked={data.bookingType === "OFFLINE"}
                              onChange={() => handleSelectBookingType("OFFLINE")}
                              className="mt-1 h-4 w-4 text-emerald-600 focus:ring-emerald-500"
                            />
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <Building2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                                <span className="font-bold text-base text-foreground">Offline</span>
                              </div>
                              <p className="text-xs text-muted-foreground mt-1">
                                In-person clinic consultation in Mathura. Delivery charges not applicable.
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* If Online is selected: Show Plan Selection */}
                      {data.bookingType === "ONLINE" && (
                        <div className="pt-4 border-t border-border space-y-4 animate-fade-up">
                          <div className="flex items-center justify-between">
                            <Label className="text-xs uppercase tracking-wide text-muted-foreground font-semibold">
                              Choose Plan
                            </Label>
                            <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                              ✓ Delivery Charges Included
                            </span>
                          </div>

                          <div className="grid sm:grid-cols-2 gap-4">
                            {ONLINE_PLANS.map((plan) => {
                              const isSelected = data.planType === plan.id;
                              return (
                                <div
                                  key={plan.id}
                                  onClick={() => handleSelectPlan(plan.id)}
                                  className={cn(
                                    "relative p-5 rounded-2xl border-2 text-left transition-all cursor-pointer flex flex-col justify-between",
                                    isSelected
                                      ? "border-emerald-600 bg-emerald-50/50 dark:bg-emerald-950/40 shadow-glow ring-2 ring-emerald-500/20"
                                      : "border-border bg-card hover:border-emerald-500/40"
                                  )}
                                >
                                  {plan.badge && (
                                    <span className="absolute -top-3 right-4 px-2.5 py-0.5 rounded-full bg-emerald-600 text-white text-[10px] font-bold uppercase tracking-wider">
                                      {plan.badge}
                                    </span>
                                  )}

                                  <div>
                                    <div className="flex items-center justify-between">
                                      <h4 className="font-bold text-base text-foreground">{plan.duration}</h4>
                                      {isSelected ? (
                                        <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                                      ) : (
                                        <div className="h-5 w-5 rounded-full border-2 border-muted-foreground/30" />
                                      )}
                                    </div>
                                    <div className="mt-2 text-2xl font-bold font-display text-emerald-600 dark:text-emerald-400">
                                      {formatINR(plan.totalAmount)}
                                    </div>
                                    <div className="text-xs font-semibold text-emerald-700 dark:text-emerald-300 mt-1 flex items-center gap-1">
                                      <Check className="h-3.5 w-3.5" /> Delivery Included
                                    </div>
                                    <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                                      {plan.description}
                                    </p>
                                  </div>

                                  <div className="mt-4 pt-3 border-t border-border/70 flex justify-between items-center text-xs">
                                    <span className="text-muted-foreground">Final Payable:</span>
                                    <span className="font-bold text-foreground text-sm">{formatINR(plan.totalAmount)}</span>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {/* If Offline is selected: Show Offline Details (No online plan selection) */}
                      {data.bookingType === "OFFLINE" && (
                        <div className="pt-4 border-t border-border space-y-4 animate-fade-up">
                          <div className="p-5 rounded-2xl border-2 border-emerald-600 bg-emerald-50/50 dark:bg-emerald-950/40">
                            <div className="flex items-start justify-between">
                              <div>
                                <h4 className="font-bold text-lg text-foreground">Offline Appointment</h4>
                                <p className="text-xs text-muted-foreground mt-1">
                                  In-person physical examination with doctor at our clinic.
                                </p>
                              </div>
                              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                                Clinic Visit
                              </span>
                            </div>

                            <div className="mt-4 pt-3 border-t border-border/70 flex items-baseline justify-between">
                              <span className="text-sm text-muted-foreground">Appointment Fee:</span>
                              <span className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 font-display">
                                {formatINR(APPOINTMENT_PRICING.OFFLINE.APPOINTMENT.totalAmount)}
                              </span>
                            </div>

                            <div className="mt-2 text-xs text-muted-foreground">
                              Delivery Charges: <span className="font-medium text-foreground">Not Applicable</span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* STEP 3: Date & Slot Selection */}
                  {step === 3 && (
                    <div className="animate-fade-up">
                      <div className="flex items-center justify-between">
                        <div>
                          <h2 className="font-display text-2xl font-bold">Pick Date & Time</h2>
                          <p className="text-sm text-muted-foreground mt-1">
                            Showing available slots for {data.bookingType === "ONLINE" ? "Online Consultation" : "Offline Clinic Visit"}.
                          </p>
                        </div>
                        <span className="text-xs font-semibold px-3 py-1 rounded-full bg-muted text-foreground">
                          {data.bookingType === "ONLINE" ? "Online Slots" : "Clinic Slots"}
                        </span>
                      </div>

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
                            <span className="px-5 py-3 text-sm text-destructive">Slots unavailable. Please try again.</span>
                          )}
                          {days.map((d) => {
                            const count = (slotsByDay[d] || []).length;
                            return (
                              <button
                                key={d}
                                type="button"
                                onClick={() => setData((prev) => ({ ...prev, day: d, slot: "", slotId: "" }))}
                                className={cn(
                                  "px-5 py-2.5 rounded-xl border-2 text-sm font-semibold whitespace-nowrap transition cursor-pointer flex flex-col items-center min-w-[125px]",
                                  data.day === d
                                    ? "border-emerald-600 bg-emerald-600 text-white shadow-sm"
                                    : "border-border bg-card hover:border-emerald-500/40 text-foreground"
                                )}
                              >
                                <span>{formatDay(d)}</span>
                                <span
                                  className={cn(
                                    "text-[11px] font-normal mt-0.5",
                                    data.day === d ? "text-white/90" : "text-muted-foreground"
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
                                onClick={() => setData((prev) => ({ ...prev, slot: label, slotId: s._id }))}
                                className={cn(
                                  "py-3 rounded-xl border-2 text-sm font-medium transition flex items-center justify-center gap-1.5 cursor-pointer",
                                  data.slotId === s._id
                                    ? "border-emerald-600 bg-emerald-50/50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 font-semibold shadow-sm"
                                    : "border-border hover:border-emerald-500/40",
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
                            No appointment slots are currently open for {data.bookingType === "ONLINE" ? "online consultation" : "clinic visits"}. Please contact us on WhatsApp.
                          </p>
                        )}
                      </div>
                    </div>
                  )}

                  {/* STEP 4: Patient & Contact Details */}
                  {step === 4 && (
                    <div className="animate-fade-up space-y-5">
                      <div>
                        <h2 className="font-display text-2xl font-bold">Patient Details</h2>
                        <p className="text-sm text-muted-foreground mt-1">
                          {data.bookingType === "ONLINE"
                            ? "Please enter your contact information and delivery address for medicines."
                            : "Please enter your contact information for clinic appointment registration."}
                        </p>
                      </div>

                      <div className="grid sm:grid-cols-2 gap-4">
                        <Field
                          icon={User}
                          label="Full name *"
                          value={data.name}
                          onChange={(v) => setData((d) => ({ ...d, name: v }))}
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
                            setData((d) => ({ ...d, phone: cleaned.replace(/\D/g, "").slice(0, 10) }));
                          }}
                          placeholder="9876543210"
                        />
                        <Field
                          icon={Calendar}
                          label="Age *"
                          value={data.age}
                          onChange={(v) => setData((d) => ({ ...d, age: v.replace(/\D/g, "").slice(0, 3) }))}
                          placeholder="32"
                        />
                        <Field
                          icon={Mail}
                          label="Email Address *"
                          value={data.email}
                          onChange={(v) => setData((d) => ({ ...d, email: v }))}
                          placeholder="priya@example.com (For confirmation & reminders)"
                          type="email"
                        />
                      </div>

                      {/* City Field (for all) */}
                      <div className="pt-2 border-t border-border/60">
                        {data.bookingType === "ONLINE" ? (
                          <div className="space-y-4">
                            <Field
                              icon={MapPin}
                              label="Delivery Address (House / Flat No, Street, Landmark) *"
                              value={data.address}
                              onChange={(v) => setData((d) => ({ ...d, address: v }))}
                              placeholder="e.g. Flat 301, Krishna Heights, Civil Lines"
                            />
                            <div className="grid sm:grid-cols-2 gap-4">
                              <Field
                                icon={Building2}
                                label="City *"
                                value={data.city}
                                onChange={(v) => setData((d) => ({ ...d, city: v }))}
                                placeholder="e.g. Mathura, Delhi, Mumbai"
                              />
                              <Field
                                icon={MapPin}
                                label="Pincode (6 Digits) *"
                                value={data.pincode}
                                onChange={(v) => setData((d) => ({ ...d, pincode: v.replace(/\D/g, "").slice(0, 6) }))}
                                placeholder="e.g. 281001"
                              />
                            </div>
                          </div>
                        ) : (
                          <Field
                            icon={Building2}
                            label="City / Location *"
                            value={data.city}
                            onChange={(v) => setData((d) => ({ ...d, city: v }))}
                            placeholder="e.g. Mathura, Agra"
                          />
                        )}
                      </div>
                    </div>
                  )}

                  {/* STEP 5: Appointment Summary & Confirmation */}
                  {step === 5 && (
                    <div className="animate-fade-up space-y-6">
                      <div>
                        <h2 className="font-display text-2xl font-bold">Appointment Summary</h2>
                        <p className="text-sm text-muted-foreground mt-1">
                          Please verify your consultation details before finalizing.
                        </p>
                      </div>

                      {/* Summary Box matching Requirement 9 */}
                      <div className="rounded-2xl border border-emerald-600/30 bg-emerald-50/30 dark:bg-emerald-950/30 p-6 space-y-3.5 text-sm">
                        <div className="font-bold text-xs uppercase tracking-wider text-emerald-700 dark:text-emerald-300 pb-2 border-b border-border/70">
                          {data.bookingType === "ONLINE" ? "Online Consultation Summary" : "Offline Consultation Summary"}
                        </div>

                        <Row label="Booking Type" value={data.bookingType === "ONLINE" ? "Online" : "Offline"} />

                        {data.bookingType === "ONLINE" ? (
                          <>
                            <Row label="Plan" value={pricing.planName} />
                            <Row label="Duration" value={pricing.durationText} />
                            <Row label="Appointment Date" value={data.day ? formatDay(data.day) : "-"} />
                            <Row label="Appointment Time" value={data.slot || "-"} />
                            <Row label="Plan Amount" value={formatINR(pricing.baseAmount)} />
                            <Row
                              label="Delivery Charges"
                              value={<span className="text-emerald-600 dark:text-emerald-400 font-semibold">Included</span>}
                            />
                          </>
                        ) : (
                          <>
                            <Row label="Appointment Date" value={data.day ? formatDay(data.day) : "-"} />
                            <Row label="Appointment Time" value={data.slot || "-"} />
                            <Row label="Appointment Fee" value={formatINR(pricing.baseAmount)} />
                            <Row
                              label="Delivery Charges"
                              value={<span className="text-muted-foreground font-normal">Not Applicable</span>}
                            />
                          </>
                        )}

                        <Row label="Patient Name" value={data.name} />
                        <Row label="Health Concern" value={activeConcernDisplay} />
                        <Row label="Contact" value={`${data.phone} · ${data.email}`} />

                        {data.bookingType === "ONLINE" && data.address && (
                          <Row label="Delivery Address" value={`${data.address}, ${data.city} - ${data.pincode}`} />
                        )}

                        {/* Total Payable Line */}
                        <div className="pt-3 border-t-2 border-emerald-600/40 flex justify-between items-baseline text-base">
                          <span className="font-bold text-foreground">Total Payable:</span>
                          <span className="font-extrabold text-2xl text-emerald-700 dark:text-emerald-300 font-display">
                            {formatINR(pricing.totalAmount)}
                          </span>
                        </div>
                      </div>

                      {/* Payment Method Option for Offline (Pay at Clinic vs Pay Online) */}
                      {data.bookingType === "OFFLINE" ? (
                        <div className="space-y-3">
                          <Label className="text-xs uppercase tracking-wide text-muted-foreground font-semibold">
                            Payment Preference
                          </Label>
                          <div className="grid sm:grid-cols-2 gap-3">
                            <label
                              className={cn(
                                "p-3.5 rounded-xl border-2 flex items-center gap-3 cursor-pointer transition-all",
                                data.paymentMethod === "offline"
                                  ? "border-emerald-600 bg-emerald-50/40 dark:bg-emerald-950/30"
                                  : "border-border hover:border-emerald-500/40"
                              )}
                            >
                              <input
                                type="radio"
                                name="offlinePaymentMethod"
                                checked={data.paymentMethod === "offline"}
                                onChange={() => setData((d) => ({ ...d, paymentMethod: "offline" }))}
                                className="h-4 w-4 text-emerald-600 focus:ring-emerald-500"
                              />
                              <div>
                                <span className="font-bold text-sm block">Pay at Clinic / Consultation</span>
                                <span className="text-xs text-muted-foreground">Pay ₹200 when you visit the clinic</span>
                              </div>
                            </label>

                            <label
                              className={cn(
                                "p-3.5 rounded-xl border-2 flex items-center gap-3 cursor-pointer transition-all",
                                data.paymentMethod === "online"
                                  ? "border-emerald-600 bg-emerald-50/40 dark:bg-emerald-950/30"
                                  : "border-border hover:border-emerald-500/40"
                              )}
                            >
                              <input
                                type="radio"
                                name="offlinePaymentMethod"
                                checked={data.paymentMethod === "online"}
                                onChange={() => setData((d) => ({ ...d, paymentMethod: "online" }))}
                                className="h-4 w-4 text-emerald-600 focus:ring-emerald-500"
                              />
                              <div>
                                <span className="font-bold text-sm block">Pay Online Now (Razorpay)</span>
                                <span className="text-xs text-muted-foreground">Instant confirmation via UPI / Card</span>
                              </div>
                            </label>
                          </div>
                        </div>
                      ) : (
                        <div className="p-4 rounded-2xl border border-emerald-600/30 bg-muted/40 flex items-center gap-3">
                          <CreditCard className="h-5 w-5 text-emerald-600 shrink-0" />
                          <p className="text-xs text-muted-foreground">
                            Online subscription plan requires online payment via Razorpay. Fast, 100% secure payment through UPI, Cards, or Netbanking.
                          </p>
                        </div>
                      )}
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
                        className="bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-base px-6 h-12 shadow-glow"
                      >
                        {submitting ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing...
                          </>
                        ) : data.bookingType === "ONLINE" ? (
                          <>
                            <CreditCard className="mr-2 h-4 w-4" /> Proceed to Payment ({formatINR(pricing.totalAmount)})
                          </>
                        ) : data.paymentMethod === "online" ? (
                          <>
                            <CreditCard className="mr-2 h-4 w-4" /> Proceed to Payment ({formatINR(pricing.totalAmount)})
                          </>
                        ) : (
                          <>
                            <Check className="mr-2 h-4 w-4" /> Confirm Appointment ({formatINR(pricing.totalAmount)})
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