import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/db/mongodb'
import { DocumentModel } from '@/lib/models/document'
import { CustomerModel } from '@/lib/models/customer'
import { CommunicationModel } from '@/lib/models/communication'
import { extractDataFromDocument, validateExtraction } from '@/lib/services/ade-service'
import { DocumentStatus, CustomerStatus, CommunicationType, DocumentType } from '@/lib/constants/statuses'

/**
 * POST /api/process/[id]
 * Processes a document through ADE extraction and updates customer workflow status
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: documentId } = await params

    if (!documentId) {
      return NextResponse.json(
        { error: 'Document ID is required' },
        { status: 400 }
      )
    }

    await connectToDatabase()

    // Find document
    const document = await DocumentModel.findById(documentId)
    if (!document) {
      return NextResponse.json(
        { error: 'Document not found' },
        { status: 404 }
      )
    }

    // Check if already processed successfully
    if (document.status === DocumentStatus.SUCCESS) {
      return NextResponse.json({
        message: 'Document already processed',
        document
      })
    }

    // Update status to extracting
    document.status = DocumentStatus.EXTRACTING
    document.extractionAttempts += 1
    document.lastExtractionAt = new Date()
    await document.save()

    console.log(`[Process] Starting extraction for document ${documentId}`)

    try {
      // Extract data using ADE
      const extractedData = await extractDataFromDocument(
        document.fileUrl,
        document.documentType
      )

      // Validate extraction
      const validation = validateExtraction(extractedData, document.documentType)

      // Update document with extracted data
      document.extractedData = extractedData
      document.extractionError = validation.warnings.length > 0
        ? validation.warnings.join('; ')
        : undefined

      // Set status based on validation
      if (validation.isValid) {
        document.status = DocumentStatus.SUCCESS
        console.log(`[Process] Document ${documentId} extracted successfully`)
      } else {
        document.status = DocumentStatus.FAILED
        document.extractionError = `Missing required fields: ${validation.missingFields.join(', ')}`
        console.warn(`[Process] Document ${documentId} extraction incomplete:`, validation.missingFields)
      }

      await document.save()

      // Check if we should advance customer workflow status
      await checkAndAdvanceCustomerStatus(document.customerId.toString())

      return NextResponse.json({
        message: document.status === DocumentStatus.SUCCESS
          ? 'Document processed successfully'
          : 'Document processed with warnings',
        document,
        validation
      })
    } catch (extractionError) {
      // Handle extraction failure
      console.error(`[Process] Extraction failed for document ${documentId}:`, extractionError)

      document.status = DocumentStatus.FAILED
      document.extractionError = extractionError instanceof Error
        ? extractionError.message
        : 'Unknown extraction error'
      await document.save()

      return NextResponse.json(
        {
          error: 'Document extraction failed',
          details: document.extractionError,
          document
        },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('[Process] API error:', error)
    return NextResponse.json(
      {
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

/**
 * Checks if all required documents are processed and advances customer status
 */
async function checkAndAdvanceCustomerStatus(customerId: string): Promise<void> {
  try {
    const customer = await CustomerModel.findById(customerId)
    if (!customer) {
      console.warn(`[Process] Customer ${customerId} not found`)
      return
    }

    // Only advance if customer is in processing status
    if (customer.status !== CustomerStatus.PROCESSING) {
      console.log(`[Process] Customer ${customerId} not in processing status (${customer.status})`)
      return
    }

    // Get all documents for this customer
    const documents = await DocumentModel.find({ customerId })

    // Count required document types
    const requiredTypes = [
      DocumentType.PASSPORT,
      DocumentType.DRIVERS_LICENSE,
      DocumentType.NATIONAL_ID
    ]
    const addressDocTypes = [
      DocumentType.UTILITY_BILL,
      DocumentType.BANK_STATEMENT,
      DocumentType.LEASE_AGREEMENT
    ]

    const successfulDocs = documents.filter(doc => doc.status === DocumentStatus.SUCCESS)
    const failedDocs = documents.filter(doc => doc.status === DocumentStatus.FAILED)

    const hasIdentityDoc = successfulDocs.some(doc => requiredTypes.includes(doc.documentType))
    const hasAddressDoc = successfulDocs.some(doc => addressDocTypes.includes(doc.documentType))

    console.log(`[Process] Customer ${customerId} document status:`, {
      total: documents.length,
      successful: successfulDocs.length,
      failed: failedDocs.length,
      hasIdentityDoc,
      hasAddressDoc
    })

    // If any document failed, keep in processing status
    if (failedDocs.length > 0) {
      console.log(`[Process] Customer ${customerId} has ${failedDocs.length} failed documents, staying in processing`)
      return
    }

    // If both required documents are successfully extracted, advance to ready_for_review
    if (hasIdentityDoc && hasAddressDoc) {
      console.log(`[Process] Customer ${customerId} has all required documents, advancing to ready_for_review`)

      // Update customer status
      customer.status = CustomerStatus.READY_FOR_REVIEW
      customer.statusHistory.push({
        status: CustomerStatus.READY_FOR_REVIEW,
        changedAt: new Date(),
        changedBy: 'SYSTEM',
        reason: 'All required documents successfully extracted via ADE'
      })
      await customer.save()

      // Create audit trail communication
      await CommunicationModel.create({
        customerId: customer._id,
        type: CommunicationType.DOCUMENT_VERIFIED,
        subject: 'Documents Verified by ADE',
        message: `All required documents have been successfully extracted and verified. Identity document and proof of address are complete. Customer is ready for analyst review.`,
        createdBy: 'SYSTEM',
        metadata: {
          documentCount: successfulDocs.length,
          extractionDate: new Date()
        }
      })

      console.log(`[Process] Customer ${customerId} advanced to ready_for_review`)
    } else {
      console.log(`[Process] Customer ${customerId} missing required documents (identity: ${hasIdentityDoc}, address: ${hasAddressDoc})`)
    }
  } catch (error) {
    console.error('[Process] Error checking customer status:', error)
    // Don't throw - this is a best-effort status update
  }
}

/**
 * GET /api/process/[id]
 * Gets the processing status of a document
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: documentId } = await params

    await connectToDatabase()

    const document = await DocumentModel.findById(documentId)
    if (!document) {
      return NextResponse.json(
        { error: 'Document not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ document })
  } catch (error) {
    console.error('[Process] GET error:', error)
    return NextResponse.json(
      {
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
