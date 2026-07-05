import { useState, useRef, useEffect } from "react";
import { Bot, X, Send, Calendar, MessageCircle, Phone } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { whatsappLink } from "@/components/site/FloatingActions";

type ChatMessage = { from: "bot" | "user"; text: string };

const QUICK_REPLIES: { label: string; answer: string }[] = [
  {
    label: "How long does treatment take?",
    answer:
      "The duration of treatment completely depends upon the pathogenicity, severity, and condition of the disease. Every patient responds differently, therefore treatment duration may vary from case to case.",
  },
  {
    label: "What conditions do you treat?",
    answer:
      "We specialize in Thyroid, Nasal Disorders, OBG & GYN, Neuro, Osteo and GIT disorders — all treated naturally with zero side effects.",
  },
  {
    label: "Do you offer online consultation?",
    answer:
      "Yes! We offer secure online (video) consultations across India along with doorstep medicine delivery. Charges range from ₹200–₹500.",
  },
  {
    label: "Are there any side effects?",
    answer:
      "Homoeopathy is 100% natural and free of side effects when prescribed by a qualified doctor. It is safe for all ages, including children and pregnant women.",
  },
];

export function Chatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      from: "bot",
      text: "Hi! 👋 Welcome to MD's Homoeopathy. How can I help you today? Pick a question below or chat with us on WhatsApp.",
    },
  ]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open && scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, open]);

  const handleQuick = (q: { label: string; answer: string }) => {
    setMessages((m) => [...m, { from: "user", text: q.label }, { from: "bot", text: q.answer }]);
  };

  return (
    <>
      {/* Toggle button — sits above the WhatsApp button */}
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? "Close chat assistant" : "Open chat assistant"}
        className="fixed bottom-40 right-5 md:bottom-24 z-50 grid h-14 w-14 place-items-center rounded-full bg-gradient-leaf text-primary-foreground shadow-glow hover:scale-110 transition-transform"
      >
        {open ? <X className="h-6 w-6" /> : <Bot className="h-6 w-6" />}
      </button>

      {/* Chat panel */}
      {open && (
        <div className="fixed bottom-56 right-5 md:bottom-40 z-50 w-[calc(100vw-2.5rem)] max-w-sm overflow-hidden rounded-3xl border border-border bg-card shadow-glow animate-fade-up">
          {/* Header */}
          <div className="flex items-center gap-3 bg-gradient-leaf px-4 py-3 text-primary-foreground">
            <div className="grid h-9 w-9 place-items-center rounded-full bg-white/20">
              <Bot className="h-5 w-5" />
            </div>
            <div>
              <div className="text-sm font-bold leading-tight">MD's Assistant</div>
              <div className="text-[11px] opacity-90">Typically replies instantly</div>
            </div>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="max-h-72 space-y-3 overflow-y-auto px-4 py-4">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.from === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[85%] rounded-2xl px-3.5 py-2 text-sm ${
                    m.from === "user"
                      ? "bg-primary text-primary-foreground rounded-br-sm"
                      : "bg-muted text-foreground rounded-bl-sm"
                  }`}
                >
                  {m.text}
                </div>
              </div>
            ))}
          </div>

          {/* Quick replies */}
          <div className="space-y-2 border-t border-border px-4 py-3">
            <div className="flex flex-wrap gap-2">
              {QUICK_REPLIES.map((q) => (
                <button
                  key={q.label}
                  onClick={() => handleQuick(q)}
                  className="rounded-full border border-primary/30 bg-leaf-soft/60 px-3 py-1.5 text-[11px] font-semibold text-primary transition hover:bg-leaf-soft"
                >
                  {q.label}
                </button>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-2 pt-1">
              <Button asChild size="sm" variant="hero" className="rounded-full">
                <Link to="/appointment" onClick={() => setOpen(false)}>
                  <Calendar className="h-4 w-4" /> Book
                </Link>
              </Button>
              <Button asChild size="sm" variant="outline" className="rounded-full text-whatsapp">
                <a href={whatsappLink("Hi, I have a question about Homoeopathy treatment.")} target="_blank" rel="noreferrer">
                  <MessageCircle className="h-4 w-4" /> WhatsApp
                </a>
              </Button>
            </div>
            <a
              href="tel:+917668610031"
              className="flex items-center justify-center gap-1.5 pt-1 text-xs font-medium text-muted-foreground hover:text-primary"
            >
              <Phone className="h-3.5 w-3.5" /> Or call us: +91 76686 10031
            </a>
          </div>
        </div>
      )}
    </>
  );
}
