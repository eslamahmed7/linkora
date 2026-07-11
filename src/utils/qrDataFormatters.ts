import { QRDataType } from '../types/qr';

export const formatQRData = (type: QRDataType, data: Record<string, string>): string => {
  switch (type) {
    case 'landing-page':
    case 'url':
    case 'youtube':
    case 'tiktok':
    case 'facebook':
    case 'instagram':
    case 'twitter':
    case 'linkedin':
    case 'snapchat':
    case 'spotify':
    case 'twitch':
    case 'pinterest':
    case 'appstore':
    case 'playstore':
    case 'reddit':
    case 'github':
    case 'patreon':
    case 'figma':
    case 'notion':
    case 'maps':
      return data.url || '';

    case 'telegram':
      const tgUser = data.username || '';
      return tgUser ? `https://t.me/${tgUser}` : '';

    case 'discord':
      const discordLink = data.invite || '';
      return discordLink ? `https://discord.gg/${discordLink}` : '';
      
    case 'zoom':
      const meetingId = data.meetingId || '';
      const pass = data.password || '';
      return pass ? `https://zoom.us/j/${meetingId}?pwd=${pass}` : `https://zoom.us/j/${meetingId}`;
      
    case 'slack':
      const workspace = data.workspace || '';
      return workspace ? `https://${workspace}.slack.com` : '';

    case 'paypal':
      const paypalUser = data.username || '';
      const amount = data.amount || '';
      return amount ? `https://paypal.me/${paypalUser}/${amount}` : `https://paypal.me/${paypalUser}`;

    case 'bitcoin':
      const address = data.address || '';
      const btcAmount = data.amount || '';
      return btcAmount ? `bitcoin:${address}?amount=${btcAmount}` : `bitcoin:${address}`;
      
    case 'wifi':
      const encryption = data.encryption || 'WPA';
      const ssid = data.ssid || '';
      const password = data.password || '';
      const hidden = data.hidden ? 'true' : 'false';
      return `WIFI:T:${encryption};S:${ssid};P:${password};H:${hidden};;`;
      
    case 'vcard':
      const name = data.name || '';
      const phone = data.phone || '';
      const email = data.email || '';
      const org = data.organization || '';
      const title = data.title || '';
      const website = data.website || '';
      return `BEGIN:VCARD\nVERSION:3.0\nN:${name}\nFN:${name}\nORG:${org}\nTITLE:${title}\nTEL:${phone}\nEMAIL:${email}\nURL:${website}\nEND:VCARD`;
      
    case 'email':
      const mailTo = data.email || '';
      const subject = data.subject || '';
      const body = data.body || '';
      return `mailto:${mailTo}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      
    case 'sms':
      const smsPhone = data.phone || '';
      const smsMessage = data.message || '';
      return `SMSTO:${smsPhone}:${smsMessage}`;
      
    case 'phone':
      const phoneNumber = data.phone || '';
      return `tel:${phoneNumber}`;
      
    case 'whatsapp':
      const waPhone = data.phone || '';
      const waMessage = data.message || '';
      // Remove any non-numeric characters for the whatsapp link
      const cleanPhone = waPhone.replace(/\D/g, '');
      return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(waMessage)}`;
      
    case 'text':
    default:
      return data.text || '';
  }
};
