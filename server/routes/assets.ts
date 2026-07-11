import { Router, Request, Response } from 'express'
import { supabase } from '../utils/supabase'
import { requireMinRole, AdminRequest } from '../middleware/admin'
import { sendSuccess, sendError } from '../utils/response'

const router = Router()

// ─── ASSETS CRUD ────────────────────────────────────────────────────────

router.get('/', async (req: Request, res: Response) => {
  try {
    const { asset_type, category, subcategory, search, tags, module, premium, featured, visibility, sort = 'created_at', order = 'desc', page = 1, limit = 50, pinned } = req.query
    const offset = (Number(page) - 1) * Number(limit)

    let query = supabase.from('assets').select('*', { count: 'exact' })

    if (asset_type) query = query.eq('asset_type', asset_type)
    if (category) query = query.eq('category', category)
    if (subcategory) query = query.eq('subcategory', subcategory)
    if (premium === 'true') query = query.eq('is_premium', true)
    if (premium === 'false') query = query.eq('is_premium', false)
    if (featured === 'true') query = query.eq('is_featured', true)
    if (visibility) query = query.eq('visibility', visibility)
    if (pinned === 'true') query = query.eq('is_pinned', true)
    if (module) query = query.contains('supported_modules', [module as string])
    if (search) query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%`)
    if (tags) {
      const tagArr = (tags as string).split(',')
      query = query.overlaps('tags', tagArr)
    }

    const sortField = sort === 'usage' ? 'usage_count' : sort === 'name' ? 'name' : sort === 'updated' ? 'updated_at' : 'created_at'
    query = query.order(sortField, { ascending: order === 'asc' })
    query = query.range(offset, offset + Number(limit) - 1)

    const { data, count, error } = await query
    if (error) throw error

    sendSuccess(res, { assets: data || [], total: count || 0, page: Number(page), limit: Number(limit) })
  } catch (err) {
    sendError(res, 'Failed to load assets')
  }
})

router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { data, error } = await supabase.from('assets').select('*').eq('id', req.params.id).single()
    if (error) throw error
    sendSuccess(res, { asset: data })
  } catch (err) {
    sendError(res, 'Asset not found', 404)
  }
})

router.post('/', requireMinRole('editor'), async (req: AdminRequest, res: Response) => {
  try {
    const { name, slug, description, asset_type, subcategory, category, data, tags, version, is_premium, is_featured, visibility, supported_modules, preview_url, thumbnail_url, preview_html, file_type, file_size } = req.body

    const assetSlug = slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

    const { data: asset, error } = await supabase.from('assets').insert({
      name, slug: assetSlug, description, asset_type, subcategory: subcategory || 'general', category: category || 'general',
      data: data || {}, tags: tags || [], version: version || '1.0.0',
      is_premium: is_premium || false, is_featured: is_featured || false, visibility: visibility || 'public',
      supported_modules: supported_modules || [], preview_url, thumbnail_url, preview_html,
      file_type, file_size: file_size || 0, created_by: req.adminUser?.id,
    }).select().single()

    if (error) throw error
    sendSuccess(res, { asset })
  } catch (err: any) {
    sendError(res, err.message || 'Failed to create asset')
  }
})

router.put('/:id', requireMinRole('editor'), async (req: AdminRequest, res: Response) => {
  try {
    const updates: Record<string, unknown> = {}
    const allowed = ['name', 'slug', 'description', 'asset_type', 'subcategory', 'category', 'data', 'tags', 'version', 'is_premium', 'is_featured', 'is_active', 'is_pinned', 'visibility', 'supported_modules', 'preview_url', 'thumbnail_url', 'preview_html', 'file_type', 'file_size']
    for (const key of allowed) {
      if (req.body[key] !== undefined) updates[key] = req.body[key]
    }
    updates.updated_at = new Date().toISOString()

    const { data, error } = await supabase.from('assets').update(updates).eq('id', req.params.id).select().single()
    if (error) throw error
    sendSuccess(res, { asset: data })
  } catch (err) {
    sendError(res, 'Failed to update asset')
  }
})

router.delete('/:id', requireMinRole('admin'), async (req: AdminRequest, res: Response) => {
  try {
    const { count } = await supabase.from('asset_usage').select('*', { count: 'exact', head: true }).eq('asset_id', req.params.id)
    if (count && count > 0) {
      return sendError(res, `This asset is used by ${count} template(s). Remove it from templates first or force delete.`, 409)
    }
    const { error } = await supabase.from('assets').delete().eq('id', req.params.id)
    if (error) throw error
    sendSuccess(res, { deleted: true })
  } catch (err) {
    sendError(res, 'Failed to delete asset')
  }
})

router.delete('/:id/force', requireMinRole('admin'), async (req: AdminRequest, res: Response) => {
  try {
    await supabase.from('asset_usage').delete().eq('asset_id', req.params.id)
    await supabase.from('asset_collection_items').delete().eq('asset_id', req.params.id)
    await supabase.from('asset_versions').delete().eq('asset_id', req.params.id)
    await supabase.from('asset_favorites').delete().eq('asset_id', req.params.id)
    const { error } = await supabase.from('assets').delete().eq('id', req.params.id)
    if (error) throw error
    sendSuccess(res, { deleted: true })
  } catch (err) {
    sendError(res, 'Failed to force delete asset')
  }
})

// ─── BULK OPERATIONS ────────────────────────────────────────────────────

router.post('/bulk', requireMinRole('editor'), async (req: AdminRequest, res: Response) => {
  try {
    const { ids, action, value } = req.body
    if (!ids || !Array.isArray(ids) || !action) return sendError(res, 'Missing ids or action')

    let updates: Record<string, unknown> = {}
    if (action === 'premium') updates.is_premium = value
    if (action === 'featured') updates.is_featured = value
    if (action === 'active') updates.is_active = value
    if (action === 'visibility') updates.visibility = value
    if (action === 'pinned') updates.is_pinned = value
    if (action === 'category') updates.category = value
    if (action === 'delete') {
      await supabase.from('assets').delete().in('id', ids)
      return sendSuccess(res, { deleted: ids.length })
    }

    updates.updated_at = new Date().toISOString()
    const { error } = await supabase.from('assets').update(updates).in('id', ids)
    if (error) throw error
    sendSuccess(res, { updated: ids.length })
  } catch (err) {
    sendError(res, 'Bulk operation failed')
  }
})

// ─── VERSIONS ───────────────────────────────────────────────────────────

router.get('/:id/versions', async (req: Request, res: Response) => {
  try {
    const { data, error } = await supabase.from('asset_versions').select('*').eq('asset_id', req.params.id).order('version_number', { ascending: false })
    if (error) throw error
    sendSuccess(res, { versions: data || [] })
  } catch (err) {
    sendError(res, 'Failed to load versions')
  }
})

router.post('/:id/versions', requireMinRole('editor'), async (req: AdminRequest, res: Response) => {
  try {
    const { data: asset } = await supabase.from('assets').select('id, data, version, name').eq('id', req.params.id).single()
    if (!asset) return sendError(res, 'Asset not found', 404)

    const { count } = await supabase.from('asset_versions').select('*', { count: 'exact', head: true }).eq('asset_id', req.params.id)
    const versionNumber = (count || 0) + 1

    const { data, error } = await supabase.from('asset_versions').insert({
      asset_id: req.params.id, version_number: versionNumber,
      data: asset.data, name: asset.name,
      description: req.body.description || `Version ${versionNumber}`,
      created_by: req.adminUser?.id,
    }).select().single()
    if (error) throw error
    sendSuccess(res, { version: data })
  } catch (err) {
    sendError(res, 'Failed to create version')
  }
})

router.post('/:id/versions/restore/:versionId', requireMinRole('editor'), async (req: AdminRequest, res: Response) => {
  try {
    const { data: version } = await supabase.from('asset_versions').select('*').eq('id', req.params.versionId).eq('asset_id', req.params.id).single()
    if (!version) return sendError(res, 'Version not found', 404)

    const { error } = await supabase.from('assets').update({ data: version.data, updated_at: new Date().toISOString() }).eq('id', req.params.id)
    if (error) throw error
    sendSuccess(res, { restored: true })
  } catch (err) {
    sendError(res, 'Failed to restore version')
  }
})

// ─── USAGE TRACKING ─────────────────────────────────────────────────────

router.get('/:id/usage', async (req: Request, res: Response) => {
  try {
    const { data, count } = await supabase.from('asset_usage').select('*', { count: 'exact' }).eq('asset_id', req.params.id).order('used_at', { ascending: false }).limit(50)
    sendSuccess(res, { usage: data || [], total: count || 0 })
  } catch (err) {
    sendError(res, 'Failed to load usage')
  }
})

router.post('/track', async (req: Request, res: Response) => {
  try {
    const { asset_id, entity_type, entity_id } = req.body
    if (!asset_id || !entity_type || !entity_id) return sendError(res, 'Missing required fields')
    await supabase.from('asset_usage').insert({ asset_id, entity_type, entity_id })
    await supabase.rpc('increment_column', { table_name: 'assets', column_name: 'usage_count', row_id: asset_id }).then(() => {}).catch(() => {
      supabase.from('assets').update({ usage_count: 0 }).eq('id', asset_id)
    })
    sendSuccess(res, { tracked: true })
  } catch (err) {
    sendError(res, 'Failed to track usage')
  }
})

// ─── COLLECTIONS ────────────────────────────────────────────────────────

router.get('/collections/all', async (req: Request, res: Response) => {
  try {
    const { data, error } = await supabase.from('asset_collections').select('*').eq('is_active', true).order('sort_order')
    if (error) throw error
    sendSuccess(res, { collections: data || [] })
  } catch (err) {
    sendError(res, 'Failed to load collections')
  }
})

router.post('/collections', requireMinRole('editor'), async (req: AdminRequest, res: Response) => {
  try {
    const { name, slug, description, icon, color, is_premium } = req.body
    const collectionSlug = slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-')
    const { data, error } = await supabase.from('asset_collections').insert({ name, slug: collectionSlug, description, icon, color, is_premium, created_by: req.adminUser?.id }).select().single()
    if (error) throw error
    sendSuccess(res, { collection: data })
  } catch (err) {
    sendError(res, 'Failed to create collection')
  }
})

router.put('/collections/:id', requireMinRole('editor'), async (req: AdminRequest, res: Response) => {
  try {
    const { data, error } = await supabase.from('asset_collections').update(req.body).eq('id', req.params.id).select().single()
    if (error) throw error
    sendSuccess(res, { collection: data })
  } catch (err) {
    sendError(res, 'Failed to update collection')
  }
})

router.delete('/collections/:id', requireMinRole('admin'), async (req: AdminRequest, res: Response) => {
  try {
    const { error } = await supabase.from('asset_collections').delete().eq('id', req.params.id)
    if (error) throw error
    sendSuccess(res, { deleted: true })
  } catch (err) {
    sendError(res, 'Failed to delete collection')
  }
})

router.post('/collections/:id/assets', requireMinRole('editor'), async (req: AdminRequest, res: Response) => {
  try {
    const { asset_ids } = req.body
    const items = asset_ids.map((aid: string, i: number) => ({ collection_id: req.params.id, asset_id: aid, sort_order: i }))
    const { error } = await supabase.from('asset_collection_items').upsert(items)
    if (error) throw error
    sendSuccess(res, { added: asset_ids.length })
  } catch (err) {
    sendError(res, 'Failed to add assets to collection')
  }
})

router.delete('/collections/:id/assets/:assetId', requireMinRole('editor'), async (req: AdminRequest, res: Response) => {
  try {
    const { error } = await supabase.from('asset_collection_items').delete().eq('collection_id', req.params.id).eq('asset_id', req.params.assetId)
    if (error) throw error
    sendSuccess(res, { removed: true })
  } catch (err) {
    sendError(res, 'Failed to remove asset from collection')
  }
})

// ─── IMPORT / EXPORT ────────────────────────────────────────────────────

router.get('/export/:collectionId', requireMinRole('editor'), async (req: AdminRequest, res: Response) => {
  try {
    const { data: collection } = await supabase.from('asset_collections').select('*').eq('id', req.params.collectionId).single()
    if (!collection) return sendError(res, 'Collection not found', 404)

    const { data: items } = await supabase.from('asset_collection_items').select('asset_id, sort_order').eq('collection_id', req.params.collectionId)
    if (!items || items.length === 0) return sendSuccess(res, { export: { collection, assets: [] } })

    const { data: assets } = await supabase.from('assets').select('*').in('id', items.map(i => i.asset_id))
    sendSuccess(res, { export: { collection, assets: assets || [] } })
  } catch (err) {
    sendError(res, 'Failed to export')
  }
})

router.post('/import', requireMinRole('editor'), async (req: AdminRequest, res: Response) => {
  try {
    const { collection, assets } = req.body
    if (!assets || !Array.isArray(assets)) return sendError(res, 'Missing assets array')

    let collectionId = collection?.id
    if (collection) {
      const { data: existingCol } = await supabase.from('asset_collections').select('id').eq('slug', collection.slug).single()
      if (existingCol) {
        collectionId = existingCol.id
      } else {
        const { data: newCol } = await supabase.from('asset_collections').insert({ ...collection, created_by: req.adminUser?.id }).select().single()
        collectionId = newCol?.id
      }
    }

    const importedIds: string[] = []
    for (const asset of assets) {
      const { slug, ...rest } = asset
      const assetSlug = (slug || rest.name).toLowerCase().replace(/[^a-z0-9]+/g, '-')
      const { data: existing } = await supabase.from('assets').select('id').eq('slug', assetSlug).single()
      if (existing) { importedIds.push(existing.id); continue }

      const { data: created } = await supabase.from('assets').insert({ ...rest, slug: assetSlug, created_by: req.adminUser?.id }).select().single()
      if (created) importedIds.push(created.id)
    }

    if (collectionId && importedIds.length > 0) {
      const items = importedIds.map((aid, i) => ({ collection_id: collectionId, asset_id: aid, sort_order: i }))
      await supabase.from('asset_collection_items').upsert(items)
    }

    sendSuccess(res, { imported: importedIds.length })
  } catch (err) {
    sendError(res, 'Failed to import')
  }
})

// ─── STATS ──────────────────────────────────────────────────────────────

router.get('/stats/overview', requireMinRole('viewer'), async (req: AdminRequest, res: Response) => {
  try {
    const { count: total } = await supabase.from('assets').select('*', { count: 'exact', head: true })
    const { data: byType } = await supabase.from('assets').select('asset_type').then(r => {
      const map: Record<string, number> = {}
      r.data?.forEach((a: any) => { map[a.asset_type] = (map[a.asset_type] || 0) + 1 })
      return { data: map }
    })
    const { count: collections } = await supabase.from('asset_collections').select('*', { count: 'exact', head: true })
    const { data: topUsed } = await supabase.from('assets').select('name, usage_count, asset_type').order('usage_count', { ascending: false }).limit(10)

    sendSuccess(res, { total: total || 0, byType: byType || {}, collections: collections || 0, topUsed: topUsed || [] })
  } catch (err) {
    sendError(res, 'Failed to load stats')
  }
})

export default router
