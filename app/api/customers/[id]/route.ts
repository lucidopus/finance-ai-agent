import { NextResponse } from 'next/server'
import { ObjectId } from 'mongodb'
import { getDatabase } from '@/lib/mongodb'
import type { Customer, Document, Communication } from '@/lib/types'

export const runtime = 'nodejs'

type SerializableDocument = Omit<Document, 'uploadedAt'> & { uploadedAt?: string | Date | null }
type SerializableCommunication = Omit<Communication, 'sentAt'> & { sentAt?: string | Date | null }

type SerializableCustomer = Omit<
  Customer,
  'documents' | 'communications' | 'assignedDate' | 'createdAt' | 'updatedAt'
> & {
  _id: string
  documents: SerializableDocument[]
  communications: SerializableCommunication[]
  assignedDate?: string | Date | null
  createdAt?: string | Date | null
  updatedAt?: string | Date | null
}

function serializeCustomer(customer: Customer & { _id: ObjectId }): SerializableCustomer {
  return {
    ...customer,
    _id: customer._id.toString(),
    documents: (customer.documents ?? []).map((doc) => ({
      ...doc,
      uploadedAt: doc.uploadedAt?.toISOString() ?? null
    })),
    communications: (customer.communications ?? []).map((communication) => ({
      ...communication,
      sentAt: communication.sentAt?.toISOString() ?? null
    })),
    assignedDate: customer.assignedDate?.toISOString() ?? null,
    createdAt: customer.createdAt?.toISOString() ?? null,
    updatedAt: customer.updatedAt?.toISOString() ?? null
  }
}

function normalizeDocuments(documents: unknown): Document[] {
  if (!Array.isArray(documents)) {
    return []
  }

  return documents
    .map((doc) => {
      if (!doc || typeof doc !== 'object') {
        return null
      }

      const casted = doc as Partial<Document> & { uploadedAt?: string | Date }
      if (!casted.type || !casted.fileName || !casted.fileUrl) {
        return null
      }

      return {
        type: casted.type,
        fileName: casted.fileName,
        fileUrl: casted.fileUrl,
        uploadedAt: casted.uploadedAt ? new Date(casted.uploadedAt) : new Date(),
        extractionStatus: casted.extractionStatus ?? 'pending',
        extractedData: casted.extractedData
      }
    })
    .filter((doc): doc is Document => Boolean(doc))
}

type RouteContext = { params: { id: string } | Promise<{ id: string }> }

async function resolveParams(context: RouteContext): Promise<{ id: string }> {
  const rawParams = context.params
  return rawParams instanceof Promise ? await rawParams : rawParams
}

export async function GET(
  _request: Request,
  context: RouteContext
) {
  try {
    const { id } = await resolveParams(context)

    if (!id || !ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid customer id' }, { status: 400 })
    }

    const db = await getDatabase()
    const customer = await db
      .collection<Customer>('customers')
      .findOne({ _id: new ObjectId(id) })

    if (!customer) {
      return NextResponse.json({ error: 'Customer not found' }, { status: 404 })
    }

    return NextResponse.json({ customer: serializeCustomer(customer) })
  } catch (error) {
    console.error('Error fetching customer:', error)
    return NextResponse.json({ error: 'Failed to fetch customer' }, { status: 500 })
  }
}

export async function PATCH(
  request: Request,
  context: RouteContext
) {
  try {
    const { id } = await resolveParams(context)

    if (!id || !ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid customer id' }, { status: 400 })
    }

    const updates = await request.json()
    const db = await getDatabase()

    const updateData: Record<string, unknown> = {}

    if (updates.status) {
      updateData.status = updates.status
    }

    if (Object.prototype.hasOwnProperty.call(updates, 'documents')) {
      updateData.documents = normalizeDocuments(updates.documents)
    }

    if (updates.riskReport) {
      updateData.riskReport = updates.riskReport
    }

    if (updates.communications) {
      updateData.communications = updates.communications
    }

    updateData.updatedAt = new Date()

    // First check if customer exists
    const existingCustomer = await db
      .collection<Customer>('customers')
      .findOne({ _id: new ObjectId(id) })

    if (!existingCustomer) {
      return NextResponse.json({ error: 'Customer not found' }, { status: 404 })
    }

    // Update the customer
    const updateResult = await db
      .collection<Customer>('customers')
      .updateOne(
        { _id: new ObjectId(id) },
        { $set: updateData }
      )

    if (updateResult.matchedCount === 0) {
      return NextResponse.json({ error: 'Customer not found' }, { status: 404 })
    }

    // Fetch the updated customer
    const updatedCustomer = await db
      .collection<Customer>('customers')
      .findOne({ _id: new ObjectId(id) })

    if (!updatedCustomer) {
      return NextResponse.json({ error: 'Failed to retrieve updated customer' }, { status: 500 })
    }

    return NextResponse.json({ success: true, customer: serializeCustomer(updatedCustomer) })
  } catch (error) {
    console.error('Error updating customer:', error)
    return NextResponse.json({ error: 'Failed to update customer' }, { status: 500 })
  }
}
