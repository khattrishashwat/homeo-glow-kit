import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Section, SectionHeader } from "@/components/site/Section";
import heroBg from "@/assets/hero-clinic-bg.jpg";
import godfatherImg from "@/assets/godfathers.jpeg";

import {
  Award, Users, ShieldCheck, Heart, Leaf, Microscope, Stethoscope,
  ClipboardList, Pill, CheckCircle2, Star, ArrowRight, Calendar,
  Activity, Dna, FileText, ChevronDown, Sparkles, Scissors, Flower2,
  Brain, Bone, Wind, Baby, HeartPulse, Eye, Smile, RefreshCw,
  Building2, FlaskConical, TestTube, AlertCircle, ShieldAlert
} from "lucide-react";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About MD's HOMOEOPATHY — 20+ Years of Trusted Care" },
      { name: "description", content: "Learn about our leadership, 16 medical specialties, diagnostics, pharmacy & root-cause approach to homeopathic healing." },
      { property: "og:title", content: "About MD's HOMOEOPATHY" },
      { property: "og:description", content: "20+ years, 1000+ patients. Multi-specialty Homoeopathy with integrated diagnostics." },
    ],
  }),
  component: AboutPage,
});

// --- DATA DEFINITIONS ---

const leadershipTeam = [
  {
    name: "Mrs. Kirti Bhargava",
    role: "Director – Administration & Finance",
    tag: "Leadership & Management",
    desc: "Behind every successful healthcare institution is a strong system of management. Mrs. Kirti Bhargava oversees the administration, finance, operations, and organizational planning of MD's HOMOEOPATHY. Her dedication, discipline, and commitment ensure that every aspect of the clinic functions smoothly, allowing the medical team to focus entirely on patient care. Her leadership has been instrumental in the continued growth and stability of the organization.",
    icon: Building2,
    color: "from-amber-500 to-orange-600",
  },
  {
    name: "Dr. Parth Bhargava",
    role: "Homoeopathic Consultant & Member – Research & Development (R&D) Cell",
    tag: "Clinical Innovation & Patient Care",
    desc: "Dr. Parth Bhargava has a vision to provide ethical, evidence-informed, and compassionate homoeopathic care. He is committed to delivering personalized treatment by integrating classical homoeopathic principles with modern diagnostic support. Alongside his clinical practice, he actively contributes to the clinic's Research & Development Cell, focusing on clinical innovation, case documentation, treatment protocols, and the advancement of homoeopathic healthcare. His mission is to provide every patient with quality healthcare built on trust, compassion, and long-term wellness.",
    icon: Stethoscope,
    color: "from-emerald-500 to-teal-700",
  },
  {
    name: "Dr. Gaurav Bhargava",
    role: "Senior Homoeopathic Consultant & Head – Research & Development (R&D) Cell",
    tag: "Head of R&D Cell",
    desc: "Dr. Gaurav Bhargava is a senior homoeopathic physician with extensive clinical experience and a deep commitment to advancing homoeopathic science. As the Head of the Research & Development Cell at MD's HOMOEOPATHY, he leads clinical research, treatment protocol development, case analysis, and academic initiatives that strengthen evidence-based homoeopathic practice. Choosing to remain focused on patient care and research rather than public visibility, he plays a vital role in shaping the clinic's scientific and clinical excellence.",
    icon: Microscope,
    color: "from-blue-600 to-indigo-700",
  },
];

