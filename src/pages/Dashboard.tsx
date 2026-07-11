import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { dashboardAPI, DashboardStats, RecentActivity } from '@/api/dashboard'
import {
  FileText, QrCode, MousePointerClick, TrendingUp, Plus, Eye,
  ArrowRight, Zap, Globe, CheckCircle2, Circle, Sparkles
} from 'lucide-react'

function StatCard({ label, value, icon: Icon, color, sub }: {
  label: string
  value: string | number
  icon: any
  color: string
  sub?: string
}) {
  return (
    <div className="bg-white dark:bg-neutral-950 rounded-2xl border border-neutral-200 dark:border-neutral-800 p-5 flex flex-col gap-4 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-neutral-500 dark:text-neutral-400">{label}</span>
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
      <div>
        <p className="text-3xl font-bold text-neutral-900 dark:text-white">{value}</p>
        {sub && <p className="text-xs text-neutral-400 mt-0.5">{sub}</p>}
      </div>
    </div>
  )
}

function getGreeting() {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning'
  if (h < 17) return 'Good afternoon'
  return 'Good evening'
}

export function DashboardPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [activities, setActivities] = useState<RecentActivity[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    Promise.all([dashboardAPI.getStats(), dashboardAPI.getRecentActivity()])
      .then(([statsRes, actRes]) => {
        setStats(statsRes.stats)
        setActivities(actRes.activities)
      })
      .catch(() => {})
      .finally(() => setIsLoading(false))
  }, [])

  const firstName = user?.displayName?.split(' ')[0] || 'there'

  const checklist = [
    { label: 'Create your first page', done: (stats?.pagesCount ?? 0) > 0, href: '/pages/new' },
    { label: 'Add links to your page', done: (stats?.clickCount ?? 0) >= 0 && (stats?.pagesCount ?? 0) > 0, href: '/pages' },
    { label: 'Create a QR code', done: (stats?.qrCount ?? 0) > 0, href: '/qr/new' },
    { label: 'Publish your page', done: activities.some(a => a.type === 'page' && a.isPublished), href: '/pages' },
  ]
  const doneCount = checklist.filter(c => c.done).length
  const progress = Math.round((doneCount / checklist.length) * 100)

  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-28 bg-neutral-200 dark:bg-neutral-800 rounded-2xl" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => <div key={i} className="h-28 bg-neutral-200 dark:bg-neutral-800 rounded-2xl" />)}
        </div>
        <div className="h-64 bg-neutral-200 dark:bg-neutral-800 rounded-2xl" />
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto">

      {/* Hero Greeting */}
      <div className="relative overflow-hidden bg-gradient-to-br from-accent-600 via-accent-700 to-purple-800 rounded-2xl p-6 md:p-8 text-white">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full -translate-y-1/2 translate-x-1/3" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-white rounded-full translate-y-1/2 -translate-x-1/4" />
        </div>
        <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Sparkles className="w-4 h-4 text-yellow-300" />
              <span className="text-sm text-white/70">{getGreeting()}</span>
            </div>
            <h1 className="text-3xl font-bold">{firstName}! 👋</h1>
            <p className="text-white/70 mt-1 text-sm">Here's what's happening with your Linkora today.</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => navigate('/pages/new')}
              className="flex items-center gap-2 bg-white text-accent-700 font-semibold text-sm px-4 py-2.5 rounded-xl hover:bg-white/90 transition-all shadow-sm"
            >
              <Plus className="w-4 h-4" /> New Page
            </button>
            <button
              onClick={() => navigate('/qr/new')}
              className="flex items-center gap-2 bg-white/20 border border-white/30 text-white font-medium text-sm px-4 py-2.5 rounded-xl hover:bg-white/30 transition-all"
            >
              <QrCode className="w-4 h-4" /> New QR
            </button>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total Pages"
          value={stats?.pagesCount ?? 0}
          icon={FileText}
          color="bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400"
        />
        <StatCard
          label="QR Codes"
          value={stats?.qrCount ?? 0}
          icon={QrCode}
          color="bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-400"
        />
        <StatCard
          label="Total Scans"
          value={stats?.scansCount ?? 0}
          icon={TrendingUp}
          color="bg-green-100 dark:bg-green-900/40 text-green-600 dark:text-green-400"
        />
        <StatCard
          label="Link Clicks"
          value={stats?.clickCount ?? 0}
          icon={MousePointerClick}
          color="bg-orange-100 dark:bg-orange-900/40 text-orange-600 dark:text-orange-400"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Recent Pages / Activity */}
        <div className="lg:col-span-2 bg-white dark:bg-neutral-950 rounded-2xl border border-neutral-200 dark:border-neutral-800 p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-bold text-lg text-neutral-900 dark:text-white">Recent Activity</h2>
            <Link to="/pages" className="text-sm text-accent-600 hover:underline flex items-center gap-1">
              View all <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          {activities.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-center gap-3">
              <div className="w-14 h-14 bg-neutral-100 dark:bg-neutral-800 rounded-2xl flex items-center justify-center">
                <Globe className="w-7 h-7 text-neutral-400" />
              </div>
              <p className="text-neutral-500 dark:text-neutral-400 text-sm">No activity yet.</p>
              <button
                onClick={() => navigate('/pages/new')}
                className="text-sm text-accent-600 font-medium hover:underline"
              >
                Create your first page →
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {activities.map(a => (
                <div key={a.id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors group">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${
                    a.type === 'page'
                      ? 'bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400'
                      : 'bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-400'
                  }`}>
                    {a.type === 'page' ? <FileText className="w-4 h-4" /> : <QrCode className="w-4 h-4" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-neutral-900 dark:text-white text-sm truncate">{a.title}</p>
                    <p className="text-xs text-neutral-400">
                      {a.type === 'page' ? (a.isPublished ? '🟢 Published' : '⚪ Draft') : 'QR Code'} &nbsp;·&nbsp;
                      {new Date(a.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  {a.type === 'page' && a.handle && (
                    <a
                      href={`/p/${a.handle}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-400 transition-all"
                    >
                      <Eye className="w-4 h-4" />
                    </a>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Sidebar: Checklist + Quick Actions */}
        <div className="flex flex-col gap-5">

          {/* Onboarding Checklist */}
          <div className="bg-white dark:bg-neutral-950 rounded-2xl border border-neutral-200 dark:border-neutral-800 p-5">
            <div className="flex items-center justify-between mb-1">
              <h3 className="font-bold text-neutral-900 dark:text-white text-sm">Getting Started</h3>
              <span className="text-xs font-semibold text-accent-600">{progress}%</span>
            </div>
            <div className="w-full h-1.5 bg-neutral-100 dark:bg-neutral-800 rounded-full mb-4">
              <div
                className="h-full bg-accent-600 rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
            <ul className="space-y-2.5">
              {checklist.map(item => (
                <li key={item.label}>
                  <Link to={item.href} className="flex items-center gap-2.5 group">
                    {item.done
                      ? <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
                      : <Circle className="w-4 h-4 text-neutral-300 dark:text-neutral-600 flex-shrink-0" />
                    }
                    <span className={`text-sm transition-colors ${item.done ? 'line-through text-neutral-400' : 'text-neutral-700 dark:text-neutral-300 group-hover:text-accent-600'}`}>
                      {item.label}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Actions */}
          <div className="bg-white dark:bg-neutral-950 rounded-2xl border border-neutral-200 dark:border-neutral-800 p-5">
            <h3 className="font-bold text-neutral-900 dark:text-white text-sm mb-3">Quick Actions</h3>
            <div className="space-y-2">
              {[
                { label: 'Create New Page', icon: Plus, href: '/pages/new', color: 'text-blue-600' },
                { label: 'Generate QR Code', icon: QrCode, href: '/qr/new', color: 'text-purple-600' },
                { label: 'View Analytics', icon: TrendingUp, href: '/analytics', color: 'text-green-600' },
                { label: 'NFC Cards', icon: Zap, href: '/nfc', color: 'text-orange-600' },
              ].map(action => (
                <Link
                  key={action.label}
                  to={action.href}
                  className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors group"
                >
                  <action.icon className={`w-4 h-4 ${action.color}`} />
                  <span className="text-sm text-neutral-700 dark:text-neutral-300 group-hover:text-neutral-900 dark:group-hover:text-white transition-colors">
                    {action.label}
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 ml-auto text-neutral-300 dark:text-neutral-600 group-hover:text-accent-600 transition-colors" />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
