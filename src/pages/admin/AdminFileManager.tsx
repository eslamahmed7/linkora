import { useState, useEffect, useRef, useCallback } from 'react'
import {
  Upload, HardDrive, Image, FileText, Folder, CloudUpload,
  Trash2, Search, RefreshCw, Eye, Download, Loader2, X, AlertTriangle,
  ChevronRight, ArrowLeft, FolderOpen
} from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { useNotification } from '@/hooks/useNotification'

interface FolderItem {
  name: string
  type: 'folder' | 'file'
  size: number
  modified: string
  contentType?: string
}

const BUCKET = 'uploads'

function formatSize(bytes: number): string {
  if (bytes === 0) return '--'
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function getFileType(name: string): 'image' | 'document' | 'video' | 'other' {
  const ext = name.split('.').pop()?.toLowerCase() || ''
  if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'ico', 'bmp'].includes(ext)) return 'image'
  if (['pdf', 'doc', 'docx', 'txt', 'rtf', 'xls', 'xlsx', 'csv'].includes(ext)) return 'document'
  if (['mp4', 'webm', 'avi', 'mov', 'mkv'].includes(ext)) return 'video'
  return 'other'
}

function getFileIcon(name: string) {
  const type = getFileType(name)
  if (type === 'image') return <Image className="w-4 h-4 text-purple-500" />
  if (type === 'document') return <FileText className="w-4 h-4 text-blue-500" />
  if (type === 'video') return <FileText className="w-4 h-4 text-red-500" />
  return <FileText className="w-4 h-4 text-neutral-400" />
}

