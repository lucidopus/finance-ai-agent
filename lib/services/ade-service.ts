import axios, { AxiosError } from 'axios'
import Anthropic from '@anthropic-ai/sdk'
import { DocumentType } from '@/lib/constants/statuses'
import type { ExtractedData, ParsedAddress } from '@/lib/models/document'

const LANDING_AI_API_KEY = process.env.LANDING_AI_API_KEY
const LANDING_AI_BASE_URL = 'https://api.landing.ai/v1/ade'
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY
const ENABLE_LLM_FALLBACK = process.env.ENABLE_LLM_FALLBACK === 'true'

// Common address field synonyms
const ADDRESS_FIELD_MAPPINGS: Record<string, string[]> = {
  street: ['street', 'address', 'address_line_1', 'line1', 'street_address', 'residence', 'property_address'],
  line2: ['address_line_2', 'line2', 'apt', 'apartment', 'suite', 'unit'],
  city: ['city', 'town', 'municipality', 'locality', 'borough'],
  state: ['state', 'province', 'region', 'prefecture', 'county', 'administrative_area'],
  postalCode: ['postal_code', 'zip', 'zipcode', 'postcode', 'zip_code', 'postal'],
  country: ['country', 'nation', 'country_name']
}

// Field mappings for identity documents
const IDENTITY_FIELD_MAPPINGS: Record<string, string[]> = {
  firstName: ['first_name', 'given_name', 'forename', 'name', 'firstname'],
  lastName: ['last_name', 'surname', 'family_name', 'lastname'],
  middleName: ['middle_name', 'middlename'],
  dateOfBirth: ['date_of_birth', 'dob', 'birth_date', 'birthdate'],
  nationality: ['nationality', 'citizenship', 'country_of_citizenship'],
  gender: ['gender', 'sex'],
  documentNumber: ['document_number', 'passport_number', 'id_number', 'number'],
  issueDate: ['issue_date', 'date_of_issue', 'issued'],
  expiryDate: ['expiry_date', 'expiration_date', 'valid_until', 'expires'],
  issuingAuthority: ['issuing_authority', 'issued_by', 'authority']
}

interface ADEResponse {
  predictions?: Array<{
    label: string
    value?: {
      raw_text?: string
      text?: string
    }
    score?: number
  }>
  error?: string
}

/**
 * Extracts text recursively from nested ADE response objects
 */
function extractTextValue(value: any): string | undefined {
  if (!value) return undefined

  // Direct string value
  if (typeof value === 'string') return value.trim()

  // Nested object with raw_text or text
  if (typeof value === 'object') {
    if (value.raw_text) return String(value.raw_text).trim()
    if (value.text) return String(value.text).trim()

    // Try to find any text-like field
    for (const key of Object.keys(value)) {
      if (typeof value[key] === 'string' && value[key].trim()) {
        return value[key].trim()
      }
    }
  }

  return undefined
}

/**
 * Normalizes field names to match our schema
 */
function normalizeFieldName(fieldName: string): string | null {
  const normalized = fieldName.toLowerCase().replace(/[_\s-]+/g, '_')

  // Check address fields
  for (const [targetField, synonyms] of Object.entries(ADDRESS_FIELD_MAPPINGS)) {
    if (synonyms.some(syn => normalized.includes(syn))) {
      return `address.${targetField}`
    }
  }

  // Check identity fields
  for (const [targetField, synonyms] of Object.entries(IDENTITY_FIELD_MAPPINGS)) {
    if (synonyms.some(syn => normalized.includes(syn))) {
      return targetField
    }
  }

  return null
}

/**
 * Cleans and validates extracted text values
 */
function cleanTextValue(value: string, fieldType: string): string | undefined {
  if (!value || !value.trim()) return undefined

  let cleaned = value.trim()

  // Remove common OCR artifacts
  cleaned = cleaned.replace(/[^\w\s\-.,\/]/g, ' ')
  cleaned = cleaned.replace(/\s+/g, ' ').trim()

  // Validate based on field type
  if (fieldType.includes('city') || fieldType.includes('state')) {
    // Reject single character or just punctuation
    if (cleaned.length < 2 || /^[.\-,\s]+$/.test(cleaned)) {
      return undefined
    }
    // Capitalize properly
    cleaned = cleaned.split(' ').map(word =>
      word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    ).join(' ')
  }

  if (fieldType.includes('postalCode')) {
    // Extract postal code pattern
    const match = cleaned.match(/\b\d{5}(?:-\d{4})?\b/) // US ZIP
      || cleaned.match(/\b[A-Z]\d[A-Z]\s?\d[A-Z]\d\b/i) // Canadian postal
      || cleaned.match(/\b[A-Z]{1,2}\d{1,2}\s?\d[A-Z]{2}\b/i) // UK postcode
    if (match) {
      cleaned = match[0]
    }
  }

  return cleaned || undefined
}

