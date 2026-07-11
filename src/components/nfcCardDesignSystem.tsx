import { useRef, useState, type ReactNode } from 'react'
import { Wifi } from 'lucide-react'
import { CARD_SIZES } from '@/types/nfc'

// ─── Types ──────────────────────────────────────────────────────────────

export interface NFCTemplate {
  id: string
  name: string
  bg: string
  border?: string
  shadow?: string
  glow?: string
  nameClr: string
  jobClr: string
  coClr: string
  logoClr: string
  qrFg: string
  qrBg: string
  qrFrame?: ReactNode
  renderDeco: (side?: 'front' | 'back') => ReactNode
}

// ─── Constants & Helpers ────────────────────────────────────────────────

const V = '0 0 400 240'

function S({ children, className = '', style }: { children?: ReactNode; className?: string; style?: React.CSSProperties }) {
  return <div className={`absolute inset-0 pointer-events-none ${className}`} style={style}>{children}</div>
}

// ─── SVG Pattern Library ────────────────────────────────────────────────

export function HexGrid({ color, opacity = 0.05 }: { color: string; opacity?: number }) {
  const s = 24, h = s * 0.866
  const rows = Math.ceil(280 / h) + 1, cols = Math.ceil(440 / (s * 1.5)) + 1
  const hexes: string[] = []
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const cx = c * s * 1.5, cy = r * h + (c % 2 ? h / 2 : 0)
      const pts = Array.from({ length: 6 }, (_, i) => {
        const a = Math.PI / 3 * i - Math.PI / 6
        return `${cx + s * 0.45 * Math.cos(a)},${cy + s * 0.45 * Math.sin(a)}`
      }).join(' ')
      hexes.push(`<polygon points="${pts}" fill="none" stroke="${color}" stroke-width="0.4"/>`)
    }
  }
  return (
    <S style={{ opacity }}>
      <svg className="absolute inset-0 w-full h-full" viewBox={V} preserveAspectRatio="none" dangerouslySetInnerHTML={{ __html: hexes.join('') }} />
    </S>
  )
}

export function CircuitBoard({ color, opacity = 0.06 }: { color: string; opacity?: number }) {
  return (
    <S style={{ opacity }}>
      <svg className="absolute inset-0 w-full h-full" viewBox={V}>
        <line x1="30" y1="40" x2="120" y2="40" stroke={color} strokeWidth="0.6" />
        <line x1="120" y1="40" x2="120" y2="100" stroke={color} strokeWidth="0.6" />
        <line x1="120" y1="100" x2="200" y2="100" stroke={color} strokeWidth="0.6" />
        <line x1="200" y1="100" x2="200" y2="180" stroke={color} strokeWidth="0.4" />
        <line x1="280" y1="30" x2="280" y2="90" stroke={color} strokeWidth="0.6" />
        <line x1="280" y1="90" x2="370" y2="90" stroke={color} strokeWidth="0.6" />
        <line x1="350" y1="160" x2="350" y2="210" stroke={color} strokeWidth="0.4" />
        <line x1="60" y1="170" x2="160" y2="170" stroke={color} strokeWidth="0.4" />
        <line x1="160" y1="170" x2="160" y2="220" stroke={color} strokeWidth="0.4" />
        <line x1="230" y1="50" x2="230" y2="140" stroke={color} strokeWidth="0.3" />
        <line x1="230" y1="140" x2="310" y2="140" stroke={color} strokeWidth="0.3" />
        <rect x="26" y="36" width="8" height="8" rx="1" fill="none" stroke={color} strokeWidth="0.5" />
        <rect x="116" y="96" width="8" height="8" rx="1" fill="none" stroke={color} strokeWidth="0.5" />
        <rect x="196" y="176" width="8" height="8" rx="1" fill="none" stroke={color} strokeWidth="0.5" />
        <rect x="276" y="86" width="8" height="8" rx="1" fill="none" stroke={color} strokeWidth="0.5" />
        <rect x="346" y="156" width="8" height="8" rx="1" fill="none" stroke={color} strokeWidth="0.5" />
        <rect x="56" y="166" width="8" height="8" rx="1" fill="none" stroke={color} strokeWidth="0.5" />
        <rect x="226" y="136" width="8" height="8" rx="1" fill="none" stroke={color} strokeWidth="0.4" />
        <circle cx="30" cy="40" r="2" fill={color} />
        <circle cx="120" cy="40" r="2" fill={color} />
        <circle cx="200" cy="100" r="2" fill={color} />
        <circle cx="280" cy="30" r="2" fill={color} />
        <circle cx="370" cy="90" r="2" fill={color} />
        <circle cx="350" cy="210" r="2" fill={color} />
        <circle cx="60" cy="170" r="2" fill={color} />
        <circle cx="160" cy="220" r="2" fill={color} />
        <circle cx="310" cy="140" r="2" fill={color} />
        <line x1="30" y1="40" x2="30" y2="120" stroke={color} strokeWidth="0.3" strokeDasharray="2 4" />
        <line x1="370" y1="90" x2="370" y2="180" stroke={color} strokeWidth="0.3" strokeDasharray="2 4" />
      </svg>
    </S>
  )
}

