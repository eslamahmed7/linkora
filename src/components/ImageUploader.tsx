import { useState, useRef } from 'react'
import { uploadAPI } from '@/api/upload'
import { useNotification } from '@/hooks/useNotification'
import { X, Image as ImageIcon } from 'lucide-react'
import { MAX_IMAGE_SIZE, ALLOWED_IMAGE_TYPES } from '@/types/upload'
import type { UploadedFile } from '@/types/upload'

interface ImageUploaderProps {
  onImageUploaded: (file: UploadedFile) => void
  currentImage?: string
  label?: string
  aspectRatio?: number
}

export function ImageUploader({
  onImageUploaded,
  currentImage,
  label = 'Upload Image',
  aspectRatio,
}: ImageUploaderProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [preview, setPreview] = useState<string | undefined>(currentImage)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const notification = useNotification()

  const handleFileSelect = async (file: File) => {
    try {
      if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
        notification.error(
          `Invalid file type. Allowed types: ${ALLOWED_IMAGE_TYPES.join(', ')}`
        )
        return
      }

      if (file.size > MAX_IMAGE_SIZE) {
        notification.error(
          `File too large. Maximum size: ${MAX_IMAGE_SIZE / 1024 / 1024}MB`
        )
        return
      }

      setIsLoading(true)

      const reader = new FileReader()
      reader.onload = (e) => {
        setPreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)

      const response = await uploadAPI.uploadImage(file)
      onImageUploaded(response.file)
      notification.success('Image uploaded successfully')
    } catch (error) {
      notification.error('Failed to upload image')
      setPreview(currentImage)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    const files = e.dataTransfer.files
    if (files.length > 0) {
      handleFileSelect(files[0])
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.currentTarget.files
    if (files && files.length > 0) {
      handleFileSelect(files[0])
    }
  }

  return (
    <div className="space-y-4">
      <label className="text-sm font-medium text-neutral-900 dark:text-neutral-50">
        {label}
      </label>

      {preview ? (
        <div className="relative rounded-lg overflow-hidden border-2 border-neutral-200 dark:border-neutral-800">
          <img
            src={preview}
            alt="Preview"
            className="w-full h-64 object-cover"
            style={aspectRatio ? { aspectRatio } : undefined}
          />
          <button
            onClick={() => {
              setPreview(undefined)
              if (fileInputRef.current) fileInputRef.current.value = ''
            }}
            className="absolute top-2 right-2 p-2 rounded-lg bg-red-600 hover:bg-red-700 text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-neutral-300 dark:border-neutral-700 rounded-lg p-8 text-center cursor-pointer hover:border-accent-600 dark:hover:border-accent-400 transition-colors"
        >
          <ImageIcon className="w-12 h-12 mx-auto text-neutral-400 dark:text-neutral-600 mb-3" />
          <p className="font-medium text-neutral-900 dark:text-neutral-50">
            Click to upload or drag and drop
          </p>
          <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
            PNG, JPG, GIF up to {MAX_IMAGE_SIZE / 1024 / 1024}MB
          </p>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept={ALLOWED_IMAGE_TYPES.join(',')}
        onChange={handleInputChange}
        disabled={isLoading}
        className="hidden"
      />

      {isLoading && (
        <div className="text-center py-4">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-accent-600"></div>
          <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-2">
            Uploading...
          </p>
        </div>
      )}
    </div>
  )
}
