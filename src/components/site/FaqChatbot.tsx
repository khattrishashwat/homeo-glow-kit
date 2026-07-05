import { useState, useRef, useEffect, useMemo } from "react";
import { MessageCircle, X, Send, Search, ChevronLeft, Bot } from "lucide-react";
import { faqData, faqCategories, type FaqItem } from "@/data/faqChatbot";

type ChatMessage = {
  id: string;
  from: "bot" | "user";
  text: string;
};

const uid = () => `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

const WELCOME =
  "Hi! 👋 Welcome to MD's Homoeopathy. I'm here to help. Pick a category below or search a question.";

export function FaqChatbot() {
  const [open, setOpen] = useState(false);
  const [typing, setTyping] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: uid(), from: "bot", text: WELCOME },
  ]);

  const scrollRef = useRef<HTMLDivElement>(null);
  const typingTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    if (open && scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, typing, open]);

  useEffect(() => () => clearTimeout(typingTimer.current), []);

  const searchResults = useMemo<FaqItem[]>(() => {
    const q = search.trim().toLowerCase();
    if (!q) return [];
    return faqData
      .filter(
        (f) =>
          f.question.toLowerCase().includes(q) ||
          f.answer.toLowerCase().includes(q) ||
          f.category.toLowerCase().includes(q),
      )
      .slice(0, 6);
  }, [search]);

  const categoryQuestions = useMemo<FaqItem[]>(
    () => (activeCategory ? faqData.filter((f) => f.category === activeCategory) : []),
    [activeCategory],
  );

  const suggested = useMemo(() => faqData.slice(0, 3), []);

  const askQuestion = (item: FaqItem) => {
    setSearch("");
    setMessages((m) => [...m, { id: uid(), from: "user", text: item.question }]);
    setTyping(true);
    clearTimeout(typingTimer.current);
    typingTimer.current = setTimeout(() => {
      setTyping(false);
      setMessages((m) => [...m, { id: uid(), from: "bot", text: item.answer }]);
    }, 700);
  };

  return (
    <>
      {/* Floating toggle button — bottom-right, above the sticky mobile bar */}
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? "Close chat assistant" : "Open chat assistant"}
        aria-expanded={open}
        className="fixed bottom-24 right-5 z-50 grid h-14 w-14 place-items-center rounded-full bg-gradient-leaf text-primary-foreground shadow-glow transition-transform hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 md:bottom-6"
      >
        {open ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
      </button>

      {/* Chat window */}
      {open && (
        <div className="fixed bottom-40 right-5 z-50 flex w-[calc(100vw-2.5rem)] max-w-sm origin-bottom-right flex-col overflow-hidden rounded-3xl border border-border bg-card shadow-glow animate-fade-up md:bottom-24">
          {/* Header */}
          <div className="flex items-center gap-3 bg-gradient-leaf px-4 py-3 text-primary-foreground">
            {activeCategory && (
              <button
                onClick={() => setActiveCategory(null)}
                aria-label="Back to categories"
                className="grid h-8 w-8 place-items-center rounded-full bg-white/20 transition hover:bg-white/30"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
            )}
            <div className="grid h-9 w-9 place-items-center rounded-full bg-white/20">
              <Bot className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <div className="text-sm font-bold leading-tight">MD's Assistant</div>
              <div className="text-[11px] opacity-90">Ask me anything about MD's Homoeopathy</div>
            </div>
            <button
              onClick={() => setOpen(false)}
              aria-label="Close chat"
              className="grid h-8 w-8 place-items-center rounded-full bg-white/20 transition hover:bg-white/30"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="max-h-72 min-h-[9rem] space-y-3 overflow-y-auto px-4 py-4">
            {messages.map((m) => (
              <div key={m.id} className={`flex ${m.from === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[85%] rounded-2xl px-3.5 py-2 text-sm ${
                    m.from === "user"
                      ? "rounded-br-sm bg-primary text-primary-foreground"
                      : "rounded-bl-sm bg-muted text-foreground"
                  }`}
                >
                  {m.text}
                </div>
              </div>
            ))}

            {typing && (
              <div className="flex justify-start" aria-label="Assistant is typing">
                <div className="flex items-center gap-1 rounded-2xl rounded-bl-sm bg-muted px-4 py-3">
                  <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground/60 [animation-delay:-0.3s]" />
                  <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground/60 [animation-delay:-0.15s]" />
                  <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground/60" />
                </div>
              </div>
            )}
          </div>

          {/* Interaction area */}
          <div className="space-y-3 border-t border-border px-4 py-3">
            {/* Search */}
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search FAQs..."
                aria-label="Search frequently asked questions"
                className="w-full rounded-full border border-border bg-background py-2 pl-9 pr-3 text-sm outline-none transition focus:border-primary focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>

            <div className="max-h-40 space-y-2 overflow-y-auto">
              {search.trim() ? (
                /* Search results */
                searchResults.length ? (
                  searchResults.map((item, i) => (
                    <QuickReply key={`${item.question}-${i}`} onClick={() => askQuestion(item)}>
                      {item.question}
                    </QuickReply>
                  ))
                ) : (
                  <p className="px-1 py-2 text-center text-xs text-muted-foreground">
                    No results found. Try a different keyword.
                  </p>
                )
              ) : activeCategory ? (
                /* Questions in a category */
                categoryQuestions.map((item, i) => (
                  <QuickReply key={`${item.question}-${i}`} onClick={() => askQuestion(item)}>
                    {item.question}
                  </QuickReply>
                ))
              ) : (
                /* Categories + suggested questions */
                <div className="space-y-3">
                  <div>
                    <div className="mb-1.5 px-1 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                      Categories
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {faqCategories.map((cat) => (
                        <button
                          key={cat}
                          onClick={() => setActiveCategory(cat)}
                          className="rounded-full border border-primary/30 bg-leaf-soft/60 px-3 py-1.5 text-[11px] font-semibold text-primary transition hover:bg-leaf-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <div className="mb-1.5 px-1 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                      Suggested
                    </div>
                    <div className="space-y-2">
                      {suggested.map((item, i) => (
                        <QuickReply key={`s-${i}`} onClick={() => askQuestion(item)}>
                          {item.question}
                        </QuickReply>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function QuickReply({ children, onClick }: { children: React.ReactNode; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex w-full items-center gap-2 rounded-2xl border border-border bg-background px-3 py-2 text-left text-xs font-medium text-foreground transition hover:border-primary hover:bg-leaf-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      <Send className="h-3.5 w-3.5 shrink-0 text-primary" />
      <span>{children}</span>
    </button>
  );
}
