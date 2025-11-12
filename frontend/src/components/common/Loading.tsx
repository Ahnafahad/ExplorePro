import { Loader2 } from 'lucide-react'

interface LoadingProps {
  size?: 'sm' | 'md' | 'lg'
  fullScreen?: boolean
  text?: string
  variant?: 'spinner' | 'dots' | 'pulse'
}

export function Loading({
  size = 'md',
  fullScreen = false,
  text,
  variant = 'spinner'
}: LoadingProps) {
  const sizeClasses = {
    sm: 'w-5 h-5',
    md: 'w-10 h-10',
    lg: 'w-16 h-16',
  }

  const dotSizeClasses = {
    sm: 'w-2 h-2',
    md: 'w-3 h-3',
    lg: 'w-4 h-4',
  }

  const renderLoader = () => {
    switch (variant) {
      case 'spinner':
        return (
          <Loader2 className={`${sizeClasses[size]} text-primary-600 animate-spin`} />
        )
      case 'dots':
        return (
          <div className="flex gap-2">
            <div className={`${dotSizeClasses[size]} rounded-full bg-primary-600 animate-bounce`} />
            <div className={`${dotSizeClasses[size]} rounded-full bg-primary-600 animate-bounce`} style={{ animationDelay: '0.1s' }} />
            <div className={`${dotSizeClasses[size]} rounded-full bg-primary-600 animate-bounce`} style={{ animationDelay: '0.2s' }} />
          </div>
        )
      case 'pulse':
        return (
          <div className="relative">
            <div className={`${sizeClasses[size]} rounded-full bg-primary-600 animate-pulse`} />
            <div className={`absolute inset-0 ${sizeClasses[size]} rounded-full bg-primary-400 animate-ping`} />
          </div>
        )
      default:
        return null
    }
  }

  const loader = (
    <div className="flex flex-col items-center gap-4 animate-fade-in">
      {renderLoader()}
      {text && (
        <p className="text-neutral-600 font-medium animate-pulse-soft">{text}</p>
      )}
    </div>
  )

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white/90 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in">
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-neutral-100 animate-scale-in">
          {loader}
        </div>
      </div>
    )
  }

  return loader
}
