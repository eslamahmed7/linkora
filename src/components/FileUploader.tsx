import { useState, useRef } from 'react'
import { uploadAPI } from '@/api/upload'
import { useNotification } from '@/hooks/useNotification'
import { Upload, File as FileIcon, Trash2 } from 'lucide-react'
import { MAX_FILE_SIZE, ALLOWED_FILE_TYPES } from '@/types/upload'
import type { UploadedFile } from '@/types/upload'

interface FileUploaderProps {
  onFileUploaded: (file: UploadedFile) => void
  multiple?: boolean
  label?: string
}

export function FileUploader({
  onFileUploaded,
  multiple = false,
  label = 'Upload Files',
}: FileUploaderProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [files, setFiles] = useState<UploadedFile[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)
  const notification = useNotification()

  const handleFileSelect = async (selectedFile: File) => {
    try {
      if (!ALLOWED_FILE_TYPES.includes(selectedFile.type)) {
        notification.error('File type not allowed')
        return
      }

      if (selectedFile.size > MAX_FILE_SIZE) {
        notification.error(
          `File too large. Maximum size: ${MAX_FILE_SIZE / 1024 / 1024}MB`
        )
        return
      }

      setIsLoading(true)
      const response = await uploadAPI.uploadFile(selectedFile)
      const uploadedFile = response.file

      setFiles([...files, uploadedFile])
      onFileUploaded(uploadedFile)
      notification.success(`${selectedFile.name} uploaded successfully`)
    } catch (error) {
      notification.error('Failed to upload file')
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
    const droppedFiles = e.dataTransfer.files
    for (let i = 0; i < droppedFiles.length; i++) {
      handleFileSelect(droppedFiles[i])
      if (!multiple) break
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.currentTarget.files
    if (selectedFiles) {
      for (let i = 0; i < selectedFiles.length; i++) {
        handleFileSelect(selectedFiles[i])
        if (!multiple) break
      }
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await uploadAPI.deleteFile(id)
      setFiles(files.filter((f) => f.id !== id))
      notification.success('File deleted')
    } catch (error) {
      notification.error('Failed to delete file')
    }
  }

  return (
    <div className="space-y-4">
      <label className="text-sm font-medium text-neutral-900 dark:text-neutral-50">
        {label}
      </label>

      <div
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className="border-2 border-dashed border-neutral-300 dark:border-neutral-700 rounded-lg p-8 text-center cursor-pointer hover:border-accent-600 dark:hover:border-accent-400 transition-colors"
      >
        <Upload className="w-12 h-12 mx-auto text-neutral-400 dark:text-neutral-600 mb-3" />
        <p className="font-medium text-neutral-900 dark:text-neutral-50">
          Click to upload or drag and drop
        </p>
        <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
          Max {MAX_FILE_SIZE / 1024 / 1024}MB per file
        </p>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        multiple={multiple}
        accept={ALLOWED_FILE_TYPES.join(',')}
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

      {files.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-medium text-neutral-900 dark:text-neutral-50">
            Uploaded Files
          </p>
          <div className="space-y-2">
            {files.map((file) => (
              <div
                key={file.id}
                className="flex items-center justify-between p-3 rounded-lg border border-neutral-200 dark:border-neutral-800"
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <FileIcon className="w-5 h-5 text-neutral-400 flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-neutral-900 dark:text-neutral-50 truncate">
                      {file.name}
                    </p>
                    <p className="text-xs text-neutral-500">
                      {(file.size / 1024 / 1024).toFixed(2)}MB
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => handleDelete(file.id)}
                  className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
