import { Request, Response } from 'express'
import { authService } from '../services/authService.js'
import { z } from 'zod'

// Validation schemas
const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  role: z.enum(['TOURIST', 'GUIDE', 'ADMIN']),
  phone: z.string().optional(),
})

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
})

export class AuthController {
  /**
   * Register a new user
   */
  async register(req: Request, res: Response): Promise<void> {
    try {
      // Validate request body
      const validatedData = registerSchema.parse(req.body)

      // Register user
      const result = await authService.register(validatedData)

      res.status(201).json({
        success: true,
        data: result,
        message: 'User registered successfully',
      })
    } catch (error: any) {
      console.error('Registration error:', error)

      if (error instanceof z.ZodError) {
        res.status(400).json({
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: error.errors[0].message,
            details: error.errors,
          },
        })
        return
      }

      res.status(400).json({
        success: false,
        error: {
          code: 'REGISTRATION_ERROR',
          message: error.message || 'Registration failed',
        },
      })
    }
  }

  /**
   * Login user
   */
  async login(req: Request, res: Response): Promise<void> {
    try {
      // Validate request body
      const validatedData = loginSchema.parse(req.body)

      // Login user
      const result = await authService.login(validatedData)

      res.json({
        success: true,
        data: result,
        message: 'Login successful',
      })
    } catch (error: any) {
      console.error('Login error:', error)

      if (error instanceof z.ZodError) {
        res.status(400).json({
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: error.errors[0].message,
            details: error.errors,
          },
        })
        return
      }

      res.status(401).json({
        success: false,
        error: {
          code: 'AUTH_ERROR',
          message: error.message || 'Login failed',
        },
      })
    }
  }

  /**
   * Get current user
   */
  async getCurrentUser(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user!.userId

      const user = await authService.getUserById(userId)

      res.json({
        success: true,
        data: user,
      })
    } catch (error: any) {
      console.error('Get current user error:', error)

      res.status(404).json({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: error.message || 'User not found',
        },
      })
    }
  }

  /**
   * Logout user
   */
  async logout(_req: Request, res: Response): Promise<void> {
    // For JWT-based auth, logout is handled client-side by removing the token
    // Here we can add token blacklisting or other logout logic if needed
    res.json({
      success: true,
      message: 'Logout successful',
    })
  }
}

export const authController = new AuthController()
