import { Link } from "@tanstack/react-router";
import { Leaf, Phone, Mail, MapPin, Facebook, Instagram, Youtube } from "lucide-react";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-border bg-gradient-to-b from-background to-leaf-soft/40">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 grid gap-10 md:grid-cols-4">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-leaf">
              <Leaf className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-display text-lg font-bold">Aarogya Homeopathy</span>
          </div>
          <p className="text-sm text-muted-foreground text-pretty">
            Personalized homeopathy treatment for chronic and acute conditions. Trusted by 1000+ patients.
          </p>
          <div className="flex gap-3 mt-5">
            {[Facebook, Instagram, Youtube].map((Icon, i) => (
              <a key={i} href="#" className="grid h-9 w-9 place-items-center rounded-full bg-card shadow-soft hover:bg-primary hover:text-primary-foreground transition-colors">
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-sm font-semibold mb-4 font-sans">Explore</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link to="/about" className="hover:text-primary">About</Link></li>
            <li><Link to="/services" className="hover:text-primary">Services</Link></li>
            <li><Link to="/appointment" className="hover:text-primary">Book Appointment</Link></li>
            <li><Link to="/contact" className="hover:text-primary">Contact</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold mb-4">Treatments</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>Hair Fall</li>
            <li>PCOD & Thyroid</li>
            <li>Skin Issues</li>
            <li>Anxiety & Stress</li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold mb-4">Reach Us</h4>
          <ul className="space-y-3 text-sm text-muted-foreground">
            <li className="flex gap-2"><Phone className="h-4 w-4 text-primary mt-0.5" /> +91 98765 43210</li>
            <li className="flex gap-2"><Mail className="h-4 w-4 text-primary mt-0.5" /> care@aarogya.in</li>
            <li className="flex gap-2"><MapPin className="h-4 w-4 text-primary mt-0.5" /> 12 Wellness Lane, Mumbai</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border py-6 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} Aarogya Homeopathy. All rights reserved.
      </div>
    </footer>
  );
}
