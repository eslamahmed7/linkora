import { useState, useEffect, useCallback } from 'react'
import {
  Layers, Plus, Search, Grid, List, Star, Eye, Trash2, Edit3,
  X, Save, Loader2, Copy, Pin,
  Package, Palette, Image, Sparkles, Type, Zap, Hexagon, Sliders,
  MoreVertical, Check,
} from 'lucide-react'
import { adminAssets } from '@/api/admin'
import { useAssetStore } from '@/stores/assetStore'
import type { Asset, AssetType, AssetModule } from '@/types/admin'
import { ASSET_TYPE_LABELS, ASSET_MODULE_OPTIONS } from '@/types/admin'

const TYPE_ICONS: Record<AssetType, React.ReactNode> = {
  pattern: <Hexagon className="w-4 h-4" />,
  texture: <Layers className="w-4 h-4" />,
  icon: <Sparkles className="w-4 h-4" />,
  qr_frame: <Package className="w-4 h-4" />,
  qr_preset: <Package className="w-4 h-4" />,
  gradient: <Palette className="w-4 h-4" />,
  material: <Layers className="w-4 h-4" />,
  border: <Sliders className="w-4 h-4" />,
  shadow: <Sliders className="w-4 h-4" />,
  typography: <Type className="w-4 h-4" />,
  animation: <Zap className="w-4 h-4" />,
  color: <Palette className="w-4 h-4" />,
  sticker: <Sparkles className="w-4 h-4" />,
  shape: <Hexagon className="w-4 h-4" />,
  component: <Layers className="w-4 h-4" />,
  theme: <Palette className="w-4 h-4" />,
  font: <Type className="w-4 h-4" />,
  background: <Image className="w-4 h-4" />,
}

const ALL_TYPES: AssetType[] = Object.keys(ASSET_TYPE_LABELS) as AssetType[]

function AssetPreviewCard({ asset, onEdit, onDelete, onToggleFeatured, onToggleActive }: {
  asset: Asset
  onEdit: (a: Asset) => void
  onDelete: (id: string) => void
  onToggleFeatured: (id: string, val: boolean) => void
  onToggleActive: (id: string, val: boolean) => void
}) {
  const [open, setOpen] = useState(false)

  return (
    <div className={`relative group bg-white dark:bg-neutral-900 border rounded-xl overflow-hidden transition-all hover:shadow-lg ${asset.is_active ? 'border-neutral-200 dark:border-neutral-800' : 'border-red-200 dark:border-red-900/50 opacity-60'}`}>
      <div className="h-32 bg-gradient-to-br from-neutral-100 to-neutral-50 dark:from-neutral-800 dark:to-neutral-850 flex items-center justify-center relative">
        {asset.thumbnail_url ? (
          <img src={asset.thumbnail_url} alt={asset.name} className="w-full h-full object-cover" />
        ) : asset.preview_html ? (
          <div className="w-full h-full flex items-center justify-center p-4" dangerouslySetInnerHTML={{ __html: asset.preview_html }} />
        ) : (
          <div className="text-neutral-400 dark:text-neutral-500">
            {TYPE_ICONS[asset.asset_type] || <Layers className="w-8 h-8" />}
          </div>
        )}
        <div className="absolute top-2 left-2 flex gap-1">
          {asset.is_premium && <span className="px-1.5 py-0.5 text-[9px] font-bold uppercase bg-yellow-400 text-yellow-900 rounded">Pro</span>}
          {asset.is_featured && <span className="px-1.5 py-0.5 text-[9px] font-bold uppercase bg-blue-400 text-blue-900 rounded">Featured</span>}
          {asset.is_pinned && <span className="px-1.5 py-0.5 text-[9px] font-bold uppercase bg-green-400 text-green-900 rounded">Pinned</span>}
        </div>
        <div className="absolute top-2 right-2">
          <button onClick={() => setOpen(!open)} className="p-1 bg-white/80 dark:bg-neutral-800/80 rounded-lg hover:bg-white dark:hover:bg-neutral-700">
            <MoreVertical className="w-4 h-4 text-neutral-600 dark:text-neutral-300" />
          </button>
          {open && (
            <div className="absolute right-0 top-8 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl shadow-xl z-20 w-44 py-1">
              <button onClick={() => { onEdit(asset); setOpen(false) }} className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-neutral-100 dark:hover:bg-neutral-700"><Edit3 className="w-3.5 h-3.5" /> Edit</button>
              <button onClick={() => { onToggleFeatured(asset.id, !asset.is_featured); setOpen(false) }} className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-neutral-100 dark:hover:bg-neutral-700"><Star className="w-3.5 h-3.5" /> {asset.is_featured ? 'Unfeature' : 'Feature'}</button>
              <button onClick={() => { onToggleActive(asset.id, !asset.is_active); setOpen(false) }} className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-neutral-100 dark:hover:bg-neutral-700"><Eye className="w-3.5 h-3.5" /> {asset.is_active ? 'Deactivate' : 'Activate'}</button>
              <button onClick={() => { navigator.clipboard.writeText(asset.id); setOpen(false) }} className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-neutral-100 dark:hover:bg-neutral-700"><Copy className="w-3.5 h-3.5" /> Copy ID</button>
              <hr className="border-neutral-200 dark:border-neutral-700 my-1" />
              <button onClick={() => { onDelete(asset.id); setOpen(false) }} className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30"><Trash2 className="w-3.5 h-3.5" /> Delete</button>
            </div>
          )}
        </div>
      </div>
      <div className="p-3">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h4 className="text-sm font-semibold text-neutral-900 dark:text-white truncate">{asset.name}</h4>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 capitalize">{asset.asset_type.replace('_', ' ')} · {asset.category}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 mt-2">
          <span className="text-[10px] text-neutral-400">v{asset.version}</span>
          <span className="text-[10px] text-neutral-400">·</span>
          <span className="text-[10px] text-neutral-400">{asset.usage_count} uses</span>
          <span className="ml-auto text-[10px] text-neutral-400">{asset.supported_modules.length ? asset.supported_modules.length + ' modules' : 'All'}</span>
        </div>
        {asset.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {asset.tags.slice(0, 3).map(t => <span key={t} className="px-1.5 py-0.5 text-[9px] bg-neutral-100 dark:bg-neutral-800 rounded-full text-neutral-500">{t}</span>)}
            {asset.tags.length > 3 && <span className="text-[9px] text-neutral-400">+{asset.tags.length - 3}</span>}
          </div>
        )}
      </div>
    </div>
  )
}

