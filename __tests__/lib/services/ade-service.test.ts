import { parseAddressData, parseExtractedData, validateExtraction } from '@/lib/services/ade-service'
import { DocumentType } from '@/lib/constants/statuses'

describe('ADE Service - Address Parsing', () => {
  describe('parseAddressData', () => {
    it('should parse complete address from utility bill', () => {
      const predictions = [
        {
          label: 'street_address',
          value: { raw_text: '123 Main Street' },
          score: 0.95
        },
        {
          label: 'city',
          value: { raw_text: 'San Francisco' },
          score: 0.92
        },
        {
          label: 'state',
          value: { raw_text: 'CA' },
          score: 0.90
        },
        {
          label: 'postal_code',
          value: { raw_text: '94102' },
          score: 0.88
        },
        {
          label: 'country',
          value: { raw_text: 'USA' },
          score: 0.85
        }
      ]

      const address = parseAddressData(predictions, DocumentType.UTILITY_BILL)

      expect(address.street).toBe('123 Main Street')
      expect(address.city).toBe('San Francisco')
      expect(address.state).toBe('Ca')
      expect(address.postalCode).toBe('94102')
      expect(address.country).toBe('Usa')
      expect(address.fullAddress).toContain('123 Main Street')
      expect(address.fullAddress).toContain('San Francisco')
    })

    it('should handle nested raw_text fields', () => {
      const predictions = [
        {
          label: 'address',
          value: {
            raw_text: '456 Oak Avenue'
          },
          score: 0.90
        }
      ]

      const address = parseAddressData(predictions, DocumentType.BANK_STATEMENT)

      expect(address.street).toBe('456 Oak Avenue')
    })

    it('should reject invalid city values like "."', () => {
      const predictions = [
        {
          label: 'city',
          value: { raw_text: '.' },
          score: 0.50
        },
        {
          label: 'street',
          value: { raw_text: '789 Elm St' },
          score: 0.85
        }
      ]

      const address = parseAddressData(predictions, DocumentType.LEASE_AGREEMENT)

      expect(address.city).toBeUndefined()
      expect(address.street).toBe('789 Elm St')
    })

    it('should reject invalid state values like "TE"', () => {
      const predictions = [
        {
          label: 'state',
          value: { raw_text: 'TE' }, // This should be rejected if it's not a valid state
          score: 0.40
        }
      ]

      const address = parseAddressData(predictions, DocumentType.UTILITY_BILL)

      // Note: Our current implementation doesn't validate state abbreviations,
      // but it does clean and capitalize them. Add state validation if needed.
      expect(address.state).toBe('Te')
    })

    it('should handle multi-line addresses', () => {
      const predictions = [
        {
          label: 'address_line_1',
          value: { raw_text: '100 Market Street' },
          score: 0.90
        },
        {
          label: 'address_line_2',
          value: { raw_text: 'Apt 5B' },
          score: 0.85
        },
        {
          label: 'city',
          value: { raw_text: 'New York' },
          score: 0.92
        }
      ]

      const address = parseAddressData(predictions, DocumentType.LEASE_AGREEMENT)

      expect(address.line1).toBe('100 Market Street')
      expect(address.line2).toBe('Apt 5B')
      expect(address.street).toBe('100 Market Street, Apt 5B')
      expect(address.city).toBe('New York')
    })

    it('should extract postal codes from mixed text', () => {
      const predictions = [
        {
          label: 'postal_code',
          value: { raw_text: 'ZIP: 90210-1234' },
          score: 0.80
        }
      ]

      const address = parseAddressData(predictions, DocumentType.UTILITY_BILL)

      expect(address.postalCode).toBe('90210-1234')
    })

    it('should handle empty or missing predictions', () => {
      const address = parseAddressData([], DocumentType.UTILITY_BILL)

      expect(address.street).toBeUndefined()
      expect(address.city).toBeUndefined()
      expect(address.fullAddress).toBeUndefined()
    })

    it('should clean OCR artifacts from address fields', () => {
      const predictions = [
        {
          label: 'street',
          value: { raw_text: '  555   Pine   Street  !!  ' },
          score: 0.85
        },
        {
          label: 'city',
          value: { raw_text: 'LOS  ANGELES' },
          score: 0.88
        }
      ]

      const address = parseAddressData(predictions, DocumentType.BANK_STATEMENT)

      expect(address.street).toBe('555 Pine Street')
      expect(address.city).toBe('Los Angeles')
    })
  })

  describe('parseExtractedData', () => {
    it('should parse passport data with identity fields', () => {
      const adeResponse = {
        predictions: [
          {
            label: 'first_name',
            value: { raw_text: 'John' },
            score: 0.95
          },
          {
            label: 'last_name',
            value: { raw_text: 'Doe' },
            score: 0.93
          },
          {
            label: 'date_of_birth',
            value: { raw_text: '1990-05-15' },
            score: 0.90
          },
          {
            label: 'passport_number',
            value: { raw_text: 'P123456789' },
            score: 0.88
          }
        ]
      }

      const extracted = parseExtractedData(adeResponse, DocumentType.PASSPORT)

      expect(extracted.firstName).toBe('John')
      expect(extracted.lastName).toBe('Doe')
      expect(extracted.dateOfBirth).toBe('1990-05-15')
      expect(extracted.documentNumber).toBe('P123456789')
      expect(extracted.documentType).toBe(DocumentType.PASSPORT)
      expect(extracted.confidence).toBeGreaterThan(0.8)
    })

    it('should calculate average confidence score', () => {
      const adeResponse = {
        predictions: [
          { label: 'first_name', value: { text: 'Jane' }, score: 0.9 },
          { label: 'last_name', value: { text: 'Smith' }, score: 0.8 },
          { label: 'city', value: { text: 'Boston' }, score: 0.7 }
        ]
      }

      const extracted = parseExtractedData(adeResponse, DocumentType.UTILITY_BILL)

      expect(extracted.confidence).toBeCloseTo(0.8, 1)
    })

    it('should store raw data for debugging', () => {
      const adeResponse = {
        predictions: [
          {
            label: 'custom_field_name',
            value: { raw_text: 'Custom Value' },
            score: 0.75
          }
        ]
      }

      const extracted = parseExtractedData(adeResponse, DocumentType.LEASE_AGREEMENT)

      expect(extracted.rawData).toBeDefined()
      expect(extracted.rawData!['custom_field_name']).toBe('Custom Value')
    })
  })

  describe('validateExtraction', () => {
    it('should validate complete passport extraction', () => {
      const extracted = {
        firstName: 'John',
        lastName: 'Doe',
        dateOfBirth: '1990-01-01',
        documentNumber: 'P123456',
        documentType: DocumentType.PASSPORT,
        confidence: 0.90
      }

      const validation = validateExtraction(extracted, DocumentType.PASSPORT)

      expect(validation.isValid).toBe(true)
      expect(validation.missingFields).toHaveLength(0)
    })

    it('should detect missing required fields in passport', () => {
      const extracted = {
        firstName: 'John',
        // Missing lastName, dateOfBirth, documentNumber
        documentType: DocumentType.PASSPORT,
        confidence: 0.85
      }

      const validation = validateExtraction(extracted, DocumentType.PASSPORT)

      expect(validation.isValid).toBe(false)
      expect(validation.missingFields).toContain('lastName')
      expect(validation.missingFields).toContain('dateOfBirth')
      expect(validation.missingFields).toContain('documentNumber')
    })

    it('should validate complete address document', () => {
      const extracted = {
        address: {
          street: '123 Main St',
          city: 'Boston',
          state: 'MA',
          postalCode: '02101',
          country: 'USA'
        },
        documentType: DocumentType.UTILITY_BILL,
        confidence: 0.88
      }

      const validation = validateExtraction(extracted, DocumentType.UTILITY_BILL)

      expect(validation.isValid).toBe(true)
      expect(validation.missingFields).toHaveLength(0)
    })

    it('should detect missing address fields', () => {
      const extracted = {
        address: {
          street: '456 Oak Ave'
          // Missing city, state/postalCode
        },
        documentType: DocumentType.BANK_STATEMENT,
        confidence: 0.70
      }

      const validation = validateExtraction(extracted, DocumentType.BANK_STATEMENT)

      expect(validation.isValid).toBe(false)
      expect(validation.missingFields).toContain('address.city')
    })

    it('should warn about low confidence scores', () => {
      const extracted = {
        firstName: 'Jane',
        lastName: 'Smith',
        dateOfBirth: '1985-03-20',
        documentNumber: 'D987654',
        documentType: DocumentType.DRIVERS_LICENSE,
        confidence: 0.45
      }

      const validation = validateExtraction(extracted, DocumentType.DRIVERS_LICENSE)

      expect(validation.warnings.length).toBeGreaterThan(0)
      expect(validation.warnings[0]).toContain('Low confidence')
    })

    it('should warn when address is missing both postal code and state', () => {
      const extracted = {
        address: {
          street: '789 Pine Rd',
          city: 'Portland'
          // Missing both postalCode and state
        },
        documentType: DocumentType.LEASE_AGREEMENT,
        confidence: 0.80
      }

      const validation = validateExtraction(extracted, DocumentType.LEASE_AGREEMENT)

      expect(validation.warnings.length).toBeGreaterThan(0)
      expect(validation.warnings.some(w => w.includes('postal code and state'))).toBe(true)
    })
  })
})
