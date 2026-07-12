import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { usePageBuilderStore } from '@/stores/pageBuilderStore'
import { ChevronDown, ChevronUp, Image as ImageIcon, Sparkles, Type, MousePointerClick, LayoutTemplate } from 'lucide-react'

export function DesignEditor() {
  const { t } = useTranslation()
  const { page, updateDesign } = usePageBuilderStore()
  const { design } = page
  const [openSection, setOpenSection] = useState<string>('themes')

  const THEMES = [
    { id: 'minimal', label: t('components.designEditor.themes.minimalLight'), bg: '#ffffff', text: '#333333', linkBg: '#f3f4f6', linkText: '#111827' },
    { id: 'dark', label: t('components.designEditor.themes.darkMode'), bg: '#111827', text: '#f3f4f6', linkBg: '#1f2937', linkText: '#ffffff' },
    { id: 'glass', label: t('components.designEditor.themes.glassmorphism'), bg: '#a8c0ff', text: '#ffffff', linkBg: 'rgba(255,255,255,0.2)', linkText: '#ffffff', isGlass: true, bgGradient: 'linear-gradient(135deg, #a8c0ff, #3f2b96)' },
    { id: 'cyberpunk', label: t('components.designEditor.themes.cyberpunk'), bg: '#000000', text: '#fcee0a', linkBg: '#111111', linkText: '#00ffff' },
    { id: 'sunset', label: t('components.designEditor.themes.sunsetVibes'), bg: '#ff7e5f', text: '#ffffff', linkBg: 'rgba(255,255,255,0.2)', linkText: '#ffffff', isGlass: true, bgGradient: 'linear-gradient(135deg, #ff7e5f, #feb47b)' },
    { id: 'ocean', label: t('components.designEditor.themes.oceanBreeze'), bg: '#2193b0', text: '#ffffff', linkBg: '#ffffff', linkText: '#2193b0', bgGradient: 'linear-gradient(135deg, #2193b0, #6dd5ed)' },
    { id: 'forest', label: t('components.designEditor.themes.forestZen'), bg: '#134e5e', text: '#ffffff', linkBg: '#71b280', linkText: '#ffffff', bgGradient: 'linear-gradient(135deg, #134e5e, #71b280)' },
    { id: 'neon', label: t('components.designEditor.themes.neonNights'), bg: '#0f0c29', text: '#ffffff', linkBg: '#ff0099', linkText: '#ffffff', bgGradient: 'linear-gradient(135deg, #0f0c29, #302b63, #24243e)' },
    { id: 'monochrome', label: t('components.designEditor.themes.monochrome'), bg: '#f5f5f5', text: '#000000', linkBg: '#000000', linkText: '#ffffff' },
    { id: 'pastel', label: t('components.designEditor.themes.pastelDream'), bg: '#ff9a9e', text: '#ffffff', linkBg: 'rgba(255,255,255,0.3)', linkText: '#333333', isGlass: true, bgGradient: 'linear-gradient(135deg, #ff9a9e, #fecfef)' },
    { id: 'retro', label: t('components.designEditor.themes.retro90s'), bg: '#4a00e0', text: '#ffffff', linkBg: '#ff0055', linkText: '#ffffff', bgGradient: 'linear-gradient(135deg, #8e2de2, #4a00e0)' },
    { id: 'gold', label: t('components.designEditor.themes.goldLuxury'), bg: '#111111', text: '#d4af37', linkBg: '#d4af37', linkText: '#111111' },
    { id: 'midnight', label: t('components.designEditor.themes.midnightBlue'), bg: '#141e30', text: '#ffffff', linkBg: '#243b55', linkText: '#ffffff', bgGradient: 'linear-gradient(135deg, #141e30, #243b55)' },
    { id: 'candy', label: t('components.designEditor.themes.candyPop'), bg: '#f953c6', text: '#ffffff', linkBg: '#b91d73', linkText: '#ffffff', bgGradient: 'linear-gradient(135deg, #f953c6, #b91d73)' },
    { id: 'hacker', label: t('components.designEditor.themes.hackerTerminal'), bg: '#000000', text: '#00ff00', linkBg: '#003300', linkText: '#00ff00', linkStyle: 'outline', buttonShadow: 'hard' },
    // 2 New Glassmorphism
    { id: 'frosted-mint', label: t('components.designEditor.themes.frostedMint'), bg: '#00b09b', text: '#ffffff', linkBg: 'rgba(255,255,255,0.25)', linkText: '#ffffff', isGlass: true, bgGradient: 'linear-gradient(135deg, #00b09b, #96c93d)' },
    { id: 'lava-glass', label: t('components.designEditor.themes.lavaGlass'), bg: '#ff416c', text: '#ffffff', linkBg: 'rgba(0,0,0,0.3)', linkText: '#ffffff', isGlass: true, bgGradient: 'linear-gradient(135deg, #ff416c, #ff4b2b)' },
    // 2 New Neon
    { id: 'neon-cyber', label: t('components.designEditor.themes.cyberPulse'), bg: '#09090e', text: '#00f2fe', linkBg: '#00f2fe', linkText: '#09090e', linkStyle: 'neon-border', buttonShadow: 'glow' },
    { id: 'neon-toxic', label: t('components.designEditor.themes.toxicGlow'), bg: '#000000', text: '#39ff14', linkBg: '#39ff14', linkText: '#000000', linkStyle: 'neon-border', buttonShadow: 'glow' },
    // 1 New Gradient
    { id: 'aurora', label: t('components.designEditor.themes.auroraBorealis'), bg: '#00c6ff', text: '#ffffff', linkBg: 'rgba(255,255,255,0.2)', linkText: '#ffffff', bgGradient: 'linear-gradient(135deg, #00c6ff, #0072ff)', linkStyle: 'glass-frost' },
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
      {renderAccordion('themes', t('components.designEditor.sections.themes'), LayoutTemplate, (
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

      {renderAccordion('background', t('components.designEditor.sections.background'), ImageIcon, (
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-neutral-900 dark:text-white mb-2">{t('components.designEditor.fields.backgroundType')}</label>
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
              <label className="block text-sm font-bold text-neutral-900 dark:text-white mb-2">{t('components.designEditor.fields.backgroundColor')}</label>
              <div className="flex items-center gap-3">
                <input type="color" value={design.backgroundColor} onChange={(e) => updateDesign({ backgroundColor: e.target.value })} className="w-12 h-12 shrink-0 rounded cursor-pointer border-0 p-0" />
                <input type="text" value={design.backgroundColor} onChange={(e) => updateDesign({ backgroundColor: e.target.value })} className="flex-1 min-w-0 px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900" />
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-neutral-900 dark:text-white mb-2">{t('components.designEditor.fields.gradientType')}</label>
                <select
                  value={design.backgroundGradientType || 'linear'}
                  onChange={(e) => updateDesign({ backgroundGradientType: e.target.value as any })}
                  className="w-full px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white"
                >
                  <option value="linear">{t('qrEditor.colors.linear')}</option>
                  <option value="radial">{t('qrEditor.colors.radial')}</option>
                </select>
              </div>
              <div className="grid grid-cols-1 2xl:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-neutral-900 dark:text-white mb-2">{t('components.designEditor.fields.color1')}</label>
                  <div className="flex items-center gap-2">
                    <input type="color" value={design.backgroundColor} onChange={(e) => updateDesign({ backgroundColor: e.target.value })} className="w-10 h-10 shrink-0 rounded cursor-pointer border-0 p-0" />
                    <input type="text" value={design.backgroundColor} onChange={(e) => updateDesign({ backgroundColor: e.target.value })} className="flex-1 min-w-0 px-2 py-2 text-xs rounded border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-neutral-900 dark:text-white mb-2">{t('components.designEditor.fields.color2')}</label>
                  <div className="flex items-center gap-2">
                    <input type="color" value={design.backgroundColor2 || '#0066ff'} onChange={(e) => updateDesign({ backgroundColor2: e.target.value })} className="w-10 h-10 shrink-0 rounded cursor-pointer border-0 p-0" />
                    <input type="text" value={design.backgroundColor2 || '#0066ff'} onChange={(e) => updateDesign({ backgroundColor2: e.target.value })} className="flex-1 min-w-0 px-2 py-2 text-xs rounded border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800" />
                  </div>
                </div>
              </div>
              {design.backgroundGradientType === 'linear' && (
                <div>
                  <label className="flex justify-between text-sm font-bold text-neutral-900 dark:text-white mb-2">
                    <span>{t('components.designEditor.fields.rotation')}</span>
                    <span className="text-accent-600">{design.backgroundGradientRotation || 135}°</span>
                  </label>
                  <input type="range" min="0" max="360" value={design.backgroundGradientRotation || 135} onChange={(e) => updateDesign({ backgroundGradientRotation: parseInt(e.target.value) })} className="w-full accent-accent-600" />
                </div>
              )}
              {design.backgroundGradientType === 'radial' && (
                <div>
                  <label className="flex justify-between text-sm font-bold text-neutral-900 dark:text-white mb-2">
                    <span>{t('components.designEditor.fields.scale')}</span>
                    <span className="text-accent-600">{design.backgroundGradientScale || 100}%</span>
                  </label>
                  <input type="range" min="50" max="150" value={design.backgroundGradientScale || 100} onChange={(e) => updateDesign({ backgroundGradientScale: parseInt(e.target.value) })} className="w-full accent-accent-600" />
                </div>
              )}
            </div>
          )}
          
          <label className="flex items-center gap-3 p-3 bg-neutral-50 dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700 cursor-pointer">
            <input type="checkbox" checked={design.glassmorphism || false} onChange={(e) => updateDesign({ glassmorphism: e.target.checked })} className="w-5 h-5 rounded accent-accent-600" />
            <span className="font-medium text-neutral-900 dark:text-white">{t('components.designEditor.fields.glassmorphism')}</span>
          </label>
        </div>
      ))}

      {renderAccordion('buttons', t('components.designEditor.sections.buttons'), MousePointerClick, (
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-neutral-900 dark:text-white mb-2">{t('components.designEditor.fields.buttonStyle')}</label>
            <select value={design.linkStyle || 'solid'} onChange={(e) => updateDesign({ linkStyle: e.target.value as any })} className="w-full px-3 py-2.5 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white">
              <option value="solid">{t('components.designEditor.btnStyles.solid')}</option>
              <option value="outline">{t('components.designEditor.btnStyles.outline')}</option>
              <option value="soft">{t('components.designEditor.btnStyles.soft')}</option>
              <option value="3d">{t('components.designEditor.btnStyles.threeD')}</option>
              <option value="gradient">{t('components.designEditor.btnStyles.gradient')}</option>
              <option value="neon-border">{t('components.designEditor.btnStyles.neonBorder')}</option>
              <option value="glass-frost">{t('components.designEditor.btnStyles.glassFrost')}</option>
              <option value="minimal-flat">{t('components.designEditor.btnStyles.minimalFlat')}</option>
              <option value="duo-tone">{t('components.designEditor.btnStyles.duoTone')}</option>
            </select>
          </div>

          <div>
            <label className="flex justify-between text-sm font-bold text-neutral-900 dark:text-white mb-2">
              <span>{t('components.designEditor.fields.buttonWidth')}</span>
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
              <span>{t('components.designEditor.fields.buttonHeight')}</span>
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
              <span>{t('components.designEditor.fields.iconPosition')}</span>
              <span className="text-accent-600 capitalize">{design.iconPosition}</span>
            </label>
            <div className="flex bg-neutral-100 dark:bg-neutral-800 p-1 rounded-lg">
              <button 
                onClick={() => updateDesign({ iconPosition: 'left' })} 
                className={`flex-1 py-1.5 text-sm font-medium rounded-md transition-colors ${design.iconPosition === 'left' ? 'bg-white dark:bg-neutral-700 shadow-sm text-neutral-900 dark:text-white' : 'text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300'}`}
              >
                {t('components.designEditor.positions.left')}
              </button>
              <button 
                onClick={() => updateDesign({ iconPosition: 'right' })} 
                className={`flex-1 py-1.5 text-sm font-medium rounded-md transition-colors ${design.iconPosition === 'right' ? 'bg-white dark:bg-neutral-700 shadow-sm text-neutral-900 dark:text-white' : 'text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300'}`}
              >
                {t('components.designEditor.positions.right')}
              </button>
            </div>
          </div>

          <div>
            <label className="flex justify-between text-sm font-bold text-neutral-900 dark:text-white mb-2">
              <span>{t('components.designEditor.fields.buttonShape')}</span>
              <span className="text-accent-600">{design.linkBorderRadius}px</span>
            </label>
            <div className="flex items-center gap-4">
              <span className="w-6 h-6 border-2 border-neutral-400 rounded-none bg-neutral-200 dark:bg-neutral-700"></span>
              <input type="range" min="0" max="40" value={design.linkBorderRadius} onChange={(e) => updateDesign({ linkBorderRadius: parseInt(e.target.value) })} className="flex-1 accent-accent-600" />
              <span className="w-10 h-6 border-2 border-neutral-400 rounded-full bg-neutral-200 dark:bg-neutral-700"></span>
            </div>
          </div>

          <div>
             <label className="block text-sm font-bold text-neutral-900 dark:text-white mb-2">{t('components.designEditor.fields.buttonShadow')}</label>
              <select value={design.buttonShadow || 'none'} onChange={(e) => updateDesign({ buttonShadow: e.target.value as any })} className="w-full px-3 py-2.5 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white">
                <option value="none">{t('components.designEditor.shadows.none')}</option>
                <option value="soft">{t('components.designEditor.shadows.soft')}</option>
                <option value="hard">{t('components.designEditor.shadows.hard')}</option>
                <option value="glow">{t('components.designEditor.shadows.glow')}</option>
                <option value="neumorphism">{t('components.designEditor.shadows.neumorphism')}</option>
                <option value="drop">{t('components.designEditor.shadows.drop')}</option>
                <option value="bottom-heavy">{t('components.designEditor.shadows.bottomHeavy')}</option>
                <option value="inner">{t('components.designEditor.shadows.inner')}</option>
                <option value="colored-soft">{t('components.designEditor.shadows.coloredSoft')}</option>
                <option value="retro">{t('components.designEditor.shadows.retro')}</option>
              </select>
          </div>
          
          <div>
            <label className="block text-sm font-bold text-neutral-900 dark:text-white mb-2">{t('components.designEditor.fields.hoverAnimation')}</label>
            <select value={design.buttonAnimation || 'none'} onChange={(e) => updateDesign({ buttonAnimation: e.target.value as any })} className="w-full px-3 py-2.5 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white">
              <option value="none">{t('components.designEditor.hoverAnims.none')}</option>
              <option value="pulse">{t('components.designEditor.hoverAnims.pulse')}</option>
              <option value="bounce">{t('components.designEditor.hoverAnims.bounce')}</option>
              <option value="wobble">{t('components.designEditor.hoverAnims.wobble')}</option>
              <option value="slide">{t('components.designEditor.hoverAnims.slide')}</option>
            </select>
          </div>

          <div className="grid grid-cols-1 2xl:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-neutral-900 dark:text-white mb-2">{t('components.designEditor.fields.buttonColor')}</label>
              <div className="flex items-center gap-2">
                <input type="color" value={design.linkBackgroundColor} onChange={(e) => updateDesign({ linkBackgroundColor: e.target.value })} className="w-10 h-10 shrink-0 rounded cursor-pointer border-0 p-0" />
                <input type="text" value={design.linkBackgroundColor} onChange={(e) => updateDesign({ linkBackgroundColor: e.target.value })} className="flex-1 min-w-0 px-2 py-2 text-xs rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 uppercase font-mono" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold text-neutral-900 dark:text-white mb-2">{t('components.designEditor.fields.textColor')}</label>
              <div className="flex items-center gap-2">
                <input type="color" value={design.linkTextColor} onChange={(e) => updateDesign({ linkTextColor: e.target.value })} className="w-10 h-10 shrink-0 rounded cursor-pointer border-0 p-0" />
                <input type="text" value={design.linkTextColor} onChange={(e) => updateDesign({ linkTextColor: e.target.value })} className="flex-1 min-w-0 px-2 py-2 text-xs rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 uppercase font-mono" />
              </div>
            </div>
          </div>
        </div>
      ))}

      {renderAccordion('typography', t('components.designEditor.sections.typography'), Type, (
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-neutral-900 dark:text-white mb-2">{t('components.designEditor.fields.fontFamily')}</label>
            <select value={design.fontFamily} onChange={(e) => updateDesign({ fontFamily: e.target.value })} className="w-full px-3 py-2.5 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white">
              <option value="system-ui, -apple-system, sans-serif">{t('fonts.systemDefault')}</option>
              <option value="sans-serif">{t('fonts.sansSerif')}</option>
              <option value="serif">{t('fonts.serif')}</option>
              <option value="monospace">{t('fonts.monospace')}</option>
              <option value="cursive">{t('fonts.cursive')}</option>
              <option value="fantasy">{t('fonts.fantasy')}</option>
              <option value="Arial, sans-serif">{t('fonts.arial')}</option>
              <option value="'Courier New', monospace">{t('fonts.courierNew')}</option>
              <option value="'Times New Roman', serif">{t('fonts.timesNewRoman')}</option>
              <option value="Impact, fantasy">{t('fonts.impact')}</option>
              <option value="'Comic Sans MS', cursive">{t('fonts.comicSansMS')}</option>
              <option value="'Trebuchet MS', sans-serif">{t('fonts.trebuchetMS')}</option>
              <option value="'Lucida Console', Monaco, monospace">{t('fonts.lucidaConsole')}</option>
              <option value="Georgia, serif">{t('fonts.georgia')}</option>
              <option value="'Palatino Linotype', 'Book Antiqua', Palatino, serif">{t('fonts.palatino')}</option>
              <option value="Tahoma, Geneva, sans-serif">{t('fonts.tahoma')}</option>
              <option value="'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif">{t('fonts.franklinGothic')}</option>
            </select>
          </div>
          
          <div className="grid grid-cols-1 2xl:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-neutral-900 dark:text-white mb-2">{t('components.designEditor.fields.headingColor')}</label>
              <div className="flex items-center gap-2">
                <input type="color" value={design.headingColor} onChange={(e) => updateDesign({ headingColor: e.target.value })} className="w-10 h-10 shrink-0 rounded cursor-pointer border-0 p-0" />
                <input type="text" value={design.headingColor} onChange={(e) => updateDesign({ headingColor: e.target.value })} className="flex-1 min-w-0 px-2 py-2 text-xs rounded border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold text-neutral-900 dark:text-white mb-2">{t('components.designEditor.fields.bioColor')}</label>
              <div className="flex items-center gap-2">
                <input type="color" value={design.textColor} onChange={(e) => updateDesign({ textColor: e.target.value })} className="w-10 h-10 shrink-0 rounded cursor-pointer border-0 p-0" />
                <input type="text" value={design.textColor} onChange={(e) => updateDesign({ textColor: e.target.value })} className="flex-1 min-w-0 px-2 py-2 text-xs rounded border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800" />
              </div>
            </div>
          </div>
        </div>
      ))}

      {renderAccordion('advanced', t('components.designEditor.sections.advanced'), Sparkles, (
        <div className="space-y-6">
           <div>
              <label className="flex justify-between text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                <span>{t('components.designEditor.fields.profileImageRadius')}</span>
                <span className="text-accent-600">{design.profileBorderRadius}px</span>
              </label>
              <input type="range" min="0" max="100" value={design.profileBorderRadius} onChange={(e) => updateDesign({ profileBorderRadius: parseInt(e.target.value) })} className="w-full accent-accent-600" />
            </div>
            
           <div>
              <label className="flex justify-between text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                <span>{t('components.designEditor.fields.buttonSpacing')}</span>
                <span className="text-accent-600">{design.linkSpacing}px</span>
              </label>
              <input type="range" min="4" max="40" value={design.linkSpacing} onChange={(e) => updateDesign({ linkSpacing: parseInt(e.target.value) })} className="w-full accent-accent-600" />
            </div>

            <label className="flex items-center gap-3">
              <input type="checkbox" checked={design.showBio} onChange={(e) => updateDesign({ showBio: e.target.checked })} className="w-4 h-4 rounded accent-accent-600" />
              <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">{t('components.designEditor.fields.showBio')}</span>
            </label>
            <label className="flex items-center gap-3">
              <input type="checkbox" checked={design.animationEnabled} onChange={(e) => updateDesign({ animationEnabled: e.target.checked })} className="w-4 h-4 rounded accent-accent-600" />
              <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">{t('components.designEditor.fields.enableAnimations')}</span>
            </label>
        </div>
      ))}
    </div>
  )
}
