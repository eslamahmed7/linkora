import { Router, Request, Response } from 'express'
import { supabase } from '../utils/supabase'
import { requireRole, requireMinRole, AdminRequest } from '../middleware/admin'
import { sendSuccess, sendError } from '../utils/response'

const router = Router()

// ─── DASHBOARD ─────────────────────────────────────────────────────────

router.get('/dashboard/stats', requireMinRole('viewer'), async (req: AdminRequest, res: Response) => {
  try {
    const [usersRes, pagesRes, qrRes, nfcRes, designsRes, submissionsRes, suggestionsRes, reportsRes] = await Promise.all([
      supabase.from('users').select('id, role, is_suspended, created_at', { count: 'exact' }),
      supabase.from('link_pages').select('id, is_published, view_count, click_count', { count: 'exact' }),
      supabase.from('qr_codes').select('id, scan_count, is_active', { count: 'exact' }),
      supabase.from('nfc_tags').select('id, is_active, scan_count', { count: 'exact' }),
      supabase.from('design_marketplace').select('id, type, status, download_count', { count: 'exact' }),
      supabase.from('community_submissions').select('id, status', { count: 'exact' }),
      supabase.from('suggestions').select('id, status, vote_count', { count: 'exact' }),
      supabase.from('bug_reports').select('id, status, priority', { count: 'exact' }),
    ])

    const users = usersRes.data || []
    const pages = pagesRes.data || []
    const qrs = qrRes.data || []
    const nfcs = nfcRes.data || []
    const designs = designsRes.data || []
    const submissions = submissionsRes.data || []
    const suggestions = suggestionsRes.data || []
    const bugs = reportsRes.data || []

    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const weekAgo = new Date(today.getTime() - 7 * 86400000)

    const dailyRegistrations = users.filter(u => new Date(u.created_at) >= today).length
    const weeklyRegistrations = users.filter(u => new Date(u.created_at) >= weekAgo).length

    const totalViews = pages.reduce((s, p) => s + (p.view_count || 0), 0)
    const totalScans = qrs.reduce((s, q) => s + (q.scan_count || 0), 0) + nfcs.reduce((s, n) => s + (n.scan_count || 0), 0)

    const recentActivityRes = await supabase
      .from('activity_logs')
      .select('*, users!activity_logs_user_id_fkey(display_name, avatar_url)')
      .order('created_at', { ascending: false })
      .limit(20)

    const recentSubmissions = await supabase
      .from('community_submissions')
      .select('id, title, type, status, created_at, users!community_submissions_user_id_fkey(display_name, avatar_url)')
      .order('created_at', { ascending: false })
      .limit(10)

    const recentSuggestions = await supabase
      .from('suggestions')
      .select('id, title, category, status, vote_count, created_at, users!suggestions_user_id_fkey(display_name)')
      .order('created_at', { ascending: false })
      .limit(10)

    sendSuccess(res, {
      totalUsers: usersRes.count || 0,
      activeUsers: users.filter(u => !u.is_suspended).length,
      premiumUsers: users.filter(u => u.role === 'admin' || u.role === 'super_admin').length,
      totalPages: pagesRes.count || 0,
      totalQRCodes: qrRes.count || 0,
      totalNFCCards: nfcRes.count || 0,
      totalDesigns: designsRes.count || 0,
      totalSubmissions: submissionsRes.count || 0,
      totalSuggestions: suggestionsRes.count || 0,
      totalBugReports: reportsRes.count || 0,
      totalViews,
      totalScans,
      dailyRegistrations,
      weeklyRegistrations,
      recentActivity: recentActivityRes.data || [],
      recentSubmissions: recentSubmissions.data || [],
      recentSuggestions: recentSuggestions.data || [],
      designsByType: designs.reduce((acc, d) => { acc[d.type] = (acc[d.type] || 0) + 1; return acc }, {} as Record<string, number>),
      submissionsByStatus: submissions.reduce((acc, s) => { acc[s.status] = (acc[s.status] || 0) + 1; return acc }, {} as Record<string, number>),
      bugsByPriority: bugs.reduce((acc, b) => { acc[b.priority] = (acc[b.priority] || 0) + 1; return acc }, {} as Record<string, number>),
    })
  } catch (err) {
    sendError(res, 'Failed to load dashboard stats')
  }
})

