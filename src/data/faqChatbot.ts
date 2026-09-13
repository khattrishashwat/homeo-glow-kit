/**
 * Dynamic FAQ types and categories
 * 
 * Note: FAQ and Chatbot questions and answers are dynamically managed 
 * from the Admin Panel and fetched from the backend API.
 * No content data is hardcoded here.
 */

export type FaqItem = {
  _id?: string;
  category: string;
  question: string;
  answer: string;
  order?: number;
  active?: boolean;
};

export const defaultFaqCategories = [
  "Appointment Booking",
  "Online Consultation",
  "Clinic Timings",
  "Homeopathic Treatments",
  "Product Information",
  "Contact Information",
  "Pricing",
  "General FAQs",
] as const;

export const faqData: FaqItem[] = [];
