"use client";
import { useState } from "react";
import React from "react";
import { FaCircle, FaPaperPlane } from "react-icons/fa";
import Image from "next/image";

const Chatbot = () => {
  // Define message type for user & assistant messages
  type Message = {
    role: "user" | "assistant";
    content: string;
  };

  // State management
  const [messages, setMessages] = useState<Message[]>([]); // all messages
  const [input, setInput] = useState(""); // input field value
  const [loading, setLoading] = useState(false); // show loader while waiting for response

  // Handle sending a message
  const handleChat = async () => {
    if (!input.trim()) return; // prevent empty messages

    // Add user message
    const newUserMsg: Message = { role: "user", content: input };
    const updated = [...messages, newUserMsg];
    setMessages(updated);
    setLoading(true);

    try {
      // Send chat history to backend API
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify({ messages: updated }),
      });

      // Explicitly type the response structure
      const data: { response: string; error?: string } = await res.json();

      if (data.error) {
        throw new Error(data.error);
      }

      // Add assistant response to chat
      const assistantMsg: Message = {
        role: "assistant",
        content: data.response,
      };
      setMessages([...updated, assistantMsg]);
    } catch (err: unknown) {
      // Handle API errors safely
      let errorMessage = "An unknown error occurred";
      if (err instanceof Error) {
        errorMessage = err.message;
      }

      setMessages([
        ...updated,
        { role: "assistant", content: "ERROR: " + errorMessage },
      ]);
    }

    // Reset input and loading state
    setLoading(false);
    setInput("");
  };

  return (
    <div className="h-screen z-10 w-full flex items-center justify-center">
      <div className="h-full w-[70%] flex flex-col">
        {/* --- TOP HEADING (Logo) --- */}
        <div className="mt-5 flex justify-center">
          <Image src="/Eclipso.svg" height={160} width={160} alt="logo" />
        </div>

        {/* --- CHAT AREA --- */}
        <div className="flex-1 w-full overflow-y-auto sm:text-lg text-sm rounded-2xl text-[color:var(--secondary)]  my-4 scrollbar-hide">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`mb-3 ${m.role === "user" ? "text-right" : "text-left"}`}
            >
              <span
                className={`inline-block px-4 py-3 rounded-xl ${
                  m.role === "user"
                    ? "bg-[color:var(--secondary)] text-center text-[color:var(--pBlack)]"
                    : "bg-[color:var(--Charc)] shadow-md text-[color:var(--secondary)]"
                }`}
              >
                {m.content}
              </span>
            </div>
          ))}
        </div>

        {/* --- INPUT SECTION --- */}
        <div className="w-full z-10 bg-[color:var(--Charc)] p-3 mb-5 rounded-full shadow-2xl text-[color:var(--secondary)]">
          <div className="w-[95%] mx-auto flex items-center justify-between">
            {/* Input field */}
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              type="text"
              placeholder="What's on your mind?"
              className="border-none outline-none w-[85%] sm:w-[90%] sm:text-lg text-sm bg-transparent"
            />

            {/* Send button (shows loader if waiting for response) */}
            <span
              onClick={handleChat}
              className="rounded-full p-2 flex items-center justify-center hover:bg-[var(--neon-purp)] cursor-pointer text-[color:var(--neon-purp)] hover:text-[color:var(--pBlack)]"
            >
              {loading ? <FaCircle size={22} /> : <FaPaperPlane size={22} />}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;
