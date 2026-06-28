import { Link } from "@tanstack/react-router";
import { Menu, X, Phone } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import mdLogoAsset from "@/assets/md-logo-transparent.png.asset.json";

const nav = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About Us" },
  { to: "/services", label: "Services" },
  { to: "/treatments", label: "Treatments" },
  { to: "/shop", label: "Products" },
  { to: "/blog", label: "Blog" },
  { to: "/contact", label: "Contact Us" },
];

export function Header() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-2 group shrink-0">
          <img
            src={mdLogoAsset.url}
            alt="MD's Homoeopathy"
            className="h-10 sm:h-12 w-auto object-contain"
            width={1658}
            height={1402}
          />
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {nav.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              activeOptions={{ exact: n.to === "/" }}
              className="px-4 py-2 rounded-full text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
              activeProps={{ className: "px-4 py-2 rounded-full text-sm font-semibold text-primary bg-leaf-soft" }}
            >
              {n.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-2">
          <Button asChild variant="hero" size="lg" className="rounded-full">
            <Link to="/appointment"><Phone className="h-4 w-4" /> Book Appointment</Link>
          </Button>
        </div>

        <button onClick={() => setOpen(!open)} className="md:hidden p-2 rounded-lg hover:bg-accent">
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t border-border bg-background animate-fade-up">
          <div className="px-4 py-4 space-y-1">
            {nav.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                onClick={() => setOpen(false)}
                className="block px-4 py-3 rounded-xl text-sm font-medium hover:bg-accent"
              >
                {n.label}
              </Link>
            ))}
            <Button asChild variant="hero" className="w-full mt-2" onClick={() => setOpen(false)}>
              <Link to="/appointment">Book Appointment</Link>
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}
