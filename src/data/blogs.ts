export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  featuredImage: string;
  category: string;
  author: string;
  publishDate: string;
  readingTime: number;
  videoUrl?: string;
  tags: string[];
};

export const blogCategories = [
  "All",
  "Wellness",
  "Women's Health",
  "Nutrition",
  "Lifestyle",
  "Treatments",
];

export const blogPosts: BlogPost[] = [
  {
    slug: "homeopathy-for-thyroid-natural-balance",
    title: "Homeopathy for Thyroid: A Natural Path to Hormonal Balance",
    excerpt:
      "Discover how constitutional homeopathic treatment helps restore thyroid function naturally, without dependency or side effects.",
    featuredImage:
      "https://images.unsplash.com/photo-1559757175-5700dde675bc?auto=format&fit=crop&w=1200&q=80",
    category: "Treatments",
    author: "Dr. M. Desai",
    publishDate: "2026-06-10",
    readingTime: 6,
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    tags: ["Thyroid", "Hormones", "Homeopathy"],
    content: `
      <p>Thyroid disorders affect millions of people, often causing fatigue, weight changes, mood swings and hair fall. While conventional medicine focuses on regulating hormone levels, homeopathy takes a deeper, root-cause approach.</p>
      <h2>Understanding the Thyroid</h2>
      <p>The thyroid gland controls metabolism, energy and temperature regulation. When it becomes underactive (hypothyroid) or overactive (hyperthyroid), the whole body feels the impact.</p>
      <h2>The Homeopathic Approach</h2>
      <p>Instead of simply replacing hormones, homeopathy aims to stimulate the body's own regulatory mechanisms. A detailed case history helps identify the constitutional remedy that matches your unique symptom picture.</p>
      <ul>
        <li>Personalized remedies based on your full health profile</li>
        <li>Support for energy, weight and emotional balance</li>
        <li>Gradual, supervised reduction of dependency</li>
      </ul>
      <h2>What to Expect</h2>
      <p>Most patients notice steady improvement over a few months. Combined with mindful nutrition and lifestyle changes, homeopathy offers a gentle, sustainable path back to balance.</p>
    `,
  },
  {
    slug: "managing-pcod-naturally",
    title: "Managing PCOD Naturally: Lifestyle and Homeopathic Support",
    excerpt:
      "PCOD is more than a hormonal issue. Learn how a holistic plan combining homeopathy and lifestyle can regulate cycles and improve wellbeing.",
    featuredImage:
      "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1200&q=80",
    category: "Women's Health",
    author: "Dr. M. Desai",
    publishDate: "2026-06-02",
    readingTime: 7,
    tags: ["PCOD", "Women's Health", "Hormones"],
    content: `
      <p>Polycystic Ovarian Disease (PCOD) is one of the most common hormonal conditions among women today. It can lead to irregular periods, weight gain, acne and fertility challenges.</p>
      <h2>Why a Holistic Approach Matters</h2>
      <p>PCOD is rarely caused by a single factor. Stress, diet, insulin resistance and genetics all play a role, which is why a holistic plan works best.</p>
      <h2>Homeopathy's Role</h2>
      <p>Homeopathic remedies aim to restore natural hormonal balance and regulate menstrual cycles without introducing external hormones.</p>
      <ul>
        <li>Cycle regulation and reduced cramping</li>
        <li>Support for skin and weight management</li>
        <li>Improved fertility outcomes over time</li>
      </ul>
      <p>Pairing treatment with balanced nutrition, movement and good sleep amplifies results significantly.</p>
    `,
  },
  {
    slug: "natural-relief-for-sinus-and-allergies",
    title: "Natural Relief for Sinus and Allergies That Actually Lasts",
    excerpt:
      "Tired of seasonal congestion? Explore how homeopathy strengthens immunity to reduce recurring sinus and allergy flare-ups.",
    featuredImage:
      "https://images.unsplash.com/photo-1584017911766-d451b3d0e843?auto=format&fit=crop&w=1200&q=80",
    category: "Wellness",
    author: "Dr. M. Desai",
    publishDate: "2026-05-24",
    readingTime: 5,
    tags: ["Sinus", "Allergies", "Immunity"],
    content: `
      <p>Recurring sinusitis and allergic rhinitis can be exhausting. Decongestants offer temporary relief but rarely address why your body keeps reacting.</p>
      <h2>Building Resilience</h2>
      <p>Homeopathy focuses on reducing your hypersensitivity to allergens and strengthening respiratory immunity, so flare-ups become milder and less frequent.</p>
      <ul>
        <li>Constitutional immunity-building treatment</li>
        <li>Targeted remedies for congestion and drip</li>
        <li>Simple steam and breathing routines</li>
      </ul>
      <p>Over time, many patients find they rely far less on antihistamines and enjoy clearer, easier breathing.</p>
    `,
  },
  {
    slug: "everyday-foods-for-gut-health",
    title: "Everyday Foods That Quietly Heal Your Gut",
    excerpt:
      "Your digestion shapes your overall health. Here are simple, doctor-recommended foods to soothe acidity, bloating and IBS.",
    featuredImage:
      "https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=1200&q=80",
    category: "Nutrition",
    author: "Dr. M. Desai",
    publishDate: "2026-05-12",
    readingTime: 6,
    tags: ["Gut Health", "Nutrition", "Digestion"],
    content: `
      <p>A healthy gut is the foundation of overall wellbeing. Chronic acidity, bloating and IBS often improve dramatically with the right dietary habits.</p>
      <h2>Gut-Friendly Staples</h2>
      <ul>
        <li>Fermented foods like yogurt for healthy gut flora</li>
        <li>Fiber-rich vegetables and whole grains</li>
        <li>Soaked nuts and seeds for gentle nourishment</li>
        <li>Warm water and herbal teas to aid digestion</li>
      </ul>
      <h2>Pairing Diet with Treatment</h2>
      <p>When combined with root-cause homeopathic care, these everyday foods help restore comfortable, regular digestion that lasts.</p>
    `,
  },
  {
    slug: "stress-anxiety-and-the-mind-body-link",
    title: "Stress, Anxiety and the Mind-Body Connection",
    excerpt:
      "Mental wellness affects every system in your body. Learn how gentle homeopathic care supports calm without sedation.",
    featuredImage:
      "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=1200&q=80",
    category: "Lifestyle",
    author: "Dr. M. Desai",
    publishDate: "2026-04-29",
    readingTime: 5,
    tags: ["Anxiety", "Stress", "Mental Wellness"],
    content: `
      <p>Stress and anxiety don't just affect the mind — they influence sleep, digestion, immunity and even hormonal balance.</p>
      <h2>A Gentle Approach</h2>
      <p>Homeopathy addresses both the emotional and physical aspects of stress, helping calm the nervous system without drowsiness or dependency.</p>
      <ul>
        <li>Remedies matched to your emotional profile</li>
        <li>Better sleep and steadier focus</li>
        <li>Support during life transitions and burnout</li>
      </ul>
      <p>Small daily habits — breathing, movement and rest — work beautifully alongside treatment.</p>
    `,
  },
  {
    slug: "joint-pain-staying-mobile-as-you-age",
    title: "Joint Pain: Staying Mobile and Active as You Age",
    excerpt:
      "Arthritis and joint stiffness don't have to slow you down. Discover natural ways to reduce inflammation and stay mobile.",
    featuredImage:
      "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1200&q=80",
    category: "Wellness",
    author: "Dr. M. Desai",
    publishDate: "2026-04-15",
    readingTime: 6,
    tags: ["Joint Pain", "Arthritis", "Mobility"],
    content: `
      <p>Joint pain and arthritis can make everyday tasks difficult, but long-term painkiller use carries its own risks.</p>
      <h2>Natural Inflammation Control</h2>
      <p>Homeopathy works to reduce inflammation and stiffness while supporting cartilage and bone health, helping you stay mobile naturally.</p>
      <ul>
        <li>Constitutional remedies for chronic pain</li>
        <li>Improved flexibility and reduced stiffness</li>
        <li>Gentle exercise and posture guidance</li>
      </ul>
      <p>With consistent care, many patients enjoy meaningful, lasting relief.</p>
    `,
  },
];

export const getBlogBySlug = (slug: string) =>
  blogPosts.find((b) => b.slug === slug);

export const getRelatedBlogs = (slug: string, limit = 3) =>
  blogPosts.filter((b) => b.slug !== slug).slice(0, limit);

export const formatBlogDate = (date: string) =>
  new Date(date).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
