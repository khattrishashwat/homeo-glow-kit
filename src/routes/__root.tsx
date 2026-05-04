import { Outlet, Link, createRootRoute, HeadContent, Scripts } from "@tanstack/react-router";
import appCss from "../styles.css?url";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { FloatingWhatsapp, StickyMobileBar } from "@/components/site/FloatingActions";
import { Toaster } from "@/components/ui/sonner";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-hero px-4">
      <div className="max-w-md text-center">
        <h1 className="font-display text-7xl font-bold text-primary">404</h1>
        <h2 className="mt-4 text-xl font-semibold">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">This page doesn't exist or was moved.</p>
        <Link to="/" className="mt-6 inline-flex h-11 items-center justify-center rounded-full bg-primary px-6 text-sm font-semibold text-primary-foreground shadow-soft hover:shadow-glow">
          Go home
        </Link>
      </div>
    </div>
  );
}

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Aarogya Homeopathy — Natural Treatment for Long-Term Relief" },
      { name: "description", content: "Personalized homeopathy care for hair fall, PCOD, thyroid, skin and anxiety. 20+ years experience, 1000+ patients treated. Book online consultation." },
      { name: "author", content: "Aarogya Homeopathy" },
      { property: "og:title", content: "Aarogya Homeopathy — Natural Treatment for Long-Term Relief" },
      { property: "og:description", content: "Safe, side-effect free, root-cause homeopathy treatment. Book online or visit our clinic." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "stylesheet", href: appCss }],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head><HeadContent /></head>
      <body>{children}<Scripts /></body>
    </html>
  );
}

function RootComponent() {
  return (
    <>
      <Header />
      <main className="pb-24 md:pb-0">
        <Outlet />
      </main>
      <Footer />
      <FloatingWhatsapp />
      <StickyMobileBar />
      <Toaster position="top-center" richColors />
    </>
  );
}
