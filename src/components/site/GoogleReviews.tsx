import { Star } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useGoogleReviews } from "@/hooks/useGoogleReviews";

const initials = (name: string) =>
  name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

const GoogleGlyph = () => (
  <svg viewBox="0 0 48 48" className="h-5 w-5" aria-hidden="true">
    <path fill="#4285F4" d="M45.12 24.5c0-1.56-.14-3.06-.4-4.5H24v8.51h11.84c-.51 2.75-2.06 5.08-4.39 6.64v5.52h7.11c4.16-3.83 6.56-9.47 6.56-16.17z" />
    <path fill="#34A853" d="M24 46c5.94 0 10.92-1.97 14.56-5.33l-7.11-5.52c-1.97 1.32-4.49 2.1-7.45 2.1-5.73 0-10.58-3.87-12.31-9.07H4.34v5.7C7.96 41.07 15.4 46 24 46z" />
    <path fill="#FBBC05" d="M11.69 28.18C11.25 26.86 11 25.45 11 24s.25-2.86.69-4.18v-5.7H4.34C2.85 17.09 2 20.45 2 24s.85 6.91 2.34 9.88l7.35-5.7z" />
    <path fill="#EA4335" d="M24 10.75c3.23 0 6.13 1.11 8.41 3.29l6.31-6.31C34.91 4.18 29.93 2 24 2 15.4 2 7.96 6.93 4.34 14.12l7.35 5.7c1.73-5.2 6.58-9.07 12.31-9.07z" />
  </svg>
);

export function GoogleReviews() {
  const { data: apiData, isLoading } = useGoogleReviews();

  const reviews = apiData?.reviews || [];
  const rating = apiData?.rating || (reviews.length > 0 ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length) : 5.0);
  const totalReviews = apiData?.totalReviews || reviews.length;

  return (
    <>
      <div className="mt-6 flex flex-wrap items-center justify-center gap-3 text-sm text-muted-foreground">
        <span className="inline-flex items-center gap-2 rounded-full bg-card px-4 py-2 shadow-soft">
          <GoogleGlyph />
          <span className="font-semibold text-foreground">Google & Patient Reviews</span>
          {totalReviews > 0 && (
            <>
              <span className="inline-flex items-center gap-1 font-semibold text-foreground">
                <Star className="h-4 w-4 fill-warning text-warning" />
                {Number(rating).toFixed(1)}
              </span>
              <span className="text-muted-foreground">({totalReviews})</span>
            </>
          )}
        </span>
      </div>

      {isLoading ? (
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse rounded-3xl bg-card p-6 shadow-card">
              <div className="flex justify-between items-center">
                <div className="h-4 w-24 rounded bg-muted" />
                <div className="h-5 w-5 rounded bg-muted" />
              </div>
              <div className="mt-4 space-y-2">
                <div className="h-3 w-full rounded bg-muted" />
                <div className="h-3 w-5/6 rounded bg-muted" />
                <div className="h-3 w-4/6 rounded bg-muted" />
              </div>
              <div className="mt-5 flex items-center gap-3 border-t border-border/60 pt-4">
                <div className="h-10 w-10 rounded-full bg-muted" />
                <div className="space-y-1">
                  <div className="h-3 w-20 rounded bg-muted" />
                  <div className="h-2.5 w-14 rounded bg-muted" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : reviews.length === 0 ? (
        <div className="mt-10 text-center py-12 rounded-3xl bg-card border border-border/50 max-w-lg mx-auto p-6">
          <p className="text-sm text-muted-foreground">
            Patient reviews and verified Google testimonials will appear here.
          </p>
        </div>
      ) : (
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="flex flex-col rounded-3xl bg-card p-6 shadow-card transition hover:shadow-glow"
            >
              <div className="flex items-center justify-between">
                <div className="flex gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={
                        i < Math.round(review.rating)
                          ? "h-4 w-4 fill-warning text-warning"
                          : "h-4 w-4 text-muted-foreground/30"
                      }
                    />
                  ))}
                </div>
                <GoogleGlyph />
              </div>
              <p className="mt-4 flex-1 text-pretty text-sm text-foreground/90">
                &ldquo;{review.text}&rdquo;
              </p>
              <div className="mt-5 flex items-center gap-3 border-t border-border/60 pt-4">
                <Avatar>
                  <AvatarImage src={review.profileImage} alt={review.reviewerName} />
                  <AvatarFallback>{initials(review.reviewerName || "Patient")}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="text-sm font-semibold">{review.reviewerName}</div>
                  <div className="text-xs text-muted-foreground">{review.relativeTime || "Verified Patient"}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
