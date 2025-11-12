interface LoadingProps {
  size?: 'sm' | 'md' | 'lg'
  fullScreen?: boolean
  text?: string
}

export function Loading({ size = 'md', fullScreen = false, text }: LoadingProps) {
  const sizeClasses = {
    sm: 'h-6 w-6 border-2',
    md: 'h-12 w-12 border-2',
    lg: 'h-16 w-16 border-4',
  }

  const spinner = (
    <div className="flex flex-col items-center gap-3">
      <div
        className={`animate-spin rounded-full border-primary-600 border-t-transparent ${sizeClasses[size]}`}
      />
      {text && <p className="text-gray-600">{text}</p>}
    </div>
  )

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white bg-opacity-90 flex items-center justify-center z-50">
        {spinner}
      </div>
    )
  }

  return spinner
}