router.get('/dashboard/analytics', requireMinRole('viewer'), async (req: AdminRequest, res: Response) => {
  try {
    const { period = 'daily', days = 30 } = req.query
    const since = new Date(Date.now() - Number(days) * 86400000).toISOString()

    const { data: registrations } = await supabase
      .from('users')
      .select('created_at')
      .gte('created_at', since)
      .order('created_at')

    const { data: events } = await supabase
      .from('analytics_events')
      .select('created_at, event_type')
      .gte('created_at', since)
      .order('created_at')

    const { data: activity } = await supabase
      .from('activity_logs')
      .select('created_at, action')
      .gte('created_at', since)
      .order('created_at')

    sendSuccess(res, {
      registrations: registrations || [],
      events: events || [],
      activity: activity || [],
      period,
    })
  } catch (err) {
    sendError(res, 'Failed to load analytics')
  }
})

// ─── USER MANAGEMENT ───────────────────────────────────────────────────

router.get('/users', requireMinRole('support'), async (req: AdminRequest, res: Response) => {
  try {
    const { search, role, status, page = 1, limit = 20, sort = 'created_at', order = 'desc' } = req.query
    const offset = (Number(page) - 1) * Number(limit)

    let query = supabase.from('users').select('*', { count: 'exact' })

    if (search) {
      query = query.or(`display_name.ilike.%${search}%,email.ilike.%${search}%,username.ilike.%${search}%`)
    }
    if (role) query = query.eq('role', role)
    if (status === 'suspended') query = query.eq('is_suspended', true)
    if (status === 'active') query = query.eq('is_suspended', false)

    const { data, count, error } = await query
      .order(sort as string, { ascending: order === 'asc' })
      .range(offset, offset + Number(limit) - 1)

    if (error) throw error
    sendSuccess(res, { users: data || [], total: count || 0, page: Number(page), limit: Number(limit) })
  } catch (err) {
    sendError(res, 'Failed to load users')
  }
})

router.put('/users/:id/role', requireMinRole('admin'), async (req: AdminRequest, res: Response) => {
  try {
    const { id } = req.params
    const { role } = req.body
    const validRoles = ['super_admin', 'admin', 'editor', 'support', 'designer', 'viewer', 'user']
    if (!validRoles.includes(role)) return sendError(res, 'Invalid role', 400)

    const { data, error } = await supabase.from('users').update({ role }).eq('id', id).select().single()
    if (error) throw error

    await supabase.from('activity_logs').insert({
      user_id: req.adminUser!.id,
      action: 'update',
      entity_type: 'user',
      entity_id: id,
      details: { field: 'role', value: role },
    })

    sendSuccess(res, { user: data })
  } catch (err) {
    sendError(res, 'Failed to update user role')
  }
})

router.put('/users/:id/suspend', requireMinRole('admin'), async (req: AdminRequest, res: Response) => {
  try {
    const { id } = req.params
    const { suspend, reason } = req.body

    const { data, error } = await supabase.from('users').update({
      is_suspended: suspend,
      suspended_at: suspend ? new Date().toISOString() : null,
      suspended_reason: suspend ? reason : null,
    }).eq('id', id).select().single()
    if (error) throw error

    await supabase.from('activity_logs').insert({
      user_id: req.adminUser!.id,
      action: suspend ? 'update' : 'update',
      entity_type: 'user',
      entity_id: id,
      details: { action: suspend ? 'suspended' : 'unsuspended', reason },
    })

    sendSuccess(res, { user: data })
  } catch (err) {
    sendError(res, 'Failed to update user status')
  }
})

