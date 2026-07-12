"use client";

import { useEffect, useRef, useState } from "react";
import { FaCircle, FaPaperPlane } from "react-icons/fa";
import Image from "next/image";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

type Role = "user" | "assistant";

type Message = {
  role: Role;
  content: string;
};

type ChatResponse = {
  response: string;
  error?: string;
};

// --- Markdown renderer for assistant messages ---
// The API returns Markdown (**bold**, ### headings, numbered lists), so we
// need to actually parse it instead of dumping the raw string in a <span>.
function MarkdownContent({ content }: { content: string }) {
  return (
    <div className="prose prose-invert prose-sm sm:prose-base max-w-none prose-p:my-2 prose-headings:mt-4 prose-headings:mb-2 prose-headings:font-semibold prose-ul:my-2 prose-ol:my-2 prose-li:my-0.5 prose-strong:text-[color:var(--secondary)] prose-headings:text-[color:var(--neon-purp)]">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
    </div>
  );
}

function MessageBubble({ role, content }: Message) {
  const isUser = role === "user";
  return (
    <div className={`mb-3 flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`inline-block px-4 py-3 rounded-xl max-w-[85%] ${
          isUser
            ? "bg-[color:var(--secondary)] text-center text-[color:var(--pBlack)]"
            : "bg-transparent text-[color:var(--secondary)] text-left"
        }`}
      >
        {isUser ? content : <MarkdownContent content={content} />}
      </div>
    </div>
  );
}

const Chatbot = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  // Ref to the SCROLLABLE CONTAINER itself (not a dummy end element).
  // We scroll this element directly via scrollTop so the browser never has
  // a reason to move the whole page — that's what scrollIntoView was doing.
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = chatContainerRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [messages, loading]);

  // KEY FIX: instead of relying purely on h-dvh (which recalculates on every
  // frame of the browser's address-bar show/hide animation, causing visible
  // jumps), we use the stable h-svh as a base and only adjust for the
  // on-screen keyboard directly via the VisualViewport API. This is a single
  // deliberate adjustment instead of a continuous recalculation.
  const [keyboardInset, setKeyboardInset] = useState(0);

  useEffect(() => {
    const vv = window.visualViewport;
    if (!vv) return;

    const handleResize = () => {
      const inset = Math.max(0, window.innerHeight - vv.height - vv.offsetTop);
      setKeyboardInset(inset);
    };

    vv.addEventListener("resize", handleResize);
    vv.addEventListener("scroll", handleResize);
    return () => {
      vv.removeEventListener("resize", handleResize);
      vv.removeEventListener("scroll", handleResize);
    };
  }, []);

  const handleChat = async () => {
    const trimmed = input.trim();
    if (!trimmed || loading) return;

    const newUserMsg: Message = { role: "user", content: trimmed };
    const updated = [...messages, newUserMsg];
    setMessages(updated);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: updated }),
      });

      if (!res.ok) {
        throw new Error(`Request failed with status ${res.status}`);
      }

      const data: ChatResponse = await res.json();

      if (data.error) {
        throw new Error(data.error);
      }

      const assistantMsg: Message = { role: "assistant", content: data.response };
      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "An unknown error occurred";
      setMessages((prev) => [...prev, { role: "assistant", content: "ERROR: " + errorMessage }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="w-screen flex flex-col items-center overflow-hidden"
      style={{ height: "100svh", paddingBottom: keyboardInset }}
    >
      <div className="h-full w-[90%] sm:w-[75%] flex flex-col min-h-0">
        {/* --- HEADER (Logo) --- */}
        <div className="shrink-0 mt-5 flex justify-center">
          <Image src="/Eclipso.svg" height={160} width={160} alt="Clipso logo" priority />
        </div>

        {/* --- CHAT AREA --- */}
        <div
          ref={chatContainerRef}
          className="flex-1 min-h-0 w-full overflow-y-auto overscroll-contain sm:text-lg text-sm rounded-xl text-[color:var(--secondary)] my-2 scrollbar-hide"
          style={{ WebkitOverflowScrolling: "touch" }}
        >
          {messages.map((m, idx) => (
            <MessageBubble key={idx} role={m.role} content={m.content} />
          ))}
          {loading && (
            <div className="mb-3 flex justify-start">
              <div className="inline-block px-4 py-3 rounded-xl text-[color:var(--secondary)] opacity-60 animate-pulse">
                thinking…
              </div>
            </div>
          )}
        </div>

        {/* --- INPUT SECTION --- */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleChat();
          }}
          className="shrink-0 w-full z-10 bg-[color:var(--Charc)] p-3 mb-5 rounded-full shadow-2xl text-[color:var(--secondary)]"
        >
          <div className="w-[95%] mx-auto flex items-center justify-between">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              type="text"
              placeholder="What's on your mind?"
              aria-label="Chat message"
              disabled={loading}
              className="border-none outline-none w-[85%] sm:w-[90%] sm:text-lg text-sm bg-transparent disabled:opacity-60"
            />

            <button
              type="submit"
              disabled={loading || !input.trim()}
              aria-label="Send message"
              className="rounded-full p-2 flex items-center justify-center hover:bg-[var(--neon-purp)] cursor-pointer text-[color:var(--neon-purp)] hover:text-[color:var(--pBlack)] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? <FaCircle size={22} className="animate-pulse" /> : <FaPaperPlane size={22} />}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Chatbot;