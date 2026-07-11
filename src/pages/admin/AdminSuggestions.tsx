import { useState, useEffect } from 'react'
import {
  Lightbulb, ChevronLeft, ChevronRight, X, Save,
  ThumbsUp, Calendar, User,
} from 'lucide-react'
import { adminSuggestions } from '@/api/admin'
import type { Suggestion, SuggestionStatus } from '@/types/admin'

const STATUS_OPTIONS: SuggestionStatus[] = ['new', 'in_review', 'accepted', 'rejected', 'completed']

const STATUS_STYLES: Record<SuggestionStatus, string> = {
  new: 'bg-blue-100 text-blue-700 dark:bg-blue-950/30 dark:text-blue-400',
  in_review: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-950/30 dark:text-yellow-400',
  accepted: 'bg-green-100 text-green-700 dark:bg-green-950/30 dark:text-green-400',
  rejected: 'bg-red-100 text-red-700 dark:bg-red-950/30 dark:text-red-400',
  completed: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400',
}

export function AdminSuggestionsPage() {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [statusFilter, setStatusFilter] = useState<SuggestionStatus | ''>('')
  const [isLoading, setIsLoading] = useState(true)
  const [selected, setSelected] = useState<Suggestion | null>(null)
  const [editStatus, setEditStatus] = useState<SuggestionStatus>('new')
  const [editNotes, setEditNotes] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const limit = 20

  useEffect(() => { loadSuggestions() }, [page, statusFilter])

  const loadSuggestions = async () => {
    try {
      setIsLoading(true)
      const res = await adminSuggestions.list({
        status: statusFilter || undefined,
        page,
        limit,
      })
      if (res.data) { setSuggestions(res.data.suggestions); setTotal(res.data.total) }
    } catch {} finally { setIsLoading(false) }
  }

  const openDetail = (suggestion: Suggestion) => {
    setSelected(suggestion)
    setEditStatus(suggestion.status)
    setEditNotes(suggestion.admin_notes || '')
  }

  const handleSave = async () => {
    if (!selected) return
    try {
      setIsSaving(true)
      await adminSuggestions.update(selected.id, {
        status: editStatus,
        admin_notes: editNotes,
      })
      setSuggestions(suggestions.map(s =>
        s.id === selected.id ? { ...s, status: editStatus, admin_notes: editNotes } : s
      ))
      setSelected(null)
    } catch {} finally { setIsSaving(false) }
  }

  const totalPages = Math.ceil(total / limit)

  return (
    <div className="p-4 lg:p-6 space-y-6 max-w-[1600px] mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-neutral-900 dark:text-white tracking-tight">Suggestions</h1>
        <p className="text-sm text-neutral-500 mt-0.5">{total} total suggestions</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => { setStatusFilter(''); setPage(1) }}
            className={`px-3 py-1.5 rounded-xl text-sm font-medium transition-colors ${
              statusFilter === ''
                ? 'bg-accent-600 text-white'
                : 'bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-800'
            }`}
          >
            All
          </button>
          {STATUS_OPTIONS.map(s => (
            <button
              key={s}
              onClick={() => { setStatusFilter(s); setPage(1) }}
              className={`px-3 py-1.5 rounded-xl text-sm font-medium transition-colors ${
                statusFilter === s
                  ? 'bg-accent-600 text-white'
                  : 'bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-800'
              }`}
            >
              {s.replace(/_/g, ' ')}
            </button>
          ))}
        </div>
      </div>

      <div className="flex gap-6">
        {/* Table */}
        <div className={`bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 overflow-hidden flex-1 ${selected ? 'hidden lg:block' : ''}`}>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-neutral-100 dark:border-neutral-800">
                  <th className="text-left px-5 py-3 text-[11px] font-bold uppercase tracking-wider text-neutral-500">Suggestion</th>
                  <th className="text-left px-5 py-3 text-[11px] font-bold uppercase tracking-wider text-neutral-500 hidden md:table-cell">User</th>
                  <th className="text-center px-5 py-3 text-[11px] font-bold uppercase tracking-wider text-neutral-500">Votes</th>
                  <th className="text-left px-5 py-3 text-[11px] font-bold uppercase tracking-wider text-neutral-500">Status</th>
                  <th className="text-left px-5 py-3 text-[11px] font-bold uppercase tracking-wider text-neutral-500 hidden lg:table-cell">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
                {isLoading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i}><td colSpan={5} className="px-5 py-4"><div className="h-5 bg-neutral-100 dark:bg-neutral-800 rounded animate-pulse" /></td></tr>
                  ))
                ) : suggestions.length === 0 ? (
                  <tr><td colSpan={5} className="px-5 py-12 text-center text-sm text-neutral-400">No suggestions found</td></tr>
                ) : suggestions.map(sug => (
                  <tr
                    key={sug.id}
                    onClick={() => openDetail(sug)}
                    className={`hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors cursor-pointer ${selected?.id === sug.id ? 'bg-accent-50 dark:bg-accent-950/10' : ''}`}
                  >
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <Lightbulb className="w-4 h-4 text-yellow-500 shrink-0" />
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-neutral-900 dark:text-white truncate">{sug.title}</p>
                          {sug.description && (
                            <p className="text-xs text-neutral-400 truncate max-w-[250px]">{sug.description}</p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3 hidden md:table-cell">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-neutral-200 dark:bg-neutral-700 flex items-center justify-center text-[10px] font-bold text-neutral-600 dark:text-neutral-300 shrink-0">
                          {sug.user?.display_name?.[0] || '?'}
                        </div>
                        <span className="text-sm text-neutral-600 dark:text-neutral-400 truncate max-w-[120px]">{sug.user?.display_name || 'Unknown'}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center justify-center gap-1">
                        <ThumbsUp className="w-3 h-3 text-neutral-400" />
                        <span className="text-sm font-bold text-neutral-700 dark:text-neutral-300">{sug.vote_count}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3">
                      <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold ${STATUS_STYLES[sug.status]}`}>
                        {sug.status.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td className="px-5 py-3 hidden lg:table-cell">
                      <p className="text-xs text-neutral-500">{new Date(sug.created_at).toLocaleDateString()}</p>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-between px-5 py-3 border-t border-neutral-100 dark:border-neutral-800">
              <p className="text-xs text-neutral-500">Page {page} of {totalPages}</p>
              <div className="flex gap-1">
                <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                  className="p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 disabled:opacity-30 disabled:cursor-not-allowed">
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                  className="p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 disabled:opacity-30 disabled:cursor-not-allowed">
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Detail Panel */}
        {selected && (
          <div className="w-full lg:w-[400px] shrink-0 bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-100 dark:border-neutral-800">
              <h2 className="font-bold text-neutral-900 dark:text-white text-sm">Suggestion Details</h2>
              <button onClick={() => setSelected(null)} className="p-1 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-400">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-5 space-y-5">
              {/* Title & Meta */}
              <div>
                <h3 className="text-lg font-bold text-neutral-900 dark:text-white">{selected.title}</h3>
                <div className="flex items-center gap-3 mt-2 text-xs text-neutral-500">
                  <span className="flex items-center gap-1"><User className="w-3 h-3" />{selected.user?.display_name || 'Unknown'}</span>
                  <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{new Date(selected.created_at).toLocaleDateString()}</span>
                  <span className="flex items-center gap-1"><ThumbsUp className="w-3 h-3" />{selected.vote_count} votes</span>
                </div>
              </div>

              {/* Description */}
              {selected.description && (
                <div>
                  <label className="text-xs font-bold text-neutral-500 uppercase tracking-wider">Description</label>
                  <p className="text-sm text-neutral-700 dark:text-neutral-300 mt-1 whitespace-pre-wrap">{selected.description}</p>
                </div>
              )}

              {/* Status */}
              <div>
                <label className="text-xs font-bold text-neutral-500 uppercase tracking-wider">Status</label>
                <select
                  value={editStatus}
                  onChange={e => setEditStatus(e.target.value as SuggestionStatus)}
                  className="w-full mt-1 px-3 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-sm text-neutral-700 dark:text-neutral-300 focus:outline-none focus:ring-2 focus:ring-accent-600"
                >
                  {STATUS_OPTIONS.map(s => (
                    <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>
                  ))}
                </select>
              </div>

              {/* Admin Notes */}
              <div>
                <label className="text-xs font-bold text-neutral-500 uppercase tracking-wider">Admin Notes</label>
                <textarea
                  value={editNotes}
                  onChange={e => setEditNotes(e.target.value)}
                  placeholder="Internal notes..."
                  rows={4}
                  className="w-full mt-1 px-3 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-sm text-neutral-700 dark:text-neutral-300 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-accent-600 resize-none"
                />
              </div>

              {/* Save */}
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-accent-600 hover:bg-accent-700 disabled:opacity-50 text-white text-sm font-medium transition-colors"
              >
                <Save className="w-4 h-4" />
                {isSaving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
