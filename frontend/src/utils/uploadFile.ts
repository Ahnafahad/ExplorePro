import { supabase } from '../lib/supabase'

export type FileType = 'profile' | 'verification'

interface UploadFileOptions {
  file: File
  fileType: FileType
  userId: string
}

interface UploadResult {
  success: boolean
  url?: string
  error?: string
}

/**
 * Upload a file to Supabase Storage
 *
 * @param options - Upload options including file, fileType, and userId
 * @returns Upload result with public URL or error
 */
export async function uploadFile({
  file,
  fileType,
  userId,
}: UploadFileOptions): Promise<UploadResult> {
  try {
    // Validate file
    const validationError = validateFile(file, fileType)
    if (validationError) {
      return { success: false, error: validationError }
    }

    // Generate unique filename
    const fileExtension = file.name.split('.').pop()
    const filename = `${userId}-${Date.now()}.${fileExtension}`
    const filePath = `${fileType}/${filename}`

    // Determine bucket based on file type
    const bucket = fileType === 'profile' ? 'profiles' : 'verifications'

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
      })

    if (error) {
      console.error('Supabase upload error:', error)
      return { success: false, error: error.message }
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(data.path)

    return {
      success: true,
      url: urlData.publicUrl,
    }
  } catch (error: any) {
    console.error('Upload file error:', error)
    return {
      success: false,
      error: error.message || 'Failed to upload file',
    }
  }
}

/**
 * Validate file before upload
 */
function validateFile(file: File, fileType: FileType): string | null {
  // Size limits
  const maxSize = fileType === 'profile' ? 5 * 1024 * 1024 : 10 * 1024 * 1024 // 5MB for profile, 10MB for verification
  if (file.size > maxSize) {
    const maxMB = maxSize / (1024 * 1024)
    return `File size exceeds ${maxMB}MB limit`
  }

  // File type validation
  const allowedTypes = {
    profile: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
    verification: ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'],
  }

  if (!allowedTypes[fileType].includes(file.type)) {
    return `Invalid file type. Allowed types: ${allowedTypes[fileType].join(', ')}`
  }

  return null
}

/**
 * Delete a file from Supabase Storage
 */
export async function deleteFile(
  url: string,
  fileType: FileType
): Promise<{ success: boolean; error?: string }> {
  try {
    // Extract path from URL
    const urlObj = new URL(url)
    const pathParts = urlObj.pathname.split('/')
    const bucket = fileType === 'profile' ? 'profiles' : 'verifications'
    const filePath = pathParts.slice(pathParts.indexOf(bucket) + 1).join('/')

    const { error } = await supabase.storage.from(bucket).remove([filePath])

    if (error) {
      console.error('Supabase delete error:', error)
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch (error: any) {
    console.error('Delete file error:', error)
    return { success: false, error: error.message || 'Failed to delete file' }
  }
}
