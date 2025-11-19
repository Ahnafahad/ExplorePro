import axios, { AxiosInstance, AxiosError } from 'axios'
import type { ApiResponse, ApiError } from '../types'
import { demoGuides, demoTours, demoBookings, isDemoMode } from '../data/demoData'
import type { User } from '../types'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

class ApiService {
  private client: AxiosInstance

  constructor() {
    this.client = axios.create({
      baseURL: API_URL,
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: true,
    })

    // Request interceptor to add auth token
    this.client.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('token')
        if (token) {
          config.headers.Authorization = `Bearer ${token}`
        }
        return config
      },
      (error) => {
        return Promise.reject(error)
      }
    )

    // Response interceptor to handle errors
    this.client.interceptors.response.use(
      (response) => response,
      (error: AxiosError<ApiError>) => {
        if (error.response?.status === 401) {
          // Unauthorized - clear token and redirect to login
          localStorage.removeItem('token')
          window.location.href = '/login'
        }
        return Promise.reject(error)
      }
    )
  }

  // Check if current user is in demo mode
  private isInDemoMode(): boolean {
    const userStr = localStorage.getItem('demo_user')
    if (!userStr) return false
    try {
      const user = JSON.parse(userStr)
      return isDemoMode(user.email)
    } catch {
      return false
    }
  }

  // Simulate async delay for demo mode
  private async simulateDelay(): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, 300))
  }

  // Generic GET request
  async get<T>(url: string, params?: any): Promise<ApiResponse<T>> {
    // Intercept for demo mode
    if (this.isInDemoMode()) {
      await this.simulateDelay()
      return this.handleDemoGet<T>(url, params)
    }
    const response = await this.client.get<ApiResponse<T>>(url, { params })
    return response.data
  }

  // Generic POST request
  async post<T>(url: string, data?: any): Promise<ApiResponse<T>> {
    // Intercept for demo mode
    if (this.isInDemoMode()) {
      await this.simulateDelay()
      return this.handleDemoPost<T>(url, data)
    }
    const response = await this.client.post<ApiResponse<T>>(url, data)
    return response.data
  }

  // Generic PUT request
  async put<T>(url: string, data?: any): Promise<ApiResponse<T>> {
    // Intercept for demo mode
    if (this.isInDemoMode()) {
      await this.simulateDelay()
      return this.handleDemoPut<T>(url, data)
    }
    const response = await this.client.put<ApiResponse<T>>(url, data)
    return response.data
  }

  // Generic DELETE request
  async delete<T>(url: string): Promise<ApiResponse<T>> {
    // Intercept for demo mode
    if (this.isInDemoMode()) {
      await this.simulateDelay()
      return { success: true, data: {} as T }
    }
    const response = await this.client.delete<ApiResponse<T>>(url)
    return response.data
  }

  // Handle demo mode GET requests
  private handleDemoGet<T>(url: string, params?: any): ApiResponse<T> {
    const userStr = localStorage.getItem('demo_user')
    const user = userStr ? JSON.parse(userStr) : null

    // Auth endpoints
    if (url === '/api/auth/me') {
      return { success: true, data: user as T }
    }

    // Guides endpoints
    if (url.startsWith('/api/guides')) {
      const guidesWithTours = demoGuides.map(guide => ({
        ...guide,
        tours: demoTours.filter(tour => tour.guideId === guide.id)
      }))

      if (url.includes('/api/guides/')) {
        const id = url.split('/api/guides/')[1].split('/')[0]
        const guide = guidesWithTours.find(g => g.id === id)
        return { success: true, data: guide as T }
      }

      // Filter by userId if present
      if (params?.userId) {
        const guide = guidesWithTours.find(g => g.userId === params.userId)
        return { success: true, data: (guide ? [guide] : []) as T }
      }

      return { success: true, data: guidesWithTours as T }
    }

    // Bookings endpoints
    if (url === '/api/bookings') {
      return { success: true, data: demoBookings as T }
    }

    // Tours endpoints
    if (url.startsWith('/api/tours')) {
      return { success: true, data: demoTours as T }
    }

    return { success: true, data: [] as T }
  }

  // Handle demo mode POST requests
  private handleDemoPost<T>(url: string, data?: any): ApiResponse<T> {
    // Auth login
    if (url === '/api/auth/login') {
      const { email, password } = data
      if (isDemoMode(email) && password === 'Demo123!') {
        // Find the matching demo guide/tourist/admin
        let user: User | null = null

        if (email === 'demo.guide@explorepro.com') {
          const guide = demoGuides.find(g => g.user.email === email)
          if (guide) {
            user = guide.user
          }
        } else if (email === 'demo.tourist@explorepro.com') {
          user = {
            id: 'user-tourist-demo',
            email,
            name: 'Demo Tourist',
            role: 'TOURIST',
            photo: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&h=400&fit=crop',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          }
        } else if (email === 'demo.admin@explorepro.com') {
          user = {
            id: 'user-admin-demo',
            email,
            name: 'Demo Admin',
            role: 'ADMIN',
            photo: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=400&fit=crop',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          }
        }

        if (user) {
          localStorage.setItem('demo_user', JSON.stringify(user))
          localStorage.setItem('token', 'demo-token')
          return { success: true, data: { user, token: 'demo-token' } as T }
        }
      }
      throw new Error('Invalid credentials')
    }

    // Auth register
    if (url === '/api/auth/register') {
      const { name, email, role } = data
      const user: User = {
        id: `demo-${role.toLowerCase()}-${Date.now()}`,
        email,
        name,
        role,
        photo: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      localStorage.setItem('demo_user', JSON.stringify(user))
      localStorage.setItem('token', 'demo-token')
      return { success: true, data: { user, token: 'demo-token' } as T }
    }

    // Auth logout
    if (url === '/api/auth/logout') {
      localStorage.removeItem('demo_user')
      return { success: true, data: {} as T }
    }

    // Create guide profile
    if (url === '/api/guides') {
      return { success: true, data: { id: 'demo-guide-new' } as T }
    }

    return { success: true, data: {} as T }
  }

  // Handle demo mode PUT requests
  private handleDemoPut<T>(url: string, data?: any): ApiResponse<T> {
    // Update user profile
    if (url === '/api/auth/profile') {
      const userStr = localStorage.getItem('demo_user')
      if (userStr) {
        const user = JSON.parse(userStr)
        const updatedUser = { ...user, ...data }
        localStorage.setItem('demo_user', JSON.stringify(updatedUser))
        return { success: true, data: updatedUser as T }
      }
    }

    // Toggle guide availability
    if (url.includes('/availability')) {
      return { success: true, data: {} as T }
    }

    // Update booking status
    if (url.includes('/bookings/')) {
      return { success: true, data: {} as T }
    }

    return { success: true, data: {} as T }
  }

  // Set auth token
  setToken(token: string) {
    localStorage.setItem('token', token)
  }

  // Clear auth token
  clearToken() {
    localStorage.removeItem('token')
    localStorage.removeItem('demo_user')
  }

  // Get auth token
  getToken(): string | null {
    return localStorage.getItem('token')
  }
}

export const api = new ApiService()
