# KYC Workflow Phases

## Overview

The Finance AI Agent processes customer onboarding through distinct phases, each with specific goals and automated decision points. This document describes each phase, success criteria, and state transitions.

## Workflow Diagram

```
Phase 1-5: Document Upload & Customer Creation
                ↓
Phase 6: ADE Extraction & Completeness Check
                ↓
Phase 7: Automated Screening (Sanctions/PEP)
                ↓
Phase 8: AI Risk Assessment
                ↓
Phase 9: Analyst Review & Decision
                ↓
Phase 10: Escalation or Approval
```

---

## Phase 6: ADE Extraction Completeness & Workflow Unlock

**Status**: ✅ **IMPLEMENTED**

### Goal

Automatically extract data from uploaded documents using ADE, validate completeness, and advance customers to the next workflow stage when both required documents are successfully processed.

### Customer Status

**Entry**: `PROCESSING`
**Exit**: `READY_FOR_REVIEW` (when successful) or stay in `PROCESSING` (if incomplete)

### Required Documents

For individual customers:
1. **Identity Document** (one of):
   - Passport
   - Driver's License
   - National ID

2. **Proof of Address** (one of):
   - Utility Bill
   - Bank Statement
   - Lease Agreement

### Process Flow

1. **Document Upload**
   - Customer/agent uploads documents
   - Document status: `PENDING`
   - Customer status: `PROCESSING`

2. **ADE Extraction** (`POST /api/process/[documentId]`)
   - Status: `EXTRACTING`
   - Calls LandingAI ADE API
   - Parses response with field mapping
   - Validates extracted data

3. **Extraction Result**
   - **Success**: All required fields present
     - Document status: `SUCCESS`
     - Extracted data stored
   - **Failed**: Missing required fields or error
     - Document status: `FAILED`
     - Error message stored

4. **Workflow Advancement Check**
   - Runs after each document extraction
   - Checks if all required documents are `SUCCESS`
   - If YES:
     - Customer status → `READY_FOR_REVIEW`
     - Audit trail created
   - If NO:
     - Customer stays in `PROCESSING`

### Success Criteria

✅ Both required documents uploaded and extracted
✅ Identity document has: firstName, lastName, dateOfBirth, documentNumber
✅ Address document has: street, city (+ state or postalCode)
✅ No documents in `FAILED` status
✅ Customer automatically advances to `READY_FOR_REVIEW`
✅ Audit communication created: "Documents verified by ADE"

### Implementation Details

**Files Created:**
- `lib/services/ade-service.ts` - ADE integration with robust parsing
- `app/api/process/[id]/route.ts` - Document processing endpoint
- `lib/models/document.ts` - Document schema
- `lib/models/customer.ts` - Customer schema
- `lib/models/communication.ts` - Audit trail schema
- `lib/constants/statuses.ts` - Status enums

**Key Features:**
- Nested field extraction (handles `value.raw_text`)
- Address normalization and validation
- Multi-line address support
- LLM fallback for low-confidence extractions (optional)
- Detailed error messages for failed extractions
- Automatic customer status advancement

### Testing

**Unit Tests:** `__tests__/lib/services/ade-service.test.ts`

Test cases:
- ✅ Parse complete address from utility bill
- ✅ Handle nested raw_text fields
- ✅ Reject invalid city values (e.g., ".")
- ✅ Clean OCR artifacts
- ✅ Validate extraction completeness
- ✅ Multi-line address parsing

**Manual Testing:**
1. Create customer: `POST /api/customers`
2. Upload passport + utility bill
3. Process both: `POST /api/process/[documentId]`
4. Verify customer status → `READY_FOR_REVIEW`
5. Check dashboard shows extracted data

### Configuration

**Environment Variables:**
```bash
MONGODB_URI=mongodb://localhost:27017/finance-ai-agent
LANDING_AI_API_KEY=your_key_here

# Optional - LLM Fallback
ENABLE_LLM_FALLBACK=true
ANTHROPIC_API_KEY=your_anthropic_key
```

### Dashboard Integration

**Customer Detail View:** `/dashboard/customer/[id]`

Shows:
- Current status badge
- Document list with extraction status
- Extracted data preview
- Error messages with actionable guidance
- Activity log (communications)

**Error Guidance:**
- Failed extraction shows missing fields
- Suggests uploading clearer image
- Displays confidence scores
- Shows warnings for partial extractions

### Known Issues & Limitations

1. **State Validation**: Parser capitalizes but doesn't validate state codes
   - Example: "TE" is accepted (should be rejected)
   - Future: Add state lookup table

2. **International Addresses**: Optimized for US addresses
   - Future: Add format detection for other countries

3. **Retry Strategy**: No automatic retry on failure
   - Future: Implement smart retry with preprocessing

4. **Document Quality**: No pre-validation of image quality
   - Future: Add quality checks before ADE call

### Open Questions

- [ ] Should next status be configurable? (Phase 7 may expect different state)
- [ ] Cost approval for LLM fallback in production?
- [ ] Should we validate state/province codes?
- [ ] Retry limit for failed extractions?

---

## Phase 7: Automated Screening (Sanctions/PEP)

**Status**: ⏳ **PENDING IMPLEMENTATION**

### Goal

Automatically screen customers against sanctions lists, PEP databases, and watchlists. Flag high-risk matches for analyst review.

### Customer Status

**Entry**: `READY_FOR_REVIEW`
**Exit**: `SCREENING` → `SCREENING_COMPLETE`

### Process Flow

1. Trigger screening when customer enters `READY_FOR_REVIEW`
2. Call screening API (e.g., ComplyAdvantage, Dow Jones)
3. Check against:
   - OFAC sanctions lists
   - PEP (Politically Exposed Persons) databases
   - Global watchlists