export function NetworkNodes({ color, opacity = 0.05 }: { color: string; opacity?: number }) {
  const nodes = [
    [60, 50], [180, 30], [320, 60], [400, 140], [100, 180],
    [250, 200], [380, 40], [140, 110], [300, 160], [50, 220],
    [220, 70], [360, 200],
  ]
  const edges = [[0,1],[1,2],[2,3],[0,7],[7,1],[7,4],[4,5],[5,3],[8,5],[8,3],[9,4],[10,1],[10,2],[11,3],[11,5],[6,2]]
  return (
    <S style={{ opacity }}>
      <svg className="absolute inset-0 w-full h-full" viewBox={V}>
        {edges.map(([a, b], i) => (
          <line key={i} x1={nodes[a][0]} y1={nodes[a][1]} x2={nodes[b][0]} y2={nodes[b][1]} stroke={color} strokeWidth="0.4" />
        ))}
        {nodes.map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r="2.5" fill={color} />
        ))}
      </svg>
    </S>
  )
}

export function DotMatrix({ color, opacity = 0.04, size = 18 }: { color: string; opacity?: number; size?: number }) {
  return (
    <S style={{ opacity, backgroundImage: `radial-gradient(circle, ${color} 0.8px, transparent 0.8px)`, backgroundSize: `${size}px ${size}px` }} />
  )
}

export function Constellation({ color, opacity = 0.06 }: { color: string; opacity?: number }) {
  const stars = [
    [50, 40], [130, 70], [200, 25], [310, 55], [380, 80],
    [70, 160], [180, 140], [280, 170], [350, 190], [120, 210],
    [250, 220], [400, 130], [10, 100], [160, 200], [330, 120],
  ]
  const lines = [[0,1],[1,2],[2,3],[3,4],[5,6],[6,7],[7,8],[9,10],[10,8],[0,5],[12,6],[13,9],[14,3],[14,8],[11,4]]
  return (
    <S style={{ opacity }}>
      <svg className="absolute inset-0 w-full h-full" viewBox={V}>
        {lines.map(([a, b], i) => (
          <line key={`l${i}`} x1={stars[a][0]} y1={stars[a][1]} x2={stars[b][0]} y2={stars[b][1]} stroke={color} strokeWidth="0.3" />
        ))}
        {stars.map(([x, y], i) => (
          <circle key={`s${i}`} cx={x} cy={y} r="1.5" fill={color} />
        ))}
      </svg>
    </S>
  )
}

export function TopoLines({ color, opacity = 0.04 }: { color: string; opacity?: number }) {
  return (
    <S style={{ opacity }}>
      <svg className="absolute inset-0 w-full h-full" viewBox={V}>
        <path d="M0 180 Q80 140 160 160 Q240 180 320 150 Q380 130 400 140" fill="none" stroke={color} strokeWidth="0.5" />
        <path d="M0 150 Q100 110 200 130 Q280 150 360 120 Q400 110 400 115" fill="none" stroke={color} strokeWidth="0.4" />
        <path d="M0 120 Q120 80 220 100 Q300 120 380 90 Q400 85 400 88" fill="none" stroke={color} strokeWidth="0.4" />
        <path d="M0 90 Q140 55 240 70 Q320 90 400 65" fill="none" stroke={color} strokeWidth="0.3" />
        <path d="M0 60 Q160 30 260 45 Q340 60 400 40" fill="none" stroke={color} strokeWidth="0.3" />
        <path d="M0 200 Q60 185 140 195 Q220 205 300 188 Q370 178 400 182" fill="none" stroke={color} strokeWidth="0.5" />
        <path d="M0 230 Q80 218 180 225 Q280 232 380 215 L400 212" fill="none" stroke={color} strokeWidth="0.4" />
      </svg>
    </S>
  )
}

