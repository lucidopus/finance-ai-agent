# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

VerifAI is an intelligent KYC automation platform that transforms how banks process customer onboarding documents. The system uses AI to extract data from documents, assess risk, and guide analysts through decisions in minutes instead of hours.

**Key workflow**: Upload documents → AI processing/extraction → Automated screening → Risk assessment → Analyst review → Escalation or document request

## Tech Stack

- **Framework**: Next.js 16 with App Router
- **Language**: TypeScript with strict mode
- **Styling**: Tailwind CSS v4
- **Runtime**: React 19.2.0
- **Database**: MongoDB (connection required via env)
- **AI Services**: LandingAI ADE API for document extraction, Anthropic Claude/OpenAI for risk analysis, LangChain.js/LangGraph for orchestration
- **File Storage**: Local filesystem or cloud storage (Vercel Blob, AWS S3)

## Commands

### Development
```bash
yarn dev              # Start dev server on localhost:3000
yarn build            # Production build
yarn start            # Start production server
yarn lint             # Run ESLint
npx tsc --noEmit      # TypeScript type checking
```

### Environment Setup
Create `.env.local` with:
- LandingAI API key
- MongoDB connection string
- Any additional AI service API keys (Anthropic/OpenAI)

## Code Architecture

### App Router Structure
- Uses Next.js App Router (`app/` directory)
- Root layout: `app/layout.tsx` (includes Geist Sans/Mono fonts)
- Homepage: `app/page.tsx`
- Path alias: `@/*` maps to project root

### Styling System
- Tailwind CSS v4 configured via `postcss.config.mjs`
- Custom font variables: `--font-geist-sans`, `--font-geist-mono`
- Dark mode support via Tailwind's `dark:` prefix

### Key Design Patterns
- Function components with TypeScript
- PascalCase for components, camelCase for variables/functions
- Explicit TypeScript annotations for props and return types
- Try/catch blocks for error handling
- ES6 imports, no semicolons, 2-space indentation

## Database Architecture

- **MongoDB**: Primary data store for customer documents, risk assessments, and analyst actions
- Connection string must be set in environment variables
- Expected collections: customer documents, screening results, risk reports, audit trails

## AI Integration Points

1. **Document Extraction**: LandingAI ADE API processes uploaded documents (passports, utility bills)
2. **Risk Analysis**: LLM-powered risk assessment engine (Claude/GPT)
3. **Agent Orchestration**: LangChain.js/LangGraph coordinates multi-step workflows
4. **Email Generation**: AI generates document request emails to customers

## Development Notes

- **No tests configured yet** - test framework needs to be added
- Project is in early stages (default Next.js starter page still active)
- MongoDB connection is critical for application functionality
- File uploads will need proper storage configuration (local or cloud)
- KYC workflow components need to be built in `app/` directory

## Important Rules

- Never perform `supabase db reset` without explicit user approval (from global CLAUDE.md)
- Always validate documents before processing to prevent injection attacks
- Handle PII (Personally Identifiable Information) with extreme care - proper encryption and access controls
- Ensure audit trails for all analyst decisions (regulatory requirement)
- Sanctions/PEP screening must be thorough and logged


## Your Senior Engineering Manager (SEM)

You have access to a Senior Engineering Manager (SEM) for guidance on complex technical decisions, architectural choices, and challenging problems. The SEM is a strategic resource—use intelligently, not for every question.

### How to Consult the SEM

Initiate a consultation using:
```bash
gemini -p "<Your question or concern>"
```

**Key guidelines for effective SEM consultations**:

1. **Provide Context Efficiently**
   - Reference relevant files using `@filename` syntax so the SEM can review them
   - Explicitly state: "SEM, please provide thoughts/suggestions only—no code modifications needed"
   - Include all related questions in a single prompt to avoid context loss (you cannot follow up in one session)
   - Be specific about what you need: architectural advice, trade-offs analysis, validation, etc.

2. **Think Critically About SEM Suggestions**
   - The SEM provides recommendations and perspectives, not final decisions
   - Evaluate suggestions against your project context, constraints, and goals
   - Question suggestions that don't align with your understanding or the CLAUDE.md principles
   - You are the decision-maker—SEM input is advisory only

3. **Report Back to the User**
   - **Before implementing anything the SEM suggests, summarize their key points to the user**
   - Explain your own analysis: What makes sense? What concerns do you have?
   - Share what you've decided and why (even if disagreeing with SEM)
   - Transparency helps build trust in your decision-making

### When to Consult the SEM (Not Every Question!)

**Definitely consult**:
- Stuck in a loop trying to solve a problem (after exhausting obvious approaches)
- Major architectural decisions with trade-offs (e.g., database design, auth strategy)
- Complex feature design with multiple valid approaches
- Performance or scaling concerns
- Integration strategy for new technologies

**Do NOT consult**:
- Straightforward coding tasks or bug fixes
- Questions answerable by reading documentation
- Simple component implementation
- Basic debugging (only escalate if truly stuck)

**Examples**:
- ✅ "Should we use RAG or fine-tuning for the chatbot? I'm seeing trade-offs in X, Y, Z dimensions. What are your thoughts? @design-principles.md"
- ❌ "How do I import a React component?" (Read docs instead)
- ✅ "I've tried 3 approaches to optimize this query and none work well. Can you review my thinking? @code.ts"
- ❌ "What's the syntax for useState?" (Straightforward—use docs)
