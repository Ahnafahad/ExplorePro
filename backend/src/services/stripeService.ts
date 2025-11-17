import Stripe from 'stripe'
import { bookingService } from './bookingService.js'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2023-10-16',
})

export class StripeService {
  /**
   * Create payment intent
   */
  async createPaymentIntent(bookingId: string, amount: number, currency: string = 'gbp') {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to pence
      currency,
      metadata: {
        bookingId,
      },
      automatic_payment_methods: {
        enabled: true,
      },
    })

    return {
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    }
  }

  /**
   * Confirm payment
   */
  async confirmPayment(paymentIntentId: string) {
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId)
    return paymentIntent
  }

  /**
   * Process refund
   */
  async processRefund(paymentIntentId: string, amount?: number) {
    const refundData: any = {
      payment_intent: paymentIntentId,
    }

    if (amount) {
      refundData.amount = Math.round(amount * 100) // Convert to pence
    }

    const refund = await stripe.refunds.create(refundData)
    return refund
  }

  /**
   * Handle Stripe webhook
   */
  async handleWebhook(payload: Buffer, signature: string) {
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

    if (!webhookSecret) {
      throw new Error('STRIPE_WEBHOOK_SECRET not configured')
    }

    let event: Stripe.Event

    try {
      event = stripe.webhooks.constructEvent(payload, signature, webhookSecret)
    } catch (err: any) {
      throw new Error(`Webhook signature verification failed: ${err.message}`)
    }

    // Handle the event
    switch (event.type) {
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object as Stripe.PaymentIntent
        await this.handlePaymentSuccess(paymentIntent)
        break

      case 'payment_intent.payment_failed':
        const failedPayment = event.data.object as Stripe.PaymentIntent
        await this.handlePaymentFailure(failedPayment)
        break

      case 'charge.refunded':
        const refund = event.data.object as Stripe.Charge
        await this.handleRefund(refund)
        break

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return { received: true }
  }

  /**
   * Handle payment success
   */
  private async handlePaymentSuccess(paymentIntent: Stripe.PaymentIntent) {
    const bookingId = paymentIntent.metadata.bookingId

    if (bookingId) {
      await bookingService.confirmPayment(bookingId, paymentIntent.id)
      console.log(`Payment confirmed for booking ${bookingId}`)
    }
  }

  /**
   * Handle payment failure
   */
  private async handlePaymentFailure(paymentIntent: Stripe.PaymentIntent) {
    const bookingId = paymentIntent.metadata.bookingId

    if (bookingId) {
      // Update booking status to cancelled or pending retry
      console.log(`Payment failed for booking ${bookingId}`)
      // TODO: Implement retry logic or cancellation
    }
  }

  /**
   * Handle refund
   */
  private async handleRefund(charge: Stripe.Charge) {
    console.log(`Refund processed for charge ${charge.id}`)
    // TODO: Update booking status to refunded
  }

  /**
   * Create customer
   */
  async createCustomer(email: string, name: string) {
    return await stripe.customers.create({
      email,
      name,
    })
  }

  /**
   * Create connected account for guide (for future payouts)
   */
  async createConnectedAccount(email: string) {
    return await stripe.accounts.create({
      type: 'express',
      email,
      capabilities: {
        card_payments: { requested: true },
        transfers: { requested: true },
      },
    })
  }
}

export const stripeService = new StripeService()
