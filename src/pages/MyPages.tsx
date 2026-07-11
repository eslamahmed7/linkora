import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { pagesAPI } from '@/api/pages'
import { useNotification } from '@/hooks/useNotification'
import { Plus, Search, Copy, Trash2, Archive, Eye, Edit2 } from 'lucide-react'

interface Page {
  id: string
  slug: string
  title: string
  status: 'draft' | 'published'
  createdAt: string
  updatedAt: string
}

export function MyPagesPage() {
  const notification = useNotification()
  const [pages, setPages] = useState<Page[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')

  useEffect(() => {
    fetchPages()
  }, [statusFilter])

  const fetchPages = async () => {
    try {
      setIsLoading(true)
      const response = await pagesAPI.list()
      setPages(response.pages)
    } catch (error) {
      notification.error('Failed to load pages')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this page?')) {
      return
    }

    try {
      await pagesAPI.delete(id)
      setPages((prev) => prev.filter((p) => p.id !== id))
      notification.success('Page deleted successfully')
    } catch (error) {
      notification.error('Failed to delete page')
    }
  }

  const handleDuplicate = async (id: string) => {
    try {
      const response = await pagesAPI.duplicate(id)
      setPages((prev) => [response.page as any as Page, ...prev])
      notification.success('Page duplicated successfully')
    } catch (error) {
      notification.error('Failed to duplicate page')
    }
  }

  const handleArchive = async (id: string) => {
    try {
      await pagesAPI.archive(id)
      setPages((prev) =>
        prev.filter((p) => p.id !== id)
      )
      notification.success('Page archived successfully')
    } catch (error) {
      notification.error('Failed to archive page')
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-50">
            My Pages
          </h1>
          <p className="text-neutral-600 dark:text-neutral-400 mt-1">
            Manage your link pages
          </p>
        </div>
        <Link
          to="/pages/new"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-accent-600 hover:bg-accent-700 text-white font-medium transition-colors"
        >
          <Plus className="w-5 h-5" />
          Create Page
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-3 w-5 h-5 text-neutral-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyUp={fetchPages}
            placeholder="Search pages..."
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-50 focus:outline-none focus:ring-2 focus:ring-accent-600"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-50 focus:outline-none focus:ring-2 focus:ring-accent-600"
        >
          <option value="all">All Pages</option>
          <option value="published">Published</option>
          <option value="draft">Draft</option>
        </select>
      </div>

      {/* Pages Table */}
      {isLoading ? (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="h-16 bg-neutral-200 dark:bg-neutral-800 rounded-lg animate-pulse"
            />
          ))}
        </div>
      ) : pages.length > 0 ? (
        <div className="bg-white dark:bg-neutral-950 rounded-xl border border-neutral-200 dark:border-neutral-800 overflow-hidden">
          <table className="w-full">
            <thead className="border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-neutral-900 dark:text-neutral-50">
                  Title
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-neutral-900 dark:text-neutral-50">
                  Slug
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-neutral-900 dark:text-neutral-50">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-neutral-900 dark:text-neutral-50">
                  Created
                </th>
                <th className="px-6 py-3 text-right text-sm font-semibold text-neutral-900 dark:text-neutral-50">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {pages.map((page) => (
                <tr
                  key={page.id}
                  className="border-b border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors cursor-pointer"
                  onClick={() => window.location.href = `/pages/${page.id}`}
                >
                  <td className="px-6 py-4 text-sm font-medium text-neutral-900 dark:text-neutral-50">
                    <span className="text-accent-600 dark:text-accent-400 hover:underline">
                      {page.title}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-neutral-600 dark:text-neutral-400">
                    {page.slug}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                        page.status === 'published'
                          ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
                          : 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200'
                      }`}
                    >
                      {page.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-neutral-600 dark:text-neutral-400">
                    {new Date(page.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <a
                        href={`/${page.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-400"
                        title="View Public Page"
                      >
                        <Eye className="w-4 h-4" />
                      </a>
                      <Link
                        to={`/pages/${page.id}`}
                        onClick={(e) => e.stopPropagation()}
                        className="p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-400"
                        title="Edit Page"
                      >
                        <Edit2 className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => handleDuplicate(page.id)}
                        className="p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-400"
                        title="Duplicate"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleArchive(page.id)}
                        className="p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-400"
                        title="Archive"
                      >
                        <Archive className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(page.id)}
                        className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-neutral-600 dark:text-neutral-400 mb-4">
            No pages yet. Create your first one!
          </p>
          <Link
            to="/pages/new"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-accent-600 hover:bg-accent-700 text-white font-medium transition-colors"
          >
            <Plus className="w-5 h-5" />
            Create Page
          </Link>
        </div>
      )}
    </div>
  )
}
