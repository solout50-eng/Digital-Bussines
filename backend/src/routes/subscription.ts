import { Router, Request, Response } from 'express'
import Stripe from 'stripe'
import { PrismaClient } from '@prisma/client'
import { authenticate, AuthenticatedRequest } from '../middleware/auth'

const router = Router()
const prisma = new PrismaClient()
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2024-06-20' })

const PRICE_IDS = {
  basic: process.env.STRIPE_PRICE_BASIC!,
  pro: process.env.STRIPE_PRICE_PRO!,
  enterprise: process.env.STRIPE_PRICE_ENTERPRISE!,
}

// GET /api/subscriptions/plans — public
router.get('/plans', (_req: Request, res: Response) => {
  res.json({
    plans: [
      {
        id: 'basic',
        name: 'Básico',
        price: 29,
        currency: 'USD',
        interval: 'month',
        features: [
          '100 clientes en CRM',
          '50 facturas/mes',
          '500 productos en inventario',
          '200 conversaciones IA/mes',
          'Reportes básicos',
          'Soporte por email',
        ],
      },
      {
        id: 'pro',
        name: 'Pro',
        price: 99,
        currency: 'USD',
        interval: 'month',
        popular: true,
        features: [
          'Clientes ilimitados',
          'Facturación ilimitada',
          'Inventario ilimitado',
          'IA ilimitada',
          '5 campañas de marketing/mes',
          'WhatsApp Business',
          'Analytics avanzados',
          'Soporte 24/7',
        ],
      },
      {
        id: 'enterprise',
        name: 'Empresa',
        price: 299,
        currency: 'USD',
        interval: 'month',
        features: [
          'Todo del plan Pro',
          'Múltiples sucursales',
          'API completa',
          'Marketing ilimitado',
          'Manager dedicado',
          'Onboarding personalizado',
          'SLA 99.9%',
        ],
      },
    ],
  })
})

// POST /api/subscriptions/checkout — create Stripe checkout session
router.post('/checkout', authenticate, async (req: AuthenticatedRequest, res: Response) => {
  const { plan } = req.body

  if (!['basic', 'pro', 'enterprise'].includes(plan)) {
    return res.status(400).json({ error: 'Plan inválido' })
  }

  try {
    const business = await prisma.business.findUnique({
      where: { id: req.user!.businessId },
    })

    if (!business) {
      return res.status(404).json({ error: 'Negocio no encontrado' })
    }

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [{ price: PRICE_IDS[plan as keyof typeof PRICE_IDS], quantity: 1 }],
      success_url: `${process.env.FRONTEND_URL}/dashboard?success=true&plan=${plan}`,
      cancel_url: `${process.env.FRONTEND_URL}/pricing?cancelled=true`,
      customer_email: req.user!.email,
      metadata: {
        businessId: req.user!.businessId,
        plan,
      },
      subscription_data: {
        trial_period_days: business.trialEndsAt && business.trialEndsAt > new Date() ? undefined : 0,
        metadata: { businessId: req.user!.businessId, plan },
      },
    })

    res.json({ checkoutUrl: session.url })
  } catch (error) {
    console.error('Checkout error:', error)
    res.status(500).json({ error: 'Error al crear sesión de pago' })
  }
})

// POST /api/subscriptions/webhook — Stripe webhooks
router.post('/webhook', express.raw({ type: 'application/json' }), async (req: Request, res: Response) => {
  const sig = req.headers['stripe-signature']!
  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch {
    return res.status(400).json({ error: 'Webhook signature inválido' })
  }

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.CheckoutSession
      const { businessId, plan } = session.metadata!

      await prisma.business.update({
        where: { id: businessId },
        data: {
          plan,
          stripeCustomerId: session.customer as string,
          stripeSubscriptionId: session.subscription as string,
          subscriptionStatus: 'active',
        },
      })
      break
    }

    case 'customer.subscription.deleted': {
      const subscription = event.data.object as Stripe.Subscription
      await prisma.business.updateMany({
        where: { stripeSubscriptionId: subscription.id },
        data: { plan: 'basic', subscriptionStatus: 'cancelled' },
      })
      break
    }

    case 'invoice.payment_failed': {
      const invoice = event.data.object as Stripe.Invoice
      await prisma.business.updateMany({
        where: { stripeSubscriptionId: invoice.subscription as string },
        data: { subscriptionStatus: 'past_due' },
      })
      break
    }
  }

  res.json({ received: true })
})

// Need to import express for raw body parsing in webhook
import express from 'express'

export default router
