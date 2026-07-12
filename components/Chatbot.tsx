"use client";

import { useEffect, useRef, useState } from "react";
import { FaCircle, FaPaperPlane } from "react-icons/fa";
import Image from "next/image";

type Role = "user" | "assistant";

type Message = {
  role: Role;
  content: string;
};

type ChatResponse = {
  response: string;
  error?: string;
};

// --- Small presentational component for a single chat bubble ---
function MessageBubble({ role, content }: Message) {
  const isUser = role === "user";
  return (
    <div className={`mb-3 ${isUser ? "text-right" : "text-left"}`}>
      <span
        className={`inline-block px-4 py-3 rounded-xl max-w-[85%] ${
          isUser
            ? "bg-[color:var(--secondary)] text-center text-[color:var(--pBlack)]"
            : "bg-transparent text-[color:var(--secondary)]"
        }`}
      >
        {content}
      </span>
    </div>
  );
}

const Chatbot = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  // Ref to the scrollable chat area so we can auto-scroll to the newest message
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

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
    // KEY FIX #1: h-dvh instead of h-screen.
    // 100vh is a static value and does NOT shrink when the mobile keyboard
    // opens, so the layout keeps trying to fit inside a viewport that no
    // longer matches the real visible area. h-dvh (dynamic viewport height)
    // tracks the *actual* visible viewport, keyboard included.
    //
    // KEY FIX #2: flex-col with distinct top/middle/bottom regions instead of
    // wrapping the entire page in items-center justify-center. Centering the
    // whole page as a single block is what made the logo and input bar
    // "float" into the wrong place once the visible height changed — the
    // whole stack re-centers itself into whatever space is left. Pinning the
    // header and input to shrink-0 and letting only the chat area flex means
    // the keyboard only ever eats into the middle, scrollable region.
    <div className="h-dvh w-screen flex flex-col items-center overflow-hidden">
      <div className="h-full w-[90%] sm:w-[75%] flex flex-col min-h-0">
        {/* --- HEADER (Logo) --- */}
        <div className="shrink-0 mt-5 flex justify-center">
          <Image src="/Eclipso.svg" height={160} width={160} alt="Clipso logo" />
        </div>

        {/* --- CHAT AREA (only this region shrinks when keyboard opens) --- */}
        <div className="flex-1 min-h-0 w-full overflow-y-auto sm:text-lg text-sm rounded-xl text-[color:var(--secondary)] my-2 scrollbar-hide">
          {messages.map((m, idx) => (
            <MessageBubble key={idx} role={m.role} content={m.content} />
          ))}
          <div ref={chatEndRef} />
        </div>

        {/* --- INPUT SECTION (pinned, never gets pushed off-screen) --- */}
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
              className="border-none outline-none w-[85%] sm:w-[90%] sm:text-lg text-sm bg-transparent"
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