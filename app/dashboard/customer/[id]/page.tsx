'use client'

import { use, useCallback, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { DocumentUpload } from '@/components/ui/document-upload'
import { Progress } from '@/components/ui/progress'
import { FileCheck, Loader2 } from 'lucide-react'
import type { Customer, CustomerStatus, Document, DocumentType, Communication } from '@/lib/types'

type ApiDocument = Omit<Document, 'uploadedAt'> & { uploadedAt?: string }
type ApiCommunication = Omit<Communication, 'sentAt'> & { sentAt?: string }
type CustomerApiResponse = Omit<
  Customer,
  '_id' | 'documents' | 'communications' | 'assignedDate' | 'createdAt' | 'updatedAt'
> & {
  _id: string
  documents?: ApiDocument[]
  communications?: ApiCommunication[]
  assignedDate?: string
  createdAt?: string
  updatedAt?: string
}

const statusColors: Record<CustomerStatus, string> = {
  pending_documents: 'bg-yellow-500/20 text-yellow-200 ring-1 ring-yellow-500/40',
  processing: 'bg-blue-500/20 text-blue-200 ring-1 ring-blue-500/40',
  ready_for_review: 'bg-emerald-500/20 text-emerald-100 ring-1 ring-emerald-500/40',
  escalated: 'bg-purple-500/20 text-purple-100 ring-1 ring-purple-500/40',
  awaiting_additional_docs: 'bg-orange-500/20 text-orange-100 ring-1 ring-orange-500/40',
  approved: 'bg-green-500/20 text-green-100 ring-1 ring-green-500/40',
  rejected: 'bg-red-500/20 text-red-100 ring-1 ring-red-500/40'
}

const statusLabels: Record<CustomerStatus, string> = {
  pending_documents: 'Pending Documents',
  processing: 'Processing',
  ready_for_review: 'Ready for Review',
  escalated: 'Escalated',
  awaiting_additional_docs: 'Awaiting Docs',
  approved: 'Approved',
  rejected: 'Rejected'
}

const formatDate = (value?: string) => {
  if (!value) {
    return 'N/A'
  }

  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? 'N/A' : date.toLocaleDateString()
}

const formatDateTime = (value?: string) => {
  if (!value) {
    return '—'
  }

  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? '—' : date.toLocaleString()
}

export default function CustomerDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: customerId } = use(params)
  const router = useRouter()
  const [customer, setCustomer] = useState<CustomerApiResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
   const [uploading, setUploading] = useState(false)
   const [uploadProgress, setUploadProgress] = useState(0)
   const [uploadStatus, setUploadStatus] = useState<string>('')
   const [primaryIdFile, setPrimaryIdFile] = useState<File | null>(null)
   const [proofOfAddressFile, setProofOfAddressFile] = useState<File | null>(null)
   const [successMessage, setSuccessMessage] = useState<string | null>(null)

  const fetchCustomer = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch(`/api/customers/${customerId}`)
      if (!response.ok) {
        throw new Error('Failed to load customer details')
      }

      const data = await response.json()
      if (!data.customer) {
        throw new Error('Customer not found')
      }

      setCustomer({
        ...data.customer,
        documents: data.customer.documents ?? [],
        communications: data.customer.communications ?? []
      })
    } catch (fetchError) {
      console.error('Error fetching customer:', fetchError)
      setError(fetchError instanceof Error ? fetchError.message : 'Unable to load customer')
    } finally {
      setLoading(false)
    }
  }, [customerId])

  useEffect(() => {
    fetchCustomer()
  }, [fetchCustomer])

  const handleUpload = async (file: File, documentType: DocumentType) => {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('customerId', customerId)
    formData.append('documentType', documentType)

    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData
    })

    if (!response.ok) {
      const errorResponse = await response.json().catch(() => ({}))
      throw new Error(errorResponse.error || 'Failed to upload document')
    }

    return response.json() as Promise<{ fileUrl: string; fileName: string }>
  }

  const handleProcessDocuments = async () => {
    if (!primaryIdFile || !proofOfAddressFile) {
      setError('Both primary ID and proof of address files are required')
      return
    }

    if (!customer) {
      setError('Customer data not loaded. Please refresh the page and try again.')
      return
    }

    if (!customerId || customerId.length !== 24) {
      setError('Invalid customer ID. Please check the URL and try again.')
      return
    }

    setError(null)
    setSuccessMessage(null)
    setUploading(true)
    setUploadProgress(0)
    setUploadStatus('Uploading documents...')

    try {
      // Upload primary ID
      setUploadStatus('Uploading primary ID...')
      const primaryIdResult = await handleUpload(primaryIdFile, 'passport')
      setUploadProgress(25)

      // Upload proof of address
      setUploadStatus('Uploading proof of address...')
      const proofOfAddressResult = await handleUpload(proofOfAddressFile, 'utility_bill')
      setUploadProgress(50)

      setUploadStatus('Processing documents...')
      setUploadProgress(75)

      const uploadedAt = new Date().toISOString()
      const documents: ApiDocument[] = [
        {
          type: 'passport',
          fileName: primaryIdResult.fileName,
          fileUrl: primaryIdResult.fileUrl,
          uploadedAt,
          extractionStatus: 'pending'
        },
        {
          type: 'utility_bill',
          fileName: proofOfAddressResult.fileName,
          fileUrl: proofOfAddressResult.fileUrl,
          uploadedAt,
          extractionStatus: 'pending'
        }
      ]

      setUploadStatus('Updating customer record...')
      console.log('Updating customer with ID:', customerId)
      console.log('Documents to update:', documents)

      const updateResponse = await fetch(`/api/customers/${customerId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          documents,
          status: 'processing'
        })
      })

      if (!updateResponse.ok) {
        const updateError = await updateResponse.json().catch(() => ({}))
        console.error('Update failed:', updateError)
        console.error('Response status:', updateResponse.status)

        // If customer not found, try to refetch and see if it exists
        if (updateResponse.status === 404) {
          console.log('Customer not found during update, attempting to refetch...')
          try {
            await fetchCustomer()
            throw new Error('Customer was not found during update. The page has been refreshed with the latest data.')
          } catch (refetchError) {
            console.error('Refetch also failed:', refetchError)
            throw new Error('Customer not found. Please check if this customer still exists.')
          }
        }

        throw new Error(updateError.error || `Failed to update customer after upload (${updateResponse.status})`)
      }

      const updated = await updateResponse.json()
      if (updated.customer) {
        setCustomer({
          ...updated.customer,
          documents: updated.customer.documents ?? [],
          communications: updated.customer.communications ?? []
        })
      }

      setUploadStatus('Starting AI processing...')
      setUploadProgress(90)

      try {
        const processResponse = await fetch(`/api/process/${customerId}`, {
          method: 'POST'
        })

        if (!processResponse.ok) {
          console.warn('Process route not ready:', await processResponse.text())
        }
      } catch (processError) {
        console.warn('Process route unavailable:', processError)
      }

      setUploadProgress(100)
      setUploadStatus('Complete!')

      setSuccessMessage('Documents uploaded successfully. Redirecting to queue...')
      setPrimaryIdFile(null)
      setProofOfAddressFile(null)
      setTimeout(() => router.push('/dashboard'), 1500)
    } catch (uploadError) {
      console.error('Error processing documents:', uploadError)
      setError(uploadError instanceof Error ? uploadError.message : 'Failed to process documents')
    } finally {
      setUploading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-[40vh] flex items-center justify-center text-gray-400">
        <div>
          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-blue-500" />
          Loading customer details...
        </div>
      </div>
    )
  }

  if (error && !customer) {
    return (
      <Card className="bg-gray-900/70 border border-red-500/30 text-white">
        <CardHeader>
          <CardTitle>Unable to load customer</CardTitle>
          <CardDescription className="text-gray-400">{error}</CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="outline" onClick={() => router.push('/dashboard')}>
            Back to Dashboard
          </Button>
        </CardContent>
      </Card>
    )
  }

  if (!customer) {
    return null
  }

  const showUploadForm = customer.status === 'pending_documents'
  const documents = customer.documents ?? []

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <Button variant="outline" onClick={() => router.push('/dashboard')} className="w-full md:w-auto">
          ← Back to My Cases
        </Button>
        <Badge className={`${statusColors[customer.status]} border-0 w-full justify-center md:w-auto`}>
          {statusLabels[customer.status]}
        </Badge>
      </div>

      {error && (
        <Alert className="bg-red-950/40 border-red-500/40 text-red-200">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {successMessage && (
        <Alert className="bg-emerald-900/40 border-emerald-500/40 text-emerald-100">
          <AlertDescription>{successMessage}</AlertDescription>
        </Alert>
      )}

      <Card className="bg-gray-900/60 border-gray-800 text-white">
        <CardHeader>
          <CardTitle>{customer.name}</CardTitle>
          <CardDescription className="text-gray-400">{customer.email}</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <div>
            <p className="text-sm text-gray-400">Date of Birth</p>
            <p className="text-base">{customer.dateOfBirth || 'N/A'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-400">Account Type</p>
            <p className="text-base capitalize">{customer.accountType}</p>
          </div>
          <div>
            <p className="text-sm text-gray-400">Application Date</p>
            <p className="text-base">{formatDate(customer.assignedDate)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-400">Source</p>
            <p className="text-base capitalize">{customer.source}</p>
          </div>
        </CardContent>
      </Card>

      {showUploadForm && (
        <Card className="bg-gray-900/60 border-gray-800 text-white">
          <CardHeader>
            <CardTitle>Upload KYC Documents</CardTitle>
            <CardDescription className="text-gray-400">
              Provide the primary identity document and a proof of address to start automated processing
            </CardDescription>
          </CardHeader>
           <CardContent className="space-y-6">
             <DocumentUpload
               label="Primary ID (Passport / Driver's License / National ID)"
               selectedFile={primaryIdFile}
               onFileSelect={setPrimaryIdFile}
               accept="image/*,.pdf"
               maxSize={10}
               disabled={uploading}
             />

             <DocumentUpload
               label="Proof of Address (Utility Bill / Bank Statement / Lease)"
               selectedFile={proofOfAddressFile}
               onFileSelect={setProofOfAddressFile}
               accept="image/*,.pdf"
               maxSize={10}
               disabled={uploading}
             />

             {uploading && (
               <div className="space-y-3 p-4 bg-gray-900/40 rounded-lg border border-gray-700">
                 <div className="flex items-center gap-3">
                   <Loader2 className="h-5 w-5 animate-spin text-blue-400" />
                   <span className="text-sm font-medium text-gray-200">{uploadStatus}</span>
                 </div>
                 <Progress value={uploadProgress} className="h-2" />
                 <p className="text-xs text-gray-400">Please wait while we process your documents...</p>
               </div>
             )}

             <Alert className="bg-blue-950/40 border-blue-500/40 text-blue-200">
               <FileCheck className="h-4 w-4" />
               <AlertDescription>
                 Once uploaded, VerifAI automatically extracts, validates, and analyzes the documents. This typically completes within a minute.
               </AlertDescription>
             </Alert>

             <div className="flex flex-col gap-3 md:flex-row">
               <Button
                 disabled={!primaryIdFile || !proofOfAddressFile || uploading}
                 onClick={handleProcessDocuments}
                 className="flex-1 h-12 text-base font-semibold transition-all duration-200 hover:scale-[1.02]"
                 size="lg"
               >
                 {uploading ? (
                   <>
                     <Loader2 className="h-5 w-5 animate-spin mr-2" />
                     Processing Documents...
                   </>
                 ) : (
                   <>
                     <FileCheck className="h-5 w-5 mr-2" />
                     Upload & Process Documents
                   </>
                 )}
               </Button>
               <Button
                 variant="secondary"
                 onClick={() => router.push('/dashboard')}
                 className="flex-1 md:flex-none h-12 transition-all duration-200 hover:bg-gray-700"
                 size="lg"
                 disabled={uploading}
               >
                 Cancel
               </Button>
             </div>
          </CardContent>
        </Card>
      )}

      {documents.length > 0 && (
        <Card className="bg-gray-900/60 border-gray-800 text-white">
          <CardHeader>
            <CardTitle>Uploaded Documents</CardTitle>
            <CardDescription className="text-gray-400">
              Track the files received for this customer and monitor extraction progress
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {documents.map((doc, index) => (
              <div
                key={`${doc.type}-${doc.fileName}-${index}`}
                className="flex flex-col gap-3 rounded-xl border border-gray-800/80 bg-black/20 p-4 md:flex-row md:items-center"
              >
                <div className="flex-1">
                  <p className="text-base font-semibold capitalize">{doc.type.replace(/_/g, ' ')}</p>
                  <p className="text-sm text-gray-400">{doc.fileName}</p>
                  <p className="text-xs text-gray-500">Uploaded {formatDateTime(doc.uploadedAt)}</p>
                </div>
                <Badge className="w-fit border-0 bg-gray-800/70 text-gray-100">
                  {doc.extractionStatus ?? 'pending'}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
