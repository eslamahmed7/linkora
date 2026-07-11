import type { NFCTemplate } from './nfcCardDesignSystem'
import { NoiseSVG } from './nfcCardDesignSystem'

// ─── Shared QR Frames ───────────────────────────────────────────────────

function QrLuxuryGold() {
  return (
    <svg className="absolute inset-0 w-full h-full" viewBox="0 0 80 80">
      {/* Outer glow ring */}
      <rect x="0.5" y="0.5" width="79" height="79" rx="6" fill="none" stroke="rgba(212,175,55,0.15)" strokeWidth="1" />
      {/* Corner brackets */}
      <path d="M2,14 L2,2 L14,2" fill="none" stroke="#D4AF37" strokeWidth="2" strokeLinecap="round" />
      <path d="M66,2 L78,2 L78,14" fill="none" stroke="#D4AF37" strokeWidth="2" strokeLinecap="round" />
      <path d="M2,66 L2,78 L14,78" fill="none" stroke="#D4AF37" strokeWidth="2" strokeLinecap="round" />
      <path d="M66,78 L78,78 L78,66" fill="none" stroke="#D4AF37" strokeWidth="2" strokeLinecap="round" />
      {/* Inner accent dots */}
      <circle cx="2" cy="2" r="1.5" fill="#D4AF37" opacity="0.6" />
      <circle cx="78" cy="2" r="1.5" fill="#D4AF37" opacity="0.6" />
      <circle cx="2" cy="78" r="1.5" fill="#D4AF37" opacity="0.6" />
      <circle cx="78" cy="78" r="1.5" fill="#D4AF37" opacity="0.6" />
    </svg>
  )
}

