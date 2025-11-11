import { ObjectId } from 'mongodb'

export type CustomerStatus =
  | 'pending_documents'
  | 'processing'
  | 'ready_for_review'
  | 'escalated'
  | 'awaiting_additional_docs'
  | 'approved'
  | 'rejected'

export type RiskLevel = 'low' | 'medium' | 'high'

export type DocumentType =
  | 'passport'
  | 'drivers_license'
  | 'national_id'
  | 'utility_bill'
  | 'bank_statement'
  | 'lease_agreement'

export interface Customer {
  _id?: ObjectId
  name: string
  email: string
  dateOfBirth?: string
  assignedTo: string
  assignedDate: Date
  status: CustomerStatus
  accountType: string
  source: string
  documents: Document[]
  riskReport?: RiskReport
  communications: Communication[]
  createdAt: Date
  updatedAt: Date
}

export type GenericRecord = Record<string, unknown>

export interface Document {
  type: DocumentType
  fileName: string
  fileUrl: string
  uploadedAt: Date
  extractionStatus?: 'pending' | 'success' | 'failed'
  extractedData?: GenericRecord
}

export interface DocumentVerificationResult {
  status: 'pending' | 'verified' | 'rejected' | 'manual_review'
  confidence?: number
  checks?: string[]
  details?: string
  extractedFields?: GenericRecord
}

export interface ScreeningMatch {
  name?: string
  referenceId?: string
  source: string
  score?: number
  notes?: string
  riskLevel?: RiskLevel
}

export interface AdverseMediaFinding {
  title: string
  summary: string
  url?: string
  publishedAt?: Date
  riskLevel?: RiskLevel
}

export interface RiskReport {
  reportId: string
  generatedAt: Date
  processingTime: number
  customerInfo: {
    extractedName: string
    extractedDOB?: string
    extractedAddress?: {
      street: string
      city: string
      state: string
      zipCode: string
      country: string
    }
    extractedNationality?: string
    documentNumber?: string
    expiryDate?: string
  }
  documentVerification: {
    primaryID: DocumentVerificationResult
    proofOfAddress: DocumentVerificationResult
  }
  consistencyCheck: {
    nameMatch: { status: string; confidence: number; details: string }
    addressMatch: { status: string; confidence: number; details: string }
    overallConsistency: string
  }
  riskAssessment: {
    overallRiskLevel: RiskLevel
    overallRiskScore: number
    confidence: number
    riskFactors: {
      geographicRisk: { score: number; level: RiskLevel; reasoning: string }
      customerProfileRisk: { score: number; level: RiskLevel; reasoning: string; factors: string[] }
      productRisk: { score: number; level: RiskLevel; reasoning: string }
      documentRisk: { score: number; level: RiskLevel; reasoning: string; factors: string[] }
    }
    screeningResults: {
      sanctionsCheck: { status: string; listsChecked: string[]; matches: ScreeningMatch[]; checkedAt: Date }
      pepCheck: { status: string; isPEP: boolean; pepType: string | null; matches: ScreeningMatch[]; checkedAt: Date }
      adverseMediaCheck: { status: string; findingsCount: number; findings: AdverseMediaFinding[]; checkedAt: Date }
      internalBlacklist: { status: string; matches: ScreeningMatch[]; checkedAt: Date }
    }
  }
  aiAnalysis: {
    summary: string
    strengths: string[]
    concerns: string[]
    recommendedAction: 'request_more_documents' | 'escalate_to_senior' | 'low_risk_proceed'
    recommendedDueDiligence: 'SDD' | 'CDD' | 'EDD'
    additionalDocumentsNeeded?: Array<{
      type: string
      reason: string
      examples: string[]
    }>
    escalationTriggers?: string[]
  }
  metadata: {
    adeApiCalls: number
    llmProvider: string
    llmModel: string
    pipelineVersion: string
  }
}

export interface Communication {
  type: 'email_sent' | 'note_added' | 'status_changed'
  to?: string
  subject?: string
  body?: string
  sentAt: Date
  sentBy: string
  status?: 'draft' | 'sent' | 'failed'
}
