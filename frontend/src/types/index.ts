export enum Role {
  TOURIST = 'TOURIST',
  GUIDE = 'GUIDE',
  ADMIN = 'ADMIN',
}

export enum GuideStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  SUSPENDED = 'SUSPENDED',
}

export enum BookingType {
  INSTANT = 'INSTANT',
  SCHEDULED = 'SCHEDULED',
}

export enum BookingStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  STARTED = 'STARTED',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  REFUNDED = 'REFUNDED',
}

export interface User {
  id: string
  email: string
  role: Role
  name: string
  phone?: string
  photo?: string
  createdAt: string
  updatedAt: string
  // Optional nested data for demo mode
  guide?: any
  tourist?: any
  admin?: any
}

export interface Tourist {
  id: string
  userId: string
  user: User
  preferredLang: string
}

export interface Guide {
  id: string
  userId: string
  user: User
  bio: string
  languages: string[]
  specialties: string[]
  hourlyRate: number
  isAvailable: boolean
  status: GuideStatus
  verificationDoc?: string
  averageRating?: number
  totalReviews: number
  tours?: Tour[]
  reviews?: Review[]
}

export interface Tour {
  id: string
  guideId: string
  guide?: Guide
  title: string
  description: string
  duration: number
  price: number
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface Booking {
  id: string
  touristId: string
  tourist?: Tourist
  guideId: string
  guide?: Guide
  tourId?: string
  tour?: Tour
  type: BookingType
  status: BookingStatus
  scheduledDate?: string
  startTime?: string
  endTime?: string
  duration: number
  meetingPoint: string
  totalPrice: number
  commission: number
  guideEarnings: number
  stripePaymentId?: string
  createdAt: string
  updatedAt: string
  review?: Review
}

export interface Review {
  id: string
  bookingId: string
  booking?: Booking
  touristId: string
  tourist?: Tourist
  guideId: string
  guide?: Guide
  rating: number
  comment?: string
  createdAt: string
}

export interface Message {
  id: string
  bookingId: string
  senderId: string
  content: string
  isRead: boolean
  createdAt: string
}

export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  message?: string
}

export interface ApiError {
  success: false
  error: {
    code: string
    message: string
    details?: any
  }
}

export interface PollingUpdate {
  type: 'booking' | 'message' | 'location'
  data: any
  timestamp: string
}
