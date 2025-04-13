import { type NextRequest, NextResponse } from "next/server"
import { generateAIResponse, generateThoughtAnalysis } from "@/lib/ai-service"
import type { Message } from "@/components/float-interface"

// Handle regular AI responses
export async function POST(request: NextRequest) {
  try {
    // Log environment variables (without exposing the actual key)
    console.log("Environment variables check:", {
      hasOpenAIKey: !!process.env.OPENAI_API_KEY,
      nodeEnv: process.env.NODE_ENV,
    })

    const { messages, tags } = await request.json()

    // Validate input
    if (!Array.isArray(messages)) {
      return NextResponse.json({ error: "Invalid request: messages must be an array" }, { status: 400 })
    }

    try {
      const response = await generateAIResponse(messages, tags)
      return NextResponse.json({ response })
    } catch (error) {
      console.error("Error in AI route:", error)

      // Check if it's an API key error
      if (error instanceof Error && error.message.includes("API key is missing")) {
        return NextResponse.json({
          response: "⚠️ OpenAI API key is missing or invalid. Please check your environment variables.",
        })
      }

      return NextResponse.json({ response: "Failed to generate AI response. Please try again." })
    }
  } catch (error) {
    console.error("Error parsing request:", error)
    return NextResponse.json({ error: "Invalid request format" }, { status: 400 })
  }
}

// Handle streaming responses
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const type = searchParams.get("type")

  // For thought analysis requests
  if (type === "analysis") {
    const analysisType = searchParams.get("analysisType") as "insights" | "patterns" | "contradictions"
    const messagesParam = searchParams.get("messages")

    if (!messagesParam || !analysisType) {
      return NextResponse.json({ error: "Missing required parameters" }, { status: 400 })
    }

    try {
      const messages = JSON.parse(decodeURIComponent(messagesParam)) as Message[]
      const analysis = await generateThoughtAnalysis(messages, analysisType)

      return NextResponse.json({ analysis })
    } catch (error) {
      console.error("Error in analysis route:", error)
      return NextResponse.json({ error: "Failed to generate analysis" }, { status: 500 })
    }
  }

  return NextResponse.json({ error: "Invalid request type" }, { status: 400 })
}
