export type CardBgType = 'solid' | 'gradient' | 'image' | 'template'

export const CARD_SIZES = [
  { id: 'cr80',       label: 'CR80 (Standard)',    desc: '85.6 × 54 mm',  ratio: '85.6/54',  icon: '💳' },
  { id: 'cr79',       label: 'CR79',               desc: '84.0 × 53.0 mm',ratio: '84/53',    icon: '📇' },
  { id: 'cr100',      label: 'CR100 (Large)',      desc: '98.4 × 67.0 mm',ratio: '98.4/67',  icon: '🪪' },
  { id: 'square',     label: 'Square Card',        desc: '80 × 80 mm',    ratio: '1/1',      icon: '⬛' },
  { id: 'mini',       label: 'Mini Card',          desc: '74.5 × 52 mm',  ratio: '74.5/52',  icon: '🗂️' },
  { id: 'landscape',  label: 'Landscape Large',    desc: '105 × 74 mm',   ratio: '105/74',   icon: '🖼️' },
  { id: 'vertical',   label: 'Vertical / Portrait',desc: '54 × 85.6 mm',  ratio: '54/85.6',  icon: '📱' },
  { id: 'custom',     label: 'Custom Size',        desc: 'Set your own',  ratio: '85.6/54',  icon: '✏️' },
]

export interface CardCanvasElement {
  id: string
  type: 'logo' | 'name' | 'job' | 'company' | 'qr' | 'nfc' | 'icon' | 'text'
  x: number
  y: number
  visible: boolean
  text?: string
  color?: string
  iconName?: string
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  fontSize?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'
  fontWeight?: 'normal' | 'medium' | 'semibold' | 'bold' | 'extrabold'
  fontFamily?: string
  opacity?: number
  rotation?: number
}

export interface CardDesign {
  templateId?: string
  bgType: CardBgType
  bgColor?: string
  bgGradientStart?: string
  bgGradientEnd?: string
  bgGradientAngle?: number
  bgImageUrl?: string
  bgImageBlur?: number
  bgImageOverlay?: string
  bgImageOverlayOpacity?: number
  elements: CardCanvasElement[]
  cardName?: string
  cardJob?: string
  cardCompany?: string
  linkedQrId?: string
  showGrid: boolean
  borderStyle?: string
  borderRadius?: number
  shadowStyle?: string
  glowColor?: string
  glowIntensity?: number
  pattern?: string
  patternColor?: string
  patternOpacity?: number
  cardSize?: string
  logoColor?: string
  logoColorType?: 'solid' | 'gradient'
  logoGradientStart?: string
  logoGradientEnd?: string
  logoGradientAngle?: number
  nfcColor?: string
  nfcColorType?: 'solid' | 'gradient'
  nfcGradientStart?: string
  nfcGradientEnd?: string
  nfcGradientAngle?: number
  qrBgType?: 'none' | 'solid' | 'gradient'
  qrBgColor?: string
  qrBgGradientStart?: string
  qrBgGradientEnd?: string
  qrBgGradientAngle?: number
  qrShape?: string
}

export interface NFCCard {
  id: string
  pageId: string
  title: string
  description?: string
  tagId?: string
  isActive: boolean
  cardDesign?: CardDesign
  createdAt: string
  updatedAt: string
}

export interface NFCTagData {
  id: string
  type: 'NDEF'
  records: Array<{
    tnf: number
    type: string
    payload: string
  }>
}

export interface NFCWriteResult {
  success: boolean
  message: string
  tagId?: string
  writtenData?: NFCTagData
}
