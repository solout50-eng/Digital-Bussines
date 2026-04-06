import { Router, Request, Response } from 'express'
import Stripe from 'stripe'
import { PrismaClient } from '@prisma/client'
import express from 'express'

const router = Router()
const prisma = new PrismaClient()
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2024-06-20' })

// Stripe requires raw body for webhook signature verification
router.post(
  '/stripe',
  express.raw({ type: 'application/json' }),
  async (req: Request, res: Response) => {
    const sig = req.headers['stripe-signature']
    if (!sig) return res.status(400).json({ error: 'Missing stripe-signature header' })

    let event: Stripe.Event
    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET!
      )
    } catch (err: any) {
      console.error('Webhook signature verification failed:', err.message)
      return res.status(400).json({ error: `Webhook Error: ${err.message}` })
    }

    try {
      switch (event.type) {
        case 'customer.subscription.created':
        case 'customer.subscription.updated': {
          const subscription = event.data.object as Stripe.Subscription
          const customerId = subscription.customer as string
          const priceId = subscription.items.data[0]?.price.id

          // Map price ID to plan name
          const planMap: Record<string, string> = {
            [process.env.STRIPE_PRICE_BASIC!]: 'basic',
            [process.env.STRIPE_PRICE_PRO!]: 'pro',
            [process.env.STRIPE_PRICE_ENTERPRISE!]: 'enterprise',
          }
          const plan = planMap[priceId] || 'basic'

          await prisma.business.updateMany({
            where: { stripeCustomerId: customerId },
            data: {
              plan,
              stripeSubscriptionId: subscription.id,
              subscriptionStatus: subscription.status === 'active' ? 'active' : 'past_due',
            },
          })
          console.log(`✅ Subscription updated: ${customerId} → ${plan}`)
          break
        }

        case 'customer.subscription.deleted': {
          const subscription = event.data.object as Stripe.Subscription
          await prisma.business.updateMany({
            where: { stripeSubscriptionId: subscription.id },
            data: {
              subscriptionStatus: 'cancelled',
              plan: 'basic',
            },
          })
          console.log(`❌ Subscription cancelled: ${subscription.id}`)
          break
        }

        case 'invoice.payment_succeeded': {
          const invoice = event.data.object as Stripe.Invoice
          const customerId = invoice.customer as string
          await prisma.business.updateMany({
            where: { stripeCustomerId: customerId },
            data: { subscriptionStatus: 'active' },
          })
          break
        }

        case 'invoice.payment_failed': {
          const invoice = event.data.object as Stripe.Invoice
          const customerId = invoice.customer as string
          await prisma.business.updateMany({
            where: { stripeCustomerId: customerId },
            data: { subscriptionStatus: 'past_due' },
          })
          console.log(`⚠️ Payment failed for customer: ${customerId}`)
          break
        }

        default:
          console.log(`Unhandled event type: ${event.type}`)
      }

      res.json({ received: true })
    } catch (error) {
      console.error('Webhook handler error:', error)
      res.status(500).json({ error: 'Error processing webhook' })
    }
  }
)

export default router
