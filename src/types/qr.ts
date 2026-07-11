export type QRDotStyle = 'square' | 'dots' | 'rounded' | 'classy' | 'star' | 'diamond' | 'hexagon' | 'fluid' | 'cross' | 'heart' | 'triangle' | 'drop' | 'ninja' | 'sparkle' | 'pill';
export type QREyeFrameStyle = 'square' | 'rounded' | 'circle' | 'leaf' | 'octagon' | 'star' | 'shield' | 'hexagon' | 'diamond' | 'triangle' | 'drop' | 'ninja' | 'sparkle' | 'pill';
export type QREyeBallStyle = 'square' | 'rounded' | 'circle' | 'leaf' | 'diamond' | 'cross' | 'star' | 'shield' | 'hexagon' | 'triangle' | 'drop' | 'ninja' | 'sparkle' | 'pill';
export type QRFrameStyle = 'none' | 'bubble' | 'border' | 'badge' | 'solid' | 'shadow' | 'vintage' | 'ticket' | 'minimal' | 'polaroid' | 'browser' | 'neon' | 'glass' | 'cyberpunk' | 'glowing' | 'retro';
export type QRGradientType = 'linear' | 'radial';
export type QRDataType = 'landing-page' | 'url' | 'text' | 'wifi' | 'vcard' | 'email' | 'sms' | 'phone' | 'youtube' | 'tiktok' | 'whatsapp' | 'facebook' | 'instagram' | 'twitter' | 'linkedin' | 'paypal' | 'bitcoin' | 'appstore' | 'playstore' | 'snapchat' | 'spotify' | 'twitch' | 'pinterest' | 'telegram' | 'discord' | 'reddit' | 'github' | 'maps' | 'zoom' | 'patreon' | 'figma' | 'slack' | 'notion';

export interface QRCustomization {
  dotStyle: QRDotStyle;
  eyeFrameStyle: QREyeFrameStyle;
  eyeBallStyle: QREyeBallStyle;
  gradientEnabled: boolean;
  gradientType: QRGradientType;
  gradientRotation: number;
  gradientScale: number;
  foregroundColor: string;
  foregroundColor2: string;
  backgroundImageUrl?: string;
  bgGradientEnabled: boolean;
  bgGradientType: QRGradientType;
  bgGradientRotation: number;
  bgGradientScale: number;
  backgroundColor: string;
  backgroundColor2: string;
  frameStyle: QRFrameStyle;
  frameText: string;
  frameColor: string;
  frameTextColor: string;
  textGradientEnabled: boolean;
  textGradientType: QRGradientType;
  textGradientRotation: number;
  textGradientScale: number;
  frameTextColor2: string;
  frameFontFamily: string;
  frameTextPosition: 'top' | 'bottom' | 'left' | 'right';
  logoName: string;
  logoUrl?: string;
  logoSize: number;
  logoPadding: boolean;
  dataType: QRDataType;
  data: Record<string, string>; // Store type-specific data (e.g. { ssid: '...', password: '...' } for wifi)
  qrVersion?: number;
}

export interface QRCode {
  id: string
  userId: string
  pageId?: string
  linkId?: string
  name: string
  url: string
  content: string
  size: number
  errorCorrection: 'L' | 'M' | 'Q' | 'H'
  foregroundColor: string
  backgroundColor: string
  logoUrl?: string
  scans: number
  isActive: boolean
  createdAt: string
  updatedAt: string
  customization?: QRCustomization;
}

export interface CreateQRRequest {
  name: string
  url: string
  pageId?: string
  size?: number
  errorCorrection?: 'L' | 'M' | 'Q' | 'H'
  foregroundColor?: string
  backgroundColor?: string
  customization?: QRCustomization;
}

export interface UpdateQRRequest {
  name?: string
  url?: string
  pageId?: string
  size?: number
  errorCorrection?: 'L' | 'M' | 'Q' | 'H'
  foregroundColor?: string
  backgroundColor?: string
  isActive?: boolean
  customization?: QRCustomization;
}

export interface QRAnalytics {
  qrCodeId: string
  totalScans: number
  scansToday: number
  scansThisWeek: number
  scansThisMonth: number
  topCountries: Array<{ country: string; scans: number }>
  topDevices: Array<{ device: string; scans: number }>
  lastScanned?: string
}