const specialties = [
  {
    id: 1,
    icon: Stethoscope,
    title: "1. General & Family Medicine",
    sub: "Comprehensive healthcare for patients of all ages.",
    items: ["Fever", "Viral & Bacterial Infections", "Seasonal Illnesses", "Common Cold & Cough", "Weakness & Fatigue", "Recurrent Fever", "General Health Problems", "Lifestyle Disorders", "Preventive Healthcare", "Geriatric (Senior Citizen) Care"],
  },
  {
    id: 2,
    icon: Scissors,
    title: "2. Skin, Hair & Nail Disorders",
    sub: "Holistic dermatology care for long-lasting skin and scalp health.",
    sections: [
      { name: "Skin Disorders", list: ["Psoriasis", "Eczema", "Dermatitis", "Vitiligo", "Acne", "Fungal Infections", "Urticaria", "Lichen Planus", "Warts", "Corns", "Pigmentation Disorders"] },
      { name: "Hair Disorders", list: ["Hair Fall", "Alopecia", "Dandruff", "Scalp Psoriasis", "Seborrheic Dermatitis"] },
      { name: "Nail Disorders", list: ["Fungal Nail Infection", "Nail Deformities", "Brittle Nails"] },
    ]
  },
  {
    id: 3,
    icon: Flower2,
    title: "3. Women's Health",
    sub: "Specialized natural balance for every stage of a woman's life.",
    items: ["PCOS / PCOD", "Menstrual Disorders", "White Discharge", "Hormonal Imbalance", "Infertility", "Pregnancy Support", "Menopause", "Fibroids", "Ovarian Cysts"],
  },
  {
    id: 4,
    icon: Users,
    title: "4. Men's Health",
    sub: "Confidential and effective treatment for men's wellness.",
    items: ["Male Infertility", "Erectile Dysfunction", "Premature Ejaculation", "Low Libido", "Prostate Enlargement", "Urinary Problems"],
  },
  {
    id: 5,
    icon: Baby,
    title: "5. Child & Adolescent Care",
    sub: "Gentle, zero side-effect remedies for infants and children.",
    items: ["Recurrent Colds", "Recurrent Cough", "Allergies", "Asthma", "Poor Immunity", "Growth Concerns", "Bedwetting", "Digestive Disorders", "Skin Diseases", "Behavioral Concerns"],
  },
  {
    id: 6,
    icon: Bone,
    title: "6. Bone, Joint & Musculoskeletal Care",
    sub: "Relief from chronic joint pains, stiffness, and spinal issues.",
    items: ["Osteoarthritis", "Rheumatoid Arthritis", "Gout", "Cervical Spondylosis", "Lumbar Spondylosis", "Slip Disc", "Frozen Shoulder", "Sciatica", "Tennis Elbow", "Heel Pain", "Plantar Fasciitis", "Muscle Pain", "Sprain & Strain"],
  },
  {
    id: 7,
    icon: Wind,
    title: "7. Respiratory, ENT & Allergy Care",
    sub: "Immunity building against environmental triggers and sinus problems.",
    sections: [
      { name: "Respiratory", list: ["Asthma", "Bronchitis", "COPD", "Chronic Cough"] },
      { name: "ENT", list: ["Sinusitis", "Nasal Polyps", "Tonsillitis", "Ear Infection", "Allergic Rhinitis", "Deviated Nasal Symptoms"] },
      { name: "Allergies", list: ["Dust Allergy", "Food Allergy", "Skin Allergy", "Drug Allergy"] },
    ]
  },
  {
    id: 8,
    icon: Activity,
    title: "8. Digestive, Liver & Gastrointestinal Care",
    sub: "Restoring gut balance, acidity relief, and digestive health.",
    items: ["Acidity", "GERD", "Gastritis", "Lactose Intolerance", "IBS", "Constipation", "Diarrhea", "Piles", "Fissure", "Fatty Liver", "Liver Disorders", "Gall Bladder Disorders", "Indigestion"],
  },
  {
    id: 9,
    icon: FlaskConical,
    title: "9. Kidney, Urinary & Prostate Care",
    sub: "Natural dissolution support for stones and urinary relief.",
    items: ["Kidney Stones", "Ureteric Stones", "Recurrent Stones", "UTI", "Burning Urination", "Frequent Urination", "Enlarged Prostate", "Kidney Disorders"],
  },
  {
    id: 10,
    icon: RefreshCw,
    title: "10. Hormonal, Endocrine & Metabolic Disorders",
    sub: "Managing thyroid, diabetes, and metabolic health naturally.",
    items: ["Thyroid Disorders", "Diabetes", "Obesity", "Weight Management", "High Cholesterol", "Metabolic Syndrome", "Vitamin Deficiencies"],
  },
  {
    id: 11,
    icon: HeartPulse,
    title: "11. Heart, Brain & Nervous System Care",
    sub: "Supportive care for cardiac health, migraine, and nerve pains.",
    sections: [
      { name: "Heart", list: ["High Blood Pressure", "Heart Health Monitoring", "Palpitations"] },
      { name: "Neurology", list: ["Migraine", "Headache", "Vertigo", "Facial Palsy", "Trigeminal Neuralgia", "Neuropathic Pain"] },
    ]
  },
  {
    id: 12,
    icon: Brain,
    title: "12. Mental Health & Behavioral Disorders",
    sub: "Non-addictive emotional and cognitive wellness support.",
    items: ["Anxiety", "Stress", "Depression", "Panic Disorder", "Insomnia", "OCD", "ADHD (Supportive Care)", "Autism", "Cerebral palsy", "Emotional Well-being"],
  },
  {
    id: 13,
    icon: Dna,
    title: "13. Autoimmune, Chronic & Rare Disorders",
    sub: "Specialized deep-acting constitutional therapy for complex conditions.",
    items: ["Rheumatoid Arthritis", "Lupus", "Ankylosing Spondylitis", "Psoriatic Arthritis", "Autoimmune Skin Disorders", "Chronic Inflammatory Disorders", "Rare Disorders", "Difficult-to-Treat Conditions"],
  },
  {
    id: 14,
    icon: ShieldCheck,
    title: "14. Cancer & Supportive Care",
    sub: "Supportive homeopathic care alongside conventional treatment.",
    disclaimer: "Homeopathy is offered as supportive care and not as a replacement for cancer treatment.",
    items: ["Symptom Relief", "Chemotherapy Support", "Radiation Therapy Support", "Pain & Fatigue Management", "Appetite Improvement", "Recovery Support", "Quality of Life Enhancement"],
  },
  {
    id: 15,
    icon: Eye,
    title: "15. Eye, Oral & Dental Care",
    sub: "Relief for dry eyes, styes, mouth ulcers, and gum issues.",
    sections: [
      { name: "Eye", list: ["Allergic Eye Disorders", "Dry Eyes", "Stye"] },
      { name: "Oral", list: ["Mouth Ulcers", "Recurrent Aphthous Ulcers", "Gum Problems", "Oral Infections"] },
    ]
  },
  {
    id: 16,
    icon: Heart,
    title: "16. Rehabilitation, Wellness & Preventive Care",
    sub: "Post-surgery recovery, long-term disease management, and immunity.",
    items: ["Post-Surgical Recovery", "Post-Illness Recovery", "Long-Term Chronic Disease Management", "Immunity Enhancement", "Lifestyle Counseling", "Wellness Programs"],
  },
];