export function DiagonalLines({ color, opacity = 0.05, angle = 45, gap = 16 }: { color: string; opacity?: number; angle?: number; gap?: number }) {
  const lines: string[] = []
  const diag = Math.sqrt(400 * 400 + 240 * 240)
  const count = Math.ceil(diag / gap) + 2
  for (let i = -count; i <= count; i++) {
    const offset = i * gap
    lines.push(`<line x1="${offset}" y1="0" x2="${offset + 240 * Math.tan((90 - angle) * Math.PI / 180)}" y2="240" stroke="${color}" stroke-width="0.35"/>`)
  }
  return (
    <S style={{ opacity }}>
      <svg className="absolute inset-0 w-full h-full" viewBox={V} dangerouslySetInnerHTML={{ __html: lines.join('') }} />
    </S>
  )
}

export function WaveLines({ color, opacity = 0.05 }: { color: string; opacity?: number }) {
  return (
    <S style={{ opacity }}>
      <svg className="absolute inset-0 w-full h-full" viewBox={V}>
        <path d="M-20 120 C60 60 140 180 220 100 C300 20 380 140 420 80" fill="none" stroke={color} strokeWidth="0.6" />
        <path d="M-20 160 C60 100 140 220 220 140 C300 60 380 180 420 120" fill="none" stroke={color} strokeWidth="0.4" />
        <path d="M-20 200 C60 140 140 260 220 180 C300 100 380 220 420 160" fill="none" stroke={color} strokeWidth="0.3" />
        <path d="M-20 80 C60 20 140 140 220 60 C300 -20 380 100 420 40" fill="none" stroke={color} strokeWidth="0.4" />
      </svg>
    </S>
  )
}

export function DiamondLattice({ color, opacity = 0.04 }: { color: string; opacity?: number }) {
  return (
    <S style={{ opacity }}>
      <svg className="absolute inset-0 w-full h-full" viewBox={V}>
        {Array.from({ length: 8 }, (_, r) =>
          Array.from({ length: 10 }, (_, c) => {
            const x = c * 45 + (r % 2 ? 22 : 0) - 20
            const y = r * 35 - 10
            return (
              <polygon key={`${r}-${c}`} points={`${x},${y - 12} ${x + 10},${y} ${x},${y + 12} ${x - 10},${y}`} fill="none" stroke={color} strokeWidth="0.3" />
            )
          })
        )}
      </svg>
    </S>
  )
}

export function TechIcons({ color, opacity = 0.03 }: { color: string; opacity?: number }) {
  return (
    <S style={{ opacity }}>
      <svg className="absolute inset-0 w-full h-full" viewBox={V}>
        <rect x="30" y="25" width="18" height="18" rx="3" fill="none" stroke={color} strokeWidth="0.6" />
        <path d="M36 38v-6l4 3-4 3z" fill={color} />
        <circle cx="120" cy="55" r="8" fill="none" stroke={color} strokeWidth="0.6" />
        <path d="M117 55h6M120 52v6" stroke={color} strokeWidth="0.4" />
        <path d="M250 30l-6 4v8l6 4 6-4v-8z" fill="none" stroke={color} strokeWidth="0.6" />
        <path d="M244 34l6-4 6 4M244 42l6 4 6-4" stroke={color} strokeWidth="0.3" />
        <circle cx="350" cy="200" r="8" fill="none" stroke={color} strokeWidth="0.6" />
        <path d="M346 200c0-2.2 1.8-4 4-4s4 1.8 4 4" fill="none" stroke={color} strokeWidth="0.4" />
        <path d="M343 200h14M350 193v14" stroke={color} strokeWidth="0.3" />
        <path d="M60 180h16v12H60z" fill="none" stroke={color} strokeWidth="0.5" rx="2" />
        <path d="M64 184h8M64 187h6" stroke={color} strokeWidth="0.3" />
        <rect x="310" y="100" width="14" height="14" rx="2" fill="none" stroke={color} strokeWidth="0.5" />
        <path d="M314 105l3 3 4-5" fill="none" stroke={color} strokeWidth="0.4" />
        <circle cx="180" cy="210" r="6" fill="none" stroke={color} strokeWidth="0.5" />
        <path d="M177 207l3 3 3-3M177 213l3-3 3 3" fill="none" stroke={color} strokeWidth="0.3" />
      </svg>
    </S>
  )
}

