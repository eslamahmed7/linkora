import { useState, useEffect } from 'react'
import {
  Activity, ChevronLeft, ChevronRight, Search, Filter,
  User, FileText, Paintbrush, MessageSquare, Megaphone,
  Settings, Bug, Send,
} from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { adminActivity } from '@/api/admin'
import type { ActivityLog } from '@/types/admin'

const ENTITY_TYPES = ['', 'user', 'design', 'submission', 'suggestion', 'bug', 'message', 'announcement', 'setting']

const ENTITY_ICONS: Record<string, typeof Activity> = {
  user: User,
  design: Paintbrush,
  submission: FileText,
  suggestion: MessageSquare,
  bug: Bug,
  message: Send,
  announcement: Megaphone,
  setting: Settings,
}

const ENTITY_STYLES: Record<string, string> = {
  user: 'bg-blue-100 text-blue-700 dark:bg-blue-950/30 dark:text-blue-400',
  design: 'bg-purple-100 text-purple-700 dark:bg-purple-950/30 dark:text-purple-400',
  submission: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-950/30 dark:text-yellow-400',
  suggestion: 'bg-green-100 text-green-700 dark:bg-green-950/30 dark:text-green-400',
  bug: 'bg-red-100 text-red-700 dark:bg-red-950/30 dark:text-red-400',
  message: 'bg-orange-100 text-orange-700 dark:bg-orange-950/30 dark:text-orange-400',
  announcement: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-950/30 dark:text-cyan-400',
  setting: 'bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-400',
}

