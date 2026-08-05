import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Section, SectionHeader } from "@/components/site/Section";
import heroBg from "@/assets/hero-clinic-bg.jpg";
import {
  Scissors, Flower2, Activity, Sparkles, Brain, HeartPulse, Bone, Wind, Baby,
  ArrowRight, CheckCircle2, Stethoscope, Eye, RefreshCw, Dna, ShieldCheck,
  FlaskConical, Heart, Pill, Calendar, ShieldAlert, Check, Building2,
  FileText, MessageCircle
} from "lucide-react";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "Our Medical Services & Diagnostics — MD's HOMOEOPATHY" },
      { name: "description", content: "Explore 16 specialized homeopathic departments, in-house diagnostics (ECG, PFT, BGS), pathology test advice, lab testing, and health check-up packages." },
      { property: "og:title", content: "Homeopathic Services & Diagnostics — MD's" },
      { property: "og:description", content: "Personalized treatments, in-house diagnostics & pathology test guidance." },
    ],
  }),
  component: ServicesPage,
});

// --- ALL 16 MEDICAL SPECIALTIES DATA ---
const allSpecialties = [
  {
    id: "general",
    title: "1. General & Family Medicine",
    desc: "Comprehensive primary healthcare for all age groups.",
    icon: Stethoscope,
    color: "bg-emerald-500/10 text-emerald-600",
    tags: ["Fever", "Viral & Bacterial Infections", "Seasonal Illnesses", "Cough & Cold", "Fatigue", "Geriatric Care"],
  },
  {
    id: "derma",
    title: "2. Skin, Hair & Nail Care",
    desc: "Advanced homeopathic dermatology & hair restoration.",
    icon: Scissors,
    color: "bg-purple-500/10 text-purple-600",
    tags: ["Hair Fall", "Alopecia", "Psoriasis", "Eczema", "Vitiligo", "Acne", "Dandruff", "Fungal Infections"],
  },
  {
    id: "women",
    title: "3. Women's Health",
    desc: "Natural hormonal balance and reproductive health.",
    icon: Flower2,
    color: "bg-pink-500/10 text-pink-600",
    tags: ["PCOS / PCOD", "Menstrual Disorders", "Hormonal Imbalance", "Infertility", "Pregnancy Support", "Menopause"],
  },
  {
    id: "men",
    title: "4. Men's Health",
    desc: "Confidential and root-cause solutions for men's wellness.",
    icon: Activity,
    color: "bg-blue-500/10 text-blue-600",
    tags: ["Male Infertility", "Erectile Dysfunction", "Premature Ejaculation", "Low Libido", "Prostate Enlargement"],
  },
  {
    id: "pediatric",
    title: "5. Child & Adolescent Care",
    desc: "Safe, sweet, zero side-effect remedies for kids.",
    icon: Baby,
    color: "bg-amber-500/10 text-amber-600",
    tags: ["Recurrent Colds", "Allergies", "Asthma", "Poor Immunity", "Growth Concerns", "Bedwetting"],
  },
  {
    id: "ortho",
    title: "6. Bone & Joint Care",
    desc: "Relief for chronic joint pain, stiffness and spinal disorders.",
    icon: Bone,
    color: "bg-orange-500/10 text-orange-600",
    tags: ["Osteoarthritis", "Rheumatoid Arthritis", "Gout", "Cervical Spondylosis", "Sciatica", "Slip Disc"],
  },
  {
    id: "ent",
    title: "7. Respiratory & ENT Care",
    desc: "Immunity building against sinus, asthma and environmental triggers.",
    icon: Wind,
    color: "bg-teal-500/10 text-teal-600",
    tags: ["Asthma", "Sinusitis", "Allergic Rhinitis", "Bronchitis", "Tonsillitis", "Dust & Food Allergy"],
  },
  {
    id: "gastro",
    title: "8. Digestive & Gastrointestinal",
    desc: "Restoring gut balance, acidity relief, and liver health.",
    icon: Activity,
    color: "bg-lime-500/10 text-lime-600",
    tags: ["Acidity / GERD", "IBS", "Constipation", "Fatty Liver", "Piles & Fissure", "Lactose Intolerance"],
  },
  {
    id: "urology",
    title: "9. Kidney & Urinary Care",
    desc: "Natural dissolution support for stones & UTI relief.",
    icon: FlaskConical,
    color: "bg-cyan-500/10 text-cyan-600",
    tags: ["Kidney Stones", "Ureteric Stones", "Recurrent UTIs", "Burning Urination", "Prostate Health"],
  },
  {
    id: "metabolic",
    title: "10. Endocrine & Metabolic",
    desc: "Managing thyroid, diabetes, and metabolic wellness.",
    icon: RefreshCw,
    color: "bg-indigo-500/10 text-indigo-600",
    tags: ["Thyroid (Hypo/Hyper)", "Diabetes Management", "Obesity & Weight", "High Cholesterol"],
  },
  {
    id: "cardio",
    title: "11. Heart & Brain Care",
    desc: "Supportive care for BP, cardiac health, and nerve issues.",
    icon: HeartPulse,
    color: "bg-rose-500/10 text-rose-600",
    tags: ["High Blood Pressure", "Palpitations", "Migraine", "Vertigo", "Facial Palsy", "Neuropathic Pain"],
  },
  {
    id: "neuro",
    title: "12. Mental Health & Wellness",
    desc: "Non-addictive emotional and cognitive wellness.",
    icon: Brain,
    color: "bg-sky-500/10 text-sky-600",
    tags: ["Anxiety & Stress", "Depression", "Insomnia", "Panic Disorder", "OCD", "ADHD Support"],
  },
  {
    id: "autoimmune",
    title: "13. Autoimmune & Rare Care",
    desc: "Deep constitutional therapy for complex immune disorders.",
    icon: Dna,
    color: "bg-violet-500/10 text-violet-600",
    tags: ["Lupus (SLE)", "Ankylosing Spondylitis", "Psoriatic Arthritis", "Chronic Inflammation"],
  },
  {
    id: "cancer",
    title: "14. Cancer Supportive Care",
    desc: "Supportive homeopathic care alongside conventional therapy.",
    disclaimer: "Homeopathy is offered as supportive care and not as a replacement for cancer treatment.",
    icon: ShieldCheck,
    color: "bg-emerald-600/10 text-emerald-700",
    tags: ["Symptom Relief", "Chemo & Radiation Support", "Pain & Fatigue", "Appetite Improvement"],
  },
  {
    id: "eye",
    title: "15. Eye & Oral Care",
    desc: "Relief for dry eyes, styes, mouth ulcers, and gum issues.",
    icon: Eye,
    color: "bg-yellow-500/10 text-yellow-600",
    tags: ["Dry Eyes", "Allergic Eye Disorders", "Recurrent Mouth Ulcers", "Gum Infections"],
  },
  {
    id: "rehab",
    title: "16. Rehabilitation & Wellness",
    desc: "Post-surgery recovery, long-term disease management, and immunity.",
    icon: Heart,
    color: "bg-red-500/10 text-red-600",
    tags: ["Post-Surgical Recovery", "Immunity Boost", "Lifestyle Counseling", "Wellness Programs"],
  },
];

