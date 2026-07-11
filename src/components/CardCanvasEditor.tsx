import { useState, useRef, useCallback, useEffect } from 'react'
import { toPng } from 'html-to-image'
import { jsPDF } from 'jspdf'
import {
  X, Grid3X3, Download, Save, RotateCcw, Eye, EyeOff,
  Trash2, ChevronDown, ChevronRight,
  Palette, Image, Type, Star, Layers, Sparkles,
  Sun, Upload, RefreshCw, Move, Copy, Lock, Unlock,
  Phone, Mail, Globe, Heart, Diamond, Zap, Crown, Shield, Award, Flame,
  Music, Camera, Code, Coffee, Briefcase, Anchor, Feather,
  Smile, Compass, Target, Cpu, Fingerprint,
  Map, Flag, Tag, Bookmark, Clock, Bell, Wifi, Activity,
  ArrowRight, Hexagon, Triangle, Circle, Square,
  Gem, Key, Umbrella, Moon, Cloud, Snowflake, Scissors, PenTool, Brush, Film, Video, Speaker, Mic, Headphones, Radio, Tv, Monitor, Smartphone, Tablet, Watch,
} from 'lucide-react'
import type { CardDesign, CardCanvasElement, CardBgType } from '@/types/nfc'
import type { NFCTemplate } from './nfcCardDesignSystem'
import {
  DotMatrix
} from './nfcCardDesignSystem'
import { TEMPLATES } from './nfcCardTemplates'
import { QRGenerator } from './QRGenerator'

// ─── Types ───────────────────────────────────────────────────────────────────

interface Props {
  cardId: string
  initialDesign?: CardDesign
  onSave: (design: CardDesign) => Promise<void>
  onClose: () => void
  qrCodes: any[]
}

// ─── Default Elements ────────────────────────────────────────────────────────

const DEFAULT_ELEMENTS: CardCanvasElement[] = [
  { id: 'name',    type: 'name',    x: 5,  y: 55, visible: true, color: '#FFFFFF', fontSize: 'xl', fontWeight: 'bold' },
  { id: 'job',     type: 'job',     x: 5,  y: 72, visible: true, color: '#A0A0A0', fontSize: 'sm', fontWeight: 'medium' },
  { id: 'company', type: 'company', x: 5,  y: 82, visible: true, color: '#808080', fontSize: 'xs', fontWeight: 'semibold' },
  { id: 'qr',      type: 'qr',      x: 68, y: 45, visible: true, size: 'lg' },
]

const BRAND_COLORS = [
  { id: 'original', label: 'Original' },
  { id: 'black', label: 'Solid Black' },
  { id: 'white', label: 'Solid White' },
  { id: 'silver', label: 'Silver' },
  { id: 'gold', label: 'Gold' }
]

const BLANK_DESIGN: CardDesign = {
  bgType: 'solid',
  bgColor: '#0C0F1D',
  elements: DEFAULT_ELEMENTS,
  cardName: 'Your Name',
  cardJob: 'Your Title',
  cardCompany: 'Your Company',
  showGrid: false,
  pattern: 'none',
  patternOpacity: 0.05,
}

const DEFAULT_DESIGN: CardDesign = {
  templateId: 'gold-swoosh',
  bgType: 'template',
  elements: DEFAULT_ELEMENTS,
  cardName: 'John Smith',
  cardJob: 'Chief Executive Officer',
  cardCompany: 'Linkora Inc.',
  showGrid: false,
  pattern: 'none',
  patternOpacity: 0.05,
}

// ─── Decorative Icons ─────────────────────────────────────────────────────────

const DECO_ICONS: Array<{ name: string; icon: React.ComponentType<any>; label: string; category: string }> = [
  // Premium
  { name: 'Star',        icon: Star,        label: 'Star',       category: 'Premium'  },
  { name: 'Crown',       icon: Crown,       label: 'Crown',      category: 'Premium'  },
  { name: 'Diamond',     icon: Diamond,     label: 'Diamond',    category: 'Premium'  },
  { name: 'Award',       icon: Award,       label: 'Award',      category: 'Premium'  },
  { name: 'Shield',      icon: Shield,      label: 'Shield',     category: 'Premium'  },
  { name: 'Zap',         icon: Zap,         label: 'Bolt',       category: 'Premium'  },
  { name: 'Flame',       icon: Flame,       label: 'Flame',      category: 'Premium'  },
  { name: 'Hexagon',     icon: Hexagon,     label: 'Hexagon',    category: 'Premium'  },
  { name: 'Triangle',    icon: Triangle,    label: 'Triangle',   category: 'Premium'  },
  { name: 'Target',      icon: Target,      label: 'Target',     category: 'Premium'  },
  { name: 'Fingerprint', icon: Fingerprint, label: 'Biometric',  category: 'Premium'  },
  { name: 'Cpu',         icon: Cpu,         label: 'CPU',        category: 'Premium'  },
  // Symbols
  { name: 'Heart',       icon: Heart,       label: 'Heart',      category: 'Symbols'  },
  { name: 'Smile',       icon: Smile,       label: 'Smile',      category: 'Symbols'  },
  { name: 'Feather',     icon: Feather,     label: 'Feather',    category: 'Symbols'  },
  { name: 'Compass',     icon: Compass,     label: 'Compass',    category: 'Symbols'  },
  { name: 'Anchor',      icon: Anchor,      label: 'Anchor',     category: 'Symbols'  },
  { name: 'Map',         icon: Map,         label: 'Map',        category: 'Symbols'  },
  { name: 'Flag',        icon: Flag,        label: 'Flag',       category: 'Symbols'  },
  { name: 'Circle',      icon: Circle,      label: 'Circle',     category: 'Symbols'  },
  { name: 'Square',      icon: Square,      label: 'Square',     category: 'Symbols'  },
  // Tech
  { name: 'Wifi',        icon: Wifi,        label: 'WiFi',       category: 'Tech'     },
  { name: 'Activity',    icon: Activity,    label: 'Activity',   category: 'Tech'     },
  { name: 'Code',        icon: Code,        label: 'Code',       category: 'Tech'     },
  { name: 'Camera',      icon: Camera,      label: 'Camera',     category: 'Tech'     },
  // Business
  { name: 'Briefcase',   icon: Briefcase,   label: 'Case',       category: 'Business' },
  { name: 'Globe',       icon: Globe,       label: 'Globe',      category: 'Business' },
  { name: 'Phone',       icon: Phone,       label: 'Phone',      category: 'Business' },
  { name: 'Mail',        icon: Mail,        label: 'Mail',       category: 'Business' },
  { name: 'Bell',        icon: Bell,        label: 'Bell',       category: 'Business' },
  { name: 'Tag',         icon: Tag,         label: 'Tag',        category: 'Business' },
  { name: 'Bookmark',    icon: Bookmark,    label: 'Bookmark',   category: 'Business' },
  { name: 'Clock',       icon: Clock,       label: 'Clock',      category: 'Business' },
  { name: 'Bell',        icon: Bell,        label: 'Bell',       category: 'Business' },
  // Lifestyle
  { name: 'Music',       icon: Music,       label: 'Music',      category: 'Lifestyle'},
  { name: 'Coffee',      icon: Coffee,      label: 'Coffee',     category: 'Lifestyle'},
  { name: 'ArrowRight',  icon: ArrowRight,  label: 'Arrow',      category: 'Lifestyle'},
  // New Additions
  { name: 'Gem',         icon: Gem,         label: 'Gem',        category: 'Premium'  },
  { name: 'Key',         icon: Key,         label: 'Key',        category: 'Symbols'  },
  { name: 'Umbrella',    icon: Umbrella,    label: 'Umbrella',   category: 'Symbols'  },
  { name: 'Moon',        icon: Moon,        label: 'Moon',       category: 'Symbols'  },
  { name: 'Cloud',       icon: Cloud,       label: 'Cloud',      category: 'Symbols'  },
  { name: 'Snowflake',   icon: Snowflake,   label: 'Snow',       category: 'Symbols'  },
  { name: 'Scissors',    icon: Scissors,    label: 'Scissors',   category: 'Symbols'  },
  { name: 'PenTool',     icon: PenTool,     label: 'Pen',        category: 'Lifestyle'},
  { name: 'Brush',       icon: Brush,       label: 'Brush',      category: 'Lifestyle'},
  { name: 'Film',        icon: Film,        label: 'Film',       category: 'Lifestyle'},
  { name: 'Video',       icon: Video,       label: 'Video',      category: 'Tech'     },
  { name: 'Speaker',     icon: Speaker,     label: 'Speaker',    category: 'Tech'     },
  { name: 'Mic',         icon: Mic,         label: 'Mic',        category: 'Tech'     },
  { name: 'Headphones',  icon: Headphones,  label: 'Headphones', category: 'Tech'     },
  { name: 'Radio',       icon: Radio,       label: 'Radio',      category: 'Tech'     },
  { name: 'Tv',          icon: Tv,          label: 'TV',         category: 'Tech'     },
  { name: 'Monitor',     icon: Monitor,     label: 'Monitor',    category: 'Tech'     },
  { name: 'Smartphone',  icon: Smartphone,  label: 'Phone',      category: 'Tech'     },
  { name: 'Tablet',      icon: Tablet,      label: 'Tablet',     category: 'Tech'     },
  { name: 'Watch',       icon: Watch,       label: 'Watch',      category: 'Tech'     },
]

const ICON_COMPONENT_MAP: Record<string, React.ComponentType<any>> = Object.fromEntries(
  DECO_ICONS.map(d => [d.name, d.icon])
)

const ICON_CATEGORIES = [...new Set(DECO_ICONS.map(d => d.category))]

// ─── Patterns ────────────────────────────────────────────────────────────────

const ALL_PATTERNS = [
  'none', 'dots', 
  'organic-waves', 'double-waves', 'zigzag', 'fluid-blobs',
  'hex-grid', 'diamonds', 'concentric', 'geo-triangles',
  'stars-scatter', 'clouds-scatter', 'nature-mix', 'luxury-mix', 'creative-mix', 'music-mix', 
  'space-mix', 'travel-mix', 'love-mix', 'crypto-mix', 'random-shapes', 'tools-mix', 
  'nautical-mix', 'weather-mix', 'media-mix', 'office-mix', 'sports-mix', 'communication-mix', 
  'magic-mix', 'random-1', 'random-2', 'random-3'
] as const

type PatternKey = typeof ALL_PATTERNS[number]

