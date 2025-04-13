"use client"

import { useEffect, useRef } from "react"
import type { Message } from "@/components/float-interface"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { Brain, User, Tag, Sparkles } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface MessageListProps {
  messages: Message[]
  isAITyping?: boolean
  aiTypingContent?: string
}

export function MessageList({ messages, isAITyping = false, aiTypingContent = "" }: MessageListProps) {
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, aiTypingContent])

  return (
    <div className="flex-1 overflow-y-auto p-4">
      <div className="space-y-4">
        {messages.map((message) => (
          <MessageItem key={message.id} message={message} />
        ))}

        {/* AI typing indicator */}
        {isAITyping && (
          <div className="flex w-full gap-3 rounded-lg bg-secondary/10 p-4">
            <div className="flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-md border bg-background shadow">
              <Sparkles className="h-4 w-4 text-primary" />
            </div>
            <div className="flex-1 space-y-2">
              <div className="prose prose-sm max-w-none dark:prose-invert">
                <p>
                  {aiTypingContent}
                  <span className="ml-1 inline-block h-4 w-1 animate-pulse rounded-sm bg-primary"></span>
                </p>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <time dateTime={new Date().toISOString()}>{format(new Date(), "h:mm a, MMM d")}</time>
              </div>
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>
    </div>
  )
}

function MessageItem({ message }: { message: Message }) {
  const isUser = message.role === "user"
  const isSystem = message.role === "system"
  const isAI = message.role === "assistant"

  return (
    <div
      id={`message-${message.id}`}
      className={cn(
        "flex w-full gap-3 rounded-lg p-4 transition-colors duration-300",
        isUser ? "bg-primary/10" : isSystem ? "bg-muted" : "bg-secondary/10",
      )}
    >
      <div className="flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-md border bg-background shadow">
        {isUser ? (
          <User className="h-4 w-4" />
        ) : isAI ? (
          <Sparkles className="h-4 w-4 text-primary" />
        ) : (
          <Brain className="h-4 w-4" />
        )}
      </div>
      <div className="flex-1 space-y-2">
        <div className="prose prose-sm max-w-none dark:prose-invert">
          <p>{message.content}</p>
        </div>
        <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
          <time dateTime={message.timestamp}>{format(new Date(message.timestamp), "h:mm a, MMM d")}</time>

          {message.tags && message.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {message.tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  <Tag className="mr-1 h-3 w-3" />
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
