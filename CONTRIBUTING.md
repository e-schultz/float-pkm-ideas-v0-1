# Contributing to FLOAT

Thank you for considering contributing to FLOAT! This document provides guidelines and instructions for contributing to the project.

## Code of Conduct

By participating in this project, you agree to abide by our Code of Conduct. Please read it before contributing.

## How Can I Contribute?

### Reporting Bugs

- Check if the bug has already been reported in the Issues section
- Use the bug report template to create a new issue
- Include detailed steps to reproduce the bug
- Include screenshots if applicable
- Describe the expected behavior and what actually happened

### Suggesting Features

- Check if the feature has already been suggested in the Issues section
- Use the feature request template to create a new issue
- Describe the feature in detail and why it would be valuable
- Include mockups or examples if possible

### Pull Requests

1. Fork the repository
2. Create a new branch for your feature or bugfix
3. Make your changes
4. Run tests to ensure your changes don't break existing functionality
5. Submit a pull request with a clear description of the changes

## Development Setup

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
   - Add your OpenAI API key to `.env.local`

4. Start the development server:
   \`\`\`bash
   npm run dev
   # or
   yarn dev
   \`\`\`

## Coding Guidelines

- Follow the existing code style and formatting
- Write clear, descriptive commit messages
- Add comments for complex logic
- Update documentation for any changed functionality
- Write tests for new features

## Project Structure

Please familiarize yourself with the project structure before contributing:

\`\`\`
float-pkm/
├── app/                  # Next.js app directory
├── components/           # React components
├── lib/                  # Utility functions
├── docs/                 # Documentation
└── public/               # Static assets
\`\`\`

## Testing

Before submitting a pull request, please test your changes:

1. Run the development server and test the functionality manually
2. Ensure the application works on different browsers and screen sizes
3. Check for any console errors or warnings

## Documentation

If your changes affect how users interact with the application, please update the relevant documentation in the `docs/` directory.

## Questions?

If you have any questions about contributing, please open an issue with your question.

Thank you for contributing to FLOAT!