const PATTERN_OPTIONS = [
  { id: 'none', label: 'None', icon: X },
  { id: 'dots', label: 'Dots', icon: Grid3X3 },
  // Geo/Wave shapes
  { id: 'organic-waves', label: 'Waves', icon: Activity },
  { id: 'double-waves', label: 'Multi-Wave', icon: Activity },
  { id: 'zigzag', label: 'Zigzag', icon: ArrowRight },
  { id: 'fluid-blobs', label: 'Blobs', icon: Circle },
  { id: 'hex-grid', label: 'Hex Grid', icon: Hexagon },
  { id: 'diamonds', label: 'Diamonds', icon: Diamond },
  { id: 'concentric', label: 'Circles', icon: Circle },
  { id: 'geo-triangles', label: 'Triangles', icon: Triangle },
  // Icon scatter
  { id: 'stars-scatter', label: 'Stars', icon: Sparkles },
  { id: 'clouds-scatter', label: 'Clouds', icon: Cloud },
  { id: 'nature-mix', label: 'Nature', icon: Sun },
  { id: 'luxury-mix', label: 'Luxury', icon: Crown },
  { id: 'creative-mix', label: 'Creative', icon: Palette },
  { id: 'music-mix', label: 'Music', icon: Music },
  { id: 'space-mix', label: 'Space', icon: Moon },
  { id: 'travel-mix', label: 'Travel', icon: Map },
  { id: 'love-mix', label: 'Love', icon: Heart },
  { id: 'crypto-mix', label: 'Security', icon: Shield },
  { id: 'random-shapes', label: 'Shapes', icon: Hexagon },
  { id: 'tools-mix', label: 'Tools', icon: PenTool },
  { id: 'nautical-mix', label: 'Nautical', icon: Anchor },
  { id: 'weather-mix', label: 'Weather', icon: Snowflake },
  { id: 'media-mix', label: 'Media', icon: Camera },
  { id: 'office-mix', label: 'Office', icon: Briefcase },
  { id: 'sports-mix', label: 'Sports', icon: Target },
  { id: 'communication-mix', label: 'Comms', icon: Phone },
  { id: 'magic-mix', label: 'Magic', icon: Sparkles },
  { id: 'random-1', label: 'Random 1', icon: Smile },
  { id: 'random-2', label: 'Random 2', icon: Coffee },
  { id: 'random-3', label: 'Random 3', icon: Zap },
] as const

// ─── Font / Size Maps ─────────────────────────────────────────────────────────

const FONT_SIZE_MAP: Record<string, string> = {
  xs: 'text-[9px]', sm: 'text-[11px]', md: 'text-sm',
  lg: 'text-base', xl: 'text-xl', '2xl': 'text-3xl',
}
const FONT_WEIGHT_MAP: Record<string, string> = {
  normal: 'font-normal', medium: 'font-medium', semibold: 'font-semibold',
  bold: 'font-bold', extrabold: 'font-extrabold',
}
const ICON_SIZE_MAP: Record<string, string> = {
  xs: 'w-3 h-3', sm: 'w-4 h-4', md: 'w-6 h-6', lg: 'w-8 h-8', xl: 'w-12 h-12',
}
// Numeric px sizes for QR element (maps index 0–4 → xs..xl)
const QR_SIZE_STEPS = [48, 64, 80, 100, 128]
const SIZE_STEPS = ['xs','sm','md','lg','xl']

// ─── Background Builder ───────────────────────────────────────────────────────

