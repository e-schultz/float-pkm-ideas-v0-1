# FLOAT - Fluid Linked Organizational Adaptive Thinking

FLOAT is a personal knowledge management (PKM) system designed to help you capture, organize, and explore your thoughts in a fluid, interconnected way. It combines conversational AI with visual thought mapping to create a dynamic thinking environment.

## Features

- **AI-Powered Conversations**: Engage with an AI assistant that helps you explore and develop your ideas
- **Thought Mapping**: Visualize connections between your thoughts in an interactive map
- **Tagging System**: Organize thoughts with customizable tags for easy retrieval
- **AI Analysis**: Discover insights, patterns, and contradictions in your thinking
- **Search Functionality**: Quickly find specific thoughts across your knowledge base
- **Multiple Thought Spaces**: Create separate spaces for different projects or thinking modes

## Getting Started

### Prerequisites

- Node.js 18.x or higher
- npm or yarn
- An OpenAI API key

### Installation

1. Clone the repository:
   \`\`\`bash
   git clone https://github.com/yourusername/float-pkm.git
   cd float-pkm
   \`\`\`

2. Install dependencies:
   \`\`\`bash
   npm install
   # or
   yarn install
   \`\`\`

3. Set up environment variables:
   - Copy `.env.example` to `.env.local`
   - Add your OpenAI API key to `.env.local`:
     \`\`\`
     OPENAI_API_KEY=your_api_key_here
     \`\`\`

4. Start the development server:
   \`\`\`bash
   npm run dev
   # or
   yarn dev
   \`\`\`

5. Open [http://localhost:3000](http://localhost:3000) in your browser to use FLOAT.

## Documentation

For more detailed information, please refer to the documentation in the `docs/` directory:

- [Architecture Overview](docs/architecture.md)
- [Component Documentation](docs/components.md)
- [AI Integration Guide](docs/ai-integration.md)
- [User Guide](docs/user-guide.md)

## License

This project is licensed under the MIT License - see the LICENSE file for details.
