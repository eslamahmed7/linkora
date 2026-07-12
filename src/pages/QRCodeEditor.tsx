import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { qrAPI } from '@/api/qr';
import { useNotification } from '@/hooks/useNotification';
import { QRGenerator } from '@/components/QRGenerator';
import { formatQRData } from '@/utils/qrDataFormatters';
import { pagesAPI } from '@/api/pages';
import { 
  Save, ArrowLeft, Type, Palette, Settings2, LayoutTemplate, 
  Link as LinkIcon, Wifi, FileText, Phone, Mail, MessageSquare, Globe, MapPin, Upload, Layout
} from 'lucide-react';
import type { QRCode, CreateQRRequest, QRCustomization } from '@/types/qr';

const getTabs = (t: (key: string) => string) => [
  { id: 'content', label: t('qrEditor.tabs.content'), icon: Type },
  { id: 'design', label: t('qrEditor.tabs.design'), icon: Settings2 },
  { id: 'colors', label: t('qrEditor.tabs.branding'), icon: Palette },
  { id: 'frame', label: t('qrEditor.tabs.frame'), icon: LayoutTemplate },
  { id: 'presets', label: t('qrEditor.tabs.presets'), icon: LayoutTemplate },
];

const getPresets = (t: (key: string) => string) => [
  {
    name: t('qrEditor.presets.classicBlack'),
    customization: { dotStyle: 'square', eyeFrameStyle: 'square', eyeBallStyle: 'square', gradientEnabled: false, bgGradientEnabled: false, textGradientEnabled: false, frameStyle: 'none', foregroundColor: '#000000', backgroundColor: '#ffffff', backgroundImageUrl: '' }
  },
  {
    name: t('qrEditor.presets.oceanBreeze'),
    customization: { dotStyle: 'dots', eyeFrameStyle: 'leaf', eyeBallStyle: 'circle', gradientEnabled: true, gradientType: 'linear', gradientRotation: 45, gradientScale: 50, bgGradientEnabled: false, textGradientEnabled: false, foregroundColor: '#00d2ff', foregroundColor2: '#3a7bd5', backgroundColor: '#ffffff', frameStyle: 'none', backgroundImageUrl: '' }
  },
  {
    name: t('qrEditor.presets.neonNight'),
    customization: { dotStyle: 'fluid', eyeFrameStyle: 'hexagon', eyeBallStyle: 'hexagon', gradientEnabled: true, gradientType: 'linear', gradientRotation: 135, bgGradientEnabled: false, textGradientEnabled: false, foregroundColor: '#ff00ff', foregroundColor2: '#00ffff', backgroundColor: '#111111', frameStyle: 'neon', frameColor: '#00ffff', frameTextColor: '#00ffff', backgroundImageUrl: '', frameTextPosition: 'bottom' }
  },
  {
    name: t('qrEditor.presets.polaroidMemory'),
    customization: { dotStyle: 'rounded', eyeFrameStyle: 'rounded', eyeBallStyle: 'rounded', gradientEnabled: false, bgGradientEnabled: false, textGradientEnabled: false, foregroundColor: '#333333', backgroundColor: '#fdfdfd', frameStyle: 'polaroid', frameText: 'SCAN ME', frameFontFamily: 'cursive', backgroundImageUrl: '', frameTextPosition: 'bottom' }
  },
  {
    name: t('qrEditor.presets.browserWeb'),
    customization: { dotStyle: 'square', eyeFrameStyle: 'circle', eyeBallStyle: 'circle', gradientEnabled: false, bgGradientEnabled: false, textGradientEnabled: false, foregroundColor: '#2b2b2b', backgroundColor: '#ffffff', frameStyle: 'browser', frameColor: '#e0e0e0', frameText: 'linkora.app', frameFontFamily: 'sans-serif', backgroundImageUrl: '', frameTextPosition: 'top' }
  },
  {
    name: t('qrEditor.presets.sunsetGlow'),
    customization: { dotStyle: 'rounded', eyeFrameStyle: 'rounded', eyeBallStyle: 'rounded', gradientEnabled: true, gradientType: 'radial', gradientScale: 60, bgGradientEnabled: false, textGradientEnabled: false, foregroundColor: '#ff512f', foregroundColor2: '#f09819', backgroundColor: '#ffffff', frameStyle: 'bubble', frameColor: '#ff512f', frameTextColor: '#ffffff', backgroundImageUrl: '', frameTextPosition: 'bottom' }
  },
  {
    name: t('qrEditor.presets.cyberpunk2077'),
    customization: { dotStyle: 'classy', eyeFrameStyle: 'octagon', eyeBallStyle: 'cross', gradientEnabled: true, gradientType: 'linear', gradientRotation: 90, bgGradientEnabled: true, bgGradientType: 'linear', bgGradientRotation: 0, textGradientEnabled: true, textGradientType: 'linear', textGradientRotation: 90, foregroundColor: '#fcee0a', foregroundColor2: '#00ff00', backgroundColor: '#111111', backgroundColor2: '#330033', frameStyle: 'cyberpunk', frameColor: '#fcee0a', frameTextColor: '#fcee0a', frameTextColor2: '#00ffff', frameFontFamily: 'Impact, fantasy', frameTextPosition: 'bottom' }
  },
  {
    name: t('qrEditor.presets.glacierBlue'),
    customization: { dotStyle: 'fluid', eyeFrameStyle: 'circle', eyeBallStyle: 'circle', gradientEnabled: true, gradientType: 'linear', gradientRotation: 45, bgGradientEnabled: true, bgGradientType: 'radial', bgGradientScale: 80, backgroundColor: '#4facfe', backgroundColor2: '#00f2fe', textGradientEnabled: false, foregroundColor: '#ffffff', foregroundColor2: '#e0e0e0', frameStyle: 'shadow', frameColor: '#ffffff', frameTextColor: '#4facfe', backgroundImageUrl: '', frameTextPosition: 'bottom' }
  },
  {
    name: t('qrEditor.presets.luxuryGold'),
    customization: { dotStyle: 'diamond', eyeFrameStyle: 'diamond', eyeBallStyle: 'diamond', gradientEnabled: true, gradientType: 'radial', gradientScale: 75, bgGradientEnabled: true, bgGradientType: 'radial', bgGradientScale: 100, textGradientEnabled: true, textGradientType: 'linear', textGradientRotation: 45, foregroundColor: '#c5b358', foregroundColor2: '#fdf5a9', backgroundColor: '#1a1a1a', backgroundColor2: '#000000', frameStyle: 'solid', frameColor: '#1a1a1a', frameTextColor: '#c5b358', frameTextColor2: '#fdf5a9', frameFontFamily: 'serif', frameTextPosition: 'left' }
  },
  {
    name: t('qrEditor.presets.mapLocation'),
    customization: { dotStyle: 'classy', eyeFrameStyle: 'octagon', eyeBallStyle: 'star', gradientEnabled: true, gradientType: 'linear', gradientRotation: -45, bgGradientEnabled: false, textGradientEnabled: false, foregroundColor: '#4285F4', foregroundColor2: '#34A853', backgroundColor: '#ffffff', frameStyle: 'shadow', frameColor: '#ffffff', frameTextColor: '#333333', backgroundImageUrl: '', frameTextPosition: 'bottom' }
  },
  {
    name: t('qrEditor.presets.cosmicPurple'),
    customization: { dotStyle: 'star', eyeFrameStyle: 'star', eyeBallStyle: 'star', gradientEnabled: true, gradientType: 'linear', gradientRotation: 180, bgGradientEnabled: true, bgGradientType: 'radial', bgGradientScale: 120, foregroundColor: '#ff00cc', foregroundColor2: '#333399', backgroundColor: '#0f0c29', backgroundColor2: '#302b63', frameStyle: 'glowing', frameColor: '#302b63', frameTextColor: '#ff00cc', textGradientEnabled: true, textGradientType: 'linear', textGradientRotation: 0, frameTextColor2: '#333399', frameFontFamily: 'sans-serif', frameTextPosition: 'top' }
  },
  {
    name: t('qrEditor.presets.mintFresh'),
    customization: { dotStyle: 'rounded', eyeFrameStyle: 'leaf', eyeBallStyle: 'leaf', gradientEnabled: true, gradientType: 'linear', gradientRotation: 90, foregroundColor: '#00b09b', foregroundColor2: '#96c93d', bgGradientEnabled: false, backgroundColor: '#f0fff4', frameStyle: 'bubble', frameColor: '#00b09b', frameTextColor: '#ffffff', textGradientEnabled: false, frameTextPosition: 'bottom' }
  },
  {
    name: t('qrEditor.presets.retroArcade'),
    customization: { dotStyle: 'square', eyeFrameStyle: 'square', eyeBallStyle: 'square', gradientEnabled: false, foregroundColor: '#39ff14', backgroundColor: '#000000', frameStyle: 'retro', frameColor: '#000000', frameTextColor: '#39ff14', textGradientEnabled: false, frameFontFamily: "'Courier New', monospace", frameTextPosition: 'right' }
  },
  {
    name: t('qrEditor.presets.fireAndIce'),
    customization: { dotStyle: 'fluid', eyeFrameStyle: 'hexagon', eyeBallStyle: 'circle', gradientEnabled: true, gradientType: 'linear', gradientRotation: 45, foregroundColor: '#ff4b2b', foregroundColor2: '#ff416c', bgGradientEnabled: true, bgGradientType: 'linear', bgGradientRotation: -45, backgroundColor: '#2193b0', backgroundColor2: '#6dd5ed', frameStyle: 'shadow', frameColor: '#ffffff', frameTextColor: '#ff416c', textGradientEnabled: false, frameTextPosition: 'bottom' }
  },
  {
    name: t('qrEditor.presets.darkElegance'),
    customization: { dotStyle: 'classy', eyeFrameStyle: 'diamond', eyeBallStyle: 'diamond', gradientEnabled: true, gradientType: 'radial', gradientScale: 60, foregroundColor: '#ece9e6', foregroundColor2: '#ffffff', bgGradientEnabled: true, bgGradientType: 'linear', bgGradientRotation: 0, backgroundColor: '#141E30', backgroundColor2: '#243B55', frameStyle: 'minimal', frameColor: '#ffffff', frameTextColor: '#ffffff', textGradientEnabled: false, frameFontFamily: "'Times New Roman', serif", frameTextPosition: 'bottom' }
  },
  {
    name: t('qrEditor.presets.strawberryMilk'),
    customization: { dotStyle: 'heart', eyeFrameStyle: 'circle', eyeBallStyle: 'heart', gradientEnabled: true, gradientType: 'linear', gradientRotation: 135, foregroundColor: '#ff0844', foregroundColor2: '#ffb199', bgGradientEnabled: false, backgroundColor: '#fff0f5', frameStyle: 'badge', frameColor: '#ff0844', frameTextColor: '#ffffff', textGradientEnabled: false, frameFontFamily: "'Comic Sans MS', cursive", frameTextPosition: 'top' }
  },
  {
    name: t('qrEditor.presets.deepSea'),
    customization: { dotStyle: 'fluid', eyeFrameStyle: 'rounded', eyeBallStyle: 'circle', gradientEnabled: true, gradientType: 'linear', gradientRotation: 180, foregroundColor: '#43c6ac', foregroundColor2: '#191654', bgGradientEnabled: false, backgroundColor: '#f0f8ff', frameStyle: 'solid', frameColor: '#191654', frameTextColor: '#43c6ac', textGradientEnabled: false, frameTextPosition: 'left' }
  },
  {
    name: t('qrEditor.presets.forestCanopy'),
    customization: { dotStyle: 'leaf', eyeFrameStyle: 'leaf', eyeBallStyle: 'leaf', gradientEnabled: true, gradientType: 'radial', gradientScale: 80, foregroundColor: '#134e5e', foregroundColor2: '#71b280', bgGradientEnabled: false, backgroundColor: '#f5f7fa', frameStyle: 'border', frameColor: '#134e5e', frameTextColor: '#134e5e', textGradientEnabled: false, frameTextPosition: 'bottom' }
  },
  {
    name: t('qrEditor.presets.sunsetBoulevard'),
    customization: { dotStyle: 'cross', eyeFrameStyle: 'octagon', eyeBallStyle: 'cross', gradientEnabled: true, gradientType: 'linear', gradientRotation: 90, foregroundColor: '#cc2b5e', foregroundColor2: '#753a88', bgGradientEnabled: false, backgroundColor: '#ffffff', frameStyle: 'ticket', frameColor: '#753a88', frameTextColor: '#ffffff', textGradientEnabled: false, frameFontFamily: "'Trebuchet MS', sans-serif", frameTextPosition: 'bottom' }
  },
  {
    name: t('qrEditor.presets.holographic'),
    customization: { dotStyle: 'dots', eyeFrameStyle: 'circle', eyeBallStyle: 'circle', gradientEnabled: true, gradientType: 'linear', gradientRotation: 45, foregroundColor: '#00dbde', foregroundColor2: '#fc00ff', bgGradientEnabled: true, bgGradientType: 'linear', bgGradientRotation: 135, backgroundColor: '#f3e7e9', backgroundColor2: '#e3eeff', frameStyle: 'shadow', frameColor: '#ffffff', frameTextColor: '#fc00ff', textGradientEnabled: true, textGradientType: 'linear', textGradientRotation: 90, frameTextColor2: '#00dbde', frameTextPosition: 'bottom' }
  },
  {
    name: t('qrEditor.presets.midnightExpress'),
    customization: { dotStyle: 'square', eyeFrameStyle: 'square', eyeBallStyle: 'square', gradientEnabled: false, foregroundColor: '#ffffff', bgGradientEnabled: false, backgroundColor: '#000000', frameStyle: 'solid', frameColor: '#000000', frameTextColor: '#ffffff', textGradientEnabled: false, frameFontFamily: 'Impact, fantasy', frameTextPosition: 'right' }
  },
  {
    name: t('qrEditor.presets.cherryBlossom'),
    customization: { dotStyle: 'rounded', eyeFrameStyle: 'circle', eyeBallStyle: 'circle', gradientEnabled: true, gradientType: 'radial', gradientScale: 60, foregroundColor: '#f77062', foregroundColor2: '#fe5196', bgGradientEnabled: false, backgroundColor: '#ffffff', frameStyle: 'bubble', frameColor: '#fe5196', frameTextColor: '#ffffff', textGradientEnabled: false, frameTextPosition: 'bottom' }
  },
  {
    name: t('qrEditor.presets.goldenRatio'),
    customization: { dotStyle: 'classy', eyeFrameStyle: 'hexagon', eyeBallStyle: 'hexagon', gradientEnabled: true, gradientType: 'linear', gradientRotation: 135, foregroundColor: '#bf953f', foregroundColor2: '#fcf6ba', bgGradientEnabled: false, backgroundColor: '#2b2b2b', frameStyle: 'vintage', frameColor: '#bf953f', frameTextColor: '#fcf6ba', textGradientEnabled: false, frameFontFamily: "'Times New Roman', serif", frameTextPosition: 'bottom' }
  },
  {
    name: t('qrEditor.presets.iceCrystal'),
    customization: { dotStyle: 'diamond', eyeFrameStyle: 'diamond', eyeBallStyle: 'diamond', gradientEnabled: true, gradientType: 'linear', gradientRotation: 90, foregroundColor: '#89f7fe', foregroundColor2: '#66a6ff', bgGradientEnabled: true, bgGradientType: 'radial', bgGradientScale: 90, backgroundColor: '#e0c3fc', backgroundColor2: '#8ec5fc', frameStyle: 'shadow', frameColor: '#ffffff', frameTextColor: '#66a6ff', textGradientEnabled: false, frameTextPosition: 'bottom' }
  },
  {
    name: t('qrEditor.presets.toxicSlime'),
    customization: { dotStyle: 'fluid', eyeFrameStyle: 'rounded', eyeBallStyle: 'rounded', gradientEnabled: true, gradientType: 'linear', gradientRotation: 0, foregroundColor: '#000000', foregroundColor2: '#43a047', bgGradientEnabled: true, bgGradientType: 'linear', bgGradientRotation: 180, backgroundColor: '#a8ff78', backgroundColor2: '#78ffd6', frameStyle: 'neon', frameColor: '#a8ff78', frameTextColor: '#000000', textGradientEnabled: false, frameFontFamily: "'Comic Sans MS', cursive", frameTextPosition: 'left' }
  },
  {
    name: t('qrEditor.presets.royalFlush'),
    customization: { dotStyle: 'heart', eyeFrameStyle: 'shield', eyeBallStyle: 'star', gradientEnabled: true, gradientType: 'radial', gradientScale: 50, foregroundColor: '#e52d27', foregroundColor2: '#b31217', bgGradientEnabled: false, backgroundColor: '#ffffff', frameStyle: 'solid', frameColor: '#b31217', frameTextColor: '#fcf6ba', textGradientEnabled: false, frameFontFamily: "serif", frameTextPosition: 'bottom' }
  },
  {
    name: t('qrEditor.presets.spaceInvader'),
    customization: { dotStyle: 'square', eyeFrameStyle: 'square', eyeBallStyle: 'square', gradientEnabled: true, gradientType: 'linear', gradientRotation: 180, foregroundColor: '#fc00ff', foregroundColor2: '#00dbde', bgGradientEnabled: false, backgroundColor: '#000000', frameStyle: 'cyberpunk', frameColor: '#fc00ff', frameTextColor: '#00dbde', textGradientEnabled: false, frameFontFamily: "'Courier New', monospace", frameTextPosition: 'top' }
  },
  {
    name: t('qrEditor.presets.monochromeWeb'),
    customization: { dotStyle: 'dots', eyeFrameStyle: 'circle', eyeBallStyle: 'circle', gradientEnabled: false, foregroundColor: '#000000', bgGradientEnabled: false, backgroundColor: '#ffffff', frameStyle: 'browser', frameColor: '#e0e0e0', frameTextColor: '#000000', textGradientEnabled: false, frameFontFamily: "sans-serif", frameTextPosition: 'bottom' }
  },
  {
    name: t('qrEditor.presets.vaporwave'),
    customization: { dotStyle: 'classy', eyeFrameStyle: 'octagon', eyeBallStyle: 'circle', gradientEnabled: true, gradientType: 'linear', gradientRotation: 90, foregroundColor: '#00ffff', foregroundColor2: '#ff00ff', bgGradientEnabled: true, bgGradientType: 'linear', bgGradientRotation: 180, backgroundColor: '#ff00ff', backgroundColor2: '#00ffff', frameStyle: 'glowing', frameColor: '#00ffff', frameTextColor: '#ff00ff', textGradientEnabled: false, frameFontFamily: "'Trebuchet MS', sans-serif", frameTextPosition: 'bottom' }
  },
  {
    name: t('qrEditor.presets.coffeeShop'),
    customization: { dotStyle: 'rounded', eyeFrameStyle: 'rounded', eyeBallStyle: 'rounded', gradientEnabled: true, gradientType: 'radial', gradientScale: 70, foregroundColor: '#5c258d', foregroundColor2: '#4389a2', bgGradientEnabled: false, backgroundColor: '#fdfbfb', frameStyle: 'polaroid', frameColor: '#ffffff', frameTextColor: '#5c258d', textGradientEnabled: false, frameFontFamily: "cursive", frameTextPosition: 'bottom' }
  },
  {
    name: t('qrEditor.presets.rubySparkle'),
    customization: { dotStyle: 'diamond', eyeFrameStyle: 'diamond', eyeBallStyle: 'diamond', gradientEnabled: true, gradientType: 'linear', gradientRotation: 45, foregroundColor: '#ff0844', foregroundColor2: '#ffb199', bgGradientEnabled: false, backgroundColor: '#ffffff', frameStyle: 'shadow', frameColor: '#ff0844', frameTextColor: '#ffffff', textGradientEnabled: false, frameFontFamily: 'sans-serif', frameTextPosition: 'bottom' }
  },
  {
    name: t('qrEditor.presets.emeraldCity'),
    customization: { dotStyle: 'fluid', eyeFrameStyle: 'leaf', eyeBallStyle: 'leaf', gradientEnabled: true, gradientType: 'linear', gradientRotation: -45, foregroundColor: '#0ba360', foregroundColor2: '#3cba92', bgGradientEnabled: false, backgroundColor: '#ffffff', frameStyle: 'solid', frameColor: '#0ba360', frameTextColor: '#ffffff', textGradientEnabled: false, frameFontFamily: 'serif', frameTextPosition: 'left' }
  },
  {
    name: t('qrEditor.presets.neonTokyo'),
    customization: { dotStyle: 'fluid', eyeFrameStyle: 'hexagon', eyeBallStyle: 'hexagon', gradientEnabled: true, gradientType: 'linear', gradientRotation: 135, foregroundColor: '#f83600', foregroundColor2: '#f9d423', bgGradientEnabled: true, bgGradientType: 'linear', bgGradientRotation: -135, backgroundColor: '#000000', backgroundColor2: '#111111', frameStyle: 'cyberpunk', frameColor: '#f9d423', frameTextColor: '#f83600', textGradientEnabled: false, frameFontFamily: 'Impact, fantasy', frameTextPosition: 'right' }
  },
  {
    name: t('qrEditor.presets.silverBullet'),
    customization: { dotStyle: 'rounded', eyeFrameStyle: 'rounded', eyeBallStyle: 'circle', gradientEnabled: true, gradientType: 'radial', gradientScale: 50, foregroundColor: '#2b5876', foregroundColor2: '#4e4376', bgGradientEnabled: true, bgGradientType: 'linear', bgGradientRotation: 0, backgroundColor: '#e6e9f0', backgroundColor2: '#eef1f5', frameStyle: 'minimal', frameColor: '#4e4376', frameTextColor: '#2b5876', textGradientEnabled: false, frameFontFamily: 'sans-serif', frameTextPosition: 'bottom' }
  },
  {
    name: t('qrEditor.presets.lavaFlow'),
    customization: { dotStyle: 'dots', eyeFrameStyle: 'octagon', eyeBallStyle: 'cross', gradientEnabled: true, gradientType: 'linear', gradientRotation: 180, foregroundColor: '#ff416c', foregroundColor2: '#ff4b2b', bgGradientEnabled: true, bgGradientType: 'radial', bgGradientScale: 70, backgroundColor: '#2b0000', backgroundColor2: '#000000', frameStyle: 'glowing', frameColor: '#000000', frameTextColor: '#ff4b2b', textGradientEnabled: true, textGradientType: 'linear', textGradientRotation: 0, frameTextColor2: '#ff416c', frameFontFamily: 'sans-serif', frameTextPosition: 'top' }
  },
  {
    name: t('qrEditor.presets.blueSteel'),
    customization: { dotStyle: 'classy', eyeFrameStyle: 'shield', eyeBallStyle: 'star', gradientEnabled: true, gradientType: 'linear', gradientRotation: 90, foregroundColor: '#0b8793', foregroundColor2: '#360033', bgGradientEnabled: false, backgroundColor: '#ffffff', frameStyle: 'border', frameColor: '#360033', frameTextColor: '#360033', textGradientEnabled: false, frameFontFamily: 'serif', frameTextPosition: 'bottom' }
  },
  {
    name: t('qrEditor.presets.sunnyDay'),
    customization: { dotStyle: 'heart', eyeFrameStyle: 'circle', eyeBallStyle: 'heart', gradientEnabled: true, gradientType: 'radial', gradientScale: 60, foregroundColor: '#f6d365', foregroundColor2: '#fda085', bgGradientEnabled: false, backgroundColor: '#ffffff', frameStyle: 'bubble', frameColor: '#fda085', frameTextColor: '#ffffff', textGradientEnabled: false, frameFontFamily: "'Comic Sans MS', cursive", frameTextPosition: 'bottom' }
  },
  {
    name: t('qrEditor.presets.amethyst'),
    customization: { dotStyle: 'star', eyeFrameStyle: 'star', eyeBallStyle: 'star', gradientEnabled: true, gradientType: 'linear', gradientRotation: -90, foregroundColor: '#8E2DE2', foregroundColor2: '#4A00E0', bgGradientEnabled: false, backgroundColor: '#ffffff', frameStyle: 'badge', frameColor: '#8E2DE2', frameTextColor: '#ffffff', textGradientEnabled: false, frameFontFamily: 'sans-serif', frameTextPosition: 'bottom' }
  },
  {
    name: t('qrEditor.presets.forestFire'),
    customization: { dotStyle: 'leaf', eyeFrameStyle: 'leaf', eyeBallStyle: 'leaf', gradientEnabled: true, gradientType: 'linear', gradientRotation: 135, foregroundColor: '#f12711', foregroundColor2: '#f5af19', bgGradientEnabled: true, bgGradientType: 'linear', bgGradientRotation: -45, backgroundColor: '#11998e', backgroundColor2: '#38ef7d', frameStyle: 'shadow', frameColor: '#ffffff', frameTextColor: '#11998e', textGradientEnabled: false, frameFontFamily: 'sans-serif', frameTextPosition: 'left' }
  },
  {
    name: t('qrEditor.presets.cottonCandy'),
    customization: { dotStyle: 'fluid', eyeFrameStyle: 'rounded', eyeBallStyle: 'circle', gradientEnabled: true, gradientType: 'radial', gradientScale: 80, foregroundColor: '#ff9a9e', foregroundColor2: '#fecfef', bgGradientEnabled: false, backgroundColor: '#ffffff', frameStyle: 'polaroid', frameColor: '#ffffff', frameTextColor: '#ff9a9e', textGradientEnabled: false, frameFontFamily: 'cursive', frameTextPosition: 'bottom' }
  },
  {
    name: t('qrEditor.presets.midnightOcean'),
    customization: { dotStyle: 'fluid', eyeFrameStyle: 'circle', eyeBallStyle: 'diamond', gradientEnabled: true, gradientType: 'linear', gradientRotation: 180, foregroundColor: '#000046', foregroundColor2: '#1CB5E0', bgGradientEnabled: false, backgroundColor: '#ffffff', frameStyle: 'shadow', frameColor: '#ffffff', frameTextColor: '#000046', textGradientEnabled: false, frameFontFamily: 'sans-serif', frameTextPosition: 'bottom' }
  },
  {
    name: t('qrEditor.presets.goldenHour'),
    customization: { dotStyle: 'classy', eyeFrameStyle: 'octagon', eyeBallStyle: 'star', gradientEnabled: true, gradientType: 'linear', gradientRotation: 90, foregroundColor: '#F2C94C', foregroundColor2: '#F2994A', bgGradientEnabled: false, backgroundColor: '#fafafa', frameStyle: 'minimal', frameColor: '#F2994A', frameTextColor: '#F2994A', textGradientEnabled: false, frameFontFamily: 'serif', frameTextPosition: 'right' }
  },
  {
    name: t('qrEditor.presets.toxicGlow'),
    customization: { dotStyle: 'diamond', eyeFrameStyle: 'hexagon', eyeBallStyle: 'cross', gradientEnabled: true, gradientType: 'radial', gradientScale: 75, foregroundColor: '#39FF14', foregroundColor2: '#00ff00', bgGradientEnabled: false, backgroundColor: '#000000', frameStyle: 'neon', frameColor: '#39FF14', frameTextColor: '#39FF14', textGradientEnabled: false, frameFontFamily: 'Impact, fantasy', frameTextPosition: 'top' }
  },
  {
    name: t('qrEditor.presets.bubblegum'),
    customization: { dotStyle: 'rounded', eyeFrameStyle: 'rounded', eyeBallStyle: 'rounded', gradientEnabled: true, gradientType: 'linear', gradientRotation: 45, foregroundColor: '#FF9A9E', foregroundColor2: '#FECFEF', bgGradientEnabled: false, backgroundColor: '#ffffff', frameStyle: 'bubble', frameColor: '#FF9A9E', frameTextColor: '#ffffff', textGradientEnabled: false, frameFontFamily: 'cursive', frameTextPosition: 'bottom' }
  },
  {
    name: t('qrEditor.presets.bloodMoon'),
    customization: { dotStyle: 'star', eyeFrameStyle: 'star', eyeBallStyle: 'star', gradientEnabled: true, gradientType: 'radial', gradientScale: 60, foregroundColor: '#8A2387', foregroundColor2: '#E94057', bgGradientEnabled: true, bgGradientType: 'linear', bgGradientRotation: 0, backgroundColor: '#1f0000', backgroundColor2: '#000000', frameStyle: 'glowing', frameColor: '#E94057', frameTextColor: '#F27121', textGradientEnabled: true, textGradientType: 'linear', textGradientRotation: 90, frameTextColor2: '#E94057', frameFontFamily: 'sans-serif', frameTextPosition: 'bottom' }
  },
  {
    name: t('qrEditor.presets.cyberMatrix'),
    customization: { dotStyle: 'square', eyeFrameStyle: 'square', eyeBallStyle: 'square', gradientEnabled: false, foregroundColor: '#00FF41', bgGradientEnabled: false, backgroundColor: '#0D0208', frameStyle: 'retro', frameColor: '#0D0208', frameTextColor: '#00FF41', textGradientEnabled: false, frameFontFamily: "'Courier New', monospace", frameTextPosition: 'right' }
  },
  {
    name: t('qrEditor.presets.desertSand'),
    customization: { dotStyle: 'dots', eyeFrameStyle: 'octagon', eyeBallStyle: 'circle', gradientEnabled: true, gradientType: 'linear', gradientRotation: 135, foregroundColor: '#C84E89', foregroundColor2: '#F15F79', bgGradientEnabled: true, bgGradientType: 'radial', bgGradientScale: 80, backgroundColor: '#FDFCFB', backgroundColor2: '#E2D1C3', frameStyle: 'vintage', frameColor: '#C84E89', frameTextColor: '#C84E89', textGradientEnabled: false, frameFontFamily: "'Times New Roman', serif", frameTextPosition: 'bottom' }
  },
  {
    name: t('qrEditor.presets.arcticFreeze'),
    customization: { dotStyle: 'fluid', eyeFrameStyle: 'circle', eyeBallStyle: 'circle', gradientEnabled: true, gradientType: 'linear', gradientRotation: -45, foregroundColor: '#00C9FF', foregroundColor2: '#92FE9D', bgGradientEnabled: false, backgroundColor: '#ffffff', frameStyle: 'border', frameColor: '#00C9FF', frameTextColor: '#00C9FF', textGradientEnabled: false, frameFontFamily: 'sans-serif', frameTextPosition: 'left' }
  },
  {
    name: t('qrEditor.presets.electricViolet'),
    customization: { dotStyle: 'classy', eyeFrameStyle: 'hexagon', eyeBallStyle: 'star', gradientEnabled: true, gradientType: 'linear', gradientRotation: 90, foregroundColor: '#B224EF', foregroundColor2: '#7579FF', bgGradientEnabled: true, bgGradientType: 'linear', bgGradientRotation: -90, backgroundColor: '#000000', backgroundColor2: '#1a1a2e', frameStyle: 'cyberpunk', frameColor: '#7579FF', frameTextColor: '#B224EF', textGradientEnabled: false, frameFontFamily: 'Impact, fantasy', frameTextPosition: 'bottom' }
  },
  {
    name: t('qrEditor.presets.copperCoin'),
    customization: { dotStyle: 'rounded', eyeFrameStyle: 'shield', eyeBallStyle: 'rounded', gradientEnabled: true, gradientType: 'radial', gradientScale: 50, foregroundColor: '#b87333', foregroundColor2: '#ffcc99', bgGradientEnabled: false, backgroundColor: '#ffffff', frameStyle: 'solid', frameColor: '#b87333', frameTextColor: '#ffffff', textGradientEnabled: false, frameFontFamily: 'serif', frameTextPosition: 'bottom' }
  },
  {
    name: t('qrEditor.presets.royalBlue'),
    customization: { dotStyle: 'diamond', eyeFrameStyle: 'diamond', eyeBallStyle: 'diamond', gradientEnabled: true, gradientType: 'linear', gradientRotation: 45, foregroundColor: '#0000CD', foregroundColor2: '#4169E1', bgGradientEnabled: false, backgroundColor: '#f0f4f8', frameStyle: 'badge', frameColor: '#0000CD', frameTextColor: '#FFD700', textGradientEnabled: false, frameFontFamily: 'serif', frameTextPosition: 'top' }
  },
  {
    name: t('qrEditor.presets.alienTech'),
    customization: { dotStyle: 'square', eyeFrameStyle: 'octagon', eyeBallStyle: 'cross', gradientEnabled: false, foregroundColor: '#BFFF00', bgGradientEnabled: false, backgroundColor: '#2b2b2b', frameStyle: 'browser', frameColor: '#404040', frameTextColor: '#BFFF00', textGradientEnabled: false, frameFontFamily: "'Courier New', monospace", frameTextPosition: 'top' }
  },
  {
    name: t('qrEditor.presets.sunsetCruise'),
    customization: { dotStyle: 'heart', eyeFrameStyle: 'rounded', eyeBallStyle: 'heart', gradientEnabled: true, gradientType: 'linear', gradientRotation: 0, foregroundColor: '#FF5F6D', foregroundColor2: '#FFC371', bgGradientEnabled: false, backgroundColor: '#ffffff', frameStyle: 'ticket', frameColor: '#FF5F6D', frameTextColor: '#ffffff', textGradientEnabled: false, frameFontFamily: "'Trebuchet MS', sans-serif", frameTextPosition: 'bottom' }
  },
  {
    name: t('qrEditor.presets.lemonade'),
    customization: { dotStyle: 'dots', eyeFrameStyle: 'circle', eyeBallStyle: 'circle', gradientEnabled: true, gradientType: 'radial', gradientScale: 70, foregroundColor: '#F9D423', foregroundColor2: '#FF4E50', bgGradientEnabled: false, backgroundColor: '#fffdee', frameStyle: 'polaroid', frameColor: '#ffffff', frameTextColor: '#FF4E50', textGradientEnabled: false, frameFontFamily: 'cursive', frameTextPosition: 'bottom' }
  },
  {
    name: t('qrEditor.presets.midnightRose'),
    customization: { dotStyle: 'fluid', eyeFrameStyle: 'leaf', eyeBallStyle: 'leaf', gradientEnabled: true, gradientType: 'linear', gradientRotation: 135, foregroundColor: '#800000', foregroundColor2: '#ff0040', bgGradientEnabled: false, backgroundColor: '#ffffff', frameStyle: 'shadow', frameColor: '#ffffff', frameTextColor: '#800000', textGradientEnabled: false, frameFontFamily: 'sans-serif', frameTextPosition: 'left' }
  },
  {
    name: t('qrEditor.presets.starryNight'),
    customization: { dotStyle: 'star', eyeFrameStyle: 'star', eyeBallStyle: 'star', gradientEnabled: true, gradientType: 'radial', gradientScale: 100, foregroundColor: '#000080', foregroundColor2: '#000033', bgGradientEnabled: true, bgGradientType: 'linear', bgGradientRotation: 45, backgroundColor: '#FFD700', backgroundColor2: '#FFA500', frameStyle: 'vintage', frameColor: '#000080', frameTextColor: '#000080', textGradientEnabled: false, frameFontFamily: "'Times New Roman', serif", frameTextPosition: 'bottom' }
  },
  {
    name: t('qrEditor.presets.mintChocolate'),
    customization: { dotStyle: 'classy', eyeFrameStyle: 'rounded', eyeBallStyle: 'rounded', gradientEnabled: false, foregroundColor: '#3E2723', bgGradientEnabled: true, bgGradientType: 'radial', bgGradientScale: 70, backgroundColor: '#a8e063', backgroundColor2: '#56ab2f', frameStyle: 'minimal', frameColor: '#3E2723', frameTextColor: '#3E2723', textGradientEnabled: false, frameFontFamily: 'sans-serif', frameTextPosition: 'right' }
  },
  {
    name: t('qrEditor.presets.neonFlux'),
    customization: { dotStyle: 'fluid', eyeFrameStyle: 'hexagon', eyeBallStyle: 'hexagon', gradientEnabled: true, gradientType: 'linear', gradientRotation: 90, foregroundColor: '#FF1493', foregroundColor2: '#00FFFF', bgGradientEnabled: true, bgGradientType: 'linear', bgGradientRotation: -90, backgroundColor: '#000000', backgroundColor2: '#1C1C1C', frameStyle: 'cyberpunk', frameColor: '#FF1493', frameTextColor: '#00FFFF', textGradientEnabled: false, frameFontFamily: 'Impact, fantasy', frameTextPosition: 'bottom' }
  },
  {
    name: t('qrEditor.presets.ghostWhite'),
    customization: { dotStyle: 'rounded', eyeFrameStyle: 'rounded', eyeBallStyle: 'circle', gradientEnabled: false, foregroundColor: '#ffffff', bgGradientEnabled: false, backgroundColor: '#b3b3b3', frameStyle: 'glowing', frameColor: '#b3b3b3', frameTextColor: '#ffffff', textGradientEnabled: false, frameFontFamily: 'sans-serif', frameTextPosition: 'bottom' }
  },
  {
    name: t('qrEditor.presets.pumpkinSpice'),
    customization: { dotStyle: 'dots', eyeFrameStyle: 'octagon', eyeBallStyle: 'circle', gradientEnabled: true, gradientType: 'linear', gradientRotation: 180, foregroundColor: '#D35400', foregroundColor2: '#E67E22', bgGradientEnabled: false, backgroundColor: '#FFF5E6', frameStyle: 'bubble', frameColor: '#D35400', frameTextColor: '#ffffff', textGradientEnabled: false, frameFontFamily: 'cursive', frameTextPosition: 'top' }
  },
  {
    name: t('qrEditor.presets.ninjaStrike'),
    customization: { dotStyle: 'ninja', eyeFrameStyle: 'ninja', eyeBallStyle: 'ninja', gradientEnabled: true, gradientType: 'linear', gradientRotation: 45, foregroundColor: '#ff0000', foregroundColor2: '#aa0000', bgGradientEnabled: false, backgroundColor: '#1a1a1a', frameStyle: 'cyberpunk', frameColor: '#ff0000', frameTextColor: '#ffffff', textGradientEnabled: false, frameFontFamily: 'Impact, fantasy', frameTextPosition: 'bottom' }
  },
  {
    name: t('qrEditor.presets.magicSparkle'),
    customization: { dotStyle: 'sparkle', eyeFrameStyle: 'sparkle', eyeBallStyle: 'sparkle', gradientEnabled: true, gradientType: 'radial', gradientScale: 80, foregroundColor: '#ffd700', foregroundColor2: '#ff8c00', bgGradientEnabled: false, backgroundColor: '#ffffff', frameStyle: 'glowing', frameColor: '#ffffff', frameTextColor: '#ffd700', textGradientEnabled: false, frameFontFamily: 'cursive', frameTextPosition: 'bottom' }
  },
  {
    name: t('qrEditor.presets.rainDrop'),
    customization: { dotStyle: 'drop', eyeFrameStyle: 'drop', eyeBallStyle: 'drop', gradientEnabled: true, gradientType: 'linear', gradientRotation: 180, foregroundColor: '#00bfff', foregroundColor2: '#1e90ff', bgGradientEnabled: false, backgroundColor: '#f0f8ff', frameStyle: 'bubble', frameColor: '#1e90ff', frameTextColor: '#ffffff', textGradientEnabled: false, frameFontFamily: 'sans-serif', frameTextPosition: 'left' }
  },
  {
    name: t('qrEditor.presets.neonTriangle'),
    customization: { dotStyle: 'triangle', eyeFrameStyle: 'triangle', eyeBallStyle: 'triangle', gradientEnabled: true, gradientType: 'linear', gradientRotation: 90, foregroundColor: '#00ff00', foregroundColor2: '#00cc00', bgGradientEnabled: true, bgGradientType: 'linear', bgGradientRotation: -90, backgroundColor: '#000000', backgroundColor2: '#111111', frameStyle: 'neon', frameColor: '#00ff00', frameTextColor: '#00ff00', textGradientEnabled: false, frameFontFamily: 'sans-serif', frameTextPosition: 'right' }
  },
  {
    name: t('qrEditor.presets.medicalPill'),
    customization: { dotStyle: 'pill', eyeFrameStyle: 'pill', eyeBallStyle: 'pill', gradientEnabled: true, gradientType: 'linear', gradientRotation: 0, foregroundColor: '#ff6b6b', foregroundColor2: '#4ecdc4', bgGradientEnabled: false, backgroundColor: '#ffffff', frameStyle: 'solid', frameColor: '#4ecdc4', frameTextColor: '#ffffff', textGradientEnabled: false, frameFontFamily: 'sans-serif', frameTextPosition: 'bottom' }
  },
  {
    name: t('qrEditor.presets.frostedGlass'),
    customization: { dotStyle: 'rounded', eyeFrameStyle: 'rounded', eyeBallStyle: 'circle', gradientEnabled: true, gradientType: 'linear', gradientRotation: 135, foregroundColor: '#ffffff', foregroundColor2: '#e0e0e0', bgGradientEnabled: true, bgGradientType: 'radial', gradientScale: 100, backgroundColor: '#a8c0ff', backgroundColor2: '#3f2b96', frameStyle: 'glass', frameColor: '#ffffff', frameTextColor: '#ffffff', textGradientEnabled: false, frameFontFamily: 'sans-serif', frameTextPosition: 'bottom' }
  },
  {
    name: t('qrEditor.presets.cyberGlass'),
    customization: { dotStyle: 'fluid', eyeFrameStyle: 'hexagon', eyeBallStyle: 'diamond', gradientEnabled: true, gradientType: 'linear', gradientRotation: 45, foregroundColor: '#00ffcc', foregroundColor2: '#0066ff', bgGradientEnabled: true, bgGradientType: 'linear', bgGradientRotation: 45, backgroundColor: '#0a0a0a', backgroundColor2: '#1a1a2e', frameStyle: 'glass', frameColor: '#00ffcc', frameTextColor: '#00ffcc', textGradientEnabled: false, frameFontFamily: 'monospace', frameTextPosition: 'bottom' }
  },
  {
    name: t('qrEditor.presets.rubyGlass'),
    customization: { dotStyle: 'classy', eyeFrameStyle: 'leaf', eyeBallStyle: 'leaf', gradientEnabled: true, gradientType: 'linear', gradientRotation: -45, foregroundColor: '#ff0844', foregroundColor2: '#ffb199', bgGradientEnabled: true, bgGradientType: 'radial', gradientScale: 80, backgroundColor: '#2a0845', backgroundColor2: '#6441A5', frameStyle: 'glass', frameColor: '#ff0844', frameTextColor: '#ffffff', textGradientEnabled: false, frameFontFamily: 'serif', frameTextPosition: 'bottom' }
  }
];

