'use client'

import { use, useEffect, useState } from 'react'
import { format } from 'date-fns'

interface Customer {
  _id: string
  firstName?: string
  lastName?: string
  email?: string
  status: string
  createdAt: string
  statusHistory: Array<{
    status: string
    changedAt: string
    changedBy: string
    reason?: string
  }>
}

interface Document {
  _id: string
  fileName: string
  fileUrl: string
  documentType: string
  status: string
  extractedData?: any
  extractionError?: string
  uploadedAt: string
}

interface Communication {
  _id: string
  type: string
  subject: string
  message: string
  createdBy: string
  createdAt: string
}

interface CustomerData {
  customer: Customer
  documents: Document[]
  communications: Communication[]
}

export default function CustomerDetailPage({
  params
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const [data, setData] = useState<CustomerData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchCustomerData()
  }, [id])

  async function fetchCustomerData() {
    try {
      setLoading(true)
      const response = await fetch(`/api/customers/${id}`)

      if (!response.ok) {
        throw new Error('Failed to fetch customer data')
      }

      const data = await response.json()
      setData(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center py-12">
            <div className="text-gray-600">Loading customer data...</div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-6xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <h2 className="text-red-800 font-semibold mb-2">Error</h2>
            <p className="text-red-600">{error || 'Customer not found'}</p>
          </div>
        </div>
      </div>
    )
  }

  const { customer, documents, communications } = data

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white rounded-lg shadow p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {customer.firstName} {customer.lastName}
          </h1>
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <span>{customer.email}</span>
            <span>•</span>
            <span>ID: {customer._id}</span>
          </div>
        </div>

        {/* Status */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Current Status
          </h2>
          <div className="flex items-center gap-3">
            <StatusBadge status={customer.status} />
            <span className="text-sm text-gray-500">
              Since {format(new Date(customer.createdAt), 'MMM d, yyyy h:mm a')}
            </span>
          </div>
        </div>

        {/* Documents */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Documents ({documents.length})
          </h2>
          <div className="space-y-3">
            {documents.length === 0 ? (
              <p className="text-gray-500 text-sm">No documents uploaded yet</p>
            ) : (
              documents.map(doc => (
                <DocumentCard key={doc._id} document={doc} />
              ))
            )}
          </div>
        </div>

        {/* Communications */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Activity Log ({communications.length})
          </h2>
          <div className="space-y-3">
            {communications.length === 0 ? (
              <p className="text-gray-500 text-sm">No activity yet</p>
            ) : (
              communications.map(comm => (
                <CommunicationCard key={comm._id} communication={comm} />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    uploaded: 'bg-gray-100 text-gray-800',
    processing: 'bg-blue-100 text-blue-800',
    ready_for_review: 'bg-green-100 text-green-800',
    screening: 'bg-yellow-100 text-yellow-800',
    approved: 'bg-green-100 text-green-800',
    rejected: 'bg-red-100 text-red-800',
    more_info_needed: 'bg-orange-100 text-orange-800'
  }

  const label = status.replace(/_/g, ' ').toUpperCase()
  const colorClass = colors[status] || 'bg-gray-100 text-gray-800'

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${colorClass}`}>
      {label}
    </span>
  )
}

function DocumentCard({ document }: { document: Document }) {
  const statusColors: Record<string, string> = {
    pending: 'bg-gray-100 text-gray-700',
    extracting: 'bg-blue-100 text-blue-700',
    success: 'bg-green-100 text-green-700',
    failed: 'bg-red-100 text-red-700'
  }

  const hasError = document.status === 'failed'
  const hasWarning = document.extractionError && document.status === 'success'

  return (
    <div className="border border-gray-200 rounded-lg p-4">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-medium text-gray-900">{document.fileName}</h3>
            <span className={`px-2 py-0.5 rounded text-xs font-medium ${statusColors[document.status]}`}>
              {document.status}
            </span>
          </div>
          <p className="text-sm text-gray-500">
            {document.documentType.replace(/_/g, ' ')} •
            Uploaded {format(new Date(document.uploadedAt), 'MMM d, yyyy')}
          </p>
        </div>
      </div>

      {/* Error/Warning Messages */}
      {hasError && (
        <div className="bg-red-50 border border-red-200 rounded p-3 mb-3">
          <p className="text-sm font-medium text-red-800 mb-1">
            Extraction Failed
          </p>
          <p className="text-sm text-red-600">
            {document.extractionError || 'Unknown error occurred during extraction'}
          </p>
          <p className="text-xs text-red-500 mt-2">
            💡 Try uploading a clearer image with better lighting and all text visible
          </p>
        </div>
      )}

      {hasWarning && (
        <div className="bg-yellow-50 border border-yellow-200 rounded p-3 mb-3">
          <p className="text-sm font-medium text-yellow-800 mb-1">
            Extraction Warning
          </p>
          <p className="text-sm text-yellow-600">{document.extractionError}</p>
        </div>
      )}

      {/* Extracted Data */}
      {document.extractedData && document.status === 'success' && (
        <div className="bg-gray-50 rounded p-3">
          <p className="text-xs font-semibold text-gray-700 mb-2">
            Extracted Information
          </p>
          <div className="grid grid-cols-2 gap-2 text-xs">
            {document.extractedData.firstName && (
              <div>
                <span className="text-gray-500">First Name:</span>{' '}
                <span className="text-gray-900">{document.extractedData.firstName}</span>
              </div>
            )}
            {document.extractedData.lastName && (
              <div>
                <span className="text-gray-500">Last Name:</span>{' '}
                <span className="text-gray-900">{document.extractedData.lastName}</span>
              </div>
            )}
            {document.extractedData.dateOfBirth && (
              <div>
                <span className="text-gray-500">Date of Birth:</span>{' '}
                <span className="text-gray-900">{document.extractedData.dateOfBirth}</span>
              </div>
            )}
            {document.extractedData.address && (
              <div className="col-span-2">
                <span className="text-gray-500">Address:</span>{' '}
                <span className="text-gray-900">
                  {document.extractedData.address.fullAddress ||
                   `${document.extractedData.address.street || ''}, ${document.extractedData.address.city || ''}, ${document.extractedData.address.state || ''} ${document.extractedData.address.postalCode || ''}`}
                </span>
              </div>
            )}
            {document.extractedData.confidence !== undefined && (
              <div className="col-span-2">
                <span className="text-gray-500">Confidence:</span>{' '}
                <span className="text-gray-900">
                  {(document.extractedData.confidence * 100).toFixed(1)}%
                </span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

function CommunicationCard({ communication }: { communication: Communication }) {
  const typeColors: Record<string, string> = {
    document_verified: 'bg-green-100 text-green-700',
    document_requested: 'bg-blue-100 text-blue-700',
    status_changed: 'bg-gray-100 text-gray-700',
    risk_flagged: 'bg-red-100 text-red-700',
    analyst_note: 'bg-purple-100 text-purple-700',
    system_note: 'bg-gray-100 text-gray-700'
  }

  return (
    <div className="border-l-4 border-gray-300 pl-4 py-2">
      <div className="flex items-start justify-between mb-1">
        <div className="flex items-center gap-2">
          <span className={`px-2 py-0.5 rounded text-xs font-medium ${typeColors[communication.type]}`}>
            {communication.type.replace(/_/g, ' ')}
          </span>
          <span className="text-sm font-medium text-gray-900">
            {communication.subject}
          </span>
        </div>
        <span className="text-xs text-gray-500">
          {format(new Date(communication.createdAt), 'MMM d, h:mm a')}
        </span>
      </div>
      <p className="text-sm text-gray-600 mb-1">{communication.message}</p>
      <p className="text-xs text-gray-500">by {communication.createdBy}</p>
    </div>
  )
}
