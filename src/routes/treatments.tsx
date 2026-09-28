import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Section, SectionHeader } from "@/components/site/Section";
import heroBg from "@/assets/hero-clinic-bg.jpg";
import {
  Stethoscope,
  ClipboardList,
  Microscope,
  Pill,
  Heart,
  CheckCircle2,
  ShieldCheck,
  Activity,
  Sparkles,
  ChevronDown,
  Leaf,
  Brain,
  Award,
  Users,
  Clock,
  Sparkle,
  Zap,
  Check,
  X,
  FileText,
  UserCheck,
  FlaskConical,
  Layers,
  Lightbulb,
  Info,
  Droplets,
  SunMedium,
  CheckSquare,
} from "lucide-react";

export const Route = createFileRoute("/treatments")({
  head: () => ({
    meta: [
      { title: "Our Treatments — Homeopathic Treatment Process | MD's" },
      {
        name: "description",
        content:
          "Explore specialized homeopathic treatments for skin, respiratory, digestive, hormonal, joint, and pediatric conditions at MD's Homoeopathy.",
      },
      { property: "og:title", content: "Homeopathic Treatment Process — MD's" },
      {
        property: "og:description",
        content: "Personalized treatment plans for chronic and acute conditions.",
      },
    ],
  }),
  component: TreatmentsPage,
});

// --- CLINICAL DATA DEFINITIONS ---

const STATS = [
  { label: "Patients Treated", value: "15,000+", icon: Users },
  { label: "Clinical Experience", value: "20+ Years", icon: Award },
  { label: "Conditions Covered", value: "50+ Specialties", icon: Activity },
  { label: "Natural & Safe", value: "100% Side-Effect Free", icon: ShieldCheck },
];