const getSocialLogos = (t: (key: string) => string) => [
  { name: 'none', label: t('socialPlatforms.none'), url: '' },
  { name: 'wifi', label: t('socialPlatforms.wifi'), url: 'https://cdn-icons-png.flaticon.com/512/93/93158.png', invertInDarkMode: true },
  { name: 'tiktok', label: t('socialPlatforms.tiktok'), url: 'https://cdn-icons-png.flaticon.com/512/3046/3046121.png', invertInDarkMode: true },
  { name: 'whatsapp', label: t('socialPlatforms.whatsapp'), url: 'https://cdn-icons-png.flaticon.com/512/733/733585.png' },
  { name: 'instagram', label: t('socialPlatforms.instagram'), url: 'https://cdn-icons-png.flaticon.com/512/174/174855.png' },
  { name: 'facebook', label: t('socialPlatforms.facebook'), url: 'https://cdn-icons-png.flaticon.com/512/124/124010.png' },
  { name: 'twitter', label: t('socialPlatforms.twitter'), url: 'https://cdn-icons-png.flaticon.com/512/5969/5969020.png', invertInDarkMode: true },
  { name: 'linkedin', label: t('socialPlatforms.linkedin'), url: 'https://cdn-icons-png.flaticon.com/512/174/174857.png' },
  { name: 'youtube', label: t('socialPlatforms.youtube'), url: 'https://cdn-icons-png.flaticon.com/512/1384/1384060.png' },
  { name: 'paypal', label: t('socialPlatforms.paypal'), url: 'https://cdn-icons-png.flaticon.com/512/174/174861.png' },
  { name: 'bitcoin', label: t('socialPlatforms.bitcoin'), url: 'https://cdn-icons-png.flaticon.com/512/5968/5968260.png' },
  { name: 'appstore', label: t('socialPlatforms.appstore'), url: 'https://cdn-icons-png.flaticon.com/512/731/731985.png', invertInDarkMode: true },
  { name: 'playstore', label: t('socialPlatforms.playstore'), url: 'https://cdn-icons-png.flaticon.com/512/732/732208.png' },
  { name: 'telegram', label: t('socialPlatforms.telegram'), url: 'https://cdn-icons-png.flaticon.com/512/2111/2111646.png' },
  { name: 'discord', label: t('socialPlatforms.discord'), url: 'https://cdn-icons-png.flaticon.com/512/5968/5968756.png' },
  { name: 'reddit', label: t('socialPlatforms.reddit'), url: 'https://cdn-icons-png.flaticon.com/512/174/174866.png' },
  { name: 'github', label: t('socialPlatforms.github'), url: 'https://cdn-icons-png.flaticon.com/512/733/733553.png', invertInDarkMode: true },
  { name: 'zoom', label: t('socialPlatforms.zoom'), url: 'https://cdn-icons-png.flaticon.com/512/4401/4401470.png' },
  { name: 'slack', label: t('socialPlatforms.slack'), url: 'https://cdn-icons-png.flaticon.com/512/2111/2111615.png' },
  { name: 'spotify', label: t('socialPlatforms.spotify'), url: 'https://cdn-icons-png.flaticon.com/512/174/174872.png' },
  { name: 'twitch', label: t('socialPlatforms.twitch'), url: 'https://cdn-icons-png.flaticon.com/512/5968/5968819.png' },
  { name: 'snapchat', label: t('socialPlatforms.snapchat'), url: 'https://cdn-icons-png.flaticon.com/512/174/174870.png' },
  { name: 'pinterest', label: t('socialPlatforms.pinterest'), url: 'https://cdn-icons-png.flaticon.com/512/145/145808.png' },
  { name: 'figma', label: t('socialPlatforms.figma'), url: 'https://cdn-icons-png.flaticon.com/512/5968/5968705.png' },
  { name: 'apple', label: t('socialPlatforms.apple'), url: 'https://cdn-icons-png.flaticon.com/512/0/747.png', invertInDarkMode: true },
  { name: 'android', label: t('socialPlatforms.android'), url: 'https://cdn-icons-png.flaticon.com/512/174/174836.png' },
  { name: 'notion', label: t('socialPlatforms.notion'), url: 'https://upload.wikimedia.org/wikipedia/commons/4/45/Notion_app_logo.png' },
  { name: 'patreon', label: t('socialPlatforms.patreon'), url: 'https://upload.wikimedia.org/wikipedia/commons/9/94/Patreon_logo.svg' }
];

