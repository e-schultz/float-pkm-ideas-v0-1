"use client"

import type React from "react"

import { useRef, useState } from "react"
import type { Message } from "@/components/float-interface"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ZoomIn, ZoomOut, Maximize2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface ThoughtMapProps {
  messages: Message[]
}

// Update the ThoughtMap component to include tags
export function ThoughtMap({ messages }: ThoughtMapProps) {
  const canvasRef = useRef<HTMLDivElement>(null)
  const [zoom, setZoom] = useState(1)
  const [isPanning, setIsPanning] = useState(false)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [startPan, setStartPan] = useState({ x: 0, y: 0 })
  const [activeTag, setActiveTag] = useState<string | null>(null)

  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 0.1, 2))
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 0.1, 0.5))
  const handleReset = () => {
    setZoom(1)
    setPosition({ x: 0, y: 0 })
    setActiveTag(null)
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button === 0) {
      // Left mouse button
      setIsPanning(true)
      setStartPan({ x: e.clientX - position.x, y: e.clientY - position.y })
    }
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isPanning) {
      setPosition({
        x: e.clientX - startPan.x,
        y: e.clientY - startPan.y,
      })
    }
  }

  const handleMouseUp = () => {
    setIsPanning(false)
  }

  // Get all unique tags from messages
  const allTags = Array.from(new Set(messages.filter((m) => m.tags && m.tags.length > 0).flatMap((m) => m.tags || [])))

  // Filter messages based on active tag
  const filteredMessages = activeTag ? messages.filter((m) => m.tags?.includes(activeTag)) : messages

  // Filter out system messages
  const userMessages = filteredMessages.filter((m) => m.role !== "system")
  const assistantMessages = filteredMessages.filter((m) => m.role === "assistant")

  return (
    <div className="relative h-full w-full overflow-hidden">
      <div className="absolute left-4 top-4 z-10 flex flex-col gap-2">
        <div className="flex gap-2">
          <Button variant="outline" size="icon" onClick={handleZoomIn}>
            <ZoomIn className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={handleZoomOut}>
            <ZoomOut className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={handleReset}>
            <Maximize2 className="h-4 w-4" />
          </Button>
        </div>

        {allTags.length > 0 && (
          <div className="mt-2 flex flex-col gap-1 rounded-md border bg-background p-2">
            <div className="text-xs font-medium">Filter by tag:</div>
            <div className="flex flex-wrap gap-1">
              {allTags.map((tag) => (
                <Badge
                  key={tag}
                  variant={activeTag === tag ? "default" : "outline"}
                  className="cursor-pointer text-xs"
                  onClick={() => setActiveTag(activeTag === tag ? null : tag)}
                >
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </div>

      <div
        ref={canvasRef}
        className="h-full w-full cursor-grab"
        style={{
          cursor: isPanning ? "grabbing" : "grab",
        }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <div
          className="relative h-full w-full"
          style={{
            transform: `translate(${position.x}px, ${position.y}px) scale(${zoom})`,
            transformOrigin: "center",
            transition: isPanning ? "none" : "transform 0.2s ease-out",
          }}
        >
          {/* Center node */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <Card className="w-64 bg-primary text-primary-foreground">
              <CardContent className="p-4">
                <h3 className="font-semibold">Consciousness Core</h3>
                <p className="text-sm">
                  {activeTag ? `Filtered by tag: ${activeTag}` : "The central point of your thought space"}
                </p>
              </CardContent>
            </Card>

            {/* User thoughts */}
            {userMessages.map((message, index) => {
              // Calculate position in a circle around the center
              const angle = index * (360 / userMessages.length) * (Math.PI / 180)
              const radius = 200 // Distance from center
              const x = Math.cos(angle) * radius
              const y = Math.sin(angle) * radius

              return (
                <div
                  key={message.id}
                  className="absolute w-48"
                  style={{
                    transform: `translate(${x}px, ${y}px)`,
                    transition: "transform 0.5s ease-out",
                  }}
                >
                  <Card className="border-primary/20 bg-primary/10">
                    <CardContent className="p-3">
                      <p className="text-xs">{message.content}</p>
                      {message.tags && message.tags.length > 0 && (
                        <div className="mt-1 flex flex-wrap gap-1">
                          {message.tags.map((tag) => (
                            <Badge key={tag} variant="secondary" className="text-[10px]">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Draw line to center */}
                  <svg
                    className="absolute left-1/2 top-1/2 -z-10 h-[200px] w-[200px]"
                    style={{
                      transform: `rotate(${angle * (180 / Math.PI)}deg)`,
                      transformOrigin: "center",
                    }}
                  >
                    <line
                      x1="0"
                      y1="0"
                      x2="0"
                      y2={radius}
                      stroke="hsl(var(--primary) / 0.2)"
                      strokeWidth="2"
                      strokeDasharray="5,5"
                    />
                  </svg>
                </div>
              )
            })}

            {/* Assistant responses */}
            {assistantMessages.map((message, index) => {
              // Calculate position in a circle around the center, offset from user messages
              const angle = (index * (360 / assistantMessages.length) + 30) * (Math.PI / 180)
              const radius = 300 // Further from center than user messages
              const x = Math.cos(angle) * radius
              const y = Math.sin(angle) * radius

              return (
                <div
                  key={message.id}
                  className="absolute w-48"
                  style={{
                    transform: `translate(${x}px, ${y}px)`,
                    transition: "transform 0.5s ease-out",
                  }}
                >
                  <Card className="border-secondary/20 bg-secondary/10">
                    <CardContent className="p-3">
                      <p className="text-xs">{message.content}</p>
                    </CardContent>
                  </Card>

                  {/* Draw line to center */}
                  <svg
                    className="absolute left-1/2 top-1/2 -z-10 h-[300px] w-[300px]"
                    style={{
                      transform: `rotate(${angle * (180 / Math.PI)}deg)`,
                      transformOrigin: "center",
                    }}
                  >
                    <line
                      x1="0"
                      y1="0"
                      x2="0"
                      y2={radius}
                      stroke="hsl(var(--secondary) / 0.2)"
                      strokeWidth="2"
                      strokeDasharray="5,5"
                    />
                  </svg>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
