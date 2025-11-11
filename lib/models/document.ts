import mongoose, { Schema, Document as MongoDocument, Model } from 'mongoose'
import { DocumentStatus, DocumentType } from '@/lib/constants/statuses'

// Address structure from ADE extraction
export interface ParsedAddress {
  street?: string
  city?: string
  state?: string
  postalCode?: string
  country?: string
  fullAddress?: string
  line1?: string
  line2?: string
}

// Extracted data from ADE
export interface ExtractedData {
  // Identity fields
  firstName?: string
  lastName?: string
  middleName?: string
  dateOfBirth?: string
  nationality?: string
  gender?: string

  // Document fields
  documentNumber?: string
  issueDate?: string
  expiryDate?: string
  issuingAuthority?: string

  // Address fields
  address?: ParsedAddress

  // Document metadata
  documentType: DocumentType
  confidence?: number
  rawData?: Record<string, any>
}

// Document schema interface
export interface IDocument extends MongoDocument {
  customerId: mongoose.Types.ObjectId
  fileName: string
  fileUrl: string
  fileSize: number
  mimeType: string
  documentType: DocumentType
  status: DocumentStatus
  extractedData?: ExtractedData
  extractionError?: string
  extractionAttempts: number
  lastExtractionAt?: Date
  uploadedAt: Date
  updatedAt: Date
}

const AddressSchema = new Schema<ParsedAddress>({
  street: { type: String },
  city: { type: String },
  state: { type: String },
  postalCode: { type: String },
  country: { type: String },
  fullAddress: { type: String },
  line1: { type: String },
  line2: { type: String }
}, { _id: false })

const ExtractedDataSchema = new Schema<ExtractedData>({
  firstName: { type: String },
  lastName: { type: String },
  middleName: { type: String },
  dateOfBirth: { type: String },
  nationality: { type: String },
  gender: { type: String },
  documentNumber: { type: String },
  issueDate: { type: String },
  expiryDate: { type: String },
  issuingAuthority: { type: String },
  address: { type: AddressSchema },
  documentType: {
    type: String,
    enum: Object.values(DocumentType),
    required: true
  },
  confidence: { type: Number, min: 0, max: 1 },
  rawData: { type: Schema.Types.Mixed }
}, { _id: false })

const DocumentSchema = new Schema<IDocument>({
  customerId: {
    type: Schema.Types.ObjectId,
    ref: 'Customer',
    required: true,
    index: true
  },
  fileName: { type: String, required: true },
  fileUrl: { type: String, required: true },
  fileSize: { type: Number, required: true },
  mimeType: { type: String, required: true },
  documentType: {
    type: String,
    enum: Object.values(DocumentType),
    required: true
  },
  status: {
    type: String,
    enum: Object.values(DocumentStatus),
    default: DocumentStatus.PENDING,
    index: true
  },
  extractedData: { type: ExtractedDataSchema },
  extractionError: { type: String },
  extractionAttempts: { type: Number, default: 0 },
  lastExtractionAt: { type: Date },
  uploadedAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, {
  timestamps: { createdAt: 'uploadedAt', updatedAt: 'updatedAt' }
})

// Indexes for efficient queries
DocumentSchema.index({ customerId: 1, status: 1 })
DocumentSchema.index({ customerId: 1, documentType: 1 })

// Model export with singleton pattern for Next.js hot reloading
export const DocumentModel: Model<IDocument> =
  mongoose.models.Document || mongoose.model<IDocument>('Document', DocumentSchema)
