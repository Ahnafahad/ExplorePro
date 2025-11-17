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

// Demo accounts that work without database (for testing/demos)
const DEMO_ACCOUNTS = {
  'demo.tourist@explorepro.com': {
    id: 'demo-tourist-001',
    email: 'demo.tourist@explorepro.com',
    name: 'Demo Tourist',
    role: 'TOURIST' as const,
    phone: '+44 7700 900001',
    photo: null,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
    tourist: {
      id: 'demo-tourist-profile-001',
      userId: 'demo-tourist-001',
      preferredLang: 'English',
    },
    guide: null,
  },
  'demo.guide@explorepro.com': {
    id: 'demo-guide-001',
    email: 'demo.guide@explorepro.com',
    name: 'Demo Guide',
    role: 'GUIDE' as const,
    phone: '+44 7700 900002',
    photo: null,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
    tourist: null,
    guide: {
      id: 'demo-guide-profile-001',
      userId: 'demo-guide-001',
      bio: 'Experienced local guide showcasing the best of Oxford',
      languages: ['English', 'Spanish'],
      specialties: ['History', 'Architecture', 'Food'],
      hourlyRate: 50,
      isAvailable: true,
      status: 'APPROVED' as const,
      verificationDoc: null,
    },
  },
  'demo.admin@explorepro.com': {
    id: 'demo-admin-001',
    email: 'demo.admin@explorepro.com',
    name: 'Demo Admin',
    role: 'ADMIN' as const,
    phone: '+44 7700 900003',
    photo: null,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
    tourist: null,
    guide: null,
  },
}

const DEMO_PASSWORD = 'Demo123!'

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

    // Check if this is a demo account (works without database)
    if (email in DEMO_ACCOUNTS) {
      if (password !== DEMO_PASSWORD) {
        throw new Error('Invalid email or password')
      }

      const demoUser = DEMO_ACCOUNTS[email as keyof typeof DEMO_ACCOUNTS]
      const token = this.generateToken(demoUser.id, demoUser.email, demoUser.role)

      return {
        user: demoUser,
        token,
      }
    }

    // Regular login flow (requires database)
    try {
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
    } catch (error: any) {
      // If database is unavailable, provide helpful error
      if (error.message?.includes('database') || error.message?.includes('connection')) {
        throw new Error('Service temporarily unavailable. Please try demo accounts.')
      }
      throw error
    }
  }

  /**
   * Get user by ID
   */
  async getUserById(userId: string) {
    // Check if this is a demo account ID
    const demoUser = Object.values(DEMO_ACCOUNTS).find(user => user.id === userId)
    if (demoUser) {
      return demoUser
    }

    // Regular database lookup
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

    const expiresIn = process.env.JWT_EXPIRES_IN || '7d'

    return jwt.sign(
      { userId, email, role },
      secret,
      { expiresIn } as jwt.SignOptions
    )
  }
}

export const authService = new AuthService()