const checkupPackages = [
  { title: "General Health Check-up", desc: "CBC, Blood Sugar, Lipid Profile, LFT, KFT, Urine Examination" },
  { title: "Executive Health Package", desc: "Fast-track comprehensive check-up designed for busy professionals" },
  { title: "Women's Health Package", desc: "CBC, Blood Sugar, Thyroid, Iron Studies, Vit D/B12, Hormones" },
  { title: "Men's Health Package", desc: "CBC, Blood Sugar, Lipid Profile, PSA (indicated), LFT & KFT" },
  { title: "Senior Citizen Package", desc: "Age-tailored investigations with comprehensive physician evaluation" },
  { title: "Diabetes Care Package", desc: "Fasting & PP Sugar, HbA1c, Kidney Function, Urine Microalbumin" },
  { title: "Heart Health Package", desc: "ECG, Lipid Profile, Blood Sugar, Blood Pressure Screening" },
  { title: "Thyroid & Metabolic Package", desc: "T3, T4, TSH Profile & Metabolic Risk Assessment" },
  { title: "Fertility & Hormonal Package", desc: "AMH, FSH, LH, Prolactin, Thyroid Profile & Hormonal Assays" },
];

function ServicesPage() {
  return (
    <>
      {/* 1. HERO SECTION WITH HOMEPAGE EXACT BACKGROUND */}
      <section className="relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-bottom bg-no-repeat"
          style={{ backgroundImage: `url(${heroBg})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/85 via-background/75 to-background/60" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 md:py-24 text-center">
          <span className="inline-block px-4 py-1.5 rounded-full bg-leaf-soft/80 shadow-soft text-xs font-semibold text-primary uppercase tracking-wide">
            Medical Services & Diagnostics
          </span>
          <h1 className="mt-5 font-display text-4xl md:text-6xl font-bold text-balance text-foreground">
            Specialized Homeopathic Care & Diagnostic Center
          </h1>
          <p className="mt-5 max-w-3xl mx-auto text-lg text-muted-foreground text-pretty">
            Personalized treatment across 16 medical departments, integrated with in-house diagnostic facilities (ECG, PFT, BGS), pathology test advice, and pharmacy services.
          </p>
        </div>
      </section>

      {/* 2. IN-HOUSE DIAGNOSTIC SERVICES STRIP */}
      <Section className="bg-leaf-soft/40">
        <SectionHeader
          eyebrow="Modern Diagnostics"
          title="In-House Diagnostic & Clinical Services"
          subtitle="Essential diagnostic evaluations under one roof to support accurate homeopathic prescribing."
        />

        <div className="mt-10 grid md:grid-cols-3 gap-6">
          <div className="bg-card rounded-3xl p-7 shadow-soft border border-border">
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-leaf text-white mb-4">
              <HeartPulse className="h-6 w-6" />
            </div>
            <h3 className="font-display text-xl font-bold">ECG & Cardiology</h3>
            <p className="mt-2 text-sm text-muted-foreground">In-house Electrocardiogram (ECG) for instant heart rate, rhythm, and cardiac evaluation.</p>
          </div>

          <div className="bg-card rounded-3xl p-7 shadow-soft border border-border">
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-sky text-white mb-4">
              <Wind className="h-6 w-6" />
            </div>
            <h3 className="font-display text-xl font-bold">PFT (Pulmonary Function Test)</h3>
            <p className="mt-2 text-sm text-muted-foreground">Advanced lung capacity and breathing test for asthma, bronchitis, and respiratory issues.</p>
          </div>

          <div className="bg-card rounded-3xl p-7 shadow-soft border border-border">
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 text-white mb-4">
              <Activity className="h-6 w-6" />
            </div>
            <h3 className="font-display text-xl font-bold">BGS & Vital Screening</h3>
            <p className="mt-2 text-sm text-muted-foreground">Blood Glucose Screening (BGS), Blood Pressure Monitoring, SpO₂, Pulse & BMI Assessment.</p>
          </div>
        </div>
      </Section>

      {/* 3. 16 MEDICAL SPECIALTIES GRID */}
      <Section>
        <SectionHeader
          eyebrow="Specialties"
          title="16 Medical Departments We Specialize In"
          subtitle="Comprehensive, root-cause homeopathic solutions tailored to your unique body constitution."
        />

        <div className="mt-12 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {allSpecialties.map((s) => (
            <div key={s.id} className="group bg-card rounded-3xl p-6 shadow-soft hover:shadow-card transition-all flex flex-col border border-border/70 hover:-translate-y-1">
              <div className="flex items-center gap-3">
                <div className={`grid h-12 w-12 place-items-center rounded-2xl ${s.color} shrink-0`}>
                  <s.icon className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-display text-lg font-bold text-foreground leading-snug">{s.title}</h3>
                </div>
              </div>

              <p className="mt-3 text-sm text-muted-foreground flex-1">{s.desc}</p>

              {s.disclaimer && (
                <div className="mt-3 p-3 rounded-xl bg-amber-500/10 text-amber-700 text-xs font-medium border border-amber-500/20 flex items-start gap-2">
                  <ShieldAlert className="h-4 w-4 shrink-0 mt-0.5" />
                  <span>{s.disclaimer}</span>
                </div>
              )}

              <div className="mt-4 pt-3 border-t border-border/50">
                <div className="flex flex-wrap gap-1.5">
                  {s.tags.map((t) => (
                    <span key={t} className="px-2.5 py-1 rounded-lg bg-leaf-soft/60 text-[12px] font-medium text-foreground">
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              <Link to="/appointment" className="mt-5 inline-flex items-center gap-1 text-xs font-bold text-primary group-hover:gap-2 transition-all">
                Book Consultation <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          ))}
        </div>
      </Section>

      {/* 4. PREVENTIVE HEALTH CHECK-UP PACKAGES */}
      <Section className="bg-sky-soft/30">
        <SectionHeader
          eyebrow="Preventive Care"
          title="Preventive Health Check-Up Packages"
          subtitle="Comprehensive diagnostic lab packages in association with trusted diagnostic partners."
        />

        <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {checkupPackages.map((pkg) => (
            <div key={pkg.title} className="bg-card rounded-2xl p-6 shadow-soft border border-border/80 flex flex-col justify-between">
              <div>
                <h4 className="font-display text-lg font-bold text-foreground">{pkg.title}</h4>
                <p className="mt-2 text-xs text-muted-foreground leading-relaxed">{pkg.desc}</p>
              </div>
              <Button asChild variant="outline" size="sm" className="mt-4 rounded-full w-fit">
                <Link to="/appointment">Enquire Package</Link>
              </Button>
            </div>
          ))}
        </div>
      </Section>

      {/* 5. PHARMACY & SPECIAL PROPRIETARY PRODUCTS */}
      <Section>
        <div className="bg-gradient-to-br from-leaf-soft/70 via-card to-card rounded-3xl p-8 md:p-12 shadow-soft border border-primary/20 grid lg:grid-cols-2 gap-10 items-center">
          <div>
            <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-card text-primary text-xs font-bold uppercase tracking-wide mb-4 shadow-soft">
              <Pill className="h-4 w-4" /> Homeopathic Pharmacy & Formulations
            </span>
            <h2 className="font-display text-3xl font-bold text-foreground">
              Doctor-Formulated Remedies & Pharmacy
            </h2>
            <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
              We stock authentic Mother Tinctures, Biochemic remedies, and custom clinical formulations including our signature <b>BR Oil</b> and <b>Scalp Vital Spray</b> for hair growth.
            </p>
            <div className="mt-6 space-y-2">
              {[
                "Individualized Constitutional Medicines",
                "Pure Mother Tinctures & Biochemic Formulations",
                "BR Oil — Special Scalp Nourishment Formula",
                "Scalp Vital Spray — Natural Hair Regrowth Support",
                "Express Doorstep Delivery Across India",
              ].map((item) => (
                <div key={item} className="flex items-center gap-2 text-sm font-medium text-foreground">
                  <Check className="h-4 w-4 text-primary shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-card rounded-3xl p-8 shadow-card border border-border text-center space-y-4">
            <h3 className="font-display text-2xl font-bold text-foreground">Need Customized Medicine?</h3>
            <p className="text-xs text-muted-foreground">Consult with our homeopathic doctors to receive your personalized treatment kit delivered right to your doorstep.</p>
            <div className="pt-2 flex flex-col sm:flex-row gap-3">
              <Button asChild variant="hero" className="flex-1 rounded-full">
                <Link to="/appointment">Book Consultation</Link>
              </Button>
              <Button asChild variant="outline" className="flex-1 rounded-full">
                <Link to="/shop">View Shop Kits</Link>
              </Button>
            </div>
          </div>
        </div>
      </Section>

      {/* 6. DIAGNOSTIC TEST ADVICE & PATHOLOGY ASSISTANCE SECTION */}
      <Section className="pb-16">
        <div className="rounded-3xl bg-gradient-to-br from-leaf-soft/90 via-card to-card p-8 md:p-12 border-2 border-primary/20 shadow-glow">
          <div className="max-w-3xl mx-auto text-center">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-card text-primary text-xs font-bold uppercase tracking-wide shadow-soft mb-4">
              <FlaskConical className="h-4 w-4" /> Comprehensive Pathology & Test Guidance
            </span>
            
            <h2 className="font-display text-3xl md:text-5xl font-bold text-foreground">
              Confused About Which Diagnostic Tests You Need?
            </h2>
            
            <p className="mt-4 text-base md:text-lg text-muted-foreground text-pretty leading-relaxed">
              Medical testing can be expensive and confusing. At <b>MD's HOMOEOPATHY</b>, our doctors analyze your exact symptoms first to guide you on <b>which tests are truly necessary, WHY you need them, and which unnecessary tests you should avoid</b> — saving you time and money.
            </p>
          </div>

          {/* Key Benefits Grid */}
          <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-card p-5 rounded-2xl shadow-soft border border-border">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-primary/10 text-primary mb-3">
                <Stethoscope className="h-5 w-5" />
              </div>
              <h3 className="font-bold text-foreground text-sm">Right Test Recommendation</h3>
              <p className="mt-1 text-xs text-muted-foreground">We advise only essential tests relevant to your root condition, preventing unneeded lab expenses.</p>
            </div>

            <div className="bg-card p-5 rounded-2xl shadow-soft border border-border">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-sky-500/10 text-sky-600 mb-3">
                <Building2 className="h-5 w-5" />
              </div>
              <h3 className="font-bold text-foreground text-sm">Top Pathology Partners</h3>
              <p className="mt-1 text-xs text-muted-foreground">Tie-ups with NABL-accredited diagnostic labs to ensure 100% accurate & reliable report results.</p>
            </div>

            <div className="bg-card p-5 rounded-2xl shadow-soft border border-border">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-emerald-500/10 text-emerald-600 mb-3">
                <CheckCircle2 className="h-5 w-5" />
              </div>
              <h3 className="font-bold text-foreground text-sm">Home Sample Collection</h3>
              <p className="mt-1 text-xs text-muted-foreground">Doorstep blood and sample collection through our pathology lab partners for your maximum convenience.</p>
            </div>

            <div className="bg-card p-5 rounded-2xl shadow-soft border border-border">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-amber-500/10 text-amber-600 mb-3">
                <FileText className="h-5 w-5" />
              </div>
              <h3 className="font-bold text-foreground text-sm">Detailed Report Analysis</h3>
              <p className="mt-1 text-xs text-muted-foreground">Our doctors explain your test reports line-by-line so you clearly understand your health parameters.</p>
            </div>
          </div>

          {/* Supported Tests List */}
          <div className="mt-8 bg-card/80 backdrop-blur rounded-2xl p-6 border border-border">
            <h4 className="text-xs font-bold uppercase tracking-wider text-primary mb-3">Pathology & Diagnostic Investigations Facilitated:</h4>
            <div className="flex flex-wrap gap-2 text-xs font-medium">
              {[
                "Thyroid Profile (T3, T4, TSH)", "CBC & Immunity Screening", "HbA1c & Blood Sugar",
                "Lipid Profile (Cholesterol)", "Liver Function Test (LFT)", "Kidney Function Test (KFT)",
                "Vitamin D & B12 Levels", "Hormonal Panel (PCOS/PCOD)", "In-House ECG & PFT", "Allergy Screening"
              ].map((test) => (
                <span key={test} className="px-3 py-1.5 rounded-full bg-leaf-soft text-foreground border border-leaf-soft">
                  ✓ {test}
                </span>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-8 text-center flex flex-wrap gap-4 justify-center">
            <Button asChild size="xl" variant="hero" className="rounded-full">
              <Link to="/appointment">
                <Stethoscope className="mr-2 h-4 w-4" /> Get Free Test Advice & Consultation
              </Link>
            </Button>

            <Button asChild size="xl" variant="outline" className="rounded-full border-primary text-primary hover:bg-leaf-soft">
              <a href="https://wa.me/917668610031?text=Hi%2C%20I%20want%20to%20know%20which%20diagnostic%20tests%20I%20should%20get%20done." target="_blank" rel="noreferrer">
                <MessageCircle className="mr-2 h-4 w-4 text-whatsapp" /> Ask Doctor on WhatsApp
              </a>
            </Button>
          </div>
        </div>
      </Section>
    </>
  );
}