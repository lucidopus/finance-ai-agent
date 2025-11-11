# Agent Guidelines for Finance AI Agent

## Commands
- **Build**: `yarn build` (Next.js production build)
- **Dev**: `yarn dev` (development server on localhost:3000)
- **Lint**: `yarn lint` (ESLint with Next.js rules)
- **Type Check**: `npx tsc --noEmit` (TypeScript strict mode)
- **Test**: No tests configured yet

## Code Style
- **Language**: TypeScript with strict mode enabled
- **Framework**: Next.js 15+ with App Router
- **Imports**: ES6 imports, use path aliases `@/*` for root
- **Components**: Function components with PascalCase names
- **Variables/Functions**: camelCase naming
- **Types**: Explicit TypeScript annotations for props and returns
- **Styling**: Tailwind CSS classes
- **Formatting**: No semicolons, 2-space indentation
- **Error Handling**: Try/catch blocks, proper error types
- **File Structure**: App Router conventions (`app/` directory)



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
- ✅ "Should we use RAG or fine-tuning for the chatbot? I'm seeing trade-offs in X, Y, Z dimensions. What are your thoughts? @PHASE_6_QA_CHATBOT.md @design-principles.md"
- ❌ "How do I import a React component?" (Read docs instead)
- ✅ "I've tried 3 approaches to optimize this query and none work well. Can you review my thinking? @code.ts"
- ❌ "What's the syntax for useState?" (Straightforward—use docs)
