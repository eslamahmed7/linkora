import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Search, Star, Eye, Download, Trash2, MoreHorizontal,
  ChevronLeft, ChevronRight, Palette, Plus, Pencil,
} from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { adminDesigns } from '@/api/admin'
import { DESIGN_TYPE_LABELS, type DesignMarketplaceItem, type DesignType } from '@/types/admin'

export function AdminTemplatesPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [designs, setDesigns] = useState<DesignMarketplaceItem[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [searchInput, setSearchInput] = useState('')
  const [typeFilter, setTypeFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [openMenu, setOpenMenu] = useState<string | null>(null)
  const menuRef = useRef<HTMLDivElement>(null)
  const limit = 20

  useEffect(() => { loadDesigns() }, [page, typeFilter, statusFilter, search])

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setOpenMenu(null)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const loadDesigns = async () => {
    try {
      setIsLoading(true)
      const res = await adminDesigns.list({
        search,
        type: (typeFilter as DesignType) || undefined,
        status: statusFilter || undefined,
        page,
        limit,
      })
      if (res.data) {
        setDesigns(res.data.designs)
        setTotal(res.data.total)
      }
    } catch {} finally { setIsLoading(false) }
  }

  const handleSearch = (e?: React.FormEvent) => {
    e?.preventDefault()
    setSearch(searchInput)
    setPage(1)
  }

  const handleToggleFeatured = async (id: string, featured: boolean) => {
    try {
      await adminDesigns.feature(id, featured)
      setDesigns(d => d.map(item => item.id === id ? { ...item, is_featured: featured } : item))
      setOpenMenu(null)
    } catch {}
  }

  const handleTogglePublish = async (id: string, published: boolean) => {
    try {
      await adminDesigns.update(id, { status: published ? 'published' : 'draft', is_published: published })
      setDesigns(d => d.map(item => item.id === id
        ? { ...item, is_published: published, status: published ? 'published' as const : 'draft' as const }
        : item
      ))
      setOpenMenu(null)
    } catch {}
  }

  const handleDelete = async (id: string) => {
    if (!window.confirm(t('admin.templates.confirmDelete'))) return
    try {
      await adminDesigns.delete(id)
      setDesigns(d => d.filter(item => item.id !== id))
      setTotal(t => t - 1)
      setOpenMenu(null)
    } catch {}
  }

  const totalPages = Math.ceil(total / limit)
  const types: DesignType[] = Object.keys(DESIGN_TYPE_LABELS) as DesignType[]

  return (
    <div className="p-4 lg:p-6 space-y-6 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold text-neutral-900 dark:text-white tracking-tight">{t('admin.templates.title')}</h1>
          <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-0.5">{t('admin.templates.subtitle', { total })}</p>
        </div>
        <button
          onClick={() => navigate('/admin/templates/new')}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-accent-600 hover:bg-accent-700 text-white text-sm font-semibold transition-colors"
        >
          <Plus className="w-4 h-4" />
          {t('admin.templates.createTemplate')}
        </button>
      </div>

      {/* Filters */}
      <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
          <input
            type="text"
            placeholder={t('admin.templates.searchPlaceholder')}
            value={searchInput}
            onChange={e => setSearchInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSearch()}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white text-sm placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-accent-600"
          />
        </div>
        <select
          value={typeFilter}
          onChange={e => { setTypeFilter(e.target.value); setPage(1) }}
          className="px-3 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-accent-600"
        >
          <option value="">{t('admin.templates.filters.allTypes')}</option>
          {types.map(t => (
            <option key={t} value={t}>{DESIGN_TYPE_LABELS[t]}</option>
          ))}
        </select>
        <select
          value={statusFilter}
          onChange={e => { setStatusFilter(e.target.value); setPage(1) }}
          className="px-3 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-accent-600"
        >
          <option value="">{t('admin.templates.filters.allStatus')}</option>
          <option value="published">Published</option>
          <option value="draft">Draft</option>
          <option value="archived">Archived</option>
        </select>
      </form>

      {/* Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-72 bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 animate-pulse" />
          ))}
        </div>
      ) : designs.length === 0 ? (
        <div className="text-center py-16">
          <Palette className="w-12 h-12 text-neutral-300 dark:text-neutral-600 mx-auto mb-3" />
          <p className="text-neutral-500 dark:text-neutral-400">{t('admin.templates.empty')}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {designs.map(design => (
            <div
              key={design.id}
              className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 overflow-hidden hover:shadow-md transition-shadow group relative"
            >
              {/* Thumbnail */}
              <div className="aspect-[16/10] bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center relative overflow-hidden">
                {design.thumbnail_url ? (
                  <img src={design.thumbnail_url} alt={design.title} className="w-full h-full object-cover" />
                ) : (
                  <Palette className="w-8 h-8 text-neutral-300 dark:text-neutral-600" />
                )}
                {/* Badges - left */}
                <div className="absolute top-2 left-2 flex flex-wrap gap-1">
                  {design.is_premium && (
                    <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-amber-500 text-white shadow">{t('common.pro')}</span>
                  )}
                  {design.is_featured && (
                    <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-accent-600 text-white shadow">{t('common.featured')}</span>
                  )}
                </div>
                {/* Status badge - right */}
                <span className={`absolute top-2 right-2 px-1.5 py-0.5 rounded text-[9px] font-bold shadow ${
                  design.status === 'published'
                    ? 'bg-green-500/90 text-white'
                    : design.status === 'draft'
                    ? 'bg-yellow-500/90 text-white'
                    : 'bg-neutral-500/90 text-white'
                }`}>
                  {design.status}
                </span>
                {/* Type badge - bottom left */}
                <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded-md text-[9px] font-semibold bg-black/60 text-white backdrop-blur-sm">
                  {DESIGN_TYPE_LABELS[design.type] || design.type}
                </span>
              </div>

              {/* Info */}
              <div className="p-3.5 space-y-2.5">
                {/* Title + context menu */}
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <h3 className="text-sm font-bold text-neutral-900 dark:text-white truncate">{design.title}</h3>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      {design.category && (
                        <span className="text-[10px] text-neutral-500 dark:text-neutral-400">{design.category}</span>
                      )}
                      {design.author && (
                        <span className="text-[10px] text-neutral-400 dark:text-neutral-500 truncate">{t('admin.templates.byAuthor', { author: design.author.display_name })}</span>
                      )}
                    </div>
                  </div>
                  <div className="relative shrink-0" ref={openMenu === design.id ? menuRef : undefined}>
                    <button
                      onClick={() => setOpenMenu(openMenu === design.id ? null : design.id)}
                      className="p-1 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <MoreHorizontal className="w-4 h-4 text-neutral-500" />
                    </button>
                    {openMenu === design.id && (
                      <>
                        <div className="fixed inset-0 z-10" onClick={() => setOpenMenu(null)} />
                        <div className="absolute right-0 top-full mt-1 z-20 w-48 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-xl py-1.5">
                          <button
                            onClick={() => navigate(`/admin/templates/${design.id}/edit`)}
                            className="w-full text-left px-3 py-1.5 text-sm hover:bg-neutral-100 dark:hover:bg-neutral-800 flex items-center gap-2 text-neutral-700 dark:text-neutral-300"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                            {t('admin.templates.editInEditor')}
                          </button>
                          <button
                            onClick={() => handleToggleFeatured(design.id, !design.is_featured)}
                            className="w-full text-left px-3 py-1.5 text-sm hover:bg-neutral-100 dark:hover:bg-neutral-800 flex items-center gap-2 text-neutral-700 dark:text-neutral-300"
                          >
                            <Star className={`w-3.5 h-3.5 ${design.is_featured ? 'fill-amber-400 text-amber-400' : ''}`} />
                            {design.is_featured ? t('admin.templates.unfeature') : t('admin.templates.feature')}
                          </button>
                          <button
                            onClick={() => handleTogglePublish(design.id, !design.is_published)}
                            className="w-full text-left px-3 py-1.5 text-sm hover:bg-neutral-100 dark:hover:bg-neutral-800 flex items-center gap-2 text-neutral-700 dark:text-neutral-300"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            {design.is_published ? t('admin.templates.unpublish') : t('admin.templates.publish')}
                          </button>
                          <div className="mx-2 my-1 border-t border-neutral-200 dark:border-neutral-800" />
                          <button
                            onClick={() => handleDelete(design.id)}
                            className="w-full text-left px-3 py-1.5 text-sm hover:bg-red-50 dark:hover:bg-red-950/20 text-red-600 flex items-center gap-2"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            {t('admin.templates.delete')}
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Version + Stats */}
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono text-neutral-400 dark:text-neutral-500 bg-neutral-100 dark:bg-neutral-800 px-1.5 py-0.5 rounded">
                    v{design.version}
                  </span>
                  <div className="flex items-center gap-3 text-[10px] text-neutral-400 dark:text-neutral-500">
                    <span className="flex items-center gap-1">
                      <Download className="w-3 h-3" />
                      {design.download_count.toLocaleString()}
                    </span>
                    <span className="flex items-center gap-1">
                      <Eye className="w-3 h-3" />
                      {design.view_count.toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Edit in Editor - visible CTA */}
                <button
                  onClick={() => navigate(`/admin/templates/${design.id}/edit`)}
                  className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-neutral-100 dark:bg-neutral-800 hover:bg-accent-600 dark:hover:bg-accent-600 hover:text-white text-neutral-600 dark:text-neutral-400 text-xs font-semibold transition-colors"
                >
                  <Pencil className="w-3.5 h-3.5" />
                  {t('admin.templates.editInEditor')}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-2">
          <p className="text-xs text-neutral-500 dark:text-neutral-400">
            {t('common.pageOf', { page, total: totalPages })}
          </p>
          <div className="flex gap-1">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 disabled:opacity-30 text-neutral-700 dark:text-neutral-300"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 disabled:opacity-30 text-neutral-700 dark:text-neutral-300"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
