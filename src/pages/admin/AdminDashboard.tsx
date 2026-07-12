import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import {
  Users, FileText, QrCode, Zap, Palette, Layers, Eye, Download,
  TrendingUp, Activity, Lightbulb,
  Bug, RefreshCw,
} from 'lucide-react'
import { adminDashboard } from '@/api/admin'
import type { DashboardStats } from '@/types/admin'

export function AdminDashboard() {
  const { t } = useTranslation()
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => { loadStats() }, [])

  const loadStats = async () => {
    try {
      setIsLoading(true)
      const res = await adminDashboard.getStats()
      if (res.data) setStats(res.data)
    } catch {} finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="h-28 bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 animate-pulse" />
          ))}
        </div>
      </div>
    )
  }

  if (!stats) return null

  const statCards = [
    { label: t('admin.dashboard.stats.totalUsers'), value: stats.totalUsers, icon: <Users className="w-5 h-5" />, color: 'text-blue-600 bg-blue-50 dark:bg-blue-950/30' },
    { label: t('admin.dashboard.stats.activeUsers'), value: stats.activeUsers, icon: <TrendingUp className="w-5 h-5" />, color: 'text-green-600 bg-green-50 dark:bg-green-950/30' },
    { label: t('admin.dashboard.stats.totalPages'), value: stats.totalPages, icon: <FileText className="w-5 h-5" />, color: 'text-purple-600 bg-purple-50 dark:bg-purple-950/30' },
    { label: t('admin.dashboard.stats.qrCodes'), value: stats.totalQRCodes, icon: <QrCode className="w-5 h-5" />, color: 'text-indigo-600 bg-indigo-50 dark:bg-indigo-950/30' },
    { label: t('admin.dashboard.stats.nfcCards'), value: stats.totalNFCCards, icon: <Zap className="w-5 h-5" />, color: 'text-amber-600 bg-amber-50 dark:bg-amber-950/30' },
    { label: t('admin.dashboard.stats.designs'), value: stats.totalDesigns, icon: <Palette className="w-5 h-5" />, color: 'text-pink-600 bg-pink-50 dark:bg-pink-950/30' },
    { label: t('admin.dashboard.stats.totalViews'), value: stats.totalViews, icon: <Eye className="w-5 h-5" />, color: 'text-cyan-600 bg-cyan-50 dark:bg-cyan-950/30' },
    { label: t('admin.dashboard.stats.totalScans'), value: stats.totalScans, icon: <Download className="w-5 h-5" />, color: 'text-teal-600 bg-teal-50 dark:bg-teal-950/30' },
    { label: t('admin.dashboard.stats.dailyRegistrations'), value: stats.dailyRegistrations, icon: <Users className="w-5 h-5" />, color: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/30' },
    { label: t('admin.dashboard.stats.submissions'), value: stats.totalSubmissions, icon: <Layers className="w-5 h-5" />, color: 'text-violet-600 bg-violet-50 dark:bg-violet-950/30' },
    { label: t('admin.dashboard.stats.suggestions'), value: stats.totalSuggestions, icon: <Lightbulb className="w-5 h-5" />, color: 'text-yellow-600 bg-yellow-50 dark:bg-yellow-950/30' },
    { label: t('admin.dashboard.stats.bugReports'), value: stats.totalBugReports, icon: <Bug className="w-5 h-5" />, color: 'text-red-600 bg-red-50 dark:bg-red-950/30' },
  ]

  return (
    <div className="p-4 lg:p-6 space-y-6 max-w-[1600px] mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-neutral-900 dark:text-white tracking-tight">{t('admin.dashboard.title')}</h1>
          <p className="text-sm text-neutral-500 mt-0.5">{t('admin.dashboard.subtitle')}</p>
        </div>
        <button onClick={loadStats} className="flex items-center gap-2 px-3 py-2 rounded-xl border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-900 text-sm font-medium text-neutral-600 dark:text-neutral-400 transition-colors">
          <RefreshCw className="w-4 h-4" />
          {t('common.refresh')}
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map(card => (
          <div key={card.label} className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 p-5 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${card.color}`}>{card.icon}</div>
            </div>
            <p className="text-2xl font-extrabold text-neutral-900 dark:text-white">{card.value.toLocaleString()}</p>
            <p className="text-xs text-neutral-500 mt-0.5 font-medium">{card.label}</p>
          </div>
        ))}
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Submissions */}
        <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800">
          <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-100 dark:border-neutral-800">
            <h2 className="font-bold text-neutral-900 dark:text-white">{t('admin.dashboard.sections.recentSubmissions')}</h2>
            <span className="text-xs text-neutral-400">{stats.recentSubmissions.length}</span>
          </div>
          <div className="divide-y divide-neutral-100 dark:divide-neutral-800 max-h-[400px] overflow-y-auto">
            {stats.recentSubmissions.length === 0 ? (
              <p className="p-5 text-sm text-neutral-400 text-center">{t('admin.dashboard.empty.submissions')}</p>
            ) : stats.recentSubmissions.map(sub => (
              <div key={sub.id} className="flex items-center gap-3 px-5 py-3 hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors">
                <div className="w-8 h-8 rounded-full bg-neutral-200 dark:bg-neutral-700 flex items-center justify-center text-xs font-bold text-neutral-600 dark:text-neutral-300 shrink-0">
                  {sub.user?.display_name?.[0] || '?'}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-neutral-900 dark:text-white truncate">{sub.title}</p>
                  <p className="text-[10px] text-neutral-400">{sub.type} · {sub.status} · {new Date(sub.created_at).toLocaleDateString()}</p>
                </div>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                  sub.status === 'approved' ? 'bg-green-100 text-green-700 dark:bg-green-950/30 dark:text-green-400' :
                  sub.status === 'rejected' ? 'bg-red-100 text-red-700 dark:bg-red-950/30 dark:text-red-400' :
                  'bg-blue-100 text-blue-700 dark:bg-blue-950/30 dark:text-blue-400'
                }`}>{sub.status}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Suggestions */}
        <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800">
          <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-100 dark:border-neutral-800">
            <h2 className="font-bold text-neutral-900 dark:text-white">{t('admin.dashboard.sections.recentSuggestions')}</h2>
            <span className="text-xs text-neutral-400">{stats.recentSuggestions.length}</span>
          </div>
          <div className="divide-y divide-neutral-100 dark:divide-neutral-800 max-h-[400px] overflow-y-auto">
            {stats.recentSuggestions.length === 0 ? (
              <p className="p-5 text-sm text-neutral-400 text-center">{t('admin.dashboard.empty.suggestions')}</p>
            ) : stats.recentSuggestions.map(sug => (
              <div key={sug.id} className="flex items-center gap-3 px-5 py-3 hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors">
                <div className="flex flex-col items-center justify-center w-10 shrink-0">
                  <Lightbulb className="w-4 h-4 text-yellow-500" />
                  <span className="text-[10px] font-bold text-neutral-500">{sug.vote_count}</span>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-neutral-900 dark:text-white truncate">{sug.title}</p>
                  <p className="text-[10px] text-neutral-400">{sug.category} · {new Date(sug.created_at).toLocaleDateString()}</p>
                </div>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                  sug.status === 'accepted' ? 'bg-green-100 text-green-700 dark:bg-green-950/30 dark:text-green-400' :
                  sug.status === 'completed' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400' :
                  'bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400'
                }`}>{sug.status}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 lg:col-span-2">
          <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-100 dark:border-neutral-800">
            <h2 className="font-bold text-neutral-900 dark:text-white">{t('admin.dashboard.sections.recentActivity')}</h2>
            <Activity className="w-4 h-4 text-neutral-400" />
          </div>
          <div className="divide-y divide-neutral-100 dark:divide-neutral-800 max-h-[300px] overflow-y-auto">
            {stats.recentActivity.length === 0 ? (
              <p className="p-5 text-sm text-neutral-400 text-center">{t('admin.dashboard.empty.activity')}</p>
            ) : stats.recentActivity.map(log => (
              <div key={log.id} className="flex items-center gap-3 px-5 py-2.5 hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors">
                <div className="w-8 h-8 rounded-full bg-neutral-200 dark:bg-neutral-700 flex items-center justify-center text-xs shrink-0 overflow-hidden">
                  {log.user?.avatar_url ? (
                    <img src={log.user.avatar_url} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <span className="font-bold text-neutral-500">{log.user?.display_name?.[0] || '?'}</span>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-neutral-900 dark:text-white">
                    <span className="font-medium">{log.user?.display_name || 'System'}</span>
                    <span className="text-neutral-500"> {log.action} </span>
                    <span className="font-medium">{log.entity_type || ''}</span>
                  </p>
                </div>
                <span className="text-[10px] text-neutral-400 shrink-0">
                  {new Date(log.created_at).toLocaleTimeString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
