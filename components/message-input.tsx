"use client"

import { useState, type FormEvent } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { SendHorizontal } from "lucide-react"
import { TagSelector } from "@/components/tag-selector"
import type { Tag } from "@/components/search-dialog"

interface MessageInputProps {
  onSend: (message: string, tags: string[]) => void
  availableTags: Tag[]
  onCreateTag?: (tagName: string) => void
}

export function MessageInput({ onSend, availableTags, onCreateTag }: MessageInputProps) {
  const [input, setInput] = useState("")
  const [selectedTags, setSelectedTags] = useState<string[]>([])

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (input.trim()) {
      onSend(input, selectedTags)
      setInput("")
      setSelectedTags([])
    }
  }

  return (
    <div className="border-t bg-background p-4">
      <form onSubmit={handleSubmit} className="flex flex-col gap-2">
        <Textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Explore a thought..."
          className="min-h-[60px] flex-1 resize-none"
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault()
              handleSubmit(e)
            }
          }}
        />
        <div className="flex items-center justify-between">
          <TagSelector
            availableTags={availableTags}
            selectedTags={selectedTags}
            onTagsChange={setSelectedTags}
            onCreateTag={onCreateTag}
          />
          <Button type="submit" className="h-9">
            <SendHorizontal className="mr-2 h-4 w-4" />
            Send
          </Button>
        </div>
      </form>
    </div>
  )
}
