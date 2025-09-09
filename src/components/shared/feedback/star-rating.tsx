import { useState } from 'react'
import { FaStar } from 'react-icons/fa'

interface StarRatingProps {
  initialRating?: number
  onRate?: (rating: number) => void
  disabled?: boolean
  size?: 'sm' | 'md' | 'lg'
}

const StarRating = ({
  initialRating = 0,
  onRate,
  disabled = false,
  size = 'md',
}: StarRatingProps) => {
  const [rating, setRating] = useState(initialRating)
  const [hover, setHover] = useState(0)

  const sizeClasses = {
    sm: 'text-base',
    md: 'text-xl',
    lg: 'text-2xl',
  }

  const handleClick = (selectedRating: number) => {
    if (disabled) return
    setRating(selectedRating)
    if (onRate) {
      onRate(selectedRating)
    }
  }

  return (
    <div className="flex flex-col">
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onClick={() => handleClick(star)}
            onMouseEnter={() => !disabled && setHover(star)}
            onMouseLeave={() => !disabled && setHover(0)}
            className={`focus:outline-none transition-colors ${disabled ? 'cursor-default' : 'cursor-pointer'
              }`}
            disabled={disabled}
            aria-label={`Rate ${star} star${star > 1 ? 's' : ''}`}
            type="button"
          >
            <FaStar
              className={`${sizeClasses[size]} ${star <= (hover || rating)
                  ? 'text-yellow-400'
                  : 'text-gray-300 dark:text-gray-500'
                }`}
            />
          </button>
        ))}
      </div>
      {/* {!disabled && (
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          {hover ? hover : rating || ''}
        </p>
      )} */}
    </div>
  )
}

export default StarRating
