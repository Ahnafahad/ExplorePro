import { ReactNode } from 'react'

interface CardProps {
  children: ReactNode
  className?: string
  onClick?: () => void
  variant?: 'default' | 'glass' | 'bordered' | 'elevated'
  hover?: boolean
  padding?: 'none' | 'sm' | 'md' | 'lg'
}

export function Card({
  children,
  className = '',
  onClick,
  variant = 'default',
  hover = true,
  padding = 'md'
}: CardProps) {
  const clickableClass = onClick ? 'cursor-pointer' : ''
  const hoverClass = (hover && !onClick) ? 'card-hover' : onClick ? 'card-hover' : ''

  const variantClasses = {
    default: 'card',
    glass: 'card-glass',
    bordered: 'bg-white border-2 border-neutral-200 rounded-2xl hover:border-primary-300 hover:shadow-medium transition-all duration-300',
    elevated: 'bg-white rounded-2xl shadow-large hover:shadow-xl transition-all duration-300'
  }

  const paddingClasses = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8'
  }

  return (
    <div
      className={`
        ${variantClasses[variant]}
        ${paddingClasses[padding]}
        ${clickableClass}
        ${hoverClass}
        ${className}
      `}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onClick()
        }
      } : undefined}
    >
      {children}
    </div>
  )
}
