import express from 'express'
import { authenticate, authorize } from '../middleware/auth.js'
import { bookingController } from '../controllers/bookingController.js'

const router = express.Router()

/**
 * GET /api/bookings
 * Get user's bookings (auth required)
 */
router.get('/', authenticate, (req, res) => bookingController.getBookings(req, res))

/**
 * GET /api/bookings/:id
 * Get booking details (auth required)
 */
router.get('/:id', authenticate, (req, res) => bookingController.getBooking(req, res))

/**
 * POST /api/bookings
 * Create new booking (tourist only)
 */
router.post('/', authenticate, authorize('TOURIST'), (req, res) => bookingController.createBooking(req, res))

/**
 * PUT /api/bookings/:id/start
 * Start tour (guide only)
 */
router.put('/:id/start', authenticate, authorize('GUIDE'), (req, res) => bookingController.startTour(req, res))

/**
 * PUT /api/bookings/:id/complete
 * Complete tour (guide only)
 */
router.put('/:id/complete', authenticate, authorize('GUIDE'), (req, res) => bookingController.completeTour(req, res))

/**
 * DELETE /api/bookings/:id
 * Cancel booking
 */
router.delete('/:id', authenticate, (req, res) => bookingController.cancelBooking(req, res))

/**
 * GET /api/bookings/:id/messages
 * Get booking messages
 */
router.get('/:id/messages', authenticate, (req, res) => bookingController.getMessages(req, res))

/**
 * POST /api/bookings/:id/messages
 * Send message
 */
router.post('/:id/messages', authenticate, (req, res) => bookingController.sendMessage(req, res))

/**
 * POST /api/bookings/:id/location
 * Update location (guide only)
 */
router.post('/:id/location', authenticate, authorize('GUIDE'), (req, res) => bookingController.updateLocation(req, res))

/**
 * GET /api/bookings/:id/location
 * Get location history
 */
router.get('/:id/location', authenticate, (req, res) => bookingController.getLocationHistory(req, res))

export default router
