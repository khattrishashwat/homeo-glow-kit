import productHair from "@/assets/product-hair.jpg";
import productPcod from "@/assets/product-pcod.jpg";

export type Product = {
  slug: string;
  name: string;
  category: "Hair" | "Women" | "Skin" | "Thyroid";
  shortDescription: string;
  description: string;
  price: number;
  mrp: number;
  image: string;
  featured?: boolean;
  recommended?: boolean;
  durationWeeks: number;
  benefits: string[];
  ingredients: string[];
  usage: string;
  faqs: { q: string; a: string }[];
};

export const products: Product[] = [
  {
    slug: "hair-fall-control-kit",
    name: "Hair Fall Control Kit",
    category: "Hair",
    shortDescription: "Reduce hair fall and strengthen roots naturally.",
    description:
      "A complete homeopathic kit designed to control hair fall, nourish the scalp and strengthen weak hair from the root. Safe for daily use, no side effects.",
    price: 1499,
    mrp: 1999,
    image: productHair,
    featured: true,
    recommended: true,
    durationWeeks: 8,
    benefits: [
      "Reduces hair fall within 4 weeks",
      "Strengthens hair follicles",
      "Improves scalp health",
      "100% natural & safe",
    ],
    ingredients: ["Jaborandi 30", "Wiesbaden 200", "Phosphoric Acid 30", "Bio-combination No. 27"],
    usage: "Take 5 drops in half a cup of water, 3 times daily, 30 minutes before meals.",
    faqs: [
      { q: "How soon will I see results?", a: "Most patients notice reduced hair fall within 3–4 weeks." },
      { q: "Are there any side effects?", a: "No. Homeopathic medicines are completely safe with no side effects." },
    ],
  },
  {
    slug: "pcod-balance-kit",
    name: "PCOD Balance Kit",
    category: "Women",
    shortDescription: "Regulate cycles and balance hormones gently.",
    description:
      "A gentle, hormone-balancing kit for PCOD/PCOS. Helps regulate menstrual cycles, reduces symptoms and improves overall wellness.",
    price: 1799,
    mrp: 2499,
    image: productPcod,
    featured: true,
    recommended: true,
    durationWeeks: 12,
    benefits: [
      "Regulates menstrual cycles",
      "Balances hormones naturally",
      "Reduces acne & weight gain",
      "Improves fertility",
    ],
    ingredients: ["Pulsatilla 200", "Sepia 30", "Thuja 30", "Apis Mellifica 30"],
    usage: "Take prescribed drops 3 times daily as per consultation guidelines.",
    faqs: [
      { q: "Is it safe long term?", a: "Yes, the kit is designed for safe long-term use under doctor supervision." },
      { q: "Do I need a consultation?", a: "We recommend a free consultation for best personalised results." },
    ],
  },
  {
    slug: "skin-care-package",
    name: "Skin Care Package",
    category: "Skin",
    shortDescription: "Clear, glowing skin with homeopathic treatment.",
    description:
      "Targets acne, pigmentation and skin allergies from the root cause. Restores natural glow without harsh chemicals.",
    price: 1599,
    mrp: 2199,
    image: productHair,
    recommended: true,
    durationWeeks: 10,
    benefits: ["Clears acne & pimples", "Reduces pigmentation", "Restores natural glow", "Heals from within"],
    ingredients: ["Sulphur 30", "Berberis Aquifolium Q", "Calendula Q", "Natrum Mur 200"],
    usage: "Apply external drops on affected area + take internal medicine 2 times daily.",
    faqs: [
      { q: "Will acne return after stopping?", a: "Treatment cures from root, recurrence is minimal post-course." },
    ],
  },
  {
    slug: "thyroid-support-package",
    name: "Thyroid Support Package",
    category: "Thyroid",
    shortDescription: "Support thyroid health and energy levels.",
    description:
      "Designed for both hypo and hyperthyroid conditions. Helps balance thyroid hormones and improves energy and metabolism.",
    price: 1899,
    mrp: 2599,
    image: productPcod,
    durationWeeks: 12,
    benefits: ["Balances thyroid levels", "Boosts energy & mood", "Improves metabolism", "Reduces fatigue"],
    ingredients: ["Calcarea Carb 200", "Iodum 30", "Natrum Mur 200", "Thyroidinum 30"],
    usage: "5 drops 3 times daily, 30 minutes before meals.",
    faqs: [
      { q: "Can I take this with allopathic medicines?", a: "Yes, with a 30-minute gap. Consult our doctor first." },
    ],
  },
];

export const categories = ["All", "Hair", "Women", "Skin", "Thyroid"] as const;

export const getProduct = (slug: string) => products.find((p) => p.slug === slug);

export const formatINR = (n: number) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);

export const discountPercent = (mrp: number, price: number) =>
  Math.round(((mrp - price) / mrp) * 100);
