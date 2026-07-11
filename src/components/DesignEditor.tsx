import { useState } from 'react'
import { usePageBuilderStore } from '@/stores/pageBuilderStore'
import { ChevronDown, ChevronUp, Image as ImageIcon, Sparkles, Type, MousePointerClick, LayoutTemplate } from 'lucide-react'

export function DesignEditor() {
  const { page, updateDesign } = usePageBuilderStore()
  const { design } = page
  const [openSection, setOpenSection] = useState<string>('themes')

  const THEMES = [
    { id: 'minimal', label: 'Minimal Light', bg: '#ffffff', text: '#333333', linkBg: '#f3f4f6', linkText: '#111827' },
    { id: 'dark', label: 'Dark Mode', bg: '#111827', text: '#f3f4f6', linkBg: '#1f2937', linkText: '#ffffff' },
    { id: 'glass', label: 'Glassmorphism', bg: '#a8c0ff', text: '#ffffff', linkBg: 'rgba(255,255,255,0.2)', linkText: '#ffffff', isGlass: true, bgGradient: 'linear-gradient(135deg, #a8c0ff, #3f2b96)' },
    { id: 'cyberpunk', label: 'Cyberpunk', bg: '#000000', text: '#fcee0a', linkBg: '#111111', linkText: '#00ffff' },
    { id: 'sunset', label: 'Sunset Vibes', bg: '#ff7e5f', text: '#ffffff', linkBg: 'rgba(255,255,255,0.2)', linkText: '#ffffff', isGlass: true, bgGradient: 'linear-gradient(135deg, #ff7e5f, #feb47b)' },
    { id: 'ocean', label: 'Ocean Breeze', bg: '#2193b0', text: '#ffffff', linkBg: '#ffffff', linkText: '#2193b0', bgGradient: 'linear-gradient(135deg, #2193b0, #6dd5ed)' },
    { id: 'forest', label: 'Forest Zen', bg: '#134e5e', text: '#ffffff', linkBg: '#71b280', linkText: '#ffffff', bgGradient: 'linear-gradient(135deg, #134e5e, #71b280)' },
    { id: 'neon', label: 'Neon Nights', bg: '#0f0c29', text: '#ffffff', linkBg: '#ff0099', linkText: '#ffffff', bgGradient: 'linear-gradient(135deg, #0f0c29, #302b63, #24243e)' },
    { id: 'monochrome', label: 'Monochrome', bg: '#f5f5f5', text: '#000000', linkBg: '#000000', linkText: '#ffffff' },
    { id: 'pastel', label: 'Pastel Dream', bg: '#ff9a9e', text: '#ffffff', linkBg: 'rgba(255,255,255,0.3)', linkText: '#333333', isGlass: true, bgGradient: 'linear-gradient(135deg, #ff9a9e, #fecfef)' },
    { id: 'retro', label: 'Retro 90s', bg: '#4a00e0', text: '#ffffff', linkBg: '#ff0055', linkText: '#ffffff', bgGradient: 'linear-gradient(135deg, #8e2de2, #4a00e0)' },
    { id: 'gold', label: 'Gold Luxury', bg: '#111111', text: '#d4af37', linkBg: '#d4af37', linkText: '#111111' },
    { id: 'midnight', label: 'Midnight Blue', bg: '#141e30', text: '#ffffff', linkBg: '#243b55', linkText: '#ffffff', bgGradient: 'linear-gradient(135deg, #141e30, #243b55)' },
    { id: 'candy', label: 'Candy Pop', bg: '#f953c6', text: '#ffffff', linkBg: '#b91d73', linkText: '#ffffff', bgGradient: 'linear-gradient(135deg, #f953c6, #b91d73)' },
    { id: 'hacker', label: 'Hacker Terminal', bg: '#000000', text: '#00ff00', linkBg: '#003300', linkText: '#00ff00', linkStyle: 'outline', buttonShadow: 'hard' },
    // 2 New Glassmorphism
    { id: 'frosted-mint', label: 'Frosted Mint', bg: '#00b09b', text: '#ffffff', linkBg: 'rgba(255,255,255,0.25)', linkText: '#ffffff', isGlass: true, bgGradient: 'linear-gradient(135deg, #00b09b, #96c93d)' },
    { id: 'lava-glass', label: 'Lava Glass', bg: '#ff416c', text: '#ffffff', linkBg: 'rgba(0,0,0,0.3)', linkText: '#ffffff', isGlass: true, bgGradient: 'linear-gradient(135deg, #ff416c, #ff4b2b)' },
    // 2 New Neon
    { id: 'neon-cyber', label: 'Cyber Pulse', bg: '#09090e', text: '#00f2fe', linkBg: '#00f2fe', linkText: '#09090e', linkStyle: 'neon-border', buttonShadow: 'glow' },
    { id: 'neon-toxic', label: 'Toxic Glow', bg: '#000000', text: '#39ff14', linkBg: '#39ff14', linkText: '#000000', linkStyle: 'neon-border', buttonShadow: 'glow' },
    // 1 New Gradient
    { id: 'aurora', label: 'Aurora Borealis', bg: '#00c6ff', text: '#ffffff', linkBg: 'rgba(255,255,255,0.2)', linkText: '#ffffff', bgGradient: 'linear-gradient(135deg, #00c6ff, #0072ff)', linkStyle: 'glass-frost' },
  ]

  const applyTheme = (theme: any) => {
    updateDesign({
      theme: theme.id,
      backgroundColor: theme.bg,
      textColor: theme.text,
      headingColor: theme.text,
      linkBackgroundColor: theme.linkBg,
      linkTextColor: theme.linkText,
      backgroundType: theme.bgGradient ? 'gradient' : 'color',
      backgroundGradient: theme.bgGradient || undefined,
      glassmorphism: theme.isGlass || false,
      linkStyle: theme.linkStyle || (theme.isGlass ? 'glass-frost' : 'solid'),
      buttonShadow: theme.buttonShadow || 'none',
    })
  }

  // Helper for inline accordions to avoid React unmounting inputs
  const renderAccordion = (id: string, title: string, Icon: any, children: React.ReactNode) => {
    const isOpen = openSection === id;
    return (
      <div className="border border-neutral-200 dark:border-neutral-800 rounded-xl overflow-hidden mb-4 bg-white dark:bg-neutral-900 shadow-sm">
        <button
          onClick={() => setOpenSection(isOpen ? '' : id)}
          className="w-full px-5 py-4 flex items-center justify-between bg-neutral-50 dark:bg-neutral-900 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
        >
          <div className="flex items-center gap-3">
            <Icon className="w-5 h-5 text-accent-600" />
            <span className="font-bold text-neutral-900 dark:text-white">{title}</span>
          </div>
          {isOpen ? <ChevronUp className="w-5 h-5 text-neutral-500" /> : <ChevronDown className="w-5 h-5 text-neutral-500" />}
        </button>
        {isOpen && <div className="p-5 border-t border-neutral-200 dark:border-neutral-800">{children}</div>}
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {renderAccordion('themes', 'Themes & Presets', LayoutTemplate, (
        <div className="grid grid-cols-2 gap-3">
          {THEMES.map(theme => (
            <button
              key={theme.id}
              onClick={() => applyTheme(theme)}
              className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center justify-center gap-2 ${design.theme === theme.id ? 'border-accent-600 bg-accent-50 dark:bg-accent-900/20' : 'border-neutral-200 dark:border-neutral-700 hover:border-accent-300'}`}
            >
              <div
                className="w-full h-12 rounded-lg border border-neutral-300 dark:border-neutral-600 flex items-center justify-center"
                style={{ background: theme.bgGradient || theme.bg }}
              >
                <div className="w-3/4 h-4 rounded" style={{ backgroundColor: theme.linkBg }}></div>
              </div>
              <span className="text-sm font-bold text-neutral-900 dark:text-white text-center break-words leading-tight">{theme.label}</span>
            </button>
          ))}
        </div>
      ))}

      {renderAccordion('background', 'Background & Style', ImageIcon, (
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-neutral-900 dark:text-white mb-2">Background Type</label>
            <div className="flex gap-2 p-1 bg-neutral-100 dark:bg-neutral-800 rounded-lg">
              {['color', 'gradient'].map(type => (
                <button
                  key={type}
                  onClick={() => updateDesign({ backgroundType: type as any })}
                  className={`flex-1 py-1.5 text-sm font-medium rounded-md capitalize transition-colors ${design.backgroundType === type ? 'bg-white dark:bg-neutral-700 shadow-sm text-neutral-900 dark:text-white' : 'text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300'}`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {design.backgroundType === 'color' ? (
            <div>
              <label className="block text-sm font-bold text-neutral-900 dark:text-white mb-2">Background Color</label>
              <div className="flex items-center gap-3">
                <input type="color" value={design.backgroundColor} onChange={(e) => updateDesign({ backgroundColor: e.target.value })} className="w-12 h-12 shrink-0 rounded cursor-pointer border-0 p-0" />
                <input type="text" value={design.backgroundColor} onChange={(e) => updateDesign({ backgroundColor: e.target.value })} className="flex-1 min-w-0 px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900" />
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-neutral-900 dark:text-white mb-2">Gradient Type</label>
                <select
                  value={design.backgroundGradientType || 'linear'}
                  onChange={(e) => updateDesign({ backgroundGradientType: e.target.value as any })}
                  className="w-full px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white"
                >
                  <option value="linear">Linear</option>
                  <option value="radial">Radial</option>
                </select>
              </div>
              <div className="grid grid-cols-1 2xl:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-neutral-900 dark:text-white mb-2">Color 1</label>
                  <div className="flex items-center gap-2">
                    <input type="color" value={design.backgroundColor} onChange={(e) => updateDesign({ backgroundColor: e.target.value })} className="w-10 h-10 shrink-0 rounded cursor-pointer border-0 p-0" />
                    <input type="text" value={design.backgroundColor} onChange={(e) => updateDesign({ backgroundColor: e.target.value })} className="flex-1 min-w-0 px-2 py-2 text-xs rounded border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-neutral-900 dark:text-white mb-2">Color 2</label>
                  <div className="flex items-center gap-2">
                    <input type="color" value={design.backgroundColor2 || '#0066ff'} onChange={(e) => updateDesign({ backgroundColor2: e.target.value })} className="w-10 h-10 shrink-0 rounded cursor-pointer border-0 p-0" />
                    <input type="text" value={design.backgroundColor2 || '#0066ff'} onChange={(e) => updateDesign({ backgroundColor2: e.target.value })} className="flex-1 min-w-0 px-2 py-2 text-xs rounded border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800" />
                  </div>
                </div>
              </div>
              {design.backgroundGradientType === 'linear' && (
                <div>
                  <label className="flex justify-between text-sm font-bold text-neutral-900 dark:text-white mb-2">
                    <span>Rotation</span>
                    <span className="text-accent-600">{design.backgroundGradientRotation || 135}°</span>
                  </label>
                  <input type="range" min="0" max="360" value={design.backgroundGradientRotation || 135} onChange={(e) => updateDesign({ backgroundGradientRotation: parseInt(e.target.value) })} className="w-full accent-accent-600" />
                </div>
              )}
              {design.backgroundGradientType === 'radial' && (
                <div>
                  <label className="flex justify-between text-sm font-bold text-neutral-900 dark:text-white mb-2">
                    <span>Scale</span>
                    <span className="text-accent-600">{design.backgroundGradientScale || 100}%</span>
                  </label>
                  <input type="range" min="50" max="150" value={design.backgroundGradientScale || 100} onChange={(e) => updateDesign({ backgroundGradientScale: parseInt(e.target.value) })} className="w-full accent-accent-600" />
                </div>
              )}
            </div>
          )}
          
          <label className="flex items-center gap-3 p-3 bg-neutral-50 dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700 cursor-pointer">
            <input type="checkbox" checked={design.glassmorphism || false} onChange={(e) => updateDesign({ glassmorphism: e.target.checked })} className="w-5 h-5 rounded accent-accent-600" />
            <span className="font-medium text-neutral-900 dark:text-white">Enable Glassmorphism Effect</span>
          </label>
        </div>
      ))}

      {renderAccordion('buttons', 'Buttons & Links', MousePointerClick, (
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-neutral-900 dark:text-white mb-2">Button Style (Fill Type)</label>
            <select value={design.linkStyle || 'solid'} onChange={(e) => updateDesign({ linkStyle: e.target.value as any })} className="w-full px-3 py-2.5 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white">
              <option value="solid">Solid (Classic)</option>
              <option value="outline">Outline (Ghost)</option>
              <option value="soft">Soft (Translucent)</option>
              <option value="3d">3D Pushable</option>
              <option value="gradient">Gradient Fill</option>
              <option value="neon-border">Neon Border</option>
              <option value="glass-frost">Glass Frost</option>
              <option value="minimal-flat">Minimal Flat</option>
              <option value="duo-tone">Duo-Tone</option>
            </select>
          </div>

          <div>
            <label className="flex justify-between text-sm font-bold text-neutral-900 dark:text-white mb-2">
              <span>Button Width</span>
              <span className="text-accent-600">{design.buttonWidth || 100}%</span>
            </label>
            <div className="flex items-center gap-4">
              <span className="text-xs text-neutral-500">50%</span>
              <input type="range" min="50" max="100" value={design.buttonWidth || 100} onChange={(e) => updateDesign({ buttonWidth: parseInt(e.target.value) })} className="flex-1 accent-accent-600" />
              <span className="text-xs text-neutral-500">100%</span>
            </div>
          </div>

          <div>
            <label className="flex justify-between text-sm font-bold text-neutral-900 dark:text-white mb-2">
              <span>Button Height (Padding)</span>
              <span className="text-accent-600">{design.buttonHeight || 14}px</span>
            </label>
            <div className="flex items-center gap-4">
              <span className="text-xs text-neutral-500">8px</span>
              <input type="range" min="8" max="32" value={design.buttonHeight || 14} onChange={(e) => updateDesign({ buttonHeight: parseInt(e.target.value) })} className="flex-1 accent-accent-600" />
              <span className="text-xs text-neutral-500">32px</span>
            </div>
          </div>

          <div>
            <label className="flex justify-between text-sm font-bold text-neutral-900 dark:text-white mb-2">
              <span>Icon Position</span>
              <span className="text-accent-600 capitalize">{design.iconPosition}</span>
            </label>
            <div className="flex bg-neutral-100 dark:bg-neutral-800 p-1 rounded-lg">
              <button 
                onClick={() => updateDesign({ iconPosition: 'left' })} 
                className={`flex-1 py-1.5 text-sm font-medium rounded-md transition-colors ${design.iconPosition === 'left' ? 'bg-white dark:bg-neutral-700 shadow-sm text-neutral-900 dark:text-white' : 'text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300'}`}
              >
                Left
              </button>
              <button 
                onClick={() => updateDesign({ iconPosition: 'right' })} 
                className={`flex-1 py-1.5 text-sm font-medium rounded-md transition-colors ${design.iconPosition === 'right' ? 'bg-white dark:bg-neutral-700 shadow-sm text-neutral-900 dark:text-white' : 'text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300'}`}
              >
                Right
              </button>
            </div>
          </div>

          <div>
            <label className="flex justify-between text-sm font-bold text-neutral-900 dark:text-white mb-2">
              <span>Button Shape (Border Radius)</span>
              <span className="text-accent-600">{design.linkBorderRadius}px</span>
            </label>
            <div className="flex items-center gap-4">
              <span className="w-6 h-6 border-2 border-neutral-400 rounded-none bg-neutral-200 dark:bg-neutral-700"></span>
              <input type="range" min="0" max="40" value={design.linkBorderRadius} onChange={(e) => updateDesign({ linkBorderRadius: parseInt(e.target.value) })} className="flex-1 accent-accent-600" />
              <span className="w-10 h-6 border-2 border-neutral-400 rounded-full bg-neutral-200 dark:bg-neutral-700"></span>
            </div>
          </div>

          <div>
             <label className="block text-sm font-bold text-neutral-900 dark:text-white mb-2">Button Shadow</label>
              <select value={design.buttonShadow || 'none'} onChange={(e) => updateDesign({ buttonShadow: e.target.value as any })} className="w-full px-3 py-2.5 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white">
                <option value="none">None</option>
                <option value="soft">Soft Shadow</option>
                <option value="hard">Hard Drop Shadow</option>
                <option value="glow">Neon Glow</option>
                <option value="neumorphism">Neumorphism (Soft 3D)</option>
                <option value="drop">Classic Drop</option>
                <option value="bottom-heavy">Bottom Heavy</option>
                <option value="inner">Inner Shadow (Debossed)</option>
                <option value="colored-soft">Colored Soft</option>
                <option value="retro">Retro Pop</option>
              </select>
          </div>
          
          <div>
            <label className="block text-sm font-bold text-neutral-900 dark:text-white mb-2">Hover Animation</label>
            <select value={design.buttonAnimation || 'none'} onChange={(e) => updateDesign({ buttonAnimation: e.target.value as any })} className="w-full px-3 py-2.5 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white">
              <option value="none">None</option>
              <option value="pulse">Pulse</option>
              <option value="bounce">Bounce</option>
              <option value="wobble">Wobble</option>
              <option value="slide">Slide</option>
            </select>
          </div>

          <div className="grid grid-cols-1 2xl:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-neutral-900 dark:text-white mb-2">Button Color</label>
              <div className="flex items-center gap-2">
                <input type="color" value={design.linkBackgroundColor} onChange={(e) => updateDesign({ linkBackgroundColor: e.target.value })} className="w-10 h-10 shrink-0 rounded cursor-pointer border-0 p-0" />
                <input type="text" value={design.linkBackgroundColor} onChange={(e) => updateDesign({ linkBackgroundColor: e.target.value })} className="flex-1 min-w-0 px-2 py-2 text-xs rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 uppercase font-mono" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold text-neutral-900 dark:text-white mb-2">Text Color</label>
              <div className="flex items-center gap-2">
                <input type="color" value={design.linkTextColor} onChange={(e) => updateDesign({ linkTextColor: e.target.value })} className="w-10 h-10 shrink-0 rounded cursor-pointer border-0 p-0" />
                <input type="text" value={design.linkTextColor} onChange={(e) => updateDesign({ linkTextColor: e.target.value })} className="flex-1 min-w-0 px-2 py-2 text-xs rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 uppercase font-mono" />
              </div>
            </div>
          </div>
        </div>
      ))}

      {renderAccordion('typography', 'Typography & Colors', Type, (
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-neutral-900 dark:text-white mb-2">Font Family</label>
            <select value={design.fontFamily} onChange={(e) => updateDesign({ fontFamily: e.target.value })} className="w-full px-3 py-2.5 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white">
              <option value="system-ui, -apple-system, sans-serif">System Default</option>
              <option value="sans-serif">Sans Serif</option>
              <option value="serif">Serif</option>
              <option value="monospace">Monospace</option>
              <option value="cursive">Cursive</option>
              <option value="fantasy">Fantasy</option>
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
          
          <div className="grid grid-cols-1 2xl:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-neutral-900 dark:text-white mb-2">Heading Color</label>
              <div className="flex items-center gap-2">
                <input type="color" value={design.headingColor} onChange={(e) => updateDesign({ headingColor: e.target.value })} className="w-10 h-10 shrink-0 rounded cursor-pointer border-0 p-0" />
                <input type="text" value={design.headingColor} onChange={(e) => updateDesign({ headingColor: e.target.value })} className="flex-1 min-w-0 px-2 py-2 text-xs rounded border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold text-neutral-900 dark:text-white mb-2">Bio Color</label>
              <div className="flex items-center gap-2">
                <input type="color" value={design.textColor} onChange={(e) => updateDesign({ textColor: e.target.value })} className="w-10 h-10 shrink-0 rounded cursor-pointer border-0 p-0" />
                <input type="text" value={design.textColor} onChange={(e) => updateDesign({ textColor: e.target.value })} className="flex-1 min-w-0 px-2 py-2 text-xs rounded border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800" />
              </div>
            </div>
          </div>
        </div>
      ))}

      {renderAccordion('advanced', 'Advanced Settings', Sparkles, (
        <div className="space-y-6">
           <div>
              <label className="flex justify-between text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                <span>Profile Image Radius</span>
                <span className="text-accent-600">{design.profileBorderRadius}px</span>
              </label>
              <input type="range" min="0" max="100" value={design.profileBorderRadius} onChange={(e) => updateDesign({ profileBorderRadius: parseInt(e.target.value) })} className="w-full accent-accent-600" />
            </div>
            
           <div>
              <label className="flex justify-between text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                <span>Button Spacing</span>
                <span className="text-accent-600">{design.linkSpacing}px</span>
              </label>
              <input type="range" min="4" max="40" value={design.linkSpacing} onChange={(e) => updateDesign({ linkSpacing: parseInt(e.target.value) })} className="w-full accent-accent-600" />
            </div>

            <label className="flex items-center gap-3">
              <input type="checkbox" checked={design.showBio} onChange={(e) => updateDesign({ showBio: e.target.checked })} className="w-4 h-4 rounded accent-accent-600" />
              <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">Show Profile Bio</span>
            </label>
            <label className="flex items-center gap-3">
              <input type="checkbox" checked={design.animationEnabled} onChange={(e) => updateDesign({ animationEnabled: e.target.checked })} className="w-4 h-4 rounded accent-accent-600" />
              <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">Enable Page Load Animations</span>
            </label>
        </div>
      ))}
    </div>
  )
}
