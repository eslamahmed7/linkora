import { useState, useEffect } from 'react'
import {
  Eye, QrCode, Users, TrendingUp, Palette, Layers, Bug,
  RefreshCw, BarChart3,
} from 'lucide-react'
import { adminDashboard } from '@/api/admin'

interface AnalyticsData {
  totalViews: number
  totalScans: number
  dailyRegistrations: number
  weeklyRegistrations: number
  designsByType: Record<string, number>
  submissionsByStatus: Record<string, number>
  bugsByPriority: Record<string, number>
  viewsOverTime?: Array<{ date: string; views: number; scans: number }>
}

const PERIOD_OPTIONS = [
  { value: '7d', label: '7 Days' },
  { value: '30d', label: '30 Days' },
  { value: '90d', label: '90 Days' },
] as const

const CHART_COLORS: Record<string, string> = {
  link_page_template: 'bg-blue-500',
  qr_template: 'bg-purple-500',
  nfc_template: 'bg-amber-500',
  background: 'bg-pink-500',
  qr_frame: 'bg-indigo-500',
  qr_style: 'bg-cyan-500',
  icon: 'bg-green-500',
  pattern: 'bg-teal-500',
  texture: 'bg-orange-500',
  animation: 'bg-red-500',
  font: 'bg-violet-500',
  color_pack: 'bg-emerald-500',
  gradient_pack: 'bg-fuchsia-500',
  glass_pack: 'bg-sky-500',
  svg_pack: 'bg-rose-500',
  sticker_pack: 'bg-lime-500',
  shape_pack: 'bg-slate-500',
}

const STATUS_COLORS: Record<string, string> = {
  draft: 'bg-neutral-500',
  submitted: 'bg-blue-500',
  pending_review: 'bg-yellow-500',
  needs_changes: 'bg-orange-500',
  approved: 'bg-green-500',
  rejected: 'bg-red-500',
  published: 'bg-emerald-500',
  archived: 'bg-neutral-400',
}

const PRIORITY_COLORS: Record<string, string> = {
  low: 'bg-blue-500',
  medium: 'bg-yellow-500',
  high: 'bg-orange-500',
  critical: 'bg-red-500',
}

function MiniBarChart({ data, colorMap }: { data: Record<string, number>; colorMap: Record<string, string> }) {
  const entries = Object.entries(data).sort((a, b) => b[1] - a[1])
  const max = Math.max(...entries.map(e => e[1]), 1)

  if (entries.length === 0) {
    return <p className="text-sm text-neutral-400 text-center py-4">No data</p>
  }

  return (
    <div className="space-y-2">
      {entries.map(([key, value]) => (
        <div key={key} className="flex items-center gap-3">
          <span className="text-xs text-neutral-500 w-28 truncate text-right font-medium">{key.replace(/_/g, ' ')}</span>
          <div className="flex-1 h-5 bg-neutral-100 dark:bg-neutral-800 rounded-md overflow-hidden">
            <div
              className={`h-full rounded-md ${colorMap[key] || 'bg-accent-500'} transition-all duration-500`}
              style={{ width: `${(value / max) * 100}%` }}
            />
          </div>
          <span className="text-xs font-bold text-neutral-700 dark:text-neutral-300 w-10 text-right">{value}</span>
        </div>
      ))}
    </div>
  )
}

