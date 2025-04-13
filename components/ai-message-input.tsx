"use client"

import { useState, useRef, useEffect, type FormEvent } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { SendHorizontal, Sparkles, StopCircle } from "lucide-react"
import { TagSelector } from "@/components/tag-selector"
import type { Tag } from "@/components/search-dialog"
import type { Message } from "@/components/float-interface"

interface AIMessageInputProps {
  onSend: (message: string, tags: string[]) => void
  onAIResponseStart: () => void
  onAIResponseChunk: (chunk: string) => void
  onAIResponseComplete: (fullResponse: string) => void
  availableTags: Tag[]
  onCreateTag?: (tagName: string) => void
  messages: Message[]
  isAIResponding: boolean
  onCancelAIResponse: () => void
}

export function AIMessageInput({
  onSend,
  onAIResponseStart,
  onAIResponseChunk,
  onAIResponseComplete,
  availableTags,
  onCreateTag,
  messages,
  isAIResponding,
  onCancelAIResponse,
}: AIMessageInputProps) {
  const [input, setInput] = useState("")
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Auto-resize textarea as content grows
  useEffect(() => {
    const textarea = textareaRef.current
    if (textarea) {
      textarea.style.height = "60px" // Reset height
      const scrollHeight = textarea.scrollHeight
      textarea.style.height = `${scrollHeight}px`
    }
  }, [input])

  // Handle form submission
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (input.trim() && !isLoading && !isAIResponding) {
      setIsLoading(true)

      // Send the user message
      onSend(input, selectedTags)

      // Prepare for AI response
      onAIResponseStart()

      try {
        // Create a new message array with the user's message
        const updatedMessages = [
          ...messages,
          {
            id: Date.now().toString(),
            content: input,
            role: "user",
            timestamp: new Date().toISOString(),
            tags: selectedTags.length > 0 ? selectedTags : undefined,
          },
        ]

        // Set up streaming
        const response = await fetch("/api/ai", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            messages: updatedMessages,
            tags: availableTags.map((tag) => tag.name),
          }),
        })

        if (!response.ok) {
          throw new Error(`Server error: ${response.status}`)
        }

        const data = await response.json()

        // Check for API key error in the response
        if (data.response.includes("OpenAI API key is missing")) {
          onAIResponseChunk(data.response)
          onAIResponseComplete(data.response)
          setIsLoading(false)
          setInput("")
          setSelectedTags([])
          return
        }

        // Process the response in chunks to simulate streaming
        const chunks = data.response.split(" ")
        let accumulatedResponse = ""

        for (const chunk of chunks) {
          if (isAIResponding) {
            // Check if response was cancelled
            await new Promise((resolve) => setTimeout(resolve, 20)) // Slow down to simulate typing
            const chunkWithSpace = chunk + " "
            onAIResponseChunk(chunkWithSpace)
            accumulatedResponse += chunkWithSpace
          } else {
            break
          }
        }

        onAIResponseComplete(accumulatedResponse)
      } catch (error) {
        console.error("Error getting AI response:", error)
        onAIResponseChunk("I'm having trouble responding right now. Please try again.")
        onAIResponseComplete("I'm having trouble responding right now. Please try again.")
      } finally {
        setIsLoading(false)
        setInput("")
        setSelectedTags([])
      }
    }
  }

  return (
    <div className="border-t bg-background p-4">
      <form onSubmit={handleSubmit} className="flex flex-col gap-2">
        <Textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={isAIResponding ? "AI is responding..." : "Explore a thought..."}
          className="min-h-[60px] flex-1 resize-none"
          disabled={isAIResponding}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault()
              handleSubmit(e)
            }
          }}
        />
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TagSelector
              availableTags={availableTags}
              selectedTags={selectedTags}
              onTagsChange={setSelectedTags}
              onCreateTag={onCreateTag}
            />
            {isAIResponding && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={onCancelAIResponse}
                className="h-8 gap-1 text-xs"
              >
                <StopCircle className="h-3.5 w-3.5" />
                Stop generating
              </Button>
            )}
          </div>
          <Button type="submit" className="h-9 gap-1" disabled={!input.trim() || isLoading || isAIResponding}>
            {isLoading ? (
              <>
                <Sparkles className="h-4 w-4 animate-pulse" />
                Thinking...
              </>
            ) : (
              <>
                <SendHorizontal className="h-4 w-4" />
                Send
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}