export function ParametricCurves({ color, opacity = 0.05 }: { color: string; opacity?: number }) {
  return (
    <S style={{ opacity }}>
      <svg className="absolute inset-0 w-full h-full" viewBox={V}>
        <path d="M-10 200 Q100 80 200 160 Q300 240 410 60" fill="none" stroke={color} strokeWidth="0.5" />
        <path d="M-10 170 Q120 50 220 130 Q320 210 410 30" fill="none" stroke={color} strokeWidth="0.4" />
        <path d="M-10 230 Q80 110 180 190 Q280 270 410 90" fill="none" stroke={color} strokeWidth="0.3" />
        <path d="M50 -10 Q150 100 250 50 Q350 0 420 120" fill="none" stroke={color} strokeWidth="0.35" />
        <path d="M80 -10 Q180 80 280 30 Q380 -20 420 80" fill="none" stroke={color} strokeWidth="0.25" />
      </svg>
    </S>
  )
}

export function PolygonMesh({ color, opacity = 0.04 }: { color: string; opacity?: number }) {
  const pts: [number, number][] = []
  for (let r = 0; r < 7; r++) {
    for (let c = 0; c < 10; c++) {
      pts.push([c * 44 + (r % 2 ? 22 : 0) + Math.sin(r * 0.7 + c * 0.3) * 5, r * 40 + Math.cos(r * 0.5 + c * 0.8) * 5])
    }
  }
  const tris: string[] = []
  for (let r = 0; r < 6; r++) {
    for (let c = 0; c < 9; c++) {
      const i = r * 10 + c
      const j = i + 1
      const k = i + 10
      const l = k + 1
      if (pts[k] && pts[l]) {
        tris.push(`<polygon points="${pts[i].join(',')} ${pts[j].join(',')} ${pts[k].join(',')}" fill="none" stroke="${color}" stroke-width="0.3"/>`)
        tris.push(`<polygon points="${pts[j].join(',')} ${pts[l].join(',')} ${pts[k].join(',')}" fill="none" stroke="${color}" stroke-width="0.3"/>`)
      }
    }
  }
  return (
    <S style={{ opacity }}>
      <svg className="absolute inset-0 w-full h-full" viewBox={V} dangerouslySetInnerHTML={{ __html: tris.join('') }} />
    </S>
  )
}

export function NoiseSVG({ opacity = 0.03, id = 'nfc-noise' }: { opacity?: number; id?: string }) {
  return (
    <S style={{ opacity }}>
      <svg className="absolute inset-0 w-full h-full">
        <filter id={id}><feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" /></filter>
        <rect width="100%" height="100%" filter={`url(#${id})`} opacity="0.5" />
      </svg>
    </S>
  )
}

// ─── Texture Library ────────────────────────────────────────────────────

