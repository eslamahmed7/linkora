import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { apiClient } from '@/api/client'

interface PublicLink {
  id: string
  title: string
  url: string
  description?: string
  iconUrl?: string
  color: string
  isActive: boolean
  displayOrder: number
}

interface PublicPage {
  id: string
  handle: string
  title: string
  description?: string
  bio?: string
  avatar?: string
  theme: string
  design?: any
}

export function PublicPageView() {
  const { handle } = useParams<{ handle: string }>()
  const [page, setPage] = useState<PublicPage | null>(null)
  const [links, setLinks] = useState<PublicLink[]>([])
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    if (!handle) return
    setLoading(true)
    setNotFound(false)
    apiClient.get<any>(`/pages/handle/${handle}`)
      .then((res) => {
        const data = (res.data as any).data || res.data
        setPage(data)
        setLinks((data.links || []).filter((l: PublicLink) => l.isActive).sort((a: PublicLink, b: PublicLink) => a.displayOrder - b.displayOrder))
      })
      .catch(() => {
        setNotFound(true)
      })
      .finally(() => setLoading(false))
  }, [handle])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-950">
        <div className="w-12 h-12 border-4 border-accent-600 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (notFound || !page) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-neutral-950 text-white gap-4">
        <h1 className="text-4xl font-bold text-neutral-400">404</h1>
        <p className="text-neutral-500">This page doesn't exist or is not published yet.</p>
        <Link to="/" className="text-accent-400 hover:underline text-sm">Go back home</Link>
      </div>
    )
  }

  const design = page.design || {}
  const bg = design.backgroundImage
    ? `url(${design.backgroundImage})`
    : design.backgroundColor || (page.theme === 'light' ? '#ffffff' : '#0a0a0a')

  const linkBg = design.linkColor || '#1a1a1a'
  const linkText = design.textColor || '#ffffff'
  const fontFamily = design.fontFamily || 'Inter, sans-serif'
  const borderRadius = design.buttonStyle === 'pill' ? '9999px' : design.buttonStyle === 'sharp' ? '4px' : '12px'

  return (
    <div
      className="min-h-screen flex flex-col items-center py-12 px-4"
      style={{
        background: bg,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        fontFamily,
      }}
    >
      <div className="w-full max-w-md flex flex-col items-center gap-6">
        {/* Profile */}
        <div className="flex flex-col items-center gap-3 text-center">
          {page.avatar && (
            <img
              src={page.avatar}
              alt={page.title}
              className="w-24 h-24 rounded-full object-cover border-4 border-white/10 shadow-xl"
            />
          )}
          <div>
            <h1 className="text-2xl font-bold text-white drop-shadow">{page.title}</h1>
            {page.bio && (
              <p className="mt-1 text-sm text-white/70 max-w-xs">{page.bio}</p>
            )}
          </div>
        </div>

        {/* Links */}
        <div className="w-full flex flex-col gap-3">
          {links.map((link) => (
            <a
              key={link.id}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center gap-3 px-5 py-4 font-semibold text-sm shadow-lg transition-all duration-200 hover:scale-[1.02] hover:brightness-110 active:scale-[0.99]"
              style={{
                backgroundColor: link.color || linkBg,
                color: linkText,
                borderRadius,
              }}
            >
              {link.iconUrl && (
                <img src={link.iconUrl} alt="" className="w-5 h-5 rounded" />
              )}
              <span className="flex-1 text-center">{link.title}</span>
            </a>
          ))}

          {links.length === 0 && (
            <p className="text-center text-white/40 text-sm mt-4">No links added yet.</p>
          )}
        </div>

        {/* Footer */}
        <p className="mt-8 text-xs text-white/30">
          Powered by{' '}
          <a href="/" className="text-white/50 hover:text-white transition-colors">
            Linkora
          </a>
        </p>
      </div>
    </div>
  )
}