const TREATMENT_CATEGORIES = [
  {
    id: "skin-hair",
    name: "Skin & Hair Care",
    icon: Leaf,
    description: "Deep, constitutional healing for chronic skin lesions, allergies, and hair fall without harsh steroids.",
    conditions: [
      {
        name: "Psoriasis & Eczema",
        description: "Reduces scaling, intense itching, and chronic skin inflammation by balancing immune system response.",
        symptoms: ["Dry & Flaky Skin", "Red Patches", "Severe Itching", "Recurring Flares"],
      },
      {
        name: "Acne & Hyperpigmentation",
        description: "Treats hormonal imbalances and digestive root causes to promote clear, healthy skin naturally.",
        symptoms: ["Cystic Acne", "Dark Spots", "Hormonal Breakouts", "Oily Skin"],
      },
      {
        name: "Alopecia & Hair Loss",
        description: "Stimulates dormant hair follicles, reduces scalp inflammation, and addresses underlying stress triggers.",
        symptoms: ["Patchy Hair Loss", "Excessive Shedding", "Dandruff", "Thinning Hair"],
      },
      {
        name: "Urticaria & Skin Allergies",
        description: "Desensitizes the immune system to environmental triggers for long-term relief from hives and rashes.",
        symptoms: ["Wheals & Hives", "Burning Sensation", "Sudden Swelling", "Allergic Rashes"],
      },
    ],
  },
  {
    id: "respiratory",
    name: "Respiratory & Allergies",
    icon: Activity,
    description: "Strengthens respiratory immunity to reduce dependence on inhalers, steroids, and daily antihistamines.",
    conditions: [
      {
        name: "Asthma & Chronic Bronchitis",
        description: "Relieves bronchospasms, reduces mucus congestion, and minimizes frequency of seasonal asthma attacks.",
        symptoms: ["Wheezing", "Shortness of Breath", "Chest Tightness", "Nighttime Cough"],
      },
      {
        name: "Allergic Rhinitis & Sinusitis",
        description: "Addresses hypersensitivity to dust, pollen, and weather changes to clear chronic nasal blockage.",
        symptoms: ["Frequent Sneezing", "Runny/Blocked Nose", "Facial Pressure", "Watery Eyes"],
      },
      {
        name: "Recurrent Tonsillitis & Cold",
        description: "Builds natural immunity in adults and children to prevent recurring throat infections and swollen glands.",
        symptoms: ["Swollen Tonsils", "Difficulty Swallowing", "Frequent Fever", "Sore Throat"],
      },
    ],
  },
  {
    id: "gastro",
    name: "Digestive & Gut Health",
    icon: Sparkles,
    description: "Restores gut microbiome balance, smooth digestion, and holistic metabolic wellness.",
    conditions: [
      {
        name: "IBS & Chronic Acidity",
        description: "Calms gut-brain axis sensitivity, normalizing bowel movements and relieving chronic GERD/bloating.",
        symptoms: ["Alternating Bowels", "Abdominal Cramps", "Heartburn", "Bloating"],
      },
      {
        name: "Fatty Liver & Gallbladder Support",
        description: "Promotes hepatic detox, improves lipid metabolism, and aids sluggish digestive function.",
        symptoms: ["Indigestion", "Nausea", "Fatigue", "Upper Abdominal Heaviness"],
      },
      {
        name: "Piles, Fissures & Constipation",
        description: "Gentle relief from inflammation, healing mucosa, and regulating intestinal peristalsis without laxative dependency.",
        symptoms: ["Painful Defecation", "Bleeding", "Hard Stools", "Anal Itching"],
      },
    ],
  },
  {
    id: "women-hormones",
    name: "Women's & Hormonal Health",
    icon: Heart,
    description: "Harmonizes endocrine systems naturally through every stage of a woman's life.",
    conditions: [
      {
        name: "PCOS / PCOD Management",
        description: "Regulates menstrual cycles, reduces ovarian cysts, and addresses acne/hirsutism root causes.",
        symptoms: ["Irregular Periods", "Weight Gain", "Facial Hair Growth", "Cystic Ovaries"],
      },
      {
        name: "Thyroid Imbalances (Hypo/Hyper)",
        description: "Supports pituitary-thyroid axis regulation to stabilize metabolism and energy levels naturally.",
        symptoms: ["Unexplained Weight Changes", "Fatigue", "Cold Intolerance", "Mood Swings"],
      },
      {
        name: "Menopausal Care & Fibroids",
        description: "Relieves hot flashes, night sweats, emotional volatility, and heavy menstrual bleeding.",
        symptoms: ["Hot Flashes", "Heavy Bleeding", "Pelvic Discomfort", "Sleep Disturbance"],
      },
    ],
  },
  {
    id: "pain-joints",
    name: "Joints, Bone & Pain",
    icon: ShieldCheck,
    description: "Reduces joint stiffness, inflammation, and cartilage degeneration without systemic painkiller side effects.",
    conditions: [
      {
        name: "Osteoarthritis & Rheumatoid Arthritis",
        description: "Controls joint swelling, slows cartilage erosion, and enhances mobility and flexibility.",
        symptoms: ["Joint Stiffness", "Morning Pain", "Swelling & Redness", "Restricted Movement"],
      },
      {
        name: "Cervical & Lumbar Spondylitis",
        description: "Alleviates nerve compression, muscle spasms, and chronic neck or back stiffness.",
        symptoms: ["Neck Stiffness", "Radiating Arm Pain", "Lower Back Ache", "Numbness in Fingers"],
      },
      {
        name: "Sciatica & Gout",
        description: "Treats sciatic nerve irritation and regulates uric acid metabolism to eliminate acute gout flares.",
        symptoms: ["Shooting Leg Pain", "Big Toe Swelling", "High Uric Acid", "Difficulty Walking"],
      },
    ],
  },
  {
    id: "mind-pediatrics",
    name: "Mind, Immunity & Child Health",
    icon: Brain,
    description: "Gentle, compassionate remedies for mental well-being, stress, and childhood development.",
    conditions: [
      {
        name: "Migraine & Tension Headaches",
        description: "Reduces frequency and severity of vascular headaches by addressing stress and hormonal triggers.",
        symptoms: ["Throbbing Headaches", "Light Sensitivity", "Nausea", "Visual Aura"],
      },
      {
        name: "Anxiety, Stress & Insomnia",
        description: "Restores nervous system balance, promoting restful sleep and emotional clarity naturally.",
        symptoms: ["Restlessness", "Panic Spells", "Poor Sleep Quality", "Mental Fatigue"],
      },
      {
        name: "Pediatric Immunity & Growth",
        description: "Safe, sweet-tasting remedies for children with frequent infections, bedwetting, or appetite issues.",
        symptoms: ["Recurrent Infections", "Poor Appetite", "Bedwetting", "Slow Growth"],
      },
    ],
  },
];

