"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Search, Tag, Clock, Calendar } from "lucide-react"
import type { Message } from "@/components/float-interface"
import { format } from "date-fns"

export interface Tag {
  name: string
  color?: string
}

interface SearchDialogProps {
  messages: Message[]
  tags: Tag[]
  onSelectMessage: (messageId: string) => void
}

export function SearchDialog({ messages, tags, onSelectMessage }: SearchDialogProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [open, setOpen] = useState(false)

  // Filter messages based on search term and selected tags
  const filteredMessages = messages.filter((message) => {
    const matchesSearch = searchTerm === "" || message.content.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesTags =
      selectedTags.length === 0 || (message.tags && selectedTags.every((tag) => message.tags?.includes(tag)))

    return matchesSearch && matchesTags
  })

  const toggleTag = (tagName: string) => {
    setSelectedTags((prev) => (prev.includes(tagName) ? prev.filter((t) => t !== tagName) : [...prev, tagName]))
  }

  const handleSelectMessage = (messageId: string) => {
    onSelectMessage(messageId)
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon" className="h-9 w-9">
          <Search className="h-4 w-4" />
          <span className="sr-only">Search thoughts</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>Search Thoughts</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search your thoughts..."
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div>
            <div className="mb-2 text-sm font-medium">Filter by tags</div>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <Badge
                  key={tag.name}
                  variant={selectedTags.includes(tag.name) ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => toggleTag(tag.name)}
                >
                  <Tag className="mr-1 h-3 w-3" />
                  {tag.name}
                </Badge>
              ))}
            </div>
          </div>

          <ScrollArea className="h-[300px] rounded-md border p-2">
            {filteredMessages.length > 0 ? (
              <div className="space-y-2">
                {filteredMessages.map((message) => (
                  <div
                    key={message.id}
                    className="cursor-pointer rounded-md p-3 hover:bg-muted"
                    onClick={() => handleSelectMessage(message.id)}
                  >
                    <div className="line-clamp-2 text-sm">{message.content}</div>
                    <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                      <div className="flex items-center">
                        <Clock className="mr-1 h-3 w-3" />
                        {format(new Date(message.timestamp), "h:mm a")}
                      </div>
                      <div className="flex items-center">
                        <Calendar className="mr-1 h-3 w-3" />
                        {format(new Date(message.timestamp), "MMM d, yyyy")}
                      </div>
                      {message.tags && message.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {message.tags.map((tag) => (
                            <Badge key={tag} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex h-full items-center justify-center text-muted-foreground">No thoughts found</div>
            )}
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  )
}
