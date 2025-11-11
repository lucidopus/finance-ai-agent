import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/db/mongodb'
import { CustomerModel } from '@/lib/models/customer'
import { DocumentModel } from '@/lib/models/document'
import { CommunicationModel } from '@/lib/models/communication'

/**
 * GET /api/customers/[id]
 * Gets a customer with their documents and communications
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: customerId } = await params

    await connectToDatabase()

    const customer = await CustomerModel.findById(customerId)
    if (!customer) {
      return NextResponse.json(
        { error: 'Customer not found' },
        { status: 404 }
      )
    }

    // Get documents
    const documents = await DocumentModel
      .find({ customerId })
      .sort({ uploadedAt: -1 })
      .lean()

    // Get communications
    const communications = await CommunicationModel
      .find({ customerId })
      .sort({ createdAt: -1 })
      .lean()

    return NextResponse.json({
      customer,
      documents,
      communications
    })
  } catch (error) {
    console.error('[Customer] GET error:', error)
    return NextResponse.json(
      {
        error: 'Failed to fetch customer',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