function AssetEditor({ asset, onSave, onClose }: { asset: Partial<Asset> | null; onSave: (data: Partial<Asset>) => Promise<void>; onClose: () => void }) {
  const [form, setForm] = useState<Partial<Asset>>(asset || {
    asset_type: 'pattern', name: '', slug: '', description: '', category: 'general', subcategory: 'general',
    tags: [], data: {}, supported_modules: [], is_premium: false, is_featured: false, visibility: 'public', version: '1.0.0',
  })
  const [tagInput, setTagInput] = useState('')
  const [saving, setSaving] = useState(false)
  const [jsonError, setJsonError] = useState('')

  const handleJsonChange = (val: string) => {
    try {
      const parsed = JSON.parse(val)
      setForm({ ...form, data: parsed })
      setJsonError('')
    } catch {
      setJsonError('Invalid JSON')
    }
  }

  const addTag = () => {
    if (tagInput.trim() && !(form.tags || []).includes(tagInput.trim())) {
      setForm({ ...form, tags: [...(form.tags || []), tagInput.trim()] })
      setTagInput('')
    }
  }

  const toggleModule = (m: AssetModule) => {
    const current = form.supported_modules || []
    setForm({
      ...form,
      supported_modules: current.includes(m) ? current.filter(x => x !== m) : [...current, m],
    })
  }

  const handleSave = async () => {
    if (!form.name?.trim()) return
    setSaving(true)
    try {
      await onSave(form)
      onClose()
    } catch {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between p-4 border-b border-neutral-200 dark:border-neutral-800">
          <h2 className="text-lg font-bold text-neutral-900 dark:text-white">{asset?.id ? 'Edit Asset' : 'New Asset'}</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800"><X className="w-5 h-5" /></button>
        </div>
        <div className="p-4 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-neutral-500 mb-1">Name *</label>
              <input value={form.name || ''} onChange={e => setForm({ ...form, name: e.target.value, slug: (form.slug || '') || e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-') })} className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-sm text-neutral-900 dark:text-white" />
            </div>
            <div>
              <label className="block text-xs font-medium text-neutral-500 mb-1">Slug</label>
              <input value={form.slug || ''} onChange={e => setForm({ ...form, slug: e.target.value })} className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-sm text-neutral-900 dark:text-white" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-neutral-500 mb-1">Description</label>
            <textarea value={form.description || ''} onChange={e => setForm({ ...form, description: e.target.value })} rows={2} className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-sm text-neutral-900 dark:text-white resize-none" />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-neutral-500 mb-1">Type *</label>
              <select value={form.asset_type} onChange={e => setForm({ ...form, asset_type: e.target.value as AssetType })} className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-sm text-neutral-900 dark:text-white">
                {ALL_TYPES.map(t => <option key={t} value={t}>{ASSET_TYPE_LABELS[t]}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-neutral-500 mb-1">Category</label>
              <input value={form.category || ''} onChange={e => setForm({ ...form, category: e.target.value })} className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-sm text-neutral-900 dark:text-white" />
            </div>
            <div>
              <label className="block text-xs font-medium text-neutral-500 mb-1">Version</label>
              <input value={form.version || ''} onChange={e => setForm({ ...form, version: e.target.value })} className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-sm text-neutral-900 dark:text-white" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-neutral-500 mb-1">Preview URL</label>
            <input value={form.preview_url || ''} onChange={e => setForm({ ...form, preview_url: e.target.value })} className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-sm text-neutral-900 dark:text-white" placeholder="https://..." />
          </div>
          <div>
            <label className="block text-xs font-medium text-neutral-500 mb-1">Thumbnail URL</label>
            <input value={form.thumbnail_url || ''} onChange={e => setForm({ ...form, thumbnail_url: e.target.value })} className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-sm text-neutral-900 dark:text-white" placeholder="https://..." />
          </div>
          <div>
            <label className="block text-xs font-medium text-neutral-500 mb-1">Data (JSON)</label>
            <textarea value={JSON.stringify(form.data || {}, null, 2)} onChange={e => handleJsonChange(e.target.value)} rows={6} className={`w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-800 border rounded-lg text-xs font-mono text-neutral-900 dark:text-white resize-y ${jsonError ? 'border-red-400' : 'border-neutral-200 dark:border-neutral-700'}`} />
            {jsonError && <p className="text-xs text-red-500 mt-1">{jsonError}</p>}
          </div>
          <div>
            <label className="block text-xs font-medium text-neutral-500 mb-1">Tags</label>
            <div className="flex gap-2">
              <input value={tagInput} onChange={e => setTagInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addTag())} className="flex-1 px-3 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-sm text-neutral-900 dark:text-white" placeholder="Add tag..." />
              <button onClick={addTag} className="px-3 py-2 bg-neutral-100 dark:bg-neutral-800 rounded-lg text-sm hover:bg-neutral-200 dark:hover:bg-neutral-700"><Plus className="w-4 h-4" /></button>
            </div>
            {(form.tags || []).length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {form.tags!.map(t => (
                  <span key={t} className="inline-flex items-center gap-1 px-2 py-0.5 bg-accent-100 dark:bg-accent-950/30 text-accent-700 dark:text-accent-400 rounded-full text-xs">
                    {t} <button onClick={() => setForm({ ...form, tags: form.tags!.filter(x => x !== t) })}><X className="w-3 h-3" /></button>
                  </span>
                ))}
              </div>
            )}
          </div>
          <div>
            <label className="block text-xs font-medium text-neutral-500 mb-1.5">Compatible Modules</label>
            <div className="flex flex-wrap gap-2">
              {ASSET_MODULE_OPTIONS.map(m => (
                <button key={m} onClick={() => toggleModule(m)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-all ${(form.supported_modules || []).includes(m) ? 'bg-accent-50 dark:bg-accent-950/30 border-accent-300 dark:border-accent-700 text-accent-700 dark:text-accent-400' : 'border-neutral-200 dark:border-neutral-700 text-neutral-500 hover:border-neutral-300 dark:hover:border-neutral-600'}`}>
                  {m.replace('_', ' ')}
                </button>
              ))}
            </div>
            {(form.supported_modules || []).length === 0 && <p className="text-[10px] text-neutral-400 mt-1">Empty = compatible with all modules</p>}
          </div>
          <div className="flex gap-4">
            <label className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400 cursor-pointer">
              <input type="checkbox" checked={form.is_premium || false} onChange={e => setForm({ ...form, is_premium: e.target.checked })} className="w-4 h-4 rounded accent-accent-500" />
              Premium
            </label>
            <label className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400 cursor-pointer">
              <input type="checkbox" checked={form.is_featured || false} onChange={e => setForm({ ...form, is_featured: e.target.checked })} className="w-4 h-4 rounded accent-accent-500" />
              Featured
            </label>
            <label className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400 cursor-pointer">
              <input type="checkbox" checked={form.is_active ?? true} onChange={e => setForm({ ...form, is_active: e.target.checked })} className="w-4 h-4 rounded accent-accent-500" />
              Active
            </label>
            <label className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400 cursor-pointer">
              <input type="checkbox" checked={form.is_pinned || false} onChange={e => setForm({ ...form, is_pinned: e.target.checked })} className="w-4 h-4 rounded accent-accent-500" />
              Pinned
            </label>
          </div>
          <div>
            <label className="block text-xs font-medium text-neutral-500 mb-1">Visibility</label>
            <select value={form.visibility || 'public'} onChange={e => setForm({ ...form, visibility: e.target.value as Asset['visibility'] })} className="w-48 px-3 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-sm text-neutral-900 dark:text-white">
              <option value="public">Public</option>
              <option value="unlisted">Unlisted</option>
              <option value="private">Private</option>
            </select>
          </div>
        </div>
        <div className="flex items-center justify-end gap-3 p-4 border-t border-neutral-200 dark:border-neutral-800">
          <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-all">Cancel</button>
          <button onClick={handleSave} disabled={saving || !form.name?.trim()} className="flex items-center gap-2 px-5 py-2 bg-accent-600 hover:bg-accent-700 disabled:opacity-50 text-white rounded-lg text-sm font-medium transition-all">
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {asset?.id ? 'Update' : 'Create'}
          </button>
        </div>
      </div>
    </div>
  )
}

export function AdminAssetManagerPage() {
  const { assets, total, filters, page, isLoading, setAssets, setLoading, setFilters, setPage, addAsset, updateAsset, removeAsset } = useAssetStore()
  const [view, setView] = useState<'grid' | 'list'>('grid')
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [typeFilter, setTypeFilter] = useState<AssetType | 'all'>('all')
  const [editing, setEditing] = useState<Partial<Asset> | null>(null)

  const loadAssets = useCallback(async () => {
    setLoading(true)
    try {
      const params: Record<string, unknown> = { page, limit: 50 }
      if (typeFilter !== 'all') params.asset_type = typeFilter
      if (filters.search) params.search = filters.search
      if (filters.premium !== undefined) params.premium = filters.premium
      if (filters.visibility) params.visibility = filters.visibility
      if (filters.sort) params.sort = filters.sort
      if (filters.order) params.order = filters.order
      const res = await adminAssets.list(params as any)
      if (res.success && res.data) {
        setAssets(res.data.assets || [], res.data.total || 0)
      }
    } catch (err) {
      console.error('Failed to load assets:', err)
    } finally {
      setLoading(false)
    }
  }, [page, typeFilter, filters, setAssets, setLoading])

  useEffect(() => { loadAssets() }, [loadAssets])

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this asset?')) return
    try {
      const res = await adminAssets.delete(id)
      if (res.success) removeAsset(id)
    } catch (err: any) {
      if (err?.message?.includes('used by')) {
        if (confirm('This asset is in use. Force delete?')) {
          await adminAssets.forceDelete(id)
          removeAsset(id)
        }
      }
    }
  }

  const handleBulk = async (action: string, value?: unknown) => {
    const ids = Array.from(selectedIds)
    if (!ids.length) return
    await adminAssets.bulk(ids, action, value)
    setSelectedIds(new Set())
    loadAssets()
  }

  const handleSave = async (data: Partial<Asset>) => {
    if (data.id) {
      const res = await adminAssets.update(data.id, data)
      if (res.success && res.data) updateAsset(data.id, res.data.asset)
    } else {
      const res = await adminAssets.create(data)
      if (res.success && res.data) addAsset(res.data.asset)
    }
  }

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  const toggleSelectAll = () => {
    if (selectedIds.size === assets.length) {
      setSelectedIds(new Set())
    } else {
      setSelectedIds(new Set(assets.map(a => a.id)))
    }
  }

  return (
    <div className="min-h-screen p-4 lg:p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-accent-50 dark:bg-accent-950/30 rounded-xl">
            <Layers className="w-6 h-6 text-accent-600 dark:text-accent-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">Asset Manager</h1>
            <p className="text-sm text-neutral-500">{total} assets · Centralized library for all editors</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setView(view === 'grid' ? 'list' : 'grid')} className="p-2 rounded-lg border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-800">
            {view === 'grid' ? <List className="w-4 h-4" /> : <Grid className="w-4 h-4" />}
          </button>
          <button onClick={() => setEditing({})} className="flex items-center gap-2 px-4 py-2 bg-accent-600 hover:bg-accent-700 text-white rounded-xl text-sm font-medium transition-all">
            <Plus className="w-4 h-4" /> New Asset
          </button>
        </div>
      </div>

      <div className="flex gap-4 flex-wrap">
        <div className="flex-1 min-w-0 sm:min-w-[200px]">
          <div className="relative">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input value={filters.search || ''} onChange={e => setFilters({ search: e.target.value })} placeholder="Search assets..." className="w-full pl-10 pr-4 py-2 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl text-sm text-neutral-900 dark:text-white" />
          </div>
        </div>
        <div className="flex gap-1 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-1">
          <button onClick={() => setTypeFilter('all')} className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${typeFilter === 'all' ? 'bg-accent-50 dark:bg-accent-950/30 text-accent-600 dark:text-accent-400' : 'text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-800'}`}>All</button>
          {['pattern', 'texture', 'qr_frame', 'qr_preset', 'gradient', 'icon', 'theme'].map(t => (
            <button key={t} onClick={() => setTypeFilter(t as AssetType)} className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all flex items-center gap-1 ${typeFilter === t ? 'bg-accent-50 dark:bg-accent-950/30 text-accent-600 dark:text-accent-400' : 'text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-800'}`}>
              {TYPE_ICONS[t as AssetType]} {ASSET_TYPE_LABELS[t as AssetType].split(' ')[0]}
            </button>
          ))}
        </div>
      </div>

      {selectedIds.size > 0 && (
        <div className="flex items-center gap-3 p-3 bg-accent-50 dark:bg-accent-950/20 border border-accent-200 dark:border-accent-800 rounded-xl">
          <span className="text-sm font-medium text-accent-700 dark:text-accent-400">{selectedIds.size} selected</span>
          <div className="flex gap-2 ml-auto">
            <button onClick={() => handleBulk('featured', true)} className="px-3 py-1.5 text-xs bg-white dark:bg-neutral-800 border border-accent-200 dark:border-accent-800 rounded-lg hover:bg-accent-100 dark:hover:bg-accent-950/30">Feature</button>
            <button onClick={() => handleBulk('active', false)} className="px-3 py-1.5 text-xs bg-white dark:bg-neutral-800 border border-accent-200 dark:border-accent-800 rounded-lg hover:bg-accent-100 dark:hover:bg-accent-950/30">Deactivate</button>
            <button onClick={() => handleBulk('pinned', true)} className="px-3 py-1.5 text-xs bg-white dark:bg-neutral-800 border border-accent-200 dark:border-accent-800 rounded-lg hover:bg-accent-100 dark:hover:bg-accent-950/30">Pin</button>
            <button onClick={() => handleBulk('delete')} className="px-3 py-1.5 text-xs bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 text-red-600 rounded-lg hover:bg-red-100 dark:hover:bg-red-950/50">Delete</button>
          </div>
          <button onClick={() => setSelectedIds(new Set())} className="p-1 hover:bg-accent-100 dark:hover:bg-accent-950/30 rounded-lg"><X className="w-4 h-4" /></button>
        </div>
      )}

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-6 h-6 text-accent-500 animate-spin" />
        </div>
      ) : assets.length === 0 ? (
        <div className="text-center py-20">
          <Layers className="w-12 h-12 text-neutral-300 dark:text-neutral-600 mx-auto mb-3" />
          <p className="text-neutral-500">No assets found. Create your first asset to get started.</p>
        </div>
      ) : view === 'grid' ? (
        <>
          <div className="flex items-center gap-2 mb-2">
            <button onClick={toggleSelectAll} className="flex items-center gap-1.5 text-xs text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300">
              {selectedIds.size === assets.length ? <Check className="w-3.5 h-3.5" /> : <div className="w-3.5 h-3.5 border border-neutral-300 dark:border-neutral-600 rounded" />}
              Select all
            </button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {assets.map(asset => (
              <div key={asset.id} className="relative">
                <button onClick={() => toggleSelect(asset.id)} className={`absolute top-2 left-2 z-10 w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${selectedIds.has(asset.id) ? 'bg-accent-500 border-accent-500 text-white' : 'bg-white/80 dark:bg-neutral-800/80 border-neutral-300 dark:border-neutral-600'}`}>
                  {selectedIds.has(asset.id) && <Check className="w-3 h-3" />}
                </button>
                <AssetPreviewCard asset={asset} onEdit={setEditing} onDelete={handleDelete} onToggleFeatured={(id, v) => adminAssets.bulk([id], 'featured', v).then(loadAssets)} onToggleActive={(id, v) => adminAssets.bulk([id], 'active', v).then(loadAssets)} />
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-neutral-200 dark:border-neutral-800 text-left">
                <th className="px-4 py-3 w-10"><input type="checkbox" checked={selectedIds.size === assets.length && assets.length > 0} onChange={toggleSelectAll} className="w-4 h-4 rounded accent-accent-500" /></th>
                <th className="px-4 py-3 font-medium text-neutral-500">Name</th>
                <th className="px-4 py-3 font-medium text-neutral-500">Type</th>
                <th className="px-4 py-3 font-medium text-neutral-500">Category</th>
                <th className="px-4 py-3 font-medium text-neutral-500">Modules</th>
                <th className="px-4 py-3 font-medium text-neutral-500 text-right">Uses</th>
                <th className="px-4 py-3 font-medium text-neutral-500">Status</th>
                <th className="px-4 py-3 w-20"></th>
              </tr>
            </thead>
            <tbody>
              {assets.map(asset => (
                <tr key={asset.id} className="border-b border-neutral-100 dark:border-neutral-850 hover:bg-neutral-50 dark:hover:bg-neutral-850/50">
                  <td className="px-4 py-3"><input type="checkbox" checked={selectedIds.has(asset.id)} onChange={() => toggleSelect(asset.id)} className="w-4 h-4 rounded accent-accent-500" /></td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      {asset.is_pinned && <Pin className="w-3 h-3 text-green-500" />}
                      <span className="font-medium text-neutral-900 dark:text-white">{asset.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3"><span className="inline-flex items-center gap-1 capitalize text-neutral-600 dark:text-neutral-400">{TYPE_ICONS[asset.asset_type]} {asset.asset_type.replace('_', ' ')}</span></td>
                  <td className="px-4 py-3 text-neutral-500">{asset.category}</td>
                  <td className="px-4 py-3 text-neutral-500">{asset.supported_modules.length || 'All'}</td>
                  <td className="px-4 py-3 text-right text-neutral-500">{asset.usage_count}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      {asset.is_premium && <span className="px-1.5 py-0.5 text-[9px] font-bold bg-yellow-100 text-yellow-700 dark:bg-yellow-950/30 dark:text-yellow-400 rounded">PRO</span>}
                      {asset.is_featured && <Star className="w-3.5 h-3.5 text-blue-500 fill-blue-500" />}
                      <span className={`w-2 h-2 rounded-full ${asset.is_active ? 'bg-green-400' : 'bg-red-400'}`} />
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <button onClick={() => setEditing(asset)} className="p-1.5 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800"><Edit3 className="w-3.5 h-3.5 text-neutral-500" /></button>
                      <button onClick={() => handleDelete(asset.id)} className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/30"><Trash2 className="w-3.5 h-3.5 text-red-500" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {total > 50 && (
        <div className="flex items-center justify-center gap-2">
          <button onClick={() => setPage(Math.max(1, page - 1))} disabled={page <= 1} className="px-3 py-1.5 text-sm border border-neutral-200 dark:border-neutral-800 rounded-lg disabled:opacity-40 hover:bg-neutral-100 dark:hover:bg-neutral-800">Prev</button>
          <span className="text-sm text-neutral-500">Page {page} of {Math.ceil(total / 50)}</span>
          <button onClick={() => setPage(page + 1)} disabled={page * 50 >= total} className="px-3 py-1.5 text-sm border border-neutral-200 dark:border-neutral-800 rounded-lg disabled:opacity-40 hover:bg-neutral-100 dark:hover:bg-neutral-800">Next</button>
        </div>
      )}

      {editing !== null && <AssetEditor asset={editing} onSave={handleSave} onClose={() => setEditing(null)} />}
    </div>
  )
}