router.delete('/users/:id', requireMinRole('super_admin'), async (req: AdminRequest, res: Response) => {
  try {
    const { id } = req.params
    if (id === req.adminUser!.id) return sendError(res, 'Cannot delete yourself', 400)

    const { error } = await supabase.from('users').delete().eq('id', id)
    if (error) throw error

    await supabase.from('activity_logs').insert({
      user_id: req.adminUser!.id,
      action: 'delete',
      entity_type: 'user',
      entity_id: id,
    })

    sendSuccess(res, { deleted: true })
  } catch (err) {
    sendError(res, 'Failed to delete user')
  }
})

// ─── DESIGN MARKETPLACE ────────────────────────────────────────────────

router.get('/designs', requireMinRole('viewer'), async (req: AdminRequest, res: Response) => {
  try {
    const { search, type, category, status, is_premium, is_featured, page = 1, limit = 20, sort = 'created_at', order = 'desc' } = req.query
    const offset = (Number(page) - 1) * Number(limit)

    let query = supabase.from('design_marketplace').select('*, users!design_marketplace_author_id_fkey(display_name, avatar_url)', { count: 'exact' })

    if (search) query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`)
    if (type) query = query.eq('type', type)
    if (category) query = query.eq('category', category)
    if (status) query = query.eq('status', status)
    if (is_premium !== undefined) query = query.eq('is_premium', is_premium === 'true')
    if (is_featured !== undefined) query = query.eq('is_featured', is_featured === 'true')

    const { data, count, error } = await query
      .order(sort as string, { ascending: order === 'asc' })
      .range(offset, offset + Number(limit) - 1)

    if (error) throw error
    sendSuccess(res, { designs: data || [], total: count || 0, page: Number(page), limit: Number(limit) })
  } catch (err) {
    sendError(res, 'Failed to load designs')
  }
})

router.get('/designs/:id', requireMinRole('viewer'), async (req: AdminRequest, res: Response) => {
  try {
    const { id } = req.params
    const { data, error } = await supabase.from('design_marketplace').select('*, users!design_marketplace_author_id_fkey(display_name, avatar_url)').eq('id', id).single()
    if (error || !data) return sendError(res, 'Design not found', 404)
    sendSuccess(res, { design: data })
  } catch (err) {
    sendError(res, 'Failed to load design')
  }
})

router.post('/designs', requireMinRole('editor'), async (req: AdminRequest, res: Response) => {
  try {
    const body = req.body
    const slug = body.slug || body.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')

    const { data, error } = await supabase.from('design_marketplace').insert({
      ...body,
      slug,
      author_id: req.adminUser!.id,
    }).select().single()
    if (error) throw error

    await supabase.from('activity_logs').insert({
      user_id: req.adminUser!.id,
      action: 'create',
      entity_type: 'template',
      entity_id: data.id,
      details: { title: data.title, type: data.type },
    })

    sendSuccess(res, { design: data })
  } catch (err) {
    sendError(res, 'Failed to create design')
  }
})

router.put('/designs/:id', requireMinRole('editor'), async (req: AdminRequest, res: Response) => {
  try {
    const { id } = req.params
    const { data, error } = await supabase.from('design_marketplace').update({ ...req.body, updated_at: new Date().toISOString() }).eq('id', id).select().single()
    if (error) throw error

    await supabase.from('activity_logs').insert({
      user_id: req.adminUser!.id,
      action: 'update',
      entity_type: 'template',
      entity_id: id,
    })

    sendSuccess(res, { design: data })
  } catch (err) {
    sendError(res, 'Failed to update design')
  }
})

router.delete('/designs/:id', requireMinRole('admin'), async (req: AdminRequest, res: Response) => {
  try {
    const { id } = req.params
    const { error } = await supabase.from('design_marketplace').delete().eq('id', id)
    if (error) throw error

    await supabase.from('activity_logs').insert({
      user_id: req.adminUser!.id,
      action: 'delete',
      entity_type: 'template',
      entity_id: id,
    })

    sendSuccess(res, { deleted: true })
  } catch (err) {
    sendError(res, 'Failed to delete design')
  }
})

router.put('/designs/:id/feature', requireMinRole('admin'), async (req: AdminRequest, res: Response) => {
  try {
    const { id } = req.params
    const { is_featured } = req.body
    const { data, error } = await supabase.from('design_marketplace').update({ is_featured }).eq('id', id).select().single()
    if (error) throw error
    sendSuccess(res, { design: data })
  } catch (err) {
    sendError(res, 'Failed to update design')
  }
})

// ─── COMMUNITY SUBMISSIONS ─────────────────────────────────────────────

router.get('/submissions', requireMinRole('support'), async (req: AdminRequest, res: Response) => {
  try {
    const { search, type, status, page = 1, limit = 20, sort = 'created_at', order = 'desc' } = req.query
    const offset = (Number(page) - 1) * Number(limit)

    let query = supabase.from('community_submissions').select('*, users!community_submissions_user_id_fkey(display_name, avatar_url, username)', { count: 'exact' })

    if (search) query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`)
    if (type) query = query.eq('type', type)
    if (status) query = query.eq('status', status)

    const { data, count, error } = await query
      .order(sort as string, { ascending: order === 'asc' })
      .range(offset, offset + Number(limit) - 1)

    if (error) throw error
    sendSuccess(res, { submissions: data || [], total: count || 0, page: Number(page), limit: Number(limit) })
  } catch (err) {
    sendError(res, 'Failed to load submissions')
  }
})

