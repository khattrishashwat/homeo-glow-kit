import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { Loader2, MessagesSquare, Send } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { blogCommentsApi, type BlogComment } from "@/services/comments";

const commentSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, { message: "Please enter your name (min 2 characters)." })
    .max(80, { message: "Name must be under 80 characters." }),
  email: z
    .string()
    .trim()
    .max(255)
    .email({ message: "Please enter a valid email address." })
    .optional()
    .or(z.literal("")),
  comment: z
    .string()
    .trim()
    .min(3, { message: "Please write at least 3 characters." })
    .max(1000, { message: "Comment must be under 1000 characters." }),
});

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

export function BlogComments({ blogSlug }: { blogSlug: string }) {
  const queryClient = useQueryClient();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [comment, setComment] = useState("");

  const { data: comments = [], isLoading } = useQuery({
    queryKey: ["blog-comments", blogSlug],
    queryFn: () => blogCommentsApi.list(blogSlug),
  });

  const { mutate, isPending } = useMutation({
    mutationFn: blogCommentsApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blog-comments", blogSlug] });
      toast.success("Thank you! Your comment has been posted.");
      setName("");
      setEmail("");
      setComment("");
    },
    onError: () => toast.error("Something went wrong. Please try again."),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = commentSchema.safeParse({ name, email, comment });
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "Please check your input.");
      return;
    }
    mutate({
      blogSlug,
      name: parsed.data.name,
      email: parsed.data.email || undefined,
      comment: parsed.data.comment,
    });
  };

  return (
    <section aria-labelledby="comments-heading" className="rounded-[2rem] border border-border bg-card p-6 md:p-8">
      <div className="flex items-center gap-2">
        <MessagesSquare className="h-5 w-5 text-primary" />
        <h2 id="comments-heading" className="font-display text-2xl font-bold">
          Comments
          <span className="ml-2 text-base font-medium text-muted-foreground">
            ({comments.length})
          </span>
        </h2>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="mt-6 space-y-4" noValidate>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="comment-name">Name</Label>
            <Input
              id="comment-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              maxLength={80}
              required
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="comment-email">
              Email <span className="text-muted-foreground">(optional)</span>
            </Label>
            <Input
              id="comment-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              maxLength={255}
            />
          </div>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="comment-body">Comment</Label>
          <Textarea
            id="comment-body"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Share your thoughts..."
            rows={4}
            maxLength={1000}
            required
          />
        </div>
        <Button type="submit" variant="hero" disabled={isPending}>
          {isPending ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" /> Posting...
            </>
          ) : (
            <>
              <Send className="h-4 w-4" /> Post Comment
            </>
          )}
        </Button>
      </form>

      {/* List */}
      <div className="mt-8 space-y-4">
        {isLoading ? (
          <div className="flex items-center justify-center gap-2 py-8 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" /> Loading comments...
          </div>
        ) : comments.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border py-10 text-center">
            <MessagesSquare className="h-8 w-8 text-muted-foreground/50" />
            <p className="mt-3 text-sm font-medium text-foreground">No comments yet</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Be the first to start the conversation.
            </p>
          </div>
        ) : (
          comments.map((c: BlogComment) => (
            <article key={c.id} className="rounded-2xl border border-border/70 bg-background p-5">
              <div className="flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-full bg-gradient-leaf text-sm font-bold text-primary-foreground">
                  {c.name.trim().charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="text-sm font-semibold text-foreground">{c.name}</div>
                  <div className="text-xs text-muted-foreground">{formatDate(c.date)}</div>
                </div>
              </div>
              <p className="mt-3 text-sm leading-6 text-foreground/90">{c.comment}</p>
            </article>
          ))
        )}
      </div>
    </section>
  );
}
