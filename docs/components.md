# FLOAT Component Documentation

This document provides detailed information about the key components in the FLOAT PKM system.

## Core Components

### FloatInterface

The main container component that orchestrates the entire application.

**Location**: `components/float-interface.tsx`

**Responsibilities**:
- Manages the overall application state
- Coordinates communication between components
- Handles message creation and AI responses
- Controls the active tab and panel visibility

**Key Props and State**:
- `messages`: Array of all thoughts and AI responses
- `tags`: Available tags for categorization
- `activeTab`: Currently active tab (chat or map)
- `showAIPanel`: Whether the AI analysis panel is visible

### MessageList

Displays the conversation between the user and the AI assistant.

**Location**: `components/message-list.tsx`

**Responsibilities**:
- Renders user thoughts and AI responses
- Displays typing indicators during AI response generation
- Auto-scrolls to the latest message

**Key Props**:
- `messages`: Array of messages to display
- `isAITyping`: Boolean indicating if AI is currently responding
- `aiTypingContent`: Partial content of the AI's response while typing

### ThoughtMap

Visualizes thoughts and their connections in an interactive map.

**Location**: `components/thought-map.tsx`

**Responsibilities**:
- Creates a visual representation of thoughts
- Allows zooming, panning, and filtering
- Shows connections between related thoughts

**Key Props**:
- `messages`: Array of messages to visualize
- `activeTag`: Optional tag to filter by

### AIAnalysisPanel

Provides AI-generated analysis of the user's thoughts.

**Location**: `components/ai-analysis-panel.tsx`

**Responsibilities**:
- Requests and displays AI analysis of thoughts
- Shows insights, patterns, and contradictions
- Allows users to explore analysis results

**Key Props**:
- `messages`: Array of messages to analyze
- `onInsightSelect`: Callback when an insight is selected

## Supporting Components

### AIMessageInput

Input component for entering thoughts and receiving AI responses.

**Location**: `components/ai-message-input.tsx`

**Key Features**:
- Text input with auto-resizing
- Tag selection and creation
- AI response handling and cancellation

### TagSelector

Component for selecting and creating tags.

**Location**: `components/tag-selector.tsx`

**Key Features**:
- Tag selection from existing tags
- Creation of new tags
- Visual display of selected tags

### SearchDialog

Dialog for searching through thoughts.

**Location**: `components/search-dialog.tsx`

**Key Features**:
- Text search functionality
- Tag filtering
- Result navigation

### FloatSidebar

Navigation sidebar for the application.

**Location**: `components/float-sidebar.tsx`

**Key Features**:
- Thought space navigation
- Time-based filtering
- Tag filtering

## UI Components

FLOAT uses shadcn/ui components for consistent styling and behavior:

- `Button`: For interactive buttons
- `Card`: For content containers
- `Dialog`: For modal dialogs
- `Tabs`: For tabbed interfaces
- `Badge`: For tag display
- `Sidebar`: For navigation sidebar
- `ResizablePanel`: For resizable interface sections

## Component Interactions

1. **User Input Flow**:
   - `AIMessageInput` → `FloatInterface` → `MessageList` & `ThoughtMap`

2. **AI Response Flow**:
   - `FloatInterface` → `ai-service.ts` → `AIMessageInput` → `MessageList`

3. **Analysis Flow**:
   - `AIAnalysisPanel` → `ai-service.ts` → `AIAnalysisPanel` (display results)

4. **Search Flow**:
   - `SearchDialog` → `FloatInterface` → `MessageList` (scroll to result)
