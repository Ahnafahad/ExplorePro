import { Request, Response } from 'express'
import { reviewService } from '../services/reviewService.js'
import { z } from 'zod'

const createReviewSchema = z.object({
  bookingId: z.string().uuid(),
  rating: z.number().min(1).max(5),
  comment: z.string().max(1000).optional(),
})

export class ReviewController {
  /**
   * Create a review
   */
  async createReview(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user!.userId
      const validatedData = createReviewSchema.parse(req.body)

      // Get tourist ID
      const { PrismaClient } = await import('@prisma/client')
      const prisma = new PrismaClient()
      const tourist = await prisma.tourist.findUnique({
        where: { userId },
      })

      if (!tourist) {
        res.status(404).json({
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: 'Tourist profile not found',
          },
        })
        return
      }

      // Verify booking belongs to tourist and get guide ID
      const booking = await prisma.booking.findUnique({
        where: { id: validatedData.bookingId },
      })

      if (!booking) {
        res.status(404).json({
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: 'Booking not found',
          },
        })
        return
      }

      if (booking.touristId !== tourist.id) {
        res.status(403).json({
          success: false,
          error: {
            code: 'FORBIDDEN',
            message: 'You can only review your own bookings',
          },
        })
        return
      }

      const review = await reviewService.createReview({
        ...validatedData,
        touristId: tourist.id,
        guideId: booking.guideId,
      })

      res.status(201).json({
        success: true,
        data: review,
        message: 'Review created successfully',
      })
    } catch (error: any) {
      console.error('Create review error:', error)

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
          code: 'CREATE_REVIEW_ERROR',
          message: error.message,
        },
      })
    }
  }

  /**
   * Get reviews for a guide
   */
  async getGuideReviews(req: Request, res: Response) {
    try {
      const { guideId } = req.params
      const page = parseInt(req.query.page as string) || 1
      const limit = parseInt(req.query.limit as string) || 20

      const result = await reviewService.getReviewsForGuide(guideId, page, limit)

      res.json({
        success: true,
        data: result.reviews,
        pagination: result.pagination,
      })
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: {
          code: 'SERVER_ERROR',
          message: error.message,
        },
      })
    }
  }

  /**
   * Get review for a booking
   */
  async getBookingReview(req: Request, res: Response): Promise<void> {
    try {
      const { bookingId } = req.params
      const review = await reviewService.getReviewForBooking(bookingId)

      if (!review) {
        res.status(404).json({
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: 'Review not found',
          },
        })
      }

      res.json({
        success: true,
        data: review,
      })
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: {
          code: 'SERVER_ERROR',
          message: error.message,
        },
      })
    }
  }
}

export const reviewController = new ReviewController()
