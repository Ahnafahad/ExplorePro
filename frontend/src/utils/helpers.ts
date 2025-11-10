import { format, formatDistance, differenceInHours } from 'date-fns'
import { COMMISSION_RATE, REFUND_POLICY } from '../constants'

/**
 * Format a date to a readable string
 */
export function formatDate(date: string | Date, formatStr: string = 'PPP'): string {
  return format(new Date(date), formatStr)
}

/**
 * Format a date as relative time (e.g., "2 hours ago")
 */
export function formatRelativeTime(date: string | Date): string {
  return formatDistance(new Date(date), new Date(), { addSuffix: true })
}

/**
 * Calculate total price for a booking
 */
export function calculateTotalPrice(hourlyRate: number, durationMinutes: number): number {
  const hours = durationMinutes / 60
  return Number((hourlyRate * hours).toFixed(2))
}

/**
 * Calculate commission and guide earnings
 */
export function calculateEarnings(totalPrice: number): {
  commission: number
  guideEarnings: number
} {
  const commission = Number((totalPrice * COMMISSION_RATE).toFixed(2))
  const guideEarnings = Number((totalPrice - commission).toFixed(2))
  return { commission, guideEarnings }
}

/**
 * Calculate refund amount based on cancellation time
 */
export function calculateRefund(
  totalPrice: number,
  scheduledDate: string | Date
): {
  refundAmount: number
  refundPercentage: number
} {
  const hoursUntil = differenceInHours(new Date(scheduledDate), new Date())

  let refundPercentage = 0

  if (hoursUntil >= 24) {
    refundPercentage = REFUND_POLICY.HOURS_24_PLUS
  } else if (hoursUntil >= 12) {
    refundPercentage = REFUND_POLICY.HOURS_12_TO_24
  } else if (hoursUntil >= 2) {
    refundPercentage = REFUND_POLICY.HOURS_2_TO_12
  } else {
    refundPercentage = REFUND_POLICY.HOURS_LESS_THAN_2
  }

  const refundAmount = Number((totalPrice * refundPercentage).toFixed(2))

  return { refundAmount, refundPercentage }
}

/**
 * Format currency (GBP)
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP',
  }).format(amount)
}

/**
 * Format duration in minutes to readable string
 */
export function formatDuration(minutes: number): string {
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60

  if (hours === 0) {
    return `${mins} min`
  } else if (mins === 0) {
    return `${hours} hr`
  } else {
    return `${hours} hr ${mins} min`
  }
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Truncate text to a certain length
 */
export function truncate(text: string, length: number): string {
  if (text.length <= length) return text
  return text.slice(0, length) + '...'
}

/**
 * Generate avatar initials from name
 */
export function getInitials(name: string): string {
  const names = name.split(' ')
  if (names.length === 1) {
    return names[0].charAt(0).toUpperCase()
  }
  return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase()
}

/**
 * Generate a random color for avatar background
 */
export function getAvatarColor(name: string): string {
  const colors = [
    'bg-red-500',
    'bg-blue-500',
    'bg-green-500',
    'bg-yellow-500',
    'bg-purple-500',
    'bg-pink-500',
    'bg-indigo-500',
  ]
  const index = name.charCodeAt(0) % colors.length
  return colors[index]
}

/**
 * Debounce function
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null
      func(...args)
    }

    if (timeout) {
      clearTimeout(timeout)
    }
    timeout = setTimeout(later, wait)
  }
}
