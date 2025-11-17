import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import prisma from '../utils/prisma.js'

interface RegisterData {
  name: string
  email: string
  password: string
  role: 'TOURIST' | 'GUIDE' | 'ADMIN'
  phone?: string
}

interface LoginData {
  email: string
  password: string
}

export class AuthService {
  /**
   * Register a new user
   */
  async register(data: RegisterData) {
    const { name, email, password, role, phone } = data

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      throw new Error('User with this email already exists')
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role,
        phone,
      },
    })

    // Create associated profile based on role
    if (role === 'TOURIST') {
      await prisma.tourist.create({
        data: {
          userId: user.id,
        },
      })
    } else if (role === 'GUIDE') {
      await prisma.guide.create({
        data: {
          userId: user.id,
          bio: '',
          languages: [],
          specialties: [],
          hourlyRate: 0,
          isAvailable: false,
        },
      })
    }

    // Generate JWT token
    const token = this.generateToken(user.id, user.email, user.role)

    // Return user without password
    const { password: _, ...userWithoutPassword } = user

    return {
      user: userWithoutPassword,
      token,
    }
  }

  /**
   * Login user
   */
  async login(data: LoginData) {
    const { email, password } = data

    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        tourist: true,
        guide: true,
      },
    })

    if (!user) {
      throw new Error('Invalid email or password')
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password)

    if (!isPasswordValid) {
      throw new Error('Invalid email or password')
    }

    // Generate JWT token
    const token = this.generateToken(user.id, user.email, user.role)

    // Return user without password
    const { password: _, ...userWithoutPassword } = user

    return {
      user: userWithoutPassword,
      token,
    }
  }

  /**
   * Get user by ID
   */
  async getUserById(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        tourist: true,
        guide: true,
      },
    })

    if (!user) {
      throw new Error('User not found')
    }

    // Return user without password
    const { password: _, ...userWithoutPassword } = user

    return userWithoutPassword
  }

  /**
   * Generate JWT token
   */
  private generateToken(userId: string, email: string, role: string): string {
    const secret = process.env.JWT_SECRET

    if (!secret) {
      throw new Error('JWT_SECRET not configured')
    }

    return jwt.sign(
      { userId, email, role },
      secret,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    )
  }
}

export const authService = new AuthService()