const checkupPackages = [
  { name: "General Health Package", desc: "CBC, Blood Sugar, Lipid Profile, LFT, KFT, Urine Examination" },
  { name: "Executive Health Package", desc: "Tailored for working professionals needing quick holistic screening" },
  { name: "Women's Health Package", desc: "CBC, Blood Sugar, Thyroid Profile, Iron Studies, Vitamin D & B12, Hormones" },
  { name: "Men's Health Package", desc: "CBC, Blood Sugar, Lipid Profile, PSA (when indicated), LFT & KFT" },
  { name: "Senior Citizen Package", desc: "Age-appropriate comprehensive screening with physician consultation" },
  { name: "Diabetes Care Package", desc: "Fasting & PP Sugar, HbA1c, Kidney Function, Urine Microalbumin" },
  { name: "Heart Health Package", desc: "ECG, Lipid Profile, Blood Sugar, Blood Pressure Assessment" },
  { name: "Thyroid & Metabolic Package", desc: "T3, T4, TSH Profile & Metabolic Evaluation" },
  { name: "Fertility & Hormonal Package", desc: "AMH, FSH, LH, Prolactin, Thyroid Profile & Hormonal Assays" },
];

function AboutPage() {
  const [activeSpecialty, setActiveSpecialty] = useState<number>(1);

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
            About MD's HOMOEOPATHY
          </span>
          <h1 className="mt-5 font-display text-4xl md:text-6xl font-bold text-balance text-foreground">
            Multi-Specialty Homeopathic Care & Diagnostics
          </h1>
          <p className="mt-5 max-w-3xl mx-auto text-lg text-muted-foreground text-pretty">
            Integrating classical homoeopathy, modern diagnostic support, preventive health check-ups, and an dedicated R&D Cell under one roof.
          </p>
        </div>
      </section>

      {/* 2. IN LOVING MEMORY SECTION */}
      <Section>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center bg-card rounded-3xl p-8 md:p-12 shadow-soft border border-border/50">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-leaf-soft text-primary text-xs font-bold uppercase tracking-wider mb-4">
              Our Foundation & Heritage
            </div>

            <h2 className="text-3xl md:text-4xl font-bold leading-tight text-foreground font-display">
              In Loving Memory
            </h2>

            <div className="mt-6 space-y-6">
              <div className="border-l-4 border-primary pl-4">
                <h3 className="text-xl font-bold text-foreground">Late Smt. Manjusha Bhargava</h3>
                <p className="mt-2 text-muted-foreground text-sm leading-relaxed">
                  The name <b>MD's HOMOEOPATHY</b> is dedicated to the loving memory of our beloved Mother, Late Smt. Manjusha Bhargava. Her values, kindness, and inspiration continue to guide us in serving humanity with compassion and care.
                </p>
              </div>

              <div className="border-l-4 border-secondary pl-4">
                <h3 className="text-xl font-bold text-foreground">Late Dr. Durgendra Nath Bhargava</h3>
                <p className="mt-2 text-muted-foreground text-sm leading-relaxed">
                  Dedicated also to the loving memory of our beloved Father, Late Dr. Durgendra Nath Bhargava. He was a respected Researcher and Professor at Pt. Deen Dayal Upadhyay Veterinary College, Mathura. His dedication to education, research, and healing remains our constant beacon.
                </p>
              </div>
            </div>
          </div>

          <div className="flex justify-center lg:justify-end">
            <div className="relative group">
              <div className="absolute -inset-2 bg-gradient-leaf rounded-3xl opacity-30 blur-xl group-hover:opacity-50 transition" />
              <img
                src={godfatherImg}
                alt="Late Smt. Manjusha Bhargava and Late Dr. Durgendra Nath Bhargava"
                className="relative w-full max-w-md rounded-3xl shadow-2xl object-cover"
              />
            </div>
          </div>
        </div>
      </Section>

      {/* 3. LEADERSHIP & MANAGEMENT TEAM */}
      <Section className="bg-leaf-soft/30">
        <SectionHeader
          eyebrow="Leadership & Direction"
          title="Meet Our Leadership Team"
          subtitle="Experienced administrators and dedicated medical researchers driving excellence in homeopathic care."
        />

        <div className="mt-12 grid md:grid-cols-3 gap-8">
          {leadershipTeam.map((member) => (
            <div key={member.name} className="flex flex-col bg-card rounded-3xl p-7 shadow-soft hover:shadow-card transition-all border border-border/60">
              <div className="flex items-center gap-3 mb-4">
                <div className={`grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-gradient-to-br ${member.color} text-white shadow-soft`}>
                  <member.icon className="h-6 w-6" />
                </div>
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-primary">{member.tag}</span>
                  <h3 className="font-display text-xl font-bold text-foreground leading-tight">{member.name}</h3>
                </div>
              </div>
              <div className="text-xs font-semibold text-muted-foreground mb-4 pb-3 border-b border-border">
                {member.role}
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed flex-1 text-pretty">
                {member.desc}
              </p>
            </div>
          ))}
        </div>
      </Section>

      {/* 4. OUR MEDICAL SPECIALTIES (16 CATEGORIES) */}
      <Section>
        <SectionHeader
          eyebrow="Multi-Specialty Care"
          title="16 Specialized Medical Departments"
          subtitle="Comprehensive, root-cause homeopathic treatment across major health conditions."
        />

        {/* SPECIALTIES INTERACTIVE TAB LIST */}
        <div className="mt-10 grid lg:grid-cols-12 gap-8 items-start">
          {/* Left Menu / Selector */}
          <div className="lg:col-span-4 space-y-2 max-h-[600px] overflow-y-auto pr-2 scrollbar-thin">
            {specialties.map((s) => (
              <button
                key={s.id}
                onClick={() => setActiveSpecialty(s.id)}
                className={`w-full text-left p-4 rounded-2xl transition flex items-center justify-between gap-3 border ${
                  activeSpecialty === s.id
                    ? "bg-primary text-primary-foreground font-semibold shadow-soft border-primary"
                    : "bg-card hover:bg-leaf-soft text-foreground border-border"
                }`}
              >
                <div className="flex items-center gap-3">
                  <s.icon className={`h-5 w-5 shrink-0 ${activeSpecialty === s.id ? "text-primary-foreground" : "text-primary"}`} />
                  <span className="text-sm font-bold line-clamp-1">{s.title}</span>
                </div>
                <ArrowRight className={`h-4 w-4 shrink-0 transition-transform ${activeSpecialty === s.id ? "translate-x-1" : "opacity-40"}`} />
              </button>
            ))}
          </div>

          {/* Right Selected Content Card */}
          <div className="lg:col-span-8 bg-card rounded-3xl p-8 shadow-card border border-border/80 min-h-[450px]">
            {(() => {
              const current = specialties.find((s) => s.id === activeSpecialty);
              if (!current) return null;
              return (
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="grid h-12 w-12 place-items-center rounded-2xl bg-leaf-soft text-primary">
                      <current.icon className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="font-display text-2xl font-bold text-foreground">{current.title}</h3>
                      <p className="text-sm text-muted-foreground">{current.sub}</p>
                    </div>
                  </div>

                  {current.disclaimer && (
                    <div className="my-4 flex items-start gap-2.5 p-4 rounded-2xl bg-amber-500/10 text-amber-700 dark:text-amber-300 text-xs font-medium border border-amber-500/20">
                      <ShieldAlert className="h-4 w-4 shrink-0 mt-0.5" />
                      <span>{current.disclaimer}</span>
                    </div>
                  )}

                  {current.items && (
                    <div className="mt-6 grid sm:grid-cols-2 gap-3">
                      {current.items.map((item) => (
                        <div key={item} className="flex items-center gap-2.5 p-3 rounded-xl bg-leaf-soft/40 border border-leaf-soft text-sm font-medium">
                          <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {current.sections && (
                    <div className="mt-6 space-y-6">
                      {current.sections.map((sec) => (
                        <div key={sec.name}>
                          <h4 className="font-bold text-sm text-primary uppercase tracking-wider mb-3">{sec.name}</h4>
                          <div className="grid sm:grid-cols-2 gap-3">
                            {sec.list.map((item) => (
                              <div key={item} className="flex items-center gap-2.5 p-3 rounded-xl bg-leaf-soft/40 border border-leaf-soft text-sm font-medium">
                                <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                                <span>{item}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="mt-8 pt-6 border-t border-border flex flex-wrap items-center justify-between gap-4">
                    <p className="text-xs text-muted-foreground">Personalized homeopathic remedies formulated for root cause healing.</p>
                    <Button asChild variant="hero" size="sm" className="rounded-full">
                      <Link to="/appointment">Book Consultation for {current.title.split(". ")[1]}</Link>
                    </Button>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      </Section>

      {/* 5. DIAGNOSTICS & PREVENTIVE CHECK-UP PACKAGES */}
      <Section className="bg-sky-soft/30">
        <SectionHeader
          eyebrow="Integrated Diagnostics"
          title="In-House Diagnostic & Lab Services"
          subtitle="Combining advanced clinical evaluation with homeopathic treatment for accurate diagnostics."
        />

        <div className="mt-12 grid md:grid-cols-3 gap-6">
          <div className="bg-card rounded-3xl p-6 shadow-soft border border-border">
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-leaf text-white mb-4">
              <HeartPulse className="h-6 w-6" />
            </div>
            <h3 className="font-display text-xl font-bold">Cardiology & Pulmonology</h3>
            <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-primary" /> ECG (Electrocardiogram)</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-primary" /> Pulmonary Function Test (PFT)</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-primary" /> Blood Glucose Screening (BGS)</li>
            </ul>
          </div>

          <div className="bg-card rounded-3xl p-6 shadow-soft border border-border">
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-sky text-white mb-4">
              <Activity className="h-6 w-6" />
            </div>
            <h3 className="font-display text-xl font-bold">Vital Assessment</h3>
            <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-primary" /> Blood Pressure Monitoring</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-primary" /> Pulse & SpO₂ Examination</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-primary" /> Height, Weight & BMI Assessment</li>
            </ul>
          </div>

          <div className="bg-card rounded-3xl p-6 shadow-soft border border-border">
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 text-white mb-4">
              <FlaskConical className="h-6 w-6" />
            </div>
            <h3 className="font-display text-xl font-bold">Laboratory Support</h3>
            <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-primary" /> CBC, HbA1c, Lipid Profile</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-primary" /> LFT, KFT & Thyroid Profile</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-primary" /> Home Sample Collection Available</li>
            </ul>
          </div>
        </div>

        {/* CHECKUP PACKAGES GRID */}
        <div className="mt-12">
          <h3 className="font-display text-2xl font-bold text-center mb-8">Preventive Health Check-Up Packages</h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {checkupPackages.map((pkg) => (
              <div key={pkg.name} className="bg-card p-5 rounded-2xl shadow-soft border border-border/80 hover:shadow-card transition">
                <h4 className="font-bold text-foreground">{pkg.name}</h4>
                <p className="mt-1 text-xs text-muted-foreground">{pkg.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* 6. HOMEOPATHIC PHARMACY & PROPRIETARY PRODUCTS */}
      <Section>
        <div className="grid lg:grid-cols-2 gap-10 items-center bg-gradient-to-br from-leaf-soft/60 to-card p-8 md:p-12 rounded-3xl border border-primary/20 shadow-soft">
          <div>
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-card text-primary text-xs font-bold uppercase tracking-wide mb-4">
              <Pill className="h-3.5 w-3.5" /> In-House Homeopathic Pharmacy
            </span>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">
              Pure, Authenticated & Individualized Remedies
            </h2>
            <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
              Our in-house pharmacy maintains high-grade constitutional remedies, mother tinctures, and biochemic combinations. We also formulate specialized proprietary products for hair and scalp vitality.
            </p>
            <div className="mt-6 grid grid-cols-2 gap-3 text-sm font-medium">
              <div className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-primary" /> Individualized Medicines</div>
              <div className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-primary" /> Mother Tinctures</div>
              <div className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-primary" /> BR Oil (Scalp Formulations)</div>
              <div className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-primary" /> Scalp Vital Spray</div>
            </div>
          </div>
          <div className="bg-card rounded-3xl p-6 shadow-card border border-border space-y-4">
            <h3 className="font-bold text-lg text-foreground">Pharmacy Quality Guarantee</h3>
            <p className="text-xs text-muted-foreground">Each remedy mix is prepared according to strict homeopathic pharmacopoeia standards under qualified supervision.</p>
            <Button asChild variant="hero" className="w-full rounded-full">
              <Link to="/shop">Explore Recommended Products</Link>
            </Button>
          </div>
        </div>
      </Section>

      {/* 7. PHILOSOPHY & VALUES */}
      <Section className="bg-leaf-soft/40">
        <SectionHeader eyebrow="Philosophy" title="Heal the Cause, Not Just the Symptom" subtitle="We believe true healing happens when we treat the person — not just the disease." />
        <div className="mt-12 grid md:grid-cols-3 gap-6">
          {[
            { i: Microscope, t: "Root-Cause Diagnosis", d: "We dig deeper to understand triggers, lifestyle, and emotional health." },
            { i: Heart, t: "Personalized Care", d: "Every patient gets a remedy mix tailored to their unique constitution." },
            { i: Leaf, t: "Gentle & Natural", d: "Zero side effects. Safe for children, elderly, and pregnant women." },
          ].map(({ i: Ic, t, d }) => (
            <div key={t} className="bg-card rounded-3xl p-6 shadow-soft">
              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-leaf text-white"><Ic className="h-5 w-5" /></div>
              <h3 className="mt-4 font-semibold text-lg">{t}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{d}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* 8. CALL TO ACTION */}
      <Section>
        <div className="rounded-3xl bg-gradient-leaf p-10 md:p-14 text-center shadow-glow">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-primary-foreground">Ready to start your healing journey?</h2>
          <p className="mt-2 text-primary-foreground/90 max-w-xl mx-auto">Book an online or clinic consultation with Dr. Parth Bhargava and our expert team today.</p>
          <Button asChild size="xl" className="mt-6 bg-card text-primary hover:bg-card/90">
            <Link to="/appointment">Book Appointment <ArrowRight className="ml-2 h-4 w-4" /></Link>
          </Button>
        </div>
      </Section>
    </>
  );
}