const getDataTypes = (t: (key: string) => string) => [
  { id: 'landing-page', label: t('qrEditor.dataTypes.landingPage'), Icon: Layout },
  { id: 'url', label: t('qrEditor.dataTypes.url'), Icon: LinkIcon },
  { id: 'text', label: t('qrEditor.dataTypes.text'), Icon: FileText },
  { id: 'wifi', label: t('qrEditor.dataTypes.wifi'), Icon: Wifi },
  { id: 'phone', label: t('qrEditor.dataTypes.phone'), Icon: Phone },
  { id: 'email', label: t('qrEditor.dataTypes.email'), Icon: Mail },
  { id: 'sms', label: t('qrEditor.dataTypes.sms'), Icon: MessageSquare },
  { id: 'vcard', label: t('qrEditor.dataTypes.vcard'), Icon: Globe },
  { id: 'maps', label: t('qrEditor.dataTypes.maps'), Icon: MapPin },
  { id: 'tiktok', label: t('socialPlatforms.tiktok'), image: 'https://cdn-icons-png.flaticon.com/512/3046/3046121.png', invertInDarkMode: true },
  { id: 'whatsapp', label: t('socialPlatforms.whatsapp'), image: 'https://cdn-icons-png.flaticon.com/512/733/733585.png' },
  { id: 'instagram', label: t('socialPlatforms.instagram'), image: 'https://cdn-icons-png.flaticon.com/512/174/174855.png' },
  { id: 'facebook', label: t('socialPlatforms.facebook'), image: 'https://cdn-icons-png.flaticon.com/512/124/124010.png' },
  { id: 'twitter', label: t('socialPlatforms.twitterX'), image: 'https://cdn-icons-png.flaticon.com/512/5969/5969020.png', invertInDarkMode: true },
  { id: 'youtube', label: t('socialPlatforms.youtube'), image: 'https://cdn-icons-png.flaticon.com/512/1384/1384060.png' },
  { id: 'linkedin', label: t('socialPlatforms.linkedin'), image: 'https://cdn-icons-png.flaticon.com/512/174/174857.png' },
  { id: 'snapchat', label: t('socialPlatforms.snapchat'), image: 'https://cdn-icons-png.flaticon.com/512/174/174870.png' },
  { id: 'paypal', label: t('socialPlatforms.paypal'), image: 'https://cdn-icons-png.flaticon.com/512/174/174861.png' },
  { id: 'bitcoin', label: t('socialPlatforms.bitcoin'), image: 'https://cdn-icons-png.flaticon.com/512/5968/5968260.png' },
  { id: 'appstore', label: t('socialPlatforms.appstore'), image: 'https://cdn-icons-png.flaticon.com/512/731/731985.png', invertInDarkMode: true },
  { id: 'playstore', label: t('socialPlatforms.playstore'), image: 'https://cdn-icons-png.flaticon.com/512/732/732208.png' },
  { id: 'telegram', label: t('socialPlatforms.telegram'), image: 'https://cdn-icons-png.flaticon.com/512/2111/2111646.png' },
  { id: 'discord', label: t('socialPlatforms.discord'), image: 'https://cdn-icons-png.flaticon.com/512/5968/5968756.png' },
  { id: 'reddit', label: t('socialPlatforms.reddit'), image: 'https://cdn-icons-png.flaticon.com/512/174/174866.png' },
  { id: 'github', label: t('socialPlatforms.github'), image: 'https://cdn-icons-png.flaticon.com/512/733/733553.png', invertInDarkMode: true },
  { id: 'zoom', label: t('socialPlatforms.zoom'), image: 'https://cdn-icons-png.flaticon.com/512/4401/4401470.png' },
  { id: 'slack', label: t('socialPlatforms.slack'), image: 'https://cdn-icons-png.flaticon.com/512/2111/2111615.png' },
  { id: 'spotify', label: t('socialPlatforms.spotify'), image: 'https://cdn-icons-png.flaticon.com/512/174/174872.png' },
  { id: 'twitch', label: t('socialPlatforms.twitch'), image: 'https://cdn-icons-png.flaticon.com/512/5968/5968819.png' },
  { id: 'pinterest', label: t('socialPlatforms.pinterest'), image: 'https://cdn-icons-png.flaticon.com/512/145/145808.png' },
  { id: 'figma', label: t('socialPlatforms.figma'), image: 'https://cdn-icons-png.flaticon.com/512/5968/5968705.png' },
  { id: 'notion', label: t('socialPlatforms.notion'), image: 'https://upload.wikimedia.org/wikipedia/commons/4/45/Notion_app_logo.png' },
  { id: 'patreon', label: t('socialPlatforms.patreon'), image: 'https://upload.wikimedia.org/wikipedia/commons/9/94/Patreon_logo.svg' }
];