export const TEXTURES = {
  carbonFiber: (c = 'rgba(255,255,255,0.04)') =>
    `repeating-linear-gradient(45deg, transparent, transparent 2px, ${c} 2px, ${c} 3px), repeating-linear-gradient(-45deg, transparent, transparent 2px, ${c} 2px, ${c} 3px)`,

  brushedAluminum: (c = 'rgba(255,255,255,0.06)') =>
    `repeating-linear-gradient(90deg, transparent, transparent 1px, ${c} 1px, ${c} 2px)`,

  titanium: () =>
    `repeating-linear-gradient(100deg, transparent, transparent 1px, rgba(255,255,255,0.04) 1px, rgba(255,255,255,0.04) 2px), repeating-linear-gradient(80deg, transparent, transparent 2px, rgba(0,0,0,0.02) 2px, rgba(0,0,0,0.02) 3px)`,

  matteBlack: () =>
    `radial-gradient(ellipse at 30% 20%, rgba(255,255,255,0.02) 0%, transparent 50%), radial-gradient(ellipse at 70% 80%, rgba(255,255,255,0.01) 0%, transparent 50%)`,

  leatherGrain: (c = 'rgba(255,255,255,0.02)') =>
    `radial-gradient(ellipse at 20% 50%, ${c} 0%, transparent 50%), radial-gradient(ellipse at 80% 50%, ${c} 0%, transparent 50%), radial-gradient(ellipse at 50% 20%, ${c} 0%, transparent 50%), radial-gradient(ellipse at 50% 80%, ${c} 0%, transparent 50%)`,

  marble: () =>
    `linear-gradient(125deg, rgba(180,170,155,0.08) 0%, transparent 40%), linear-gradient(245deg, rgba(160,150,135,0.06) 0%, transparent 35%), linear-gradient(0deg, rgba(170,160,145,0.04) 0%, transparent 50%)`,

  stitching: (c: string) =>
    `repeating-linear-gradient(0deg, transparent, transparent 6px, ${c} 6px, ${c} 7px, transparent 7px, transparent 13px)`,

  graphite: () =>
    `repeating-linear-gradient(135deg, transparent, transparent 1px, rgba(255,255,255,0.015) 1px, rgba(255,255,255,0.015) 2px), repeating-linear-gradient(45deg, transparent, transparent 2px, rgba(0,0,0,0.02) 2px, rgba(0,0,0,0.02) 3px)`,

  softFabric: () =>
    `repeating-linear-gradient(0deg, transparent, transparent 1px, rgba(255,255,255,0.01) 1px, rgba(255,255,255,0.01) 2px), repeating-linear-gradient(90deg, transparent, transparent 1px, rgba(255,255,255,0.01) 1px, rgba(255,255,255,0.01) 2px)`,

  metallic: (c = 'rgba(255,255,255,0.08)') =>
    `linear-gradient(135deg, ${c} 0%, transparent 30%, ${c} 50%, transparent 70%, ${c} 100%)`,
}

// ─── QR Frame Library ───────────────────────────────────────────────────

export function QrGoldBrackets({ color = '#c9a84c', inset = 0 }: { color?: string; inset?: number }) {
  const s = 10, b = 1.5
  return (
    <svg className="absolute inset-0 w-full h-full" viewBox="0 0 48 48" style={{ margin: `-${inset}px`, width: `calc(100% + ${inset * 2}px)`, height: `calc(100% + ${inset * 2}px)` }}>
      <path d={`M2,${s + 2} L2,2 L${s + 2},2`} fill="none" stroke={color} strokeWidth={b} strokeLinecap="round" />
      <path d={`M${48 - s - 2},2 L46,2 L46,${s + 2}`} fill="none" stroke={color} strokeWidth={b} strokeLinecap="round" />
      <path d={`M2,${48 - s - 2} L2,46 L${s + 2},46`} fill="none" stroke={color} strokeWidth={b} strokeLinecap="round" />
      <path d={`M${48 - s - 2},46 L46,46 L46,${48 - s - 2}`} fill="none" stroke={color} strokeWidth={b} strokeLinecap="round" />
    </svg>
  )
}

export function QrSilverFrame({ color = '#a0a0a8' }: { color?: string }) {
  return (
    <svg className="absolute inset-0 w-full h-full" viewBox="0 0 48 48">
      <rect x="1" y="1" width="46" height="46" rx="3" fill="none" stroke={color} strokeWidth="0.8" opacity="0.5" />
    </svg>
  )
}

