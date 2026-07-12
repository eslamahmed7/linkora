import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useParams, Link } from 'react-router-dom'
import { apiClient } from '@/api/client'
import { ExternalLink } from 'lucide-react'
import { getIconData } from '../utils/iconMap'
interface PublicLink {
  id: string
  title: string
  url: string
  description?: string
  iconUrl?: string
  icon?: string
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
  const { t } = useTranslation()
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
        <h1 className="text-4xl font-bold text-neutral-400">{t('publicPage.notFound')}</h1>
        <p className="text-neutral-500">{t('publicPage.notFoundMsg')}</p>
        <Link to="/" className="text-accent-400 hover:underline text-sm">{t('publicPage.goBack')}</Link>
      </div>
    )
  }

  const design = page.design || {}

  const getBackgroundStyle = () => {
    if (design.backgroundImage) {
      return {
        backgroundImage: `url(${design.backgroundImage})`,
        backgroundSize: design.backgroundImageSize || 'cover',
        backgroundPosition: design.backgroundImagePosition || 'center',
        backgroundRepeat: 'no-repeat',
        backgroundColor: '#000000', // fallback
      }
    }
    if (design.backgroundType === 'gradient') {
      if (design.backgroundGradientType === 'radial') {
        return { background: `radial-gradient(circle, ${design.backgroundColor} 0%, ${design.backgroundColor2 || '#0066ff'} ${design.backgroundGradientScale || 100}%)` }
      }
      return { background: `linear-gradient(${design.backgroundGradientRotation || 135}deg, ${design.backgroundColor} 0%, ${design.backgroundColor2 || '#0066ff'} 100%)` }
    }
    return { backgroundColor: design.backgroundColor || (page.theme === 'light' ? '#ffffff' : '#0a0a0a') }
  }

  const getButtonStyle = (customColor?: string) => {
    const linkBgColor = customColor || design.linkBackgroundColor || '#1a1a1a'
    const bgColor = design?.backgroundColor || '#ffffff'
    const isDarkBg = bgColor.toLowerCase() === '#000000' || bgColor.toLowerCase() === '#111827'
    const textColor = design?.linkTextColor || design.textColor || '#ffffff'
    
    let style: any = {
      color: textColor,
      borderRadius: `${design.linkBorderRadius || 0}px`,
      marginBottom: `${design.linkSpacing || 16}px`,
      width: `${design.buttonWidth || 100}%`,
      marginLeft: 'auto',
      marginRight: 'auto',
      paddingTop: `${design.buttonHeight || 14}px`,
      paddingBottom: `${design.buttonHeight || 14}px`,
      paddingLeft: '20px',
      paddingRight: '20px',
      transition: 'all 0.3s ease',
    }

    if (design.glassmorphism) {
      style.backgroundColor = 'rgba(255, 255, 255, 0.1)'
      style.backdropFilter = 'blur(10px)'
      style.WebkitBackdropFilter = 'blur(10px)'
      style.border = '1px solid rgba(255, 255, 255, 0.2)'
    } else {
      switch (design.linkStyle) {
        case 'outline':
          style.backgroundColor = 'transparent'
          style.border = `2px solid ${linkBgColor}`
          style.color = linkBgColor
          break
        case 'soft':
          style.backgroundColor = `${linkBgColor}1A`
          style.border = 'none'
          style.color = linkBgColor
          break
        case '3d':
          style.backgroundColor = linkBgColor
          style.border = 'none'
          style.boxShadow = `0 6px 0 ${linkBgColor}CC, 0 10px 10px rgba(0,0,0,0.2)`
          style.transform = 'translateY(-2px)'
          break
        case 'gradient':
          style.background = `linear-gradient(135deg, ${linkBgColor} 0%, ${linkBgColor}80 100%)`
          style.border = 'none'
          break
        case 'neon-border':
          style.backgroundColor = isDarkBg ? '#000000' : '#ffffff'
          style.border = `2px solid ${linkBgColor}`
          style.color = linkBgColor
          style.boxShadow = `0 0 10px ${linkBgColor}40, inset 0 0 10px ${linkBgColor}40`
          break
        case 'glass-frost':
          style.backgroundColor = `${linkBgColor}33`
          style.backdropFilter = 'blur(16px)'
          style.WebkitBackdropFilter = 'blur(16px)'
          style.border = `1px solid ${linkBgColor}4D`
          style.color = textColor
          break
        case 'minimal-flat':
          style.backgroundColor = isDarkBg ? '#1f2937' : '#f3f4f6'
          style.color = linkBgColor
          style.border = 'none'
          break
        case 'duo-tone':
          style.backgroundColor = isDarkBg ? '#111827' : '#ffffff'
          style.color = linkBgColor
          style.border = `2px solid ${linkBgColor}33`
          style.borderBottomWidth = '4px'
          style.borderBottomColor = linkBgColor
          break
        case 'solid':
        default:
          style.backgroundColor = linkBgColor
          style.border = 'none'
          break
      }
    }

    if (design.linkStyle !== '3d' && !design.glassmorphism) {
      style.boxShadow = design.buttonShadow === 'soft' ? '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)' : 
                        design.buttonShadow === 'hard' ? '4px 4px 0px 0px rgba(0,0,0,1)' :
                        design.buttonShadow === 'glow' ? `0 0 15px ${linkBgColor}80` : 
                        design.buttonShadow === 'neumorphism' ? (isDarkBg ? '5px 5px 10px #0a0e17, -5px -5px 10px #182237' : '6px 6px 12px rgba(0,0,0,0.1), -6px -6px 12px rgba(255,255,255,0.05)') :
                        design.buttonShadow === 'drop' ? '0 10px 15px -3px rgba(0, 0, 0, 0.2), 0 4px 6px -2px rgba(0, 0, 0, 0.1)' :
                        design.buttonShadow === 'bottom-heavy' ? '0 12px 10px -6px rgba(0, 0, 0, 0.3)' :
                        design.buttonShadow === 'inner' ? 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.15)' :
                        design.buttonShadow === 'colored-soft' ? `0 8px 20px -4px ${linkBgColor}80` :
                        design.buttonShadow === 'retro' ? '6px 6px 0px 0px rgba(0,0,0,0.8), inset 0px 0px 0px 2px rgba(0,0,0,1)' : 'none'
    }

    return style
  }

  const getAnimationClass = () => {
    switch(design.buttonAnimation) {
      case 'pulse': return 'hover:animate-pulse'
      case 'bounce': return 'hover:-translate-y-1'
      case 'wobble': return 'hover:rotate-2'
      case 'slide': return 'hover:translate-x-2'
      default: return 'hover:opacity-90'
    }
  }

  return (
    <div
      className="min-h-screen flex flex-col items-center py-12 px-4"
      style={getBackgroundStyle()}
    >
      <div className="w-full max-w-[500px] flex flex-col items-center gap-6">
        {/* Profile Image */}
        {design.profileImageUrl || page.avatar ? (
          <div
            className="mb-2 overflow-hidden border-2 border-white/20 shadow-lg"
            style={{
              borderRadius: `${design.profileBorderRadius || 50}%`,
              width: design.profileImageSize === 'small' ? '60px' : design.profileImageSize === 'medium' ? '80px' : '110px',
              height: design.profileImageSize === 'small' ? '60px' : design.profileImageSize === 'medium' ? '80px' : '110px',
            }}
          >
            <img src={design.profileImageUrl || page.avatar} alt={page.title} className="w-full h-full object-cover" />
          </div>
        ) : (
          <div
            className="mb-2 bg-neutral-200 dark:bg-neutral-800 flex items-center justify-center text-3xl font-bold text-neutral-400"
            style={{
              borderRadius: `${design.profileBorderRadius || 50}%`,
              width: design.profileImageSize === 'small' ? '60px' : design.profileImageSize === 'medium' ? '80px' : '110px',
              height: design.profileImageSize === 'small' ? '60px' : design.profileImageSize === 'medium' ? '80px' : '110px',
            }}
          >
            {page.title?.charAt(0) || 'L'}
          </div>
        )}

        {/* Title */}
        <h1
          className="font-bold text-center mb-2 tracking-tight break-words px-2"
          style={{
            color: design.headingColor || '#ffffff',
            fontSize: `${Math.min(design.headingSize || 24, 32)}px`,
            fontFamily: design.fontFamily,
          }}
        >
          {page.title || t('publicPage.fallbackTitle')}
        </h1>

        {/* Bio */}
        {(design.showBio !== false) && (page.bio || page.description) && (
          <p
            className="text-center w-full mb-8 leading-relaxed opacity-90 break-words whitespace-pre-wrap px-2"
            style={{
              color: design.textColor || '#ffffff',
              fontSize: '14px',
              fontFamily: design.fontFamily,
            }}
          >
            {page.bio || page.description}
          </p>
        )}

        {/* Links */}
        <div className="w-full space-y-1">
          {links.length > 0 ? (
            links.map((link) => {
              const iconData = link.icon ? getIconData(link.icon) : null
              const IconComponent = iconData?.component

              // Check if it's a 3D button so we can add an active class for click effect
              const is3D = design.linkStyle === '3d' && !design.glassmorphism
              const activeClass = is3D ? 'active:translate-y-[4px] active:shadow-[0_2px_0_transparent]' : ''

              return (
                <a
                  key={link.id}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`text-center font-medium relative group flex items-center justify-between ${getAnimationClass()} ${activeClass}`}
                  style={getButtonStyle(link.color)}
                >
                  {design.iconPosition === 'right' ? (
                    <ExternalLink className="w-5 h-5 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
                  ) : (
                    link.iconUrl ? (
                      <img src={link.iconUrl} alt="" className="w-8 h-8 rounded bg-white/20 flex-shrink-0" />
                    ) : IconComponent ? (
                      <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                        <IconComponent className="w-5 h-5 flex-shrink-0" style={{ color: ['solid', 'gradient'].includes(design.linkStyle || 'solid') ? (link.color === '#ffffff' ? '#000' : '#fff') : iconData?.color || 'currentColor' }} />
                      </div>
                    ) : (
                      <span className="w-8 h-8 flex-shrink-0" /> // Spacer
                    )
                  )}
                  
                  <span className="relative z-10 block truncate font-semibold px-2 flex-1 text-center" style={{ fontFamily: design.fontFamily }}>{link.title}</span>
                  
                  {design.iconPosition === 'right' ? (
                    link.iconUrl ? (
                      <img src={link.iconUrl} alt="" className="w-8 h-8 rounded bg-white/20 flex-shrink-0" />
                    ) : IconComponent ? (
                      <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                        <IconComponent className="w-5 h-5 flex-shrink-0" style={{ color: ['solid', 'gradient'].includes(design.linkStyle || 'solid') ? (link.color === '#ffffff' ? '#000' : '#fff') : iconData?.color || 'currentColor' }} />
                      </div>
                    ) : (
                      <span className="w-8 h-8 flex-shrink-0" /> // Spacer
                    )
                  ) : (
                    <ExternalLink className="w-5 h-5 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
                  )}
                </a>
              )
            })
          ) : (
            <p className="text-center opacity-50 text-sm mt-4" style={{ color: design.textColor || '#ffffff' }}>{t('publicPage.noLinks')}</p>
          )}
        </div>

        {/* Footer */}
        <p className="mt-8 text-xs text-white/30" style={{ color: design.textColor || '#ffffff', opacity: 0.5 }}>
          {t('publicPage.poweredBy')}{' '}
          <a href="/" className="hover:opacity-100 transition-colors underline">
            {t('common.appName')}
          </a>
        </p>
      </div>
    </div>
  )
}
