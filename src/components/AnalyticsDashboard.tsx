import { useState, useEffect } from 'react'
import { analyticsAPI } from '@/api/analytics'
import { useNotification } from '@/hooks/useNotification'
import { BarChart3, Users, Mouse, TrendingUp } from 'lucide-react'
import type { AnalyticsResponse } from '@/types/analytics'

interface AnalyticsDashboardProps {
  pageId?: string
}

export function AnalyticsDashboard({ pageId }: AnalyticsDashboardProps) {
  const [analytics, setAnalytics] = useState<AnalyticsResponse | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const notification = useNotification()

  useEffect(() => {
    fetchAnalytics()
  }, [pageId])

  const fetchAnalytics = async () => {
    try {
      setIsLoading(true)
      const response = pageId
        ? await analyticsAPI.getPageStats(pageId)
        : await analyticsAPI.getDashboardStats()
      setAnalytics(response)
    } catch (error) {
      notification.error('Failed to load analytics')
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return <div className="text-center py-8">Loading analytics...</div>
  }

  if (!analytics) {
    return <div className="text-center py-8">No analytics data available</div>
  }

  const { stats } = analytics

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-lg bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700">
          <div className="flex items-center gap-3 mb-2">
            <Mouse className="w-5 h-5 text-accent-600 dark:text-accent-400" />
            <span className="text-sm text-neutral-600 dark:text-neutral-400">
              Total Clicks
            </span>
          </div>
          <div className="text-2xl font-bold text-neutral-900 dark:text-neutral-50">
            {stats.totalClicks.toLocaleString()}
          </div>
          <p className="text-xs text-neutral-500 mt-1">
            {stats.clicksToday} today
          </p>
        </div>

        <div className="p-4 rounded-lg bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700">
          <div className="flex items-center gap-3 mb-2">
            <Users className="w-5 h-5 text-accent-600 dark:text-accent-400" />
            <span className="text-sm text-neutral-600 dark:text-neutral-400">
              Unique Visitors
            </span>
          </div>
          <div className="text-2xl font-bold text-neutral-900 dark:text-neutral-50">
            {stats.uniqueVisitors.toLocaleString()}
          </div>
          <p className="text-xs text-neutral-500 mt-1">
            {stats.visitorsToday} today
          </p>
        </div>

        <div className="p-4 rounded-lg bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700">
          <div className="flex items-center gap-3 mb-2">
            <BarChart3 className="w-5 h-5 text-accent-600 dark:text-accent-400" />
            <span className="text-sm text-neutral-600 dark:text-neutral-400">
              Avg. CTR
            </span>
          </div>
          <div className="text-2xl font-bold text-neutral-900 dark:text-neutral-50">
            {stats.uniqueVisitors > 0
              ? ((stats.totalClicks / stats.uniqueVisitors) * 100).toFixed(1)
              : '0'}
            %
          </div>
          <p className="text-xs text-neutral-500 mt-1">Click-through rate</p>
        </div>

        <div className="p-4 rounded-lg bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700">
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp className="w-5 h-5 text-accent-600 dark:text-accent-400" />
            <span className="text-sm text-neutral-600 dark:text-neutral-400">
              Device Split
            </span>
          </div>
          <div className="text-sm font-medium text-neutral-900 dark:text-neutral-50">
            {Math.round(
              (stats.deviceBreakdown.mobile /
                (stats.deviceBreakdown.desktop +
                  stats.deviceBreakdown.mobile +
                  stats.deviceBreakdown.tablet)) *
                100
            )}
            % Mobile
          </div>
          <p className="text-xs text-neutral-500 mt-1">
            {stats.deviceBreakdown.desktop +
              stats.deviceBreakdown.mobile +
              stats.deviceBreakdown.tablet}{' '}
            total visits
          </p>
        </div>
      </div>

      {/* Top Links */}
      {stats.topLinks.length > 0 && (
        <div className="p-4 rounded-lg border border-neutral-200 dark:border-neutral-800">
          <h3 className="font-semibold mb-4 text-neutral-900 dark:text-neutral-50">
            Top Links
          </h3>
          <div className="space-y-3">
            {stats.topLinks.slice(0, 5).map((link) => (
              <div key={link.linkId} className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-neutral-900 dark:text-neutral-50 truncate">
                    {link.title}
                  </p>
                  <div className="w-full bg-neutral-200 dark:bg-neutral-700 rounded-full h-2 mt-1">
                    <div
                      className="bg-accent-600 h-2 rounded-full"
                      style={{ width: `${link.percentage}%` }}
                    />
                  </div>
                </div>
                <div className="ml-4 text-right">
                  <p className="text-sm font-semibold text-neutral-900 dark:text-neutral-50">
                    {link.clicks}
                  </p>
                  <p className="text-xs text-neutral-500">{link.percentage}%</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Top Countries */}
      {stats.topCountries.length > 0 && (
        <div className="p-4 rounded-lg border border-neutral-200 dark:border-neutral-800">
          <h3 className="font-semibold mb-4 text-neutral-900 dark:text-neutral-50">
            Top Countries
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {stats.topCountries.slice(0, 6).map((country) => (
              <div key={country.country} className="text-center">
                <p className="font-medium text-neutral-900 dark:text-neutral-50">
                  {country.country}
                </p>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                  {country.clicks} clicks
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
