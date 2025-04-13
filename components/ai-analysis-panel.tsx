"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sparkles, Brain, Lightbulb, ArrowRightLeft, AlertTriangle, RefreshCw, Zap } from "lucide-react"
import type { Message } from "@/components/float-interface"

interface AIAnalysisPanelProps {
  messages: Message[]
  onInsightSelect: (insight: string) => void
}

// Define types for the analysis results
interface Insight {
  text: string
  confidence: number
  tags: string[]
  explanation: string
}

interface Pattern {
  summary: string
  messages: {
    excerpt: string
  }[]
  tags: string[]
  explanation: string
}

interface Contradiction {
  summary: string
  statement1: {
    text: string
  }
  statement2: {
    text: string
  }
  explanation: string
}

export function AIAnalysisPanel({ messages, onInsightSelect }: AIAnalysisPanelProps) {
  const [activeTab, setActiveTab] = useState("insights")
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [lastAnalyzed, setLastAnalyzed] = useState<string | null>(null)

  // State for analysis results
  const [insights, setInsights] = useState<Insight[]>([])
  const [patterns, setPatterns] = useState<Pattern[]>([])
  const [contradictions, setContradictions] = useState<Contradiction[]>([])

  // Filter out system messages
  const userMessages = messages.filter((m) => m.role === "user")

  // Run analysis when requested
  const runAnalysis = async () => {
    setIsAnalyzing(true)

    try {
      // Run all three analyses in parallel
      await Promise.all([fetchAnalysis("insights"), fetchAnalysis("patterns"), fetchAnalysis("contradictions")])

      setLastAnalyzed(new Date().toLocaleTimeString())
    } catch (error) {
      console.error("Error running analysis:", error)
    } finally {
      setIsAnalyzing(false)
    }
  }

  // Update the fetchAnalysis function to handle markdown-formatted responses
  const fetchAnalysis = async (analysisType: "insights" | "patterns" | "contradictions") => {
    try {
      const messagesParam = encodeURIComponent(JSON.stringify(messages))
      const response = await fetch(`/api/ai?type=analysis&analysisType=${analysisType}&messages=${messagesParam}`)

      if (!response.ok) {
        throw new Error(`Failed to fetch ${analysisType} analysis`)
      }

      const data = await response.json()
      let parsedData = []

      try {
        // Clean the response to handle potential markdown code blocks
        const cleanedResponse = cleanMarkdownCodeBlocks(data.analysis)
        parsedData = JSON.parse(cleanedResponse)
      } catch (e) {
        console.error(`Error parsing ${analysisType} analysis:`, e)
        parsedData = []
      }

      // Update the appropriate state
      if (analysisType === "insights") {
        setInsights(parsedData)
      } else if (analysisType === "patterns") {
        setPatterns(parsedData)
      } else if (analysisType === "contradictions") {
        setContradictions(parsedData)
      }
    } catch (error) {
      console.error(`Error fetching ${analysisType} analysis:`, error)
    }
  }

  // Add a helper function to clean markdown code blocks from the response
  const cleanMarkdownCodeBlocks = (text: string): string => {
    // Remove markdown code block syntax if present
    let cleaned = text.trim()

    // Remove opening code block markers like \`\`\`json, \`\`\`javascript, etc.
    cleaned = cleaned.replace(/^```(\w+)?\s*/m, "")

    // Remove closing code block markers
    cleaned = cleaned.replace(/\s*```\s*$/m, "")

    return cleaned
  }

  // Run initial analysis when the component mounts and there are messages
  useEffect(() => {
    if (userMessages.length >= 3 && !lastAnalyzed) {
      runAnalysis()
    }
  }, [])

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              AI Analysis
            </CardTitle>
            <CardDescription>Discover patterns and insights in your thoughts</CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={runAnalysis} disabled={isAnalyzing || userMessages.length < 2}>
            {isAnalyzing ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Zap className="mr-2 h-4 w-4" />
                Analyze
              </>
            )}
          </Button>
        </div>
        {lastAnalyzed && <div className="text-xs text-muted-foreground">Last analyzed at {lastAnalyzed}</div>}
      </CardHeader>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <div className="px-4">
          <TabsList className="w-full">
            <TabsTrigger value="insights" className="flex-1">
              <Lightbulb className="mr-2 h-4 w-4" />
              Insights
            </TabsTrigger>
            <TabsTrigger value="patterns" className="flex-1">
              <Brain className="mr-2 h-4 w-4" />
              Patterns
            </TabsTrigger>
            <TabsTrigger value="contradictions" className="flex-1">
              <ArrowRightLeft className="mr-2 h-4 w-4" />
              Contradictions
            </TabsTrigger>
          </TabsList>
        </div>

        <CardContent className="pt-4">
          <ScrollArea className="h-[400px] pr-4">
            <TabsContent value="insights" className="mt-0 space-y-4">
              {insights.length > 0 ? (
                insights.map((insight, index) => (
                  <InsightCard key={index} insight={insight} onSelect={() => onInsightSelect(insight.text)} />
                ))
              ) : (
                <EmptyState type="insights" isAnalyzing={isAnalyzing} messageCount={userMessages.length} />
              )}
            </TabsContent>

            <TabsContent value="patterns" className="mt-0 space-y-4">
              {patterns.length > 0 ? (
                patterns.map((pattern, index) => (
                  <PatternCard key={index} pattern={pattern} onSelect={() => onInsightSelect(pattern.summary)} />
                ))
              ) : (
                <EmptyState type="patterns" isAnalyzing={isAnalyzing} messageCount={userMessages.length} />
              )}
            </TabsContent>

            <TabsContent value="contradictions" className="mt-0 space-y-4">
              {contradictions.length > 0 ? (
                contradictions.map((contradiction, index) => (
                  <ContradictionCard
                    key={index}
                    contradiction={contradiction}
                    onSelect={() => onInsightSelect(contradiction.summary)}
                  />
                ))
              ) : (
                <EmptyState type="contradictions" isAnalyzing={isAnalyzing} messageCount={userMessages.length} />
              )}
            </TabsContent>
          </ScrollArea>
        </CardContent>
      </Tabs>

      <CardFooter className="border-t pt-4">
        <div className="text-xs text-muted-foreground">
          AI analysis is based on {userMessages.length} thoughts in your current space.
        </div>
      </CardFooter>
    </Card>
  )
}