export function AdminFileManagerPage() {
  const notification = useNotification()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [currentPath, setCurrentPath] = useState('')
  const [files, setFiles] = useState<FolderItem[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [deleteTarget, setDeleteTarget] = useState<FolderItem | null>(null)
  const [previewTarget, setPreviewTarget] = useState<FolderItem | null>(null)
  const [stats, setStats] = useState({ totalFiles: 0, totalSize: 0, images: 0, documents: 0 })

  const loadFiles = useCallback(async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase.storage.from(BUCKET).list(currentPath, {
        limit: 200,
        sortBy: { column: 'updated_at', order: 'desc' },
      })
      if (error) throw error

      const items: FolderItem[] = (data || []).map(f => {
        const isFolder = !f.id
        return {
          name: f.name,
          type: isFolder ? 'folder' as const : 'file' as const,
          size: f.metadata?.size ? Number(f.metadata.size) : 0,
          modified: f.updated_at || f.created_at || '',
          contentType: f.metadata?.mimetype as string | undefined,
        }
      })

      const folders = items.filter(i => i.type === 'folder')
      const fileItems = items.filter(i => i.type === 'file')
      setFiles([...folders, ...fileItems])

      const totalSize = fileItems.reduce((acc, f) => acc + f.size, 0)
      const images = fileItems.filter(f => getFileType(f.name) === 'image').length
      const documents = fileItems.filter(f => getFileType(f.name) === 'document').length
      setStats({ totalFiles: fileItems.length, totalSize, images, documents })
    } catch (err: any) {
      console.error('Failed to load files:', err)
    } finally {
      setLoading(false)
    }
  }, [currentPath])

  useEffect(() => { loadFiles() }, [loadFiles])

  const navigateToFolder = (folderName: string) => {
    const newPath = currentPath ? `${currentPath}/${folderName}` : folderName
    setCurrentPath(newPath)
  }

  const navigateUp = () => {
    const parts = currentPath.split('/')
    parts.pop()
    setCurrentPath(parts.join('/'))
  }

  const uploadFiles = async (fileList: FileList | File[]) => {
    const arr = Array.from(fileList)
    if (arr.length === 0) return

    setUploading(true)
    let successCount = 0
    for (const file of arr) {
      const path = currentPath ? `${currentPath}/${file.name}` : file.name
      try {
        const { error } = await supabase.storage.from(BUCKET).upload(path, file, {
          upsert: true,
          contentType: file.type,
        })
        if (error) {
          if (error.message?.includes('Bucket not found')) {
            notification.error('Storage bucket "uploads" not found. Create it in Supabase Dashboard > Storage.')
            setUploading(false)
            return
          }
          throw error
        }
        successCount++
      } catch (err: any) {
        console.error(`Failed to upload ${file.name}:`, err)
      }
    }
    if (successCount > 0) {
      notification.success(`Uploaded ${successCount} file${successCount > 1 ? 's' : ''}`)
      loadFiles()
    }
    setUploading(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    if (e.dataTransfer.files.length > 0) uploadFiles(e.dataTransfer.files)
  }

  const handleDelete = async (item: FolderItem) => {
    const path = currentPath ? `${currentPath}/${item.name}` : item.name
    try {
      if (item.type === 'folder') {
        const { data: nested } = await supabase.storage.from(BUCKET).list(path)
        if (nested && nested.length > 0) {
          const paths = nested.map(f => `${path}/${f.name}`)
          await supabase.storage.from(BUCKET).remove(paths)
        }
      } else {
        await supabase.storage.from(BUCKET).remove([path])
      }
      notification.success(`Deleted ${item.name}`)
      setDeleteTarget(null)
      loadFiles()
    } catch (err: any) {
      notification.error(`Failed to delete: ${err.message}`)
    }
  }

  const getFileUrl = (fileName: string): string => {
    const path = currentPath ? `${currentPath}/${fileName}` : fileName
    const { data } = supabase.storage.from(BUCKET).getPublicUrl(path)
    return data.publicUrl
  }

  const pathParts = currentPath ? currentPath.split('/') : []

  const filteredFiles = searchQuery
    ? files.filter(f => f.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : files

  return (
    <div className="p-4 lg:p-6 space-y-6 max-w-[1400px] mx-auto">
      <input
        ref={fileInputRef}
        type="file"
        multiple
        className="hidden"
        onChange={e => { if (e.target.files) uploadFiles(e.target.files); e.target.value = '' }}
      />

      <div>
        <h1 className="text-2xl font-extrabold text-neutral-900 dark:text-white tracking-tight">File Manager</h1>
        <p className="text-sm text-neutral-500 mt-0.5">Manage uploaded files and media via Supabase Storage</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        {[
          { icon: HardDrive, label: 'Total Size', value: formatSize(stats.totalSize), color: 'text-accent-600' },
          { icon: Image, label: 'Images', value: String(stats.images), color: 'text-purple-600' },
          { icon: FileText, label: 'Documents', value: String(stats.documents), color: 'text-blue-600' },
          { icon: Folder, label: 'Files', value: String(stats.totalFiles), color: 'text-green-600' },
        ].map(({ icon: Icon, label, value, color }) => (
          <div key={label} className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 p-4 flex items-center gap-3">
            <div className={`p-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-800 ${color}`}>
              <Icon className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-neutral-500">{label}</p>
              <p className="text-lg font-extrabold text-neutral-900 dark:text-white">{value}</p>
            </div>
          </div>
        ))}
      </div>

      <div
        onDragOver={e => { e.preventDefault(); setIsDragging(true) }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-2xl p-8 text-center transition-colors cursor-pointer ${
          isDragging
            ? 'border-accent-500 bg-accent-50 dark:bg-accent-950/10'
            : 'border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 hover:border-neutral-300 dark:hover:border-neutral-700'
        }`}
      >
        {uploading ? (
          <div className="flex items-center justify-center gap-2">
            <Loader2 className="w-8 h-8 text-accent-500 animate-spin" />
            <p className="text-sm font-bold text-neutral-900 dark:text-white">Uploading...</p>
          </div>
        ) : (
          <>
            <CloudUpload className={`w-10 h-10 mx-auto mb-2 ${isDragging ? 'text-accent-500' : 'text-neutral-300 dark:text-neutral-600'}`} />
            <p className="text-sm font-bold text-neutral-900 dark:text-white mb-1">
              {isDragging ? 'Drop files here' : 'Drag & drop files here'}
            </p>
            <p className="text-xs text-neutral-400">or click to browse (max 10MB)</p>
          </>
        )}
      </div>

      <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 overflow-hidden">
        <div className="px-5 py-3 border-b border-neutral-100 dark:border-neutral-800 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 min-w-0">
            {currentPath && (
              <button onClick={navigateUp} className="p-1.5 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors shrink-0">
                <ArrowLeft className="w-4 h-4 text-neutral-500" />
              </button>
            )}
            <div className="flex items-center gap-1 text-sm min-w-0 overflow-x-auto">
              <button
                onClick={() => setCurrentPath('')}
                className="text-neutral-500 hover:text-accent-600 transition-colors whitespace-nowrap"
              >
                root
              </button>
              {pathParts.map((part, i) => (
                <span key={i} className="flex items-center gap-1 whitespace-nowrap">
                  <ChevronRight className="w-3 h-3 text-neutral-300 dark:text-neutral-600 shrink-0" />
                  <button
                    onClick={() => setCurrentPath(pathParts.slice(0, i + 1).join('/'))}
                    className="text-neutral-500 hover:text-accent-600 transition-colors"
                  >
                    {part}
                  </button>
                </span>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-neutral-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Filter..."
                className="pl-8 pr-3 py-1.5 text-xs rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-white w-32 focus:outline-none focus:ring-1 focus:ring-accent-500"
              />
            </div>
            <button onClick={loadFiles} className="p-1.5 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors" title="Refresh">
              <RefreshCw className="w-4 h-4 text-neutral-500" />
            </button>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-accent-600 hover:bg-accent-700 text-white transition-colors"
            >
              <Upload className="w-3.5 h-3.5" />
              Upload
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-6 h-6 text-accent-500 animate-spin" />
          </div>
        ) : filteredFiles.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-neutral-400">
            <FolderOpen className="w-10 h-10 mb-2" />
            <p className="text-sm font-medium">{currentPath ? 'This folder is empty' : 'No files uploaded yet'}</p>
          </div>
        ) : (
          <div className="divide-y divide-neutral-50 dark:divide-neutral-800/50">
            {filteredFiles.map(item => {
              const isImage = getFileType(item.name) === 'image'
              return (
                <div key={item.name} className="flex items-center gap-3 px-5 py-2.5 hover:bg-neutral-50 dark:hover:bg-neutral-800/30 transition-colors group">
                  {item.type === 'folder' ? (
                    <button onClick={() => navigateToFolder(item.name)} className="flex items-center gap-3 flex-1 min-w-0 text-left">
                      <Folder className="w-5 h-5 text-yellow-500 shrink-0" />
                      <span className="text-sm font-medium text-neutral-900 dark:text-white truncate">{item.name}</span>
                    </button>
                  ) : (
                    <>
                      {isImage ? (
                        <div className="w-8 h-8 rounded-lg overflow-hidden bg-neutral-100 dark:bg-neutral-800 shrink-0">
                          <img
                            src={getFileUrl(item.name)}
                            alt={item.name}
                            className="w-full h-full object-cover"
                            onError={e => { (e.target as HTMLImageElement).style.display = 'none' }}
                          />
                        </div>
                      ) : (
                        <div className="w-8 h-8 rounded-lg bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center shrink-0">
                          {getFileIcon(item.name)}
                        </div>
                      )}
                      <span className="text-sm font-medium text-neutral-900 dark:text-white truncate flex-1">{item.name}</span>
                      <span className="text-xs text-neutral-400 w-16 text-right hidden sm:block">{formatSize(item.size)}</span>
                      <span className="text-xs text-neutral-400 w-20 text-right hidden md:block">
                        {item.modified ? new Date(item.modified).toLocaleDateString() : '--'}
                      </span>
                    </>
                  )}
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                    {item.type === 'file' && (
                      <>
                        {isImage && (
                          <button
                            onClick={() => setPreviewTarget(item)}
                            className="p-1.5 rounded-lg hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors"
                            title="Preview"
                          >
                            <Eye className="w-3.5 h-3.5 text-neutral-500" />
                          </button>
                        )}
                        <a
                          href={getFileUrl(item.name)}
                          download={item.name}
                          className="p-1.5 rounded-lg hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors"
                          title="Download"
                        >
                          <Download className="w-3.5 h-3.5 text-neutral-500" />
                        </a>
                      </>
                    )}
                    <button
                      onClick={() => setDeleteTarget(item)}
                      className="p-1.5 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-3.5 h-3.5 text-red-500" />
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setDeleteTarget(null)}>
          <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 p-6 max-w-sm w-full shadow-xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 rounded-xl bg-red-100 dark:bg-red-900/30">
                <AlertTriangle className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-neutral-900 dark:text-white">Delete {deleteTarget.type === 'folder' ? 'Folder' : 'File'}</h3>
                <p className="text-xs text-neutral-500">This action cannot be undone.</p>
              </div>
            </div>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4">
              Are you sure you want to delete <span className="font-semibold text-neutral-900 dark:text-white">{deleteTarget.name}</span>?
              {deleteTarget.type === 'folder' && ' All contents will also be deleted.'}
            </p>
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => setDeleteTarget(null)}
                className="px-4 py-2 text-xs font-semibold rounded-xl border border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteTarget)}
                className="px-4 py-2 text-xs font-semibold rounded-xl bg-red-600 hover:bg-red-700 text-white transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {previewTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4" onClick={() => setPreviewTarget(null)}>
          <div className="relative max-w-4xl w-full" onClick={e => e.stopPropagation()}>
            <button
              onClick={() => setPreviewTarget(null)}
              className="absolute -top-2 -right-2 p-2 rounded-full bg-white dark:bg-neutral-800 shadow-lg hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors z-10"
            >
              <X className="w-4 h-4 text-neutral-600 dark:text-neutral-400" />
            </button>
            <img
              src={getFileUrl(previewTarget.name)}
              alt={previewTarget.name}
              className="max-w-full max-h-[80vh] rounded-2xl shadow-xl mx-auto object-contain"
            />
            <p className="text-center text-sm text-white/70 mt-3">{previewTarget.name}</p>
          </div>
        </div>
      )}
    </div>
  )
}