export function QrCyberFrame({ color = '#00c8ff' }: { color?: string }) {
  const s = 8, b = 1.5
  return (
    <svg className="absolute inset-0 w-full h-full" viewBox="0 0 48 48">
      <path d={`M2,${s + 2} L2,2 L${s + 2},2`} fill="none" stroke={color} strokeWidth={b} />
      <path d={`M${48 - s - 2},2 L46,2 L46,${s + 2}`} fill="none" stroke={color} strokeWidth={b} />
      <path d={`M2,${48 - s - 2} L2,46 L${s + 2},46`} fill="none" stroke={color} strokeWidth={b} />
      <path d={`M${48 - s - 2},46 L46,46 L46,${48 - s - 2}`} fill="none" stroke={color} strokeWidth={b} />
      <line x1="12" y1="2" x2="36" y2="2" stroke={color} strokeWidth="0.3" opacity="0.4" />
      <line x1="12" y1="46" x2="36" y2="46" stroke={color} strokeWidth="0.3" opacity="0.4" />
      <line x1="2" y1="12" x2="2" y2="36" stroke={color} strokeWidth="0.3" opacity="0.4" />
      <line x1="46" y1="12" x2="46" y2="36" stroke={color} strokeWidth="0.3" opacity="0.4" />
    </svg>
  )
}

export function QrFrostedFrame({ color = 'rgba(255,255,255,0.2)' }: { color?: string }) {
  return (
    <div className="absolute -inset-1 rounded-lg" style={{ border: `1px solid ${color}`, backdropFilter: 'blur(2px)' }} />
  )
}

export function QrMinimalDark({ color = 'rgba(255,255,255,0.08)' }: { color?: string }) {
  return (
    <svg className="absolute inset-0 w-full h-full" viewBox="0 0 48 48">
      <rect x="0.5" y="0.5" width="47" height="47" rx="2" fill="none" stroke={color} strokeWidth="0.5" />
    </svg>
  )
}

export function QrPurpleGlow({ color = '#9b72cf' }: { color?: string }) {
  const s = 8, b = 1.5
  return (
    <svg className="absolute inset-0 w-full h-full" viewBox="0 0 48 48">
      <rect x="0" y="0" width="48" height="48" rx="4" fill="none" stroke={color} strokeWidth="0.5" opacity="0.3" />
      <path d={`M2,${s + 2} L2,2 L${s + 2},2`} fill="none" stroke={color} strokeWidth={b} />
      <path d={`M${48 - s - 2},2 L46,2 L46,${s + 2}`} fill="none" stroke={color} strokeWidth={b} />
      <path d={`M2,${48 - s - 2} L2,46 L${s + 2},46`} fill="none" stroke={color} strokeWidth={b} />
      <path d={`M${48 - s - 2},46 L46,46 L46,${48 - s - 2}`} fill="none" stroke={color} strokeWidth={b} />
    </svg>
  )
}

// ─── Border / Decoration Library ────────────────────────────────────────

export function GoldFrame({ color = '#c9a84c', opacity = 0.35 }: { color?: string; opacity?: number }) {
  const a = Math.round(opacity * 255).toString(16).padStart(2, '0')
  return (
    <>
      <div className="absolute top-0 left-0 w-14 h-[1px]" style={{ background: `linear-gradient(to right, ${color}${a}, transparent)` }} />
      <div className="absolute top-0 left-0 w-[1px] h-14" style={{ background: `linear-gradient(to bottom, ${color}${a}, transparent)` }} />
      <div className="absolute bottom-0 right-0 w-14 h-[1px]" style={{ background: `linear-gradient(to left, ${color}${a}, transparent)` }} />
      <div className="absolute bottom-0 right-0 w-[1px] h-14" style={{ background: `linear-gradient(to top, ${color}${a}, transparent)` }} />
    </>
  )
}

export function InnerBorder({ color = 'rgba(255,255,255,0.04)', radius = 12, inset = 4 }: { color?: string; radius?: number; inset?: number }) {
  return <div className={`absolute pointer-events-none`} style={{ inset, borderRadius: radius, border: `1px solid ${color}` }} />
}

// ─── PremiumCard (Hover Wrapper) ────────────────────────────────────────

