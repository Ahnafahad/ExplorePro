import express from 'express'
import { authenticate, authorize } from '../middleware/auth.js'
import { guideController } from '../controllers/guideController.js'

const router = express.Router()

/**
 * GET /api/guides
 * List all approved guides (with filters)
 */
router.get('/', (req, res) => guideController.listGuides(req, res))

/**
 * GET /api/guides/:id
 * Get guide profile
 */
router.get('/:id', (req, res) => guideController.getGuide(req, res))

/**
 * POST /api/guides
 * Create guide profile (auth required)
 */
router.post('/', authenticate, (req, res) => guideController.createGuideProfile(req, res))

/**
 * PUT /api/guides/:id
 * Update guide profile (auth required)
 */
router.put('/:id', authenticate, (req, res) => guideController.updateGuide(req, res))

/**
 * PUT /api/guides/:id/availability
 * Toggle availability (guide only)
 */
router.put('/:id/availability', authenticate, authorize('GUIDE'), (req, res) => guideController.toggleAvailability(req, res))

/**
 * GET /api/guides/:id/tours
 * Get guide's tours
 */
router.get('/:id/tours', (req, res) => guideController.getGuideTours(req, res))

/**
 * GET /api/guides/:id/reviews
 * Get guide's reviews
 */
router.get('/:id/reviews', (req, res) => guideController.getGuideReviews(req, res))

export default router
