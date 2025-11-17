import { Request, Response } from 'express'
import { bookingService } from '../services/bookingService.js'
import { stripeService } from '../services/stripeService.js'
import { z } from 'zod'

const createBookingSchema = z.object({
  guideId: z.string().uuid(),
  tourId: z.string().uuid().optional(),
  type: z.enum(['INSTANT', 'SCHEDULED']),
  scheduledDate: z.string().datetime().optional(),
  duration: z.number().min(30),
  meetingPoint: z.string().min(5),
  totalPrice: z.number().min(0),
})

const sendMessageSchema = z.object({
  content: z.string().min(1).max(1000),
})

const updateLocationSchema = z.object({
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
})

export class BookingController {
  /**
   * Create a new booking
   */
  async createBooking(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user!.userId
      const validatedData = createBookingSchema.parse(req.body)

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

      // Create booking
      const booking = await bookingService.createBooking({
        ...validatedData,
        touristId: tourist.id,
        scheduledDate: validatedData.scheduledDate ? new Date(validatedData.scheduledDate) : undefined,
      })

      // Create Stripe payment intent
      const paymentIntent = await stripeService.createPaymentIntent(
        booking.id,
        booking.totalPrice
      )

      res.status(201).json({
        success: true,
        data: {
          booking,
          paymentIntent,
        },
        message: 'Booking created successfully',
      })
    } catch (error: any) {
      console.error('Create booking error:', error)

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
          code: 'CREATE_BOOKING_ERROR',
          message: error.message,
        },
      })
    }
  }

  /**
   * Get bookings for current user
   */
  async getBookings(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user!.userId
      const role = req.user!.role

      const bookings = await bookingService.getBookingsForUser(userId, role)

      res.json({
        success: true,
        data: bookings,
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
   * Get booking details
   */
  async getBooking(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params
      const booking = await bookingService.getBookingById(id)

      // Verify user has access to this booking
      const userId = req.user!.userId
      if (booking.tourist.userId !== userId && booking.guide.userId !== userId) {
        res.status(403).json({
          success: false,
          error: {
            code: 'FORBIDDEN',
            message: 'You do not have access to this booking',
          },
        })
      }

      res.json({
        success: true,
        data: booking,
      })
    } catch (error: any) {
      res.status(404).json({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: error.message,
        },
      })
    }
  }

  /**
   * Start tour (guide only)
   */
  async startTour(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params
      const userId = req.user!.userId

      const booking = await bookingService.getBookingById(id)
      if (booking.guide.userId !== userId) {
        res.status(403).json({
          success: false,
          error: {
            code: 'FORBIDDEN',
            message: 'Only the assigned guide can start the tour',
          },
        })
      }

      const updatedBooking = await bookingService.startTour(id)

      res.json({
        success: true,
        data: updatedBooking,
        message: 'Tour started successfully',
      })
    } catch (error: any) {
      res.status(400).json({
        success: false,
        error: {
          code: 'START_TOUR_ERROR',
          message: error.message,
        },
      })
    }
  }

  /**
   * Complete tour (guide only)
   */
  async completeTour(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params
      const userId = req.user!.userId

      const booking = await bookingService.getBookingById(id)
      if (booking.guide.userId !== userId) {
        res.status(403).json({
          success: false,
          error: {
            code: 'FORBIDDEN',
            message: 'Only the assigned guide can complete the tour',
          },
        })
      }

      const updatedBooking = await bookingService.completeTour(id)

      res.json({
        success: true,
        data: updatedBooking,
        message: 'Tour completed successfully',
      })
    } catch (error: any) {
      res.status(400).json({
        success: false,
        error: {
          code: 'COMPLETE_TOUR_ERROR',
          message: error.message,
        },
      })
    }
  }

  /**
   * Cancel booking
   */
  async cancelBooking(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params
      const userId = req.user!.userId

      const booking = await bookingService.getBookingById(id)
      if (booking.tourist.userId !== userId && booking.guide.userId !== userId) {
        res.status(403).json({
          success: false,
          error: {
            code: 'FORBIDDEN',
            message: 'You do not have access to this booking',
          },
        })
      }

      const result = await bookingService.cancelBooking(id)

      // Process refund if applicable
      if (result.refundAmount > 0 && booking.stripePaymentId) {
        await stripeService.processRefund(booking.stripePaymentId, result.refundAmount)
      }

      res.json({
        success: true,
        data: result,
        message: 'Booking cancelled successfully',
      })
    } catch (error: any) {
      res.status(400).json({
        success: false,
        error: {
          code: 'CANCEL_BOOKING_ERROR',
          message: error.message,
        },
      })
    }
  }

  /**
   * Get messages for booking
   */
  async getMessages(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params
      const userId = req.user!.userId

      const booking = await bookingService.getBookingById(id)
      if (booking.tourist.userId !== userId && booking.guide.userId !== userId) {
        res.status(403).json({
          success: false,
          error: {
            code: 'FORBIDDEN',
            message: 'You do not have access to these messages',
          },
        })
      }

      const messages = await bookingService.getMessages(id)

      // Mark messages as read
      await bookingService.markMessagesAsRead(id, userId)

      res.json({
        success: true,
        data: messages,
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
   * Send message
   */
  async sendMessage(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params
      const userId = req.user!.userId
      const validatedData = sendMessageSchema.parse(req.body)

      const booking = await bookingService.getBookingById(id)
      if (booking.tourist.userId !== userId && booking.guide.userId !== userId) {
        res.status(403).json({
          success: false,
          error: {
            code: 'FORBIDDEN',
            message: 'You do not have access to this booking',
          },
        })
      }

      const message = await bookingService.sendMessage(id, userId, validatedData.content)

      res.status(201).json({
        success: true,
        data: message,
        message: 'Message sent successfully',
      })
    } catch (error: any) {
      console.error('Send message error:', error)

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
          code: 'SEND_MESSAGE_ERROR',
          message: error.message,
        },
      })
    }
  }

  /**
   * Update location (guide only)
   */
  async updateLocation(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params
      const userId = req.user!.userId
      const validatedData = updateLocationSchema.parse(req.body)

      const booking = await bookingService.getBookingById(id)
      if (booking.guide.userId !== userId) {
        res.status(403).json({
          success: false,
          error: {
            code: 'FORBIDDEN',
            message: 'Only the assigned guide can update location',
          },
        })
      }

      await bookingService.updateLocation(id, validatedData.latitude, validatedData.longitude)

      res.json({
        success: true,
        message: 'Location updated successfully',
      })
    } catch (error: any) {
      console.error('Update location error:', error)

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
          code: 'UPDATE_LOCATION_ERROR',
          message: error.message,
        },
      })
    }
  }

  /**
   * Get location history
   */
  async getLocationHistory(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params
      const userId = req.user!.userId

      const booking = await bookingService.getBookingById(id)
      if (booking.tourist.userId !== userId && booking.guide.userId !== userId) {
        res.status(403).json({
          success: false,
          error: {
            code: 'FORBIDDEN',
            message: 'You do not have access to this booking',
          },
        })
      }

      const locations = await bookingService.getLocationHistory(id)

      res.json({
        success: true,
        data: locations,
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

export const bookingController = new BookingController()
