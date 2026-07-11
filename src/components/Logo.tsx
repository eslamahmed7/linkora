interface LogoProps {
  className?: string
  imageSize?: string
  textSize?: string
  showText?: boolean
}

export function Logo({ 
  className = '', 
  imageSize = 'h-8 w-auto', 
  textSize = 'text-xl',
  showText = true,
}: LogoProps) {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <img
        src="/logo.png"
        alt="Linkora"
        className={`${imageSize} object-contain`}
      />
      {showText && (
        <span
          className={`${textSize} font-bold tracking-wide bg-gradient-to-r from-neutral-900 to-neutral-600 dark:from-white dark:to-neutral-300 bg-clip-text text-transparent`}
        >
          Linkora
        </span>
      )}
    </div>
  )
}