/**
 * Parses address data from ADE extraction results
 */
export function parseAddressData(
  predictions: ADEResponse['predictions'],
  documentType: DocumentType
): ParsedAddress {
  const address: ParsedAddress = {}
  const rawFields: Record<string, string> = {}

  // Extract all address-related fields
  predictions?.forEach(pred => {
    const normalizedField = normalizeFieldName(pred.label)
    if (!normalizedField?.startsWith('address.')) return

    const textValue = extractTextValue(pred.value)
    if (!textValue) return

    const fieldName = normalizedField.replace('address.', '')
    const cleanedValue = cleanTextValue(textValue, fieldName)
    if (cleanedValue) {
      rawFields[fieldName] = cleanedValue
    }
  })

  // Map to address structure
  address.street = rawFields.street
  address.line2 = rawFields.line2
  address.city = rawFields.city
  address.state = rawFields.state
  address.postalCode = rawFields.postalCode
  address.country = rawFields.country

  // Handle multi-line addresses
  if (rawFields.street && rawFields.line2) {
    address.line1 = rawFields.street
    address.street = `${rawFields.street}, ${rawFields.line2}`
  } else if (rawFields.street) {
    address.line1 = rawFields.street
  }

  // Construct full address
  const parts = [
    address.street,
    address.city,
    address.state && address.postalCode ? `${address.state} ${address.postalCode}` : address.state || address.postalCode,
    address.country
  ].filter(Boolean)

  if (parts.length > 0) {
    address.fullAddress = parts.join(', ')
  }

  return address
}

/**
 * Parses all extracted data from ADE response
 */
export function parseExtractedData(
  adeResponse: ADEResponse,
  documentType: DocumentType
): ExtractedData {
  const extracted: ExtractedData = {
    documentType,
    rawData: {}
  }

  const predictions = adeResponse.predictions || []
  let totalConfidence = 0
  let confidenceCount = 0

  // Parse identity fields
  predictions.forEach(pred => {
    const normalizedField = normalizeFieldName(pred.label)
    if (!normalizedField || normalizedField.startsWith('address.')) return

    const textValue = extractTextValue(pred.value)
    if (!textValue) return

    // Track confidence
    if (pred.score !== undefined) {
      totalConfidence += pred.score
      confidenceCount++
    }

    // Map to extracted data
    const cleanedValue = cleanTextValue(textValue, normalizedField)
    if (cleanedValue) {
      (extracted as any)[normalizedField] = cleanedValue
      extracted.rawData![pred.label] = textValue
    }
  })

  // Parse address
  const address = parseAddressData(predictions, documentType)
  if (Object.keys(address).length > 0) {
    extracted.address = address
  }

  // Calculate average confidence
  if (confidenceCount > 0) {
    extracted.confidence = totalConfidence / confidenceCount
  }

  return extracted
}

/**
 * Calls LandingAI ADE API to extract data from document
 */
