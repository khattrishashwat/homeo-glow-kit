import { Activity, Wind, Flower2, Brain, Bone, Pill, type LucideIcon } from "lucide-react";

export type Condition = {
  slug: string;
  name: string;
  shortDescription: string;
  icon: LucideIcon;
  color: string;
  banner: string;
  detailedDescription: string;
  videoUrl: string;
  treatments: string[];
  benefits: string[];
};

export const conditions: Condition[] = [
  {
    slug: "thyroid",
    name: "Thyroid",
    shortDescription: "Balance hypo & hyperthyroid naturally and restore your energy levels.",
    icon: Activity,
    color: "from-amber-400 to-amber-600",
    banner:
      "https://images.unsplash.com/photo-1559757175-5700dde675bc?auto=format&fit=crop&w=1600&q=80",
    detailedDescription:
      "Thyroid disorders disrupt the body's metabolism, energy and mood. Our homeopathic approach addresses the underlying glandular imbalance rather than only managing hormone numbers. Through detailed case-taking we identify the constitutional remedy that helps your thyroid function return to its natural rhythm — supporting both hypothyroid and hyperthyroid presentations safely, without dependency or side effects.",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    treatments: [
      "Constitutional remedies tailored to your symptom picture",
      "Support for weight, energy, hair and mood balance",
      "Gradual reduction of dependency under medical guidance",
      "Diet and lifestyle counselling alongside medicines",
    ],
    benefits: [
      "Improved energy and metabolism",
      "Balanced mood and better sleep",
      "Reduced hair fall and weight fluctuations",
      "Zero side effects, safe for long-term care",
    ],
  },
  {
    slug: "nasal-disorders",
    name: "Nasal Disorders",
    shortDescription: "Lasting relief from sinusitis, allergic rhinitis and nasal polyps.",
    icon: Wind,
    color: "from-sky-400 to-sky-600",
    banner:
      "https://images.unsplash.com/photo-1584017911766-d451b3d0e843?auto=format&fit=crop&w=1600&q=80",
    detailedDescription:
      "Chronic sinusitis, allergic rhinitis, recurrent colds and nasal polyps respond remarkably well to homeopathy. Instead of suppressing symptoms with decongestants, our remedies strengthen your respiratory immunity and reduce hypersensitivity to allergens, so episodes become milder and far less frequent over time.",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    treatments: [
      "Immunity-building constitutional treatment",
      "Targeted remedies for congestion and post-nasal drip",
      "Allergen sensitivity reduction",
      "Steam and breathing guidance for faster relief",
    ],
    benefits: [
      "Fewer recurrent colds and sinus attacks",
      "Clearer breathing and better sleep",
      "Reduced dependency on antihistamines",
      "Long-term respiratory immunity",
    ],
  },
  {
    slug: "obg-gyn",
    name: "OBG & GYN",
    shortDescription: "Holistic care for PCOD, menstrual & hormonal women's health concerns.",
    icon: Flower2,
    color: "from-rose-400 to-rose-600",
    banner:
      "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=1600&q=80",
    detailedDescription:
      "From PCOD/PCOS and irregular periods to menopausal complaints, women's health needs gentle, individualized care. Our homeopathic treatment works to restore natural hormonal balance, regulate cycles and ease symptoms — supporting fertility and overall wellbeing without hormonal side effects.",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    treatments: [
      "Hormonal balance for PCOD/PCOS",
      "Cycle regulation and pain management",
      "Menopause and fertility support",
      "Nutrition and lifestyle guidance",
    ],
    benefits: [
      "Regular, pain-free menstrual cycles",
      "Natural hormonal balance",
      "Improved fertility and skin health",
      "Safe, non-hormonal treatment",
    ],
  },
  {
    slug: "neuro-disorders",
    name: "Neuro Disorders",
    shortDescription: "Natural management of migraine, anxiety, vertigo and nerve health.",
    icon: Brain,
    color: "from-violet-400 to-violet-600",
    banner:
      "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?auto=format&fit=crop&w=1600&q=80",
    detailedDescription:
      "Migraines, anxiety, vertigo, neuralgia and stress-related conditions are deeply individual. Homeopathy addresses both the physical and emotional dimensions of neurological health, calming the nervous system and reducing the frequency and intensity of episodes — gently and without sedation or dependency.",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    treatments: [
      "Constitutional remedies for nervous system balance",
      "Migraine and headache frequency reduction",
      "Anxiety and stress management without sedation",
      "Support for vertigo and nerve pain",
    ],
    benefits: [
      "Fewer and milder migraine episodes",
      "Calmer mind and better focus",
      "Improved sleep quality",
      "No drowsiness or dependency",
    ],
  },
  {
    slug: "osteo-disorders",
    name: "Osteo Disorders",
    shortDescription: "Relief from arthritis, joint pain, back pain and bone health issues.",
    icon: Bone,
    color: "from-orange-400 to-orange-600",
    banner:
      "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1600&q=80",
    detailedDescription:
      "Arthritis, joint pain, back pain, cervical spondylosis and osteoporosis can limit everyday life. Our homeopathic remedies reduce inflammation, ease stiffness and improve mobility while supporting bone and cartilage health — offering sustained relief without the long-term risks of painkillers.",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    treatments: [
      "Anti-inflammatory constitutional remedies",
      "Mobility and stiffness improvement",
      "Back, neck and joint pain relief",
      "Bone-strengthening lifestyle guidance",
    ],
    benefits: [
      "Reduced pain and inflammation",
      "Improved flexibility and mobility",
      "Less dependency on painkillers",
      "Better long-term joint health",
    ],
  },
  {
    slug: "git-disorders",
    name: "GIT Disorders",
    shortDescription: "Heal acidity, IBS, constipation and chronic digestive problems.",
    icon: Pill,
    color: "from-emerald-400 to-emerald-600",
    banner:
      "https://images.unsplash.com/photo-1505576399279-565b52d4ac71?auto=format&fit=crop&w=1600&q=80",
    detailedDescription:
      "Acidity, IBS, constipation, bloating and chronic gastritis often stem from deeper digestive imbalances. Homeopathy restores healthy gut function by treating the root cause, improving digestion and reducing recurring discomfort — paired with practical diet guidance for lasting results.",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    treatments: [
      "Root-cause treatment for acidity and IBS",
      "Gut motility and digestion support",
      "Relief from bloating and gastritis",
      "Personalized diet and gut-health plan",
    ],
    benefits: [
      "Comfortable, regular digestion",
      "Reduced acidity and bloating",
      "Better nutrient absorption and energy",
      "Sustainable, side-effect-free relief",
    ],
  },
];

export const getConditionBySlug = (slug: string) =>
  conditions.find((c) => c.slug === slug);
