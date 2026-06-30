import { Outlet, Link, createRootRoute } from "@tanstack/react-router";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { FloatingWhatsapp, StickyMobileBar } from "@/components/site/FloatingActions";
import { Chatbot } from "@/components/site/Chatbot";
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
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
});

function RootComponent() {
  return (
    <>
      <Header />
      <main className="pb-24 md:pb-0">
        <Outlet />
      </main>
      <Footer />
      <FloatingWhatsapp />
      <Chatbot />
      <StickyMobileBar />
      <Toaster position="top-center" richColors />
    </>
  );
}