function buildBackground(design: CardDesign, template?: NFCTemplate): React.CSSProperties {
  switch (design.bgType) {
    case 'solid':
      return { background: design.bgColor || '#0C0C0C' }
    case 'gradient':
      return {
        background: `linear-gradient(${design.bgGradientAngle ?? 135}deg, ${design.bgGradientStart || '#0C0C0C'}, ${design.bgGradientEnd || '#D4AF37'})`,
      }
    case 'image':
      return {
        backgroundImage: `url(${design.bgImageUrl})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }
    case 'template':
    default:
      return { background: template?.bg || '#0C0C0C' }
  }
}

// ─── Border/Shadow Builder ────────────────────────────────────────────────────

function buildCardStyle(design: CardDesign, template?: NFCTemplate): React.CSSProperties {
  const isZero = design.borderRadius === 0
  const radius = isZero ? '0px' : (design.borderRadius !== undefined ? `${design.borderRadius}px` : '16px')
  const borderColor = design.borderStyle || template?.border || '1px solid rgba(212,175,55,0.3)'
  let shadow = template?.shadow || '0 20px 60px rgba(0,0,0,0.7)'
  if (design.glowColor && (design.glowIntensity ?? 0) > 0) {
    const intensity = design.glowIntensity ?? 0
    const spread = Math.round(intensity * 40)
    const blur = Math.round(intensity * 80)
    shadow = `0 20px 60px rgba(0,0,0,0.7), 0 0 ${blur}px ${spread}px ${design.glowColor}${Math.round(intensity * 255).toString(16).padStart(2, '0')}`
  }
  return {
    borderRadius: radius,
    border: borderColor,
    boxShadow: shadow,
    fontFamily: "'Manrope', system-ui, -apple-system, sans-serif",
    transform: 'translateZ(0)', // Fixes subpixel antialiasing/clipping issues at the edges
  }
}

// ─── Background Lightness Checker ──────────────────────────────────────────────

function isBackgroundLight(design: CardDesign, template?: NFCTemplate): boolean {
  let colorStr = '#000000'
  if (design.bgType === 'solid') colorStr = design.bgColor || '#0C0C0C'
  else if (design.bgType === 'gradient') colorStr = design.bgGradientStart || '#0C0C0C'
  else if (design.bgType === 'template') colorStr = template?.bg || '#0C0C0C'
  else return false

  // Handle rgb/rgba
  const rgbMatch = colorStr.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/)
  if (rgbMatch) {
    const r = parseInt(rgbMatch[1], 10)
    const g = parseInt(rgbMatch[2], 10)
    const b = parseInt(rgbMatch[3], 10)
    return (r * 299 + g * 587 + b * 114) / 1000 > 155
  }

  // Handle hex
  const match = colorStr.match(/#?([0-9a-fA-F]{3,6})/)
  if (match) {
    let code = match[1]
    if (code.length === 3) code = code.split('').map(c => c + c).join('')
    if (code.length === 6) {
      const r = parseInt(code.substring(0, 2), 16)
      const g = parseInt(code.substring(2, 4), 16)
      const b = parseInt(code.substring(4, 6), 16)
      return (r * 299 + g * 587 + b * 114) / 1000 > 155
    }
  }
  return false
}

function OrganicWaves({ color, opacity }: { color: string, opacity: number }) {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ opacity, color }}>
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full fill-current">
        <path d="M0,50 C20,30 40,70 60,50 C80,30 90,60 100,40 L100,100 L0,100 Z" opacity="0.4"/>
        <path d="M0,60 C30,80 50,40 70,70 C90,100 95,50 100,80 L100,100 L0,100 Z" opacity="0.3"/>
        <path d="M0,80 C25,60 60,90 80,60 C90,45 95,85 100,60 L100,100 L0,100 Z" opacity="0.5"/>
      </svg>
    </div>
  )
}

function DoubleWaves({ color, opacity }: { color: string, opacity: number }) {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ opacity }}>
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full" fill="none">
        <path d="M-10,20 C10,10 20,30 30,20 C40,10 50,30 60,20 C70,10 80,30 90,20 C100,10 110,30 120,20" stroke={color} strokeWidth="1.5" opacity="0.8"/>
        <path d="M-10,30 C10,20 20,40 30,30 C40,20 50,40 60,30 C70,20 80,40 90,30 C100,20 110,40 120,30" stroke={color} strokeWidth="1" opacity="0.5"/>
        <path d="M-10,50 C10,40 20,60 30,50 C40,40 50,60 60,50 C70,40 80,60 90,50 C100,40 110,60 120,50" stroke={color} strokeWidth="1.5" opacity="0.8"/>
        <path d="M-10,70 C10,60 20,80 30,70 C40,60 50,80 60,70 C70,60 80,80 90,70 C100,60 110,80 120,70" stroke={color} strokeWidth="1" opacity="0.5"/>
        <path d="M-10,85 C10,75 20,95 30,85 C40,75 50,95 60,85 C70,75 80,95 90,85 C100,75 110,95 120,85" stroke={color} strokeWidth="0.7" opacity="0.4"/>
      </svg>
    </div>
  )
}

function GeoTriangles({ color, opacity }: { color: string, opacity: number }) {
  const tris = []
  for (let i = 0; i < 20; i++) {
    const x = (Math.sin(i * 89.3) * 40 + 50).toFixed(1)
    const y = (Math.cos(i * 157.7) * 40 + 50).toFixed(1)
    const s = (Math.sin(i * 321) * 6 + 10).toFixed(1)
    const rot = (i * 37.5 % 360).toFixed(1)
    tris.push(<polygon key={i} points={`0,${s} ${s},0 ${-Number(s)},0`} transform={`translate(${x},${y}) rotate(${rot})`} fill="none" stroke={color} strokeWidth="0.5" opacity={0.7} />)
  }
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ opacity }}>
      <svg viewBox="0 0 100 100" className="w-full h-full">{tris}</svg>
    </div>
  )
}

function HexagonGrid({ color, opacity }: { color: string, opacity: number }) {
  const hexes = []
  for (let row = 0; row < 5; row++) {
    for (let col = 0; col < 8; col++) {
      const x = col * 14 + (row % 2 ? 7 : 0) - 5
      const y = row * 12 - 5
      const pts = Array.from({length:6}, (_,i) => {
        const a = Math.PI/3*i - Math.PI/6
        return `${x+5*Math.cos(a)},${y+5*Math.sin(a)}`
      }).join(' ')
      hexes.push(<polygon key={`${row}-${col}`} points={pts} fill="none" stroke={color} strokeWidth="0.4" opacity="0.8"/>)
    }
  }
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ opacity }}>
      <svg viewBox="0 0 100 60" preserveAspectRatio="xMidYMid slice" className="w-full h-full">{hexes}</svg>
    </div>
  )
}

function DiamondPattern({ color, opacity }: { color: string, opacity: number }) {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ opacity }}>
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full" fill="none">
        {[0,1,2,3,4].map(row => [0,1,2,3,4,5].map(col => (
          <polygon key={`${row}-${col}`} 
            points={`${col*20+10},${row*20} ${col*20+20},${row*20+10} ${col*20+10},${row*20+20} ${col*20},${row*20+10}`}
            stroke={color} strokeWidth="0.5" opacity="0.7"
          />
        )))}
      </svg>
    </div>
  )
}

function ConcentricCircles({ color, opacity }: { color: string, opacity: number }) {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ opacity }}>
      <svg viewBox="0 0 100 100" className="w-full h-full" fill="none">
        {[8,16,24,32,40,48,56,64].map(r => (
          <circle key={r} cx="50" cy="50" r={r} stroke={color} strokeWidth="0.5" opacity="0.6"/>
        ))}
        {[10,25,75,90].map((cx,i) => [10,30,70,90].map((cy,j) => (
          <circle key={`${i}-${j}`} cx={cx} cy={cy} r="5" stroke={color} strokeWidth="0.4" opacity="0.4"/>
        )))}
      </svg>
    </div>
  )
}

function ZigZagLines({ color, opacity }: { color: string, opacity: number }) {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ opacity }}>
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full" fill="none">
        {[5,20,35,50,65,80,95].map(y => (
          <polyline key={y} stroke={color} strokeWidth="0.6" opacity="0.7"
            points={`0,${y} 10,${y-8} 20,${y} 30,${y-8} 40,${y} 50,${y-8} 60,${y} 70,${y-8} 80,${y} 90,${y-8} 100,${y}`}
          />
        ))}
      </svg>
    </div>
  )
}

function FluidBlobs({ color, opacity }: { color: string, opacity: number }) {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ opacity, color }}>
      <svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice" className="w-full h-full fill-current">
        <circle cx="20" cy="20" r="15" opacity="0.3" filter="blur(2px)"/>
        <circle cx="80" cy="30" r="25" opacity="0.2" filter="blur(3px)"/>
        <circle cx="40" cy="80" r="20" opacity="0.4" filter="blur(2px)"/>
        <circle cx="90" cy="90" r="15" opacity="0.3" filter="blur(1px)"/>
        <circle cx="10" cy="60" r="10" opacity="0.5" filter="blur(1px)"/>
      </svg>
    </div>
  )
}

function IconScatterPattern({ icons, color, opacity }: { icons: React.ComponentType<any>[]; color: string; opacity: number }) {
  const items = Array.from({ length: 35 }).map((_, i) => {
    const Icon = icons[i % icons.length]
    const left = `${(Math.sin(i * 123.456) * 45 + 50).toFixed(1)}%`
    const top = `${(Math.cos(i * 321.654) * 45 + 50).toFixed(1)}%`
    const scale = (Math.sin(i * 987.654) * 0.4 + 0.8).toFixed(2)
    const rotation = (Math.cos(i * 147.258) * 180).toFixed(1)
    return (
      <Icon key={i} className="absolute" style={{ left, top, color, opacity, transform: `translate(-50%, -50%) scale(${scale}) rotate(${rotation}deg)`, width: '20px', height: '20px' }} />
    )
  })
  return <div className="absolute inset-0 pointer-events-none overflow-hidden">{items}</div>
}

function PatternLayer({ design }: { design: CardDesign }) {
  const color = design.patternColor || '#ffffff'
  const opacity = design.patternOpacity ?? 0.05
  if (!design.pattern || design.pattern === 'none') return null
  switch (design.pattern as PatternKey) {
    case 'dots':          return <DotMatrix color={color} opacity={opacity} />
    case 'organic-waves': return <OrganicWaves color={color} opacity={opacity} />
    case 'double-waves':  return <DoubleWaves color={color} opacity={opacity} />
    case 'zigzag':        return <ZigZagLines color={color} opacity={opacity} />
    case 'fluid-blobs':   return <FluidBlobs color={color} opacity={opacity} />
    case 'hex-grid':      return <HexagonGrid color={color} opacity={opacity} />
    case 'diamonds':      return <DiamondPattern color={color} opacity={opacity} />
    case 'concentric':    return <ConcentricCircles color={color} opacity={opacity} />
    case 'geo-triangles': return <GeoTriangles color={color} opacity={opacity} />
    case 'stars-scatter': return <IconScatterPattern icons={[Star]} color={color} opacity={opacity} />
    case 'clouds-scatter': return <IconScatterPattern icons={[Cloud]} color={color} opacity={opacity} />
    case 'nature-mix':    return <IconScatterPattern icons={[Sun, Moon, Cloud, Snowflake, Feather, Umbrella, Flame]} color={color} opacity={opacity} />
    case 'luxury-mix':    return <IconScatterPattern icons={[Crown, Gem, Diamond, Award, Shield, Star]} color={color} opacity={opacity} />
    case 'creative-mix':  return <IconScatterPattern icons={[Palette, Brush, PenTool, Scissors, Camera, Film]} color={color} opacity={opacity} />
    case 'music-mix':     return <IconScatterPattern icons={[Music, Speaker, Mic, Headphones, Radio]} color={color} opacity={opacity} />
    case 'space-mix':     return <IconScatterPattern icons={[Moon, Star, Sparkles, Globe, Sun]} color={color} opacity={opacity} />
    case 'travel-mix':    return <IconScatterPattern icons={[Map, Compass, Flag, Umbrella, Anchor, Globe]} color={color} opacity={opacity} />
    case 'love-mix':      return <IconScatterPattern icons={[Heart, Smile, Sun, Sparkles]} color={color} opacity={opacity} />
    case 'crypto-mix':    return <IconScatterPattern icons={[Shield, Lock, Key, Hexagon, Cpu]} color={color} opacity={opacity} />
    case 'random-shapes': return <IconScatterPattern icons={[Circle, Square, Triangle, Hexagon, Star]} color={color} opacity={opacity} />
    case 'tools-mix':     return <IconScatterPattern icons={[Scissors, PenTool, Brush, Code, Cpu]} color={color} opacity={opacity} />
    case 'nautical-mix':  return <IconScatterPattern icons={[Anchor, Compass, Map, Flag, Cloud]} color={color} opacity={opacity} />
    case 'weather-mix':   return <IconScatterPattern icons={[Sun, Moon, Cloud, Snowflake, Umbrella, Flame]} color={color} opacity={opacity} />
    case 'media-mix':     return <IconScatterPattern icons={[Camera, Film, Video, Tv, Monitor, Speaker]} color={color} opacity={opacity} />
    case 'office-mix':    return <IconScatterPattern icons={[Briefcase, Coffee, Clock, Bookmark, Tag]} color={color} opacity={opacity} />
    case 'sports-mix':    return <IconScatterPattern icons={[Target, Award, Crown, Flag, Activity]} color={color} opacity={opacity} />
    case 'communication-mix': return <IconScatterPattern icons={[Phone, Mail, Wifi, Bell, Radio]} color={color} opacity={opacity} />
    case 'magic-mix':     return <IconScatterPattern icons={[Sparkles, Star, Moon, Feather, Diamond]} color={color} opacity={opacity} />
    case 'random-1':      return <IconScatterPattern icons={[Smile, Cpu, Umbrella, Crown, Radio, Anchor]} color={color} opacity={opacity} />
    case 'random-2':      return <IconScatterPattern icons={[Watch, Heart, Shield, Film, Scissors, Tag]} color={color} opacity={opacity} />
    case 'random-3':      return <IconScatterPattern icons={[Headphones, Compass, Hexagon, Coffee, Mic]} color={color} opacity={opacity} />
    default:              return null
  }
}

// ─── Shared Engraving & Logo Mask Helpers ─────────────────────────────────────

function getEngravedFilter(design: CardDesign, template?: NFCTemplate): string {
  const isLight = isBackgroundLight(design, template)
  return isLight 
    ? 'drop-shadow(0px -1px 1px rgba(255,255,255,0.7)) drop-shadow(0px 1px 1px rgba(0,0,0,0.3))'
    : 'drop-shadow(0px -1px 1px rgba(0,0,0,0.8)) drop-shadow(0px 1px 1px rgba(255,255,255,0.2))'
}

function getLogoMaskStyle(colorId?: string, position: string = 'center', type?: 'solid' | 'gradient', gradientStart?: string, gradientEnd?: string, gradientAngle?: number) {
  if (type === 'gradient') {
    return {
      background: `linear-gradient(${gradientAngle ?? 135}deg, ${gradientStart || '#0C0C0C'} 0%, ${gradientEnd || '#D4AF37'} 100%)`,
      WebkitMaskImage: `url(/linkora-fixed-logo.png)`,
      WebkitMaskSize: 'contain',
      WebkitMaskRepeat: 'no-repeat',
      WebkitMaskPosition: position,
    }
  }

  if (!colorId || colorId === 'original') return {}
  let bg = colorId
  if (colorId === 'black') bg = '#111'
  else if (colorId === 'white') bg = '#EEE'
  else if (colorId === 'silver') bg = 'linear-gradient(135deg, #E0E0E0 0%, #FFFFFF 50%, #BDBDBD 100%)'
  else if (colorId === 'gold') bg = 'linear-gradient(135deg, #D4AF37 0%, #FFF5E1 50%, #AA8C2C 100%)'
  
  return {
    background: bg,
    WebkitMaskImage: `url(/linkora-fixed-logo.png)`,
    WebkitMaskSize: 'contain',
    WebkitMaskRepeat: 'no-repeat',
    WebkitMaskPosition: position,
  }
}

// ─── Card Canvas Back ────────────────────────────────────────────────────────

function CardCanvasBack({ design, previewRef }: { design: CardDesign; previewRef?: React.Ref<HTMLDivElement> }) {
  const template = TEMPLATES.find(t => t.id === design.templateId)
  const bgStyle = buildBackground(design, template)
  const cardStyle = buildCardStyle(design, template)
  const engravedShadows = getEngravedFilter(design, template)
  const actualLogoFilter = (!design.logoColor || design.logoColor === 'original') && isBackgroundLight(design, template)
    ? `brightness(0) ${engravedShadows}`
    : engravedShadows

  return (
    <div
      ref={previewRef}
      className="relative w-full h-full overflow-hidden select-none"
      style={{ ...bgStyle, ...cardStyle }}
    >
      {/* Template base decorations */}
      {design.bgType === 'template' && template?.renderDeco('back')}

      {/* Image blur + overlay */}
      {design.bgType === 'image' && design.bgImageUrl && (
        <>
          {(design.bgImageBlur ?? 0) > 0 && (
            <div className="absolute inset-0" style={{ backdropFilter: `blur(${design.bgImageBlur}px)` }} />
          )}
          {design.bgImageOverlay && (
            <div
              className="absolute inset-0"
              style={{ backgroundColor: design.bgImageOverlay, opacity: design.bgImageOverlayOpacity ?? 0.4 }}
            />
          )}
        </>
      )}

      {/* Pattern overlay */}
      <PatternLayer design={design} />

      {/* Fixed Logo (Back) */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20" style={{ filter: actualLogoFilter }}>
        <div className="w-80 h-40 relative flex items-center justify-center">
          {design.logoColorType === 'gradient' || (design.logoColor && design.logoColor !== 'original') ? (
            <div className="w-full h-full pointer-events-none" style={getLogoMaskStyle(design.logoColor, 'center', design.logoColorType, design.logoGradientStart, design.logoGradientEnd, design.logoGradientAngle)} />
          ) : (
            <img src="/linkora-fixed-logo.png" alt="Linkora" className="w-full h-full object-contain opacity-90" draggable={false} />
          )}
        </div>
      </div>
    </div>
  )
}

// ─── Card Canvas Front ───────────────────────────────────────────────────────

function CardCanvas({
  design, previewRef, showGrid, isDragging,
  onPointerDown, selectedQR, cardId, selectedEls,
}: {
  design: CardDesign
  previewRef: React.Ref<HTMLDivElement>
  showGrid: boolean
  isDragging: string | null
  onPointerDown: (e: React.PointerEvent, id: string) => void
  selectedQR: { id: string; url?: string } | null | undefined
  cardId: string
  selectedEls: string[]
}) {
  const template = TEMPLATES.find(t => t.id === design.templateId)
  const bgStyle = buildBackground(design, template)
  const cardStyle = buildCardStyle(design, template)
  const isLight = isBackgroundLight(design, template)
  const engravedShadows = getEngravedFilter(design, template)
    
  const actualLogoFilter = (!design.logoColor || design.logoColor === 'original') && isLight 
    ? `brightness(0) ${engravedShadows}` 
    : engravedShadows
    
  const actualNfcFilter = engravedShadows

  const getNfcStroke = (colorId?: string, type?: 'solid' | 'gradient') => {
    if (type === 'gradient') return 'url(#nfc-custom)'
    if (!colorId || colorId === 'original' || colorId === 'silver') return 'url(#nfc-silver)'
    if (colorId === 'gold') return 'url(#nfc-gold)'
    if (colorId === 'black') return '#111'
    if (colorId === 'white') return '#EEE'
    return colorId
  }
  const getNfcTextClr = (colorId?: string, type?: 'solid' | 'gradient') => {
    if (type === 'gradient') return design.nfcGradientStart || '#FFF'
    if (!colorId || colorId === 'original' || colorId === 'silver') return '#FFF'
    if (colorId === 'gold') return '#D4AF37'
    if (colorId === 'black') return '#111'
    if (colorId === 'white') return '#EEE'
    return colorId
  }

  return (
    <div
      ref={previewRef}
      id={`card-canvas-${cardId}`}
      className="relative w-full h-full overflow-hidden select-none"
      style={{ ...bgStyle, ...cardStyle }}
    >
      {/* Template base decorations */}
      {design.bgType === 'template' && template?.renderDeco('front')}

      {/* Image blur + overlay */}
      {design.bgType === 'image' && design.bgImageUrl && (
        <>
          {(design.bgImageBlur ?? 0) > 0 && (
            <div className="absolute inset-0" style={{ backdropFilter: `blur(${design.bgImageBlur}px)` }} />
          )}
          {design.bgImageOverlay && (
            <div
              className="absolute inset-0"
              style={{ backgroundColor: design.bgImageOverlay, opacity: design.bgImageOverlayOpacity ?? 0.4 }}
            />
          )}
        </>
      )}

      {/* SVG Gradient Defs for NFC */}
      <svg width="0" height="0" className="absolute pointer-events-none">
        <defs>
          <linearGradient id="nfc-silver" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#E0E0E0" />
            <stop offset="50%" stopColor="#FFFFFF" />
            <stop offset="100%" stopColor="#BDBDBD" />
          </linearGradient>
          <linearGradient id="nfc-gold" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#D4AF37" />
            <stop offset="50%" stopColor="#FFF5E1" />
            <stop offset="100%" stopColor="#AA8C2C" />
          </linearGradient>
          <linearGradient id="nfc-custom" x1="0%" y1="0.5" x2="100%" y2="0.5" gradientTransform={`rotate(${design.nfcGradientAngle ?? 135} 0.5 0.5)`}>
            <stop offset="0%" stopColor={design.nfcGradientStart || '#0C0C0C'} />
            <stop offset="100%" stopColor={design.nfcGradientEnd || '#D4AF37'} />
          </linearGradient>
        </defs>
      </svg>

      {/* Pattern overlay */}
      <PatternLayer design={design} />

      {/* Fixed Logo (Front Top-Left) */}
      <div 
        className={`absolute top-6 left-6 h-24 w-40 z-20 cursor-pointer pointer-events-auto ${selectedEls.includes('logo') ? 'ring-2 ring-indigo-400/80 ring-offset-2 ring-offset-transparent rounded-sm' : ''}`} 
        style={{ filter: actualLogoFilter }}
        onPointerDown={(e) => onPointerDown(e, 'logo')}
      >
        {design.logoColorType === 'gradient' || (design.logoColor && design.logoColor !== 'original') ? (
          <div className="w-full h-full pointer-events-none" style={getLogoMaskStyle(design.logoColor, 'left center', design.logoColorType, design.logoGradientStart, design.logoGradientEnd, design.logoGradientAngle)} />
        ) : (
          <img src="/linkora-fixed-logo.png" alt="Linkora" className="h-full w-full object-contain object-left pointer-events-none" draggable={false} />
        )}
      </div>

      {/* Fixed NFC Badge (Front Top-Right) */}
      <div 
        className={`absolute top-8 right-8 z-20 cursor-pointer pointer-events-auto flex flex-col items-center gap-1.5 ${selectedEls.includes('nfc') ? 'ring-2 ring-indigo-400/80 ring-offset-2 ring-offset-transparent rounded-sm p-1 -m-1' : ''}`} 
        style={{ filter: actualNfcFilter }}
        onPointerDown={(e) => onPointerDown(e, 'nfc')}
      >
        <svg viewBox="0 0 24 24" className="w-16 h-16 rotate-90 pointer-events-none" fill="none" stroke={getNfcStroke(design.nfcColor, design.nfcColorType)} strokeWidth="2">
          <path d="M1.5 8.5a13 13 0 0 1 21 0M5 12a10 10 0 0 1 14 0M8.5 15.5a5 5 0 0 1 7 0M12 19h.01" />
        </svg>
        <span className="text-[11px] font-bold tracking-widest mt-0.5 pointer-events-none" style={{ color: getNfcTextClr(design.nfcColor, design.nfcColorType) }}>
          NFC
        </span>
      </div>

      {/* Grid overlay (editor-only) */}
      {showGrid && (
        <div
          className="absolute inset-0 pointer-events-none z-50 grid-overlay"
          style={{
            backgroundImage: 'repeating-linear-gradient(0deg, rgba(99,102,241,0.18) 0, rgba(99,102,241,0.18) 1px, transparent 1px, transparent 10%), repeating-linear-gradient(90deg, rgba(99,102,241,0.18) 0, rgba(99,102,241,0.18) 1px, transparent 1px, transparent 10%)',
            backgroundSize: '10% 10%',
          }}
        />
      )}

      {/* Draggable elements */}
      {design.elements.filter(el => el.visible).map(el => (
        <DraggableElement
          key={el.id}
          element={el}
          isDragging={isDragging === el.id}
          onPointerDown={onPointerDown}
          design={design}
          selectedQR={selectedQR}
        />
      ))}
    </div>
  )
}

// ─── Draggable Element ────────────────────────────────────────────────────────

function DraggableElement({
  element, isDragging, onPointerDown, design, selectedQR,
}: {
  element: CardCanvasElement
  isDragging: boolean
  onPointerDown: (e: React.PointerEvent, id: string) => void
  design: CardDesign
  selectedQR?: any
}) {
  const sizeClass = ICON_SIZE_MAP[element.size || 'md']
  const fontClass = `${FONT_SIZE_MAP[element.fontSize || 'md']} ${FONT_WEIGHT_MAP[element.fontWeight || 'bold']}`
  const sizeIdx = SIZE_STEPS.indexOf(element.size || 'md')
  const qrSize = QR_SIZE_STEPS[sizeIdx < 0 ? 2 : sizeIdx]
  const template = TEMPLATES.find(t => t.id === design.templateId)
  const engravedShadows = getEngravedFilter(design, template)

  const content = (() => {
    switch (element.type) {
      case 'logo':
        return (
          <img
            src="/linkora-logo.png"
            alt="Linkora"
            className={`object-contain pointer-events-none ${sizeClass}`}
            draggable={false}
          />
        )

      case 'name':
        return (
          <span className={`${fontClass} leading-none pointer-events-none whitespace-nowrap`} style={{ color: element.color || '#FFFFFF', fontFamily: element.fontFamily, filter: engravedShadows }}>
            {design.cardName || 'Your Name'}
          </span>
        )
      case 'job':
        return (
          <span className={`${fontClass} opacity-90 pointer-events-none whitespace-nowrap`} style={{ color: element.color || '#A0A0A0', fontFamily: element.fontFamily, filter: engravedShadows }}>
            {design.cardJob || 'Job Title'}
          </span>
        )
      case 'company':
        return (
          <span className={`${fontClass} opacity-70 uppercase tracking-wider pointer-events-none whitespace-nowrap`} style={{ color: element.color || '#808080', fontFamily: element.fontFamily, filter: engravedShadows }}>
            {design.cardCompany || 'Company'}
          </span>
        )
      case 'text':
        return (
          <span className={`${fontClass} leading-none pointer-events-none whitespace-nowrap`} style={{ color: element.color || '#FFFFFF', fontFamily: element.fontFamily, filter: engravedShadows }}>
            {element.text || 'New Text'}
          </span>
        )
      case 'qr': {
        const qrSizePx = qrSize as number
        const shapeClass = 'rounded-2xl'
        
        let containerStyle: React.CSSProperties = { 
          width: qrSize, 
          height: 'max-content',
          padding: (design.qrBgType === 'solid' && design.qrBgColor !== 'transparent') || design.qrBgType === 'gradient' ? '6px' : '0',
          filter: engravedShadows
        }
        
        if (design.qrBgType === 'gradient') {
          containerStyle.background = `linear-gradient(${design.qrBgGradientAngle ?? 135}deg, ${design.qrBgGradientStart || '#0C0C0C'} 0%, ${design.qrBgGradientEnd || '#D4AF37'} 100%)`
        } else if (design.qrBgType !== 'none' && design.qrBgColor && design.qrBgColor !== 'transparent') {
          containerStyle.backgroundColor = design.qrBgColor
        }

        if (selectedQR) {
          // Render exactly as designed
          return (
            <div 
              className={`pointer-events-none flex items-center justify-center ${shapeClass}`} 
              style={containerStyle}
            >
              <div style={{ width: '100%', height: 'auto', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <QRGenerator 
                  value={selectedQR.url || 'https://linkora.app'} 
                  size={qrSizePx} 
                  customization={selectedQR.customization || {}} 
                  errorCorrectionLevel={selectedQR.errorCorrection || 'H'}
                  previewMode={true}
                />
              </div>
            </div>
          )
        } else {
          // Placeholder
          return (
            <div
              className={`${shapeClass} border border-white/20 bg-white/5 flex items-center justify-center`}
              style={{ width: qrSize, height: qrSize, ...containerStyle, backgroundColor: containerStyle.backgroundColor }}
            >
              <span className="text-[8px] text-white/30 text-center font-medium">QR<br />Code</span>
            </div>
          )
        }
      }
      case 'icon': {
        const IconComp = ICON_COMPONENT_MAP[element.iconName || 'Star'] || Star
        return <IconComp className={`${sizeClass} pointer-events-none`} style={{ color: element.color || '#D4AF37' }} />
      }
      default:
        return null
    }
  })()

  return (
    <div
      className={`absolute cursor-move touch-none z-10 ${isDragging ? 'z-30' : ''}`}
      style={{
        left: `${element.x}%`,
        top: `${element.y}%`,
        transform: element.rotation ? `rotate(${element.rotation}deg)` : undefined,
        opacity: element.opacity ?? 1,
        transition: isDragging ? 'none' : 'opacity 0.2s',
      }}
      onPointerDown={(e) => onPointerDown(e, element.id)}
    >
      {isDragging && (
        <div className="absolute -inset-2 border-2 border-dashed border-indigo-400/80 rounded-lg pointer-events-none" />
      )}
      {content}
    </div>
  )
}

// ─── Color Input ──────────────────────────────────────────────────────────────

function ColorInput({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-xs text-neutral-400 flex-1 truncate">{label}</span>
      <div className="flex items-center gap-2">
        <input type="color" value={value} onChange={e => onChange(e.target.value)}
          className="w-7 h-7 rounded-lg cursor-pointer border-0 bg-transparent" />
        <input type="text" value={value} onChange={e => onChange(e.target.value)}
          className="w-20 text-xs bg-neutral-800 border border-neutral-700 rounded-lg px-2 py-1.5 text-white font-mono focus:outline-none focus:border-indigo-500"
          maxLength={7} />
      </div>
    </div>
  )
}

// ─── Accordion Section (mutual-close aware) ───────────────────────────────────

function Section({ title, icon: Icon, children, isOpen, onToggle }: {
  title: string
  icon: React.ComponentType<any>
  children: React.ReactNode
  isOpen: boolean
  onToggle: () => void
}) {
  return (
    <div className="border border-neutral-800 rounded-xl overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between gap-2 px-4 py-3 bg-neutral-900 hover:bg-neutral-800/80 transition-colors"
      >
        <div className="flex items-center gap-2">
          <Icon className="w-4 h-4 text-indigo-400" />
          <span className="text-sm font-semibold text-white">{title}</span>
        </div>
        {isOpen
          ? <ChevronDown className="w-4 h-4 text-neutral-500" />
          : <ChevronRight className="w-4 h-4 text-neutral-500" />}
      </button>
      {isOpen && <div className="p-4 bg-neutral-950 space-y-3">{children}</div>}
    </div>
  )
}

// ─── Angle Slider ─────────────────────────────────────────────────────────────

function AngleSlider({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-7 h-7 rounded-full border-2 border-neutral-600 shrink-0"
        style={{ background: `conic-gradient(from ${value}deg, transparent 0deg, rgba(99,102,241,0.8) 1deg, transparent 2deg)` }} />
      <input type="range" min={0} max={360} value={value}
        onChange={e => onChange(Number(e.target.value))}
        className="flex-1 h-1 rounded-full accent-indigo-500" />
      <span className="text-xs text-neutral-400 w-8 shrink-0">{value}°</span>
    </div>
  )
}

// ─── Main Editor ─────────────────────────────────────────────────────────────

export function CardCanvasEditor({ cardId, initialDesign, onSave, onClose, qrCodes }: Props) {
  const previewRef = useRef<HTMLDivElement>(null)
  const backPreviewRef = useRef<HTMLDivElement>(null)
  const canvasContainerRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [design, setDesign] = useState<CardDesign>(() => ({
    ...(initialDesign?.bgType ? initialDesign.bgType !== 'template' ? BLANK_DESIGN : DEFAULT_DESIGN : DEFAULT_DESIGN),
    ...(initialDesign || {}),
    elements: initialDesign?.elements?.length ? initialDesign.elements : DEFAULT_ELEMENTS,
  }))

  const [isSaving, setIsSaving] = useState(false)
  const [isExporting, setIsExporting] = useState(false)
  const [selectedEls, setSelectedEls] = useState<string[]>([])
  const [draggingId, setDraggingId] = useState<string | null>(null)
  const [imageUploading, setImageUploading] = useState(false)
  const [iconCategory, setIconCategory] = useState<string>('Premium')
  const [lockedElements, setLockedElements] = useState<Set<string>>(new Set())
  const [isFlipped, setIsFlipped] = useState(false)

  // Accordion: only one section open at a time
  const [openSection, setOpenSection] = useState<string>('template')
  const toggleSection = (name: string) =>
    setOpenSection(prev => (prev === name ? '' : name))

  const dragStart = useRef<{ mx: number; my: number; elements: { id: string; ex: number; ey: number }[] } | null>(null)

  // ── QR URL ──────────────────────────────────────────────────────────────────
  const selectedQR = qrCodes.find(q => q.id === design.linkedQrId)

  // ── Drag ────────────────────────────────────────────────────────────────────
  const handlePointerDown = useCallback((e: React.PointerEvent, id: string) => {
    if (lockedElements.has(id)) return
    e.preventDefault()
    e.stopPropagation()
    const clickedEl = design.elements.find(x => x.id === id)
    if (!clickedEl && id !== 'logo' && id !== 'nfc') return
    
    let currentSelection = selectedEls
    if (e.shiftKey || e.metaKey || e.ctrlKey) {
      if (!currentSelection.includes(id)) {
        currentSelection = [...currentSelection, id]
        setSelectedEls(currentSelection)
      }
    } else {
      if (!currentSelection.includes(id)) {
        currentSelection = [id]
        setSelectedEls(currentSelection)
      }
    }

    setDraggingId(id)

    const elementsToDrag = design.elements
      .filter(el => currentSelection.includes(el.id) && !lockedElements.has(el.id))
      .map(el => ({ id: el.id, ex: el.x, ey: el.y }))

    dragStart.current = { mx: e.clientX, my: e.clientY, elements: elementsToDrag };
    (e.target as HTMLElement).setPointerCapture(e.pointerId)
  }, [design.elements, lockedElements, selectedEls])

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      if (!draggingId || !dragStart.current || !canvasContainerRef.current) return
      const rect = canvasContainerRef.current.getBoundingClientRect()
      const dx = ((e.clientX - dragStart.current.mx) / rect.width) * 100
      const dy = ((e.clientY - dragStart.current.my) / rect.height) * 100
      
      const elementsToUpdate = dragStart.current.elements

      setDesign(prev => ({
        ...prev,
        elements: prev.elements.map(el => {
          const dragData = elementsToUpdate.find(d => d.id === el.id)
          if (dragData) {
             const newX = Math.min(Math.max(dragData.ex + dx, 0), 95)
             const newY = Math.min(Math.max(dragData.ey + dy, 0), 90)
             return { ...el, x: newX, y: newY }
          }
          return el
        }),
      }))
    }
    const onUp = () => { setDraggingId(null); dragStart.current = null }
    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerup', onUp)
    return () => { window.removeEventListener('pointermove', onMove); window.removeEventListener('pointerup', onUp) }
  }, [draggingId])

  // ── Design Helpers ───────────────────────────────────────────────────────────
  const updateDesign = (patch: Partial<CardDesign>) =>
    setDesign(prev => ({ ...prev, ...patch }))

  const updateElement = (id: string, patch: Partial<CardCanvasElement>) =>
    setDesign(prev => ({
      ...prev,
      elements: prev.elements.map(el => el.id === id ? { ...el, ...patch } : el),
    }))

  const updateSelected = (patch: Partial<CardCanvasElement>) =>
    setDesign(prev => ({
      ...prev,
      elements: prev.elements.map(el => selectedEls.includes(el.id) ? { ...el, ...patch } : el),
    }))

  const addIcon = (iconName: string) => {
    const newEl: CardCanvasElement = {
      id: `icon-${Date.now()}`,
      type: 'icon', x: 40, y: 40,
      visible: true, iconName, size: 'md', color: '#D4AF37', opacity: 1,
    }
    setDesign(prev => ({ ...prev, elements: [...prev.elements, newEl] }))
    setSelectedEls([newEl.id])
  }



  const toggleLock = (id: string) => {
    setLockedElements(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  const resetElements = () => setDesign(prev => ({ ...prev, elements: DEFAULT_ELEMENTS }))

  // ── Image Upload ─────────────────────────────────────────────────────────────
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setImageUploading(true)
    const reader = new FileReader()
    reader.onload = (ev) => {
      updateDesign({ bgType: 'image', bgImageUrl: ev.target?.result as string })
      setImageUploading(false)
    }
    reader.readAsDataURL(file)
  }

  const clearBgImage = () => {
    updateDesign({ bgType: 'solid', bgImageUrl: undefined, bgImageBlur: 0, bgImageOverlay: undefined })
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  // ── Save & Export ────────────────────────────────────────────────────────────
  const handleSave = async () => {
    setIsSaving(true)
    try { await onSave(design) } finally { setIsSaving(false) }
  }

  const handleExport = async (format: 'png' | 'hires' | 'pdf' | 'transparent') => {
    const targetRef = isFlipped ? backPreviewRef.current : previewRef.current
    if (!targetRef) return
    setIsExporting(true)
    const gridEl = targetRef.querySelector('.grid-overlay') as HTMLElement | null
    if (gridEl) gridEl.style.display = 'none'
    try {
      if (format === 'png' || format === 'transparent') {
        const url = await toPng(targetRef, {
          pixelRatio: 2,
          backgroundColor: format === 'transparent' ? undefined : '#000000',
        })
        const a = document.createElement('a')
        a.download = `linkora-card${format === 'transparent' ? '-transparent' : ''}.png`
        a.href = url; a.click()
      } else if (format === 'hires') {
        const url = await toPng(targetRef, { pixelRatio: 4 })
        const a = document.createElement('a')
        a.download = 'linkora-card-hires.png'; a.href = url; a.click()
      } else if (format === 'pdf') {
        const url = await toPng(targetRef, { pixelRatio: 3 })
        const pdf = new jsPDF({ orientation: 'landscape', unit: 'in', format: [3.5, 2] })
        pdf.addImage(url, 'PNG', 0, 0, 3.5, 2)
        pdf.save('linkora-card.pdf')
      }
    } finally {
      if (gridEl) gridEl.style.display = ''
      setIsExporting(false)
    }
  }


  return (
    <div className="fixed inset-0 z-50 bg-[#080810] flex flex-col overflow-hidden">
      {/* ── Top Bar ─────────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-neutral-800 shrink-0 bg-[#0D0D1A]">
        <div className="flex items-center gap-3">
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-neutral-800 text-neutral-400 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
          <div>
            <h2 className="text-white font-bold text-sm">Card Designer</h2>
            <p className="text-neutral-500 text-xs">Drag elements • Click to select • Scroll panel for more</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => updateDesign({ showGrid: !design.showGrid })}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-colors ${design.showGrid ? 'bg-indigo-600 text-white' : 'bg-neutral-800 text-neutral-400 hover:text-white'}`}
          >
            <Grid3X3 className="w-3.5 h-3.5" /> Grid
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all disabled:opacity-60"
          >
            {isSaving ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
            {isSaving ? 'Saving...' : 'Save Design'}
          </button>
        </div>
      </div>

      {/* ── Body ────────────────────────────────────────────────────────────── */}
      <div className="flex flex-1 overflow-hidden">
        {/* ── Left Panel ──────────────────────────────────────────────────── */}
        <div className="w-72 shrink-0 border-r border-neutral-800 overflow-y-auto bg-[#0D0D1A] space-y-1.5 p-3">

          {/* Base Template */}
          <Section title="Base Template" icon={Layers} isOpen={openSection === 'template'} onToggle={() => toggleSection('template')}>
            <div className="grid grid-cols-3 gap-1.5">
              {TEMPLATES.map(t => (
                <button
                  key={t.id}
                  onClick={() => updateDesign({ templateId: t.id, bgType: 'template' })}
                  className={`relative rounded-lg overflow-hidden aspect-[7/4] border-2 transition-all ${design.templateId === t.id && design.bgType === 'template' ? 'border-indigo-500' : 'border-neutral-700 hover:border-neutral-500'}`}
                >
                  <div className="absolute inset-0" style={{ background: t.bg }} />
                  {t.renderDeco('front')}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-[6px] font-bold text-white/80 text-center leading-tight px-0.5">{t.name.split(' ')[0]}</span>
                  </div>
                </button>
              ))}
            </div>
          </Section>

          {/* Background */}
          <Section title="Background" icon={Image} isOpen={openSection === 'background'} onToggle={() => toggleSection('background')}>
            <div className="flex gap-1 bg-neutral-900 rounded-lg p-1">
              {(['template', 'solid', 'gradient', 'image'] as CardBgType[]).map(type => (
                <button key={type} onClick={() => updateDesign({ bgType: type })}
                  className={`flex-1 py-1 rounded-md text-[10px] font-semibold capitalize transition-colors ${design.bgType === type ? 'bg-indigo-600 text-white' : 'text-neutral-400 hover:text-white'}`}>
                  {type}
                </button>
              ))}
            </div>

            {design.bgType === 'solid' && (
              <ColorInput label="Background Color" value={design.bgColor || '#0C0C0C'} onChange={v => updateDesign({ bgColor: v })} />
            )}

            {design.bgType === 'gradient' && (
              <>
                <ColorInput label="Start Color" value={design.bgGradientStart || '#0C0C0C'} onChange={v => updateDesign({ bgGradientStart: v })} />
                <ColorInput label="End Color" value={design.bgGradientEnd || '#D4AF37'} onChange={v => updateDesign({ bgGradientEnd: v })} />
                <div className="space-y-1">
                  <span className="text-xs text-neutral-400">Angle</span>
                  <AngleSlider value={design.bgGradientAngle ?? 135} onChange={v => updateDesign({ bgGradientAngle: v })} />
                </div>
              </>
            )}

            {design.bgType === 'image' && (
              <>
                {/* Upload button */}
                <button onClick={() => fileInputRef.current?.click()}
                  className="w-full py-3 rounded-xl border-2 border-dashed border-neutral-700 hover:border-indigo-500 text-neutral-400 hover:text-indigo-400 text-xs font-semibold flex items-center justify-center gap-2 transition-colors">
                  {imageUploading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                  {imageUploading ? 'Loading...' : design.bgImageUrl ? 'Change Image' : 'Upload Image'}
                </button>
                <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />

                {/* Preview + Clear */}
                {design.bgImageUrl && (
                  <>
                    <div className="relative rounded-xl overflow-hidden aspect-[7/4] border border-neutral-700">
                      <img src={design.bgImageUrl} alt="bg" className="w-full h-full object-cover" />
                      <button
                        onClick={clearBgImage}
                        className="absolute top-1.5 right-1.5 p-1.5 rounded-lg bg-red-600/90 hover:bg-red-600 text-white transition-colors"
                        title="Remove image"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                    <div className="space-y-1">
                      <span className="text-xs text-neutral-400">Blur ({design.bgImageBlur ?? 0}px)</span>
                      <input type="range" min={0} max={20} value={design.bgImageBlur ?? 0}
                        onChange={e => updateDesign({ bgImageBlur: Number(e.target.value) })}
                        className="w-full h-1 rounded-full accent-indigo-500" />
                    </div>
                    <ColorInput label="Overlay Color" value={design.bgImageOverlay || '#000000'} onChange={v => updateDesign({ bgImageOverlay: v })} />
                    <div className="space-y-1">
                      <span className="text-xs text-neutral-400">Overlay Opacity ({Math.round((design.bgImageOverlayOpacity ?? 0.4) * 100)}%)</span>
                      <input type="range" min={0} max={1} step={0.05} value={design.bgImageOverlayOpacity ?? 0.4}
                        onChange={e => updateDesign({ bgImageOverlayOpacity: Number(e.target.value) })}
                        className="w-full h-1 rounded-full accent-indigo-500" />
                    </div>
                  </>
                )}
              </>
            )}
          </Section>

          {/* Pattern */}
          <Section title="Pattern Overlay" icon={Sparkles} isOpen={openSection === 'pattern'} onToggle={() => toggleSection('pattern')}>
            <div className="grid grid-cols-4 gap-2">
              {PATTERN_OPTIONS.map(p => {
                const Icon = p.icon
                return (
                  <button key={p.id} onClick={() => updateDesign({ pattern: p.id })} title={p.label}
                    className={`p-2 rounded-xl flex flex-col items-center justify-center gap-1 transition-colors ${design.pattern === p.id ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/20' : 'bg-neutral-800 text-neutral-400 hover:bg-neutral-700 hover:text-white'}`}>
                    <Icon className="w-4 h-4" />
                    <span className="text-[8px] opacity-70">{p.label.split(' ')[0]}</span>
                  </button>
                )
              })}
            </div>
            {design.pattern && design.pattern !== 'none' && (
              <>
                <ColorInput label="Color" value={design.patternColor || '#ffffff'} onChange={v => updateDesign({ patternColor: v })} />
                <div className="space-y-1">
                  <span className="text-xs text-neutral-400">Opacity ({Math.round((design.patternOpacity ?? 0.05) * 100)}%)</span>
                  <input type="range" min={0.01} max={0.4} step={0.01} value={design.patternOpacity ?? 0.05}
                    onChange={e => updateDesign({ patternOpacity: Number(e.target.value) })}
                    className="w-full h-1 rounded-full accent-indigo-500" />
                </div>
              </>
            )}
          </Section>



          {/* QR Container Options */}
          <Section title="QR Container" icon={Square} isOpen={openSection === 'qr'} onToggle={() => toggleSection('qr')}>
            <div className="space-y-3">
              <div className="flex gap-1 bg-neutral-900 rounded-lg p-1">
                {(['none', 'solid', 'gradient'] as const).map(type => (
                  <button key={type} onClick={() => updateDesign({ qrBgType: type })}
                    className={`flex-1 py-1 rounded-md text-[10px] font-semibold capitalize transition-colors ${design.qrBgType === type || (!design.qrBgType && type === 'solid') ? 'bg-indigo-600 text-white' : 'text-neutral-400 hover:text-white'}`}>
                    {type}
                  </button>
                ))}
              </div>

              {(!design.qrBgType || design.qrBgType === 'solid') && (
                <ColorInput label="Background Color" value={design.qrBgColor || 'transparent'} onChange={v => updateDesign({ qrBgColor: v, qrBgType: 'solid' })} />
              )}

              {design.qrBgType === 'gradient' && (
                <>
                  <ColorInput label="Start Color" value={design.qrBgGradientStart || '#0C0C0C'} onChange={v => updateDesign({ qrBgGradientStart: v })} />
                  <ColorInput label="End Color" value={design.qrBgGradientEnd || '#D4AF37'} onChange={v => updateDesign({ qrBgGradientEnd: v })} />
                  <div className="space-y-1">
                    <span className="text-xs text-neutral-400">Angle</span>
                    <AngleSlider value={design.qrBgGradientAngle ?? 135} onChange={v => updateDesign({ qrBgGradientAngle: v })} />
                  </div>
                </>
              )}
            </div>
          </Section>

          {/* Card Info */}
          <Section title="Card Info" icon={Type} isOpen={openSection === 'info'} onToggle={() => toggleSection('info')}>
            <div className="space-y-2">
              {[
                { label: 'Name', key: 'cardName' as const, placeholder: 'John Smith' },
                { label: 'Job Title', key: 'cardJob' as const, placeholder: 'CEO' },
                { label: 'Company', key: 'cardCompany' as const, placeholder: 'Linkora Inc.' },
              ].map(({ label, key, placeholder }) => (
                <div key={key}>
                  <label className="text-[10px] text-neutral-500 mb-0.5 block">{label}</label>
                  <input type="text" placeholder={placeholder} value={design[key] || ''}
                    onChange={e => updateDesign({ [key]: e.target.value })}
                    className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500" />
                </div>
              ))}
              <div>
                <label className="text-[10px] text-neutral-500 mb-0.5 block">Linked QR Code</label>
                <select value={design.linkedQrId || ''} onChange={e => updateDesign({ linkedQrId: e.target.value })}
                  className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500">
                  <option value="">— No QR Code —</option>
                  {qrCodes.map(q => (
                    <option key={q.id} value={q.id}>{q.name || q.url || q.id}</option>
                  ))}
                </select>
              </div>
              <div className="pt-2">
                <button onClick={() => {
                  const newEl: CardCanvasElement = {
                    id: `text-${Date.now()}`,
                    type: 'text', x: 50, y: 50,
                    visible: true, text: 'New Text', size: 'md', color: '#FFFFFF', opacity: 1, fontSize: 'md', fontWeight: 'medium'
                  }
                  setDesign(prev => ({ ...prev, elements: [...prev.elements, newEl] }))
                  setSelectedEls([newEl.id])
                }}
                  className="w-full py-2 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/40 border border-indigo-500/30 text-indigo-300 hover:text-white text-xs font-semibold flex items-center justify-center gap-2 transition-colors">
                  <Type className="w-3.5 h-3.5" />
                  Add Custom Text
                </button>
              </div>
            </div>
          </Section>

          {/* Border & Glow */}
          <Section title="Border & Glow" icon={Sun} isOpen={openSection === 'border'} onToggle={() => toggleSection('border')}>
            <div className="space-y-3">
              <div>
                <label className="text-[10px] text-neutral-500 mb-1 block">Border Radius ({design.borderRadius ?? 16}px)</label>
                <input type="range" min={0} max={40} value={design.borderRadius ?? 16}
                  onChange={e => updateDesign({ borderRadius: Number(e.target.value) })}
                  className="w-full h-1 rounded-full accent-indigo-500" />
              </div>
              <div>
                <label className="text-[10px] text-neutral-500 mb-1 block">Border Style</label>
                <select value={design.borderStyle || ''} onChange={e => updateDesign({ borderStyle: e.target.value || undefined })}
                  className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-2 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500">
                  <option value="">Template Default</option>
                  <option value="1px solid rgba(255,255,255,0.1)">Subtle White</option>
                  <option value="1px solid rgba(212,175,55,0.5)">Gold Border</option>
                  <option value="1px solid rgba(192,192,192,0.5)">Silver Border</option>
                  <option value="2px solid rgba(99,102,241,0.6)">Indigo Border</option>
                  <option value="none">No Border</option>
                </select>
              </div>
              <ColorInput label="Glow Color" value={design.glowColor || '#D4AF37'} onChange={v => updateDesign({ glowColor: v })} />
              <div>
                <label className="text-[10px] text-neutral-500 mb-1 block">Glow Intensity ({Math.round((design.glowIntensity ?? 0) * 100)}%)</label>
                <input type="range" min={0} max={1} step={0.05} value={design.glowIntensity ?? 0}
                  onChange={e => updateDesign({ glowIntensity: Number(e.target.value) })}
                  className="w-full h-1 rounded-full accent-indigo-500" />
              </div>
            </div>
          </Section>

          {/* Elements */}
          <Section title="Elements" icon={Layers} isOpen={openSection === 'elements'} onToggle={() => toggleSection('elements')}>
            <div className="space-y-1">
              {design.elements.map(el => {
                const isLocked = lockedElements.has(el.id)
                return (
                  <div
                    key={el.id}
                    onClick={(e) => {
                      if (e.shiftKey || e.metaKey || e.ctrlKey) {
                        setSelectedEls(prev => prev.includes(el.id) ? prev.filter(id => id !== el.id) : [...prev, el.id])
                      } else {
                        setSelectedEls(selectedEls.length === 1 && selectedEls[0] === el.id ? [] : [el.id])
                      }
                    }}
                    className={`flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer transition-colors ${selectedEls.includes(el.id) ? 'bg-indigo-900/40 border border-indigo-500/40' : 'bg-neutral-900 hover:bg-neutral-800'}`}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <Move className="w-3 h-3 text-neutral-500 shrink-0" />
                      <span className="text-xs text-white capitalize truncate">{el.iconName || el.type}</span>
                    </div>
                    <div className="flex items-center gap-0.5 shrink-0">
                      <button onClick={e => { e.stopPropagation(); toggleLock(el.id) }}
                        className={`p-1 rounded hover:bg-neutral-700 transition-colors ${isLocked ? 'text-yellow-400' : 'text-neutral-500'}`}>
                        {isLocked ? <Lock className="w-3 h-3" /> : <Unlock className="w-3 h-3" />}
                      </button>
                      <button onClick={e => { e.stopPropagation(); updateElement(el.id, { visible: !el.visible }) }}
                        className="p-1 rounded hover:bg-neutral-700 text-neutral-400 hover:text-white">
                        {el.visible ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                      </button>
                    </div>
                  </div>
                )
              })}
              <button onClick={resetElements}
                className="w-full py-1.5 text-[10px] text-neutral-500 hover:text-neutral-300 flex items-center justify-center gap-1 transition-colors">
                <RotateCcw className="w-3 h-3" /> Reset All Positions
              </button>
            </div>
          </Section>

          {/* Add Icons */}
          <Section title="Add Icons" icon={Star} isOpen={openSection === 'icons'} onToggle={() => toggleSection('icons')}>
            {/* Category tabs */}
            <div className="flex gap-1 flex-wrap">
              {ICON_CATEGORIES.map(cat => (
                <button key={cat} onClick={() => setIconCategory(cat)}
                  className={`px-2 py-0.5 rounded-full text-[9px] font-bold transition-colors ${iconCategory === cat ? 'bg-indigo-600 text-white' : 'bg-neutral-800 text-neutral-400 hover:text-white'}`}>
                  {cat}
                </button>
              ))}
            </div>
            <div className="grid grid-cols-5 gap-1.5">
              {DECO_ICONS.filter(d => d.category === iconCategory).map(({ name, icon: Icon, label }) => (
                <button key={name} title={label} onClick={() => addIcon(name)}
                  className="flex flex-col items-center gap-0.5 p-1.5 rounded-lg bg-neutral-800 hover:bg-indigo-900/40 border border-neutral-700 hover:border-indigo-500/40 transition-colors">
                  <Icon className="w-4 h-4 text-neutral-300" />
                  <span className="text-[7px] text-neutral-500">{label}</span>
                </button>
              ))}
            </div>
          </Section>

          {/* Export */}
          <Section title="Export" icon={Download} isOpen={openSection === 'export'} onToggle={() => toggleSection('export')}>
            <div className="space-y-1.5">
              {([
                { fmt: 'png',         label: 'Standard PNG (2×)' },
                { fmt: 'hires',       label: 'High-Res PNG (4×)' },
                { fmt: 'transparent', label: 'Transparent PNG' },
                { fmt: 'pdf',         label: 'Print PDF (3.5×2")' },
              ] as const).map(({ fmt, label }) => (
                <button key={fmt} onClick={() => handleExport(fmt)} disabled={isExporting}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-xs text-neutral-200 font-medium transition-colors disabled:opacity-50">
                  <Download className="w-3.5 h-3.5 text-indigo-400" />
                  {isExporting ? 'Exporting...' : label}
                </button>
              ))}
            </div>
          </Section>
        </div>

        {/* ── Center Canvas ───────────────────────────────────────────── */}
        <div className="flex-1 flex flex-col items-center justify-center overflow-auto p-8 gap-6 relative min-h-0">
          {(() => {
            const ratioStr = '85.6/54'
            const [w, h] = ratioStr.split('/').map(Number)
            const ratioNum = w / h
            return (
              <div className="w-full flex flex-col items-center gap-6 justify-center">
                <div 
                  style={{ 
                    perspective: '1000px', 
                    aspectRatio: ratioStr,
                    width: '100%',
                    maxWidth: `min(600px, calc(65vh * ${ratioNum}))`
                  }} 
                  className="relative shrink-0"
                >
                  <div 
                    className="w-full h-full relative transition-transform duration-700" 
                    style={{ transformStyle: 'preserve-3d', transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)' }}
                  >
                {/* Front Face */}
                <div className="absolute inset-0 w-full h-full" style={{ backfaceVisibility: 'hidden' }}>
                  <div ref={canvasContainerRef} className="w-full h-full" style={{ cursor: draggingId ? 'grabbing' : 'default' }}>
                    <CardCanvas
                      design={design}
                      previewRef={previewRef}
                      showGrid={design.showGrid}
                      isDragging={draggingId}
                      onPointerDown={handlePointerDown}
                      selectedQR={selectedQR}
                      cardId={cardId}
                      selectedEls={selectedEls}
                    />
                  </div>
                </div>
                
                {/* Back Face */}
                <div className="absolute inset-0 w-full h-full" style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}>
                  <CardCanvasBack design={design} previewRef={backPreviewRef} />
                </div>
              </div>
            </div>

            {/* Flip Controls */}
            <button 
              onClick={() => setIsFlipped(!isFlipped)}
              className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-neutral-900 border border-neutral-800 hover:bg-neutral-800 hover:border-neutral-700 text-neutral-400 hover:text-white transition-all text-xs font-medium hover:scale-105 active:scale-95"
            >
              <RefreshCw className={`w-4 h-4 transition-transform duration-700 ${isFlipped ? 'rotate-180' : ''}`} />
              {isFlipped ? 'Show Front Face' : 'Show Back Face'}
            </button>
            
            <p className="text-neutral-700 text-[10px] text-center mt-2">
              Click element to select • Drag to move • 🔒 Lock to prevent accidental moves • Grid won't appear in exports
            </p>
          </div>
            )
          })()}
        </div>

        {/* ── Right Panel (Inspector) ───────────────────────────────────────────── */}
        <div className="w-80 shrink-0 border-l border-neutral-800 bg-[#0A0A10] overflow-y-auto flex flex-col p-5">
          {selectedEls.length > 0 ? (() => {
            const isMulti = selectedEls.length > 1
            const isLogo = !isMulti && selectedEls[0] === 'logo'
            const isNFC = !isMulti && selectedEls[0] === 'nfc'
            
            const selEl = isMulti ? null : (
              isLogo ? { id: 'logo', type: 'logo' } as any :
              isNFC ? { id: 'nfc', type: 'nfc' } as any :
              design.elements.find(e => e.id === selectedEls[0])
            )
            const selElsData = [
              ...design.elements.filter(e => selectedEls.includes(e.id)),
              ...(selectedEls.includes('logo') ? [{ id: 'logo', type: 'logo' } as any] : []),
              ...(selectedEls.includes('nfc') ? [{ id: 'nfc', type: 'nfc' } as any] : []),
            ]
            const allTypes = [...new Set(selElsData.map(e => e.type))]
            
            const areAllText = allTypes.every(t => ['name', 'job', 'company'].includes(t))
            const areAllIcons = allTypes.every(t => ['icon', 'logo', 'nfc', 'qr'].includes(t))
            const hasNoQR = !allTypes.includes('qr') && !allTypes.includes('logo') && !allTypes.includes('nfc')

            return (
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-neutral-800/50">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Palette className="w-4 h-4 text-indigo-400" />
                  {isMulti ? `Multiple (${selectedEls.length})` : <span className="capitalize">{selEl?.iconName || selEl?.type}</span>} Properties
                </h3>
                <div className="flex items-center gap-2">
                  {!allTypes.includes('logo') && !allTypes.includes('nfc') && (
                    <button onClick={() => {
                      setDesign(prev => {
                        const newEls = selElsData.map(el => ({
                          ...el,
                          id: `${el.type}-${Date.now()}-${Math.random()}`,
                          x: Math.min(el.x + 5, 95),
                          y: Math.min(el.y + 5, 90)
                        }))
                        setSelectedEls(newEls.map(e => e.id))
                        return { ...prev, elements: [...prev.elements, ...newEls] }
                      })
                    }}
                      className="p-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-white transition-colors" title="Duplicate">
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                  )}
                  <button onClick={() => setSelectedEls([])} className="text-neutral-500 hover:text-neutral-300">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="space-y-5">
                {/* Content Editing for Text Elements (single selection only for text content) */}
                {!isMulti && selEl && ['name', 'job', 'company'].includes(selEl.type) && (
                  <div>
                    <label className="text-[10px] text-neutral-500 mb-1 block">Content Text</label>
                    <input type="text"
                      value={design[selEl.type === 'name' ? 'cardName' : selEl.type === 'job' ? 'cardJob' : 'cardCompany'] || ''}
                      onChange={e => updateDesign({ [selEl.type === 'name' ? 'cardName' : selEl.type === 'job' ? 'cardJob' : 'cardCompany']: e.target.value })}
                      className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500/50" />
                  </div>
                )}

                {/* QR Code Selection (single selection only) */}
                {!isMulti && selEl?.type === 'qr' && (
                  <div>
                    <label className="text-[10px] text-neutral-500 mb-1 block">Linked QR Code</label>
                    <select value={design.linkedQrId || ''} onChange={e => updateDesign({ linkedQrId: e.target.value })}
                      className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500/50">
                      <option value="">— No QR Code —</option>
                      {qrCodes.map(q => (
                        <option key={q.id} value={q.id}>{q.name || q.url || q.id}</option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Brand Logo & NFC Color Selection */}
                {!isMulti && (isLogo || isNFC) && (
                  <div className="space-y-3">
                    <div className="flex gap-1 bg-neutral-900 rounded-lg p-1">
                      {(['solid', 'gradient'] as const).map(type => {
                        const curType = isLogo ? design.logoColorType : design.nfcColorType
                        return (
                          <button key={type} onClick={() => updateDesign({ [isLogo ? 'logoColorType' : 'nfcColorType']: type })}
                            className={`flex-1 py-1 rounded-md text-[10px] font-semibold capitalize transition-colors ${curType === type || (!curType && type === 'solid') ? 'bg-indigo-600 text-white' : 'text-neutral-400 hover:text-white'}`}>
                            {type}
                          </button>
                        )
                      })}
                    </div>

                    {((isLogo ? design.logoColorType : design.nfcColorType) !== 'gradient') ? (
                      <>
                        <div>
                          <label className="text-[10px] text-neutral-500 mb-1 block">Brand Preset Color</label>
                          <div className="grid grid-cols-2 gap-1.5">
                            {BRAND_COLORS.map(c => {
                              const val = isLogo ? design.logoColor : design.nfcColor
                              const isSelected = (!val && c.id === (isLogo ? 'original' : 'silver')) || val === c.id
                              return (
                                <button
                                  key={`${isLogo ? 'logo' : 'nfc'}-${c.id}`}
                                  onClick={() => updateDesign({ [isLogo ? 'logoColor' : 'nfcColor']: c.id })}
                                  className={`py-1.5 rounded-lg text-[10px] font-semibold border ${isSelected ? 'border-indigo-500 bg-indigo-500/10 text-indigo-400' : 'border-neutral-700 hover:border-neutral-500 text-neutral-400'}`}
                                >
                                  {c.label}
                                </button>
                              )
                            })}
                          </div>
                        </div>
                        <ColorInput 
                          label="Custom Color" 
                          value={(isLogo ? design.logoColor : design.nfcColor) || '#ffffff'} 
                          onChange={v => updateDesign({ [isLogo ? 'logoColor' : 'nfcColor']: v })} 
                        />
                      </>
                    ) : (
                      <>
                        <ColorInput label="Start Color" value={(isLogo ? design.logoGradientStart : design.nfcGradientStart) || '#0C0C0C'} onChange={v => updateDesign({ [isLogo ? 'logoGradientStart' : 'nfcGradientStart']: v })} />
                        <ColorInput label="End Color" value={(isLogo ? design.logoGradientEnd : design.nfcGradientEnd) || '#D4AF37'} onChange={v => updateDesign({ [isLogo ? 'logoGradientEnd' : 'nfcGradientEnd']: v })} />
                        <div className="space-y-1">
                          <span className="text-xs text-neutral-400">Angle</span>
                          <AngleSlider value={(isLogo ? design.logoGradientAngle : design.nfcGradientAngle) ?? 135} onChange={v => updateDesign({ [isLogo ? 'logoGradientAngle' : 'nfcGradientAngle']: v })} />
                        </div>
                      </>
                    )}
                  </div>
                )}

                {/* Custom Text Content */}
                {!isMulti && selEl?.type === 'text' && (
                  <div className="mb-3">
                    <label className="text-[10px] text-neutral-500 mb-1 block">Text Content</label>
                    <input type="text" value={selEl.text || ''}
                      onChange={e => updateSelected({ text: e.target.value })}
                      className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-2 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500/50" />
                  </div>
                )}

                {/* Color */}
                {hasNoQR && (
                  <div>
                    <ColorInput label="Color" value={selEl?.color || selElsData[0]?.color || '#FFFFFF'} onChange={v => updateSelected({ color: v })} />
                  </div>
                )}

                {/* Font Size, Weight, & Family */}
                {areAllText && (
                  <div className="grid grid-cols-2 gap-3">
                    <div className="col-span-2">
                      <label className="text-[10px] text-neutral-500 mb-1 block">Font Family</label>
                      <select value={selEl?.fontFamily || selElsData[0]?.fontFamily || ''} onChange={e => updateSelected({ fontFamily: e.target.value })}
                        className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-2 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500/50"
                        style={{ fontFamily: selEl?.fontFamily || selElsData[0]?.fontFamily || 'inherit' }}
                      >
                        <option value="">Default (Inter)</option>
                        <option value="'Cinzel', serif" style={{ fontFamily: "'Cinzel', serif" }}>Cinzel (Elegant)</option>
                        <option value="'Lora', serif" style={{ fontFamily: "'Lora', serif" }}>Lora (Classic)</option>
                        <option value="'Merriweather', serif" style={{ fontFamily: "'Merriweather', serif" }}>Merriweather (Bold)</option>
                        <option value="'Montserrat', sans-serif" style={{ fontFamily: "'Montserrat', sans-serif" }}>Montserrat (Modern)</option>
                        <option value="'Playfair Display', serif" style={{ fontFamily: "'Playfair Display', serif" }}>Playfair Display (Luxury)</option>
                        <option value="'Oswald', sans-serif" style={{ fontFamily: "'Oswald', sans-serif" }}>Oswald (Condensed)</option>
                        <option value="'Roboto', sans-serif" style={{ fontFamily: "'Roboto', sans-serif" }}>Roboto (Clean)</option>
                        <option value="'Open Sans', sans-serif" style={{ fontFamily: "'Open Sans', sans-serif" }}>Open Sans (Friendly)</option>
                        <option value="'Lato', sans-serif" style={{ fontFamily: "'Lato', sans-serif" }}>Lato (Warm)</option>
                        <option value="'Poppins', sans-serif" style={{ fontFamily: "'Poppins', sans-serif" }}>Poppins (Geometric)</option>
                        <option value="'Raleway', sans-serif" style={{ fontFamily: "'Raleway', sans-serif" }}>Raleway (Elegant)</option>
                        <option value="'Ubuntu', sans-serif" style={{ fontFamily: "'Ubuntu', sans-serif" }}>Ubuntu (Tech)</option>
                        <option value="'Dancing Script', cursive" style={{ fontFamily: "'Dancing Script', cursive" }}>Dancing Script (Handwriting)</option>
                        <option value="'Pacifico', cursive" style={{ fontFamily: "'Pacifico', cursive" }}>Pacifico (Fun)</option>
                        <option value="'Caveat', cursive" style={{ fontFamily: "'Caveat', cursive" }}>Caveat (Casual)</option>
                        <option value="'Satisfy', cursive" style={{ fontFamily: "'Satisfy', cursive" }}>Satisfy (Brush)</option>
                        <option value="'Great Vibes', cursive" style={{ fontFamily: "'Great Vibes', cursive" }}>Great Vibes (Formal Script)</option>
                        <option value="'Righteous', cursive" style={{ fontFamily: "'Righteous', cursive" }}>Righteous (Display)</option>
                        <option value="'Lobster', cursive" style={{ fontFamily: "'Lobster', cursive" }}>Lobster (Retro)</option>
                        <option value="'Bebas Neue', sans-serif" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>Bebas Neue (Impact)</option>
                        <option value="'Anton', sans-serif" style={{ fontFamily: "'Anton', sans-serif" }}>Anton (Bold Display)</option>
                        <option value="'Josefin Sans', sans-serif" style={{ fontFamily: "'Josefin Sans', sans-serif" }}>Josefin Sans (Vintage)</option>
                        <option value="'Titillium Web', sans-serif" style={{ fontFamily: "'Titillium Web', sans-serif" }}>Titillium Web (Square)</option>
                        <option value="'Quicksand', sans-serif" style={{ fontFamily: "'Quicksand', sans-serif" }}>Quicksand (Rounded)</option>
                        <option value="'Inconsolata', monospace" style={{ fontFamily: "'Inconsolata', monospace" }}>Inconsolata (Code)</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[10px] text-neutral-500 mb-1 block">Font Size</label>
                      <select value={selEl?.fontSize || selElsData[0]?.fontSize || 'md'} onChange={e => updateSelected({ fontSize: e.target.value as any })}
                        className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-2 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500/50">
                        {['xs', 'sm', 'md', 'lg', 'xl', '2xl'].map(s => <option key={s} value={s}>{s.toUpperCase()}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="text-[10px] text-neutral-500 mb-1 block">Weight</label>
                      <select value={selEl?.fontWeight || selElsData[0]?.fontWeight || 'bold'} onChange={e => updateSelected({ fontWeight: e.target.value as any })}
                        className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-2 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500/50">
                        {['normal', 'medium', 'semibold', 'bold', 'extrabold'].map(w => <option key={w} value={w}>{w}</option>)}
                      </select>
                    </div>
                  </div>
                )}

                {/* Size, Opacity, Rotation, Position - HIDE for FIXED ELEMENTS */}
                {!isLogo && !isNFC && (
                  <>
                    {/* Size (icons/QR/logo) */}
                    {areAllIcons && (() => {
                      const curSize = selEl?.size || selElsData[0]?.size || 'md'
                      const curIdx = SIZE_STEPS.indexOf(curSize)
                      return (
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <label className="text-[10px] text-neutral-500">Size</label>
                            <span className="text-[10px] font-bold text-indigo-400">{(curSize || 'md').toUpperCase()}</span>
                          </div>
                          <input type="range" min={0} max={4} step={1} value={curIdx < 0 ? 2 : curIdx}
                            onChange={e => updateSelected({ size: SIZE_STEPS[Number(e.target.value)] as CardCanvasElement['size'] })}
                            className="w-full h-1.5 rounded-full accent-indigo-500" />
                          <div className="flex justify-between mt-1">
                            {SIZE_STEPS.map(s => <span key={s} className="text-[8px] text-neutral-600">{s.toUpperCase()}</span>)}
                          </div>
                        </div>
                      )
                    })()}

                    {/* Sliders: Opacity & Rotation */}
                    <div className="space-y-4">
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className="text-[10px] text-neutral-500">Opacity</label>
                          <span className="text-[10px] text-neutral-400">{Math.round(((selEl?.opacity ?? selElsData[0]?.opacity) ?? 1) * 100)}%</span>
                        </div>
                        <input type="range" min={0.1} max={1} step={0.05} value={(selEl?.opacity ?? selElsData[0]?.opacity) ?? 1}
                          onChange={e => updateSelected({ opacity: Number(e.target.value) })}
                          className="w-full h-1 rounded-full accent-indigo-500" />
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className="text-[10px] text-neutral-500">Rotation</label>
                          <span className="text-[10px] text-neutral-400">{selEl?.rotation ?? selElsData[0]?.rotation ?? 0}°</span>
                        </div>
                        <input type="range" min={-180} max={180} step={1} value={selEl?.rotation ?? selElsData[0]?.rotation ?? 0}
                          onChange={e => updateSelected({ rotation: Number(e.target.value) })}
                          className="w-full h-1 rounded-full accent-indigo-500" />
                      </div>
                    </div>

                    {/* Position */}
                    {!isMulti && selEl && (
                      <div className="grid grid-cols-2 gap-3 pt-2 border-t border-neutral-800/50">
                        <div>
                          <label className="text-[10px] text-neutral-500 mb-1 block">X Position (%)</label>
                          <input type="number" min={0} max={95} value={Math.round(selEl.x)}
                            onChange={e => updateSelected({ x: Math.min(Math.max(Number(e.target.value), 0), 95) })}
                            className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-2 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500/50" />
                        </div>
                        <div>
                          <label className="text-[10px] text-neutral-500 mb-1 block">Y Position (%)</label>
                          <input type="number" min={0} max={90} value={Math.round(selEl.y)}
                            onChange={e => updateSelected({ y: Math.min(Math.max(Number(e.target.value), 0), 90) })}
                            className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-2 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500/50" />
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>

              {(isMulti || selEl?.type === 'icon') && (
                <button onClick={() => {
                  setDesign(prev => ({ ...prev, elements: prev.elements.filter(el => !selectedEls.includes(el.id)) }))
                  setSelectedEls([])
                }}
                  className="w-full mt-2 flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-red-900/10 border border-red-900/20 hover:bg-red-900/30 text-red-400 text-xs font-medium transition-colors">
                  <Trash2 className="w-3.5 h-3.5" /> Remove {isMulti ? 'Selected' : 'Icon'}
                </button>
              )}
            </div>
          );})() : (
            <div className="flex-1 flex flex-col items-center justify-center text-center opacity-50">
              <div className="w-12 h-12 rounded-2xl bg-neutral-800 flex items-center justify-center mb-4">
                <Layers className="w-5 h-5 text-neutral-400" />
              </div>
              <p className="text-sm font-medium text-white mb-1">No Element Selected</p>
              <p className="text-xs text-neutral-400 max-w-[200px]">Click on any element on the card to edit its properties. Hold Shift/Ctrl to multi-select.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