const StyleIcon = ({ type, styleName, active }: { type: 'dot' | 'frame' | 'ball' | 'frameStyle'; styleName: string; active: boolean }) => {
  let content = null;
  let viewBox = "0 0 1 1";
  const x = 0;
  const y = 0;
  const fill = "currentColor";
  
  if (type === 'dot') {
    viewBox = "0 0 1 1";
    switch (styleName) {
      case 'dots': content = <circle cx={x + 0.5} cy={y + 0.5} r={0.4} fill={fill} stroke="none" />; break;
      case 'rounded': content = <rect x={x + 0.05} y={y + 0.05} width={0.9} height={0.9} rx={0.3} fill={fill} stroke="none" />; break;
      case 'classy': content = <polygon points={`${x+0.5},${y+0.1} ${x+0.9},${y+0.5} ${x+0.5},${y+0.9} ${x+0.1},${y+0.5}`} fill={fill} stroke="none" />; break;
      case 'star': content = <path d={`M${x+0.5},${y+0.1} l0.1,0.3 l0.3,0 l-0.2,0.2 l0.1,0.3 l-0.3,-0.2 l-0.3,0.2 l0.1,-0.3 l-0.2,-0.2 l0.3,0 Z`} fill={fill} stroke="none" />; break;
      case 'diamond': content = <polygon points={`${x+0.5},${y} ${x+1},${y+0.5} ${x+0.5},${y+1} ${x},${y+0.5}`} fill={fill} stroke="none" />; break;
      case 'hexagon': content = <polygon points={`${x+0.5},${y} ${x+0.93},${y+0.25} ${x+0.93},${y+0.75} ${x+0.5},${y+1} ${x+0.07},${y+0.75} ${x+0.07},${y+0.25}`} fill={fill} stroke="none" />; break;
      case 'fluid': content = <path d={`M${x+0.5} ${y} A 0.5 0.5 0 0 1 ${x+1} ${y+0.5} A 0.5 0.5 0 0 1 ${x+0.5} ${y+1} A 0.5 0.5 0 0 1 ${x} ${y+0.5} L ${x+0.5} ${y} Z`} fill={fill} stroke="none" />; break;
      case 'cross': content = <path d={`M${x+0.3} ${y+0.1} H${x+0.7} V${y+0.3} H${x+0.9} V${y+0.7} H${x+0.7} V${y+0.9} H${x+0.3} V${y+0.7} H${x+0.1} V${y+0.3} H${x+0.3} Z`} fill={fill} stroke="none" />; break;
      case 'heart': content = <path d={`M ${x+0.5} ${y+0.3} C ${x+0.5} ${y} ${x+1} ${y} ${x+1} ${y+0.4} C ${x+1} ${y+0.7} ${x+0.5} ${y+0.9} ${x+0.5} ${y+1} C ${x+0.5} ${y+0.9} ${x} ${y+0.7} ${x} ${y+0.4} C ${x} ${y} ${x+0.5} ${y} ${x+0.5} ${y+0.3} Z`} fill={fill} stroke="none" />; break;
      case 'triangle': content = <polygon points={`${x+0.5},${y+0.1} ${x+0.9},${y+0.9} ${x+0.1},${y+0.9}`} fill={fill} stroke="none" />; break;
      case 'drop': content = <path d={`M${x+0.5} ${y+0.1} C ${x+0.9} ${y+0.5} ${x+0.9} ${y+0.9} ${x+0.5} ${y+0.9} C ${x+0.1} ${y+0.9} ${x+0.1} ${y+0.5} ${x+0.5} ${y+0.1} Z`} fill={fill} stroke="none" />; break;
      case 'ninja': content = <path d={`M${x+0.5} ${y} L${x+0.6} ${y+0.4} L${x+1} ${y+0.5} L${x+0.6} ${y+0.6} L${x+0.5} ${y+1} L${x+0.4} ${y+0.6} L${x} ${y+0.5} L${x+0.4} ${y+0.4} Z`} fill={fill} stroke="none" />; break;
      case 'sparkle': content = <path d={`M${x+0.5} ${y} Q${x+0.5} ${y+0.5} ${x+1} ${y+0.5} Q${x+0.5} ${y+0.5} ${x+0.5} ${y+1} Q${x+0.5} ${y+0.5} ${x} ${y+0.5} Q${x+0.5} ${y+0.5} ${x+0.5} ${y} Z`} fill={fill} stroke="none" />; break;
      case 'pill': content = <rect x={x+0.1} y={y+0.3} width="0.8" height="0.4" rx="0.2" fill={fill} stroke="none" />; break;
      case 'square': default: content = <rect x={x} y={y} width="1" height="1" fill={fill} stroke="none" />; break;
    }
  } else if (type === 'frame') {
    viewBox = "0 0 7 7";
    switch (styleName) {
      case 'leaf': content = <path d={`M ${x+0.5} ${y+3.5} A 3 3 0 0 1 ${x+3.5} ${y+0.5} L ${x+6.5} ${y+0.5} L ${x+6.5} ${y+3.5} A 3 3 0 0 1 ${x+3.5} ${y+6.5} A 3 3 0 0 1 ${x+0.5} ${y+3.5} Z`} fill="none" stroke={fill} strokeWidth="1" />; break;
      case 'octagon': content = <polygon points={`${x+2.5},${y+0.5} ${x+4.5},${y+0.5} ${x+6.5},${y+2.5} ${x+6.5},${y+4.5} ${x+4.5},${y+6.5} ${x+2.5},${y+6.5} ${x+0.5},${y+4.5} ${x+0.5},${y+2.5}`} fill="none" stroke={fill} strokeWidth="1" />; break;
      case 'star': content = <polygon points={`${x+3.5},${y+0.5} ${x+4.5},${y+2.5} ${x+6.5},${y+3.5} ${x+4.5},${y+4.5} ${x+3.5},${y+6.5} ${x+2.5},${y+4.5} ${x+0.5},${y+3.5} ${x+2.5},${y+2.5}`} fill="none" stroke={fill} strokeWidth="1" />; break;
      case 'shield': content = <path d={`M ${x+0.5} ${y+0.5} H ${x+6.5} V ${y+3.5} C ${x+6.5} ${y+5.5} ${x+3.5} ${y+6.5} ${x+3.5} ${y+6.5} C ${x+3.5} ${y+6.5} ${x+0.5} ${y+5.5} ${x+0.5} ${y+3.5} Z`} fill="none" stroke={fill} strokeWidth="1" />; break;
      case 'hexagon': content = <polygon points={`${x+3.5},${y+0.5} ${x+6.5},${y+2} ${x+6.5},${y+5} ${x+3.5},${y+6.5} ${x+0.5},${y+5} ${x+0.5},${y+2}`} fill="none" stroke={fill} strokeWidth="1" />; break;
      case 'diamond': content = <polygon points={`${x+3.5},${y+0.5} ${x+6.5},${y+3.5} ${x+3.5},${y+6.5} ${x+0.5},${y+3.5}`} fill="none" stroke={fill} strokeWidth="1" />; break;
      case 'circle': content = <rect x={x+0.5} y={y+0.5} width="6" height="6" rx="3" fill="none" stroke={fill} strokeWidth="1" />; break;
      case 'rounded': content = <rect x={x+0.5} y={y+0.5} width="6" height="6" rx="1.5" fill="none" stroke={fill} strokeWidth="1" />; break;
      case 'triangle': content = <polygon points={`${x+3.5},${y+0.5} ${x+6.5},${y+6.5} ${x+0.5},${y+6.5}`} fill="none" stroke={fill} strokeWidth="1" />; break;
      case 'drop': content = <path d={`M${x+3.5} ${y+0.5} C ${x+6.5} ${y+3.5} ${x+6.5} ${y+6.5} ${x+3.5} ${y+6.5} C ${x+0.5} ${y+6.5} ${x+0.5} ${y+3.5} ${x+3.5} ${y+0.5} Z`} fill="none" stroke={fill} strokeWidth="1" />; break;
      case 'ninja': content = <path d={`M${x+3.5} ${y+0.5} L${x+4.5} ${y+2.5} L${x+6.5} ${y+3.5} L${x+4.5} ${y+4.5} L${x+3.5} ${y+6.5} L${x+2.5} ${y+4.5} L${x+0.5} ${y+3.5} L${x+2.5} ${y+2.5} Z`} fill="none" stroke={fill} strokeWidth="1" />; break;
      case 'sparkle': content = <path d={`M${x+3.5} ${y+0.5} Q${x+3.5} ${y+3.5} ${x+6.5} ${y+3.5} Q${x+3.5} ${y+3.5} ${x+3.5} ${y+6.5} Q${x+3.5} ${y+3.5} ${x+0.5} ${y+3.5} Q${x+3.5} ${y+3.5} ${x+3.5} ${y+0.5} Z`} fill="none" stroke={fill} strokeWidth="1" />; break;
      case 'pill': content = <rect x={x+0.5} y={y+1.5} width="6" height="4" rx="2" fill="none" stroke={fill} strokeWidth="1" />; break;
      case 'square': default: content = <rect x={x+0.5} y={y+0.5} width="6" height="6" fill="none" stroke={fill} strokeWidth="1" />; break;
    }
  } else if (type === 'ball') {
    viewBox = "0 0 7 7";
    switch (styleName) {
      case 'leaf': content = <path d={`M ${x+2} ${y+3.5} A 1.5 1.5 0 0 1 ${x+3.5} ${y+2} L ${x+5} ${y+2} L ${x+5} ${y+3.5} A 1.5 1.5 0 0 1 ${x+3.5} ${y+5} A 1.5 1.5 0 0 1 ${x+2} ${y+3.5} Z`} fill={fill} stroke="none" />; break;
      case 'diamond': content = <polygon points={`${x+3.5},${y+2} ${x+5},${y+3.5} ${x+3.5},${y+5} ${x+2},${y+3.5}`} fill={fill} stroke="none" />; break;
      case 'cross': content = <path d={`M${x+3} ${y+2} H${x+4} V${y+3} H${x+5} V${y+4} H${x+4} V${y+5} H${x+3} V${y+4} H${x+2} V${y+3} H${x+3} Z`} fill={fill} stroke="none" />; break;
      case 'star': content = <polygon points={`${x+3.5},${y+2} ${x+4},${y+3} ${x+5},${y+3.5} ${x+4},${y+4} ${x+3.5},${y+5} ${x+3},${y+4} ${x+2},${y+3.5} ${x+3},${y+3}`} fill={fill} stroke="none" />; break;
      case 'shield': content = <path d={`M ${x+2} ${y+2} H ${x+5} V ${y+3.5} C ${x+5} ${y+4.5} ${x+3.5} ${y+5} ${x+3.5} ${y+5} C ${x+3.5} ${y+5} ${x+2} ${y+4.5} ${x+2} ${y+3.5} Z`} fill={fill} stroke="none" />; break;
      case 'hexagon': content = <polygon points={`${x+3.5},${y+2} ${x+5},${y+2.8} ${x+5},${y+4.2} ${x+3.5},${y+5} ${x+2},${y+4.2} ${x+2},${y+2.8}`} fill={fill} stroke="none" />; break;
      case 'circle': content = <rect x={x+2} y={y+2} width="3" height="3" rx="1.5" fill={fill} stroke="none" />; break;
      case 'rounded': content = <rect x={x+2} y={y+2} width="3" height="3" rx="0.8" fill={fill} stroke="none" />; break;
      case 'triangle': content = <polygon points={`${x+3.5},${y+2} ${x+5},${y+5} ${x+2},${y+5}`} fill={fill} stroke="none" />; break;
      case 'drop': content = <path d={`M${x+3.5} ${y+2} C ${x+5} ${y+3.5} ${x+5} ${y+5} ${x+3.5} ${y+5} C ${x+2} ${y+5} ${x+2} ${y+3.5} ${x+3.5} ${y+2} Z`} fill={fill} stroke="none" />; break;
      case 'ninja': content = <path d={`M${x+3.5} ${y+2} L${x+4} ${y+3} L${x+5} ${y+3.5} L${x+4} ${y+4} L${x+3.5} ${y+5} L${x+3} ${y+4} L${x+2} ${y+3.5} L${x+3} ${y+3} Z`} fill={fill} stroke="none" />; break;
      case 'sparkle': content = <path d={`M${x+3.5} ${y+2} Q${x+3.5} ${y+3.5} ${x+5} ${y+3.5} Q${x+3.5} ${y+3.5} ${x+3.5} ${y+5} Q${x+3.5} ${y+3.5} ${x+2} ${y+3.5} Q${x+3.5} ${y+3.5} ${x+3.5} ${y+2} Z`} fill={fill} stroke="none" />; break;
      case 'pill': content = <rect x={x+2} y={y+2.5} width="3" height="2" rx="1" fill={fill} stroke="none" />; break;
      case 'square': default: content = <rect x={x+2} y={y+2} width="3" height="3" fill={fill} stroke="none" />; break;
    }
  } else if (type === 'frameStyle') {
    viewBox = "0 0 24 24";
    switch (styleName) {
      case 'none': content = <path d="M5 5h14v14H5zm0 0l14 14" stroke={fill} strokeWidth="1.5" fill="none" strokeDasharray="3 3" />; break;
      case 'bubble':
        content = (
          <>
            <rect x="4" y="4" width="16" height="12" rx="3" stroke={fill} strokeWidth="1.5" fill="none" />
            <path d="M12 16l-3 3v-3H8" stroke={fill} strokeWidth="1.5" fill="none" strokeLinejoin="round" />
          </>
        );
        break;
      case 'border': content = <rect x="3" y="3" width="18" height="18" rx="2" stroke={fill} strokeWidth="1.5" fill="none" />; break;
      case 'badge':
        content = (
          <>
            <rect x="4" y="3" width="16" height="13" rx="2" stroke={fill} strokeWidth="1.5" fill="none" />
            <circle cx="12" cy="17" r="3" stroke={fill} strokeWidth="1.5" fill="none" />
          </>
        );
        break;
      case 'solid': content = <rect x="3" y="3" width="18" height="18" rx="2" stroke={fill} strokeWidth="4" fill="none" />; break;
      case 'shadow':
        content = (
          <>
            <rect x="7" y="3" width="14" height="14" rx="2" stroke={fill} strokeWidth="1.5" fill="none" opacity="0.4" />
            <rect x="3" y="7" width="14" height="14" rx="2" stroke={fill} strokeWidth="1.5" fill="none" />
          </>
        );
        break;
      case 'vintage':
        content = (
          <>
            <rect x="4" y="4" width="16" height="16" stroke={fill} strokeWidth="1" fill="none" />
            <path d="M3 6h3V3M18 3v3h3M21 18h-3v3M6 21v-3H3" stroke={fill} strokeWidth="2" fill="none" />
          </>
        );
        break;
      case 'ticket': content = <path d="M3 6a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v3a2 2 0 0 0 0 4v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-3a2 2 0 0 0 0-4Z" stroke={fill} strokeWidth="1.5" fill="none" />; break;
      case 'minimal':
        content = (
          <>
            <rect x="5" y="3" width="14" height="14" rx="1" stroke={fill} strokeWidth="1.5" fill="none" />
            <line x1="3" y1="20" x2="21" y2="20" stroke={fill} strokeWidth="2" strokeLinecap="round" />
          </>
        );
        break;
      case 'polaroid':
        content = (
          <>
            <rect x="4" y="3" width="16" height="18" rx="1" stroke={fill} strokeWidth="1.5" fill="none" />
            <rect x="6" y="5" width="12" height="10" stroke={fill} strokeWidth="1" fill="none" />
          </>
        );
        break;
      case 'browser':
        content = (
          <>
            <rect x="3" y="4" width="18" height="16" rx="2" stroke={fill} strokeWidth="1.5" fill="none" />
            <line x1="3" y1="8" x2="21" y2="8" stroke={fill} strokeWidth="1.5" />
            <circle cx="6" cy="6" r="1" fill={fill} />
            <circle cx="9" cy="6" r="1" fill={fill} />
            <circle cx="12" cy="6" r="1" fill={fill} />
          </>
        );
        break;
      case 'neon':
        content = (
          <>
            <rect x="3" y="3" width="18" height="18" rx="2" stroke={fill} strokeWidth="1.5" fill="none" />
            <rect x="5" y="5" width="14" height="14" rx="1" stroke={fill} strokeWidth="0.75" fill="none" />
          </>
        );
        break;
      case 'glass':
        content = (
          <>
            <rect x="3" y="3" width="18" height="18" rx="2" stroke={fill} strokeWidth="1.5" fill="none" />
            <path d="M3 13l5-5 7 7 6-6" stroke={fill} strokeWidth="1.5" fill="none" opacity="0.5" strokeLinecap="round" strokeLinejoin="round" />
          </>
        );
        break;
      case 'cyberpunk':
        content = (
          <>
            <path d="M6 3h12l3 3v12l-3 3H6l-3-3V6Z" stroke={fill} strokeWidth="1.5" fill="none" />
            <line x1="3" y1="17" x2="7" y2="21" stroke={fill} strokeWidth="1.5" />
            <line x1="17" y1="3" x2="21" y2="7" stroke={fill} strokeWidth="1.5" />
          </>
        );
        break;
      case 'glowing':
        content = (
          <>
            <rect x="5" y="5" width="14" height="14" rx="2" stroke={fill} strokeWidth="1.5" fill="none" />
            <path d="M12 2v2M12 20v2M2 12h2M20 12h2" stroke={fill} strokeWidth="1.5" strokeLinecap="round" />
          </>
        );
        break;
      case 'retro':
        content = (
          <>
            <rect x="4" y="4" width="16" height="16" stroke={fill} strokeWidth="2" strokeDasharray="3 2" fill="none" />
          </>
        );
        break;
      case 'dashed': content = <rect x="4" y="4" width="16" height="16" rx="2" stroke={fill} strokeWidth="1.5" strokeDasharray="3 3" fill="none" />; break;
      case 'dotted': content = <rect x="4" y="4" width="16" height="16" rx="2" stroke={fill} strokeWidth="2" strokeDasharray="0 4" strokeLinecap="round" fill="none" />; break;
      case 'double':
        content = (
          <>
            <rect x="3" y="3" width="18" height="18" rx="2" stroke={fill} strokeWidth="1.5" fill="none" />
            <rect x="6" y="6" width="12" height="12" rx="1" stroke={fill} strokeWidth="1" fill="none" />
          </>
        );
        break;
      case 'crosshairs':
        content = (
          <>
            <rect x="6" y="6" width="12" height="12" rx="1" stroke={fill} strokeWidth="1.5" fill="none" />
            <path d="M2 6h4 M6 2v4 M22 6h-4 M18 2v4 M2 18h4 M6 22v-4 M22 18h-4 M18 22v-4" stroke={fill} strokeWidth="1.5" />
          </>
        );
        break;
      case 'film':
        content = (
          <>
            <rect x="4" y="4" width="16" height="16" fill={fill} />
            <line x1="6" y1="6" x2="18" y2="6" stroke="white" strokeWidth="2" strokeDasharray="2 2" className="dark:stroke-black" />
            <line x1="6" y1="18" x2="18" y2="18" stroke="white" strokeWidth="2" strokeDasharray="2 2" className="dark:stroke-black" />
          </>
        );
        break;
      case 'monitor':
        content = (
          <>
            <rect x="3" y="4" width="18" height="16" rx="4" stroke={fill} strokeWidth="2" fill="none" />
            <rect x="5" y="6" width="14" height="12" rx="2" stroke={fill} strokeWidth="1" fill="none" />
          </>
        );
        break;
      case 'brackets':
        content = (
          <>
            <path d="M 8 4 H 5 V 20 H 8" fill="none" stroke={fill} strokeWidth="2" />
            <path d="M 16 4 H 19 V 20 H 16" fill="none" stroke={fill} strokeWidth="2" />
          </>
        );
        break;
      case 'folded':
        content = (
          <>
            <polygon points="4,4 15,4 20,9 20,20 4,20" stroke={fill} strokeWidth="1.5" fill="none" />
            <polygon points="15,4 15,9 20,9" stroke={fill} strokeWidth="1.5" fill="none" />
          </>
        );
        break;
      case 'polygon':
        content = (
          <>
            <polygon points="8,3 16,3 21,8 21,16 16,21 8,21 3,16 3,8" stroke={fill} strokeWidth="1.5" fill="none" />
          </>
        );
        break;
      case 'cutout':
        content = (
          <>
            <path d="M 4 8 A 4 4 0 0 1 8 4 L 16 4 A 4 4 0 0 1 20 8 L 20 16 A 4 4 0 0 1 16 20 L 8 20 A 4 4 0 0 1 4 16 Z" stroke={fill} strokeWidth="1.5" fill="none" />
          </>
        );
        break;
    }
  }

  return (
    <svg viewBox={viewBox} className={`transition-all ${active ? 'text-accent-600 dark:text-accent-400 drop-shadow-md' : 'text-neutral-500 dark:text-neutral-400'} w-6 h-6 sm:w-8 sm:h-8 mb-1`}>
      {content}
    </svg>
  );
};