const PHILOSOPHY_PRINCIPLES = [
  {
    title: "Individualized Constitutional Care",
    desc: "Every patient's body manifests illness differently. We evaluate physical traits, mental temperament, and lifestyle factors to select remedies specific to your personal constitution.",
    icon: UserCheck,
  },
  {
    title: "Root Cause Healing",
    desc: "Rather than masking symptoms with synthetic blockers, homeopathic remedies gently trigger your body's intrinsic self-healing force to eliminate the disease from its roots.",
    icon: Zap,
  },
  {
    title: "Zero Side Effects & Chemical Toxicity",
    desc: "Potentized natural remedies are completely non-toxic, safe for infants, pregnant women, and elderly patients without risk of organ damage or medication dependency.",
    icon: ShieldCheck,
  },
  {
    title: "Mind-Body Integration",
    desc: "Emotional stress and psychological well-being are deeply linked to physical health. Our treatment protocols treat the whole human being rather than isolated organs.",
    icon: Brain,
  },
];

const SCIENCE_POTENTIZATION = [
  {
    title: "Natural Sourcing",
    desc: "Medicines are derived from clean botanical extracts, natural minerals, and bio-purified substances.",
    icon: Leaf,
  },
  {
    title: "Serial Potentization",
    desc: "Systematic dilution and succussion (vigorous agitation) unlock energy while eliminating chemical toxicity.",
    icon: FlaskConical,
  },
  {
    title: "Nanoparticle Dynamics",
    desc: "Modern spectroscopic studies show high homeopathic dilutions retain physical nanoparticles of the source material.",
    icon: Sparkles,
  },
  {
    title: "Sublingual Absorption",
    desc: "Pills dissolve under the tongue, allowing rapid absorption through nerve endings directly to the nervous system.",
    icon: Droplets,
  },
];

const MIASMATIC_THEORY = [
  {
    miasm: "Psora (Functional Sensitivity)",
    manifestation: "Hypersensitivity, itching skin rashes, functional indigestion, functional anxiety, and nervousness.",
    clinicalRole: "Forms the fundamental baseline of functional disharmony and heightened nerve reactions.",
  },
  {
    miasm: "Sycosis (Proliferative & Overgrowth)",
    manifestation: "Cystic formations, fibroids, warts, joint stiffness, fluid retention, and chronic mucosal discharge.",
    clinicalRole: "Drives excess tissue growth, inflammatory deposits, and metabolic stagnation.",
  },
  {
    miasm: "Syphilis (Destructive & Degenerative)",
    manifestation: "Deep ulcerations, cartilage erosion, severe joint destruction, autoimmune destruction, and tissue necrosis.",
    clinicalRole: "Represents degenerative trends requiring restorative constitutional intervention.",
  },
];