// Empty state component
function EmptyState({
  type,
  isAnalyzing,
  messageCount,
}: {
  type: string
  isAnalyzing: boolean
  messageCount: number
}) {
  if (isAnalyzing) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <RefreshCw className="mb-2 h-8 w-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">Analyzing your thoughts...</p>
      </div>
    )
  }

  if (messageCount < 2) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <p className="text-sm text-muted-foreground">Add more thoughts to enable {type} analysis.</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center justify-center py-8 text-center">
      <p className="text-sm text-muted-foreground">
        No {type} found. Click "Analyze" to discover {type} in your thoughts.
      </p>
    </div>
  )
}

// Insight component
function InsightCard({ insight, onSelect }: { insight: Insight; onSelect: () => void }) {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <Lightbulb className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">Insight</span>
            </div>
            <Badge variant="outline" className="text-xs">
              {insight.confidence}% confidence
            </Badge>
          </div>
          <p className="text-sm">{insight.text}</p>
          {insight.explanation && <p className="text-xs text-muted-foreground">{insight.explanation}</p>}
          <div className="flex flex-wrap gap-1">
            {insight.tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
      <div className="border-t bg-muted/50 px-4 py-2">
        <Button variant="ghost" size="sm" className="h-7 w-full" onClick={onSelect}>
          Explore this insight
        </Button>
      </div>
    </Card>
  )
}

// Pattern component
function PatternCard({ pattern, onSelect }: { pattern: Pattern; onSelect: () => void }) {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-4">
        <div className="space-y-2">
          <div className="flex items-center gap-1">
            <Brain className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium">Recurring Pattern</span>
          </div>
          <p className="text-sm font-medium">{pattern.summary}</p>
          <div className="space-y-2 rounded-md bg-muted p-2">
            {pattern.messages.map((message, index) => (
              <div key={index} className="text-xs">
                <span className="italic">"{message.excerpt}"</span>
              </div>
            ))}
          </div>
          {pattern.explanation && <p className="text-xs text-muted-foreground">{pattern.explanation}</p>}
          <div className="flex flex-wrap gap-1">
            {pattern.tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
      <div className="border-t bg-muted/50 px-4 py-2">
        <Button variant="ghost" size="sm" className="h-7 w-full" onClick={onSelect}>
          Explore this pattern
        </Button>
      </div>
    </Card>
  )
}

// Contradiction component
function ContradictionCard({
  contradiction,
  onSelect,
}: {
  contradiction: Contradiction
  onSelect: () => void
}) {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-4">
        <div className="space-y-2">
          <div className="flex items-center gap-1">
            <AlertTriangle className="h-4 w-4 text-amber-500" />
            <span className="text-sm font-medium">Potential Contradiction</span>
          </div>
          <p className="text-sm font-medium">{contradiction.summary}</p>
          <div className="space-y-2">
            <div className="rounded-md bg-muted p-2">
              <div className="text-xs font-medium">Statement 1:</div>
              <div className="text-xs italic">"{contradiction.statement1.text}"</div>
            </div>
            <div className="flex justify-center">
              <ArrowRightLeft className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="rounded-md bg-muted p-2">
              <div className="text-xs font-medium">Statement 2:</div>
              <div className="text-xs italic">"{contradiction.statement2.text}"</div>
            </div>
          </div>
          <Separator />
          <div className="text-xs text-muted-foreground">{contradiction.explanation}</div>
        </div>
      </CardContent>
      <div className="border-t bg-muted/50 px-4 py-2">
        <Button variant="ghost" size="sm" className="h-7 w-full" onClick={onSelect}>
          Explore this contradiction
        </Button>
      </div>
    </Card>
  )
}
