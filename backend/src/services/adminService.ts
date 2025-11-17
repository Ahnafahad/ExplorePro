import { GuideStatus } from '@prisma/client'
import prisma from '../utils/prisma.js'

export class AdminService {
  /**
   * Get pending guide applications
   */
  async getPendingGuides() {
    return await prisma.guide.findMany({
      where: {
        status: GuideStatus.PENDING,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            photo: true,
            createdAt: true,
          },
        },
      },
      orderBy: {
        user: {
          createdAt: 'asc',
        },
      },
    })
  }

  /**
   * Approve guide
   */
  async approveGuide(guideId: string) {
    const guide = await prisma.guide.update({
      where: { id: guideId },
      data: {
        status: GuideStatus.APPROVED,
      },
      include: {
        user: true,
      },
    })

    // TODO: Send approval email to guide

    return guide
  }

  /**
   * Reject guide
   */
  async rejectGuide(guideId: string, reason?: string) {
    const guide = await prisma.guide.update({
      where: { id: guideId },
      data: {
        status: GuideStatus.REJECTED,
      },
      include: {
        user: true,
      },
    })

    // TODO: Send rejection email to guide with reason

    return guide
  }

  /**
   * Suspend guide
   */
  async suspendGuide(guideId: string) {
    return await prisma.guide.update({
      where: { id: guideId },
      data: {
        status: GuideStatus.SUSPENDED,
        isAvailable: false,
      },
    })
  }

  /**
   * Get platform statistics
   */
  async getStatistics() {
    const [
      totalUsers,
      totalTourists,
      totalGuides,
      approvedGuides,
      pendingGuides,
      totalBookings,
      completedBookings,
      totalRevenue,
      recentBookings,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.tourist.count(),
      prisma.guide.count(),
      prisma.guide.count({ where: { status: GuideStatus.APPROVED } }),
      prisma.guide.count({ where: { status: GuideStatus.PENDING } }),
      prisma.booking.count(),
      prisma.booking.count({ where: { status: 'COMPLETED' } }),
      prisma.booking.aggregate({
        where: { status: 'COMPLETED' },
        _sum: { totalPrice: true },
      }),
      prisma.booking.findMany({
        take: 10,
        orderBy: { createdAt: 'desc' },
        include: {
          tourist: {
            include: {
              user: {
                select: { name: true },
              },
            },
          },
          guide: {
            include: {
              user: {
                select: { name: true },
              },
            },
          },
        },
      }),
    ])

    const gmv = totalRevenue._sum.totalPrice || 0
    const commission = gmv * 0.15

    return {
      users: {
        total: totalUsers,
        tourists: totalTourists,
        guides: totalGuides,
        approvedGuides,
        pendingGuides,
      },
      bookings: {
        total: totalBookings,
        completed: completedBookings,
      },
      revenue: {
        gmv,
        commission,
        averageBookingValue: totalBookings > 0 ? gmv / totalBookings : 0,
      },
      recentBookings,
    }
  }

  /**
   * Get all guides (for admin management)
   */
  async getAllGuides(status?: GuideStatus) {
    const where: any = {}
    if (status) {
      where.status = status
    }

    return await prisma.guide.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            photo: true,
            createdAt: true,
          },
        },
      },
      orderBy: {
        user: {
          createdAt: 'desc',
        },
      },
    })
  }

  /**
   * Get all bookings (for admin oversight)
   */
  async getAllBookings(page: number = 1, limit: number = 50) {
    const skip = (page - 1) * limit

    const [bookings, total] = await Promise.all([
      prisma.booking.findMany({
        include: {
          tourist: {
            include: {
              user: {
                select: { name: true, email: true },
              },
            },
          },
          guide: {
            include: {
              user: {
                select: { name: true, email: true },
              },
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
        skip,
        take: limit,
      }),
      prisma.booking.count(),
    ])

    return {
      bookings,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    }
  }
}

export const adminService = new AdminService()
