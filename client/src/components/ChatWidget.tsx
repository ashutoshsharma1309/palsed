import { useEffect, useRef, useState } from "react";
import { MessageCircle, X, Send, Sparkles } from "lucide-react";
import { apiPost } from "../lib/api";

// Floating "PrepNext Assistant" — a scoped chatbot that only helps with the
// platform and placement prep. Calls the server (/api/assistant/chat); the
// OpenAI key never touches the client. Mounted app-wide.

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

const WELCOME: ChatMessage = {
  role: "assistant",
  content:
    "Hi! I'm the PrepNext Assistant. Ask me about DSA practice, coding patterns, projects, mock OA, the recruiter map, PYQs, or your Placement Readiness Score. How can I help?",
};

const SUGGESTIONS = [
  "How do I improve my Readiness Score?",
  "Which DSA topics should I start with?",
  "How does the Mock OA work?",
];

export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([WELCOME]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  const send = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || loading) return;

    const next: ChatMessage[] = [...messages, { role: "user", content: trimmed }];
    setMessages(next);
    setInput("");
    setLoading(true);
    try {
      // Send only the real turns (drop the canned welcome) as context.
      const payload = next.filter((m, i) => !(i === 0 && m === WELCOME));
      const res = await apiPost<{ reply: string }>("/api/assistant/chat", { messages: payload });
      setMessages((m) => [...m, { role: "assistant", content: res.reply }]);
    } catch (e: any) {
      const msg =
        e?.status === 503
          ? "The assistant isn't configured yet on this server."
          : "Sorry — I couldn't reach the assistant just now. Please try again.";
      setMessages((m) => [...m, { role: "assistant", content: msg }]);
    } finally {
      setLoading(false);
    }
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send(input);
    }
  };

  return (
    <>
      {/* Launcher */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          aria-label="Open PrepNext Assistant"
          className="fixed bottom-20 right-5 sm:bottom-6 sm:right-6 z-40 flex items-center gap-2 rounded-full bg-[var(--color-neon)] text-black pl-4 pr-5 py-3 font-semibold shadow-lg neon-glow hover:brightness-110 transition"
        >
          <MessageCircle className="w-5 h-5" />
          <span className="hidden sm:inline">Ask PrepNext</span>
        </button>
      )}

      {/* Panel */}
      {open && (
        <div className="fixed bottom-20 right-4 sm:bottom-6 sm:right-6 z-50 w-[calc(100vw-2rem)] sm:w-[380px] h-[520px] max-h-[calc(100vh-6rem)] flex flex-col rounded-2xl border border-[var(--color-line)] bg-[var(--color-bg)] shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="flex items-center gap-2 px-4 py-3 border-b border-[var(--color-line)] bg-[var(--color-card-soft)]">
            <Sparkles className="w-4 h-4 text-[var(--color-neon)]" />
            <div className="font-semibold text-sm">PrepNext Assistant</div>
            <span className="mono text-[10px] uppercase tracking-widest text-[var(--color-text-faint)] ml-1">
              placement help
            </span>
            <button
              onClick={() => setOpen(false)}
              aria-label="Close assistant"
              className="ml-auto text-[var(--color-text-faint)] hover:text-[var(--color-text)]"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
            {messages.map((m, i) => (
              <div key={i} className={m.role === "user" ? "flex justify-end" : "flex justify-start"}>
                <div
                  className={`max-w-[85%] rounded-2xl px-3.5 py-2 text-sm whitespace-pre-wrap break-words ${
                    m.role === "user"
                      ? "bg-[var(--color-neon)] text-black rounded-br-sm"
                      : "bg-[var(--color-card-soft)] text-[var(--color-text-dim)] border border-[var(--color-line)] rounded-bl-sm"
                  }`}
                >
                  {m.content}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start">
                <div className="rounded-2xl rounded-bl-sm border border-[var(--color-line)] bg-[var(--color-card-soft)] px-3.5 py-2.5">
                  <span className="inline-flex gap-1">
                    <Dot /> <Dot delay={150} /> <Dot delay={300} />
                  </span>
                </div>
              </div>
            )}

            {messages.length === 1 && !loading && (
              <div className="flex flex-wrap gap-2 pt-1">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    onClick={() => send(s)}
                    className="text-left text-xs rounded-full border border-[var(--color-line)] px-3 py-1.5 text-[var(--color-text-dim)] hover:border-[var(--color-neon)] hover:text-[var(--color-text)] transition"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Composer */}
          <div className="border-t border-[var(--color-line)] p-3">
            <div className="flex items-end gap-2">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={onKeyDown}
                rows={1}
                placeholder="Ask about placement prep…"
                className="flex-1 resize-none max-h-28 bg-[var(--color-card-soft)] border border-[var(--color-line)] rounded-xl px-3 py-2 text-sm outline-none focus:border-[var(--color-neon)] placeholder:text-[var(--color-text-faint)]"
              />
              <button
                onClick={() => send(input)}
                disabled={!input.trim() || loading}
                aria-label="Send"
                className="shrink-0 w-10 h-10 grid place-items-center rounded-xl bg-[var(--color-neon)] text-black disabled:opacity-40 hover:brightness-110 transition"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
            <div className="mono text-[10px] text-[var(--color-text-faint)] mt-2 text-center">
              Scoped to PrepNext &amp; placement prep · AI can make mistakes
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function Dot({ delay = 0 }: { delay?: number }) {
  return (
    <span
      className="inline-block w-1.5 h-1.5 rounded-full bg-[var(--color-text-faint)] animate-bounce"
      style={{ animationDelay: `${delay}ms` }}
    />
  );
}