router.get('/submissions/:id', requireMinRole('support'), async (req: AdminRequest, res: Response) => {
  try {
    const { id } = req.params
    const { data, error } = await supabase.from('community_submissions').select('*, users!community_submissions_user_id_fkey(display_name, avatar_url, username)').eq('id', id).single()
    if (error || !data) return sendError(res, 'Submission not found', 404)
    sendSuccess(res, { submission: data })
  } catch (err) {
    sendError(res, 'Failed to load submission')
  }
})

router.put('/submissions/:id/approve', requireMinRole('editor'), async (req: AdminRequest, res: Response) => {
  try {
    const { id } = req.params
    const { admin_reply } = req.body

    const submission = await supabase.from('community_submissions').select('*').eq('id', id).single()
    if (!submission.data) return sendError(res, 'Submission not found', 404)

    const sub = submission.data

    // Auto-publish to marketplace
    const slug = sub.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
    const marketplaceEntry = await supabase.from('design_marketplace').insert({
      title: sub.title,
      slug,
      description: sub.description,
      type: sub.type,
      category: sub.category,
      tags: sub.tags,
      thumbnail_url: sub.thumbnail_url,
      preview_url: sub.preview_urls?.[0],
      file_url: sub.file_url,
      file_size: sub.file_size,
      file_type: sub.file_type,
      version: sub.version,
      author_id: sub.user_id,
      is_premium: sub.license === 'premium',
      is_published: true,
      status: 'published',
    }).select().single()

    // Update submission status
    const { data, error } = await supabase.from('community_submissions').update({
      status: 'approved',
      admin_reply,
      reviewer_id: req.adminUser!.id,
      reviewed_at: new Date().toISOString(),
      published_at: new Date().toISOString(),
      marketplace_id: marketplaceEntry.data?.id,
    }).eq('id', id).select().single()
    if (error) throw error

    // Notify user
    await supabase.from('notifications').insert({
      user_id: sub.user_id,
      title: 'Template Approved!',
      message: `Your template "${sub.title}" has been approved and published to the marketplace.`,
      type: 'success',
      category: 'community',
      reference_type: 'submission',
      reference_id: id,
    })

    await supabase.from('activity_logs').insert({
      user_id: req.adminUser!.id,
      action: 'approve',
      entity_type: 'submission',
      entity_id: id,
    })

    sendSuccess(res, { submission: data })
  } catch (err) {
    sendError(res, 'Failed to approve submission')
  }
})

