"use client"

import { useState, useCallback, useEffect } from "react"
import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { MessageList } from "@/components/message-list"
import { AIMessageInput } from "@/components/ai-message-input"
import { ThoughtMap } from "@/components/thought-map"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Brain, GitBranch, Clock, MessageSquare, Map, Plus, Sparkles } from "lucide-react"
import { SearchDialog } from "@/components/search-dialog"
import { AIAnalysisPanel } from "@/components/ai-analysis-panel"
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable"

// Update the Message interface to include tags
export interface Message {
  id: string
  content: string
  role: "user" | "assistant" | "system"
  timestamp: string
  tags?: string[]
}

interface Tag {
  name: string
}

// Update the FloatInterface component to include tags and search functionality
export function FloatInterface() {
  // Add a state for API key status
  const [activeTab, setActiveTab] = useState<string>("chat")
  const [showAIPanel, setShowAIPanel] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content:
        "Welcome to FLOAT - your personal knowledge management system. I'm your AI assistant, ready to help you explore your thoughts and ideas.",
      role: "assistant",
      timestamp: new Date().toISOString(),
    },
  ])
  const [tags, setTags] = useState<Tag[]>([
    { name: "idea" },
    { name: "question" },
    { name: "insight" },
    { name: "task" },
    { name: "reference" },
    { name: "ai-insight" },
  ])

  // AI response state
  const [isAIResponding, setIsAIResponding] = useState(false)
  const [aiTypingContent, setAITypingContent] = useState("")

  // Check API key status on mount
  useEffect(() => {
    // Any initialization logic can go here if needed
  }, [])

  const addMessage = (content: string, messageTags: string[] = []) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      content,
      role: "user",
      timestamp: new Date().toISOString(),
      tags: messageTags.length > 0 ? messageTags : undefined,
    }

    setMessages((prev) => [...prev, newMessage])
  }

  const addTag = (tagName: string) => {
    if (!tags.some((t) => t.name === tagName)) {
      setTags((prev) => [...prev, { name: tagName }])
    }
  }

  const scrollToMessage = (messageId: string) => {
    setActiveTab("chat")
    setTimeout(() => {
      const element = document.getElementById(`message-${messageId}`)
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "center" })
        element.classList.add("bg-primary/20")
        setTimeout(() => {
          element.classList.remove("bg-primary/20")
        }, 2000)
      }
    }, 100)
  }

  const handleInsightSelect = (insight: string) => {
    addMessage(`AI suggested insight: ${insight}`, ["ai-insight"])
  }

  // AI response handlers
  const handleAIResponseStart = useCallback(() => {
    setIsAIResponding(true)
    setAITypingContent("")
  }, [])

  const handleAIResponseChunk = useCallback((chunk: string) => {
    setAITypingContent((prev) => prev + chunk)
  }, [])

  // Update the handleAIResponseComplete function to check for API key errors
  const handleAIResponseComplete = useCallback((fullResponse: string) => {
    setIsAIResponding(false)
    setAITypingContent("")

    // Add the complete AI response as a new message
    const aiMessage: Message = {
      id: Date.now().toString(),
      content: fullResponse.trim(),
      role: "assistant",
      timestamp: new Date().toISOString(),
    }

    setMessages((prev) => [...prev, aiMessage])
  }, [])

  const handleCancelAIResponse = useCallback(() => {
    setIsAIResponding(false)
  }, [])

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full overflow-hidden bg-background">
        <FloatSidebar />

        <div className="flex flex-1 flex-col overflow-hidden">
          <header className="border-b bg-background p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <SidebarTrigger />
                <h1 className="text-xl font-bold">FLOAT</h1>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2">
                  <Button
                    variant={showAIPanel ? "default" : "outline"}
                    size="sm"
                    className="gap-1"
                    onClick={() => setShowAIPanel(!showAIPanel)}
                  >
                    <Sparkles className="h-4 w-4" />
                    AI Analysis
                  </Button>
                  <SearchDialog messages={messages} tags={tags} onSelectMessage={scrollToMessage} />
                  <Button variant="outline" size="sm">
                    <GitBranch className="mr-2 h-4 w-4" />
                    Commit Thoughts
                  </Button>
                </div>
              </div>
            </div>
          </header>

          <ResizablePanelGroup direction="horizontal" className="flex-1">
            <ResizablePanel defaultSize={showAIPanel ? 70 : 100} minSize={50}>
              <Tabs value={activeTab} onValueChange={setActiveTab} className="flex h-full flex-col overflow-hidden">
                <div className="border-b px-4">
                  <TabsList className="h-12">
                    <TabsTrigger value="chat" className="flex items-center gap-2">
                      <MessageSquare className="h-4 w-4" />
                      Conversation
                    </TabsTrigger>
                    <TabsTrigger value="map" className="flex items-center gap-2">
                      <Map className="h-4 w-4" />
                      Thought Map
                    </TabsTrigger>
                  </TabsList>
                </div>

                <TabsContent
                  value="chat"
                  className="flex-1 overflow-hidden p-0 data-[state=active]:flex data-[state=active]:flex-col"
                >
                  <MessageList messages={messages} isAITyping={isAIResponding} aiTypingContent={aiTypingContent} />
                  <AIMessageInput
                    onSend={addMessage}
                    availableTags={tags}
                    onCreateTag={addTag}
                    messages={messages}
                    onAIResponseStart={handleAIResponseStart}
                    onAIResponseChunk={handleAIResponseChunk}
                    onAIResponseComplete={handleAIResponseComplete}
                    isAIResponding={isAIResponding}
                    onCancelAIResponse={handleCancelAIResponse}
                  />
                </TabsContent>

                <TabsContent value="map" className="flex-1 overflow-auto p-0">
                  <ThoughtMap messages={messages} />
                </TabsContent>
              </Tabs>
            </ResizablePanel>

            {showAIPanel && (
              <>
                <ResizableHandle withHandle />
                <ResizablePanel defaultSize={30} minSize={25}>
                  <div className="h-full overflow-auto p-4">
                    <AIAnalysisPanel messages={messages} onInsightSelect={handleInsightSelect} />
                  </div>
                </ResizablePanel>
              </>
            )}
          </ResizablePanelGroup>
        </div>
      </div>
    </SidebarProvider>
  )
}

function FloatSidebar() {
  return (
    <Sidebar>
      <SidebarHeader className="border-b p-4">
        <div className="flex items-center gap-2">
          <Brain className="h-6 w-6" />
          <h2 className="text-lg font-semibold">FLOAT</h2>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Thought Spaces</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton isActive>
                  <Brain />
                  <span>Main Consciousness</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton>
                  <Brain />
                  <span>Creative Ideation</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton>
                  <Brain />
                  <span>Critical Analysis</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Time Echoes</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton>
                  <Clock />
                  <span>Today</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton>
                  <Clock />
                  <span>Yesterday</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton>
                  <Clock />
                  <span>Last Week</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t p-4">
        <Button variant="outline" className="w-full">
          <Plus className="mr-2 h-4 w-4" />
          New Thought Space
        </Button>
      </SidebarFooter>
    </Sidebar>
  )
}
