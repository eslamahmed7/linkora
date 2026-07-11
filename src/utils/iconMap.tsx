import { 
  FaFacebook, FaTwitter, FaInstagram, FaYoutube, FaTiktok, FaSnapchatGhost, 
  FaTelegramPlane, FaWhatsapp, FaLinkedin, FaSpotify, FaDiscord, FaRedditAlien, 
  FaPinterest, FaTwitch, FaGithub, FaEnvelope, FaPhone, FaMapMarkerAlt, 
  FaLink, FaMusic, FaCamera, FaVideo, FaComment, FaShoppingBag, FaBriefcase, 
  FaCoffee, FaStar, FaHeart, FaBookmark, FaGamepad, FaPlay, FaHeadphones,
  FaApple, FaGoogle, FaAmazon, FaPaypal, FaMedium, FaPatreon, FaVimeo, FaLine, 
  FaWeixin, FaSoundcloud, FaSkype, FaSlack, FaStripe, FaTrello, FaFigma
} from 'react-icons/fa'

export interface IconData {
  id: string
  name: string
  component: React.ComponentType<{ className?: string, style?: React.CSSProperties }>
  color: string
}

export const AVAILABLE_ICONS: IconData[] = [
  // Social Media & Brands
  { id: 'whatsapp', name: 'WhatsApp', component: FaWhatsapp, color: '#25D366' },
  { id: 'facebook', name: 'Facebook', component: FaFacebook, color: '#1877F2' },
  { id: 'instagram', name: 'Instagram', component: FaInstagram, color: '#E1306C' }, // We'll add a CSS class for instagram gradient later if needed
  { id: 'twitter', name: 'Twitter / X', component: FaTwitter, color: '#1DA1F2' },
  { id: 'tiktok', name: 'TikTok', component: FaTiktok, color: '#000000' },
  { id: 'youtube', name: 'YouTube', component: FaYoutube, color: '#FF0000' },
  { id: 'telegram', name: 'Telegram', component: FaTelegramPlane, color: '#0088cc' },
  { id: 'snapchat', name: 'Snapchat', component: FaSnapchatGhost, color: '#FFFC00' },
  { id: 'linkedin', name: 'LinkedIn', component: FaLinkedin, color: '#0A66C2' },
  { id: 'spotify', name: 'Spotify', component: FaSpotify, color: '#1DB954' },
  { id: 'discord', name: 'Discord', component: FaDiscord, color: '#5865F2' },
  { id: 'reddit', name: 'Reddit', component: FaRedditAlien, color: '#FF4500' },
  { id: 'pinterest', name: 'Pinterest', component: FaPinterest, color: '#E60023' },
  { id: 'twitch', name: 'Twitch', component: FaTwitch, color: '#9146FF' },
  { id: 'github', name: 'GitHub', component: FaGithub, color: '#181717' },
  { id: 'apple', name: 'Apple', component: FaApple, color: '#000000' },
  { id: 'google', name: 'Google', component: FaGoogle, color: '#4285F4' },
  { id: 'amazon', name: 'Amazon', component: FaAmazon, color: '#FF9900' },
  { id: 'paypal', name: 'PayPal', component: FaPaypal, color: '#00457C' },
  { id: 'medium', name: 'Medium', component: FaMedium, color: '#000000' },
  { id: 'patreon', name: 'Patreon', component: FaPatreon, color: '#FF424D' },
  { id: 'vimeo', name: 'Vimeo', component: FaVimeo, color: '#1AB7EA' },
  { id: 'line', name: 'LINE', component: FaLine, color: '#00C300' },
  { id: 'wechat', name: 'WeChat', component: FaWeixin, color: '#07C160' },
  { id: 'soundcloud', name: 'SoundCloud', component: FaSoundcloud, color: '#FF3300' },
  { id: 'skype', name: 'Skype', component: FaSkype, color: '#00AFF0' },
  { id: 'slack', name: 'Slack', component: FaSlack, color: '#4A154B' },
  { id: 'stripe', name: 'Stripe', component: FaStripe, color: '#008CDD' },
  { id: 'trello', name: 'Trello', component: FaTrello, color: '#0052CC' },
  { id: 'figma', name: 'Figma', component: FaFigma, color: '#F24E1E' },

  // General & Contact
  { id: 'link', name: 'Link', component: FaLink, color: '#6B7280' },
  { id: 'email', name: 'Email', component: FaEnvelope, color: '#EA4335' },
  { id: 'phone', name: 'Phone', component: FaPhone, color: '#34D399' },
  { id: 'location', name: 'Location', component: FaMapMarkerAlt, color: '#EF4444' },
  
  // Media & Others
  { id: 'music', name: 'Music', component: FaMusic, color: '#8B5CF6' },
  { id: 'camera', name: 'Camera', component: FaCamera, color: '#F59E0B' },
  { id: 'video', name: 'Video', component: FaVideo, color: '#EF4444' },
  { id: 'chat', name: 'Chat', component: FaComment, color: '#3B82F6' },
  { id: 'shop', name: 'Shop', component: FaShoppingBag, color: '#EC4899' },
  { id: 'work', name: 'Work', component: FaBriefcase, color: '#64748B' },
  { id: 'coffee', name: 'Coffee', component: FaCoffee, color: '#78350F' },
  { id: 'star', name: 'Star', component: FaStar, color: '#F59E0B' },
  { id: 'heart', name: 'Heart', component: FaHeart, color: '#EF4444' },
  { id: 'bookmark', name: 'Bookmark', component: FaBookmark, color: '#3B82F6' },
  { id: 'game', name: 'Gaming', component: FaGamepad, color: '#10B981' },
  { id: 'play', name: 'Play', component: FaPlay, color: '#EF4444' },
  { id: 'podcast', name: 'Podcast', component: FaHeadphones, color: '#8B5CF6' },
]

export const getIconData = (id: string): IconData | undefined => {
  return AVAILABLE_ICONS.find(icon => icon.id === id)
}
