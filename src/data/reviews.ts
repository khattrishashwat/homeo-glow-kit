export type StaticReview = {
  id: string;
  reviewerName: string;
  rating: number;
  text: string;
  profileImage: string;
  reviewDate: string;
  relativeTime: string;
};

export const googleReviewsRating = 4.9;
export const googleReviewsTotal = 327;

export const googleReviews: StaticReview[] = [
  {
    id: "r1",
    reviewerName: "Priya Sharma",
    rating: 5,
    text: "After years of struggling with thyroid issues, MD's Homeopathy gave me a treatment plan that actually worked. My reports are normal now and I feel energetic again. Highly recommended!",
    profileImage: "https://i.pravatar.cc/150?img=47",
    reviewDate: "2026-05-28",
    relativeTime: "3 weeks ago",
  },
  {
    id: "r2",
    reviewerName: "Rahul Mehta",
    rating: 5,
    text: "The doctor takes time to understand the root cause instead of just treating symptoms. My chronic sinus and nasal congestion improved dramatically within two months. Truly caring team.",
    profileImage: "https://i.pravatar.cc/150?img=12",
    reviewDate: "2026-05-15",
    relativeTime: "a month ago",
  },
  {
    id: "r3",
    reviewerName: "Anjali Verma",
    rating: 5,
    text: "Online consultation was smooth and the medicines were delivered to my doorstep. My PCOD symptoms are finally under control. Thank you for the personalized care!",
    profileImage: "https://i.pravatar.cc/150?img=32",
    reviewDate: "2026-04-30",
    relativeTime: "2 months ago",
  },
  {
    id: "r4",
    reviewerName: "Suresh Iyer",
    rating: 5,
    text: "My father's joint pain and osteo issues were managed beautifully with natural medicines. No side effects at all. The follow-ups are regular and genuinely helpful.",
    profileImage: "https://i.pravatar.cc/150?img=68",
    reviewDate: "2026-04-18",
    relativeTime: "2 months ago",
  },
  {
    id: "r5",
    reviewerName: "Neha Gupta",
    rating: 4,
    text: "Very professional and compassionate. The treatment for my digestive (GIT) problems has shown steady improvement. Appreciate the detailed diet guidance along with the remedies.",
    profileImage: "https://i.pravatar.cc/150?img=45",
    reviewDate: "2026-04-05",
    relativeTime: "2 months ago",
  },
  {
    id: "r6",
    reviewerName: "Karthik Nair",
    rating: 5,
    text: "Excellent experience from start to finish. My migraine and neuro-related stress reduced significantly. The doctor is knowledgeable and explains everything clearly.",
    profileImage: "https://i.pravatar.cc/150?img=15",
    reviewDate: "2026-03-22",
    relativeTime: "3 months ago",
  },
];
