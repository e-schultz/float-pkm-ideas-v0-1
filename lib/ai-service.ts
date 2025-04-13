import { generateText, streamText } from "ai"
import { createOpenAI } from "@ai-sdk/openai"
import type { Message } from "@/components/float-interface"

// Function to validate OpenAI API key format
function isValidOpenAIKey(key: string): boolean {
  // OpenAI keys typically start with "sk-" and are longer than 20 characters
  return key.startsWith("sk-") && key.length > 20 && !key.includes("your_api_key_here")
}

// Function to get OpenAI configuration with better error handling
function getOpenAIConfig() {
  // Check for API key in environment variables
  const apiKey = process.env.OPENAI_API_KEY

  if (!apiKey) {
    console.error("OPENAI_API_KEY environment variable is not set")
    throw new Error("OpenAI API key is missing. Please add it to your environment variables as OPENAI_API_KEY.")
  }

  if (!isValidOpenAIKey(apiKey)) {
    console.error("OPENAI_API_KEY appears to be invalid")
    throw new Error("Invalid OpenAI API key format. Please provide a valid API key starting with 'sk-'.")
  }

  return { apiKey }
}

// Create a custom OpenAI client that explicitly sets the API key
function createOpenAIClient() {
  try {
    const config = getOpenAIConfig()
    return createOpenAI({
      apiKey: config.apiKey,
    })
  } catch (error) {
    console.error("Failed to create OpenAI client:", error)
    throw error
  }
}

// Convert FLOAT messages to the format expected by the AI SDK
function convertMessagesToAIFormat(messages: Message[]) {
  return messages
    .filter((msg) => msg.role !== "system") // Filter out system messages
    .map((msg) => ({
      role: msg.role as "user" | "assistant",
      content: msg.content,
    }))
}

// Create a system prompt that includes context about the user's thought space
function createSystemPrompt(messages: Message[], tags: string[] = []) {
  let systemPrompt = `You are FLOAT AI, an assistant integrated into a Personal Knowledge Management system.
Your purpose is to help the user explore their thoughts, identify patterns, and discover insights.
Be thoughtful, nuanced, and help surface connections between ideas.`

  // Add information about tags if available
  if (tags.length > 0) {
    systemPrompt += `\n\nThe user has organized their thoughts with the following tags: ${tags.join(", ")}.`
  }

  // Add information about the conversation history
  const userMessages = messages.filter((msg) => msg.role === "user")
  if (userMessages.length > 0) {
    systemPrompt += `\n\nThe user has shared ${userMessages.length} thoughts in this space.`

    // Extract key themes if there are enough messages
    if (userMessages.length >= 3) {
      const recentMessages = userMessages.slice(-3).map((msg) => msg.content)
      systemPrompt += `\n\nRecent themes in their thinking include: ${recentMessages.join(" | ")}`
    }
  }

  return systemPrompt
}

// Generate a complete AI response
export async function generateAIResponse(messages: Message[], tags: string[] = []): Promise<string> {
  try {
    console.log("Attempting to generate AI response")

    // Create OpenAI client with explicit API key
    const openaiClient = createOpenAIClient()

    const systemPrompt = createSystemPrompt(messages, tags)
    const aiMessages = convertMessagesToAIFormat(messages)

    const { text } = await generateText({
      model: openaiClient("gpt-4o"),
      messages: aiMessages,
      system: systemPrompt,
    })

    return text
  } catch (error) {
    console.error("Error generating AI response:", error)

    if (error instanceof Error) {
      if (error.message.includes("API key is missing")) {
        return "⚠️ OpenAI API key is missing. Please add your OPENAI_API_KEY to your environment variables."
      } else if (error.message.includes("Invalid OpenAI API key format")) {
        return "⚠️ Invalid OpenAI API key format. Please check your environment variables."
      } else if (error.message.includes("Incorrect API key provided")) {
        return "⚠️ Incorrect API key provided. Please check your OpenAI API key in your environment variables."
      }
    }

    return "I'm having trouble processing that right now. Please try again."
  }
}

