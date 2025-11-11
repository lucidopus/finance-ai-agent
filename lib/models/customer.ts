import mongoose, { Schema, Document, Model } from 'mongoose'
import { CustomerStatus } from '@/lib/constants/statuses'

// Risk assessment result
export interface RiskAssessment {
  overallRisk: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
  riskScore: number
  factors: string[]
  recommendations: string[]
  assessedAt: Date
  assessedBy: 'SYSTEM' | string
}

// Screening result (sanctions, PEP, watchlists)
export interface ScreeningResult {
  isPEP: boolean
  isSanctioned: boolean
  watchlistMatches: string[]
  screenedAt: Date
  screeningProvider?: string
  rawResults?: Record<string, any>
}

// Customer schema interface
export interface ICustomer extends Document {
  // Personal information (extracted from documents)
  firstName?: string
  lastName?: string
  dateOfBirth?: string
  nationality?: string
  email?: string
  phone?: string

  // Current workflow status
  status: CustomerStatus
  statusHistory: Array<{
    status: CustomerStatus
    changedAt: Date
    changedBy: string
    reason?: string
  }>

  // Documents tracking
  requiredDocuments: string[]
  uploadedDocuments: mongoose.Types.ObjectId[]

  // Risk and screening
  riskAssessment?: RiskAssessment
  screeningResult?: ScreeningResult

  // Analyst assignment
  assignedAnalyst?: string
  lastReviewedAt?: Date

  // Timestamps
  createdAt: Date
  updatedAt: Date
}

const RiskAssessmentSchema = new Schema<RiskAssessment>({
  overallRisk: {
    type: String,
    enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'],
    required: true
  },
  riskScore: { type: Number, required: true, min: 0, max: 100 },
  factors: [{ type: String }],
  recommendations: [{ type: String }],
  assessedAt: { type: Date, required: true },
  assessedBy: { type: String, required: true }
}, { _id: false })

const ScreeningResultSchema = new Schema<ScreeningResult>({
  isPEP: { type: Boolean, required: true },
  isSanctioned: { type: Boolean, required: true },
  watchlistMatches: [{ type: String }],
  screenedAt: { type: Date, required: true },
  screeningProvider: { type: String },
  rawResults: { type: Schema.Types.Mixed }
}, { _id: false })

const CustomerSchema = new Schema<ICustomer>({
  firstName: { type: String },
  lastName: { type: String },
  dateOfBirth: { type: String },
  nationality: { type: String },
  email: { type: String, index: true },
  phone: { type: String },
  status: {
    type: String,
    enum: Object.values(CustomerStatus),
    default: CustomerStatus.UPLOADED,
    index: true
  },
  statusHistory: [{
    status: {
      type: String,
      enum: Object.values(CustomerStatus),
      required: true
    },
    changedAt: { type: Date, required: true },
    changedBy: { type: String, required: true },
    reason: { type: String }
  }],
  requiredDocuments: [{ type: String }],
  uploadedDocuments: [{
    type: Schema.Types.ObjectId,
    ref: 'Document'
  }],
  riskAssessment: { type: RiskAssessmentSchema },
  screeningResult: { type: ScreeningResultSchema },
  assignedAnalyst: { type: String },
  lastReviewedAt: { type: Date },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, {
  timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' }
})

// Indexes for efficient queries
CustomerSchema.index({ status: 1, createdAt: -1 })
CustomerSchema.index({ assignedAnalyst: 1, status: 1 })
CustomerSchema.index({ email: 1 })

// Model export with singleton pattern for Next.js hot reloading
export const CustomerModel: Model<ICustomer> =
  mongoose.models.Customer || mongoose.model<ICustomer>('Customer', CustomerSchema)