function TimeChart({ data }: { data: Array<{ date: string; views: number; scans: number }> }) {
  const max = Math.max(...data.map(d => Math.max(d.views, d.scans)), 1)

  if (data.length === 0) {
    return <p className="text-sm text-neutral-400 text-center py-8">No timeline data</p>
  }

  return (
    <div className="flex items-end gap-1 h-40 pt-4">
      {data.map((d, i) => (
        <div key={i} className="flex-1 flex flex-col items-center gap-1 group relative">
          <div className="absolute bottom-full mb-2 hidden group-hover:block z-10 bg-neutral-900 dark:bg-neutral-700 text-white text-[10px] px-2 py-1 rounded-lg whitespace-nowrap shadow-lg">
            {d.date}: {d.views} views, {d.scans} scans
          </div>
          <div className="w-full flex gap-px items-end justify-center" style={{ height: '120px' }}>
            <div
              className="w-1/2 bg-blue-500 rounded-t-sm min-h-[2px] transition-all duration-300"
              style={{ height: `${(d.views / max) * 100}%` }}
            />
            <div
              className="w-1/2 bg-emerald-500 rounded-t-sm min-h-[2px] transition-all duration-300"
              style={{ height: `${(d.scans / max) * 100}%` }}
            />
          </div>
          {i % Math.max(1, Math.floor(data.length / 7)) === 0 && (
            <span className="text-[9px] text-neutral-400 mt-1 truncate w-full text-center">
              {new Date(d.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
            </span>
          )}
        </div>
      ))}
    </div>
  )
}

export function AdminAnalyticsPage() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [period, setPeriod] = useState<string>('30d')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => { loadAnalytics() }, [period])

  const loadAnalytics = async () => {
    try {
      setIsLoading(true)
      const res = await adminDashboard.getAnalytics({ period })
      if (res.data) setAnalytics(res.data as unknown as AnalyticsData)
    } catch {} finally { setIsLoading(false) }
  }

  if (isLoading && !analytics) {
    return (
      <div className="p-6 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-28 bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 animate-pulse" />
          ))}
        </div>
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-64 bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 animate-pulse" />
        ))}
      </div>
    )
  }

  const topStats = analytics ? [
    { label: 'Total Views', value: analytics.totalViews, icon: <Eye className="w-5 h-5" />, color: 'text-cyan-600 bg-cyan-50 dark:bg-cyan-950/30' },
    { label: 'Total Scans', value: analytics.totalScans, icon: <QrCode className="w-5 h-5" />, color: 'text-teal-600 bg-teal-50 dark:bg-teal-950/30' },
    { label: 'Daily Registrations', value: analytics.dailyRegistrations, icon: <Users className="w-5 h-5" />, color: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/30' },
    { label: 'Weekly Registrations', value: analytics.weeklyRegistrations, icon: <TrendingUp className="w-5 h-5" />, color: 'text-blue-600 bg-blue-50 dark:bg-blue-950/30' },
  ] : []

  return (
    <div className="p-4 lg:p-6 space-y-6 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-neutral-900 dark:text-white tracking-tight">Analytics</h1>
          <p className="text-sm text-neutral-500 mt-0.5">Platform performance and engagement metrics</p>
        </div>
        <div className="flex items-center gap-2">
          {PERIOD_OPTIONS.map(opt => (
            <button
              key={opt.value}
              onClick={() => setPeriod(opt.value)}
              className={`px-3 py-1.5 rounded-xl text-sm font-medium transition-colors ${
                period === opt.value
                  ? 'bg-accent-600 text-white'
                  : 'bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-800'
              }`}
            >
              {opt.label}
            </button>
          ))}
          <button onClick={loadAnalytics} className="p-2 rounded-xl border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-800 text-neutral-500 transition-colors">
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Top Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {topStats.map(card => (
          <div key={card.label} className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 p-5 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${card.color}`}>{card.icon}</div>
            </div>
            <p className="text-2xl font-extrabold text-neutral-900 dark:text-white">{card.value?.toLocaleString() ?? 0}</p>
            <p className="text-xs text-neutral-500 mt-0.5 font-medium">{card.label}</p>
          </div>
        ))}
      </div>

      {/* Timeline Chart */}
      {analytics?.viewsOverTime && analytics.viewsOverTime.length > 0 && (
        <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-neutral-500" />
              <h2 className="font-bold text-neutral-900 dark:text-white">Views & Scans Over Time</h2>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                <span className="text-[10px] text-neutral-500 font-medium">Views</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <span className="text-[10px] text-neutral-500 font-medium">Scans</span>
              </div>
            </div>
          </div>
          <TimeChart data={analytics.viewsOverTime} />
        </div>
      )}

      {/* Breakdown Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Designs by Type */}
        <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 p-5">
          <div className="flex items-center gap-2 mb-4">
            <Palette className="w-4 h-4 text-pink-500" />
            <h2 className="font-bold text-neutral-900 dark:text-white">Designs by Type</h2>
          </div>
          <MiniBarChart data={analytics?.designsByType || {}} colorMap={CHART_COLORS} />
        </div>

        {/* Submissions by Status */}
        <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 p-5">
          <div className="flex items-center gap-2 mb-4">
            <Layers className="w-4 h-4 text-violet-500" />
            <h2 className="font-bold text-neutral-900 dark:text-white">Submissions by Status</h2>
          </div>
          <MiniBarChart data={analytics?.submissionsByStatus || {}} colorMap={STATUS_COLORS} />
        </div>

        {/* Bugs by Priority */}
        <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 p-5">
          <div className="flex items-center gap-2 mb-4">
            <Bug className="w-4 h-4 text-red-500" />
            <h2 className="font-bold text-neutral-900 dark:text-white">Bugs by Priority</h2>
          </div>
          <MiniBarChart data={analytics?.bugsByPriority || {}} colorMap={PRIORITY_COLORS} />
        </div>
      </div>
    </div>
  )
}
