import { MessageCircle, Phone, Calendar } from "lucide-react";
import { Link } from "@tanstack/react-router";

export function FloatingWhatsapp() {
  return (
    <a
      href="https://wa.me/919876543210"
      target="_blank"
      rel="noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-24 right-5 md:bottom-6 z-50 grid h-14 w-14 place-items-center rounded-full bg-whatsapp text-white shadow-glow hover:scale-110 transition-transform animate-float"
    >
      <MessageCircle className="h-6 w-6" />
      <span className="absolute inline-flex h-full w-full rounded-full bg-whatsapp opacity-40 animate-ping" />
    </a>
  );
}

export function StickyMobileBar() {
  return (
    <div className="md:hidden fixed bottom-0 inset-x-0 z-40 grid grid-cols-3 bg-card/95 backdrop-blur-xl border-t border-border shadow-card">
      <a href="tel:+919876543210" className="flex flex-col items-center gap-0.5 py-3 text-xs font-medium text-foreground">
        <Phone className="h-4 w-4 text-primary" /> Call
      </a>
      <a href="https://wa.me/919876543210" className="flex flex-col items-center gap-0.5 py-3 text-xs font-medium text-foreground border-x border-border">
        <MessageCircle className="h-4 w-4 text-whatsapp" /> WhatsApp
      </a>
      <Link to="/appointment" className="flex flex-col items-center gap-0.5 py-3 text-xs font-semibold bg-gradient-leaf text-primary-foreground">
        <Calendar className="h-4 w-4" /> Book
      </Link>
    </div>
  );
}
