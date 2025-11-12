import express, { Request, Response } from 'express'
import { stripeService } from '../services/stripeService.js'

const router = express.Router()

/**
 * POST /api/webhooks/stripe
 * Stripe webhook handler
 * Note: This endpoint uses raw body for signature verification
 */
router.post(
  '/stripe',
  express.raw({ type: 'application/json' }),
  async (req: Request, res: Response) => {
    try {
      const signature = req.headers['stripe-signature'] as string

      if (!signature) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'MISSING_SIGNATURE',
            message: 'Stripe signature missing',
          },
        })
      }

      await stripeService.handleWebhook(req.body, signature)

      res.json({ received: true })
    } catch (error: any) {
      console.error('Webhook error:', error)

      res.status(400).json({
        success: false,
        error: {
          code: 'WEBHOOK_ERROR',
          message: error.message,
        },
      })
    }
  }
)

export default router
