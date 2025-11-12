import express from 'express'
import { authenticate, authorize } from '../middleware/auth.js'
import { reviewController } from '../controllers/reviewController.js'

const router = express.Router()

/**
 * POST /api/reviews
 * Create review (tourist only, after tour)
 */
router.post('/', authenticate, authorize('TOURIST'), (req, res) => reviewController.createReview(req, res))

/**
 * GET /api/reviews/guide/:guideId
 * Get reviews for guide
 */
router.get('/guide/:guideId', (req, res) => reviewController.getGuideReviews(req, res))

/**
 * GET /api/reviews/booking/:bookingId
 * Get review for a booking
 */
router.get('/booking/:bookingId', authenticate, (req, res) => reviewController.getBookingReview(req, res))

export default router
