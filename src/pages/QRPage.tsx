import { Plus } from 'lucide-react'
import { Link } from 'react-router-dom'

export function QRPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-50">
            QR Codes
          </h1>
          <p className="text-neutral-600 dark:text-neutral-400 mt-1">
            Create and manage your QR codes
          </p>
        </div>
        <Link
          to="/qr/new"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-accent-600 hover:bg-accent-700 text-white font-medium transition-colors"
        >
          <Plus className="w-5 h-5" />
          Create QR Code
        </Link>
      </div>

      <div className="bg-white dark:bg-neutral-950 rounded-xl border border-neutral-200 dark:border-neutral-800 p-12 text-center">
        <div className="text-5xl mb-4">📱</div>
        <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-50 mb-2">
          No QR Codes Yet
        </h2>
        <p className="text-neutral-600 dark:text-neutral-400 mb-6">
          Create your first QR code to get started
        </p>
        <Link
          to="/qr/new"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-accent-600 hover:bg-accent-700 text-white font-medium transition-colors"
        >
          <Plus className="w-5 h-5" />
          Create QR Code
        </Link>
      </div>
    </div>
  )
}