export function PremiumCard({ children, className = '' }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const [tilt, setTilt] = useState({ x: 0, y: 0, hovering: false })

  const onMove = (e: React.MouseEvent) => {
    if (!ref.current) return
    const r = ref.current.getBoundingClientRect()
    setTilt({
      x: ((e.clientY - r.top) / r.height - 0.5) * -8,
      y: ((e.clientX - r.left) / r.width - 0.5) * 8,
      hovering: true,
    })
  }
  const onLeave = () => setTilt({ x: 0, y: 0, hovering: false })

  return (
    <div
      ref={ref}
      className={`group relative ${className}`}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{
        transform: `perspective(800px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) ${tilt.hovering ? 'scale3d(1.02,1.02,1.02)' : 'scale3d(1,1,1)'}`,
        transition: tilt.hovering
          ? 'transform 0.15s ease-out, box-shadow 0.25s ease'
          : 'transform 0.4s cubic-bezier(0.23, 1, 0.32, 1), box-shadow 0.4s ease',
        boxShadow: tilt.hovering
          ? '0 20px 60px -12px rgba(0,0,0,0.25), 0 8px 24px -8px rgba(0,0,0,0.15)'
          : '0 4px 16px -4px rgba(0,0,0,0.1)',
      }}
    >
      {children}
      <div className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(105deg, transparent 35%, rgba(255,255,255,0.06) 42%, rgba(255,255,255,0.12) 50%, rgba(255,255,255,0.06) 58%, transparent 65%)',
            animation: 'nfc-shine-sweep 0.8s ease forwards',
          }}
        />
      </div>
    </div>
  )
}
// ─── CardLayout (Full-Size Preview) ─────────────────────────────────────

const LOGO_PNG = '/linkora-logo.png'

