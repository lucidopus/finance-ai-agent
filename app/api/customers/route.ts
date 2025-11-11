import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/db/mongodb'
import { CustomerModel } from '@/lib/models/customer'
import { DocumentModel } from '@/lib/models/document'
import { CommunicationModel } from '@/lib/models/communication'
import { CustomerStatus } from '@/lib/constants/statuses'

/**
 * GET /api/customers
 * Lists all customers with optional filtering
 */
export async function GET(request: NextRequest) {
  try {
    await connectToDatabase()

    const searchParams = request.nextUrl.searchParams
    const status = searchParams.get('status')
    const limit = parseInt(searchParams.get('limit') || '50')
    const skip = parseInt(searchParams.get('skip') || '0')

    const query: any = {}
    if (status) {
      query.status = status
    }

    const customers = await CustomerModel
      .find(query)
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip)
      .lean()

    const total = await CustomerModel.countDocuments(query)

    return NextResponse.json({
      customers,
      total,
      limit,
      skip
    })
  } catch (error) {
    console.error('[Customers] GET error:', error)
    return NextResponse.json(
      {
        error: 'Failed to fetch customers',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

/**
 * POST /api/customers
 * Creates a new customer record
 */
export async function POST(request: NextRequest) {
  try {
    await connectToDatabase()

    const body = await request.json()
    const { email, firstName, lastName, phone } = body

    // Validate required fields
    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      )
    }

    // Check if customer already exists
    const existingCustomer = await CustomerModel.findOne({ email })
    if (existingCustomer) {
      return NextResponse.json(
        { error: 'Customer with this email already exists', customer: existingCustomer },
        { status: 409 }
      )
    }

    // Create new customer
    const customer = await CustomerModel.create({
      email,
      firstName,
      lastName,
      phone,
      status: CustomerStatus.UPLOADED,
      statusHistory: [{
        status: CustomerStatus.UPLOADED,
        changedAt: new Date(),
        changedBy: 'SYSTEM',
        reason: 'Customer created'
      }],
      requiredDocuments: ['identity', 'address'],
      uploadedDocuments: []
    })

    console.log(`[Customers] Created new customer: ${customer._id}`)

    return NextResponse.json({
      message: 'Customer created successfully',
      customer
    }, { status: 201 })
  } catch (error) {
    console.error('[Customers] POST error:', error)
    return NextResponse.json(
      {
        error: 'Failed to create customer',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
