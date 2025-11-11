import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/server'
import type { DocumentType } from '@/lib/types'

export const runtime = 'nodejs'

const allowedDocumentTypes: DocumentType[] = [
  'passport',
  'drivers_license',
  'national_id',
  'utility_bill',
  'bank_statement',
  'lease_agreement'
]

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File | null
    const customerId = formData.get('customerId') as string | null
    const documentType = formData.get('documentType') as DocumentType | null

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    if (!customerId) {
      return NextResponse.json({ error: 'customerId is required' }, { status: 400 })
    }

    if (!documentType || !allowedDocumentTypes.includes(documentType)) {
      return NextResponse.json({ error: 'Invalid document type' }, { status: 400 })
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    const sanitizedName = file.name.replace(/\s+/g, '_')
    const fileName = `${documentType}_${Date.now()}_${sanitizedName}`
    const filePath = `${customerId}/${fileName}`

    const { data, error } = await supabaseAdmin.storage
      .from('kyc-documents')
      .upload(filePath, buffer, {
        contentType: file.type || 'application/octet-stream',
        upsert: false
      })

    if (error) {
      console.error('Supabase upload error:', error)
      return NextResponse.json({ error: 'Failed to upload file to storage' }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      fileUrl: data?.path ?? filePath,
      fileName
    })
  } catch (error) {
    console.error('Error uploading file:', error)
    return NextResponse.json({ error: 'Failed to upload file' }, { status: 500 })
  }
}
