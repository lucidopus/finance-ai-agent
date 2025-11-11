# ADE (Automated Document Extraction) Pipeline

## Overview

The ADE pipeline uses LandingAI's document extraction API to automatically extract structured data from KYC documents. This document describes the extraction process, troubleshooting, and best practices.

## Architecture

```
Document Upload → ADE API Call → Field Parsing → Validation → Status Update → Customer Workflow Advancement
```

### Key Components

1. **ADE Service** (`lib/services/ade-service.ts`)
   - Handles communication with LandingAI API
   - Parses and normalizes extracted data
   - Validates extraction completeness
   - Optional LLM fallback for low-confidence extractions

2. **Document Processing API** (`app/api/process/[id]/route.ts`)
   - Orchestrates the extraction workflow
   - Updates document and customer status
   - Creates audit trail communications

3. **MongoDB Models** (`lib/models/`)
   - Stores documents, extracted data, and metadata
   - Tracks extraction attempts and errors

## Supported Document Types

### Identity Documents
- **Passport** (`DocumentType.PASSPORT`)
  - Required fields: firstName, lastName, dateOfBirth, documentNumber
  - Optional: nationality, gender, issueDate, expiryDate

- **Driver's License** (`DocumentType.DRIVERS_LICENSE`)
  - Required fields: firstName, lastName, dateOfBirth, documentNumber
  - Optional: address, issueDate, expiryDate

- **National ID** (`DocumentType.NATIONAL_ID`)
  - Required fields: firstName, lastName, dateOfBirth, documentNumber

### Proof of Address Documents
- **Utility Bill** (`DocumentType.UTILITY_BILL`)
  - Required fields: address.street, address.city
  - Optional: address.state, address.postalCode, address.country

- **Bank Statement** (`DocumentType.BANK_STATEMENT`)
  - Required fields: address.street, address.city

- **Lease Agreement** (`DocumentType.LEASE_AGREEMENT`)
  - Required fields: address.street, address.city

## Address Parsing

### Field Normalization

The ADE service uses intelligent field mapping to handle variations in field names:

```typescript
// Examples of synonyms handled automatically:
street_address, address_line_1, residence → street
city, town, municipality, locality → city
state, province, region, prefecture → state
postal_code, zip, zipcode, postcode → postalCode
```

### Data Cleaning

The parser automatically:
- Removes OCR artifacts (excessive whitespace, special characters)
- Validates field formats (postal codes, city/state names)
- Rejects invalid values (single characters, punctuation-only)
- Capitalizes names properly
- Constructs full addresses from components

### Multi-line Addresses

The parser handles multi-line addresses by:
1. Extracting `line1` (primary street address)
2. Extracting `line2` (apartment, suite, unit)
3. Combining them into the `street` field
4. Constructing a `fullAddress` string

Example:
```
Input:
  address_line_1: "100 Market Street"
  address_line_2: "Apt 5B"
  city: "San Francisco"
  state: "CA"
  postal_code: "94102"

Output:
  line1: "100 Market Street"
  line2: "Apt 5B"
  street: "100 Market Street, Apt 5B"
  city: "San Francisco"
  state: "Ca"
  postalCode: "94102"
  fullAddress: "100 Market Street, Apt 5B, San Francisco, Ca 94102"
```

## Extraction Process

### 1. Document Upload

When a document is uploaded:
- File is stored (local filesystem or cloud storage)
- Document record created with status `PENDING`
- Customer status set to `PROCESSING` (if not already)

### 2. ADE Extraction

Triggered by calling `POST /api/process/[documentId]`:

```bash
curl -X POST http://localhost:3000/api/process/[documentId]
```

The API:
1. Updates document status to `EXTRACTING`
2. Calls LandingAI ADE API with document URL
3. Parses the response using field mappings
4. Validates extracted data
5. Updates document with results

### 3. LLM Fallback (Optional)

If enabled via `ENABLE_LLM_FALLBACK=true`, the system automatically falls back to Claude when:
- Fewer than 3 fields extracted
- Confidence score < 0.6

The LLM:
- Reviews the document image
- Extracts structured data
- Merges with partial OCR results
- Returns enhanced extraction

### 4. Status Updates

Based on extraction results:

**Success** (`DocumentStatus.SUCCESS`):
- All required fields extracted
- Confidence score acceptable
- Customer workflow may advance

**Failed** (`DocumentStatus.FAILED`):
- Missing required fields
- Extraction error occurred
- Customer stays in `PROCESSING`

### 5. Customer Workflow Advancement

