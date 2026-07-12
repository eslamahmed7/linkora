import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { apiClient } from '@/api/client'
import { pagesAPI, LinkPage } from '@/api/pages'
import { TrendingUp, Eye, MousePointerClick, Users, BarChart2, Calendar } from 'lucide-react'

type Range = '7d' | '30d' | 'all'

interface PageStats {
  totalViews: number
  totalClicks: number
  uniqueVisitors: number
  topLinks: { title: string; url: string; clicks: number }[]
  viewsByDay: { date: string; count: number }[]
}

function BarChart({ data }: { data: { label: string; value: number }[] }) {
  const max = Math.max(...data.map(d => d.value), 1)
  return (
    <div className="flex items-end gap-1 h-28 w-full">
      {data.map((d, i) => (
        <div key={i} className="flex-1 flex flex-col items-center gap-1 group">
          <div
            className="w-full rounded-t bg-accent-500/70 hover:bg-accent-500 transition-all"
            style={{ height: `${(d.value / max) * 100}%`, minHeight: d.value > 0 ? 4 : 1 }}
            title={`${d.label}: ${d.value}`}
          />
        </div>
      ))}
    </div>
  )
}

export function AnalyticsPage() {
  const { t } = useTranslation()
  const [pages, setPages] = useState<LinkPage[]>([])
  const [selectedPage, setSelectedPage] = useState<string>('')
  const [range, setRange] = useState<Range>('7d')
  const [stats, setStats] = useState<PageStats | null>(null)
  const [loading, setLoading] = useState(false)
  const [pagesLoading, setPagesLoading] = useState(true)

  useEffect(() => {
    pagesAPI.list().then(res => {
      const ps = (res.pages || []) as unknown as LinkPage[]
      setPages(ps)
      if (ps.length > 0) setSelectedPage(ps[0].id)
    }).finally(() => setPagesLoading(false))
  }, [])

  useEffect(() => {
    if (!selectedPage) return
    setLoading(true)
    apiClient.get<any>(`/analytics/page/${selectedPage}/stats`)
      .then(res => {
        const d = res.data as any
        setStats({
          totalViews: d?.totalViews || d?.viewCount || 0,
          totalClicks: d?.totalClicks || d?.clickCount || 0,
          uniqueVisitors: d?.uniqueVisitors || 0,
          topLinks: d?.topLinks || [],
          viewsByDay: d?.viewsByDay || [],
        })
      })
      .catch(() => setStats({ totalViews: 0, totalClicks: 0, uniqueVisitors: 0, topLinks: [], viewsByDay: [] }))
      .finally(() => setLoading(false))
  }, [selectedPage, range])

  // Generate last N days from stats or fallback empty
  const chartData = (() => {
    const days = range === '7d' ? 7 : range === '30d' ? 30 : 14
    const map = new Map<string, number>()
    ;(stats?.viewsByDay || []).forEach((v: any) => map.set(v.date?.slice(0, 10), v.count))
    return Array.from({ length: days }, (_, i) => {
      const d = new Date()
      d.setDate(d.getDate() - (days - 1 - i))
      const key = d.toISOString().slice(0, 10)
      return { label: d.toLocaleDateString('en', { month: 'short', day: 'numeric' }), value: map.get(key) || 0 }
    })
  })()

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900 dark:text-white flex items-center gap-2">
            <BarChart2 className="w-7 h-7 text-accent-600" />
            {t('analytics.title')}
          </h1>
          <p className="text-neutral-500 dark:text-neutral-400 text-sm mt-1">
            {t('analytics.subtitle')}
          </p>
        </div>

        {/* Controls */}
        <div className="flex gap-2 flex-wrap">
          {/* Page selector */}
          <select
            value={selectedPage}
            onChange={e => setSelectedPage(e.target.value)}
            disabled={pagesLoading}
            className="text-sm bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-xl px-3 py-2 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-accent-600"
          >
            {pages.length === 0 && <option value="">{t('analytics.noPages')}</option>}
            {pages.map(p => <option key={p.id} value={p.id}>{p.title}</option>)}
          </select>

          {/* Range */}
          <div className="flex rounded-xl border border-neutral-200 dark:border-neutral-700 overflow-hidden bg-white dark:bg-neutral-900">
            {([['7d', t('analytics.ranges.7d')], ['30d', t('analytics.ranges.30d')], ['all', t('analytics.ranges.all')]] as [Range, string][]).map(([v, l]) => (
              <button
                key={v}
                onClick={() => setRange(v)}
                className={`px-3 py-2 text-xs font-semibold transition-colors ${
                  range === v
                    ? 'bg-accent-600 text-white'
                    : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
                }`}
              >
                {l}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {[
          { label: t('analytics.stats.pageViews'), value: stats?.totalViews ?? '—', icon: Eye, color: 'text-blue-600 bg-blue-100 dark:bg-blue-900/40 dark:text-blue-400' },
          { label: t('analytics.stats.linkClicks'), value: stats?.totalClicks ?? '—', icon: MousePointerClick, color: 'text-purple-600 bg-purple-100 dark:bg-purple-900/40 dark:text-purple-400' },
          { label: t('analytics.stats.uniqueVisitors'), value: stats?.uniqueVisitors ?? '—', icon: Users, color: 'text-green-600 bg-green-100 dark:bg-green-900/40 dark:text-green-400' },
        ].map(card => (
          <div key={card.label} className="bg-white dark:bg-neutral-950 rounded-2xl border border-neutral-200 dark:border-neutral-800 p-5 flex items-center gap-4">
            <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${card.color}`}>
              <card.icon className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">{card.label}</p>
              <p className="text-2xl font-bold text-neutral-900 dark:text-white">
                {loading ? <span className="text-neutral-300 dark:text-neutral-700">—</span> : card.value}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Chart */}
      <div className="bg-white dark:bg-neutral-950 rounded-2xl border border-neutral-200 dark:border-neutral-800 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-neutral-900 dark:text-white flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-accent-600" />
            {t('analytics.charts.viewsOverTime')}
          </h2>
          <div className="flex items-center gap-1 text-xs text-neutral-400">
            <Calendar className="w-3.5 h-3.5" />
            {range === 'all' ? t('analytics.ranges.lastAll') : range === '7d' ? t('analytics.ranges.last7') : t('analytics.ranges.last30')}
          </div>
        </div>
        {loading ? (
          <div className="h-28 bg-neutral-100 dark:bg-neutral-800 rounded-xl animate-pulse" />
        ) : (
          <>
            <BarChart data={chartData} />
            <div className="flex justify-between mt-2">
              <span className="text-xs text-neutral-400">{chartData[0]?.label}</span>
              <span className="text-xs text-neutral-400">{chartData[chartData.length - 1]?.label}</span>
            </div>
          </>
        )}
        {!loading && chartData.every(d => d.value === 0) && (
          <p className="text-center text-sm text-neutral-400 mt-4">{t('analytics.emptyViews')}</p>
        )}
      </div>

      {/* Top Links */}
      <div className="bg-white dark:bg-neutral-950 rounded-2xl border border-neutral-200 dark:border-neutral-800 p-6">
        <h2 className="font-bold text-neutral-900 dark:text-white mb-4">{t('analytics.charts.topLinks')}</h2>
        {loading ? (
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => <div key={i} className="h-10 bg-neutral-100 dark:bg-neutral-800 rounded-xl animate-pulse" />)}
          </div>
        ) : (stats?.topLinks || []).length === 0 ? (
          <p className="text-neutral-400 text-sm">{t('analytics.emptyClicks')}</p>
        ) : (
          <div className="space-y-3">
            {(stats?.topLinks || []).map((link, i) => {
              const maxClicks = Math.max(...(stats?.topLinks || []).map(l => l.clicks), 1)
              return (
                <div key={i} className="flex items-center gap-3">
                  <span className="text-xs font-bold text-neutral-400 w-5">#{i + 1}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-neutral-900 dark:text-white truncate">{link.title}</p>
                    <div className="w-full h-1.5 bg-neutral-100 dark:bg-neutral-800 rounded-full mt-1">
                      <div
                        className="h-full bg-accent-500 rounded-full"
                        style={{ width: `${(link.clicks / maxClicks) * 100}%` }}
                      />
                    </div>
                  </div>
                  <span className="text-sm font-semibold text-neutral-600 dark:text-neutral-300 w-10 text-right">
                    {link.clicks}
                  </span>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