export function AdminActivityPage() {
  const { t } = useTranslation()
  const [logs, setLogs] = useState<ActivityLog[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [actionSearch, setActionSearch] = useState('')
  const [entityFilter, setEntityFilter] = useState('')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [showFilters, setShowFilters] = useState(false)
  const limit = 25

  useEffect(() => { loadActivity() }, [page, entityFilter])

  const loadActivity = async () => {
    try {
      setIsLoading(true)
      const res = await adminActivity.list({
        action: actionSearch || undefined,
        entity_type: entityFilter || undefined,
        page,
        limit,
      })
      if (res.data) {
        let filteredLogs = res.data.logs || []
        if (dateFrom) filteredLogs = filteredLogs.filter((l: ActivityLog) => new Date(l.created_at) >= new Date(dateFrom))
        if (dateTo) filteredLogs = filteredLogs.filter((l: ActivityLog) => new Date(l.created_at) <= new Date(dateTo + 'T23:59:59'))
        setLogs(filteredLogs)
        setTotal(res.data.total)
      }
    } catch {} finally { setIsLoading(false) }
  }

  const handleSearch = () => { setPage(1); loadActivity() }

  const totalPages = Math.ceil(total / limit)

  return (
    <div className="p-4 lg:p-6 space-y-6 max-w-[1600px] mx-auto">
      <div>
        <h1 className="text-2xl font-extrabold text-neutral-900 dark:text-white tracking-tight">{t('admin.activity.title')}</h1>
        <p className="text-sm text-neutral-500 mt-0.5">{t('admin.activity.subtitle', { total })}</p>
      </div>

      {/* Search & Filters */}
      <div className="space-y-3">
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <input
              type="text"
              value={actionSearch}
              onChange={e => setActionSearch(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSearch()}
              placeholder={t('admin.activity.searchPlaceholder')}
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-sm text-neutral-700 dark:text-neutral-300 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-accent-600"
            />
          </div>
          <button
            onClick={handleSearch}
            className="px-4 py-2.5 rounded-xl bg-accent-600 hover:bg-accent-700 text-white text-sm font-medium transition-colors"
          >
            {t('common.search')}
          </button>
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition-colors ${
              showFilters
                ? 'bg-accent-50 dark:bg-accent-950/20 border-accent-200 dark:border-accent-800 text-accent-700 dark:text-accent-400'
                : 'bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-800'
            }`}
          >
            <Filter className="w-4 h-4" />
            {t('common.filters')}
          </button>
        </div>

        {showFilters && (
          <div className="flex flex-wrap gap-3 p-4 bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800">
            <div>
              <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider">{t('admin.activity.fields.entityType')}</label>
              <select
                value={entityFilter}
                onChange={e => { setEntityFilter(e.target.value); setPage(1) }}
                className="w-full mt-1 px-3 py-2 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-sm text-neutral-700 dark:text-neutral-300 focus:outline-none focus:ring-2 focus:ring-accent-600"
              >
                <option value="">{t('admin.activity.filters.allTypes')}</option>
                {ENTITY_TYPES.filter(Boolean).map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider">{t('admin.activity.fields.dateFrom')}</label>
              <input
                type="date"
                value={dateFrom}
                onChange={e => setDateFrom(e.target.value)}
                className="w-full mt-1 px-3 py-2 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-sm text-neutral-700 dark:text-neutral-300 focus:outline-none focus:ring-2 focus:ring-accent-600"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider">{t('admin.activity.fields.dateTo')}</label>
              <input
                type="date"
                value={dateTo}
                onChange={e => setDateTo(e.target.value)}
                className="w-full mt-1 px-3 py-2 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-sm text-neutral-700 dark:text-neutral-300 focus:outline-none focus:ring-2 focus:ring-accent-600"
              />
            </div>
            <div className="flex items-end">
              <button
                onClick={() => { setActionSearch(''); setEntityFilter(''); setDateFrom(''); setDateTo(''); setPage(1) }}
                className="px-3 py-2 rounded-xl text-sm text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
              >
                {t('common.clearAll')}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-neutral-100 dark:border-neutral-800">
                <th className="text-left px-5 py-3 text-[11px] font-bold uppercase tracking-wider text-neutral-500">{t('admin.activity.table.user')}</th>
                <th className="text-left px-5 py-3 text-[11px] font-bold uppercase tracking-wider text-neutral-500">{t('admin.activity.table.action')}</th>
                <th className="text-left px-5 py-3 text-[11px] font-bold uppercase tracking-wider text-neutral-500 hidden md:table-cell">{t('admin.activity.table.entity')}</th>
                <th className="text-left px-5 py-3 text-[11px] font-bold uppercase tracking-wider text-neutral-500 hidden lg:table-cell">{t('admin.activity.table.entityId')}</th>
                <th className="text-left px-5 py-3 text-[11px] font-bold uppercase tracking-wider text-neutral-500 hidden lg:table-cell">{t('admin.activity.table.ipAddress')}</th>
                <th className="text-left px-5 py-3 text-[11px] font-bold uppercase tracking-wider text-neutral-500">{t('admin.activity.table.timestamp')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
              {isLoading ? (
                Array.from({ length: 8 }).map((_, i) => (
                  <tr key={i}><td colSpan={6} className="px-5 py-4"><div className="h-5 bg-neutral-100 dark:bg-neutral-800 rounded animate-pulse" /></td></tr>
                ))
              ) : logs.length === 0 ? (
                <tr><td colSpan={6} className="px-5 py-12 text-center text-sm text-neutral-400">{t('admin.activity.empty')}</td></tr>
              ) : logs.map(log => {
                const EntityIcon = log.entity_type ? ENTITY_ICONS[log.entity_type] || FileText : FileText
                return (
                  <tr key={log.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2.5">
                        {log.user?.avatar_url ? (
                          <img src={log.user.avatar_url} alt="" className="w-7 h-7 rounded-full object-cover shrink-0" />
                        ) : (
                          <div className="w-7 h-7 rounded-full bg-neutral-200 dark:bg-neutral-700 flex items-center justify-center text-[10px] font-bold text-neutral-600 dark:text-neutral-300 shrink-0">
                            {log.user?.display_name?.[0] || '?'}
                          </div>
                        )}
                        <span className="text-sm text-neutral-700 dark:text-neutral-300 truncate max-w-[120px]">
                          {log.user?.display_name || t('common.system')}
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-3">
                      <p className="text-sm text-neutral-700 dark:text-neutral-300 truncate max-w-[250px]">{log.action}</p>
                    </td>
                    <td className="px-5 py-3 hidden md:table-cell">
                      {log.entity_type && (
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${ENTITY_STYLES[log.entity_type] || ENTITY_STYLES.setting}`}>
                          <EntityIcon className="w-3 h-3" />
                          {log.entity_type}
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-3 hidden lg:table-cell">
                      {log.entity_id && (
                        <code className="text-[11px] text-neutral-500 bg-neutral-100 dark:bg-neutral-800 px-1.5 py-0.5 rounded font-mono">
                          {log.entity_id.length > 12 ? log.entity_id.slice(0, 12) + '...' : log.entity_id}
                        </code>
                      )}
                    </td>
                    <td className="px-5 py-3 hidden lg:table-cell">
                      <span className="text-xs text-neutral-400 font-mono">{log.ip_address || '-'}</span>
                    </td>
                    <td className="px-5 py-3">
                      <p className="text-xs text-neutral-500">{new Date(log.created_at).toLocaleString()}</p>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-between px-5 py-3 border-t border-neutral-100 dark:border-neutral-800">
            <p className="text-xs text-neutral-500">{t('common.pageOf', { page, total: totalPages })}</p>
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
    </div>
  )
}