After each document extraction, the system checks:
1. Are all required documents uploaded?
2. Are all documents in `SUCCESS` status?
3. Do we have one identity doc + one address doc?

If **YES** to all:
- Customer status → `READY_FOR_REVIEW`
- Audit trail communication created
- Analyst notified (future feature)

## Troubleshooting

### Common Issues

#### Issue: City showing as "." or single character

**Cause**: OCR artifact or poor image quality

**Solution**:
- The parser now rejects values < 2 characters
- Re-upload with better image quality
- Check if LLM fallback is enabled

#### Issue: State showing as "TE" (invalid abbreviation)

**Cause**: OCR misread text

**Solution**:
- Current version capitalizes but doesn't validate state codes
- Consider adding state validation lookup table
- Use LLM fallback for correction

#### Issue: Nested `value.raw_text` not captured

**Cause**: ADE API returns nested structures

**Solution**:
- Parser now recursively extracts from nested objects
- Checks `raw_text`, `text`, and other string fields
- See `extractTextValue()` function

#### Issue: Missing address fields

**Cause**: Document type not optimized for address extraction

**Solution**:
- Ensure using address document type (utility bill, bank statement, lease)
- Check document has clear, visible address
- Review validation warnings in dashboard
- Enable LLM fallback

### Debugging

#### Enable Detailed Logging

The service logs extraction summaries:
```
[ADE] Extracting data from utility_bill document: https://...
[ADE] Extraction completed successfully
[ADE] Extracted 8 fields with confidence 0.87
```

For more details, check:
- Document `rawData` field (stores original ADE response)
- Document `extractionError` field (validation warnings)
- Communications log (audit trail)

#### Test Parser Locally

Run unit tests:
```bash
yarn test __tests__/lib/services/ade-service.test.ts
```

#### Inspect Raw ADE Response

Add to your document processing:
```typescript
console.log('Raw ADE response:', JSON.stringify(adeResponse, null, 2))
```

## Configuration

### Environment Variables

```bash
# Required
MONGODB_URI=mongodb://localhost:27017/finance-ai-agent
LANDING_AI_API_KEY=your_landing_ai_key

# Optional - LLM Fallback
ENABLE_LLM_FALLBACK=true
ANTHROPIC_API_KEY=your_anthropic_key
```

### Extraction Thresholds

Modify in `lib/services/ade-service.ts`:

```typescript
// Trigger LLM fallback when:
const MIN_FIELDS = 3          // Fewer than N fields extracted
const MIN_CONFIDENCE = 0.6    // Confidence below threshold

// Validation warnings:
const LOW_CONFIDENCE = 0.5    // Warn if below this
```

## Best Practices

### Document Quality

For best extraction results:
- **Resolution**: 300 DPI minimum
- **Format**: JPEG or PNG (not PDF scans if avoidable)
- **Lighting**: Even, no shadows
- **Orientation**: Upright, not rotated
- **Completeness**: All edges visible, no cutoffs

### Error Handling

- Always check `validation.missingFields` before marking success
- Log extraction attempts for debugging
- Surface actionable errors to users via dashboard
- Implement retry limits (currently: unlimited)

### Performance

- ADE API timeout: 30 seconds
- Consider batch processing for multiple documents
- Cache document URLs to avoid re-uploads

## API Reference

### Extract Data

```typescript
import { extractDataFromDocument } from '@/lib/services/ade-service'

const extracted = await extractDataFromDocument(
  fileUrl: string,
  documentType: DocumentType
)
```

### Parse Address

```typescript
import { parseAddressData } from '@/lib/services/ade-service'

const address = parseAddressData(
  predictions: ADEResponse['predictions'],
  documentType: DocumentType
)
```

### Validate Extraction

```typescript
import { validateExtraction } from '@/lib/services/ade-service'

const validation = validateExtraction(
  extracted: ExtractedData,
  documentType: DocumentType
)
// Returns: { isValid, missingFields, warnings }
```

## Future Enhancements

1. **State/Province Validation**: Add lookup tables for valid codes
2. **International Address Support**: Better handling of non-US formats
3. **Document Quality Check**: Pre-validate image quality before extraction
4. **Smart Retry**: Automatically retry with different preprocessing
5. **Human Review Queue**: Flag low-confidence extractions for manual review
6. **Extraction Analytics**: Track success rates by document type
7. **Template Learning**: Improve parsing for frequently-seen templates

## Related Documentation

- [Phase 6 Implementation](./phases.md#phase-6)
- [Customer Workflow](./kyc.md) *(future)*
- [API Documentation](./api.md) *(future)*
