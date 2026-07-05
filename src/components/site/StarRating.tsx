import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

type StarRatingProps = {
  value: number;
  /** When provided, the rating becomes interactive. */
  onChange?: (value: number) => void;
  size?: "sm" | "md" | "lg";
  className?: string;
  label?: string;
};

const sizeMap = { sm: "h-4 w-4", md: "h-5 w-5", lg: "h-7 w-7" } as const;

export function StarRating({ value, onChange, size = "md", className, label }: StarRatingProps) {
  const interactive = typeof onChange === "function";
  const stars = [1, 2, 3, 4, 5];

  return (
    <div
      className={cn("inline-flex items-center gap-1", className)}
      role={interactive ? "radiogroup" : "img"}
      aria-label={label ?? `Rated ${value} out of 5`}
    >
      {stars.map((star) => {
        const filled = star <= Math.round(value);
        const StarEl = (
          <Star
            className={cn(
              sizeMap[size],
              "transition-colors",
              filled ? "fill-warning text-warning" : "text-muted-foreground/40",
            )}
          />
        );
        if (!interactive) return <span key={star}>{StarEl}</span>;
        return (
          <button
            key={star}
            type="button"
            role="radio"
            aria-checked={star === Math.round(value)}
            aria-label={`${star} star${star > 1 ? "s" : ""}`}
            onClick={() => onChange!(star)}
            className="rounded-full p-0.5 transition-transform hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            {StarEl}
          </button>
        );
      })}
    </div>
  );
}
