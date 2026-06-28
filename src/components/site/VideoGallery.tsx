import { PlayCircle } from "lucide-react";
import { Section } from "@/components/site/Section";

export type GalleryVideo = {
  id: string;
  title: string;
};

const DEFAULT_VIDEOS: GalleryVideo[] = [
  { id: "ZCMEAEMIOCs", title: "Patient Recovery Journey" },
  { id: "mVKH_ngGb50", title: "Healing with Homoeopathy " },
  { id: "pfDppZkGOFs", title: "Real Patient Experience" },
  { id: "W5JIkQnu42E", title: "Natural Treatment Results" },
  { id: "R-gJ4vtEHjA", title: "Doctor's Care & Guidance" },
  { id: "RjTdB-Bs8kE", title: "Wellness Success Story" },
];

type VideoGalleryProps = {
  title?: string;
  subtitle?: string;
  videos?: GalleryVideo[];
  className?: string;
};

export function VideoGallery({
  title = "Patient Video Testimonials",
  subtitle = "Hear real stories of healing and recovery from our patients.",
  videos = DEFAULT_VIDEOS,
  className = "bg-leaf-soft/30",
}: VideoGalleryProps) {
  return (
    <Section className={className}>
      <div className="text-center">
        <span className="inline-block rounded-full bg-card px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-primary shadow-soft">
          Video Gallery
        </span>
        <h2 className="mt-5 font-display text-3xl md:text-4xl font-bold text-balance">
          {title}
        </h2>
        <p className="mt-3 max-w-2xl mx-auto text-muted-foreground text-pretty">
          {subtitle}
        </p>
      </div>

      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {videos.map((video) => (
          <div
            key={video.id}
            className="group overflow-hidden rounded-3xl bg-card shadow-soft transition hover:-translate-y-1 hover:shadow-card"
          >
            <div className="relative aspect-video overflow-hidden">
              <iframe
                src={`https://www.youtube.com/embed/${video.id}`}
                title={video.title}
                className="h-full w-full"
                loading="lazy"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
            <div className="flex items-center gap-2 px-5 py-4">
              <PlayCircle className="h-4 w-4 shrink-0 text-primary" />
              <h3 className="text-sm font-semibold leading-snug">
                {video.title}
              </h3>
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}