export function QRCodeEditorPage() {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();
  const notification = useNotification();
  const TABS = getTabs(t);
  const SOCIAL_LOGOS = getSocialLogos(t);
  const DATA_TYPES = getDataTypes(t);
  const PRESETS = getPresets(t);
  const [isLoading, setIsLoading] = useState(!!id);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('content');
  const [visiblePresetsCount, setVisiblePresetsCount] = useState(12);
  const [userPages, setUserPages] = useState<{ id: string; slug: string; title: string }[]>([]);

  useEffect(() => {
    pagesAPI.list().then(res => {
      setUserPages(res.pages);
    }).catch(() => {});
  }, []);

  const [qrCode, setQrCode] = useState<Partial<QRCode>>({
    name: '',
    url: '',
    size: 512,
    errorCorrection: 'H',
    foregroundColor: '#000000',
    backgroundColor: '#ffffff',
  });

  const [customization, setCustomization] = useState<Partial<QRCustomization>>({
    dotStyle: 'square',
    eyeFrameStyle: 'square',
    eyeBallStyle: 'square',
    gradientEnabled: false,
    gradientType: 'linear',
    gradientRotation: 0,
    gradientScale: 50,
    foregroundColor2: '#000000',
    bgGradientEnabled: false,
    bgGradientType: 'linear',
    bgGradientRotation: 0,
    bgGradientScale: 50,
    backgroundColor2: '#ffffff',
    textGradientEnabled: false,
    textGradientType: 'linear',
    textGradientRotation: 0,
    textGradientScale: 50,
    frameTextColor2: '#ffffff',
    frameTextPosition: 'bottom',
    backgroundImageUrl: '',
    frameStyle: 'none',
    frameText: 'SCAN ME',
    frameColor: '#000000',
    frameTextColor: '#ffffff',
    frameFontFamily: 'sans-serif',
    logoName: 'none',
    logoUrl: '',
    logoSize: 20,
    logoPadding: true,
    dataType: 'url',
    data: { url: '' },
  });

  useEffect(() => {
    if (id) {
      const fetchQRCode = async () => {
        try {
          const response = await qrAPI.get(id);
          const qr = response.qrCode as any;
          setQrCode({
            ...qr,
            foregroundColor: qr.customColors?.dark || qr.foregroundColor || '#000000',
            backgroundColor: qr.customColors?.light || qr.backgroundColor || '#ffffff',
          });
          if (response.qrCode.customization) {
            setCustomization({
              ...customization,
              ...response.qrCode.customization
            });
          } else if (response.qrCode.url) {
             setCustomization(prev => ({ ...prev, data: { ...prev.data, url: response.qrCode.url } }));
          }
        } catch (error) {
          notification.error(t('qrEditor.toasts.loadFailed'));
          navigate('/qr');
        } finally {
          setIsLoading(false);
        }
      };
      fetchQRCode();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, navigate]);

  const handleCustomizationChange = (key: keyof QRCustomization, value: any) => {
    setCustomization(prev => ({ ...prev, [key]: value }));
  };

  const handleDataChange = (key: string, value: string) => {
    setCustomization(prev => ({
      ...prev,
      data: { ...(prev.data || {}), [key]: value }
    }));
  };

  const applyPreset = (presetCustomization: any) => {
    setCustomization(prev => ({ ...prev, ...presetCustomization }));
    if (presetCustomization.foregroundColor) {
      setQrCode(prev => ({ ...prev, foregroundColor: presetCustomization.foregroundColor }));
    }
    if (presetCustomization.backgroundColor) {
      setQrCode(prev => ({ ...prev, backgroundColor: presetCustomization.backgroundColor }));
    }
    notification.success(t('qrEditor.toasts.presetApplied'));
  };

  const handleSave = async () => {
    if (!qrCode.name) {
      notification.error(t('qrEditor.toasts.nameRequired'));
      return;
    }

    const finalUrl = formatQRData(customization.dataType || 'url', customization.data || {});

    setIsSaving(true);
    try {
      const payload: any = {
        ...qrCode,
        url: finalUrl,
        customization,
        customColors: {
          dark: qrCode.foregroundColor,
          light: qrCode.backgroundColor,
        }
      };

      if (id) {
        const { id: _, ...data } = payload;
        await qrAPI.update(id, data);
        notification.success(t('qrEditor.toasts.updated'));
      } else {
        const response = await qrAPI.create(payload as CreateQRRequest);
        notification.success(t('qrEditor.toasts.created'));
        navigate(`/qr/${response.qrCode.id}`);
      }
    } catch (error: any) {
      console.error('Failed to save QR code:', error);
      notification.error(error?.message || t('qrEditor.toasts.saveFailed'));
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64 = event.target?.result as string;
        handleCustomizationChange('logoName', 'custom');
        handleCustomizationChange('logoUrl', base64);
        notification.success(t('qrEditor.toasts.logoUploaded'));
      };
      reader.onerror = () => notification.error(t('qrEditor.toasts.logoReadFailed'));
      reader.readAsDataURL(file);
    }
  };

  const handleBgUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64 = event.target?.result as string;
        handleCustomizationChange('backgroundImageUrl', base64);
        notification.success(t('qrEditor.toasts.bgUploaded'));
      };
      reader.onerror = () => notification.error(t('qrEditor.toasts.bgReadFailed'));
      reader.readAsDataURL(file);
    }
  };

  const finalQRUrl = formatQRData(customization.dataType || 'url', customization.data || {});

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-accent-600"></div>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-5rem)] flex flex-col gap-0 -mx-4 sm:-mx-6 lg:-mx-8">
      {/* ── Top Header Bar ── */}
      <div className="flex items-center justify-between px-4 sm:px-6 py-3 bg-white dark:bg-neutral-950 border-b border-neutral-200 dark:border-neutral-800 flex-shrink-0">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/qr')}
            className="p-2 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-400 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className="text-base font-bold text-neutral-900 dark:text-white leading-tight">
              {id ? t('qrEditor.editTitle') : t('qrEditor.newTitle')}
            </h1>
            <p className="text-xs text-neutral-400">
              {t('qrEditor.subtitle')}
            </p>
          </div>
        </div>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-accent-600 hover:bg-accent-700 text-white text-sm font-semibold transition-colors disabled:opacity-50 shadow-sm shadow-accent-600/20"
        >
          <Save className="w-4 h-4" />
          {isSaving ? t('qrEditor.buttons.saving') : t('qrEditor.buttons.save')}
        </button>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* ── Left vertical nav tabs ── */}
        <div className="flex-shrink-0 w-16 sm:w-52 bg-white dark:bg-neutral-950 border-r border-neutral-200 dark:border-neutral-800 flex flex-col py-3 gap-1">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-3 mx-2 px-3 py-2.5 rounded-xl text-left transition-all group ${
                  isActive
                    ? 'bg-accent-600 text-white shadow-sm'
                    : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:text-neutral-900 dark:hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                <span className="hidden sm:block">
                  <span className="block text-sm font-semibold leading-tight">{tab.label}</span>
                </span>
              </button>
            );
          })}
        </div>

        {/* ── Panel content ── */}
        <div className="flex-shrink-0 w-80 sm:w-[28rem] lg:w-[32rem] bg-neutral-50 dark:bg-neutral-900 border-r border-neutral-200 dark:border-neutral-800 overflow-y-auto">
          <div className="p-6">
            {/* CONTENT TAB */}
            {activeTab === 'content' && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-neutral-900 dark:text-white mb-2">
                    {t('qrEditor.fields.name')}
                  </label>
                  <input
                    type="text"
                    value={qrCode.name || ''}
                    onChange={(e) => setQrCode(prev => ({ ...prev, name: e.target.value }))}
                    placeholder={t('qrEditor.fields.namePlaceholder')}
                    className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-accent-600"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-900 dark:text-white mb-3">
                    {t('qrEditor.fields.dataType')}
                  </label>
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2">
                    {DATA_TYPES.map(type => (
                      <button
                        key={type.id}
                        onClick={() => handleCustomizationChange('dataType', type.id)}
                        className={`flex flex-col items-center justify-center gap-1.5 p-2.5 rounded-xl border-2 transition-all ${
                          customization.dataType === type.id
                            ? 'border-accent-600 bg-accent-50 dark:bg-accent-900/20 text-accent-700 dark:text-accent-400 shadow-sm'
                            : 'border-neutral-200 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300 hover:border-neutral-300 dark:hover:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-900'
                        }`}
                        title={type.label}
                      >
                        {type.image ? (
                          <img src={type.image} alt={type.label} className={`w-5 h-5 sm:w-6 sm:h-6 object-contain ${type.invertInDarkMode ? 'dark:invert' : ''}`} />
                        ) : type.Icon ? (
                          <type.Icon className="w-5 h-5 sm:w-6 sm:h-6 text-neutral-600 dark:text-neutral-300" />
                        ) : null}
                        <span className="text-[10px] sm:text-xs font-medium text-center leading-tight truncate w-full">{type.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-neutral-200 dark:border-neutral-800">
                  {customization.dataType === 'landing-page' && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-neutral-900 dark:text-white mb-2">{t('qrEditor.fields.selectLandingPage')}</label>
                        <select
                          value={customization.data?.pageId || ''}
                          onChange={(e) => {
                            const selectedPageId = e.target.value;
                            const selectedPage = userPages.find(p => p.id === selectedPageId);
                            const baseUrl = window.location.origin;
                            const url = selectedPage ? `${baseUrl}/p/${selectedPage.slug}` : '';
                            handleCustomizationChange('data', { pageId: selectedPageId, url });
                            setQrCode(prev => ({ ...prev, pageId: selectedPageId }));
                          }}
                          className="w-full px-3 py-2 rounded border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-accent-600"
                        >
                          <option value="">{t('qrEditor.fields.selectPage')}</option>
                          {userPages.map(page => (
                            <option key={page.id} value={page.id}>{page.title} ({page.slug})</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  )}

                  {['url', 'youtube', 'instagram', 'facebook', 'tiktok', 'twitter', 'linkedin', 'snapchat', 'spotify', 'twitch', 'pinterest', 'appstore', 'playstore', 'reddit', 'github', 'patreon', 'figma', 'notion', 'maps'].includes(customization.dataType || '') && (
                    <div>
                      <label className="block text-sm font-medium text-neutral-900 dark:text-white mb-2">{t('qrEditor.fields.urlLink')}</label>
                      <input
                        type="url"
                        value={customization.data?.url || ''}
                        onChange={(e) => handleDataChange('url', e.target.value)}
                        placeholder={customization.dataType === 'maps' ? t('qrEditor.fields.urlPlaceholder') : "https://..."}
                        className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-accent-600"
                      />
                    </div>
                  )}

                  {customization.dataType === 'wifi' && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-neutral-900 dark:text-white mb-2">{t('qrEditor.fields.ssid')}</label>
                        <input
                          type="text"
                          value={customization.data?.ssid || ''}
                          onChange={(e) => handleDataChange('ssid', e.target.value)}
                          className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-neutral-900 dark:text-white mb-2">{t('qrEditor.fields.password')}</label>
                        <input
                          type="text"
                          value={customization.data?.password || ''}
                          onChange={(e) => handleDataChange('password', e.target.value)}
                          className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-neutral-900 dark:text-white mb-2">{t('qrEditor.fields.encryption')}</label>
                        <select
                          value={customization.data?.encryption || 'WPA'}
                          onChange={(e) => handleDataChange('encryption', e.target.value)}
                          className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white"
                        >
                          <option value="WPA">{t('qrEditor.wifi.wpa')}</option>
                          <option value="WEP">{t('qrEditor.wifi.wep')}</option>
                          <option value="nopass">{t('qrEditor.wifi.none')}</option>
                        </select>
                      </div>
                    </div>
                  )}

                  {customization.dataType === 'text' && (
                    <div>
                      <label className="block text-sm font-medium text-neutral-900 dark:text-white mb-2">{t('qrEditor.fields.textContent')}</label>
                      <textarea
                        value={customization.data?.text || ''}
                        onChange={(e) => handleDataChange('text', e.target.value)}
                        rows={4}
                        className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white"
                      />
                    </div>
                  )}

                  {(customization.dataType === 'phone' || customization.dataType === 'sms' || customization.dataType === 'whatsapp') && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-neutral-900 dark:text-white mb-2">{t('qrEditor.fields.phoneNumber')}</label>
                        <input
                          type="tel"
                          value={customization.data?.phone || ''}
                          onChange={(e) => handleDataChange('phone', e.target.value)}
                          placeholder={t('qrEditor.fields.phonePlaceholder')}
                          className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white"
                        />
                      </div>
                      {customization.dataType !== 'phone' && (
                        <div>
                          <label className="block text-sm font-medium text-neutral-900 dark:text-white mb-2">{t('qrEditor.fields.message')}</label>
                          <textarea
                            value={customization.data?.message || ''}
                            onChange={(e) => handleDataChange('message', e.target.value)}
                            rows={3}
                            className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white"
                          />
                        </div>
                      )}
                    </div>
                  )}

                  {customization.dataType === 'email' && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-neutral-900 dark:text-white mb-2">{t('qrEditor.fields.emailAddress')}</label>
                        <input
                          type="email"
                          value={customization.data?.email || ''}
                          onChange={(e) => handleDataChange('email', e.target.value)}
                          className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-neutral-900 dark:text-white mb-2">{t('qrEditor.fields.subject')}</label>
                        <input
                          type="text"
                          value={customization.data?.subject || ''}
                          onChange={(e) => handleDataChange('subject', e.target.value)}
                          className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-neutral-900 dark:text-white mb-2">{t('qrEditor.fields.messageBody')}</label>
                        <textarea
                          value={customization.data?.body || ''}
                          onChange={(e) => handleDataChange('body', e.target.value)}
                          rows={3}
                          className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white"
                        />
                      </div>
                    </div>
                  )}

                  {customization.dataType === 'paypal' && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-neutral-900 dark:text-white mb-2">{t('qrEditor.fields.paypalUsername')}</label>
                        <input
                          type="text"
                          value={customization.data?.username || ''}
                          onChange={(e) => handleDataChange('username', e.target.value)}
                          placeholder={t('qrEditor.fields.paypalPlaceholder')}
                          className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-neutral-900 dark:text-white mb-2">{t('qrEditor.fields.amountOptional')}</label>
                        <input
                          type="number"
                          value={customization.data?.amount || ''}
                          onChange={(e) => handleDataChange('amount', e.target.value)}
                          placeholder={t('qrEditor.fields.paypalAmountPlaceholder')}
                          className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white"
                        />
                      </div>
                    </div>
                  )}

                  {customization.dataType === 'bitcoin' && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-neutral-900 dark:text-white mb-2">{t('qrEditor.fields.bitcoinAddress')}</label>
                        <input
                          type="text"
                          value={customization.data?.address || ''}
                          onChange={(e) => handleDataChange('address', e.target.value)}
                          placeholder={t('qrEditor.fields.btcPlaceholder')}
                          className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-neutral-900 dark:text-white mb-2">{t('qrEditor.fields.amountOptionalBtc')}</label>
                        <input
                          type="number"
                          step="0.0001"
                          value={customization.data?.amount || ''}
                          onChange={(e) => handleDataChange('amount', e.target.value)}
                          placeholder={t('qrEditor.fields.btcAmountPlaceholder')}
                          className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white"
                        />
                      </div>
                    </div>
                  )}
                  
                  {customization.dataType === 'telegram' && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-neutral-900 dark:text-white mb-2">{t('qrEditor.fields.telegramUsername')}</label>
                        <input
                          type="text"
                          value={customization.data?.username || ''}
                          onChange={(e) => handleDataChange('username', e.target.value)}
                          placeholder={t('qrEditor.fields.telegramPlaceholder')}
                          className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white"
                        />
                      </div>
                    </div>
                  )}

                  {customization.dataType === 'discord' && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-neutral-900 dark:text-white mb-2">{t('qrEditor.fields.discordInviteCode')}</label>
                        <input
                          type="text"
                          value={customization.data?.invite || ''}
                          onChange={(e) => handleDataChange('invite', e.target.value)}
                          placeholder={t('qrEditor.fields.discordPlaceholder')}
                          className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white"
                        />
                      </div>
                    </div>
                  )}
                  
                  {customization.dataType === 'zoom' && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-neutral-900 dark:text-white mb-2">{t('qrEditor.fields.meetingId')}</label>
                        <input
                          type="text"
                          value={customization.data?.meetingId || ''}
                          onChange={(e) => handleDataChange('meetingId', e.target.value)}
                          placeholder={t('qrEditor.fields.zoomMeetingPlaceholder')}
                          className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-neutral-900 dark:text-white mb-2">{t('qrEditor.fields.passwordOptional')}</label>
                        <input
                          type="text"
                          value={customization.data?.password || ''}
                          onChange={(e) => handleDataChange('password', e.target.value)}
                          placeholder={t('qrEditor.fields.zoomPasswordPlaceholder')}
                          className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white"
                        />
                      </div>
                    </div>
                  )}

                  {customization.dataType === 'slack' && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-neutral-900 dark:text-white mb-2">{t('qrEditor.fields.workspaceUrl')}</label>
                        <div className="flex items-center">
                          <span className="px-3 py-2.5 rounded-l-xl border border-r-0 border-neutral-200 dark:border-neutral-700 bg-neutral-100 dark:bg-neutral-800 text-neutral-500">https://</span>
                          <input
                            type="text"
                            value={customization.data?.workspace || ''}
                            onChange={(e) => handleDataChange('workspace', e.target.value)}
                            placeholder={t('qrEditor.fields.slackPlaceholder')}
                            className="w-full px-4 py-2.5 border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-accent-600"
                          />
                          <span className="px-3 py-2.5 rounded-r-xl border border-l-0 border-neutral-200 dark:border-neutral-700 bg-neutral-100 dark:bg-neutral-800 text-neutral-500">.slack.com</span>
                        </div>
                      </div>
                    </div>
                  )}

                </div>
              </div>
            )}

            {/* DESIGN TAB */}
            {activeTab === 'design' && (
              <div className="space-y-8">
                <div className="p-5 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-sm">
                  <div className="flex justify-between text-sm font-bold text-neutral-900 dark:text-white mb-4 uppercase tracking-wider">
                    <span>{t('qrEditor.design.density')}</span>
                    <span className="text-accent-600">{!customization.qrVersion || customization.qrVersion === 0 ? t('qrEditor.design.auto') : customization.qrVersion}</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="10"
                    step="1"
                    defaultValue={customization.qrVersion || 0}
                    onMouseUp={(e) => handleCustomizationChange('qrVersion', parseInt((e.target as HTMLInputElement).value))}
                    onTouchEnd={(e) => handleCustomizationChange('qrVersion', parseInt((e.target as HTMLInputElement).value))}
                    className="w-full accent-accent-600 cursor-pointer h-2 bg-neutral-200 dark:bg-neutral-700 rounded-lg appearance-none"
                  />
                  <div className="flex justify-between text-xs text-neutral-500 mt-3 font-medium px-1">
                    <span>{t('qrEditor.design.autoClean')}</span>
                    <span>{t('qrEditor.design.proportionalIncrease')}</span>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-neutral-900 dark:text-white mb-3 uppercase tracking-wider">{t('qrEditor.design.dotStyle')}</h3>
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                    {['square', 'dots', 'rounded', 'classy', 'star', 'diamond', 'hexagon', 'fluid', 'cross', 'heart', 'triangle', 'drop', 'ninja', 'sparkle', 'pill'].map((style) => (
                      <button
                        key={style}
                        onClick={() => handleCustomizationChange('dotStyle', style)}
                        className={`flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all capitalize font-medium text-xs text-neutral-900 dark:text-white ${customization.dotStyle === style ? 'border-accent-600 bg-accent-50 dark:bg-accent-900/20 text-accent-700 dark:text-accent-400' : 'border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-900'}`}
                      >
                        <StyleIcon type="dot" styleName={style} active={customization.dotStyle === style} />
                        <span className="truncate w-full text-center mt-1">{style}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-neutral-900 dark:text-white mb-3 uppercase tracking-wider">{t('qrEditor.design.eyeOuterFrame')}</h3>
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                    {['square', 'rounded', 'circle', 'leaf', 'octagon', 'star', 'shield', 'hexagon', 'diamond', 'triangle', 'drop', 'ninja', 'sparkle', 'pill'].map((style) => (
                      <button
                        key={style}
                        onClick={() => handleCustomizationChange('eyeFrameStyle', style)}
                        className={`flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all capitalize font-medium text-xs text-neutral-900 dark:text-white ${customization.eyeFrameStyle === style ? 'border-accent-600 bg-accent-50 dark:bg-accent-900/20 text-accent-700 dark:text-accent-400' : 'border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-900'}`}
                      >
                        <StyleIcon type="frame" styleName={style} active={customization.eyeFrameStyle === style} />
                        <span className="truncate w-full text-center mt-1">{style}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-neutral-900 dark:text-white mb-3 uppercase tracking-wider">{t('qrEditor.design.eyeInnerBall')}</h3>
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                    {['square', 'rounded', 'circle', 'leaf', 'diamond', 'cross', 'star', 'shield', 'hexagon', 'triangle', 'drop', 'ninja', 'sparkle', 'pill'].map((style) => (
                      <button
                        key={style}
                        onClick={() => handleCustomizationChange('eyeBallStyle', style)}
                        className={`flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all capitalize font-medium text-xs text-neutral-900 dark:text-white ${customization.eyeBallStyle === style ? 'border-accent-600 bg-accent-50 dark:bg-accent-900/20 text-accent-700 dark:text-accent-400' : 'border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-900'}`}
                      >
                        <StyleIcon type="ball" styleName={style} active={customization.eyeBallStyle === style} />
                        <span className="truncate w-full text-center mt-1">{style}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* COLORS TAB */}
            {activeTab === 'colors' && (
              <div className="space-y-6">
                {/* Background Image Upload */}
                <div className="p-5 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-sm space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-neutral-900 dark:text-white">{t('qrEditor.colors.backgroundImage')}</h3>
                      <p className="text-sm text-neutral-500">{t('qrEditor.colors.uploadBackgroundDesc')}</p>
                    </div>
                    {customization.backgroundImageUrl && (
                      <button 
                        onClick={() => handleCustomizationChange('backgroundImageUrl', '')}
                        className="text-xs text-red-500 hover:text-red-600 font-medium px-2 py-1 bg-red-50 dark:bg-red-500/10 rounded-md transition-colors"
                      >
                        {t('qrEditor.bgUpload.remove')}
                      </button>
                    )}
                  </div>
                  
                  <label className="flex flex-col items-center justify-center gap-2 px-6 py-6 rounded-xl border-2 border-dashed border-neutral-300 dark:border-neutral-700 hover:border-accent-600 hover:bg-neutral-50 dark:hover:bg-neutral-800/50 cursor-pointer w-full transition-all group overflow-hidden relative">
                    {customization.backgroundImageUrl ? (
                      <div className="absolute inset-0">
                        <img src={customization.backgroundImageUrl} alt="Background Preview" className="w-full h-full object-cover opacity-50 group-hover:opacity-30 transition-opacity" />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="font-bold text-neutral-900 dark:text-white drop-shadow-md bg-white/80 dark:bg-black/80 px-3 py-1.5 rounded-lg">{t('qrEditor.bgUpload.change')}</span>
                        </div>
                      </div>
                    ) : (
                      <>
                        <Upload className="w-8 h-8 text-neutral-400 group-hover:text-accent-600 transition-colors" />
                        <span className="font-medium text-neutral-600 dark:text-neutral-400 group-hover:text-accent-600">{t('qrEditor.bgUpload.choose')}</span>
                      </>
                    )}
                    <input type="file" accept="image/*" onChange={handleBgUpload} className="hidden" />
                  </label>
                </div>


                {/* FOREGROUND GRADIENT */}
                <div className="p-5 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-sm space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-neutral-900 dark:text-white">{t('qrEditor.colors.foregroundGradient')}</h3>
                      <p className="text-sm text-neutral-500">{t('qrEditor.colors.foregroundGradientDesc')}</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={customization.gradientEnabled}
                        onChange={(e) => handleCustomizationChange('gradientEnabled', e.target.checked)}
                      />
                      <div className="w-11 h-6 bg-neutral-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-accent-300 dark:peer-focus:ring-accent-800 rounded-full peer dark:bg-neutral-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-neutral-600 peer-checked:bg-accent-600"></div>
                    </label>
                  </div>

                  {customization.gradientEnabled && (
                    <div className="space-y-6 pt-4 border-t border-neutral-100 dark:border-neutral-800">
                      <div>
                        <label className="block text-sm font-medium text-neutral-900 dark:text-white mb-2">{t('qrEditor.colors.gradientType')}</label>
                        <select
                          value={customization.gradientType}
                          onChange={(e) => handleCustomizationChange('gradientType', e.target.value)}
                          className="w-full px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white"
                        >
                          <option value="linear">{t('qrEditor.colors.linear')}</option>
                          <option value="radial">{t('qrEditor.colors.radial')}</option>
                        </select>
                      </div>
                      
                      {customization.gradientType === 'linear' && (
                        <div>
                          <div className="flex justify-between text-sm font-medium mb-2 text-neutral-900 dark:text-white">
                            <span>{t('qrEditor.colors.gradientAngle')}</span>
                            <span className="text-accent-600">{customization.gradientRotation || 0}°</span>
                          </div>
                          <input
                            type="range"
                            min="0"
                            max="360"
                            value={customization.gradientRotation || 0}
                            onChange={(e) => handleCustomizationChange('gradientRotation', parseInt(e.target.value))}
                            className="w-full accent-accent-600 cursor-pointer h-2 bg-neutral-200 dark:bg-neutral-700 rounded-lg appearance-none"
                          />
                        </div>
                      )}

                      {customization.gradientType === 'radial' && (
                        <div>
                          <div className="flex justify-between text-sm font-medium mb-2 text-neutral-900 dark:text-white">
                            <span>{t('qrEditor.colors.radialScale')}</span>
                            <span className="text-accent-600">{customization.gradientScale || 50}%</span>
                          </div>
                          <input
                            type="range"
                            min="10"
                            max="150"
                            value={customization.gradientScale || 50}
                            onChange={(e) => handleCustomizationChange('gradientScale', parseInt(e.target.value))}
                            className="w-full accent-accent-600 cursor-pointer h-2 bg-neutral-200 dark:bg-neutral-700 rounded-lg appearance-none"
                          />
                        </div>
                      )}
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-6 pt-4 border-t border-neutral-100 dark:border-neutral-800">
                    <div>
                      <label className="block text-sm font-medium text-neutral-900 dark:text-white mb-2">
                        {customization.gradientEnabled ? t('qrEditor.colors.startColor') : t('qrEditor.colors.foregroundColor')}
                      </label>
                      <div className="flex items-center gap-3">
                        <input
                          type="color"
                          value={qrCode.foregroundColor || '#000000'}
                          onChange={(e) => setQrCode(prev => ({ ...prev, foregroundColor: e.target.value }))}
                          className="w-12 h-12 rounded-lg cursor-pointer border-0 p-0 shadow-sm"
                        />
                        <input
                          type="text"
                          value={qrCode.foregroundColor || '#000000'}
                          onChange={(e) => setQrCode(prev => ({ ...prev, foregroundColor: e.target.value }))}
                          className="flex-1 px-3 py-2.5 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-white uppercase font-mono text-sm shadow-inner"
                        />
                      </div>
                    </div>

                    {customization.gradientEnabled && (
                      <div>
                        <label className="block text-sm font-medium text-neutral-900 dark:text-white mb-2">{t('qrEditor.colors.endColor')}</label>
                        <div className="flex items-center gap-3">
                          <input
                            type="color"
                            value={customization.foregroundColor2 || '#000000'}
                            onChange={(e) => handleCustomizationChange('foregroundColor2', e.target.value)}
                            className="w-12 h-12 rounded-lg cursor-pointer border-0 p-0 shadow-sm"
                          />
                          <input
                            type="text"
                            value={customization.foregroundColor2 || '#000000'}
                            onChange={(e) => handleCustomizationChange('foregroundColor2', e.target.value)}
                            className="flex-1 px-3 py-2.5 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-white uppercase font-mono text-sm shadow-inner"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* BACKGROUND GRADIENT */}
                <div className="p-5 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-sm space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-neutral-900 dark:text-white">{t('qrEditor.colors.backgroundGradient')}</h3>
                      <p className="text-sm text-neutral-500">{t('qrEditor.colors.backgroundGradientDesc')}</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={customization.bgGradientEnabled}
                        onChange={(e) => handleCustomizationChange('bgGradientEnabled', e.target.checked)}
                      />
                      <div className="w-11 h-6 bg-neutral-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-accent-300 dark:peer-focus:ring-accent-800 rounded-full peer dark:bg-neutral-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-neutral-600 peer-checked:bg-accent-600"></div>
                    </label>
                  </div>

                  {customization.bgGradientEnabled && (
                    <div className="space-y-6 pt-4 border-t border-neutral-100 dark:border-neutral-800">
                      <div>
                        <label className="block text-sm font-medium text-neutral-900 dark:text-white mb-2">{t('qrEditor.colors.gradientType')}</label>
                        <select
                          value={customization.bgGradientType || 'linear'}
                          onChange={(e) => handleCustomizationChange('bgGradientType', e.target.value)}
                          className="w-full px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white"
                        >
                          <option value="linear">{t('qrEditor.colors.linear')}</option>
                          <option value="radial">{t('qrEditor.colors.radial')}</option>
                        </select>
                      </div>
                      
                      {customization.bgGradientType === 'linear' && (
                        <div>
                          <div className="flex justify-between text-sm font-medium mb-2 text-neutral-900 dark:text-white">
                            <span>{t('qrEditor.colors.gradientAngle')}</span>
                            <span className="text-accent-600">{customization.bgGradientRotation || 0}°</span>
                          </div>
                          <input
                            type="range"
                            min="0"
                            max="360"
                            value={customization.bgGradientRotation || 0}
                            onChange={(e) => handleCustomizationChange('bgGradientRotation', parseInt(e.target.value))}
                            className="w-full accent-accent-600 cursor-pointer h-2 bg-neutral-200 dark:bg-neutral-700 rounded-lg appearance-none"
                          />
                        </div>
                      )}

                      {customization.bgGradientType === 'radial' && (
                        <div>
                          <div className="flex justify-between text-sm font-medium mb-2 text-neutral-900 dark:text-white">
                            <span>{t('qrEditor.colors.radialScale')}</span>
                            <span className="text-accent-600">{customization.bgGradientScale || 50}%</span>
                          </div>
                          <input
                            type="range"
                            min="10"
                            max="150"
                            value={customization.bgGradientScale || 50}
                            onChange={(e) => handleCustomizationChange('bgGradientScale', parseInt(e.target.value))}
                            className="w-full accent-accent-600 cursor-pointer h-2 bg-neutral-200 dark:bg-neutral-700 rounded-lg appearance-none"
                          />
                        </div>
                      )}
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-6 pt-4 border-t border-neutral-100 dark:border-neutral-800">
                    <div>
                      <label className="block text-sm font-medium text-neutral-900 dark:text-white mb-2">
                        {customization.bgGradientEnabled ? t('qrEditor.colors.startColor') : t('qrEditor.colors.backgroundColor')}
                      </label>
                      <div className="flex items-center gap-3">
                        <input
                          type="color"
                          value={qrCode.backgroundColor || '#ffffff'}
                          onChange={(e) => setQrCode(prev => ({ ...prev, backgroundColor: e.target.value }))}
                          className="w-12 h-12 rounded-lg cursor-pointer border-0 p-0 shadow-sm"
                        />
                        <input
                          type="text"
                          value={qrCode.backgroundColor || '#ffffff'}
                          onChange={(e) => setQrCode(prev => ({ ...prev, backgroundColor: e.target.value }))}
                          className="flex-1 px-3 py-2.5 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-white uppercase font-mono text-sm shadow-inner"
                        />
                      </div>
                    </div>

                    {customization.bgGradientEnabled && (
                      <div>
                        <label className="block text-sm font-medium text-neutral-900 dark:text-white mb-2">{t('qrEditor.colors.endColor')}</label>
                        <div className="flex items-center gap-3">
                          <input
                            type="color"
                            value={customization.backgroundColor2 || '#ffffff'}
                            onChange={(e) => handleCustomizationChange('backgroundColor2', e.target.value)}
                            className="w-12 h-12 rounded-lg cursor-pointer border-0 p-0 shadow-sm"
                          />
                          <input
                            type="text"
                            value={customization.backgroundColor2 || '#ffffff'}
                            onChange={(e) => handleCustomizationChange('backgroundColor2', e.target.value)}
                            className="flex-1 px-3 py-2.5 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-white uppercase font-mono text-sm shadow-inner"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                {/* LOGO SECTION (Merged into Colors) */}
                <div className="pt-6 border-t border-neutral-200 dark:border-neutral-800">
                  <h3 className="text-sm font-bold text-neutral-900 dark:text-white mb-3 uppercase tracking-wider">{t('qrEditor.logo.uploadCustom')}</h3>
                  <div className="flex items-center gap-4">
                    <label className="flex items-center justify-center gap-2 px-6 py-4 rounded-xl border-2 border-dashed border-neutral-300 dark:border-neutral-700 hover:border-accent-600 hover:bg-neutral-50 dark:hover:bg-neutral-900 cursor-pointer w-full transition-all">
                      <Upload className="w-5 h-5 text-neutral-500" />
                      <span className="font-medium text-neutral-700 dark:text-neutral-300">{t('qrEditor.logo.chooseImage')}</span>
                      <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
                    </label>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-neutral-900 dark:text-white mb-3 uppercase tracking-wider">{t('qrEditor.logo.builtin')}</h3>
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
                    {SOCIAL_LOGOS.map((logo) => (
                      <button
                        key={logo.name}
                        onClick={() => {
                          handleCustomizationChange('logoName', logo.name);
                          handleCustomizationChange('logoUrl', logo.url);
                        }}
                        className={`p-4 rounded-2xl border-2 flex flex-col items-center justify-center gap-2.5 transition-all ${customization.logoName === logo.name ? 'border-accent-600 bg-accent-50 dark:bg-accent-900/20 shadow-sm' : 'border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-900'}`}
                        title={logo.label}
                      >
                        {logo.url ? (
                          <img src={logo.url} alt={logo.label} className={`w-8 h-8 object-contain ${logo.invertInDarkMode ? 'dark:invert' : ''}`} />
                        ) : (
                          <span className="text-sm font-bold text-neutral-500 dark:text-neutral-400">{t('qrEditor.logo.none')}</span>
                        )}
                        {logo.name !== 'none' && <span className="text-xs font-semibold text-neutral-600 dark:text-neutral-400 truncate w-full text-center">{logo.label}</span>}
                      </button>
                    ))}
                  </div>
                </div>

                {customization.logoUrl && (
                  <div className="pt-4 border-t border-neutral-200 dark:border-neutral-800 space-y-6">
                    <div>
                      <div className="flex justify-between text-sm font-medium mb-2 text-neutral-900 dark:text-white">
                        <span>{t('qrEditor.logo.size')}</span>
                        <span className="text-accent-600">{customization.logoSize}%</span>
                      </div>
                      <input
                        type="range"
                        min="10"
                        max="35"
                        value={customization.logoSize}
                        onChange={(e) => handleCustomizationChange('logoSize', parseInt(e.target.value))}
                        className="w-full accent-accent-600 cursor-pointer h-2 bg-neutral-200 dark:bg-neutral-700 rounded-lg appearance-none"
                      />
                    </div>
                    
                    <div className="flex items-center justify-between p-4 bg-neutral-50 dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800">
                      <div>
                        <h3 className="font-bold text-neutral-900 dark:text-white">{t('qrEditor.logo.clearBg')}</h3>
                        <p className="text-sm text-neutral-500">{t('qrEditor.logo.clearBgDesc')}</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          className="sr-only peer"
                          checked={customization.logoPadding}
                          onChange={(e) => handleCustomizationChange('logoPadding', e.target.checked)}
                        />
                        <div className="w-11 h-6 bg-neutral-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-accent-300 dark:peer-focus:ring-accent-800 rounded-full peer dark:bg-neutral-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-neutral-600 peer-checked:bg-accent-600"></div>
                      </label>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* FRAME TAB */}
            {activeTab === 'frame' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-bold text-neutral-900 dark:text-white mb-3 uppercase tracking-wider">{t('qrEditor.frame.style')}</h3>
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                    {['none', 'bubble', 'border', 'badge', 'solid', 'shadow', 'vintage', 'ticket', 'minimal', 'polaroid', 'browser', 'neon', 'glass', 'cyberpunk', 'glowing', 'retro', 'dashed', 'dotted', 'double', 'crosshairs', 'film', 'monitor', 'brackets', 'folded', 'polygon', 'cutout'].map((style) => (
                      <button
                        key={style}
                        onClick={() => handleCustomizationChange('frameStyle', style)}
                        className={`flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all capitalize font-medium text-xs text-neutral-900 dark:text-white ${customization.frameStyle === style ? 'border-accent-600 bg-accent-50 dark:bg-accent-900/20 text-accent-700 dark:text-accent-400' : 'border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-900'}`}
                      >
                        <StyleIcon type="frameStyle" styleName={style} active={customization.frameStyle === style} />
                        <span className="truncate w-full text-center mt-1">{style}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {customization.frameStyle !== 'none' && (
                  <div className="p-5 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 space-y-5 shadow-sm">
                    <div>
                      <label className="block text-sm font-bold text-neutral-900 dark:text-white mb-2">{t('qrEditor.frame.textPosition')}</label>
                      <div className="grid grid-cols-4 gap-2">
                        {['top', 'bottom', 'left', 'right'].map((pos) => (
                          <button
                            key={pos}
                            onClick={() => handleCustomizationChange('frameTextPosition', pos)}
                            className={`py-2 rounded-lg border-2 transition-all capitalize font-bold text-xs text-neutral-900 dark:text-white ${customization.frameTextPosition === pos ? 'border-accent-600 bg-accent-50 dark:bg-accent-900/20 text-accent-700 dark:text-accent-400' : 'border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-900'}`}
                          >
                            {pos}
                          </button>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-bold text-neutral-900 dark:text-white mb-2">{t('qrEditor.frame.frameText')}</label>
                      <input
                        type="text"
                        value={customization.frameText || ''}
                        onChange={(e) => handleCustomizationChange('frameText', e.target.value)}
                        placeholder={t('qrEditor.frame.textDefault')}
                        maxLength={30}
                        className="w-full px-4 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-950 text-neutral-900 dark:text-white shadow-inner focus:outline-none focus:ring-2 focus:ring-accent-600"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-bold text-neutral-900 dark:text-white mb-2">{t('qrEditor.frame.fontFamily')}</label>
                      <select
                        value={customization.frameFontFamily || 'sans-serif'}
                        onChange={(e) => handleCustomizationChange('frameFontFamily', e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-950 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-accent-600"
                      >
                        <option value="sans-serif">{t('qrEditor.frame.fonts.sansSerif')}</option>
                        <option value="serif">{t('qrEditor.frame.fonts.serif')}</option>
                        <option value="monospace">{t('qrEditor.frame.fonts.monospace')}</option>
                        <option value="cursive">{t('qrEditor.frame.fonts.cursive')}</option>
                        <option value="fantasy">{t('qrEditor.frame.fonts.fantasy')}</option>
                        <option value="Arial, sans-serif">Arial</option>
                        <option value="'Courier New', monospace">Courier New</option>
                        <option value="'Times New Roman', serif">Times New Roman</option>
                        <option value="Impact, fantasy">Impact</option>
                        <option value="'Comic Sans MS', cursive">Comic Sans MS</option>
                        <option value="'Trebuchet MS', sans-serif">Trebuchet MS</option>
                        <option value="'Lucida Console', Monaco, monospace">Lucida Console</option>
                        <option value="Georgia, serif">Georgia</option>
                        <option value="'Palatino Linotype', 'Book Antiqua', Palatino, serif">Palatino</option>
                        <option value="Tahoma, Geneva, sans-serif">Tahoma</option>
                        <option value="'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif">Franklin Gothic</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-neutral-900 dark:text-white mb-2">{t('qrEditor.frame.color')}</label>
                      <div className="flex items-center gap-3 w-1/2">
                        <input
                          type="color"
                          value={customization.frameColor || '#000000'}
                          onChange={(e) => handleCustomizationChange('frameColor', e.target.value)}
                          className="w-12 h-12 rounded-lg cursor-pointer border-0 p-0 shadow-sm"
                        />
                        <input
                          type="text"
                          value={customization.frameColor || '#000000'}
                          onChange={(e) => handleCustomizationChange('frameColor', e.target.value)}
                          className="flex-1 px-3 py-2.5 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-950 text-neutral-900 dark:text-white uppercase font-mono text-sm shadow-inner"
                        />
                      </div>
                    </div>

                    {/* TEXT GRADIENT */}
                    <div className="pt-6 border-t border-neutral-200 dark:border-neutral-800">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="font-bold text-neutral-900 dark:text-white">{t('qrEditor.frame.textGradientTitle')}</h3>
                          <p className="text-sm text-neutral-500">{t('qrEditor.frame.textGradientDesc')}</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            className="sr-only peer"
                            checked={customization.textGradientEnabled}
                            onChange={(e) => handleCustomizationChange('textGradientEnabled', e.target.checked)}
                          />
                          <div className="w-11 h-6 bg-neutral-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-accent-300 dark:peer-focus:ring-accent-800 rounded-full peer dark:bg-neutral-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-neutral-600 peer-checked:bg-accent-600"></div>
                        </label>
                      </div>

                      {customization.textGradientEnabled && (
                        <div className="space-y-4 mb-4">
                          <div>
                            <label className="block text-sm font-medium text-neutral-900 dark:text-white mb-2">{t('qrEditor.colors.gradientType')}</label>
                            <select
                              value={customization.textGradientType || 'linear'}
                              onChange={(e) => handleCustomizationChange('textGradientType', e.target.value)}
                              className="w-full px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white"
                            >
                              <option value="linear">{t('qrEditor.colors.linear')}</option>
                              <option value="radial">{t('qrEditor.colors.radial')}</option>
                            </select>
                          </div>
                          
                          {customization.textGradientType === 'linear' && (
                            <div>
                              <div className="flex justify-between text-sm font-medium mb-2 text-neutral-900 dark:text-white">
                            <span>{t('qrEditor.colors.gradientAngle')}</span>
                                <span className="text-accent-600">{customization.textGradientRotation || 0}°</span>
                              </div>
                              <input
                                type="range"
                                min="0"
                                max="360"
                                value={customization.textGradientRotation || 0}
                                onChange={(e) => handleCustomizationChange('textGradientRotation', parseInt(e.target.value))}
                                className="w-full accent-accent-600 cursor-pointer h-2 bg-neutral-200 dark:bg-neutral-700 rounded-lg appearance-none"
                              />
                            </div>
                          )}

                          {customization.textGradientType === 'radial' && (
                            <div>
                              <div className="flex justify-between text-sm font-medium mb-2 text-neutral-900 dark:text-white">
                                <span>{t('qrEditor.colors.radialScale')}</span>
                                <span className="text-accent-600">{customization.textGradientScale || 50}%</span>
                              </div>
                              <input
                                type="range"
                                min="10"
                                max="150"
                                value={customization.textGradientScale || 50}
                                onChange={(e) => handleCustomizationChange('textGradientScale', parseInt(e.target.value))}
                                className="w-full accent-accent-600 cursor-pointer h-2 bg-neutral-200 dark:bg-neutral-700 rounded-lg appearance-none"
                              />
                            </div>
                          )}
                        </div>
                      )}

                      <div className="grid grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-bold text-neutral-900 dark:text-white mb-2">
                            {customization.textGradientEnabled ? t('qrEditor.colors.startColor') : t('qrEditor.frame.textBaseColor')}
                          </label>
                          <div className="flex items-center gap-3">
                            <input
                              type="color"
                              value={customization.frameTextColor || '#ffffff'}
                              onChange={(e) => handleCustomizationChange('frameTextColor', e.target.value)}
                              className="w-12 h-12 rounded-lg cursor-pointer border-0 p-0 shadow-sm"
                            />
                            <input
                              type="text"
                              value={customization.frameTextColor || '#ffffff'}
                              onChange={(e) => handleCustomizationChange('frameTextColor', e.target.value)}
                              className="flex-1 px-3 py-2.5 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-950 text-neutral-900 dark:text-white uppercase font-mono text-sm shadow-inner"
                            />
                          </div>
                        </div>

                        {customization.textGradientEnabled && (
                          <div>
                            <label className="block text-sm font-bold text-neutral-900 dark:text-white mb-2">{t('qrEditor.colors.endColor')}</label>
                            <div className="flex items-center gap-3">
                              <input
                                type="color"
                                value={customization.frameTextColor2 || '#ffffff'}
                                onChange={(e) => handleCustomizationChange('frameTextColor2', e.target.value)}
                                className="w-12 h-12 rounded-lg cursor-pointer border-0 p-0 shadow-sm"
                              />
                              <input
                                type="text"
                                value={customization.frameTextColor2 || '#ffffff'}
                                onChange={(e) => handleCustomizationChange('frameTextColor2', e.target.value)}
                                className="flex-1 px-3 py-2.5 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-950 text-neutral-900 dark:text-white uppercase font-mono text-sm shadow-inner"
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* PRESETS TAB */}
            {activeTab === 'presets' && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {PRESETS.slice(0, visiblePresetsCount).map((preset) => (
                    <button
                      key={preset.name}
                      onClick={() => applyPreset(preset.customization)}
                      className="rounded-xl border-2 border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 hover:border-accent-600 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-all text-left flex flex-col overflow-hidden shadow-sm group"
                    >
                      <div className="w-full bg-neutral-100 dark:bg-neutral-950/50 flex items-center justify-center border-b border-neutral-200 dark:border-neutral-800 overflow-hidden">
                        <QRGenerator
                          value="https://linkora.app"
                          size={180}
                          customization={preset.customization as any}
                          previewMode={true}
                          className="pointer-events-none group-hover:scale-105 transition-transform"
                        />
                      </div>
                      <div className="p-3 flex flex-col gap-0.5">
                        <span className="font-bold text-sm text-neutral-900 dark:text-white truncate w-full">{preset.name}</span>
                        <span className="text-[10px] font-medium text-neutral-500 dark:text-neutral-400 capitalize truncate w-full">
                          {preset.customization.dotStyle} • {preset.customization.frameStyle}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
                
                {PRESETS.length > 12 && (
                  <div className="flex justify-center pt-2">
                    <button
                      onClick={() => {
                        if (visiblePresetsCount >= PRESETS.length) {
                          setVisiblePresetsCount(12);
                        } else {
                          setVisiblePresetsCount(prev => prev + 12);
                        }
                      }}
                      className="px-6 py-2.5 rounded-xl border-2 border-accent-600 text-accent-600 font-bold hover:bg-accent-50 dark:hover:bg-accent-900/20 transition-all shadow-sm"
                    >
                      {visiblePresetsCount >= PRESETS.length ? t('qrEditor.presets.showLess') : t('qrEditor.presets.showMore')}
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* ── Live preview ── */}
        <div className="flex-1 overflow-y-auto bg-neutral-100 dark:bg-neutral-900 flex items-start justify-center p-6 lg:p-12">
          <div className="w-full max-w-md">
            <h2 className="text-xl font-bold mb-4 text-neutral-900 dark:text-white hidden sm:block">{t('qrEditor.livePreview')}</h2>
            <div className="bg-white dark:bg-neutral-950 p-4 rounded-2xl shadow-sm border border-neutral-200 dark:border-neutral-800">
              <QRGenerator
                value={finalQRUrl || 'https://linkora.app'}
                size={1024}
                errorCorrectionLevel={qrCode.errorCorrection}
                customization={{
                  ...customization,
                  foregroundColor: qrCode.foregroundColor,
                  backgroundColor: qrCode.backgroundColor,
                } as any}
                name={qrCode.name || 'qr-code'}
                className="w-full"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
