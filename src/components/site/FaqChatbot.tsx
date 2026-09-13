import { useState, useRef, useEffect } from "react";
import { Link } from "@tanstack/react-router";
import { MessageCircle, X, Send, Bot, Calendar, ShoppingBag, Phone, ArrowRight } from "lucide-react";
import { chatApi, type ChatConfig, type ChatMessageResponse } from "@/services/api";

type ChatMessage = {
  id: string;
  from: "bot" | "user";
  text: string;
  suggestions?: string[];
  action?: ChatMessageResponse["action"];
};

const uid = () => `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

export function FaqChatbot() {
  const [open, setOpen] = useState(false);
  const [typing, setTyping] = useState(false);
  const [inputMessage, setInputMessage] = useState("");
  const [config, setConfig] = useState<ChatConfig | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  const scrollRef = useRef<HTMLDivElement>(null);

  // Load chatbot configuration from backend
  useEffect(() => {
    chatApi
      .getConfig()
      .then((res) => {
        if (res.data) {
          setConfig(res.data);
          if (res.data.enabled !== false) {
            const welcome =
              res.data.welcome_message ||
              res.data.welcomeMessage ||
              "Hi! 👋 Welcome to MD's Homoeopathy. How can I help you today?";
            const suggestions =
              res.data.suggested_questions && res.data.suggested_questions.length > 0
                ? res.data.suggested_questions
                : res.data.suggestedQuestions && res.data.suggestedQuestions.length > 0
                ? res.data.suggestedQuestions
                : [];

            setMessages([
              {
                id: uid(),
                from: "bot",
                text: welcome,
                suggestions: suggestions.length > 0 ? suggestions : undefined,
              },
            ]);
          }
        }
      })
      .catch(() => {
        // Safe fallback if network error occurs
        setConfig({
          enabled: true,
          welcome_message: "Hi! 👋 Welcome to MD's Homoeopathy. How can I help you today?",
          suggested_questions: [],
        });
        setMessages([
          {
            id: uid(),
            from: "bot",
            text: "Hi! 👋 Welcome to MD's Homoeopathy. How can I help you today?",
          },
        ]);
      });
  }, []);

  // Auto-scroll on new messages
  useEffect(() => {
    if (open && scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, typing, open]);

  const sendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputMessage).trim();
    if (!text || typing) return;

    setInputMessage("");

    // Add user message to state
    const userMsg: ChatMessage = { id: uid(), from: "user", text };
    setMessages((prev) => [...prev, userMsg]);
    setTyping(true);

    // Prepare history for backend
    const history = messages.slice(-6).map((m) => ({
      role: m.from === "user" ? ("user" as const) : ("assistant" as const),
      content: m.text,
    }));

    try {
      const res = await chatApi.sendMessage({ message: text, history });
      const replyData = res.data;

      setMessages((prev) => [
        ...prev,
        {
          id: uid(),
          from: "bot",
          text: replyData.reply,
          suggestions: replyData.suggestions,
          action: replyData.action,
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: uid(),
          from: "bot",
          text: "I apologize, but I'm having trouble connecting right now. Please feel free to call our clinic directly or book an appointment online.",
          action: {
            type: "appointment",
            label: "Book Appointment",
            url: "/appointment",
          },
        },
      ]);
    } finally {
      setTyping(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      sendMessage();
    }
  };

  if (config && config.enabled === false) {
    return null;
  }

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
            <div className="grid h-9 w-9 place-items-center rounded-full bg-white/20">
              <Bot className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <div className="text-sm font-bold leading-tight">MD's Assistant</div>
              <div className="text-[11px] opacity-90 flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-300 animate-pulse" />
                Live Homeopathic Guide
              </div>
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
          <div ref={scrollRef} className="max-h-80 min-h-[12rem] space-y-3 overflow-y-auto px-4 py-4">
            {messages.map((m) => (
              <div key={m.id} className="space-y-2">
                <div className={`flex ${m.from === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
                      m.from === "user"
                        ? "rounded-br-sm bg-primary text-primary-foreground"
                        : "rounded-bl-sm bg-muted text-foreground border border-border/50"
                    }`}
                  >
                    {m.text}
                  </div>
                </div>

                {/* Call-to-action button if provided */}
                {m.action && (
                  <div className="flex justify-start pl-2">
                    {m.action.url.startsWith("http") || m.action.url.startsWith("tel:") ? (
                      <a
                        href={m.action.url}
                        className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 hover:bg-primary/20 text-primary px-3.5 py-1.5 text-xs font-semibold transition"
                      >
                        {m.action.type === "call" ? <Phone className="h-3 w-3" /> : <ArrowRight className="h-3 w-3" />}
                        {m.action.label}
                      </a>
                    ) : (
                      <Link
                        to={m.action.url}
                        className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 hover:bg-primary/20 text-primary px-3.5 py-1.5 text-xs font-semibold transition"
                      >
                        {m.action.type === "appointment" ? (
                          <Calendar className="h-3 w-3" />
                        ) : m.action.type === "products" ? (
                          <ShoppingBag className="h-3 w-3" />
                        ) : (
                          <ArrowRight className="h-3 w-3" />
                        )}
                        {m.action.label}
                      </Link>
                    )}
                  </div>
                )}

                {/* Suggestions chips */}
                {m.suggestions && m.suggestions.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pl-1 pt-1">
                    {m.suggestions.map((suggestion, idx) => (
                      <button
                        key={idx}
                        onClick={() => sendMessage(suggestion)}
                        className="rounded-full border border-primary/30 bg-leaf-soft/60 px-3 py-1 text-left text-[11px] font-medium text-primary hover:bg-leaf-soft transition"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {typing && (
              <div className="flex justify-start" aria-label="Assistant is typing">
                <div className="flex items-center gap-1.5 rounded-2xl rounded-bl-sm bg-muted px-4 py-3">
                  <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground/60 [animation-delay:-0.3s]" />
                  <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground/60 [animation-delay:-0.15s]" />
                  <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground/60" />
                </div>
              </div>
            )}
          </div>

          {/* User Input Field */}
          <div className="border-t border-border p-3 bg-card">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type your question..."
                aria-label="Ask assistant a question"
                className="flex-1 rounded-full border border-border bg-background py-2 px-4 text-sm outline-none transition focus:border-primary focus-visible:ring-2 focus-visible:ring-ring"
              />
              <button
                onClick={() => sendMessage()}
                disabled={!inputMessage.trim() || typing}
                aria-label="Send message"
                className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-primary text-primary-foreground disabled:opacity-50 transition hover:scale-105 active:scale-95"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
