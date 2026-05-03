"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";
import {
  CHAT_REPLIES,
  type ChatReply,
  fallbackReply,
  findReply,
} from "@/lib/chat-replies";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  text: string;
  sources?: ChatReply["sources"];
  streaming?: boolean;
}

const STREAM_DELAY_MS = 22;

export function Chat() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [streaming, setStreaming] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages]);

  function ask(question: string) {
    if (streaming) return;
    const trimmed = question.trim();
    if (!trimmed) return;

    setInput("");
    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      role: "user",
      text: trimmed,
    };
    setMessages((m) => [...m, userMsg]);

    const match = findReply(trimmed);
    const replyText = match ? match.reply : fallbackReply();
    const replySources = match?.sources;

    const assistantId = `a-${Date.now() + 1}`;
    setMessages((m) => [
      ...m,
      { id: assistantId, role: "assistant", text: "", sources: replySources, streaming: true },
    ]);
    streamReply(assistantId, replyText);
  }

  function streamReply(assistantId: string, fullText: string) {
    setStreaming(true);
    const tokens = fullText.split(/(\s+)/);
    let i = 0;
    const interval = setInterval(() => {
      i++;
      const partial = tokens.slice(0, i).join("");
      setMessages((m) =>
        m.map((msg) =>
          msg.id === assistantId ? { ...msg, text: partial } : msg,
        ),
      );
      if (i >= tokens.length) {
        clearInterval(interval);
        setMessages((m) =>
          m.map((msg) =>
            msg.id === assistantId ? { ...msg, streaming: false } : msg,
          ),
        );
        setStreaming(false);
      }
    }, STREAM_DELAY_MS);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    ask(input);
  }

  const showChips = messages.length === 0;

  return (
    <section aria-label="Ask about Cambridge council activity">
      {showChips && (
        <div className="mb-5 space-y-3">
          <p className="font-sans text-xs font-bold uppercase tracking-[0.12em] text-muted-light">
            Try asking
          </p>
          <div className="flex flex-col gap-2">
            {CHAT_REPLIES.map((r) => (
              <button
                key={r.id}
                type="button"
                onClick={() => ask(r.prompt)}
                className="text-left rounded-2xl border border-muted-light/20 bg-card-white px-4 py-3 font-sans text-sm text-body-light shadow-card-soft hover:bg-page-light transition-colors cursor-pointer"
              >
                {r.prompt}
              </button>
            ))}
          </div>
        </div>
      )}

      {messages.length > 0 && (
        <div className="mb-5 space-y-4">
          {messages.map((msg) => (
            <MessageBubble key={msg.id} message={msg} />
          ))}
          <div ref={bottomRef} />
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex gap-3 items-end">
        <div className="flex-1">
          <label htmlFor="chat-input" className="sr-only">
            Ask about Cambridge council activity
          </label>
          <textarea
            id="chat-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder='Ask about any item — "Why is the Garden Street vote controversial?"'
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
          disabled={streaming || !input.trim()}
          className="shrink-0 rounded-2xl bg-accent-brand-light px-5 py-3.5 font-sans text-sm font-bold text-white shadow-card-soft transition-opacity hover:opacity-90 disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed"
        >
          {streaming ? "Thinking..." : "Ask"}
        </button>
      </form>
    </section>
  );
}

function MessageBubble({ message }: { message: ChatMessage }) {
  const isUser = message.role === "user";
  return (
    <div className={cn("flex", isUser ? "justify-end" : "justify-start")}>
      <div
        className={cn(
          "max-w-[85%] rounded-2xl px-5 py-3 space-y-3",
          isUser
            ? "bg-accent-brand-light text-white font-sans text-sm"
            : "bg-card-white shadow-card-soft font-serif text-base leading-relaxed text-body-light",
        )}
      >
        <div>{isUser ? message.text : renderWithCitations(message.text)}</div>
        {!isUser && !message.streaming && message.sources && message.sources.length > 0 && (
          <div className="border-t border-muted-light/15 pt-2 space-y-1">
            {message.sources.map((s, idx) => (
              <a
                key={s.itemId}
                href={s.url}
                target="_blank"
                rel="noreferrer noopener"
                className="block font-sans text-xs text-accent-brand-light hover:underline"
              >
                [{idx + 1}] {s.title}
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function renderWithCitations(text: string) {
  const parts = text.split(/(\[\d+\])/g);
  return parts.map((part, i) => {
    if (/^\[\d+\]$/.test(part)) {
      return (
        <sup key={i} className="font-sans text-[10px] text-accent-brand-light">
          {part}
        </sup>
      );
    }
    return <span key={i}>{part}</span>;
  });
}