export function CardLayout({
  template, name, job, company, qrUrl, side = 'front', previewRef,
}: {
  template: NFCTemplate; name: string; job: string; company: string; qrUrl: string; side?: 'front' | 'back'; previewRef?: React.Ref<HTMLDivElement>
}) {
  const displayName = name || 'John Smith'
  const displayJob = job || 'Chief Executive Officer'
  const displayCompany = company || 'Linkora Inc.'

  const getTagline = () => {
    switch (template.id) {
      case 'gold-swoosh':
      case 'silver-swoosh':
        return 'ONE LINK. LIMITLESS POSSIBILITIES.'
      case 'matte-pattern':
        return 'TAP. CONNECT. ANYWHERE.'
      case 'geometric-gold':
        return 'PREMIUM NFC CARD'
      case 'minimal-black':
        return 'CONNECT YOUR WORLD.'
      case 'minimal-white':
      default:
        return 'SIMPLE. SMART. CONNECTED.'
    }
  }

  // NFC icon in top right
  const nfcBadge = (size: 'sm' | 'md' = 'md') => (
    <div className="flex flex-col items-center gap-1">
      <Wifi
        className={size === 'sm' ? 'w-6 h-6 rotate-90' : 'w-10 h-10 rotate-90'}
        style={{ color: template.logoClr }}
      />
      <span
        className={size === 'sm' ? 'text-[9px] font-bold tracking-widest' : 'text-[11px] font-bold tracking-widest'}
        style={{ color: template.logoClr }}
      >
        NFC
      </span>
    </div>
  )

  return (
    <div
      ref={previewRef}
      className="relative w-full aspect-[7/4] rounded-2xl overflow-hidden select-none flex flex-col justify-between p-5 sm:p-6"
      style={{
        background: template.bg,
        border: template.border,
        boxShadow: template.shadow,
        fontFamily: "'Manrope', system-ui, -apple-system, sans-serif",
      }}
    >
      {template.renderDeco(side)}
      {template.glow && <div className="absolute inset-0 pointer-events-none rounded-2xl" style={{ boxShadow: template.glow }} />}

      {/* ── FRONT SIDE: personal info + QR (matches image "back" row) ── */}
      {side === 'front' ? (
        <>
          {/* Top row: Logo small + tagline left, NFC right */}
          <div className="relative z-10 flex items-start justify-between">
            <div className="flex items-center gap-2">
              <img
                src={LOGO_PNG}
                alt="Linkora"
                className="w-8 h-8 object-contain"
                style={{ filter: template.id === 'minimal-white' ? 'invert(1)' : 'none' }}
              />
              <div className="flex flex-col leading-tight">
                <span
                  className="text-[10px] font-extrabold tracking-[0.25em]"
                  style={{ color: template.nameClr }}
                >
                  LINKORA
                </span>
                <span
                  className="text-[5px] font-medium tracking-[0.06em] uppercase opacity-70"
                  style={{ color: template.jobClr }}
                >
                  {getTagline()}
                </span>
              </div>
            </div>
            {nfcBadge('sm')}
          </div>

          {/* Bottom Area: Large Name block left & Large QR right */}
          <div className="relative z-10 flex items-end justify-between gap-4 h-full pt-4">
            {/* Left side: Name and Title */}
            <div className="flex-1 min-w-0 flex flex-col justify-end pb-1">
              <h4
                className="text-xl sm:text-2xl font-bold leading-none mb-1.5"
                style={{ color: template.nameClr }}
              >
                {displayName}
              </h4>
              <p
                className="text-[10px] sm:text-xs font-medium opacity-90 truncate"
                style={{ color: template.jobClr }}
              >
                {displayJob}
              </p>
              <p
                className="text-[9px] sm:text-[10px] font-semibold opacity-70 uppercase tracking-wider truncate mt-0.5"
                style={{ color: template.jobClr }}
              >
                {displayCompany}
              </p>
            </div>

            {/* Right side: Large QR Code */}
            {qrUrl ? (
              <div
                className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden shrink-0 flex items-center justify-center p-1"
                style={{ background: template.qrBg, border: `1px solid ${template.qrFg}30`, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
              >
                <img src={qrUrl} alt="QR" className="w-full h-full object-contain rounded-lg" crossOrigin="anonymous" />
                {template.qrFrame && (
                  <div className="absolute inset-0 pointer-events-none">
                    {template.qrFrame}
                  </div>
                )}
              </div>
            ) : (
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl border border-white/10 bg-white/5 flex items-center justify-center shrink-0">
                <Wifi className="w-6 h-6 opacity-20 animate-pulse" style={{ color: template.logoClr }} />
              </div>
            )}
          </div>
        </>
      ) : (
        /* ── BACK SIDE: center branding only (matches image "front" row) ── */
        <>
          {/* NFC badge: top right */}
          <div className="absolute top-5 right-6 z-20">
            {nfcBadge('md')}
          </div>

          {/* Center logo + wordmark */}
          <div className="absolute inset-0 flex flex-col items-center justify-center z-10 gap-2">
            <img
              src={LOGO_PNG}
              alt="Linkora"
              className="w-16 h-16 object-contain"
              style={{ filter: template.id === 'minimal-white' ? 'invert(1)' : 'none' }}
            />
            <div className="flex flex-col items-center gap-1.5 text-center">
              <span
                className="text-base font-extrabold tracking-[0.4em] ml-[0.4em]"
                style={{ color: template.nameClr }}
              >
                LINKORA
              </span>
              <span
                className="text-[6px] font-bold tracking-[0.12em] uppercase opacity-80"
                style={{ color: template.jobClr }}
              >
                {getTagline()}
              </span>
              {(template.id === 'minimal-black' || template.id === 'minimal-white') && (
                <div className="w-5 h-[1px] mt-0.5" style={{ backgroundColor: template.id === 'minimal-black' ? '#555' : '#AAA' }} />
              )}
            </div>
          </div>
        </>
      )}
    </div>
  )
}

// ─── CardThumb (Gallery Thumbnail) ──────────────────────────────────────

export function CardThumb({ template, cardSize }: { template: NFCTemplate, cardSize?: string }) {
  const ratio = cardSize ? CARD_SIZES.find(s => s.id === cardSize)?.ratio : '85.6/54'
  return (
    <div
      className="w-full rounded-xl overflow-hidden relative flex flex-col justify-between p-2.5"
      style={{ background: template.bg, border: template.border, aspectRatio: ratio || '85.6/54' }}
    >
      {template.renderDeco('back')}

      {/* NFC indicator top-right */}
      <div className="absolute top-2 right-2.5 flex flex-col items-center gap-0.5">
        <Wifi className="w-4 h-4 rotate-90" style={{ color: template.logoClr }} />
        <span className="text-[6px] font-bold tracking-widest leading-none animate-pulse" style={{ color: template.logoClr }}>NFC</span>
      </div>

      {/* Center: logo + name */}
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-1">
        <img
          src={LOGO_PNG}
          alt="Linkora"
          className="w-6 h-6 object-contain"
          style={{ filter: template.id === 'minimal-white' ? 'invert(1)' : 'none' }}
        />
        <p
          className="text-[5px] font-extrabold tracking-[0.25em] uppercase ml-[0.25em]"
          style={{ color: template.nameClr }}
        >
          LINKORA
        </p>
      </div>
    </div>
  )
}
