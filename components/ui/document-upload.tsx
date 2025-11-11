'use client'

import { useCallback, useState } from 'react'
import { Upload, File, X, CheckCircle, AlertCircle } from 'lucide-react'
import { Button } from './button'
import { Card } from './card'
import { cn } from '@/lib/utils'

interface DocumentUploadProps {
  onFileSelect: (file: File | null) => void
  selectedFile: File | null
  label: string
  accept?: string
  maxSize?: number // in MB
  className?: string
  disabled?: boolean
}

export function DocumentUpload({
  onFileSelect,
  selectedFile,
  label,
  accept = "image/*,.pdf",
  maxSize = 10,
  className,
  disabled = false
}: DocumentUploadProps) {
  const [isDragOver, setIsDragOver] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const validateFile = useCallback((file: File): string | null => {
    if (file.size > maxSize * 1024 * 1024) {
      return `File size must be less than ${maxSize}MB`
    }

    const allowedTypes = accept.split(',').map(type => type.trim())
    const isAllowedType = allowedTypes.some(type => {
      if (type.startsWith('.')) {
        return file.name.toLowerCase().endsWith(type.toLowerCase())
      }
      if (type.includes('*')) {
        const baseType = type.split('/')[0]
        return file.type.startsWith(baseType)
      }
      return file.type === type
    })

    if (!isAllowedType) {
      return `File type not supported. Allowed: ${accept}`
    }

    return null
  }, [accept, maxSize])

  const handleFileSelect = useCallback((file: File | null) => {
    setError(null)
    if (file) {
      const validationError = validateFile(file)
      if (validationError) {
        setError(validationError)
        onFileSelect(null)
        return
      }
    }
    onFileSelect(file)
  }, [validateFile, onFileSelect])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)

    if (disabled) return

    const files = Array.from(e.dataTransfer.files)
    if (files.length > 0) {
      handleFileSelect(files[0])
    }
  }, [handleFileSelect, disabled])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    if (!disabled) {
      setIsDragOver(true)
    }
  }, [disabled])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }, [])

  const handleFileInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null
    handleFileSelect(file)
  }, [handleFileSelect])

  const removeFile = useCallback(() => {
    handleFileSelect(null)
    setError(null)
  }, [handleFileSelect])

  return (
    <div className={cn("space-y-2", className)}>
      <label className="text-sm font-medium text-gray-200">{label}</label>

      <Card
        className={cn(
          "relative border-2 border-dashed transition-all duration-200",
          isDragOver && !disabled
            ? "border-blue-400 bg-blue-500/10"
            : selectedFile
            ? "border-emerald-500/50 bg-emerald-500/5"
            : error
            ? "border-red-500/50 bg-red-500/5"
            : "border-gray-600 bg-gray-900/20 hover:border-gray-500",
          disabled && "opacity-50 cursor-not-allowed"
        )}
      >
        <div
          className="p-6 text-center cursor-pointer"
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => !disabled && document.getElementById(`file-input-${label.replace(/\s+/g, '-')}`)?.click()}
        >
          <input
            id={`file-input-${label.replace(/\s+/g, '-')}`}
            type="file"
            accept={accept}
            onChange={handleFileInputChange}
            className="hidden"
            disabled={disabled}
          />

          {selectedFile ? (
            <div className="space-y-3">
              <div className="flex items-center justify-center gap-2">
                <CheckCircle className="h-8 w-8 text-emerald-400" />
                <span className="text-lg font-medium text-emerald-300">File Selected</span>
              </div>
              <div className="flex items-center justify-center gap-2 p-3 bg-black/20 rounded-lg">
                <File className="h-5 w-5 text-gray-400" />
                <span className="text-sm text-gray-300 truncate max-w-[200px]">
                  {selectedFile.name}
                </span>
                <span className="text-xs text-gray-500">
                  ({(selectedFile.size / 1024 / 1024).toFixed(1)}MB)
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={(e) => {
                    e.stopPropagation()
                    removeFile()
                  }}
                  className="h-6 w-6 hover:bg-red-500/20"
                >
                  <X className="h-4 w-4 text-red-400" />
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <Upload className={cn(
                "h-12 w-12 mx-auto transition-colors",
                isDragOver ? "text-blue-400" : "text-gray-400"
              )} />
              <div>
                <p className="text-lg font-medium text-gray-200">
                  {isDragOver ? "Drop your file here" : "Click to upload or drag and drop"}
                </p>
                <p className="text-sm text-gray-400 mt-1">
                  {accept} (max {maxSize}MB)
                </p>
              </div>
            </div>
          )}
        </div>
      </Card>

      {error && (
        <div className="flex items-center gap-2 text-sm text-red-400">
          <AlertCircle className="h-4 w-4" />
          {error}
        </div>
      )}
    </div>
  )
}