router.put('/submissions/:id/reject', requireMinRole('editor'), async (req: AdminRequest, res: Response) => {
  try {
    const { id } = req.params
    const { admin_reply, reason } = req.body

    const submission = await supabase.from('community_submissions').select('*').eq('id', id).single()
    if (!submission.data) return sendError(res, 'Submission not found', 404)

    const { data, error } = await supabase.from('community_submissions').update({
      status: 'rejected',
      admin_reply: admin_reply || reason,
      reviewer_id: req.adminUser!.id,
      reviewed_at: new Date().toISOString(),
    }).eq('id', id).select().single()
    if (error) throw error

    await supabase.from('notifications').insert({
      user_id: submission.data.user_id,
      title: 'Template Rejected',
      message: `Your template "${submission.data.title}" was not approved. ${admin_reply || ''}`,
      type: 'warning',
      category: 'community',
      reference_type: 'submission',
      reference_id: id,
    })

    sendSuccess(res, { submission: data })
  } catch (err) {
    sendError(res, 'Failed to reject submission')
  }
})

router.put('/submissions/:id/changes', requireMinRole('editor'), async (req: AdminRequest, res: Response) => {
  try {
    const { id } = req.params
    const { admin_notes } = req.body

    const submission = await supabase.from('community_submissions').select('*').eq('id', id).single()
    if (!submission.data) return sendError(res, 'Submission not found', 404)

    const { data, error } = await supabase.from('community_submissions').update({
      status: 'needs_changes',
      admin_notes,
      reviewer_id: req.adminUser!.id,
      reviewed_at: new Date().toISOString(),
    }).eq('id', id).select().single()
    if (error) throw error

    await supabase.from('notifications').insert({
      user_id: submission.data.user_id,
      title: 'Changes Requested',
      message: `Your template "${submission.data.title}" needs changes. ${admin_notes || ''}`,
      type: 'info',
      category: 'community',
      reference_type: 'submission',
      reference_id: id,
    })

    sendSuccess(res, { submission: data })
  } catch (err) {
    sendError(res, 'Failed to update submission')
  }
})

router.put('/submissions/:id', requireMinRole('editor'), async (req: AdminRequest, res: Response) => {
  try {
    const { id } = req.params
    const { title, description, type, category, tags, metadata, status, admin_notes } = req.body

    const updatePayload: Record<string, unknown> = {}
    if (title !== undefined) updatePayload.title = title
    if (description !== undefined) updatePayload.description = description
    if (type !== undefined) updatePayload.type = type
    if (category !== undefined) updatePayload.category = category
    if (tags !== undefined) updatePayload.tags = tags
    if (metadata !== undefined) updatePayload.metadata = metadata
    if (status !== undefined) updatePayload.status = status
    if (admin_notes !== undefined) updatePayload.admin_notes = admin_notes

    const { data, error } = await supabase.from('community_submissions').update(updatePayload).eq('id', id).select().single()
    if (error) throw error

    sendSuccess(res, { submission: data })
  } catch (err) {
    sendError(res, 'Failed to update submission')
  }
})

// ─── SUGGESTIONS ───────────────────────────────────────────────────────

router.get('/suggestions', requireMinRole('support'), async (req: AdminRequest, res: Response) => {
  try {
    const { status, category, sort = 'created_at', page = 1, limit = 20 } = req.query
    const offset = (Number(page) - 1) * Number(limit)

    let query = supabase.from('suggestions').select('*, users!suggestions_user_id_fkey(display_name, avatar_url)', { count: 'exact' })
    if (status) query = query.eq('status', status)
    if (category) query = query.eq('category', category)

    const sortField = sort === 'votes' ? 'vote_count' : sort as string
    const { data, count, error } = await query
      .order(sortField, { ascending: false })
      .range(offset, offset + Number(limit) - 1)

    if (error) throw error
    sendSuccess(res, { suggestions: data || [], total: count || 0 })
  } catch (err) {
    sendError(res, 'Failed to load suggestions')
  }
})

