import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

interface CreateTourData {
  guideId: string
  title: string
  description: string
  duration: number
  price: number
}

interface UpdateTourData {
  title?: string
  description?: string
  duration?: number
  price?: number
  isActive?: boolean
}

export class TourService {
  /**
   * Create a new tour
   */
  async createTour(data: CreateTourData) {
    return await prisma.tour.create({
      data,
      include: {
        guide: {
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
    })
  }

  /**
   * Get tour by ID
   */
  async getTourById(tourId: string) {
    const tour = await prisma.tour.findUnique({
      where: { id: tourId },
      include: {
        guide: {
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
    })

    if (!tour) {
      throw new Error('Tour not found')
    }

    return tour
  }

  /**
   * Update tour
   */
  async updateTour(tourId: string, data: UpdateTourData) {
    return await prisma.tour.update({
      where: { id: tourId },
      data,
    })
  }

  /**
   * Delete tour (soft delete by setting isActive to false)
   */
  async deleteTour(tourId: string) {
    return await prisma.tour.update({
      where: { id: tourId },
      data: { isActive: false },
    })
  }

  /**
   * Get tours for a guide
   */
  async getToursForGuide(guideId: string) {
    return await prisma.tour.findMany({
      where: {
        guideId,
        isActive: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })
  }
}

export const tourService = new TourService()
