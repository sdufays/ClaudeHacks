import type { UIMessage } from "ai";
import { cn } from "@/lib/cn";

interface MessageListProps {
  messages: UIMessage[];
}

/** Very simple citation regex: [1], [2], etc. */
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

function getMessageText(msg: UIMessage): string {
  return msg.parts
    .filter((p) => p.type === "text")
    .map((p) => (p as { type: "text"; text: string }).text)
    .join("");
}

export function MessageList({ messages }: MessageListProps) {
  if (messages.length === 0) return null;

  return (
    <div className="space-y-4" aria-label="Conversation">
      {messages.map((msg) => {
        const isUser = msg.role === "user";
        const text = getMessageText(msg);
        return (
          <div
            key={msg.id}
            className={cn(
              "flex",
              isUser ? "justify-end" : "justify-start",
            )}
          >
            <div
              className={cn(
                "max-w-[85%] rounded-2xl px-5 py-3",
                isUser
                  ? "bg-accent-brand-light text-white font-sans text-sm"
                  : "bg-card-white shadow-card-soft font-serif text-base leading-relaxed text-body-light",
              )}
            >
              {isUser ? text : renderWithCitations(text)}
            </div>
          </div>
        );
      })}
    </div>
  );
}
