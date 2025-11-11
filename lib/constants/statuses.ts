// Customer workflow statuses
export enum CustomerStatus {
  // Initial state when documents are being uploaded
  UPLOADED = 'uploaded',

  // Document extraction in progress via ADE
  PROCESSING = 'processing',

  // Both required documents successfully extracted
  READY_FOR_REVIEW = 'ready_for_review',

  // Automated screening in progress (sanctions/PEP)
  SCREENING = 'screening',

  // Screening complete, risk assessment needed
  RISK_ASSESSMENT = 'risk_assessment',

  // Awaiting analyst review
  ANALYST_REVIEW = 'analyst_review',

  // Customer approved
  APPROVED = 'approved',

  // Customer rejected
  REJECTED = 'rejected',

  // More information/documents needed
  MORE_INFO_NEEDED = 'more_info_needed'
}

// Document extraction statuses
export enum DocumentStatus {
  // Document uploaded, pending extraction
  PENDING = 'pending',

  // ADE extraction in progress
  EXTRACTING = 'extracting',

  // Extraction completed successfully
  SUCCESS = 'success',

  // Extraction failed
  FAILED = 'failed'
}

// Document types for KYC
export enum DocumentType {
  PASSPORT = 'passport',
  DRIVERS_LICENSE = 'drivers_license',
  NATIONAL_ID = 'national_id',
  UTILITY_BILL = 'utility_bill',
  BANK_STATEMENT = 'bank_statement',
  LEASE_AGREEMENT = 'lease_agreement',
  TAX_DOCUMENT = 'tax_document'
}

// Communication types for audit trail
export enum CommunicationType {
  DOCUMENT_VERIFIED = 'document_verified',
  DOCUMENT_REQUESTED = 'document_requested',
  STATUS_CHANGED = 'status_changed',
  RISK_FLAGGED = 'risk_flagged',
  ANALYST_NOTE = 'analyst_note',
  SYSTEM_NOTE = 'system_note'
}

// Required document combinations per customer type
export const REQUIRED_DOCUMENTS = {
  INDIVIDUAL: [
    { type: DocumentType.PASSPORT, alternatives: [DocumentType.DRIVERS_LICENSE, DocumentType.NATIONAL_ID] },
    { type: DocumentType.UTILITY_BILL, alternatives: [DocumentType.BANK_STATEMENT, DocumentType.LEASE_AGREEMENT] }
  ]
}
