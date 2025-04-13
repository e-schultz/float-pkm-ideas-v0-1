# FLOAT AI Integration Guide

This document explains how the AI integration works in the FLOAT PKM system and how to configure it properly.

## AI Features Overview

FLOAT integrates with OpenAI's API to provide several AI-powered features:

1. **Conversational AI**: Responds to user thoughts and helps explore ideas
2. **Thought Analysis**: Identifies insights, patterns, and contradictions
3. **Content Generation**: Assists with developing ideas and concepts

## Configuration

### API Key Setup

FLOAT requires an OpenAI API key to function. The key should be added to your environment variables:

1. Create a `.env.local` file in the project root (or copy from `.env.example`)
2. Add your OpenAI API key:
   \`\`\`
   OPENAI_API_KEY=your_openai_api_key_here
   \`\`\`
3. Restart the development server if it's already running

### Model Configuration

FLOAT uses GPT-4o by default for optimal performance. The model can be configured in `lib/ai-service.ts`:

\`\`\`typescript
const { text } = await generateText({
  model: openaiClient("gpt-4o"), // Change model here if needed
  messages: aiMessages,
  system: systemPrompt,
});
\`\`\`

## AI Service Architecture

The AI integration is primarily handled by the `ai-service.ts` file, which provides several key functions:

### Core Functions

1. **generateAIResponse**: Generates a complete AI response to user input
   - Handles API key validation
   - Creates appropriate system prompts
   - Processes the response

2. **streamAIResponse**: Streams an AI response for real-time display
   - Similar to generateAIResponse but with streaming capability
   - Provides chunks of the response as they're generated

3. **generateThoughtAnalysis**: Analyzes user thoughts for insights
   - Takes an analysis type (insights, patterns, contradictions)
   - Returns structured analysis data

### System Prompts

FLOAT uses carefully crafted system prompts to guide the AI's behavior:

\`\`\`typescript
function createSystemPrompt(messages: Message[], tags: string[] = []) {
  let systemPrompt = `You are FLOAT AI, an assistant integrated into a Personal Knowledge Management system.
Your purpose is to help the user explore their thoughts, identify patterns, and discover insights.
Be thoughtful, nuanced, and help surface connections between ideas.`;

  // Additional context based on tags and message history...
  
  return systemPrompt;
}
\`\`\`

## Error Handling

The AI service includes robust error handling for common issues:

1. **Missing API Key**: Detects and provides clear error messages
2. **Invalid API Key**: Validates key format and provides guidance
3. **API Limits**: Handles rate limiting and quota errors gracefully

## Extending AI Capabilities

To extend the AI capabilities of FLOAT:

1. **Custom Analysis Types**: Add new analysis types in `generateThoughtAnalysis`
2. **Enhanced Prompting**: Modify system prompts for specialized behavior
3. **Additional Models**: Integrate with other AI models or providers

## Security Considerations

- API keys are stored in environment variables, not in code
- User data is processed locally and not stored persistently
- API requests are made server-side to protect the API key

## Troubleshooting

Common issues and solutions:

1. **"OpenAI API key is missing"**: Check your `.env.local` file
2. **Slow responses**: Consider using a faster model or optimizing prompts
3. **Rate limiting errors**: Check your OpenAI usage limits and billing status