router.put('/suggestions/:id', requireMinRole('admin'), async (req: AdminRequest, res: Response) => {
  try {
    const { id } = req.params
    const { status, admin_notes, admin_reply } = req.body

    const suggestion = await supabase.from('suggestions').select('*').eq('id', id).single()
    if (!suggestion.data) return sendError(res, 'Suggestion not found', 404)

    const { data, error } = await supabase.from('suggestions').update({ status, admin_notes, admin_reply, updated_at: new Date().toISOString() }).eq('id', id).select().single()
    if (error) throw error

    if (admin_reply) {
      await supabase.from('notifications').insert({
        user_id: suggestion.data.user_id,
        title: 'Suggestion Updated',
        message: `Your suggestion "${suggestion.data.title}" has been updated. ${admin_reply}`,
        type: 'info',
        category: 'system',
        reference_type: 'suggestion',
        reference_id: id,
      })
    }

    sendSuccess(res, { suggestion: data })
  } catch (err) {
    sendError(res, 'Failed to update suggestion')
  }
})

// ─── BUG REPORTS ───────────────────────────────────────────────────────

router.get('/bugs', requireMinRole('support'), async (req: AdminRequest, res: Response) => {
  try {
    const { status, priority, page = 1, limit = 20 } = req.query
    const offset = (Number(page) - 1) * Number(limit)

    let query = supabase.from('bug_reports').select('*, users!bug_reports_user_id_fkey(display_name, avatar_url, email)', { count: 'exact' })
    if (status) query = query.eq('status', status)
    if (priority) query = query.eq('priority', priority)

    const { data, count, error } = await query
      .order('created_at', { ascending: false })
      .range(offset, offset + Number(limit) - 1)

    if (error) throw error
    sendSuccess(res, { bugs: data || [], total: count || 0 })
  } catch (err) {
    sendError(res, 'Failed to load bug reports')
  }
})

router.put('/bugs/:id', requireMinRole('editor'), async (req: AdminRequest, res: Response) => {
  try {
    const { id } = req.params
    const { data, error } = await supabase.from('bug_reports').update({ ...req.body, updated_at: new Date().toISOString() }).eq('id', id).select().single()
    if (error) throw error
    sendSuccess(res, { bug: data })
  } catch (err) {
    sendError(res, 'Failed to update bug report')
  }
})

// ─── CONTACT MESSAGES ──────────────────────────────────────────────────

router.get('/messages', requireMinRole('support'), async (req: AdminRequest, res: Response) => {
  try {
    const { status, page = 1, limit = 20 } = req.query
    const offset = (Number(page) - 1) * Number(limit)

    let query = supabase.from('contact_messages').select('*', { count: 'exact' })
    if (status) query = query.eq('status', status)

    const { data, count, error } = await query
      .order('created_at', { ascending: false })
      .range(offset, offset + Number(limit) - 1)

    if (error) throw error
    sendSuccess(res, { messages: data || [], total: count || 0 })
  } catch (err) {
    sendError(res, 'Failed to load messages')
  }
})

router.put('/messages/:id', requireMinRole('support'), async (req: AdminRequest, res: Response) => {
  try {
    const { id } = req.params
    const { status, admin_reply } = req.body
    const update: Record<string, unknown> = { status }
    if (admin_reply) { update.admin_reply = admin_reply; update.replied_at = new Date().toISOString() }

    const { data, error } = await supabase.from('contact_messages').update(update).eq('id', id).select().single()
    if (error) throw error
    sendSuccess(res, { message: data })
  } catch (err) {
    sendError(res, 'Failed to update message')
  }
})

// ─── ANNOUNCEMENTS ─────────────────────────────────────────────────────

router.get('/announcements', requireMinRole('support'), async (req: AdminRequest, res: Response) => {
  try {
    const { data, error } = await supabase.from('announcements').select('*').order('created_at', { ascending: false })
    if (error) throw error
    sendSuccess(res, { announcements: data || [] })
  } catch (err) {
    sendError(res, 'Failed to load announcements')
  }
})

