import { PrismaClient, BookingType, BookingStatus } from '@prisma/client'
import { pollingService } from '../polling/pollingService.js'
import { differenceInHours } from 'date-fns'

const prisma = new PrismaClient()

const COMMISSION_RATE = 0.15

interface CreateBookingData {
  touristId: string
  guideId: string
  tourId?: string
  type: BookingType
  scheduledDate?: Date
  duration: number
  meetingPoint: string
  totalPrice: number
}

export class BookingService {
  /**
   * Create a new booking
   */
  async createBooking(data: CreateBookingData) {
    // Check guide availability
    const guide = await prisma.guide.findUnique({
      where: { id: data.guideId },
    })

    if (!guide) {
      throw new Error('Guide not found')
    }

    if (data.type === BookingType.INSTANT && !guide.isAvailable) {
      throw new Error('Guide is not currently available')
    }

    // Calculate commission and earnings
    const commission = Number((data.totalPrice * COMMISSION_RATE).toFixed(2))
    const guideEarnings = Number((data.totalPrice - commission).toFixed(2))

    // Create booking
    const booking = await prisma.booking.create({
      data: {
        ...data,
        commission,
        guideEarnings,
        status: BookingStatus.PENDING,
      },
      include: {
        tourist: {
          include: {
            user: true,
          },
        },
        guide: {
          include: {
            user: true,
          },
        },
        tour: true,
      },
    })

    // Send polling updates to both tourist and guide
    pollingService.addBookingUpdate(
      data.touristId,
      booking.id,
      booking.status,
      { booking }
    )
    pollingService.addBookingUpdate(
      data.guideId,
      booking.id,
      booking.status,
      { booking }
    )

    return booking
  }

