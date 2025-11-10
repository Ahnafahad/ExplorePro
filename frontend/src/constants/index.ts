export const APP_NAME = 'ExplorePro'
export const APP_DESCRIPTION = 'Your Uber for Tour Guides'

export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'
export const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || ''
export const STRIPE_PUBLISHABLE_KEY = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || ''

export const COMMISSION_RATE = 0.15 // 15% platform commission

export const MIN_TOUR_DURATION = 30 // 30 minutes
export const POLLING_INTERVAL = 3000 // 3 seconds

export const LANGUAGES = [
  'English',
  'Spanish',
  'French',
  'German',
  'Italian',
  'Portuguese',
  'Chinese',
  'Japanese',
  'Arabic',
]

export const SPECIALTIES = [
  'History',
  'Architecture',
  'Food & Cuisine',
  'Art & Museums',
  'Nature & Parks',
  'Photography',
  'Shopping',
  'Nightlife',
  'Family-Friendly',
  'Adventure',
]

export const REFUND_POLICY = {
  HOURS_24_PLUS: 1.0, // 100% refund
  HOURS_12_TO_24: 0.5, // 50% refund
  HOURS_2_TO_12: 0.25, // 25% refund
  HOURS_LESS_THAN_2: 0, // No refund
}
