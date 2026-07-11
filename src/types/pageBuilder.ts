export interface Link {
  id: string
  title: string
  url: string
  icon?: string
  color?: string
  order: number
  isActive: boolean
  clicks: number
  createdAt: string
  type?: 'link' | 'social' | 'video' | 'audio' | 'text'
  content?: string
  platform?: string
  metadata?: Record<string, any>
}

export interface PageDesign {
  theme?: string
  backgroundType?: 'color' | 'gradient' | 'image' | 'video'
  backgroundGradient?: string
  backgroundGradientType?: 'linear' | 'radial'
  backgroundGradientRotation?: number
  backgroundGradientScale?: number
  backgroundColor2?: string
  backgroundColor: string
  backgroundImage?: string
  backgroundImageSize?: 'cover' | 'contain' | 'auto'
  backgroundImagePosition?: 'center' | 'top' | 'bottom' | 'left' | 'right' | string
  profileImageUrl?: string
  profileImagePosition: 'top' | 'center'
  profileImageSize: 'small' | 'medium' | 'large'
  profileBorderRadius: number
  linkStyle: 'solid' | 'outline' | 'soft' | '3d' | 'gradient' | 'neon-border' | 'glass-frost' | 'minimal-flat' | 'duo-tone'
  linkBackgroundColor: string
  linkTextColor: string
  linkBorderColor?: string
  linkBorderWidth: number
  linkBorderRadius: number
  linkSpacing: number
  buttonShadow?: 'none' | 'soft' | 'hard' | 'glow' | 'neumorphism' | 'drop' | 'bottom-heavy' | 'inner' | 'colored-soft' | 'retro'
  buttonAnimation?: 'none' | 'pulse' | 'bounce' | 'wobble' | 'slide'
  buttonWidth?: number
  buttonHeight?: number
  iconPosition?: 'left' | 'right'
  glassmorphism?: boolean
  socialPosition?: 'top' | 'bottom'
  fontFamily: string
  headingSize: number
  textSize: number
  headingColor: string
  textColor: string
  showBio: boolean
  animationEnabled: boolean
  animationType?: 'fade' | 'slide' | 'zoom' | 'bounce'
  linkedQrId?: string
}

export interface PageSettings {
  slug: string
  title: string
  description?: string
  bio?: string
  visibility: 'public' | 'private'
  status: 'draft' | 'published'
  customDomain?: string
  seoTitle?: string
  seoDescription?: string
  metaKeywords?: string
}

export interface PageState {
  id?: string
  settings: PageSettings
  design: PageDesign
  links: Link[]
  userId?: string
  createdAt?: string
  updatedAt?: string
}

export const DEFAULT_PAGE_DESIGN: PageDesign = {
  theme: 'default',
  backgroundType: 'color',
  backgroundColor: '#ffffff',
  backgroundColor2: '#0066ff',
  backgroundGradientType: 'linear',
  backgroundGradientRotation: 135,
  backgroundGradientScale: 100,
  backgroundImageSize: 'cover',
  backgroundImagePosition: 'center',
  profileImagePosition: 'top',
  profileImageSize: 'medium',
  profileBorderRadius: 50,
  linkStyle: 'solid',
  linkBackgroundColor: '#0066ff',
  linkTextColor: '#ffffff',
  linkBorderWidth: 0,
  linkBorderRadius: 8,
  linkSpacing: 16,
  buttonWidth: 100,
  buttonHeight: 14,
  iconPosition: 'left',
  buttonShadow: 'none',
  buttonAnimation: 'none',
  glassmorphism: false,
  socialPosition: 'bottom',
  fontFamily: 'system-ui, -apple-system, sans-serif',
  headingSize: 28,
  textSize: 16,
  headingColor: '#000000',
  textColor: '#666666',
  showBio: true,
  animationEnabled: true,
  animationType: 'fade',
}

export const DEFAULT_PAGE_SETTINGS: PageSettings = {
  slug: '',
  title: 'My Link Page',
  description: '',
  visibility: 'public',
  status: 'draft',
}
