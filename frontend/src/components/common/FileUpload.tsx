import { useState, useRef } from 'react'
import { Upload, X, Loader2, CheckCircle, AlertCircle } from 'lucide-react'
import { uploadFile, FileType } from '../../utils/uploadFile'
import { Button } from './Button'

interface FileUploadProps {
  fileType: FileType
  userId: string
  currentUrl?: string
  onUploadSuccess: (url: string) => void
  label?: string
  accept?: string
}

export function FileUpload({
  fileType,
  userId,
  currentUrl,
  onUploadSuccess,
  label = 'Upload File',
  accept,
}: FileUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [uploadSuccess, setUploadSuccess] = useState(false)
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentUrl || null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploadError(null)
    setUploadSuccess(false)
    setIsUploading(true)

    // Show preview for images
    if (file.type.startsWith('image/')) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setPreviewUrl(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }

    try {
      const result = await uploadFile({ file, fileType, userId })

      if (result.success && result.url) {
        setUploadSuccess(true)
        setPreviewUrl(result.url)
        onUploadSuccess(result.url)
        setTimeout(() => setUploadSuccess(false), 3000)
      } else {
        setUploadError(result.error || 'Upload failed')
        setPreviewUrl(currentUrl || null)
      }
    } catch (error: any) {
      setUploadError(error.message || 'Upload failed')
      setPreviewUrl(currentUrl || null)
    } finally {
      setIsUploading(false)
    }
  }

  const handleRemove = () => {
    setPreviewUrl(null)
    setUploadError(null)
    setUploadSuccess(false)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const getAcceptString = () => {
    if (accept) return accept
    if (fileType === 'profile') return 'image/jpeg,image/jpg,image/png,image/webp'
    return 'image/jpeg,image/jpg,image/png,application/pdf'
  }

  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>

      {/* Preview */}
      {previewUrl && (
        <div className="mb-4 relative inline-block">
          {previewUrl.toLowerCase().endsWith('.pdf') ? (
            <div className="w-32 h-32 bg-gray-100 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                <p className="text-xs text-gray-600">PDF Document</p>
              </div>
            </div>
          ) : (
            <img
              src={previewUrl}
              alt="Preview"
              className="w-32 h-32 object-cover rounded-lg border-2 border-gray-200"
            />
          )}
          <button
            onClick={handleRemove}
            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
            type="button"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Upload Button */}
      <div className="flex items-center gap-3">
        <input
          ref={fileInputRef}
          type="file"
          accept={getAcceptString()}
          onChange={handleFileSelect}
          className="hidden"
          id={`file-upload-${fileType}`}
        />
        <label htmlFor={`file-upload-${fileType}`}>
          <Button
            type="button"
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="cursor-pointer"
          >
            {isUploading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="w-4 h-4 mr-2" />
                {previewUrl ? 'Change' : 'Upload'} {fileType === 'profile' ? 'Photo' : 'Document'}
              </>
            )}
          </Button>
        </label>

        {uploadSuccess && (
          <div className="flex items-center text-green-600 text-sm">
            <CheckCircle className="w-4 h-4 mr-1" />
            Uploaded successfully!
          </div>
        )}
      </div>

      {/* Error Message */}
      {uploadError && (
        <div className="mt-2 flex items-start text-red-600 text-sm">
          <AlertCircle className="w-4 h-4 mr-1 mt-0.5 flex-shrink-0" />
          <span>{uploadError}</span>
        </div>
      )}

      {/* Help Text */}
      <p className="mt-2 text-xs text-gray-500">
        {fileType === 'profile'
          ? 'JPG, PNG or WebP. Max 5MB.'
          : 'JPG, PNG or PDF. Max 10MB.'}
      </p>
    </div>
  )
}
