import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { Loader2, MessageSquare, Star } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { StarRating } from "@/components/site/StarRating";
import {
  productReviewsApi,
  reviewSummary,
  type ProductReview,
} from "@/services/reviews";

const reviewSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, { message: "Please enter your name (min 2 characters)." })
    .max(80, { message: "Name must be under 80 characters." }),
  rating: z
    .number()
    .min(1, { message: "Please select a star rating." })
    .max(5),
  message: z
    .string()
    .trim()
    .min(5, { message: "Please write at least 5 characters." })
    .max(1000, { message: "Review must be under 1000 characters." }),
});

const formatReviewDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

export function ProductReviews({ productSlug }: { productSlug: string }) {
  const queryClient = useQueryClient();
  const [name, setName] = useState("");
  const [rating, setRating] = useState(0);
  const [message, setMessage] = useState("");

  const { data: reviews = [], isLoading } = useQuery({
    queryKey: ["product-reviews", productSlug],
    queryFn: () => productReviewsApi.list(productSlug),
  });

  const { mutate, isPending } = useMutation({
    mutationFn: productReviewsApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["product-reviews", productSlug] });
      toast.success("Thank you! Your review has been submitted.");
      setName("");
      setRating(0);
      setMessage("");
    },
    onError: () => toast.error("Something went wrong. Please try again."),
  });

  const { total, average } = reviewSummary(reviews);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = reviewSchema.safeParse({ name, rating, message });
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "Please check your input.");
      return;
    }
    mutate({ productSlug, ...parsed.data });
  };

  return (
    <section aria-labelledby="reviews-heading" className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
      {/* Reviews list */}
      <div className="rounded-[2rem] border border-border bg-card p-6 md:p-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h2 id="reviews-heading" className="font-display text-2xl font-bold">
            Customer Reviews
          </h2>
          <div className="flex items-center gap-3 rounded-2xl bg-leaf-soft px-4 py-2">
            <span className="text-3xl font-bold text-foreground">{average.toFixed(1)}</span>
            <div>
              <StarRating value={average} size="sm" />
              <div className="text-xs text-muted-foreground">
                {total} {total === 1 ? "review" : "reviews"}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 space-y-4">
          {isLoading ? (
            <div className="flex items-center justify-center gap-2 py-10 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" /> Loading reviews...
            </div>
          ) : reviews.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border py-12 text-center">
              <MessageSquare className="h-8 w-8 text-muted-foreground/50" />
              <p className="mt-3 text-sm font-medium text-foreground">No reviews yet</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Be the first to share your experience.
              </p>
            </div>
          ) : (
            reviews.map((review: ProductReview) => (
              <article
                key={review.id}
                className="rounded-2xl border border-border/70 bg-background p-5 transition hover:shadow-soft"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="grid h-10 w-10 place-items-center rounded-full bg-gradient-leaf text-sm font-bold text-primary-foreground">
                      {review.name.trim().charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-foreground">{review.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {formatReviewDate(review.date)}
                      </div>
                    </div>
                  </div>
                  <StarRating value={review.rating} size="sm" />
                </div>
                <p className="mt-3 text-sm leading-6 text-foreground/90">{review.message}</p>
              </article>
            ))
          )}
        </div>
      </div>

      {/* Submit form */}
      <div className="rounded-[2rem] border border-border bg-card p-6 md:p-8 lg:sticky lg:top-24 lg:self-start">
        <h3 className="font-display text-xl font-bold">Write a Review</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Share your experience to help others.
        </p>
        <form onSubmit={handleSubmit} className="mt-5 space-y-4" noValidate>
          <div className="space-y-1.5">
            <Label htmlFor="review-name">Your Name</Label>
            <Input
              id="review-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Ramesh Gupta"
              maxLength={80}
              required
            />
          </div>
          <div className="space-y-1.5">
            <Label>Your Rating</Label>
            <div className="flex items-center gap-2">
              <StarRating value={rating} onChange={setRating} size="lg" label="Select a rating" />
              {rating > 0 && (
                <span className="text-sm text-muted-foreground">{rating}/5</span>
              )}
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="review-message">Your Review</Label>
            <Textarea
              id="review-message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Tell us about your experience with this product..."
              rows={4}
              maxLength={1000}
              required
            />
          </div>
          <Button type="submit" variant="hero" className="w-full" disabled={isPending}>
            {isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Submitting...
              </>
            ) : (
              <>
                <Star className="h-4 w-4" /> Submit Review
              </>
            )}
          </Button>
        </form>
      </div>
    </section>
  );
}
