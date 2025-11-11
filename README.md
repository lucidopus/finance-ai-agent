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

-   **Frontend**: Next.js 16 + TypeScript + React 19
-   **Styling**: Tailwind CSS v4
-   **Backend**: Next.js API Routes (serverless functions)
-   **Database**: MongoDB with Mongoose ODM
-   **AI Services**:
    -   LandingAI ADE API for document extraction
    -   Anthropic Claude for risk analysis and LLM fallback
    -   LangChain.js/LangGraph for agent orchestration
-   **File Storage**: Local filesystem or cloud storage (Vercel Blob, AWS S3)
-   **Testing**: Jest + ts-jest

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

**Configuration:**

1.  Copy the example environment file:
    ```bash
    cp .env.local.example .env.local
    ```
2.  Edit `.env.local` and add your API keys:
    ```bash
    # Required
    MONGODB_URI=mongodb://localhost:27017/finance-ai-agent
    LANDING_AI_API_KEY=your_landing_ai_key

    # Optional - for LLM fallback
    ENABLE_LLM_FALLBACK=true
    ANTHROPIC_API_KEY=your_anthropic_key
    ```

**Running the application:**

1.  Start MongoDB (if running locally):
    ```bash
    mongod
    ```
2.  Run the development server:
    ```bash
    yarn dev
    ```
3.  Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

**Running tests:**

```bash
yarn test
```

## Phase 6: Document Extraction (Implemented)

Phase 6 implements the core document extraction and workflow automation. Key features:

### Features

- **Automated Document Extraction**: Uses LandingAI ADE API to extract structured data from KYC documents
- **Robust Address Parsing**: Handles multi-line addresses, normalizes data, rejects OCR artifacts
- **LLM Fallback**: Optional Claude fallback for low-confidence extractions
- **Automatic Workflow Advancement**: Customers automatically move to `ready_for_review` when both required documents are successfully extracted
- **Comprehensive Error Handling**: Detailed error messages and validation warnings
- **Dashboard UI**: Customer detail view with document status, extracted data, and activity log

### API Endpoints

```bash
# Create a customer
POST /api/customers
Body: { "email": "customer@example.com", "firstName": "John", "lastName": "Doe" }

# Get customer details
GET /api/customers/[id]

# Process a document (trigger ADE extraction)
POST /api/process/[documentId]

# Get document processing status
GET /api/process/[documentId]
```

### Document Types Supported

**Identity Documents:**
- Passport (`DocumentType.PASSPORT`)
- Driver's License (`DocumentType.DRIVERS_LICENSE`)
- National ID (`DocumentType.NATIONAL_ID`)

**Proof of Address:**
- Utility Bill (`DocumentType.UTILITY_BILL`)
- Bank Statement (`DocumentType.BANK_STATEMENT`)
- Lease Agreement (`DocumentType.LEASE_AGREEMENT`)

### Customer Status Flow

```
UPLOADED → PROCESSING → READY_FOR_REVIEW
```

- **UPLOADED**: Customer created, awaiting document upload
- **PROCESSING**: Documents being extracted via ADE
- **READY_FOR_REVIEW**: Both required documents successfully extracted

### Example Workflow

```bash
# 1. Create customer
curl -X POST http://localhost:3000/api/customers \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com", "firstName": "Jane", "lastName": "Smith"}'

# 2. Upload documents (implementation needed for file upload endpoint)
# - Upload passport
# - Upload utility bill

# 3. Process documents
curl -X POST http://localhost:3000/api/process/[documentId]

# 4. View customer dashboard
# Navigate to: http://localhost:3000/dashboard/customer/[customerId]
```

### Testing

Run unit tests for ADE service:
```bash
yarn test __tests__/lib/services/ade-service.test.ts
```

### Documentation

- **[ADE Documentation](docs/ade.md)**: Detailed guide on document extraction pipeline
- **[Phase Documentation](docs/phases.md)**: Complete workflow phase descriptions

## Project Structure

```
finance-ai-agent/
├── app/
│   ├── api/
│   │   ├── customers/          # Customer CRUD endpoints
│   │   └── process/            # Document processing
│   └── dashboard/
│       └── customer/[id]/      # Customer detail view
├── lib/
│   ├── constants/
│   │   └── statuses.ts         # Status enums and constants
│   ├── db/
│   │   └── mongodb.ts          # MongoDB connection
│   ├── models/
│   │   ├── customer.ts         # Customer schema
│   │   ├── document.ts         # Document schema
│   │   └── communication.ts    # Audit trail schema
│   └── services/
│       └── ade-service.ts      # LandingAI integration
├── __tests__/
│   └── lib/services/           # Unit tests
├── docs/
│   ├── ade.md                  # ADE documentation
│   └── phases.md               # Workflow phases
└── .env.local.example          # Environment variables template
```

## Next Steps (Phase 7+)

- [ ] **Phase 7**: Automated screening (sanctions, PEP, watchlists)
- [ ] **Phase 8**: AI risk assessment with comprehensive reports
- [ ] **Phase 9**: Analyst review dashboard and decision workflow
- [ ] **Phase 10**: Document request emails and escalation logic
- [ ] File upload endpoint implementation
- [ ] Analyst authentication and authorization
- [ ] Email service integration

## Contributing

This project follows strict TypeScript conventions and code style guidelines. See `CLAUDE.md` for detailed development guidelines.

## License

[Add your license here]
