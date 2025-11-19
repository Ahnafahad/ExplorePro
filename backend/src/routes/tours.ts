import express from 'express'
import { authenticate, authorize } from '../middleware/auth.js'
import { tourController } from '../controllers/tourController.js'

const router = express.Router()

/**
 * GET /api/tours
 * Get all tours
 */
router.get('/', (req, res) => tourController.getAllTours(req, res))

/**
 * GET /api/tours/:id
 * Get tour details
 */
router.get('/:id', (req, res) => tourController.getTour(req, res))

/**
 * POST /api/tours
 * Create tour (guide only)
 */
router.post('/', authenticate, authorize('GUIDE'), (req, res) => tourController.createTour(req, res))

/**
 * PUT /api/tours/:id
 * Update tour (guide only)
 */
router.put('/:id', authenticate, authorize('GUIDE'), (req, res) => tourController.updateTour(req, res))

/**
 * DELETE /api/tours/:id
 * Delete tour (guide only)
 */
router.delete('/:id', authenticate, authorize('GUIDE'), (req, res) => tourController.deleteTour(req, res))

export default router