4. Store screening results
5. Flag matches for analyst review
6. Advance to risk assessment

### Implementation Plan

- Create `lib/services/screening-service.ts`
- Integrate screening API
- Add screening result model
- Automatic trigger on status change
- Dashboard view for screening results

---

## Phase 8: AI Risk Assessment

**Status**: ⏳ **PENDING IMPLEMENTATION**

### Goal

Use AI (Claude/GPT) to analyze extracted data and screening results, generate comprehensive risk report, and assign risk score.

### Customer Status

**Entry**: `SCREENING_COMPLETE`
**Exit**: `RISK_ASSESSMENT` → `ANALYST_REVIEW`

### Process Flow

1. Collect all customer data
2. Run LLM analysis with risk assessment prompt
3. Generate risk score (0-100)
4. Identify risk factors
5. Generate recommendations
6. Store risk report
7. Advance to analyst review

### Implementation Plan

- Create `lib/services/risk-service.ts`
- Design risk assessment prompt
- Integrate Claude API
- Store risk assessments
- Dashboard risk visualization

---

## Phase 9: Analyst Review & Decision

**Status**: ⏳ **PENDING IMPLEMENTATION**

### Goal

Human analyst reviews customer profile, documents, screening results, and risk assessment. Makes final decision: approve, reject, or request more info.

### Customer Status

**Entry**: `ANALYST_REVIEW`
**Exit**: `APPROVED`, `REJECTED`, or `MORE_INFO_NEEDED`

### Process Flow

1. Assign customer to analyst
2. Analyst reviews dashboard
3. Analyst makes decision
4. System records decision in audit trail
5. Advance to final phase

### Implementation Plan

- Analyst assignment system
- Review dashboard with all data
- Decision buttons (approve/reject/request info)
- Audit trail recording
- Analyst notes

---

## Phase 10: Escalation or Document Request

**Status**: ⏳ **PENDING IMPLEMENTATION**

### Goal

Handle edge cases: request additional documents from customer or escalate high-risk cases to senior analysts.

### Customer Status

**Entry**: `MORE_INFO_NEEDED`
**Exit**: Back to `PROCESSING` (after document upload) or `APPROVED`/`REJECTED`

### Process Flow

1. AI generates document request email
2. Email sent to customer
3. Customer uploads additional documents
4. Loop back to Phase 6
5. Or escalate to senior analyst for final decision

### Implementation Plan

- Create `lib/services/email-service.ts`
- AI email generation
- Document request tracking
- Escalation workflow
- Senior analyst dashboard

---

## State Transition Rules

### Automatic Transitions

- `PROCESSING` → `READY_FOR_REVIEW`: When both docs extracted successfully
- `READY_FOR_REVIEW` → `SCREENING`: Automatically trigger screening
- `SCREENING_COMPLETE` → `RISK_ASSESSMENT`: Automatically trigger risk analysis
- `RISK_ASSESSED` → `ANALYST_REVIEW`: Automatically assign to analyst

### Manual Transitions

- `ANALYST_REVIEW` → `APPROVED`: Analyst approves
- `ANALYST_REVIEW` → `REJECTED`: Analyst rejects
- `ANALYST_REVIEW` → `MORE_INFO_NEEDED`: Analyst requests docs
- `MORE_INFO_NEEDED` → `PROCESSING`: Customer uploads new docs

### Failed State Handling

- If any document fails extraction, stay in `PROCESSING`
- If screening API fails, retry up to 3 times
- If risk assessment fails, escalate to manual review
- Log all state transition failures to communications

---

## Audit Trail

All state transitions create audit trail entries via `CommunicationModel`:

```typescript
{
  customerId: ObjectId,
  type: CommunicationType.STATUS_CHANGED,
  subject: "Status changed to READY_FOR_REVIEW",
  message: "All required documents successfully extracted...",
  createdBy: "SYSTEM" | "analyst@example.com",
  metadata: { ... }
}
```

---

## Dashboard Views by Phase

| Phase | View | Key Info |
|-------|------|----------|
| 6 | Document extraction status | Upload progress, errors, extracted fields |
| 7 | Screening results | Sanctions matches, PEP status, watchlists |
| 8 | Risk assessment | Risk score, factors, recommendations |
| 9 | Full customer profile | All data + decision buttons |
| 10 | Document requests | Pending requests, email history |

---

## Phase 6 Testing Checklist

- [x] Create customer via API
- [x] Upload passport document
- [x] Process passport → check extraction
- [x] Upload utility bill
- [x] Process bill → check address parsing
- [x] Verify customer status → `READY_FOR_REVIEW`
- [x] Check audit trail communication created
- [x] Test failed extraction (missing fields)
- [x] Verify customer stays in `PROCESSING`
- [x] Test dashboard displays errors correctly
- [x] Unit tests for parser pass

---

## Next Steps

1. **Phase 7**: Implement screening service
   - Select screening API provider
   - Integrate API calls
   - Store screening results
   - Add dashboard view

2. **Phase 8**: Implement risk assessment
   - Design risk prompt
   - Integrate Claude API
   - Calculate risk scores
   - Display in dashboard

3. **Phase 9**: Build analyst review UI
   - Analyst dashboard
   - Decision workflow
   - Audit trail

4. **Phase 10**: Email generation & escalation
   - Document request emails
   - Escalation logic
   - Senior analyst queue

---

## References

- [ADE Documentation](./ade.md)
- [API Documentation](./api.md) *(future)*
- [Customer Workflow](./kyc.md) *(future)*
