import type { Product } from "@/services/api";
import brBottle from "@/assets/products/br-oil-bottle.jpg";
import brPoster from "@/assets/products/br-oil-poster.jpg";
import scalpBottle from "@/assets/products/scalp-vital-spray-bottle.jpg";
import scalpPoster from "@/assets/products/scalp-vital-spray-poster.jpg";

/**
 * Convert a bundled asset path into an absolute URL so it survives
 * `assetUrl()` (which prefixes non-http paths with the API host).
 */
const abs = (url: string) =>
  typeof window !== "undefined" ? new URL(url, window.location.origin).href : url;

export type FeaturedProduct = Product & {
  /** Promotional poster used for the "Featured Product Highlights" banner. */
  poster: string;
  /** Product bottle image used across cards and detail gallery. */
  bottle: string;
};

export const featuredProducts: FeaturedProduct[] = [
  {
    _id: "static-br-oil",
    slug: "br-oil",
    name: "BR Oil",
    poster: abs(brPoster),
    bottle: abs(brBottle),
    image: abs(brBottle),
    image_alt: "MD's Homoeopathy BR Oil — 30 ml arthritic oil bottle",
    gallery: [
      { url: abs(brBottle), alt: "MD's Homoeopathy BR Oil bottle" },
      { url: abs(brPoster), alt: "MD's Homoeopathy BR Oil benefits poster" },
    ],
    short_description: "Natural relief for pain, stiffness & better mobility.",
    description:
      "<p><strong>BR Oil</strong> is a therapeutic homeopathic arthritic oil crafted for natural relief from pain, stiffness and reduced mobility. Made with pure and selected homeopathic ingredients, it is gentle, non-greasy and safe for daily external use.</p><h3>How to use</h3><ul><li>Take a sufficient quantity of oil.</li><li>Gently massage the affected area in a downward-to-upward direction.</li><li>Apply once or twice daily, preferably after a warm bath or before bedtime.</li><li>Do not apply on open wounds or broken skin.</li></ul>",
    price: 399,
    compare_price: 499,
    category: "Pain & Mobility",
    in_stock: true,
    stock: 25,
    sku: "MD-BR-OIL-30",
    featured: true,
    average_rating: 4.8,
    total_reviews: 96,
    attributes: {
      shortDescription: "Natural relief for pain, stiffness & better mobility.",
      recommended: true,
      durationWeeks: 4,
      benefits: [
        "Helps reduce pain, stiffness & discomfort",
        "Supports mobility & flexibility",
        "Made with pure & selected homeopathic ingredients",
        "Gentle, natural & non-greasy",
      ],
      ingredients: [
        "Natural homeopathic oil base",
        "Selected arthritic-relief homeopathic actives",
      ],
      usage:
        "For external use only. Massage a sufficient quantity on the affected area, once or twice daily.",
      faqs: [
        {
          q: "Is BR Oil safe for daily use?",
          a: "Yes. BR Oil is natural, non-greasy and safe for regular external use. Avoid open wounds or broken skin.",
        },
      ],
    },
  },
  {
    _id: "static-scalp-vital-spray",
    slug: "scalp-vital-spray",
    name: "Scalp Vital Spray",
    poster: abs(scalpPoster),
    bottle: abs(scalpBottle),
    image: abs(scalpBottle),
    image_alt: "MD's Homoeopathy Scalp Vital Spray — 50 ml bottle",
    gallery: [
      { url: abs(scalpBottle), alt: "MD's Homoeopathy Scalp Vital Spray bottle" },
      { url: abs(scalpPoster), alt: "MD's Homoeopathy Scalp Vital Spray benefits poster" },
    ],
    short_description: "Overall solution for hair and scalp — healthy scalp, stronger hair, naturally.",
    description:
      "<p><strong>Scalp Vital Spray</strong> is a homeopathic formulation that works at the root to restore balance, relieve irritation and promote lasting scalp health. Nourish, strengthen and protect — for a healthy scalp and stronger hair, naturally.</p><h3>Why your scalp needs it</h3><ul><li>Removes dryness and locks in moisture.</li><li>Controls dandruff, flakes and itchiness.</li><li>Supports against fungal imbalance.</li><li>Soothes scalp psoriasis symptoms.</li></ul>",
    price: 499,
    compare_price: 649,
    category: "Hair & Scalp",
    in_stock: true,
    stock: 30,
    sku: "MD-SVS-50",
    featured: true,
    average_rating: 4.9,
    total_reviews: 142,
    attributes: {
      shortDescription:
        "Overall solution for hair and scalp — healthy scalp, stronger hair, naturally.",
      recommended: true,
      durationWeeks: 6,
      benefits: [
        "Removes dryness & prevents flakiness",
        "Controls dandruff, itchiness & irritation",
        "Supports against fungal imbalance",
        "Soothes scalp psoriasis symptoms",
      ],
      ingredients: [
        "Homeopathic scalp-nourishing base",
        "Natural anti-dandruff homeopathic actives",
      ],
      usage:
        "For external use only. Spray on the scalp and gently massage; use as directed for a healthy scalp.",
      faqs: [
        {
          q: "Is it suitable for men and women?",
          a: "Yes. Scalp Vital Spray is non-greasy, lightweight and suitable for both men and women.",
        },
      ],
    },
  },
];

export const getFeaturedProduct = (slug?: string) =>
  featuredProducts.find((p) => p.slug === slug);