  /**
   * Get booking by ID
   */
  async getBookingById(bookingId: string) {
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        tourist: {
          include: {
            user: true,
          },
        },
        guide: {
          include: {
            user: true,
          },
        },
        tour: true,
        messages: {
          orderBy: {
            createdAt: 'asc',
          },
        },
      },
    })

    if (!booking) {
      throw new Error('Booking not found')
    }

    return booking
  }

  /**
   * Get bookings for a user
   */
  async getBookingsForUser(userId: string, role: string) {
    const where: any = {}

    if (role === 'TOURIST') {
      const tourist = await prisma.tourist.findUnique({
        where: { userId },
      })
      if (!tourist) throw new Error('Tourist profile not found')
      where.touristId = tourist.id
    } else if (role === 'GUIDE') {
      const guide = await prisma.guide.findUnique({
        where: { userId },
      })
      if (!guide) throw new Error('Guide profile not found')
      where.guideId = guide.id
    }

    return await prisma.booking.findMany({
      where,
      include: {
        tourist: {
          include: {
            user: {
              select: {
                name: true,
                photo: true,
                phone: true,
              },
            },
          },
        },
        guide: {
          include: {
            user: {
              select: {
                name: true,
                photo: true,
                phone: true,
              },
            },
          },
        },
        tour: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })
  }

  /**
   * Update booking status
   */
  async updateBookingStatus(bookingId: string, status: BookingStatus) {
    const booking = await prisma.booking.update({
      where: { id: bookingId },
      data: { status },
      include: {
        tourist: {
          include: {
            user: true,
          },
        },
        guide: {
          include: {
            user: true,
          },
        },
      },
    })

    // Send polling updates
    pollingService.addBookingUpdate(
      booking.tourist.userId,
      booking.id,
      status
    )
    pollingService.addBookingUpdate(
      booking.guide.userId,
      booking.id,
      status
    )

    return booking
  }

  /**
   * Start tour
   */
  async startTour(bookingId: string) {
    const booking = await prisma.booking.update({
      where: { id: bookingId },
      data: {
        status: BookingStatus.STARTED,
        startTime: new Date(),
      },
      include: {
        tourist: { include: { user: true } },
        guide: { include: { user: true } },
      },
    })

    // Send polling updates
    pollingService.addBookingUpdate(
      booking.tourist.userId,
      booking.id,
      BookingStatus.STARTED
    )

    return booking
  }

  /**
   * Complete tour
   */
  async completeTour(bookingId: string) {
    const booking = await prisma.booking.update({
      where: { id: bookingId },
      data: {
        status: BookingStatus.COMPLETED,
        endTime: new Date(),
      },
      include: {
        tourist: { include: { user: true } },
        guide: { include: { user: true } },
      },
    })

    // Send polling updates
    pollingService.addBookingUpdate(
      booking.tourist.userId,
      booking.id,
      BookingStatus.COMPLETED
    )

    return booking
  }

  /**
   * Cancel booking
   */
  async cancelBooking(bookingId: string) {
    const booking = await this.getBookingById(bookingId)

    // Calculate refund if scheduled
    let refundPercentage = 0
    if (booking.scheduledDate) {
      const hoursUntil = differenceInHours(booking.scheduledDate, new Date())
      if (hoursUntil >= 24) {
        refundPercentage = 1.0
      } else if (hoursUntil >= 12) {
        refundPercentage = 0.5
      } else if (hoursUntil >= 2) {
        refundPercentage = 0.25
      }
    }

    const updatedBooking = await prisma.booking.update({
      where: { id: bookingId },
      data: {
        status: BookingStatus.CANCELLED,
      },
      include: {
        tourist: { include: { user: true } },
        guide: { include: { user: true } },
      },
    })

    // Send polling updates
    pollingService.addBookingUpdate(
      updatedBooking.tourist.userId,
      bookingId,
      BookingStatus.CANCELLED,
      { refundPercentage }
    )
    pollingService.addBookingUpdate(
      updatedBooking.guide.userId,
      bookingId,
      BookingStatus.CANCELLED
    )

    return {
      booking: updatedBooking,
      refundPercentage,
      refundAmount: Number((booking.totalPrice * refundPercentage).toFixed(2)),
    }
  }

  /**
   * Confirm booking payment
   */
  async confirmPayment(bookingId: string, stripePaymentId: string) {
    return await prisma.booking.update({
      where: { id: bookingId },
      data: {
        status: BookingStatus.CONFIRMED,
        stripePaymentId,
      },
    })
  }

  /**
   * Send message
   */
  async sendMessage(bookingId: string, senderId: string, content: string) {
    const booking = await this.getBookingById(bookingId)

    const message = await prisma.message.create({
      data: {
        bookingId,
        senderId,
        content,
      },
    })

    // Determine recipient
    const recipientId = senderId === booking.tourist.userId
      ? booking.guide.userId
      : booking.tourist.userId

    // Send polling update
    pollingService.addMessageUpdate(recipientId, message)

    return message
  }

  /**
   * Get messages for booking
   */
  async getMessages(bookingId: string) {
    return await prisma.message.findMany({
      where: { bookingId },
      orderBy: {
        createdAt: 'asc',
      },
    })
  }

  /**
   * Mark messages as read
   */
  async markMessagesAsRead(bookingId: string, userId: string) {
    await prisma.message.updateMany({
      where: {
        bookingId,
        senderId: { not: userId },
        isRead: false,
      },
      data: {
        isRead: true,
      },
    })
  }

  /**
   * Update location
   */
  async updateLocation(bookingId: string, latitude: number, longitude: number) {
    const booking = await this.getBookingById(bookingId)

    // Store location update
    await prisma.locationUpdate.create({
      data: {
        bookingId,
        latitude,
        longitude,
      },
    })

    // Send polling update to tourist
    pollingService.addLocationUpdate(
      booking.tourist.userId,
      bookingId,
      latitude,
      longitude
    )
  }

  /**
   * Get location history
   */
  async getLocationHistory(bookingId: string) {
    return await prisma.locationUpdate.findMany({
      where: { bookingId },
      orderBy: {
        createdAt: 'desc',
      },
      take: 50, // Last 50 location updates
    })
  }
}

export const bookingService = new BookingService()
