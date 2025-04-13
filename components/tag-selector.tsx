"use client"

import type React from "react"

import { useState } from "react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tag, Plus, X } from "lucide-react"
import type { Tag as TagType } from "@/components/search-dialog"

interface TagSelectorProps {
  availableTags: TagType[]
  selectedTags: string[]
  onTagsChange: (tags: string[]) => void
  onCreateTag?: (tagName: string) => void
}

export function TagSelector({ availableTags, selectedTags, onTagsChange, onCreateTag }: TagSelectorProps) {
  const [newTagName, setNewTagName] = useState("")
  const [open, setOpen] = useState(false)

  const handleCreateTag = () => {
    if (newTagName.trim() && onCreateTag) {
      onCreateTag(newTagName.trim())
      setNewTagName("")
    }
  }

  const toggleTag = (tagName: string) => {
    onTagsChange(
      selectedTags.includes(tagName) ? selectedTags.filter((t) => t !== tagName) : [...selectedTags, tagName],
    )
  }

  const removeTag = (tagName: string, e: React.MouseEvent) => {
    e.stopPropagation()
    onTagsChange(selectedTags.filter((t) => t !== tagName))
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="h-8 gap-1 text-xs">
          <Tag className="h-3.5 w-3.5" />
          {selectedTags.length > 0 ? `${selectedTags.length} tags` : "Add tags"}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80" align="start">
        <div className="flex flex-col gap-3">
          <div className="text-sm font-medium">Tags</div>

          {selectedTags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {selectedTags.map((tag) => (
                <Badge key={tag} className="gap-1">
                  {tag}
                  <button
                    onClick={(e) => removeTag(tag, e)}
                    className="ml-1 rounded-full outline-none hover:text-accent-foreground focus:ring-2"
                  >
                    <X className="h-3 w-3" />
                    <span className="sr-only">Remove {tag} tag</span>
                  </button>
                </Badge>
              ))}
            </div>
          )}

          <div className="flex flex-wrap gap-1">
            {availableTags
              .filter((tag) => !selectedTags.includes(tag.name))
              .map((tag) => (
                <Badge key={tag.name} variant="outline" className="cursor-pointer" onClick={() => toggleTag(tag.name)}>
                  {tag.name}
                </Badge>
              ))}
          </div>

          <div className="flex items-center gap-2">
            <Input
              placeholder="Create new tag..."
              value={newTagName}
              onChange={(e) => setNewTagName(e.target.value)}
              className="h-8 text-xs"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleCreateTag()
                }
              }}
            />
            <Button size="sm" className="h-8 px-2" onClick={handleCreateTag} disabled={!newTagName.trim()}>
              <Plus className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
