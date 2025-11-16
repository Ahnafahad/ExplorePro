import { guideService } from './guideService.js'
import prisma from '../utils/prisma.js'

interface CreateReviewData {
  bookingId: string
  touristId: string
  guideId: string
  rating: number
  comment?: string
}

export class ReviewService {
  /**
   * Create a review
   */
  async createReview(data: CreateReviewData) {
    // Check if booking exists and is completed
    const booking = await prisma.booking.findUnique({
      where: { id: data.bookingId },
    })

    if (!booking) {
      throw new Error('Booking not found')
    }

    if (booking.status !== 'COMPLETED') {
      throw new Error('Can only review completed bookings')
    }

    // Check if review already exists
    const existingReview = await prisma.review.findUnique({
      where: { bookingId: data.bookingId },
    })

    if (existingReview) {
      throw new Error('Review already exists for this booking')
    }

    // Create review
    const review = await prisma.review.create({
      data,
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
        guide: {
          include: {
            user: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    })

    // Update guide rating
    await guideService.updateGuideRating(data.guideId)

    return review
  }

  /**
   * Get reviews for a guide
   */
  async getReviewsForGuide(guideId: string, page: number = 1, limit: number = 20) {
    const skip = (page - 1) * limit

    const [reviews, total] = await Promise.all([
      prisma.review.findMany({
        where: { guideId },
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
        skip,
        take: limit,
      }),
      prisma.review.count({ where: { guideId } }),
    ])

    return {
      reviews,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    }
  }

  /**
   * Get review by ID
   */
  async getReviewById(reviewId: string) {
    const review = await prisma.review.findUnique({
      where: { id: reviewId },
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
        guide: {
          include: {
            user: {
              select: {
                name: true,
              },
            },
          },
        },
        booking: true,
      },
    })

    if (!review) {
      throw new Error('Review not found')
    }

    return review
  }

  /**
   * Get review for a booking
   */
  async getReviewForBooking(bookingId: string) {
    return await prisma.review.findUnique({
      where: { bookingId },
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
    })
  }
}

export const reviewService = new ReviewService()
