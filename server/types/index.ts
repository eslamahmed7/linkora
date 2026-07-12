// User Types
export interface User {
  id: string;
  email: string;
  username: string;
  passwordHash: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  bio?: string;
  displayName?: string;
  plan: 'free' | 'pro' | 'enterprise';
  role?: string;
  createdAt: Date;
  updatedAt: Date;
  lastLogin?: Date;
}

// LinkPage Types
export interface LinkPage {
  id: string;
  userId: string;
  handle: string;
  title: string;
  description?: string;
  bio?: string;
  theme: 'light' | 'dark' | 'custom';
  customColors?: {
    primary: string;
    secondary: string;
    background: string;
    text: string;
  };
  avatar?: string;
  bannerImage?: string;
  socialLinks?: Record<string, string>;
  design?: any;
  isPublished: boolean;
  isNFCEnabled: boolean;
  nfcData?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Link Types
export interface Link {
  id: string;
  pageId: string;
  title: string;
  url: string;
  description?: string;
  icon?: string;
  color?: string;
  order: number;
  clicks: number;
  isActive: boolean;
  expiresAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export type QRDotStyle = 'square' | 'dots' | 'rounded' | 'classy' | 'star' | 'diamond' | 'hexagon' | 'fluid' | 'cross' | 'heart';
export type QREyeFrameStyle = 'square' | 'rounded' | 'circle' | 'leaf' | 'octagon' | 'star' | 'shield' | 'hexagon' | 'diamond';
export type QREyeBallStyle = 'square' | 'rounded' | 'circle' | 'leaf' | 'diamond' | 'cross' | 'star' | 'shield' | 'hexagon';
export type QRFrameStyle = 'none' | 'bubble' | 'border' | 'badge' | 'solid' | 'shadow' | 'vintage' | 'ticket' | 'minimal' | 'polaroid' | 'browser' | 'neon' | 'glass' | 'cyberpunk' | 'glowing' | 'retro';
export type QRGradientType = 'linear' | 'radial';
export type QRDataType = 'url' | 'text' | 'wifi' | 'vcard' | 'email' | 'sms' | 'phone' | 'youtube' | 'tiktok' | 'whatsapp' | 'facebook' | 'instagram' | 'twitter' | 'linkedin' | 'paypal' | 'bitcoin' | 'appstore' | 'playstore' | 'snapchat' | 'spotify' | 'twitch' | 'pinterest' | 'telegram' | 'discord' | 'reddit' | 'github' | 'maps' | 'zoom' | 'patreon' | 'figma' | 'slack' | 'notion';

export interface QRCustomization {
  dotStyle: QRDotStyle;
  eyeFrameStyle: QREyeFrameStyle;
  eyeBallStyle: QREyeBallStyle;
  gradientEnabled: boolean;
  gradientType: QRGradientType;
  gradientRotation: number;
  gradientScale: number;
  foregroundColor2: string;
  backgroundImageUrl?: string;
  bgGradientEnabled: boolean;
  bgGradientType: QRGradientType;
  bgGradientRotation: number;
  bgGradientScale: number;
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
  data: Record<string, string>;
  qrVersion?: number;
}

// QR Code Types
export interface QRCode {
  id: string;
  pageId: string;
  linkId?: string;
  code: string;
  format: 'png' | 'svg' | 'webp';
  size: number;
  errorCorrection: 'L' | 'M' | 'Q' | 'H';
  designStyle: 'standard' | 'rounded' | 'gradient' | 'custom';
  customLogo?: string;
  customColors?: {
    dark: string;
    light: string;
  };
  redirectUrl: string;
  createdAt: Date;
  updatedAt: Date;
  customization?: QRCustomization;
  name?: string;
  url?: string;
  isActive?: boolean;
  scans?: number;
}

// Analytics Types
export interface Analytics {
  id: string;
  pageId: string;
  linkId?: string;
  qrCodeId?: string;
  type: 'page_view' | 'link_click' | 'qr_scan' | 'nfc_tap';
  userAgent: string;
  ipAddress: string;
  country?: string;
  city?: string;
  deviceType: 'mobile' | 'tablet' | 'desktop' | 'unknown';
  referer?: string;
  timestamp: Date;
}

// Removed NFCTag (unused)
// API Response Types
export interface APIResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: Record<string, unknown>;
  };
  meta?: {
    timestamp: string;
    version: string;
  };
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

// Auth Types
export interface AuthToken {
  userId: string;
  email: string;
  username: string;
  iat: number;
  exp: number;
}

export interface AuthCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  username: string;
  password: string;
  firstName: string;
  lastName: string;
}

// Error Types
export class APIError extends Error {
  constructor(
    public statusCode: number,
    public code: string,
    message: string,
    public details?: Record<string, unknown>
  ) {
    super(message);
    this.name = 'APIError';
  }
}

export interface RequestMetadata {
  requestId: string;
  userId?: string;
  timestamp: Date;
  userAgent: string;
  ipAddress: string;
}

// NFC Card Design Types
export interface CardCanvasElement {
  id: string;
  type: 'logo' | 'name' | 'job' | 'company' | 'qr' | 'nfc' | 'icon';
  x: number;        // 0–100 percentage from left
  y: number;        // 0–100 percentage from top
  visible: boolean;
  color?: string;
  iconName?: string; // lucide icon name for decorative icons
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  fontSize?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  fontWeight?: 'normal' | 'medium' | 'semibold' | 'bold' | 'extrabold';
  opacity?: number;
  rotation?: number;
}

export type CardBgType = 'solid' | 'gradient' | 'image' | 'template';

export interface CardDesign {
  templateId?: string;       // Base template ID
  bgType: CardBgType;
  bgColor?: string;          // Solid color
  bgGradientStart?: string;  // Gradient start color
  bgGradientEnd?: string;    // Gradient end color
  bgGradientAngle?: number;  // Gradient angle 0-360
  bgImageUrl?: string;       // Uploaded image URL
  bgImageBlur?: number;      // Image blur 0-10
  bgImageOverlay?: string;   // Semi-transparent overlay color
  bgImageOverlayOpacity?: number;
  elements: CardCanvasElement[];
  cardName?: string;         // Person's name on card
  cardJob?: string;          // Job title
  cardCompany?: string;      // Company name
  linkedQrId?: string;       // QR code ID
  showGrid: boolean;
  borderStyle?: string;      // CSS border
  borderRadius?: number;
  shadowStyle?: string;      // CSS box-shadow
  glowColor?: string;        // Ambient glow color
  glowIntensity?: number;
  pattern?: 'none' | 'hex' | 'dots' | 'circuit' | 'waves' | 'lines' | 'diagonal' | 'diamond' | 'constellation' | 'topo' | 'network';
  patternColor?: string;
  patternOpacity?: number;
}

// NFC Types
export interface NFCCard {
  id: string;
  pageId?: string;
  userId: string;
  title: string;
  description?: string;
  tagId?: string;
  isActive: boolean;
  cardDesign?: CardDesign;   // Full card customization data
  createdAt: Date;
  updatedAt: Date;
}

export interface NFCTagData {
  id: string;
  type: 'NDEF';
  records: Array<{
    tnf: number;
    type: string;
    payload: string;
  }>;
}

export interface NFCWriteResult {
  success: boolean;
  message: string;
  tagId?: string;
  writtenData?: NFCTagData;
}
