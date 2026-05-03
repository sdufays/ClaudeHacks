"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useState, useRef, useEffect } from "react";
import { MessageList } from "@/components/chat/message-list";

// Create a transport pointing at /api/chat (default, but explicit for clarity)
const chatTransport = new DefaultChatTransport({ api: "/api/chat" });

export function ChatComposer() {
  const [input, setInput] = useState("");
  const [agentsDown, setAgentsDown] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  const { messages, sendMessage, status, error } = useChat({
    transport: chatTransport,
    onError: () => {
      setAgentsDown(true);
    },
  });

  const isLoading = status === "submitted" || status === "streaming";

  // Scroll to bottom when messages grow
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // If error occurs, mark agents as down
  useEffect(() => {
    if (error) {
      setAgentsDown(true);
    }
  }, [error]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const text = input.trim();
    if (!text || isLoading) return;
    setInput("");
    setAgentsDown(false);
    try {
      await sendMessage({ text });
    } catch {
      setAgentsDown(true);
    }
  }

  return (
    <section aria-label="Ask a question about Cambridge council activity">
      {messages.length > 0 && (
        <div className="mb-5">
          <MessageList messages={messages} />
          <div ref={bottomRef} />
        </div>
      )}

      {agentsDown && (
        <div className="mb-4 rounded-2xl bg-card-white border border-muted-light/20 px-5 py-3 font-sans text-sm text-muted-light shadow-card-soft">
          Agents tree wiring in progress. Chat will be live shortly.
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex gap-3 items-end">
        <div className="flex-1">
          <label htmlFor="chat-input" className="sr-only">
            Ask about Cambridge council activity
          </label>
          <textarea
            id="chat-input"
            name="prompt"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder='Ask about any item — "Why is the Cambridge Street vote controversial?"'
            rows={2}
            className="w-full resize-none rounded-2xl border border-muted-light/20 bg-card-white px-5 py-3.5 font-sans text-sm text-body-light placeholder:text-muted-light shadow-card-soft focus:outline-none focus:ring-2 focus:ring-accent-brand-light/40 transition-shadow"
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e as unknown as React.FormEvent);
              }
            }}
          />
        </div>
        <button
          type="submit"
          disabled={isLoading || !input.trim()}
          className="shrink-0 rounded-2xl bg-accent-brand-light px-5 py-3.5 font-sans text-sm font-bold text-white shadow-card-soft transition-opacity hover:opacity-90 disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed"
        >
          {isLoading ? "Thinking..." : "Ask"}
        </button>
      </form>
    </section>
  );
}
