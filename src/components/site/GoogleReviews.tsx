import { Star, Loader2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useGoogleReviews } from "@/hooks/useGoogleReviews";

const initials = (name: string) =>
  name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

export function GoogleReviews() {
  const { data, isLoading, error } = useGoogleReviews();
  const reviews = data?.reviews || [];

  if (isLoading) {
    return (
      <div className="mt-12 flex items-center justify-center gap-2 text-muted-foreground">
        <Loader2 className="h-4 w-4 animate-spin" /> Loading Google reviews...
      </div>
    );
  }

  if (error || reviews.length === 0) {
    return (
      <p className="mt-12 text-center text-sm text-muted-foreground">
        Google reviews are currently unavailable. Please check back shortly.
      </p>
    );
  }

  return (
    <>
      <div className="mt-6 flex flex-wrap items-center justify-center gap-3 text-sm text-muted-foreground">
        <span className="inline-flex items-center gap-1 font-semibold text-foreground">
          <Star className="h-4 w-4 fill-warning text-warning" />
          {data?.rating?.toFixed(1) || "5.0"}
        </span>
        <span>{data?.totalReviews || reviews.length} Google reviews</span>
      </div>
      <div className="mt-8 grid md:grid-cols-3 gap-6">
        {reviews.slice(0, 3).map((review) => (
          <div key={review.id} className="bg-card rounded-3xl p-6 shadow-card">
            <div className="flex gap-1 mb-3">
              {Array.from({ length: Math.round(review.rating || 5) }).map((_, i) => (
                <Star key={i} className="h-4 w-4 fill-warning text-warning" />
              ))}
            </div>
            <p className="text-sm text-pretty text-foreground/90">"{review.text}"</p>
            <div className="mt-5 flex items-center gap-3">
              <Avatar>
                <AvatarImage src={review.profileImage} alt={review.reviewerName} />
                <AvatarFallback>{initials(review.reviewerName || "Google User")}</AvatarFallback>
              </Avatar>
              <div>
                <div className="text-sm font-semibold">{review.reviewerName}</div>
                <div className="text-xs text-muted-foreground">
                  {review.relativeTime || (review.reviewDate ? new Date(review.reviewDate).toLocaleDateString() : "Google review")}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
