import { useRef, useState, useMemo, useEffect } from 'react';
import * as QRCodeLib from 'qrcode';
import { Download, Copy } from 'lucide-react';
import { useNotification } from '@/hooks/useNotification';
import { QRCustomization } from '@/types/qr';

interface QRGeneratorProps {
  value: string;
  size?: number;
  customization?: Partial<QRCustomization>;
  name?: string;
  className?: string;
  errorCorrectionLevel?: 'L' | 'M' | 'Q' | 'H';
  previewMode?: boolean;
}

export function QRGenerator({
  value,
  size = 256,
  customization = {},
  name = 'qr-code',
  className = '',
  errorCorrectionLevel = 'H',
  previewMode = false,
}: QRGeneratorProps) {
  const notification = useNotification();
  const [isDownloading, setIsDownloading] = useState(false);
  const [base64Images, setBase64Images] = useState<Record<string, string>>({});
  const svgRef = useRef<SVGSVGElement>(null);

  const {
    dotStyle = 'square',
    eyeFrameStyle = 'square',
    eyeBallStyle = 'square',
    gradientEnabled = false,
    gradientType = 'linear',
    foregroundColor: foregroundColorRaw = '#000000',
    foregroundColor2 = '#000000',
    frameStyle = 'none',
    frameText = 'SCAN ME',
    frameColor = '#000000',
    frameTextColor = '#ffffff',
    frameFontFamily = 'sans-serif',
    logoUrl,
    logoSize = 20,
    logoPadding = true,
    gradientRotation = 0,
    gradientScale = 50,
    backgroundImageUrl,
    bgGradientEnabled = false,
    bgGradientType = 'linear',
    bgGradientRotation = 0,
    bgGradientScale = 50,
    backgroundColor: backgroundColorRaw = '#ffffff',
    backgroundColor2 = '#ffffff',
    textGradientEnabled = false,
    textGradientType = 'linear',
    textGradientRotation = 0,
    textGradientScale = 50,
    frameTextColor2 = '#ffffff',
    frameTextPosition = 'bottom',
    qrVersion = 0,
  } = customization;

  const foregroundColor = foregroundColorRaw;
  const backgroundColor = backgroundColorRaw;
  const finalBg = bgGradientEnabled ? 'url(#qr-bg-gradient)' : backgroundColor;

  useEffect(() => {
    const fetchAsBase64 = async (url: string) => {
      if (!url || url.startsWith('data:')) return;
      try {
        const response = await fetch(url);
        const blob = await response.blob();
        const reader = new FileReader();
        reader.onloadend = () => {
          setBase64Images(prev => ({ ...prev, [url]: reader.result as string }));
        };
        reader.readAsDataURL(blob);
      } catch (e) {
        console.error('Failed to fetch image as base64', e);
      }
    };

    if (logoUrl) fetchAsBase64(logoUrl);
    if (backgroundImageUrl) fetchAsBase64(backgroundImageUrl);
  }, [logoUrl, backgroundImageUrl]);

  const qrData = useMemo(() => {
    try {
      const options: any = { errorCorrectionLevel };
      if (qrVersion && qrVersion > 0) {
        options.version = qrVersion;
      }
      const qr = QRCodeLib.create(value || 'https://linkora.app', options);
      return qr.modules;
    } catch (e) {
      // Fallback if data is too big for the requested density version
      try {
        const qr = QRCodeLib.create(value || 'https://linkora.app', { errorCorrectionLevel });
        return qr.modules;
      } catch (fallbackError) {
        return null;
      }
    }
  }, [value, errorCorrectionLevel, qrVersion]);


  const renderEyeFrame = (x: number, y: number) => {
    const k = `eye-frame-${x}-${y}`;
    switch (eyeFrameStyle) {
      case 'leaf':
        return <path key={k} d={`M ${x+0.5} ${y+3.5} A 3 3 0 0 1 ${x+3.5} ${y+0.5} L ${x+6.5} ${y+0.5} L ${x+6.5} ${y+3.5} A 3 3 0 0 1 ${x+3.5} ${y+6.5} A 3 3 0 0 1 ${x+0.5} ${y+3.5} Z`} fill="none" stroke="inherit" strokeWidth="1" />;
      case 'octagon':
        return <polygon key={k} points={`${x+2.5},${y+0.5} ${x+4.5},${y+0.5} ${x+6.5},${y+2.5} ${x+6.5},${y+4.5} ${x+4.5},${y+6.5} ${x+2.5},${y+6.5} ${x+0.5},${y+4.5} ${x+0.5},${y+2.5}`} fill="none" stroke="inherit" strokeWidth="1" />;
      case 'star':
        return <polygon key={k} points={`${x+3.5},${y+0.5} ${x+4.5},${y+2.5} ${x+6.5},${y+3.5} ${x+4.5},${y+4.5} ${x+3.5},${y+6.5} ${x+2.5},${y+4.5} ${x+0.5},${y+3.5} ${x+2.5},${y+2.5}`} fill="none" stroke="inherit" strokeWidth="1" />;
      case 'shield':
        return <path key={k} d={`M ${x+0.5} ${y+0.5} H ${x+6.5} V ${y+3.5} C ${x+6.5} ${y+5.5} ${x+3.5} ${y+6.5} ${x+3.5} ${y+6.5} C ${x+3.5} ${y+6.5} ${x+0.5} ${y+5.5} ${x+0.5} ${y+3.5} Z`} fill="none" stroke="inherit" strokeWidth="1" />;
      case 'hexagon':
        return <polygon key={k} points={`${x+3.5},${y+0.5} ${x+6.5},${y+2} ${x+6.5},${y+5} ${x+3.5},${y+6.5} ${x+0.5},${y+5} ${x+0.5},${y+2}`} fill="none" stroke="inherit" strokeWidth="1" />;
      case 'diamond':
        return <polygon key={k} points={`${x+3.5},${y+0.5} ${x+6.5},${y+3.5} ${x+3.5},${y+6.5} ${x+0.5},${y+3.5}`} fill="none" stroke="inherit" strokeWidth="1" />;
      case 'circle':
        return <rect key={k} x={x+0.5} y={y+0.5} width="6" height="6" rx="3" fill="none" stroke="inherit" strokeWidth="1" />;
      case 'rounded':
        return <rect key={k} x={x+0.5} y={y+0.5} width="6" height="6" rx="1.5" fill="none" stroke="inherit" strokeWidth="1" />;
      case 'triangle':
        return <polygon key={k} points={`${x+3.5},${y+0.5} ${x+6.5},${y+6.5} ${x+0.5},${y+6.5}`} fill="none" stroke="inherit" strokeWidth="1" />;
      case 'drop':
        return <path key={k} d={`M${x+3.5} ${y+0.5} C ${x+6.5} ${y+3.5} ${x+6.5} ${y+6.5} ${x+3.5} ${y+6.5} C ${x+0.5} ${y+6.5} ${x+0.5} ${y+3.5} ${x+3.5} ${y+0.5} Z`} fill="none" stroke="inherit" strokeWidth="1" />;
      case 'ninja':
        return <path key={k} d={`M${x+3.5} ${y+0.5} L${x+4.5} ${y+2.5} L${x+6.5} ${y+3.5} L${x+4.5} ${y+4.5} L${x+3.5} ${y+6.5} L${x+2.5} ${y+4.5} L${x+0.5} ${y+3.5} L${x+2.5} ${y+2.5} Z`} fill="none" stroke="inherit" strokeWidth="1" />;
      case 'sparkle':
        return <path key={k} d={`M${x+3.5} ${y+0.5} Q${x+3.5} ${y+3.5} ${x+6.5} ${y+3.5} Q${x+3.5} ${y+3.5} ${x+3.5} ${y+6.5} Q${x+3.5} ${y+3.5} ${x+0.5} ${y+3.5} Q${x+3.5} ${y+3.5} ${x+3.5} ${y+0.5} Z`} fill="none" stroke="inherit" strokeWidth="1" />;
      case 'pill':
        return <rect key={k} x={x+0.5} y={y+1.5} width="6" height="4" rx="2" fill="none" stroke="inherit" strokeWidth="1" />;
      case 'square':
      default:
        return <rect key={k} x={x+0.5} y={y+0.5} width="6" height="6" fill="none" stroke="inherit" strokeWidth="1" />;
    }
  };

  const renderEyeBall = (x: number, y: number) => {
    const k = `eye-ball-${x}-${y}`;
    switch (eyeBallStyle) {
      case 'leaf':
        return <path key={k} d={`M ${x+2} ${y+3.5} A 1.5 1.5 0 0 1 ${x+3.5} ${y+2} L ${x+5} ${y+2} L ${x+5} ${y+3.5} A 1.5 1.5 0 0 1 ${x+3.5} ${y+5} A 1.5 1.5 0 0 1 ${x+2} ${y+3.5} Z`} fill="inherit" stroke="none" />;
      case 'diamond':
        return <polygon key={k} points={`${x+3.5},${y+2} ${x+5},${y+3.5} ${x+3.5},${y+5} ${x+2},${y+3.5}`} fill="inherit" stroke="none" />;
      case 'cross':
        return <path key={k} d={`M${x+3} ${y+2} H${x+4} V${y+3} H${x+5} V${y+4} H${x+4} V${y+5} H${x+3} V${y+4} H${x+2} V${y+3} H${x+3} Z`} fill="inherit" stroke="none" />;
      case 'star':
        return <polygon key={k} points={`${x+3.5},${y+2} ${x+4},${y+3} ${x+5},${y+3.5} ${x+4},${y+4} ${x+3.5},${y+5} ${x+3},${y+4} ${x+2},${y+3.5} ${x+3},${y+3}`} fill="inherit" stroke="none" />;
      case 'shield':
        return <path key={k} d={`M ${x+2} ${y+2} H ${x+5} V ${y+3.5} C ${x+5} ${y+4.5} ${x+3.5} ${y+5} ${x+3.5} ${y+5} C ${x+3.5} ${y+5} ${x+2} ${y+4.5} ${x+2} ${y+3.5} Z`} fill="inherit" stroke="none" />;
      case 'hexagon':
        return <polygon key={k} points={`${x+3.5},${y+2} ${x+5},${y+2.8} ${x+5},${y+4.2} ${x+3.5},${y+5} ${x+2},${y+4.2} ${x+2},${y+2.8}`} fill="inherit" stroke="none" />;
      case 'circle':
        return <rect key={k} x={x+2} y={y+2} width="3" height="3" rx="1.5" fill="inherit" stroke="none" />;
      case 'rounded':
        return <rect key={k} x={x+2} y={y+2} width="3" height="3" rx="0.8" fill="inherit" stroke="none" />;
      case 'triangle':
        return <polygon key={k} points={`${x+3.5},${y+2} ${x+5},${y+5} ${x+2},${y+5}`} fill="inherit" stroke="none" />;
      case 'drop':
        return <path key={k} d={`M${x+3.5} ${y+2} C ${x+5} ${y+3.5} ${x+5} ${y+5} ${x+3.5} ${y+5} C ${x+2} ${y+5} ${x+2} ${y+3.5} ${x+3.5} ${y+2} Z`} fill="inherit" stroke="none" />;
      case 'ninja':
        return <path key={k} d={`M${x+3.5} ${y+2} L${x+4} ${y+3} L${x+5} ${y+3.5} L${x+4} ${y+4} L${x+3.5} ${y+5} L${x+3} ${y+4} L${x+2} ${y+3.5} L${x+3} ${y+3} Z`} fill="inherit" stroke="none" />;
      case 'sparkle':
        return <path key={k} d={`M${x+3.5} ${y+2} Q${x+3.5} ${y+3.5} ${x+5} ${y+3.5} Q${x+3.5} ${y+3.5} ${x+3.5} ${y+5} Q${x+3.5} ${y+3.5} ${x+2} ${y+3.5} Q${x+3.5} ${y+3.5} ${x+3.5} ${y+2} Z`} fill="inherit" stroke="none" />;
      case 'pill':
        return <rect key={k} x={x+2} y={y+2.5} width="3" height="2" rx="1" fill="inherit" stroke="none" />;
      case 'square':
      default:
        return <rect key={k} x={x+2} y={y+2} width="3" height="3" fill="inherit" stroke="none" />;
    }
  };

  const generateQRCodeContent = () => {
    if (!qrData) return null;
    const { size: matrixSize, data } = qrData;
    
    // Logo padding logic
    let logoClearArea = { x: -1, y: -1, w: 0, h: 0 };
    if (logoUrl && logoPadding) {
      const logoW = Math.ceil(matrixSize * (logoSize / 100));
      const w = logoW % 2 === 0 ? logoW + 1 : logoW;
      const h = w;
      const x = Math.floor((matrixSize - w) / 2);
      const y = Math.floor((matrixSize - h) / 2);
      logoClearArea = { x, y, w, h };
    }

    let dotsPath = '';
    
    for (let y = 0; y < matrixSize; y++) {
      for (let x = 0; x < matrixSize; x++) {
        const isEyeArea =
          (x < 7 && y < 7) ||
          (x > matrixSize - 8 && y < 7) ||
          (x < 7 && y > matrixSize - 8);

        if (isEyeArea) continue;

        if (
          logoUrl && logoPadding &&
          x >= logoClearArea.x && x < logoClearArea.x + logoClearArea.w &&
          y >= logoClearArea.y && y < logoClearArea.y + logoClearArea.h
        ) {
          continue;
        }

        if (data[y * matrixSize + x] === 1) {
          switch (dotStyle) {
            case 'dots': dotsPath += `M${x+0.5} ${y+0.1} A 0.4 0.4 0 1 0 ${x+0.5} ${y+0.9} A 0.4 0.4 0 1 0 ${x+0.5} ${y+0.1} Z `; break;
            case 'rounded': dotsPath += `M${x+0.35} ${y+0.05} h0.3 a0.3 0.3 0 0 1 0.3 0.3 v0.3 a0.3 0.3 0 0 1 -0.3 0.3 h-0.3 a0.3 0.3 0 0 1 -0.3 -0.3 v-0.3 a0.3 0.3 0 0 1 0.3 -0.3 Z `; break;
            case 'classy': dotsPath += `M${x+0.5} ${y+0.1} L${x+0.9} ${y+0.5} L${x+0.5} ${y+0.9} L${x+0.1} ${y+0.5} Z `; break;
            case 'star': dotsPath += `M${x+0.5} ${y+0.1} l0.1 0.3 l0.3 0 l-0.2 0.2 l0.1 0.3 l-0.3 -0.2 l-0.3 0.2 l0.1 -0.3 l-0.2 -0.2 l0.3 0 Z `; break;
            case 'diamond': dotsPath += `M${x+0.5} ${y} L${x+1} ${y+0.5} L${x+0.5} ${y+1} L${x} ${y+0.5} Z `; break;
            case 'hexagon': dotsPath += `M${x+0.5} ${y} L${x+0.93} ${y+0.25} L${x+0.93} ${y+0.75} L${x+0.5} ${y+1} L${x+0.07} ${y+0.75} L${x+0.07} ${y+0.25} Z `; break;
            case 'fluid': dotsPath += `M${x+0.5} ${y} A0.5 0.5 0 0 1 ${x+1} ${y+0.5} A0.5 0.5 0 0 1 ${x+0.5} ${y+1} A0.5 0.5 0 0 1 ${x} ${y+0.5} Z `; break;
            case 'cross': dotsPath += `M${x+0.3} ${y+0.1} H${x+0.7} V${y+0.3} H${x+0.9} V${y+0.7} H${x+0.7} V${y+0.9} H${x+0.3} V${y+0.7} H${x+0.1} V${y+0.3} H${x+0.3} Z `; break;
            case 'heart': dotsPath += `M${x+0.5} ${y+0.3} C${x+0.5} ${y} ${x+1} ${y} ${x+1} ${y+0.4} C${x+1} ${y+0.7} ${x+0.5} ${y+0.9} ${x+0.5} ${y+1} C${x+0.5} ${y+0.9} ${x} ${y+0.7} ${x} ${y+0.4} C${x} ${y} ${x+0.5} ${y} ${x+0.5} ${y+0.3} Z `; break;
            case 'triangle': dotsPath += `M${x+0.5} ${y+0.1} L${x+0.9} ${y+0.9} L${x+0.1} ${y+0.9} Z `; break;
            case 'drop': dotsPath += `M${x+0.5} ${y+0.1} C${x+0.9} ${y+0.5} ${x+0.9} ${y+0.9} ${x+0.5} ${y+0.9} C${x+0.1} ${y+0.9} ${x+0.1} ${y+0.5} ${x+0.5} ${y+0.1} Z `; break;
            case 'ninja': dotsPath += `M${x+0.5} ${y} L${x+0.6} ${y+0.4} L${x+1} ${y+0.5} L${x+0.6} ${y+0.6} L${x+0.5} ${y+1} L${x+0.4} ${y+0.6} L${x} ${y+0.5} L${x+0.4} ${y+0.4} Z `; break;
            case 'sparkle': dotsPath += `M${x+0.5} ${y} Q${x+0.5} ${y+0.5} ${x+1} ${y+0.5} Q${x+0.5} ${y+0.5} ${x+0.5} ${y+1} Q${x+0.5} ${y+0.5} ${x} ${y+0.5} Q${x+0.5} ${y+0.5} ${x+0.5} ${y} Z `; break;
            case 'pill': dotsPath += `M${x+0.1} ${y+0.3} a0.2 0.2 0 0 1 0.2 -0.2 h0.4 a0.2 0.2 0 0 1 0.2 0.2 v0.4 a0.2 0.2 0 0 1 -0.2 0.2 h-0.4 a0.2 0.2 0 0 1 -0.2 -0.2 Z `; break;
            case 'square':
            default: dotsPath += `M${x-0.025} ${y-0.025} h1.05 v1.05 h-1.05 Z `; break;
          }
        }
      }
    }

    return (
      <g fill={gradientEnabled ? 'url(#qr-gradient)' : foregroundColor} stroke={gradientEnabled ? 'url(#qr-gradient)' : foregroundColor}>
        <path d={dotsPath} fill="inherit" stroke="none" />
        
        {renderEyeFrame(0, 0)}
        {renderEyeBall(0, 0)}
        {renderEyeFrame(matrixSize - 7, 0)}
        {renderEyeBall(matrixSize - 7, 0)}
        {renderEyeFrame(0, matrixSize - 7)}
        {renderEyeBall(0, matrixSize - 7)}
        
        {logoUrl && (
          <image
            href={base64Images[logoUrl] || logoUrl}
            x={matrixSize / 2 - (matrixSize * (logoSize / 100)) / 2}
            y={matrixSize / 2 - (matrixSize * (logoSize / 100)) / 2}
            width={matrixSize * (logoSize / 100)}
            height={matrixSize * (logoSize / 100)}
            preserveAspectRatio="xMidYMid meet"
          />
        )}
      </g>
    );
  };

  const handleDownload = (format: 'svg' | 'png') => {
    setIsDownloading(true);
    try {
      if (!svgRef.current) return;
      const svgData = new XMLSerializer().serializeToString(svgRef.current);
      
      if (format === 'svg') {
        const blob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${name}.svg`;
        link.click();
        URL.revokeObjectURL(url);
        notification.success('QR code downloaded as SVG');
      } else {
        const canvas = document.createElement('canvas');
        const scale = 4;
        const width = size;
        const height = frameStyle !== 'none' ? size * (viewBoxH / viewBoxW) : size;
        canvas.width = width * scale;
        canvas.height = height * scale;
        const ctx = canvas.getContext('2d');
        const img = new Image();
        const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
        const url = URL.createObjectURL(svgBlob);
        
        img.onload = () => {
          if (ctx) {
            ctx.scale(scale, scale);
            ctx.drawImage(img, 0, 0, width, height);
            const pngUrl = canvas.toDataURL('image/png');
            const link = document.createElement('a');
            link.href = pngUrl;
            link.download = `${name}.png`;
            link.click();
            URL.revokeObjectURL(url);
            notification.success('QR code downloaded as PNG');
          }
          setIsDownloading(false);
        };
        img.src = url;
        return; // Don't set isDownloading to false yet
      }
    } catch (e) {
      notification.error('Failed to download QR code');
    }
    setIsDownloading(false);
  };

  const handleCopyToClipboard = async () => {
    try {
      if (!svgRef.current) return;
      const svgData = new XMLSerializer().serializeToString(svgRef.current);
      const canvas = document.createElement('canvas');
      const scale = 4;
      const width = size;
      const height = frameStyle !== 'none' ? size * (viewBoxH / viewBoxW) : size;
      canvas.width = width * scale;
      canvas.height = height * scale;
      const ctx = canvas.getContext('2d');
      const img = new Image();
      const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(svgBlob);
      
      img.onload = () => {
        if (ctx) {
          ctx.scale(scale, scale);
          ctx.drawImage(img, 0, 0, width, height);
          canvas.toBlob((blob) => {
            if (blob) {
              navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })])
                .then(() => notification.success('QR code copied to clipboard'))
                .catch(() => notification.error('Failed to copy to clipboard'));
            }
          });
          URL.revokeObjectURL(url);
        }
      };
      img.src = url;
    } catch (e) {
      notification.error('Failed to copy QR code');
    }
  };

  const matrixSize = qrData ? qrData.size : 29;
  
  // Frame calculation
  let viewBoxW = matrixSize + 4;
  let viewBoxH = matrixSize + 4;
  let qrGroupX = 2;
  let qrGroupY = 2;
  let textTransform = `translate(${viewBoxW / 2}, ${matrixSize + 7})`;
  let textAnchor: 'start' | 'middle' | 'end' = 'middle';
  let innerBgX = 1;
  let innerBgY = 1;
  let innerBgW = viewBoxW - 2;
  let innerBgH = matrixSize + 2;

  if (frameStyle !== 'none') {
    if (frameStyle === 'browser') {
      viewBoxH = matrixSize + 8;
      qrGroupY = 4;
      textTransform = 'translate(10, 1.7)';
      textAnchor = 'start';
      innerBgY = 3;
      innerBgW = viewBoxW - 1;
      innerBgH = matrixSize + 2;
    } else {
      switch (frameTextPosition) {
        case 'top':
          viewBoxH = matrixSize + 12;
          qrGroupY = 10;
          textTransform = `translate(${viewBoxW / 2}, 5)`;
          innerBgY = 9;
          innerBgH = matrixSize + 2;
          break;
        case 'bottom':
          viewBoxH = matrixSize + 12;
          qrGroupY = 2;
          textTransform = `translate(${viewBoxW / 2}, ${matrixSize + 7})`;
          innerBgY = 1;
          innerBgH = matrixSize + 2;
          break;
        case 'left':
          viewBoxW = matrixSize + 12;
          qrGroupX = 10;
          qrGroupY = 2;
          textTransform = `translate(5, ${viewBoxH / 2}) rotate(-90)`;
          innerBgX = 9;
          innerBgW = matrixSize + 2;
          innerBgH = matrixSize + 2;
          break;
        case 'right':
          viewBoxW = matrixSize + 12;
          qrGroupX = 2;
          qrGroupY = 2;
          textTransform = `translate(${matrixSize + 7}, ${viewBoxH / 2}) rotate(90)`;
          innerBgX = 1;
          innerBgW = matrixSize + 2;
          innerBgH = matrixSize + 2;
          break;
      }
    }
  }

  return (
    <div className={`flex flex-col items-center gap-6 ${className}`}>
      <div className="p-1 bg-neutral-100 dark:bg-neutral-900 rounded-xl flex items-center justify-center relative overflow-hidden group">
        <svg
          ref={svgRef}
          width={size}
          height={frameStyle !== 'none' ? size * (viewBoxH / viewBoxW) : size}
          viewBox={`0 0 ${viewBoxW} ${viewBoxH}`}
          xmlns="http://www.w3.org/2000/svg"
          className="max-w-full h-auto drop-shadow-sm"
          shapeRendering="crispEdges"
        >
          <defs>
            {gradientEnabled && (() => {
              const anglePI = (gradientRotation || 0) * (Math.PI / 180);
              const x1 = Math.round(50 + Math.cos(anglePI - Math.PI) * 50) + '%';
              const y1 = Math.round(50 + Math.sin(anglePI - Math.PI) * 50) + '%';
              const x2 = Math.round(50 + Math.cos(anglePI) * 50) + '%';
              const y2 = Math.round(50 + Math.sin(anglePI) * 50) + '%';
              
              return gradientType === 'linear' ? (
                <linearGradient id="qr-gradient" x1={x1} y1={y1} x2={x2} y2={y2}>
                  <stop offset="0%" stopColor={foregroundColor} />
                  <stop offset="100%" stopColor={foregroundColor2} />
                </linearGradient>
              ) : (
                <radialGradient id="qr-gradient" cx="50%" cy="50%" r={`${gradientScale || 50}%`}>
                  <stop offset="0%" stopColor={foregroundColor} />
                  <stop offset="100%" stopColor={foregroundColor2} />
                </radialGradient>
              )
            })()}

            {bgGradientEnabled && (() => {
              const anglePI = (bgGradientRotation || 0) * (Math.PI / 180);
              const x1 = Math.round(50 + Math.cos(anglePI - Math.PI) * 50) + '%';
              const y1 = Math.round(50 + Math.sin(anglePI - Math.PI) * 50) + '%';
              const x2 = Math.round(50 + Math.cos(anglePI) * 50) + '%';
              const y2 = Math.round(50 + Math.sin(anglePI) * 50) + '%';
              
              return bgGradientType === 'linear' ? (
                <linearGradient id="qr-bg-gradient" x1={x1} y1={y1} x2={x2} y2={y2}>
                  <stop offset="0%" stopColor={backgroundColor} />
                  <stop offset="100%" stopColor={backgroundColor2} />
                </linearGradient>
              ) : (
                <radialGradient id="qr-bg-gradient" cx="50%" cy="50%" r={`${bgGradientScale || 50}%`}>
                  <stop offset="0%" stopColor={backgroundColor} />
                  <stop offset="100%" stopColor={backgroundColor2} />
                </radialGradient>
              )
            })()}

            {textGradientEnabled && (() => {
              const anglePI = (textGradientRotation || 0) * (Math.PI / 180);
              const x1 = Math.round(50 + Math.cos(anglePI - Math.PI) * 50) + '%';
              const y1 = Math.round(50 + Math.sin(anglePI - Math.PI) * 50) + '%';
              const x2 = Math.round(50 + Math.cos(anglePI) * 50) + '%';
              const y2 = Math.round(50 + Math.sin(anglePI) * 50) + '%';
              
              return textGradientType === 'linear' ? (
                <linearGradient id="qr-text-gradient" x1={x1} y1={y1} x2={x2} y2={y2}>
                  <stop offset="0%" stopColor={frameTextColor} />
                  <stop offset="100%" stopColor={frameTextColor2} />
                </linearGradient>
              ) : (
                <radialGradient id="qr-text-gradient" cx="50%" cy="50%" r={`${textGradientScale || 50}%`}>
                  <stop offset="0%" stopColor={frameTextColor} />
                  <stop offset="100%" stopColor={frameTextColor2} />
                </radialGradient>
              )
            })()}
          </defs>

          {/* Background Layer 1: Base */}
          {backgroundImageUrl ? (
            <image href={base64Images[backgroundImageUrl] || backgroundImageUrl} x="0" y="0" width={viewBoxW} height={viewBoxH} preserveAspectRatio="xMidYMid slice" />
          ) : (
             <rect x="0" y="0" width={viewBoxW} height={viewBoxH} fill={finalBg} rx={frameStyle === 'none' ? 2 : 0} />
          )}
          
          {/* Frame Layer */}
          {frameStyle !== 'none' && (
            <>
              {/* Outer Frame Shape */}
              {frameStyle === 'shadow' ? (
                <rect x="0.5" y="0.5" width={viewBoxW - 1} height={viewBoxH - 1} fill={frameColor} rx={2} filter="drop-shadow(0 2px 4px rgba(0,0,0,0.3))" />
              ) : frameStyle === 'vintage' ? (
                <>
                  <rect x="0.5" y="0.5" width={viewBoxW - 1} height={viewBoxH - 1} fill={finalBg} stroke={frameColor} strokeWidth="0.5" strokeDasharray="1,1" />
                  <rect x="0" y="0" width="100%" height="100%" fill={frameColor} fillOpacity="0.1" rx={1} />
                </>
              ) : frameStyle === 'ticket' ? (
                <path d={`M 0 2 A 2 2 0 0 1 2 0 L ${viewBoxW-2} 0 A 2 2 0 0 1 ${viewBoxW} 2 L ${viewBoxW} ${matrixSize+2} A 1 1 0 0 0 ${viewBoxW} ${matrixSize+4} L ${viewBoxW} ${viewBoxH-2} A 2 2 0 0 1 ${viewBoxW-2} ${viewBoxH} L 2 ${viewBoxH} A 2 2 0 0 1 0 ${viewBoxH-2} L 0 ${matrixSize+4} A 1 1 0 0 0 0 ${matrixSize+2} Z`} fill={frameColor} />
              ) : frameStyle === 'bubble' ? (
                <rect width={viewBoxW} height={viewBoxH} fill={frameColor} rx={Math.min(viewBoxW, viewBoxH) / 6} />
              ) : frameStyle === 'badge' ? (
                <polygon points={`0,4 4,0 ${viewBoxW-4},0 ${viewBoxW},4 ${viewBoxW},${viewBoxH-4} ${viewBoxW-4},${viewBoxH} 4,${viewBoxH} 0,${viewBoxH-4}`} fill={frameColor} />
              ) : frameStyle === 'border' ? (
                <rect x="0.5" y="0.5" width={viewBoxW - 1} height={viewBoxH - 1} fill="none" stroke={frameColor} strokeWidth="2" rx={2} />
              ) : frameStyle === 'solid' ? (
                <rect width={viewBoxW} height={viewBoxH} fill={frameColor} />
              ) : frameStyle === 'minimal' ? (
                <>
                  <rect width={viewBoxW} height={viewBoxH} fill="none" stroke={frameColor} strokeWidth="0.5" />
                  <rect x="0" y="0" width={viewBoxW} height={matrixSize+2} fill={finalBg} />
                </>
              ) : frameStyle === 'polaroid' ? (
                <>
                  <rect width={viewBoxW} height={viewBoxH} fill="#ffffff" filter="drop-shadow(0 4px 6px rgba(0,0,0,0.15))" />
                  <rect x={innerBgX} y={innerBgY} width={innerBgW} height={innerBgH} fill={finalBg} />
                </>
              ) : frameStyle === 'browser' ? (
                <>
                  <rect width={viewBoxW} height={viewBoxH} fill={frameColor} rx={1} />
                  <circle cx="2" cy="1.5" r="0.5" fill="#ff5f56" />
                  <circle cx="3.5" cy="1.5" r="0.5" fill="#ffbd2e" />
                  <circle cx="5" cy="1.5" r="0.5" fill="#27c93f" />
                  <rect x="0.5" y="3" width={viewBoxW - 1} height={matrixSize + 2} fill={finalBg} />
                </>
              ) : frameStyle === 'neon' ? (
                <>
                  <rect width={viewBoxW} height={viewBoxH} fill="#111111" rx={2} />
                  <rect x="0.5" y="0.5" width={viewBoxW - 1} height={viewBoxH - 1} fill="none" stroke={frameColor} strokeWidth="0.5" rx={1.5} filter="drop-shadow(0 0 2px currentColor)" color={frameColor} />
                </>
              ) : frameStyle === 'glass' ? (
                <>
                  <rect x="0.5" y="0.5" width={viewBoxW - 1} height={viewBoxH - 1} fill={frameColor} fillOpacity="0.2" rx={2} stroke="rgba(255,255,255,0.4)" strokeWidth="0.5" />
                </>
              ) : frameStyle === 'cyberpunk' ? (
                <>
                  <rect width={viewBoxW} height={viewBoxH} fill={frameColor} />
                  <path d={`M 0 4 L 4 0 H ${viewBoxW} V ${viewBoxH - 4} L ${viewBoxW - 4} ${viewBoxH} H 0 Z`} fill="none" stroke={frameTextColor} strokeWidth="0.5" />
                </>
              ) : frameStyle === 'glowing' ? (
                <>
                  <rect width={viewBoxW} height={viewBoxH} fill={frameColor} rx={3} />
                  <rect x="0.5" y="0.5" width={viewBoxW - 1} height={viewBoxH - 1} fill="none" stroke={frameTextColor} strokeWidth="0.5" rx={2.5} filter="drop-shadow(0 0 2px currentColor)" color={frameTextColor} />
                </>
              ) : frameStyle === 'retro' ? (
                <>
                  <rect x="1" y="1" width={viewBoxW-2} height={viewBoxH-2} fill={frameTextColor} rx={1} />
                  <rect x="0.5" y="0.5" width={viewBoxW - 1} height={viewBoxH - 1} fill={frameColor} rx={1} stroke={frameTextColor} strokeWidth="0.5" />
                </>
              ) : frameStyle === 'dashed' ? (
                <rect x="0.5" y="0.5" width={viewBoxW - 1} height={viewBoxH - 1} fill="none" stroke={frameColor} strokeWidth="1.5" strokeDasharray="4,4" rx={2} />
              ) : frameStyle === 'dotted' ? (
                <rect x="0.5" y="0.5" width={viewBoxW - 1} height={viewBoxH - 1} fill="none" stroke={frameColor} strokeWidth="2" strokeDasharray="0,4" strokeLinecap="round" rx={2} />
              ) : frameStyle === 'double' ? (
                <>
                  <rect x="0.5" y="0.5" width={viewBoxW - 1} height={viewBoxH - 1} fill="none" stroke={frameColor} strokeWidth="1" />
                  <rect x="2.5" y="2.5" width={viewBoxW - 5} height={viewBoxH - 5} fill="none" stroke={frameColor} strokeWidth="0.5" />
                </>
              ) : frameStyle === 'crosshairs' ? (
                <>
                  <rect x="4" y="4" width={viewBoxW - 8} height={viewBoxH - 8} fill="none" stroke={frameColor} strokeWidth="1" />
                  <line x1="0" y1="4" x2="8" y2="4" stroke={frameColor} strokeWidth="1.5" />
                  <line x1="4" y1="0" x2="4" y2="8" stroke={frameColor} strokeWidth="1.5" />
                  <line x1={viewBoxW-8} y1="4" x2={viewBoxW} y2="4" stroke={frameColor} strokeWidth="1.5" />
                  <line x1={viewBoxW-4} y1="0" x2={viewBoxW-4} y2="8" stroke={frameColor} strokeWidth="1.5" />
                  <line x1="0" y1={viewBoxH-4} x2="8" y2={viewBoxH-4} stroke={frameColor} strokeWidth="1.5" />
                  <line x1="4" y1={viewBoxH-8} x2="4" y2={viewBoxH} stroke={frameColor} strokeWidth="1.5" />
                  <line x1={viewBoxW-8} y1={viewBoxH-4} x2={viewBoxW} y2={viewBoxH-4} stroke={frameColor} strokeWidth="1.5" />
                  <line x1={viewBoxW-4} y1={viewBoxH-8} x2={viewBoxW-4} y2={viewBoxH} stroke={frameColor} strokeWidth="1.5" />
                </>
              ) : frameStyle === 'film' ? (
                <>
                  <rect width={viewBoxW} height={viewBoxH} fill={frameColor} />
                  {/* Top and bottom perforations */}
                  <line x1="2" y1="2" x2={viewBoxW-2} y2="2" stroke={finalBg} strokeWidth="2" strokeDasharray="3,3" />
                  <line x1="2" y1={viewBoxH-2} x2={viewBoxW-2} y2={viewBoxH-2} stroke={finalBg} strokeWidth="2" strokeDasharray="3,3" />
                </>
              ) : frameStyle === 'monitor' ? (
                <>
                  <rect width={viewBoxW} height={viewBoxH} fill={frameColor} rx="6" />
                  <rect x="2" y="2" width={viewBoxW - 4} height={viewBoxH - 4} fill={finalBg} rx="4" />
                </>
              ) : frameStyle === 'brackets' ? (
                <>
                  <path d={`M 8 1 H 2 V ${viewBoxH-1} H 8`} fill="none" stroke={frameColor} strokeWidth="2" />
                  <path d={`M ${viewBoxW-8} 1 H ${viewBoxW-2} V ${viewBoxH-1} H ${viewBoxW-8}`} fill="none" stroke={frameColor} strokeWidth="2" />
                </>
              ) : frameStyle === 'folded' ? (
                <>
                  <polygon points={`0,0 ${viewBoxW-10},0 ${viewBoxW},10 ${viewBoxW},${viewBoxH} 0,${viewBoxH}`} fill={frameColor} />
                  <polygon points={`${viewBoxW-10},0 ${viewBoxW-10},10 ${viewBoxW},10`} fill={finalBg} opacity="0.8" />
                </>
              ) : frameStyle === 'polygon' ? (
                <>
                  <polygon points={`4,0 ${viewBoxW-4},0 ${viewBoxW},4 ${viewBoxW},${viewBoxH-4} ${viewBoxW-4},${viewBoxH} 4,${viewBoxH} 0,${viewBoxH-4} 0,4`} fill={frameColor} />
                </>
              ) : frameStyle === 'cutout' ? (
                <>
                  <path d={`M 0 4 A 4 4 0 0 1 4 0 L ${viewBoxW-4} 0 A 4 4 0 0 1 ${viewBoxW} 4 L ${viewBoxW} ${viewBoxH-4} A 4 4 0 0 1 ${viewBoxW-4} ${viewBoxH} L 4 ${viewBoxH} A 4 4 0 0 1 0 ${viewBoxH-4} Z`} fill={frameColor} />
                  <circle cx="0" cy="0" r="4" fill={finalBg} />
                  <circle cx={viewBoxW} cy="0" r="4" fill={finalBg} />
                  <circle cx="0" cy={viewBoxH} r="4" fill={finalBg} />
                  <circle cx={viewBoxW} cy={viewBoxH} r="4" fill={finalBg} />
                </>
              ) : (
                <rect width={viewBoxW} height={viewBoxH} fill={frameColor} rx={2} />
              )}
              
              {/* Inner Background for QR Code */}
              {(!['minimal', 'vintage', 'polaroid', 'browser', 'glass', 'border', 'dashed', 'dotted', 'double', 'crosshairs', 'brackets', 'neon', 'glowing'].includes(frameStyle as string)) && (
                <rect x={innerBgX} y={innerBgY} width={innerBgW} height={innerBgH} fill={finalBg} rx={['solid', 'cyberpunk', 'polygon', 'folded'].includes(frameStyle as string) ? 0 : 1} />
              )}
              
              {/* Frame Text */}
              <text
                x="0"
                y="0"
                fill={frameStyle === 'vintage' ? frameColor : frameStyle === 'minimal' ? frameColor : frameStyle === 'polaroid' ? '#000000' : textGradientEnabled ? 'url(#qr-text-gradient)' : frameTextColor}
                fontFamily={frameFontFamily}
                fontSize={frameStyle === 'browser' ? 2 : 4}
                fontWeight={frameStyle === 'browser' ? 'normal' : 'bold'}
                textAnchor={textAnchor}
                dominantBaseline="middle"
                letterSpacing="0.1"
                transform={textTransform}
              >
                {frameText}
              </text>
            </>
          )}

          {/* QR Code Matrix Wrapper */}
          <g transform={`translate(${qrGroupX}, ${qrGroupY})`} shapeRendering="crispEdges">
            {generateQRCodeContent()}
          </g>
        </svg>
      </div>

      {!previewMode && (
        <div className="flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={handleCopyToClipboard}
            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800 text-neutral-900 dark:text-white transition-colors text-sm font-medium"
          >
            <Copy className="w-4 h-4" />
            Copy
          </button>
          <button
            onClick={() => handleDownload('png')}
            disabled={isDownloading}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-accent-600 hover:bg-accent-700 text-white transition-colors disabled:opacity-50 text-sm font-medium shadow-sm shadow-accent-600/20"
          >
            <Download className="w-4 h-4" />
            PNG
          </button>
          <button
            onClick={() => handleDownload('svg')}
            disabled={isDownloading}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-neutral-800 hover:bg-neutral-900 dark:bg-white dark:hover:bg-neutral-100 dark:text-neutral-900 text-white transition-colors disabled:opacity-50 text-sm font-medium"
          >
            <Download className="w-4 h-4" />
            SVG
          </button>
        </div>
      )}
    </div>
  );
}
