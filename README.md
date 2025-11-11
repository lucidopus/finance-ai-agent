# Finance AI Agent

An intelligent KYC automation platform that transforms how banks process customer onboarding documents. This system uses AI to extract data, assess risk, and guide analysts through decisions in minutes instead of hours.

## The Core Problem

Banks are drowning in manual KYC work:

- **Time-consuming**: Each customer onboarding takes 2+ hours of manual document review
- **Error-prone**: Human analysts miss details when processing dozens of documents daily
- **Expensive**: Banks spend millions on compliance teams doing repetitive work
- **Slow customer experience**: New customers wait days for account approval
- **Regulatory pressure**: Banks face heavy fines for KYC failures

## How It Works

The platform provides a complete workflow tool for KYC analysts.

1.  **Upload Documents**: Analysts upload customer documents (passports, utility bills, etc.).
2.  **AI-Powered Processing**: The system uses AI to extract data, validate documents, and check for consistency.
3.  **Automated Screening**: The platform screens customers against sanctions lists, PEP databases, and adverse media.
4.  **Risk Assessment**: An AI-powered engine generates a comprehensive risk report with a clear recommendation.
5.  **Analyst Review**: Analysts review the reports and can either escalate for approval or request more documents with an AI-generated email.

## Technical Stack

-   **Frontend**: Next.js 15 + TypeScript + React
-   **Styling**: Tailwind CSS + shadcn/ui components
-   **Backend**: Next.js API Routes (serverless functions)
-   **Database**: MongoDB
-   **AI Services**:
    -   LandingAI ADE API for document extraction
    -   Anthropic Claude or OpenAI GPT for risk analysis
    -   LangChain.js/LangGraph for agent orchestration
-   **File Storage**: Local filesystem or cloud storage (Vercel Blob, AWS S3)

## Getting Started

**Prerequisites:**

*   Node.js (v18 or higher)
*   Yarn
*   MongoDB instance

**Installation:**

1.  Clone the repository:
    ```bash
    git clone https://github.com/YOUR_USERNAME/finance-ai-agent.git
    ```
2.  Install dependencies:
    ```bash
    yarn install
    ```

**Running the application:**

1.  Set up your environment variables by creating a `.env.local` file. You will need to add your LandingAI API key and MongoDB connection string.
2.  Run the development server:
    ```bash
    yarn dev
    ```
3.  Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.


