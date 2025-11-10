import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { api } from '../services/api'
import { pollingService } from '../services/pollingService'
import type { User, Role } from '../types'

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (name: string, email: string, password: string, role: Role) => Promise<void>
  logout: () => Promise<void>
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  // Check if user is already logged in on mount
  useEffect(() => {
    const checkAuth = async () => {
      const token = api.getToken()
      if (token) {
        try {
          const response = await api.get<User>('/api/auth/me')
          if (response.success && response.data) {
            setUser(response.data)
            // Start polling service for authenticated users
            pollingService.start()
          }
        } catch (error) {
          console.error('Auth check failed:', error)
          api.clearToken()
        }
      }
      setLoading(false)
    }

    checkAuth()

    // Cleanup polling on unmount
    return () => {
      pollingService.stop()
    }
  }, [])

  const login = async (email: string, password: string) => {
    try {
      const response = await api.post<{ user: User; token: string }>('/api/auth/login', {
        email,
        password,
      })

      if (response.success && response.data) {
        const { user, token } = response.data
        api.setToken(token)
        setUser(user)
        // Start polling service
        pollingService.start()
      }
    } catch (error: any) {
      console.error('Login failed:', error)
      throw new Error(error.response?.data?.error?.message || 'Login failed')
    }
  }

  const register = async (name: string, email: string, password: string, role: Role) => {
    try {
      const response = await api.post<{ user: User; token: string }>('/api/auth/register', {
        name,
        email,
        password,
        role,
      })

      if (response.success && response.data) {
        const { user, token } = response.data
        api.setToken(token)
        setUser(user)
        // Start polling service
        pollingService.start()
      }
    } catch (error: any) {
      console.error('Registration failed:', error)
      throw new Error(error.response?.data?.error?.message || 'Registration failed')
    }
  }

  const logout = async () => {
    try {
      await api.post('/api/auth/logout')
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      api.clearToken()
      setUser(null)
      // Stop polling service
      pollingService.stop()
    }
  }

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!user,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
