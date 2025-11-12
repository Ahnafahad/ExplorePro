import { User } from 'lucide-react'
import { getInitials, getAvatarColor } from '../../utils/helpers'

interface AvatarProps {
  src?: string | null
  name?: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
}

export function Avatar({ src, name = 'User', size = 'md', className = '' }: AvatarProps) {
  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base',
    xl: 'w-16 h-16 text-lg',
  }

  const colorClass = getAvatarColor(name)

  if (src) {
    return (
      <img
        src={src}
        alt={name}
        className={`${sizeClasses[size]} rounded-full object-cover ${className}`}
      />
    )
  }

  return (
    <div
      className={`${sizeClasses[size]} rounded-full ${colorClass} flex items-center justify-center text-white font-semibold ${className}`}
    >
      {name ? getInitials(name) : <User className="w-1/2 h-1/2" />}
    </div>
  )
}
