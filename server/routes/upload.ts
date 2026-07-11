import { Router, Request, Response } from 'express'
import { supabase } from '../utils/supabase'
import { authenticateToken } from '../middleware/auth'
import { sendSuccess, sendError } from '../utils/response'

const router = Router()

// ─── Upload Image ──────────────────────────────────────────────────────

router.post('/image', authenticateToken, async (req: Request, res: Response) => {
  try {
    const user = (req as any).user
    if (!user) return sendError(res, 'Unauthorized', 401)

    const { file, name, isPublic } = req.body
    if (!file) return sendError(res, 'No file data provided')

    const buffer = Buffer.from(file, 'base64')
    const ext = name?.split('.').pop() || 'png'
    const filePath = `${user.id}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`

    const { data, error } = await supabase.storage
      .from('uploads')
      .upload(filePath, buffer, { contentType: `image/${ext}`, upsert: false })

    if (error) throw error

    const { data: urlData } = supabase.storage.from('uploads').getPublicUrl(filePath)

    const { data: fileRecord } = await supabase.from('uploaded_files').insert({
      user_id: user.id,
      name: name || filePath.split('/').pop(),
      url: urlData.publicUrl,
      mime_type: `image/${ext}`,
      file_size: buffer.length,
      is_public: isPublic !== false,
      bucket: 'uploads',
      path: filePath,
    }).select().single()

    sendSuccess(res, { file: fileRecord || { url: urlData.publicUrl, path: filePath } })
  } catch (err: any) {
    sendError(res, err.message || 'Upload failed')
  }
})

// ─── Upload File ───────────────────────────────────────────────────────

router.post('/file', authenticateToken, async (req: Request, res: Response) => {
  try {
    const user = (req as any).user
    if (!user) return sendError(res, 'Unauthorized', 401)

    const { file, name, mimeType, isPublic } = req.body
    if (!file) return sendError(res, 'No file data provided')

    const buffer = Buffer.from(file, 'base64')
    const ext = name?.split('.').pop() || 'bin'
    const filePath = `${user.id}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`

    const { data, error } = await supabase.storage
      .from('uploads')
      .upload(filePath, buffer, { contentType: mimeType || 'application/octet-stream', upsert: false })

    if (error) throw error

    const { data: urlData } = supabase.storage.from('uploads').getPublicUrl(filePath)

    const { data: fileRecord } = await supabase.from('uploaded_files').insert({
      user_id: user.id,
      name: name || filePath.split('/').pop(),
      url: urlData.publicUrl,
      mime_type: mimeType || `application/${ext}`,
      file_size: buffer.length,
      is_public: isPublic === true,
      bucket: 'uploads',
      path: filePath,
    }).select().single()

    sendSuccess(res, { file: fileRecord || { url: urlData.publicUrl, path: filePath } })
  } catch (err: any) {
    sendError(res, err.message || 'Upload failed')
  }
})

// ─── List User Files ───────────────────────────────────────────────────

router.get('/files', authenticateToken, async (req: Request, res: Response) => {
  try {
    const user = (req as any).user
    if (!user) return sendError(res, 'Unauthorized', 401)

    const { page = 1, limit = 50, bucket } = req.query
    const offset = (Number(page) - 1) * Number(limit)

    let query = supabase.from('uploaded_files').select('*', { count: 'exact' }).eq('user_id', user.id)
    if (bucket) query = query.eq('bucket', bucket as string)
    query = query.order('created_at', { ascending: false }).range(offset, offset + Number(limit) - 1)

    const { data, count, error } = await query
    if (error) throw error

    sendSuccess(res, { files: data || [], total: count || 0 })
  } catch (err) {
    sendError(res, 'Failed to load files')
  }
})

// ─── Delete File ───────────────────────────────────────────────────────

router.delete('/files/:id', authenticateToken, async (req: Request, res: Response) => {
  try {
    const user = (req as any).user
    if (!user) return sendError(res, 'Unauthorized', 401)

    const { data: file } = await supabase.from('uploaded_files').select('*').eq('id', req.params.id).eq('user_id', user.id).single()
    if (!file) return sendError(res, 'File not found', 404)

    if (file.path) {
      await supabase.storage.from(file.bucket || 'uploads').remove([file.path])
    }

    await supabase.from('uploaded_files').delete().eq('id', req.params.id)
    sendSuccess(res, { deleted: true })
  } catch (err) {
    sendError(res, 'Failed to delete file')
  }
})

// ─── Update File ───────────────────────────────────────────────────────

router.put('/files/:id', authenticateToken, async (req: Request, res: Response) => {
  try {
    const user = (req as any).user
    if (!user) return sendError(res, 'Unauthorized', 401)

    const { name, isPublic } = req.body
    const updates: Record<string, unknown> = {}
    if (name !== undefined) updates.name = name
    if (isPublic !== undefined) updates.is_public = isPublic
    updates.updated_at = new Date().toISOString()

    const { data, error } = await supabase.from('uploaded_files').update(updates).eq('id', req.params.id).eq('user_id', user.id).select().single()
    if (error) throw error

    sendSuccess(res, { file: data })
  } catch (err) {
    sendError(res, 'Failed to update file')
  }
})

export default router
