# FLOAT Architecture Overview

This document provides an overview of the FLOAT PKM system architecture, explaining how the different components work together.

## System Architecture

FLOAT is built using Next.js with the App Router, providing a modern React framework with server-side rendering capabilities. The application follows a component-based architecture with clear separation of concerns.

### Key Architectural Components

1. **Frontend Interface**
   - React components for UI rendering
   - Client-side state management for user interactions
   - Responsive design for different device sizes

2. **AI Integration Layer**
   - OpenAI API integration for conversational AI
   - AI analysis services for pattern recognition
   - Streaming response handling for real-time interactions

3. **Data Management**
   - In-memory state management for the current session
   - (Future) Persistent storage for long-term knowledge retention

## Directory Structure

\`\`\`
float-pkm/
├── app/                  # Next.js app directory
│   ├── api/              # API routes for AI integration
│   │   └── ai/           # AI-related endpoints
│   ├── page.tsx          # Main application page
│   └── layout.tsx        # Root layout with theme provider
├── components/           # React components
│   ├── float-interface.tsx  # Main interface component
│   ├── message-list.tsx     # Message display component
│   ├── thought-map.tsx      # Visual thought map
│   └── ai-analysis-panel.tsx # AI analysis component
├── lib/                  # Utility functions and services
│   └── ai-service.ts     # AI integration service
└── public/               # Static assets
\`\`\`

## Data Flow

1. **User Input Flow**
   - User enters a thought in the message input
   - Thought is tagged and submitted
   - Thought is added to the message list and thought map
   - AI service processes the thought

2. **AI Response Flow**
   - AI service sends request to OpenAI API
   - Response is streamed back to the client
   - Response is displayed in the message list
   - Thought map is updated with the new connection

3. **Analysis Flow**
   - User requests analysis of their thoughts
   - AI service processes all thoughts to identify patterns
   - Analysis results are displayed in the analysis panel

## Technology Stack

- **Frontend**: React, Next.js, Tailwind CSS, shadcn/ui
- **AI**: OpenAI API, AI SDK
- **State Management**: React useState/useContext
- **API Routes**: Next.js API routes with Edge runtime

## Future Architecture Considerations

- Database integration for persistent storage
- User authentication and multi-user support
- Export/import functionality for knowledge portability
- Plugin system for extensibility