function QrBrushedSilver() {
  return (
    <svg className="absolute inset-0 w-full h-full" viewBox="0 0 80 80">
      <rect x="0.5" y="0.5" width="79" height="79" rx="5" fill="none" stroke="rgba(180,180,185,0.4)" strokeWidth="1" />
      <path d="M2,12 L2,2 L12,2" fill="none" stroke="#A8A8B0" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M68,2 L78,2 L78,12" fill="none" stroke="#A8A8B0" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M2,68 L2,78 L12,78" fill="none" stroke="#A8A8B0" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M68,78 L78,78 L78,68" fill="none" stroke="#A8A8B0" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

function QrTitaniumFrame() {
  return (
    <svg className="absolute inset-0 w-full h-full" viewBox="0 0 80 80">
      <rect x="1" y="1" width="78" height="78" rx="4" fill="none" stroke="rgba(100,120,140,0.3)" strokeWidth="0.8" />
      <path d="M1,16 L1,1 L16,1" fill="none" stroke="#6E8299" strokeWidth="1.8" strokeLinecap="square" />
      <path d="M64,1 L79,1 L79,16" fill="none" stroke="#6E8299" strokeWidth="1.8" strokeLinecap="square" />
      <path d="M1,64 L1,79 L16,79" fill="none" stroke="#6E8299" strokeWidth="1.8" strokeLinecap="square" />
      <path d="M64,79 L79,79 L79,64" fill="none" stroke="#6E8299" strokeWidth="1.8" strokeLinecap="square" />
      {/* Diagonal tick marks */}
      <line x1="20" y1="1" x2="22" y2="1" stroke="#6E8299" strokeWidth="0.6" opacity="0.4" />
      <line x1="58" y1="1" x2="60" y2="1" stroke="#6E8299" strokeWidth="0.6" opacity="0.4" />
    </svg>
  )
}

function QrMarbleFrame() {
  return (
    <svg className="absolute inset-0 w-full h-full" viewBox="0 0 80 80">
      <rect x="0.5" y="0.5" width="79" height="79" rx="3" fill="none" stroke="rgba(120,100,80,0.3)" strokeWidth="0.8" />
      <rect x="2" y="2" width="76" height="76" rx="2" fill="none" stroke="rgba(180,160,130,0.2)" strokeWidth="0.5" />
      <path d="M2,10 L2,2 L10,2" fill="none" stroke="#B09070" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M70,2 L78,2 L78,10" fill="none" stroke="#B09070" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M2,70 L2,78 L10,78" fill="none" stroke="#B09070" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M70,78 L78,78 L78,70" fill="none" stroke="#B09070" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}


function QrCarbonFrame() {
  return (
    <svg className="absolute inset-0 w-full h-full" viewBox="0 0 80 80">
      <rect x="0.5" y="0.5" width="79" height="79" rx="3" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
      <path d="M2,14 L2,2 L14,2" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M66,2 L78,2 L78,14" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M2,66 L2,78 L14,78" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M66,78 L78,78 L78,66" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

// ─── Premium Decoration Components ──────────────────────────────────────

// Diamond Edition Deco
function DiamondEditionDeco() {
  return (
    <>
      <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-2xl">
        <NoiseSVG opacity={0.03} id="diamond-noise" />
        <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 400 240" preserveAspectRatio="none">
          <defs>
            <linearGradient id="facet1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="rgba(255,255,255,0.8)" />
              <stop offset="100%" stopColor="rgba(255,255,255,0)" />
            </linearGradient>
            <linearGradient id="facet2" x1="100%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="rgba(200,210,255,0.4)" />
              <stop offset="100%" stopColor="rgba(255,255,255,0)" />
            </linearGradient>
            <linearGradient id="facet3" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="rgba(255,200,220,0.3)" />
              <stop offset="100%" stopColor="rgba(255,255,255,0)" />
            </linearGradient>
          </defs>
          <polygon points="0,0 200,80 0,240" fill="url(#facet1)" opacity="0.6" />
          <polygon points="400,0 200,80 400,240" fill="url(#facet2)" opacity="0.7" />
          <polygon points="0,240 200,80 400,240" fill="url(#facet3)" opacity="0.6" />
          <polygon points="0,0 400,0 200,80" fill="rgba(255,255,255,0.9)" opacity="0.5" />
          
          <line x1="0" y1="0" x2="200" y2="80" stroke="rgba(255,255,255,0.8)" strokeWidth="1" />
          <line x1="400" y1="0" x2="200" y2="80" stroke="rgba(255,255,255,0.8)" strokeWidth="1" />
          <line x1="0" y1="240" x2="200" y2="80" stroke="rgba(255,255,255,0.6)" strokeWidth="1" />
          <line x1="400" y1="240" x2="200" y2="80" stroke="rgba(255,255,255,0.6)" strokeWidth="1" />
        </svg>
        <div className="absolute inset-0 rounded-2xl" style={{ boxShadow: 'inset 0 0 1px 1px rgba(255,255,255,1), inset 0 0 30px 0 rgba(255,255,255,0.6)' }} />
      </div>
    </>
  )
}

// Premium Simple Silver Foil Deco
function SilverEditionDeco() {
  return (
    <>
      <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-2xl" style={{
        background: 'linear-gradient(135deg, #F5F5F7 0%, #C0C0C8 50%, #7A7A85 100%)',
      }}>
        <NoiseSVG opacity={0.04} id="silver-noise" />
        <div className="absolute inset-0 rounded-2xl" style={{ boxShadow: 'inset 0 0 1px 1px rgba(255,255,255,0.5), inset 0 0 20px 0 rgba(122,122,133,0.3)' }} />
      </div>
    </>
  )
}



// 60% Obsidian Black, 30% Ancient Gold wash, 10% warm amber highlights
// Luxury Dark Carbon + Sweeping Gold Curves
function GeometricGoldDeco() {
  return (
    <>
      <div className="absolute inset-0 rounded-2xl" style={{ backgroundColor: '#050505' }} />
      {/* Carbon fiber pattern background */}
      <div className="absolute inset-0 pointer-events-none rounded-2xl opacity-40" style={{
        backgroundImage: `repeating-linear-gradient(45deg, #1a1a1a 0, #1a1a1a 2px, transparent 2px, transparent 4px), repeating-linear-gradient(-45deg, #1a1a1a 0, #1a1a1a 2px, transparent 2px, transparent 4px)`,
        backgroundSize: '8px 8px'
      }} />
      <NoiseSVG opacity={0.03} id="luxury-noise" />

      {/* Sweeping gold curves and glowing edges */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none rounded-2xl" viewBox="0 0 400 240" preserveAspectRatio="none">
        <defs>
          <linearGradient id="gold-sweep" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#D4AF37" />
            <stop offset="40%" stopColor="#FFF2A8" />
            <stop offset="100%" stopColor="#8C6211" />
          </linearGradient>
          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
          <radialGradient id="top-glow" cx="0%" cy="0%" r="50%">
            <stop offset="0%" stopColor="#D4AF37" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#D4AF37" stopOpacity="0" />
          </radialGradient>
        </defs>

        <rect width="100%" height="100%" fill="url(#top-glow)" />

        {/* Top left curves */}
        <path d="M -50 120 Q 100 80 250 -50" fill="none" stroke="url(#gold-sweep)" strokeWidth="1.5" />
        <path d="M -50 140 Q 150 90 300 -50" fill="none" stroke="url(#gold-sweep)" strokeWidth="0.5" opacity="0.6" />
        
        {/* Bottom right curves */}
        <path d="M 150 290 Q 300 160 450 80" fill="none" stroke="url(#gold-sweep)" strokeWidth="2" filter="url(#glow)" />
        <path d="M 150 290 Q 300 160 450 80" fill="none" stroke="#FFF2A8" strokeWidth="0.8" />
        <path d="M 100 290 Q 250 180 400 50" fill="none" stroke="url(#gold-sweep)" strokeWidth="0.5" opacity="0.6" />

        {/* Solid dark panels filling the outside of the curves to give depth */}
        <path d="M 150 290 Q 300 160 450 80 L 450 290 Z" fill="#000000" opacity="0.6" />
        <path d="M -50 120 Q 100 80 250 -50 L -50 -50 Z" fill="#000000" opacity="0.4" />

        {/* Halftone / Stippled dots using dashed strokes */}
        <path d="M 170 290 Q 310 170 450 100" fill="none" stroke="#D4AF37" strokeWidth="2" strokeDasharray="1 8" strokeLinecap="round" opacity="0.8" />
        <path d="M 190 290 Q 320 180 450 120" fill="none" stroke="#D4AF37" strokeWidth="1.5" strokeDasharray="1 12" strokeLinecap="round" opacity="0.6" />
        <path d="M 210 290 Q 330 190 450 140" fill="none" stroke="#D4AF37" strokeWidth="1" strokeDasharray="1 16" strokeLinecap="round" opacity="0.4" />

        {/* Light flare on the bottom curve */}
        <ellipse cx="320" cy="148" rx="30" ry="2" fill="#FFF2A8" transform="rotate(-30 320 148)" filter="url(#glow)" opacity="0.8" />
      </svg>
    </>
  )
}


// 60% Midnight Graphite, 30% Cool Steel, 10% platinum micro-accents
function StealthBlackDeco({ side }: { side?: 'front' | 'back' }) {
  return (
    <>
      {/* Graphite texture */}
      <div className="absolute inset-0 pointer-events-none" style={{
        backgroundImage: 'repeating-linear-gradient(100deg, transparent, transparent 1px, rgba(255,255,255,0.008) 1px, rgba(255,255,255,0.008) 2px), repeating-linear-gradient(80deg, transparent, transparent 2px, rgba(0,0,0,0.015) 2px, rgba(0,0,0,0.015) 3px)',
      }} />
      <NoiseSVG opacity={0.025} id="stealth-noise" />

      {/* 30% cool steel blend */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl">
        {/* Steel wash from top-right */}
        <div style={{
          position: 'absolute',
          top: '-20%', right: '-10%',
          width: '70%', height: '90%',
          borderRadius: '40% 60% 50% 50% / 55% 45% 55% 45%',
          background: 'radial-gradient(ellipse at 65% 30%, rgba(130,140,155,0.15) 0%, rgba(90,100,115,0.07) 50%, transparent 80%)',
          filter: 'blur(18px)',
        }} />
        {/* Steel bottom-left */}
        <div style={{
          position: 'absolute',
          bottom: '-15%', left: '-5%',
          width: '60%', height: '70%',
          borderRadius: '50% 50% 40% 60%',
          background: 'radial-gradient(ellipse at 30% 70%, rgba(100,110,125,0.12) 0%, transparent 70%)',
          filter: 'blur(22px)',
        }} />
        {/* Directional light sweep */}
        <div style={{
          position: 'absolute',
          top: 0, left: 0, right: 0,
          height: '1px',
          background: 'linear-gradient(to right, transparent 5%, rgba(180,185,195,0.35) 30%, rgba(200,205,215,0.45) 50%, rgba(180,185,195,0.35) 70%, transparent 95%)',
        }} />
      </div>

      {/* 10% platinum corner accents */}
      <div className="absolute bottom-0 right-0 pointer-events-none overflow-hidden" style={{ width: '40%', height: '50%' }}>
        <svg className="w-full h-full" viewBox="0 0 160 120" fill="none">
          <path d="M160,40 A120,80 0 0,0 40,120" stroke="rgba(210,215,225,0.08)" strokeWidth="1" />
          <path d="M160,60 A100,60 0 0,0 60,120" stroke="rgba(210,215,225,0.06)" strokeWidth="0.7" />
          <path d="M160,80 A80,40 0 0,0 80,120" stroke="rgba(210,215,225,0.04)" strokeWidth="0.5" />
          <path d="M160,100 A60,20 0 0,0 100,120" stroke="rgba(210,215,225,0.03)" strokeWidth="0.4" />
        </svg>
      </div>

      {side === 'back' && (
        <>
          <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 400 240" style={{ opacity: 0.07 }}>
            <path d="M0 120 Q100 60 200 120 Q300 180 400 120" fill="none" stroke="#B0B8C8" strokeWidth="1.5" />
            <path d="M0 140 Q100 80 200 140 Q300 200 400 140" fill="none" stroke="#B0B8C8" strokeWidth="1" />
            <path d="M0 100 Q100 40 200 100 Q300 160 400 100" fill="none" stroke="#B0B8C8" strokeWidth="0.8" />
          </svg>
          <div style={{
            position: 'absolute', top: '15%', left: '10%',
            width: '80%', height: '70%',
            borderRadius: '50%',
            background: 'radial-gradient(ellipse at 50% 50%, rgba(130,140,155,0.08) 0%, transparent 70%)',
            filter: 'blur(30px)',
            pointerEvents: 'none',
          }} />
        </>
      )}
    </>
  )
}



// ─── Template Definitions ────────────────────────────────────────────────

export const TEMPLATES: NFCTemplate[] = [
  // 0. Blank Start from Scratch
  {
    id: 'blank-custom',
    name: 'Start from Scratch',
    bg: '#1A1A1A',
    border: '1px solid rgba(255,255,255,0.1)',
    shadow: '0 10px 40px rgba(0,0,0,0.3)',
    glow: 'none',
    nameClr: '#FFFFFF',
    jobClr: '#AAAAAA',
    coClr: '#FFFFFF',
    logoClr: '#FFFFFF',
    qrFg: '#FFFFFF',
    qrBg: 'transparent',
    qrFrame: <></>,
    renderDeco: () => <></>,
  },

  // 1. Diamond Edition — Replaces Platinum
  {
    id: 'diamond-edition',
    name: 'Diamond Edition',
    bg: 'linear-gradient(135deg, #F0F2F5 0%, #D8DCE5 50%, #B8BDCA 100%)',
    border: '1px solid rgba(255,255,255,0.9)',
    shadow: '0 20px 60px rgba(0,0,0,0.15), 0 4px 20px rgba(0,0,0,0.05)',
    glow: 'inset 0 1px 0 rgba(255,255,255,1)',
    nameClr: '#2A2A35',
    jobClr: '#666675',
    coClr: '#2A2A35',
    logoClr: '#111115',
    qrFg: '#111115',
    qrBg: 'linear-gradient(135deg, #FFFFFF, #EBECEF)',
    qrFrame: <QrBrushedSilver />,
    renderDeco: () => <DiamondEditionDeco />,
  },

  // 2. Premium Silver Edition — Brushed Platinum + Deep Charcoal
  {
    id: 'silver-swoosh',
    name: 'Premium Silver Edition',
    bg: 'linear-gradient(150deg, #D8D8DC 0%, #C0C0C4 35%, #B0B0B5 65%, #A8A8AE 100%)',
    border: '1px solid rgba(255,255,255,0.45)',
    shadow: '0 20px 60px rgba(0,0,0,0.25), 0 2px 8px rgba(0,0,0,0.12)',
    glow: 'inset 0 1px 0 rgba(255,255,255,0.7), inset 0 -1px 0 rgba(0,0,0,0.08)',
    nameClr: '#1A1A20',
    jobClr: '#484850',
    coClr: '#1A1A20',
    logoClr: '#282830',
    qrFg: '#282830',
    qrBg: 'linear-gradient(135deg, #D5D5D8, #C5C5CA)',
    qrFrame: <QrBrushedSilver />,
    renderDeco: () => <SilverEditionDeco />,
  },

  // 3. Matte Black Edition
  {
    id: 'matte-pattern',
    name: 'Matte Black Edition',
    bg: 'url(/matte-black-bg.png) center / cover no-repeat',
    border: '1px solid rgba(255,255,255,0.06)',
    shadow: '0 20px 60px rgba(0,0,0,0.8), 0 4px 16px rgba(0,0,0,0.6)',
    glow: 'inset 0 1px 0 rgba(255,255,255,0.06)',
    nameClr: '#E8E8E8',
    jobClr: '#828282',
    coClr: '#E8E8E8',
    logoClr: '#C0C0C0',
    qrFg: '#C0C0C0',
    qrBg: 'linear-gradient(135deg, #1C1C1C, #161616)',
    qrFrame: <QrCarbonFrame />,
    renderDeco: () => <></>,
  },

  // 4. Luxury Dark Carbon Edition
  {
    id: 'geometric-gold',
    name: 'Luxury Dark Carbon Edition',
    bg: '#050505',
    border: '1px solid rgba(199,154,70,0.25)',
    shadow: '0 20px 60px rgba(0,0,0,0.9), 0 4px 20px rgba(199,154,70,0.05)',
    glow: 'inset 0 1px 0 rgba(199,154,70,0.15), inset 0 -1px 0 rgba(0,0,0,0.8)',
    nameClr: '#D4A843',
    jobClr: '#8C6E2A',
    coClr: '#D4A843',
    logoClr: '#C79A46',
    qrFg: '#C79A46',
    qrBg: 'linear-gradient(135deg, #0C0A04, #100D06)',
    qrFrame: <QrLuxuryGold />,
    renderDeco: () => <GeometricGoldDeco />,
  },

  // 5. Stealth Black Edition — Midnight Graphite + Cool Steel
  {
    id: 'minimal-black',
    name: 'Stealth Black Edition',
    bg: 'linear-gradient(150deg, #161618 0%, #1A1A1D 45%, #141416 80%, #111113 100%)',
    border: '1px solid rgba(160,165,175,0.08)',
    shadow: '0 20px 60px rgba(0,0,0,0.7), 0 4px 16px rgba(0,0,0,0.5)',
    glow: 'inset 0 1px 0 rgba(200,205,215,0.06)',
    nameClr: '#D8DADF',
    jobClr: '#6E7078',
    coClr: '#D8DADF',
    logoClr: '#9EA3AE',
    qrFg: '#9EA3AE',
    qrBg: 'linear-gradient(135deg, #1D1D20, #181820)',
    qrFrame: <QrTitaniumFrame />,
    renderDeco: (side) => <StealthBlackDeco side={side} />,
  },

  // 6. Minimal White Edition — Ivory + Warm Cream + Pearl
  {
    id: 'minimal-white',
    name: 'Minimal White Edition',
    bg: 'url(/white-minimal-bg.png) center / cover no-repeat',
    border: '1px solid rgba(200,195,188,0.6)',
    shadow: '0 20px 60px rgba(0,0,0,0.10), 0 4px 16px rgba(0,0,0,0.06)',
    glow: 'inset 0 1px 0 rgba(255,255,255,0.9), inset 0 -1px 0 rgba(180,175,168,0.1)',
    nameClr: '#141210',
    jobClr: '#5C5850',
    coClr: '#141210',
    logoClr: '#2A2622',
    qrFg: '#2A2622',
    qrBg: 'linear-gradient(135deg, #FFFFFF, #F5F3F0)',
    qrFrame: <QrMarbleFrame />,
    renderDeco: () => <></>,
  },
]