router.post('/announcements', requireMinRole('admin'), async (req: AdminRequest, res: Response) => {
  try {
    const { data, error } = await supabase.from('announcements').insert({ ...req.body, created_by: req.adminUser!.id }).select().single()
    if (error) throw error

    await supabase.from('activity_logs').insert({
      user_id: req.adminUser!.id,
      action: 'create',
      entity_type: 'announcement',
      entity_id: data.id,
    })

    sendSuccess(res, { announcement: data })
  } catch (err) {
    sendError(res, 'Failed to create announcement')
  }
})

router.put('/announcements/:id', requireMinRole('admin'), async (req: AdminRequest, res: Response) => {
  try {
    const { id } = req.params
    const { data, error } = await supabase.from('announcements').update(req.body).eq('id', id).select().single()
    if (error) throw error
    sendSuccess(res, { announcement: data })
  } catch (err) {
    sendError(res, 'Failed to update announcement')
  }
})

router.delete('/announcements/:id', requireMinRole('admin'), async (req: AdminRequest, res: Response) => {
  try {
    const { id } = req.params
    const { error } = await supabase.from('announcements').delete().eq('id', id)
    if (error) throw error
    sendSuccess(res, { deleted: true })
  } catch (err) {
    sendError(res, 'Failed to delete announcement')
  }
})

// ─── ACTIVITY LOGS ─────────────────────────────────────────────────────

router.get('/activity', requireMinRole('support'), async (req: AdminRequest, res: Response) => {
  try {
    const { action, entity_type, user_id, page = 1, limit = 50 } = req.query
    const offset = (Number(page) - 1) * Number(limit)

    let query = supabase.from('activity_logs').select('*, users!activity_logs_user_id_fkey(display_name, avatar_url)', { count: 'exact' })
    if (action) query = query.eq('action', action)
    if (entity_type) query = query.eq('entity_type', entity_type)
    if (user_id) query = query.eq('user_id', user_id)

    const { data, count, error } = await query
      .order('created_at', { ascending: false })
      .range(offset, offset + Number(limit) - 1)

    if (error) throw error
    sendSuccess(res, { logs: data || [], total: count || 0 })
  } catch (err) {
    sendError(res, 'Failed to load activity logs')
  }
})

// ─── SITE SETTINGS ─────────────────────────────────────────────────────

router.get('/settings', requireMinRole('admin'), async (req: AdminRequest, res: Response) => {
  try {
    const { category } = req.query
    let query = supabase.from('site_settings').select('*')
    if (category) query = query.eq('category', category)

    const { data, error } = await query.order('key')
    if (error) throw error
    sendSuccess(res, { settings: data || [] })
  } catch (err) {
    sendError(res, 'Failed to load settings')
  }
})

router.put('/settings', requireMinRole('admin'), async (req: AdminRequest, res: Response) => {
  try {
    const { settings } = req.body
    const updates = Object.entries(settings).map(([key, value]) =>
      supabase.from('site_settings').upsert({ key, value, updated_by: req.adminUser!.id, updated_at: new Date().toISOString() }, { onConflict: 'key' })
    )
    await Promise.all(updates)

    await supabase.from('activity_logs').insert({
      user_id: req.adminUser!.id,
      action: 'update',
      entity_type: 'settings',
      details: { keys: Object.keys(settings) },
    })

    sendSuccess(res, { updated: true })
  } catch (err) {
    sendError(res, 'Failed to update settings')
  }
})

// ─── FEATURE REQUESTS ──────────────────────────────────────────────────

router.get('/features', requireMinRole('support'), async (req: AdminRequest, res: Response) => {
  try {
    const { status, page = 1, limit = 20 } = req.query
    const offset = (Number(page) - 1) * Number(limit)

    let query = supabase.from('feature_requests').select('*, users!feature_requests_user_id_fkey(display_name, avatar_url)', { count: 'exact' })
    if (status) query = query.eq('status', status)

    const { data, count, error } = await query
      .order('vote_count', { ascending: false })
      .range(offset, offset + Number(limit) - 1)

    if (error) throw error
    sendSuccess(res, { features: data || [], total: count || 0 })
  } catch (err) {
    sendError(res, 'Failed to load feature requests')
  }
})