// Stream an AI response for real-time updates
export async function streamAIResponse(
  messages: Message[],
  tags: string[] = [],
  onChunk: (chunk: string) => void,
  onFinish: (fullText: string) => void,
) {
  try {
    // Create OpenAI client with explicit API key
    const openaiClient = createOpenAIClient()

    const systemPrompt = createSystemPrompt(messages, tags)
    const aiMessages = convertMessagesToAIFormat(messages)

    const result = streamText({
      model: openaiClient("gpt-4o"),
      messages: aiMessages,
      system: systemPrompt,
      onChunk: ({ chunk }) => {
        if (chunk.type === "text-delta") {
          onChunk(chunk.text)
        }
      },
    })

    result.text.then((fullText) => {
      onFinish(fullText)
    })
  } catch (error) {
    console.error("Error streaming AI response:", error)

    let errorMessage = "I'm having trouble processing that right now. Please try again."

    if (error instanceof Error) {
      if (error.message.includes("API key is missing")) {
        errorMessage = "⚠️ OpenAI API key is missing. Please add your OPENAI_API_KEY to your environment variables."
      } else if (error.message.includes("Invalid OpenAI API key format")) {
        errorMessage = "⚠️ Invalid OpenAI API key format. Please check your environment variables."
      } else if (error.message.includes("Incorrect API key provided")) {
        errorMessage = "⚠️ Incorrect API key provided. Please check your OpenAI API key in your environment variables."
      }
    }

    onChunk(errorMessage)
    onFinish(errorMessage)
  }
}

// Generate an analysis of the user's thoughts
export async function generateThoughtAnalysis(
  messages: Message[],
  analysisType: "insights" | "patterns" | "contradictions",
): Promise<string> {
  try {
    // Create OpenAI client with explicit API key
    const openaiClient = createOpenAIClient()

    const userMessages = messages.filter((msg) => msg.role === "user")

    let systemPrompt = `You are FLOAT AI, an assistant integrated into a Personal Knowledge Management system.
You are analyzing the user's thoughts to identify ${analysisType}.`

    // Add specific instructions based on analysis type
    if (analysisType === "insights") {
      systemPrompt += `\n\nIdentify key insights from the user's thoughts. Look for underlying themes, novel ideas, and potential breakthroughs.
Format your response as a JSON array of insight objects with the following structure:
[
  {
    "text": "The insight in a clear, concise sentence",
    "confidence": 85, // A number between 50-100 indicating confidence
    "tags": ["relevant", "tags"],
    "explanation": "A brief explanation of why this is insightful"
  }
]
Provide 3-5 insights based on the available data. IMPORTANT: Return ONLY the raw JSON array without any markdown formatting or code blocks.`
    } else if (analysisType === "patterns") {
      systemPrompt += `\n\nIdentify recurring patterns in the user's thoughts. Look for repeated themes, approaches, or mental models.
Format your response as a JSON array of pattern objects with the following structure:
[
  {
    "summary": "A concise description of the pattern",
    "messages": [
      { "excerpt": "A relevant excerpt from their thoughts" }
    ],
    "tags": ["relevant", "tags"],
    "explanation": "Why this pattern is significant"
  }
]
Provide 2-4 patterns based on the available data. IMPORTANT: Return ONLY the raw JSON array without any markdown formatting or code blocks.`
    } else if (analysisType === "contradictions") {
      systemPrompt += `\n\nIdentify potential contradictions or tensions in the user's thoughts. Look for ideas that might be in conflict.
Format your response as a JSON array of contradiction objects with the following structure:
[
  {
    "summary": "A concise description of the contradiction",
    "statement1": { "text": "The first contradictory statement" },
    "statement2": { "text": "The second contradictory statement" },
    "explanation": "Why these statements might be in tension and how this tension might be productive"
  }
]
Provide 1-3 contradictions based on the available data. If you can't find any real contradictions, return an empty array. IMPORTANT: Return ONLY the raw JSON array without any markdown formatting or code blocks.`
    }

    const { text } = await generateText({
      model: openaiClient("gpt-4o"),
      messages: [
        {
          role: "user",
          content: JSON.stringify(
            userMessages.map((msg) => ({
              content: msg.content,
              tags: msg.tags || [],
            })),
          ),
        },
      ],
      system: systemPrompt,
    })

    return text
  } catch (error) {
    console.error(`Error generating ${analysisType} analysis:`, error)

    if (error instanceof Error) {
      if (
        error.message.includes("API key is missing") ||
        error.message.includes("Invalid OpenAI API key") ||
        error.message.includes("Incorrect API key provided")
      ) {
        return JSON.stringify([
          {
            text: "OpenAI API key issue. Please check your API key configuration.",
            confidence: 100,
            tags: ["error"],
            explanation: "API key configuration issue",
          },
        ])
      }
    }

    return JSON.stringify([])
  }
}