const MYTHS_VS_FACTS = [
  {
    myth: "Homeopathy is very slow-acting and only for mild issues.",
    fact: "In acute conditions (high fever, severe pain, colic), correctly prescribed remedies act within minutes to hours. In chronic cases, steady root healing takes time to reverse years of tissue damage.",
  },
  {
    myth: "Homeopathic pills contain hidden steroids or heavy metals.",
    fact: "Genuine homeopathic remedies contain zero synthetic steroids. All remedies undergo strict quality control and HPLC/spectroscopic testing for pure plant and mineral micro-dilutions.",
  },
  {
    myth: "All sweet white pills are the same medicine.",
    fact: "The white lactose or sucrose sugar globules serve purely as inert carriers. They are medicated with distinct potentized liquid remedies carefully chosen for your specific diagnosis.",
  },
  {
    myth: "You cannot take homeopathy alongside conventional drugs or lab tests.",
    fact: "Homeopathic remedies operate on bio-energetic nerve pathways and do not interfere with allopathic medications. You can safely undergo diagnostic scans and tests while under treatment.",
  },
];

const PRACTICAL_GUIDELINES = [
  {
    title: "Clean Mouth Protocol",
    desc: "Ensure your mouth is clean 15 minutes before and after taking medicines. Avoid strong smells (like raw garlic, camphor, or menthol) immediately around dose time.",
    icon: Info,
  },
  {
    title: "Touch-Free Administration",
    desc: "Dispense white pills directly into the bottle cap or spoon before transferring into your mouth. Avoid touching pills directly with warm bare fingers.",
    icon: CheckSquare,
  },
  {
    title: "Cool & Aromatics-Free Storage",
    desc: "Store remedy bottles in a cool, dry place away from direct sunlight, electronic radiation, perfumes, or strong essential oils.",
    icon: SunMedium,
  },
  {
    title: "Supervised Tapering",
    desc: "Never stop essential conventional drugs (such as BP, thyroid, or diabetes medication) abruptly. Tapering is done under medical guidance as health improves.",
    icon: ShieldCheck,
  },
];

const COMPARISON_POINTS = [
  {
    feature: "Primary Goal",
    homeopathy: "Treats root cause & stimulates long-term immune self-healing",
    conventional: "Suppresses acute symptoms and manages chronic conditions",
  },
  {
    feature: "Medication Type",
    homeopathy: "Ultra-diluted, non-toxic micro-doses from natural sources",
    conventional: "Synthetic chemicals, anti-inflammatory drugs & steroids",
  },
  {
    feature: "Side Effects & Risk",
    homeopathy: "100% safe, zero chemical toxicity, no organ overload",
    conventional: "Risk of acidity, kidney/liver burden, or rebound flares",
  },
  {
    feature: "Treatment Approach",
    homeopathy: "Holistic & highly individualized per patient's unique makeup",
    conventional: "Standardized protocols based primarily on diagnostic reports",
  },
  {
    feature: "Relapse Rate",
    homeopathy: "Low likelihood of relapse once constitutional balance is restored",
    conventional: "Higher chance of symptom recurrence upon stopping medication",
  },
];

