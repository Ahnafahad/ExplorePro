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

export interface PaginationParams {
  page?: number
  limit?: number
}

export interface PaginatedResponse<T> {
  success: true
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export interface PollingUpdate {
  type: 'booking' | 'message' | 'location'
  data: any
  timestamp: string
}
