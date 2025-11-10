import express, { Request, Response } from 'express'
import { authenticate } from '../middleware/auth.js'
import { pollingService } from '../polling/pollingService.js'

const router = express.Router()

/**
 * GET /api/polling/updates
 * Poll for new updates
 * Query params: since (ISO timestamp)
 */
router.get('/updates', authenticate, (req: Request, res: Response) => {
  try {
    const userId = req.user!.userId
    const since = req.query.since as string | undefined

    const updates = pollingService.getUpdates(userId, since)

    res.json({
      success: true,
      data: {
        updates,
        timestamp: new Date().toISOString(),
      },
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
})

/**
 * DELETE /api/polling/updates
 * Clear all pending updates
 */
router.delete('/updates', authenticate, (req: Request, res: Response) => {
  try {
    const userId = req.user!.userId
    pollingService.clearUpdates(userId)

    res.json({
      success: true,
      message: 'Updates cleared',
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
})

export default router