function TreatmentsPage() {
  const [activeTab, setActiveTab] = useState(TREATMENT_CATEGORIES[0].id);

  const selectedCategory = TREATMENT_CATEGORIES.find((c) => c.id === activeTab) || TREATMENT_CATEGORIES[0];

  return (
    <>
      {/* HERO SECTION */}
      <section className="relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-bottom bg-no-repeat"
          style={{ backgroundImage: `url(${heroBg})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/85 via-background/75 to-background/60" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 md:py-24 text-center">
          <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-leaf-soft/80 shadow-soft text-xs font-semibold text-primary uppercase tracking-wide">
            <Sparkle className="h-3.5 w-3.5 text-primary" /> Specialized Treatments Overview
          </span>
          <h1 className="mt-5 font-display text-4xl md:text-6xl font-bold text-balance text-foreground">
            Specialized Homeopathic Care
          </h1>
          <p className="mt-5 max-w-2xl mx-auto text-lg text-muted-foreground text-pretty">
            From chronic immune disorders to acute everyday illnesses — holistic treatment designed around the unique constitution of every patient.
          </p>
        </div>
      </section>

      {/* QUICK CLINICAL HIGHLIGHTS STATS BAR */}
      <section className="bg-card border-y border-border py-8 shadow-soft">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {STATS.map(({ label, value, icon: Ic }) => (
              <div key={label} className="flex flex-col items-center p-2">
                <div className="h-10 w-10 rounded-full bg-leaf-soft grid place-items-center mb-2">
                  <Ic className="h-5 w-5 text-primary" />
                </div>
                <div className="font-display font-bold text-2xl md:text-3xl text-foreground">{value}</div>
                <div className="text-xs md:text-sm text-muted-foreground mt-0.5">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* OVERVIEW SECTION */}
      <Section>
        <SectionHeader
          eyebrow="Conditions We Treat"
          title="Safe, natural, and side-effect-free healing & fast Healing or Fast recovery"
          center={false}
        />
        <p className="mt-4 text-muted-foreground text-pretty max-w-4xl text-base md:text-lg leading-relaxed">
          We provide specialized homeopathic treatment for acute and chronic health conditions with a focus on safe, natural, and side-effect-free healing. Once your appointment is scheduled, our doctors begin a personalized treatment journey designed specifically for your health concerns. With proper consultation, regular medicines, and guided follow-ups, many patients begin to feel positive improvements within the first few weeks of treatment.
        </p>
      </Section>

      {/* INTERACTIVE TREATMENT DIRECTORY BY CATEGORY */}
      <Section className="bg-leaf-soft/20">
        <SectionHeader
          eyebrow="Specialty Departments"
          title="Explore Treatments by Health Area"
          description="Select a specialty to view common conditions treated and key symptoms addressed."
        />

        {/* Category Navigation Pills */}
        <div className="mt-8 flex flex-wrap justify-center gap-2 md:gap-3">
          {TREATMENT_CATEGORIES.map((cat) => {
            const Ic = cat.icon;
            const isActive = cat.id === activeTab;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveTab(cat.id)}
                className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-xs md:text-sm font-medium transition-all ${
                  isActive
                    ? "bg-primary text-primary-foreground shadow-soft scale-105"
                    : "bg-card text-muted-foreground hover:bg-card/80 border border-border"
                }`}
              >
                <Ic className="h-4 w-4" />
                {cat.name}
              </button>
            );
          })}
        </div>

        {/* Selected Category Conditions Grid */}
        <div className="mt-10">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <h3 className="text-2xl font-bold font-display text-foreground">{selectedCategory.name}</h3>
            <p className="text-sm text-muted-foreground mt-1">{selectedCategory.description}</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-6xl mx-auto">
            {selectedCategory.conditions.map((cond) => (
              <div
                key={cond.name}
                className="bg-card rounded-3xl p-6 md:p-8 shadow-soft border border-border/60 hover:shadow-glow transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-xl text-foreground font-display">{cond.name}</h4>
                    <span className="text-xs px-2.5 py-1 rounded-full bg-leaf-soft text-primary font-semibold">
                      Natural Healing
                    </span>
                  </div>
                  <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{cond.description}</p>

                  {/* Symptom Chips */}
                  <div className="mt-5">
                    <div className="text-xs font-semibold text-foreground uppercase tracking-wider mb-2">
                      Key Symptoms Treated:
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {cond.symptoms.map((symptom) => (
                        <span
                          key={symptom}
                          className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-md bg-muted/70 text-muted-foreground"
                        >
                          <CheckCircle2 className="h-3 w-3 text-primary" />
                          {symptom}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-border flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">Customized Constitutional Remedy</span>
                  <Button asChild variant="ghost" size="sm" className="text-primary hover:text-primary">
                    <Link to="/appointment">
                      Book Consult <ChevronDown className="h-3.5 w-3.5 -rotate-90 ml-1" />
                    </Link>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* CORE HEALING PHILOSOPHY */}
      <Section className="bg-background">
        <SectionHeader
          eyebrow="Our Core Philosophy"
          title="How Classical Homeopathy Restores Health"
          description="Understanding the fundamental principles behind natural, constitutional recovery."
        />
        <div className="mt-12 grid md:grid-cols-2 gap-6 max-w-6xl mx-auto">
          {PHILOSOPHY_PRINCIPLES.map(({ title, desc, icon: Ic }) => (
            <div
              key={title}
              className="bg-card p-6 md:p-8 rounded-3xl border border-border/70 shadow-soft hover:shadow-glow transition-all flex gap-5 items-start"
            >
              <div className="h-12 w-12 rounded-2xl bg-leaf-soft grid place-items-center flex-shrink-0">
                <Ic className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h4 className="font-bold text-lg text-foreground font-display">{title}</h4>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* SCIENCE OF POTENTIZATION & REMEDY PREPARATION */}
      <Section className="bg-leaf-soft/30">
        <SectionHeader
          eyebrow="Scientific Foundation"
          title="Remedy Preparation & Micro-Dose Science"
          description="How potentized natural substances stimulate bio-energetic healing without toxicity."
        />
        <div className="mt-10 grid md:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {SCIENCE_POTENTIZATION.map(({ title, desc, icon: Ic }) => (
            <div key={title} className="bg-card p-6 rounded-3xl border border-border shadow-soft flex flex-col justify-between">
              <div>
                <div className="h-10 w-10 rounded-xl bg-leaf-soft grid place-items-center mb-4">
                  <Ic className="h-5 w-5 text-primary" />
                </div>
                <h4 className="font-bold text-base text-foreground font-display">{title}</h4>
                <p className="mt-2 text-xs md:text-sm text-muted-foreground leading-relaxed">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* MIASMATIC THEORY & ROOT CAUSE CLASSIFICATION */}
      <Section className="bg-background">
        <SectionHeader
          eyebrow="Constitutional Diagnosis"
          title="Miasmatic Layers of Chronic Disease"
          description="Classical homeopathy categorizes disease roots into three primary miasmatic tendencies to ensure total eradication."
        />
        <div className="mt-10 grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {MIASMATIC_THEORY.map(({ miasm, manifestation, clinicalRole }) => (
            <div key={miasm} className="bg-card rounded-3xl p-6 md:p-8 border border-border shadow-soft flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 text-primary font-bold text-sm mb-3">
                  <Layers className="h-4 w-4" /> Miasmatic Classification
                </div>
                <h4 className="font-bold text-xl text-foreground font-display">{miasm}</h4>
                <div className="mt-4 space-y-3 text-xs md:text-sm text-muted-foreground">
                  <div>
                    <strong className="text-foreground block mb-1">Clinical Manifestation:</strong>
                    {manifestation}
                  </div>
                  <div className="pt-2 border-t border-border/50">
                    <strong className="text-primary block mb-1">Therapeutic Target:</strong>
                    {clinicalRole}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* HOMEOPATHY MYTHS VS FACTS */}
      <Section className="bg-leaf-soft/20">
        <SectionHeader
          eyebrow="Clearing Misconceptions"
          title="Homeopathy: Myths vs. Facts"
          description="Understanding evidence-based clinical homeopathic practice."
        />
        <div className="mt-10 grid md:grid-cols-2 gap-6 max-w-6xl mx-auto">
          {MYTHS_VS_FACTS.map(({ myth, fact }) => (
            <div key={myth} className="bg-card rounded-3xl p-6 md:p-8 border border-border shadow-soft space-y-4">
              <div className="flex items-start gap-3 text-rose-600 bg-rose-50/50 p-3 rounded-xl dark:bg-rose-950/20">
                <X className="h-5 w-5 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-xs uppercase tracking-wider block">Myth:</span>
                  <p className="text-xs md:text-sm font-medium text-foreground">{myth}</p>
                </div>
              </div>
              <div className="flex items-start gap-3 text-primary bg-leaf-soft/50 p-3 rounded-xl">
                <Check className="h-5 w-5 flex-shrink-0 mt-0.5 text-primary" />
                <div>
                  <span className="font-bold text-xs uppercase tracking-wider block text-primary">Clinical Fact:</span>
                  <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">{fact}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* HOMEOPATHY VS CONVENTIONAL MEDICINE COMPARISON */}
      <Section className="bg-background">
        <SectionHeader
          eyebrow="Clinical Advantage"
          title="Homeopathy vs. Conventional Treatment"
          description="A clear perspective on how natural constitutional therapy differs from standard symptomatic care."
        />

        <div className="mt-10 max-w-5xl mx-auto overflow-hidden rounded-3xl border border-border bg-card shadow-soft">
          <div className="grid grid-cols-12 bg-muted/60 p-4 md:p-5 text-xs md:text-sm font-bold text-foreground border-b border-border">
            <div className="col-span-4 md:col-span-3">Treatment Feature</div>
            <div className="col-span-4 md:col-span-4 text-primary flex items-center gap-1.5">
              <Check className="h-4 w-4" /> MD's Homeopathy
            </div>
            <div className="col-span-4 md:col-span-5 text-muted-foreground flex items-center gap-1.5">
              <X className="h-4 w-4 text-muted-foreground/70" /> Conventional Medicine
            </div>
          </div>

          <div className="divide-y divide-border/60">
            {COMPARISON_POINTS.map((pt) => (
              <div
                key={pt.feature}
                className="grid grid-cols-12 p-4 md:p-5 text-xs md:text-sm items-center hover:bg-muted/30 transition-colors"
              >
                <div className="col-span-4 md:col-span-3 font-semibold text-foreground">{pt.feature}</div>
                <div className="col-span-4 md:col-span-4 text-primary font-medium pr-2 leading-relaxed">
                  {pt.homeopathy}
                </div>
                <div className="col-span-4 md:col-span-5 text-muted-foreground leading-relaxed">
                  {pt.conventional}
                </div>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* PRACTICAL GUIDELINES FOR HOMEOPATHIC MEDICINE TAKING */}
      <Section className="bg-leaf-soft/30">
        <SectionHeader
          eyebrow="Patient Care Guidelines"
          title="Best Practices for Medication & Storage"
          description="Following simple precautions maximizes the bio-energetic efficacy of your remedies."
        />
        <div className="mt-10 grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {PRACTICAL_GUIDELINES.map(({ title, desc, icon: Ic }) => (
            <div key={title} className="bg-card p-6 rounded-3xl border border-border shadow-soft">
              <div className="h-10 w-10 rounded-xl bg-leaf-soft grid place-items-center mb-4">
                <Ic className="h-5 w-5 text-primary" />
              </div>
              <h4 className="font-bold text-sm md:text-base text-foreground font-display">{title}</h4>
              <p className="mt-2 text-xs md:text-sm text-muted-foreground leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* 5-STEP TREATMENT PROCESS */}
      <Section className="bg-leaf-soft/40">
        <SectionHeader eyebrow="Five-Step Treatment Path" title="Your journey to natural healing" />
        <div className="mt-12 grid md:grid-cols-5 gap-4">
          {[
            {
              i: Stethoscope,
              t: "Listen",
              d: "After your appointment is confirmed, we carefully listen to your symptoms, medical history, lifestyle, and health concerns through a detailed consultation.",
            },
            {
              i: ClipboardList,
              t: "Analyze",
              d: "Our doctors deeply analyze your physical, emotional, and mental health condition to understand the root cause of the problem.",
            },
            {
              i: Microscope,
              t: "Diagnose",
              d: "Based on your consultation and analysis, we prepare a personalized diagnosis and treatment approach focused on long-term healing.",
            },
            {
              i: Pill,
              t: "Prescribe",
              d: "Customized homeopathic medicines and wellness guidance are provided according to your individual condition and body response.",
            },
            {
              i: Heart,
              t: "Follow-up",
              d: "Regular follow-ups help us monitor your recovery and adjust treatment whenever needed for steady, sustainable health improvement.",
            },
          ].map(({ i: Ic, t, d }, idx) => (
            <div key={t} className="bg-card rounded-3xl p-6 shadow-soft text-center relative border border-border/40">
              <div className="mx-auto h-12 w-12 grid place-items-center rounded-2xl bg-leaf-soft">
                <Ic className="h-5 w-5 text-primary" />
              </div>
              <div className="mt-3 text-xs font-bold text-primary">STEP {idx + 1}</div>
              <div className="font-semibold text-lg mt-2">{t}</div>
              <p className="mt-3 text-xs text-muted-foreground leading-relaxed">{d}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* WHY CHOOSE US */}
      <Section>
        <SectionHeader eyebrow="Why Choose MD's Homoeopathy" title="Why Patients Trust Us" />
        <div className="mt-12 grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {[
            { title: "Personalized Care", desc: "Custom remedies tailored to your unique physical & emotional constitution." },
            { title: "100% Safe & Natural", desc: "Gentle medicines with zero harmful side effects or addictive steroids." },
            { title: "Holistic Approach", desc: "Treating the complete person, not just isolated physical symptoms." },
            { title: "Experienced Doctors", desc: "Over two decades of clinical expertise in chronic and acute cases." },
            { title: "Root Cause Focus", desc: "Targeting underlying immune and systemic triggers to prevent relapses." },
            { title: "All Age Groups", desc: "Safe for newborn infants, pregnant women, and senior citizens." },
            { title: "Compassionate Care", desc: "Attentive listening and dedicated time given during every consultation." },
            { title: "Long-Term Wellness", desc: "Ongoing health guidance to build lasting natural immunity." },
          ].map((item) => (
            <div key={item.title} className="bg-card p-5 rounded-2xl border border-border shadow-soft flex gap-3.5 items-start">
              <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-sm text-foreground">{item.title}</h4>
                <p className="text-xs text-muted-foreground mt-1">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* PATIENT CONSULTATION & CARE COMMITMENT */}
      <Section className="bg-leaf-soft/20">
        <SectionHeader
          eyebrow="Patient Guidance"
          title="What to Expect During Your Consultation"
          description="A smooth, patient-first approach designed for comfortable healing."
        />

        <div className="mt-10 grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          <div className="bg-card rounded-3xl p-6 border border-border shadow-soft">
            <div className="h-10 w-10 rounded-xl bg-leaf-soft grid place-items-center mb-4">
              <Clock className="h-5 w-5 text-primary" />
            </div>
            <h4 className="font-bold text-lg text-foreground font-display">In-Depth Initial Case Study</h4>
            <p className="mt-2 text-xs md:text-sm text-muted-foreground leading-relaxed">
              Your first appointment lasts 30 to 45 minutes. Our doctors review your complete medical history, lab reports, emotional stressors, diet, and lifestyle to understand your unique case profile.
            </p>
          </div>

          <div className="bg-card rounded-3xl p-6 border border-border shadow-soft">
            <div className="h-10 w-10 rounded-xl bg-leaf-soft grid place-items-center mb-4">
              <FileText className="h-5 w-5 text-primary" />
            </div>
            <h4 className="font-bold text-lg text-foreground font-display">Custom Remedy & Guidance</h4>
            <p className="mt-2 text-xs md:text-sm text-muted-foreground leading-relaxed">
              We prescribe individualized, original homeopathic formulations along with clear dietary and lifestyle recommendations tailored to enhance treatment effectiveness.
            </p>
          </div>

          <div className="bg-card rounded-3xl p-6 border border-border shadow-soft">
            <div className="h-10 w-10 rounded-xl bg-leaf-soft grid place-items-center mb-4">
              <UserCheck className="h-5 w-5 text-primary" />
            </div>
            <h4 className="font-bold text-lg text-foreground font-display">Dedicated Progress Monitoring</h4>
            <p className="mt-2 text-xs md:text-sm text-muted-foreground leading-relaxed">
              Follow-ups are scheduled every 2 to 4 weeks depending on severity. We evaluate recovery milestones and refine dosages to ensure consistent, sustainable healing.
            </p>
          </div>
        </div>
      </Section>
    </>
  );
}