router.put('/features/:id', requireMinRole('admin'), async (req: AdminRequest, res: Response) => {
  try {
    const { id } = req.params
    const { data, error } = await supabase.from('feature_requests').update({ ...req.body, updated_at: new Date().toISOString() }).eq('id', id).select().single()
    if (error) throw error
    sendSuccess(res, { feature: data })
  } catch (err) {
    sendError(res, 'Failed to update feature request')
  }
})

// ─── TEMPLATE REPORTS ──────────────────────────────────────────────────

router.get('/reports', requireMinRole('support'), async (req: AdminRequest, res: Response) => {
  try {
    const { status, page = 1, limit = 20 } = req.query
    const offset = (Number(page) - 1) * Number(limit)

    let query = supabase.from('template_reports').select('*, users!template_reports_reporter_id_fkey(display_name), design_marketplace!template_reports_template_id_fkey(title)', { count: 'exact' })
    if (status) query = query.eq('status', status)

    const { data, count, error } = await query
      .order('created_at', { ascending: false })
      .range(offset, offset + Number(limit) - 1)

    if (error) throw error
    sendSuccess(res, { reports: data || [], total: count || 0 })
  } catch (err) {
    sendError(res, 'Failed to load reports')
  }
})

// ─── BACKUPS ───────────────────────────────────────────────────────────

router.get('/backups', requireMinRole('admin'), async (req: AdminRequest, res: Response) => {
  try {
    const { data, error } = await supabase.from('backups').select('*').order('created_at', { ascending: false }).limit(20)
    if (error) throw error
    sendSuccess(res, { backups: data || [] })
  } catch (err) {
    sendError(res, 'Failed to load backups')
  }
})

router.post('/backups', requireMinRole('super_admin'), async (req: AdminRequest, res: Response) => {
  try {
    const { name, type } = req.body
    const { data, error } = await supabase.from('backups').insert({
      name: name || `Backup ${new Date().toISOString()}`,
      type: type || 'database',
      status: 'completed',
      created_by: req.adminUser!.id,
    }).select().single()
    if (error) throw error

    await supabase.from('activity_logs').insert({
      user_id: req.adminUser!.id,
      action: 'export',
      entity_type: 'settings',
      details: { backup_id: data.id, type },
    })

    sendSuccess(res, { backup: data })
  } catch (err) {
    sendError(res, 'Failed to create backup')
  }
})

// ─── NOTIFICATIONS ─────────────────────────────────────────────────────

router.get('/notifications/:userId', requireMinRole('support'), async (req: AdminRequest, res: Response) => {
  try {
    const { userId } = req.params
    const { data, error } = await supabase.from('notifications').select('*').eq('user_id', userId).order('created_at', { ascending: false }).limit(50)
    if (error) throw error
    sendSuccess(res, { notifications: data || [] })
  } catch (err) {
    sendError(res, 'Failed to load notifications')
  }
})

router.post('/notifications', requireMinRole('admin'), async (req: AdminRequest, res: Response) => {
  try {
    const { user_id, title, message, type, category, target } = req.body

    if (target === 'all') {
      const { data: users } = await supabase.from('users').select('id')
      if (users) {
        const notifications = users.map(u => ({ user_id: u.id, title, message, type: type || 'info', category: category || 'announcement' }))
        await supabase.from('notifications').insert(notifications)
      }
    } else if (target === 'premium') {
      const { data: users } = await supabase.from('users').select('id').in('role', ['admin', 'super_admin'])
      if (users) {
        const notifications = users.map(u => ({ user_id: u.id, title, message, type: type || 'info', category: category || 'announcement' }))
        await supabase.from('notifications').insert(notifications)
      }
    } else if (user_id) {
      await supabase.from('notifications').insert({ user_id, title, message, type: type || 'info', category: category || 'system' })
    }

    sendSuccess(res, { sent: true })
  } catch (err) {
    sendError(res, 'Failed to send notification')
  }
})

export default router
