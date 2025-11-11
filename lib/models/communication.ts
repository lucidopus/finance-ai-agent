import mongoose, { Schema, Document, Model } from 'mongoose'
import { CommunicationType } from '@/lib/constants/statuses'

// Communication/audit trail schema interface
export interface ICommunication extends Document {
  customerId: mongoose.Types.ObjectId
  type: CommunicationType
  subject: string
  message: string
  createdBy: string
  metadata?: Record<string, any>
  createdAt: Date
}

const CommunicationSchema = new Schema<ICommunication>({
  customerId: {
    type: Schema.Types.ObjectId,
    ref: 'Customer',
    required: true,
    index: true
  },
  type: {
    type: String,
    enum: Object.values(CommunicationType),
    required: true,
    index: true
  },
  subject: { type: String, required: true },
  message: { type: String, required: true },
  createdBy: { type: String, required: true },
  metadata: { type: Schema.Types.Mixed },
  createdAt: { type: Date, default: Date.now }
}, {
  timestamps: { createdAt: 'createdAt', updatedAt: false }
})

// Indexes for efficient queries
CommunicationSchema.index({ customerId: 1, createdAt: -1 })
CommunicationSchema.index({ type: 1, createdAt: -1 })

// Model export with singleton pattern for Next.js hot reloading
export const CommunicationModel: Model<ICommunication> =
  mongoose.models.Communication || mongoose.model<ICommunication>('Communication', CommunicationSchema)
