import { Router, Response } from 'express'
import { PrismaClient } from '@prisma/client'
import { authenticate, AuthenticatedRequest } from '../middleware/auth'

const router = Router()
const prisma = new PrismaClient()

// GET /api/business/dashboard — dashboard metrics
router.get('/dashboard', authenticate, async (req: AuthenticatedRequest, res: Response) => {
  const { businessId } = req.user!

  try {
    const [clientCount, invoiceCount, inventoryValue, aiConversations] = await Promise.all([
      prisma.client.count({ where: { businessId } }),
      prisma.invoice.count({ where: { businessId, createdAt: { gte: startOfMonth() } } }),
      prisma.product.aggregate({
        where: { businessId },
        _sum: { stockValue: true },
      }),
      prisma.aiConversation.count({ where: { businessId, createdAt: { gte: startOfMonth() } } }),
    ])

    const revenueThisMonth = await prisma.invoice.aggregate({
      where: {
        businessId,
        status: 'paid',
        createdAt: { gte: startOfMonth() },
      },
      _sum: { total: true },
    })

    const revenuePrevMonth = await prisma.invoice.aggregate({
      where: {
        businessId,
        status: 'paid',
        createdAt: {
          gte: startOfMonth(-1),
          lt: startOfMonth(),
        },
      },
      _sum: { total: true },
    })

    const currentRevenue = revenueThisMonth._sum.total || 0
    const prevRevenue = revenuePrevMonth._sum.total || 1
    const revenueGrowth = ((currentRevenue - prevRevenue) / prevRevenue * 100).toFixed(1)

    res.json({
      metrics: {
        revenue: { value: currentRevenue, growth: `${revenueGrowth}%`, positive: currentRevenue >= prevRevenue },
        clients: { value: clientCount },
        invoices: { value: invoiceCount },
        aiConversations: { value: aiConversations },
        inventoryValue: inventoryValue._sum.stockValue || 0,
      },
    })
  } catch (error) {
    console.error('Dashboard error:', error)
    res.status(500).json({ error: 'Error al cargar el dashboard' })
  }
})

// GET /api/business/profile
router.get('/profile', authenticate, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const business = await prisma.business.findUnique({
      where: { id: req.user!.businessId },
      select: {
        id: true,
        name: true,
        country: true,
        plan: true,
        subscriptionStatus: true,
        trialEndsAt: true,
        createdAt: true,
      },
    })

    res.json({ business })
  } catch (error) {
    res.status(500).json({ error: 'Error al cargar el perfil' })
  }
})

// PUT /api/business/profile
router.put('/profile', authenticate, async (req: AuthenticatedRequest, res: Response) => {
  const { name, country, chatbotPrompt } = req.body

  try {
    const business = await prisma.business.update({
      where: { id: req.user!.businessId },
      data: {
        ...(name && { name }),
        ...(country && { country }),
        ...(chatbotPrompt !== undefined && { chatbotPrompt }),
      },
    })

    res.json({ business, message: 'Perfil actualizado exitosamente' })
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar el perfil' })
  }
})

function startOfMonth(offset = 0): Date {
  const date = new Date()
  date.setMonth(date.getMonth() + offset)
  date.setDate(1)
  date.setHours(0, 0, 0, 0)
  return date
}

export default router
