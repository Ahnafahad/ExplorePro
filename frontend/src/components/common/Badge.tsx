import { ReactNode } from 'react'

interface BadgeProps {
  children: ReactNode
  variant?: 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'gray' | 'secondary'
  size?: 'sm' | 'md' | 'lg'
  icon?: ReactNode
  dot?: boolean
}

export function Badge({
  children,
  variant = 'gray',
  size = 'sm',
  icon,
  dot = false
}: BadgeProps) {
  const variantClasses = {
    primary: 'badge badge-primary',
    secondary: 'bg-secondary-100 text-secondary-700 ring-1 ring-secondary-200',
    success: 'badge badge-success',
    warning: 'badge badge-warning',
    danger: 'badge badge-danger',
    info: 'bg-blue-100 text-blue-700 ring-1 ring-blue-200',
    gray: 'bg-neutral-100 text-neutral-700 ring-1 ring-neutral-200',
  }

  const sizeClasses = {
    sm: 'px-2.5 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-1.5 text-base',
  }

  const dotSizeClasses = {
    sm: 'w-1.5 h-1.5',
    md: 'w-2 h-2',
    lg: 'w-2.5 h-2.5',
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-semibold rounded-full ${variantClasses[variant]} ${sizeClasses[size]}`}
    >
      {dot && (
        <span className={`${dotSizeClasses[size]} rounded-full bg-current opacity-60`} />
      )}
      {icon && <span className="flex-shrink-0">{icon}</span>}
      {children}
    </span>
  )
}
