import express, { Request, Response } from 'express'
import { authenticate, authorize } from '../middleware/auth.js'

const router = express.Router()

/**
 * GET /api/guides
 * List all approved guides (with filters)
 */
router.get('/', async (req: Request, res: Response) => {
  res.json({
    success: true,
    message: 'List guides endpoint - to be implemented',
    data: [],
  })
})

/**
 * GET /api/guides/:id
 * Get guide profile
 */
router.get('/:id', async (req: Request, res: Response) => {
  res.json({
    success: true,
    message: 'Get guide endpoint - to be implemented',
  })
})

/**
 * POST /api/guides
 * Create guide profile (auth required)
 */
router.post('/', authenticate, async (req: Request, res: Response) => {
  res.json({
    success: true,
    message: 'Create guide endpoint - to be implemented',
  })
})

/**
 * PUT /api/guides/:id
 * Update guide profile (auth required)
 */
router.put('/:id', authenticate, async (req: Request, res: Response) => {
  res.json({
    success: true,
    message: 'Update guide endpoint - to be implemented',
  })
})

/**
 * PUT /api/guides/:id/availability
 * Toggle availability (guide only)
 */
router.put('/:id/availability', authenticate, authorize('GUIDE'), async (req: Request, res: Response) => {
  res.json({
    success: true,
    message: 'Toggle availability endpoint - to be implemented',
  })
})

/**
 * GET /api/guides/:id/tours
 * Get guide's tours
 */
router.get('/:id/tours', async (req: Request, res: Response) => {
  res.json({
    success: true,
    message: 'Get guide tours endpoint - to be implemented',
    data: [],
  })
})

/**
 * GET /api/guides/:id/reviews
 * Get guide's reviews
 */
router.get('/:id/reviews', async (req: Request, res: Response) => {
  res.json({
    success: true,
    message: 'Get guide reviews endpoint - to be implemented',
    data: [],
  })
})

export default router
