export type FaqItem = {
  category: string;
  question: string;
  answer: string;
};

export const faqCategories = [
  "Appointment Booking",
  "Online Consultation",
  "Clinic Timings",
  "Homeopathic Treatments",
  "Product Information",
  "Contact Information",
  "Pricing",
  "General FAQs",
] as const;

export const faqData: FaqItem[] = [
  // Appointment Booking
  {
    category: "Appointment Booking",
    question: "How do I book an appointment?",
    answer:
      "You can book an appointment directly from our website using the “Book Appointment” page, or call us at +91 76686 10031. Choose a convenient slot and we'll confirm it for you.",
  },
  {
    category: "Appointment Booking",
    question: "Can I reschedule my appointment?",
    answer:
      "Yes. Please contact us at least a few hours before your slot and we'll happily reschedule you to the next available time.",
  },
  {
    category: "Appointment Booking",
    question: "Do I need to book in advance?",
    answer:
      "Advance booking is recommended to secure your preferred slot, but walk-ins are also welcome during clinic hours subject to availability.",
  },

  // Online Consultation
  {
    category: "Online Consultation",
    question: "Do you offer online consultations?",
    answer:
      "Yes! We offer secure online (video) consultations across India, along with doorstep delivery of your personalized medicines.",
  },
  {
    category: "Online Consultation",
    question: "How does the online consultation work?",
    answer:
      "After booking, you'll receive a consultation link. The doctor discusses your symptoms in detail, prepares a personalized plan, and your medicines are shipped to your address.",
  },
  {
    category: "Online Consultation",
    question: "Will I get medicines delivered after an online consult?",
    answer:
      "Yes. After your online consultation, personalized remedies are couriered to your doorstep, typically within 2–4 business days.",
  },

  // Clinic Timings
  {
    category: "Clinic Timings",
    question: "What are the clinic timings?",
    answer:
      "The clinic is open Monday to Saturday. Please call +91 76686 10031 to confirm the current day's timing before visiting.",
  },
  {
    category: "Clinic Timings",
    question: "Are you open on Sundays?",
    answer:
      "Sunday availability may be limited. We recommend booking an online consultation or calling ahead to confirm.",
  },

  // Homeopathic Treatments
  {
    category: "Homeopathic Treatments",
    question: "What conditions do you treat?",
    answer:
      "We specialize in Thyroid, Nasal disorders, OBG & Gynaec, Neuro, Osteo and GIT conditions — all treated naturally with a root-cause approach.",
  },
  {
    category: "Homeopathic Treatments",
    question: "Are there any side effects?",
    answer:
      "Homoeopathy is 100% natural and free of side effects when prescribed by a qualified doctor. It is safe for all ages, including children and pregnant women.",
  },
  {
    category: "Homeopathic Treatments",
    question: "How long does treatment take?",
    answer:
      "The duration depends on the pathogenicity, severity and condition of the disease. Every patient responds differently, so treatment duration varies from case to case.",
  },

  // Product Information
  {
    category: "Product Information",
    question: "What products do you offer?",
    answer:
      "Our recommended products include BR Oil (natural relief for pain & stiffness) and Scalp Vital Spray (an overall solution for hair and scalp). Both are natural, safe and effective.",
  },
  {
    category: "Product Information",
    question: "Are the products safe for daily use?",
    answer:
      "Yes. Our products are made with pure, selected homeopathic ingredients and are non-greasy and safe for regular external use as directed.",
  },
  {
    category: "Product Information",
    question: "Where can I buy the products?",
    answer:
      "You can view and order our products from the Shop section of the website. We deliver across India.",
  },

  // Contact Information
  {
    category: "Contact Information",
    question: "How can I contact you?",
    answer:
      "Call us at +91 76686 10031, email mdshomoeopathy13@gmail.com, or use the Contact page on our website. We're happy to help!",
  },
  {
    category: "Contact Information",
    question: "Where is the clinic located?",
    answer:
      "Our clinic is located in Mathura. Visit the “Reach Us” section on our homepage for the full address and a map.",
  },

  // Pricing
  {
    category: "Pricing",
    question: "How much does a consultation cost?",
    answer:
      "Online consultation charges typically range from ₹200–₹500 depending on the type of consultation. Contact us for exact details.",
  },
  {
    category: "Pricing",
    question: "Do you have any offers?",
    answer:
      "We regularly offer value bundles on our products and treatment plans. Check the Shop page or ask us during your consultation.",
  },

  // General FAQs
  {
    category: "General FAQs",
    question: "Is homeopathy effective for chronic conditions?",
    answer:
      "Yes. Homeopathy addresses the root cause rather than just symptoms, making it well-suited for chronic conditions with a personalized plan.",
  },
  {
    category: "General FAQs",
    question: "Is homeopathy safe for children?",
    answer:
      "Absolutely. Homeopathic remedies are gentle and safe for all ages, including infants, children and the elderly.",
  },
];
