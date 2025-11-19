import { GuideStatus } from '@prisma/client'
import prisma from '../utils/prisma.js'
import { getDemoGuideByUserId, getDemoGuideById, isDemoUser } from '../data/demoData.js'

interface CreateGuideData {
  userId: string
  bio: string
  languages: string[]
  specialties: string[]
  hourlyRate: number
  verificationDoc?: string
}

interface UpdateGuideData {
  bio?: string
  languages?: string[]
  specialties?: string[]
  hourlyRate?: number
  verificationDoc?: string
  isAvailable?: boolean
}

interface GuideFilters {
  language?: string
  specialty?: string
  isAvailable?: boolean
  minRate?: number
  maxRate?: number
}

export class GuideService {
  /**
   * Create or update guide profile
   */
  async createOrUpdateGuide(userId: string, data: CreateGuideData) {
    // Check if guide profile already exists
    const existingGuide = await prisma.guide.findUnique({
      where: { userId },
    })

    if (existingGuide) {
      // Update existing guide
      return await prisma.guide.update({
        where: { userId },
        data: {
          bio: data.bio,
          languages: data.languages,
          specialties: data.specialties,
          hourlyRate: data.hourlyRate,
          verificationDoc: data.verificationDoc,
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              phone: true,
              photo: true,
              role: true,
            },
          },
        },
      })
    }

    // Create new guide
    return await prisma.guide.create({
      data: {
        userId,
        bio: data.bio,
        languages: data.languages,
        specialties: data.specialties,
        hourlyRate: data.hourlyRate,
        verificationDoc: data.verificationDoc,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            photo: true,
            role: true,
          },
        },
      },
    })
  }

  /**
   * Get guide by ID
   */
  async getGuideById(guideId: string) {
    // Check if this is a demo guide
    if (guideId.startsWith('demo-')) {
      const demoGuide = getDemoGuideById(guideId)
      if (!demoGuide) {
        throw new Error('Guide not found')
      }
      return demoGuide as any
    }

    // Regular database query
    const guide = await prisma.guide.findUnique({
      where: { id: guideId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            photo: true,
            role: true,
          },
        },
        tours: {
          where: { isActive: true },
        },
        reviews: {
          include: {
            tourist: {
              include: {
                user: {
                  select: {
                    name: true,
                    photo: true,
                  },
                },
              },
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
          take: 10,
        },
      },
    })

    if (!guide) {
      throw new Error('Guide not found')
    }

    return guide
  }

  /**
   * Get guide by user ID
   */
  async getGuideByUserId(userId: string) {
    // Check if this is a demo user
    if (isDemoUser(userId)) {
      const demoGuide = getDemoGuideByUserId(userId)
      if (!demoGuide) {
        throw new Error('Guide profile not found')
      }
      return demoGuide as any
    }

    // Regular database query
    const guide = await prisma.guide.findUnique({
      where: { userId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            photo: true,
            role: true,
          },
        },
        tours: {
          where: { isActive: true },
        },
      },
    })

    if (!guide) {
      throw new Error('Guide profile not found')
    }

    return guide
  }

  /**
   * List guides with filters and pagination
   */
  async listGuides(filters: GuideFilters = {}, page: number = 1, limit: number = 20) {
    const skip = (page - 1) * limit

    const where: any = {
      status: GuideStatus.APPROVED,
    }

    if (filters.isAvailable !== undefined) {
      where.isAvailable = filters.isAvailable
    }

    if (filters.language) {
      where.languages = {
        has: filters.language,
      }
    }

    if (filters.specialty) {
      where.specialties = {
        has: filters.specialty,
      }
    }

    if (filters.minRate !== undefined || filters.maxRate !== undefined) {
      where.hourlyRate = {}
      if (filters.minRate !== undefined) {
        where.hourlyRate.gte = filters.minRate
      }
      if (filters.maxRate !== undefined) {
        where.hourlyRate.lte = filters.maxRate
      }
    }

    const [guides, total] = await Promise.all([
      prisma.guide.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              photo: true,
            },
          },
        },
        skip,
        take: limit,
        orderBy: [
          { isAvailable: 'desc' },
          { averageRating: 'desc' },
        ],
      }),
      prisma.guide.count({ where }),
    ])

    return {
      guides,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    }
  }

  /**
   * Update guide profile
   */
  async updateGuide(guideId: string, data: UpdateGuideData) {
    const guide = await prisma.guide.update({
      where: { id: guideId },
      data,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            photo: true,
            role: true,
          },
        },
      },
    })

    return guide
  }

  /**
   * Toggle guide availability
   */
  async toggleAvailability(guideId: string) {
    const guide = await prisma.guide.findUnique({
      where: { id: guideId },
    })

    if (!guide) {
      throw new Error('Guide not found')
    }

    return await prisma.guide.update({
      where: { id: guideId },
      data: {
        isAvailable: !guide.isAvailable,
      },
    })
  }

  /**
   * Update guide rating (called after new review)
   */
  async updateGuideRating(guideId: string) {
    const reviews = await prisma.review.findMany({
      where: { guideId },
    })

    const totalReviews = reviews.length
    const averageRating = totalReviews > 0
      ? reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews
      : 0

    await prisma.guide.update({
      where: { id: guideId },
      data: {
        averageRating,
        totalReviews,
      },
    })
  }
}

export const guideService = new GuideService()
