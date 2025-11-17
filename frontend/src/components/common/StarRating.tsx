import { Star } from 'lucide-react'

interface StarRatingProps {
  rating: number
  maxRating?: number
  size?: 'sm' | 'md' | 'lg'
  showNumber?: boolean
  interactive?: boolean
  onChange?: (rating: number) => void
}

export function StarRating({
  rating,
  maxRating = 5,
  size = 'md',
  showNumber = false,
  interactive = false,
  onChange,
}: StarRatingProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  }

  const handleClick = (value: number) => {
    if (interactive && onChange) {
      onChange(value)
    }
  }

  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: maxRating }, (_, i) => {
        const starValue = i + 1
        const isFilled = starValue <= rating

        return (
          <button
            key={i}
            type="button"
            onClick={() => handleClick(starValue)}
            disabled={!interactive}
            className={`
              ${interactive ? 'cursor-pointer hover:scale-110 active:scale-95' : 'cursor-default'}
              transition-transform duration-150
              focus:outline-none focus:ring-2 focus:ring-warning-400 focus:ring-offset-1 rounded-sm
            `}
          >
            <Star
              className={`${sizeClasses[size]} transition-colors ${
                isFilled
                  ? 'fill-warning-400 text-warning-400'
                  : interactive
                    ? 'text-neutral-300 hover:text-warning-200'
                    : 'text-neutral-300'
              }`}
            />
          </button>
        )
      })}
      {showNumber && (
        <span className="ml-2 text-sm font-bold text-neutral-900">
          {rating.toFixed(1)}
          <span className="text-neutral-500 font-normal"> / {maxRating}</span>
        </span>
      )}
    </div>
  )
}