export async function extractDataFromDocument(
  fileUrl: string,
  documentType: DocumentType
): Promise<ExtractedData> {
  if (!LANDING_AI_API_KEY) {
    throw new Error('LANDING_AI_API_KEY not configured')
  }

  try {
    console.log(`[ADE] Extracting data from ${documentType} document: ${fileUrl}`)

    // Call LandingAI ADE API
    const response = await axios.post<ADEResponse>(
      `${LANDING_AI_BASE_URL}/extract`,
      {
        document_url: fileUrl,
        document_type: documentType
      },
      {
        headers: {
          'Authorization': `Bearer ${LANDING_AI_API_KEY}`,
          'Content-Type': 'application/json'
        },
        timeout: 30000
      }
    )

    console.log('[ADE] Extraction completed successfully')
    const extracted = parseExtractedData(response.data, documentType)

    // Log extraction summary
    const fieldCount = Object.keys(extracted).filter(k => k !== 'rawData' && k !== 'documentType').length
    console.log(`[ADE] Extracted ${fieldCount} fields with confidence ${extracted.confidence?.toFixed(2) || 'N/A'}`)

    // Check if extraction is too sparse (fewer than 3 fields) and LLM fallback is enabled
    if (ENABLE_LLM_FALLBACK && fieldCount < 3 && extracted.confidence && extracted.confidence < 0.6) {
      console.log('[ADE] Low confidence extraction, attempting LLM fallback')
      return await extractWithLLMFallback(fileUrl, documentType, extracted)
    }

    return extracted
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error('[ADE] API error:', error.response?.data || error.message)
      throw new Error(`ADE extraction failed: ${error.response?.data?.error || error.message}`)
    }
    throw error
  }
}

/**
 * LLM fallback for when heuristic extraction fails
 * Uses Claude to extract structured data from document
 */
async function extractWithLLMFallback(
  fileUrl: string,
  documentType: DocumentType,
  partialExtraction: ExtractedData
): Promise<ExtractedData> {
  if (!ANTHROPIC_API_KEY) {
    console.warn('[ADE] LLM fallback disabled: ANTHROPIC_API_KEY not configured')
    return partialExtraction
  }

  try {
    const anthropic = new Anthropic({ apiKey: ANTHROPIC_API_KEY })

    console.log('[ADE] Calling Claude for LLM extraction fallback')

    const prompt = `You are a document extraction specialist. Extract structured data from this ${documentType} document.

Focus on extracting:
- Personal information (name, date of birth, nationality)
- Document information (document number, issue/expiry dates)
- Address information (complete address with street, city, state, postal code, country)

Return a JSON object with the extracted fields. Use null for missing fields.
Ensure addresses are complete and properly structured.

Document type: ${documentType}
Partial extraction from OCR: ${JSON.stringify(partialExtraction, null, 2)}`

    const message = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 1024,
      messages: [{
        role: 'user',
        content: prompt
      }]
    })

    // Parse LLM response
    const content = message.content[0]
    if (content.type === 'text') {
      const jsonMatch = content.text.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        const llmExtraction = JSON.parse(jsonMatch[0])

        // Merge LLM extraction with partial extraction
        const merged: ExtractedData = {
          ...partialExtraction,
          ...llmExtraction,
          documentType,
          confidence: 0.75 // LLM-assisted confidence
        }

        console.log('[ADE] LLM fallback completed successfully')
        return merged
      }
    }

    console.warn('[ADE] LLM fallback did not return valid JSON')
    return partialExtraction
  } catch (error) {
    console.error('[ADE] LLM fallback error:', error)
    return partialExtraction
  }
}

/**
 * Validates extracted data completeness
 */
export function validateExtraction(
  extracted: ExtractedData,
  documentType: DocumentType
): { isValid: boolean; missingFields: string[]; warnings: string[] } {
  const missingFields: string[] = []
  const warnings: string[] = []

  // Check required fields based on document type
  if (documentType === DocumentType.PASSPORT || documentType === DocumentType.DRIVERS_LICENSE) {
    if (!extracted.firstName) missingFields.push('firstName')
    if (!extracted.lastName) missingFields.push('lastName')
    if (!extracted.dateOfBirth) missingFields.push('dateOfBirth')
    if (!extracted.documentNumber) missingFields.push('documentNumber')
  }

  if (documentType === DocumentType.UTILITY_BILL ||
      documentType === DocumentType.BANK_STATEMENT ||
      documentType === DocumentType.LEASE_AGREEMENT) {
    if (!extracted.address?.street) missingFields.push('address.street')
    if (!extracted.address?.city) missingFields.push('address.city')
    if (!extracted.address?.postalCode && !extracted.address?.state) {
      warnings.push('Address missing both postal code and state')
    }
  }

  // Check confidence
  if (extracted.confidence && extracted.confidence < 0.5) {
    warnings.push(`Low confidence score: ${extracted.confidence.toFixed(2)}`)
  }

  return {
    isValid: missingFields.length === 0,
    missingFields,
    warnings
  }
}
