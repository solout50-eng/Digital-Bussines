import { Router, Response } from 'express'
import { PrismaClient } from '@prisma/client'
import { authenticate, AuthenticatedRequest } from '../middleware/auth'

const router = Router()
const prisma = new PrismaClient()

// Helper: get date range based on period string
function getPeriodRange(period: string): { start: Date; end: Date; days: number } {
  const end = new Date()
  end.setHours(23, 59, 59, 999)

  const daysMap: Record<string, number> = {
    '7d': 7,
    '30d': 30,
    '90d': 90,
    '12m': 365,
  }

  const days = daysMap[period] || 30
  const start = new Date()
  start.setDate(start.getDate() - days)
  start.setHours(0, 0, 0, 0)

  return { start, end, days }
}

// Helper: generate date array for a range
function generateDateArray(start: Date, end: Date): string[] {
  const dates: string[] = []
  const current = new Date(start)
  while (current <= end) {
    dates.push(current.toISOString().split('T')[0])
    current.setDate(current.getDate() + 1)
  }
  return dates
}

// GET /api/analytics/overview
router.get('/overview', authenticate, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const businessId = req.user!.businessId

    const now = new Date()
    const startOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999)

    const startOf30DaysAgo = new Date()
    startOf30DaysAgo.setDate(startOf30DaysAgo.getDate() - 30)
    startOf30DaysAgo.setHours(0, 0, 0, 0)

    const [
      thisMonthInvoices,
      lastMonthInvoices,
      newClientsThisMonth,
      newClientsLastMonth,
      recentPaidInvoices,
    ] = await Promise.all([
      prisma.invoice.findMany({
        where: {
          businessId,
          status: 'paid',
          paidAt: { gte: startOfThisMonth },
        },
        select: { total: true },
      }),
      prisma.invoice.findMany({
        where: {
          businessId,
          status: 'paid',
          paidAt: { gte: startOfLastMonth, lte: endOfLastMonth },
        },
        select: { total: true },
      }),
      prisma.client.count({
        where: { businessId, createdAt: { gte: startOfThisMonth } },
      }),
      prisma.client.count({
        where: {
          businessId,
          createdAt: { gte: startOfLastMonth, lte: endOfLastMonth },
        },
      }),
      prisma.invoice.findMany({
        where: {
          businessId,
          status: 'paid',
          paidAt: { gte: startOf30DaysAgo },
        },
        select: { items: true },
      }),
    ])

    const revenueThisMonth = thisMonthInvoices.reduce((sum, i) => sum + i.total, 0)
    const revenueLastMonth = lastMonthInvoices.reduce((sum, i) => sum + i.total, 0)
    const revenueGrowth =
      revenueLastMonth > 0
        ? ((revenueThisMonth - revenueLastMonth) / revenueLastMonth) * 100
        : revenueThisMonth > 0
        ? 100
        : 0

    // Top products from paid invoice items (last 30 days)
    const productSales: Record<string, { name: string; revenue: number; quantity: number }> = {}
    for (const invoice of recentPaidInvoices) {
      const items = invoice.items as Array<{
        description: string
        quantity: number
        unitPrice: number
        total: number
      }>
      if (Array.isArray(items)) {
        for (const item of items) {
          const key = item.description
          if (!productSales[key]) {
            productSales[key] = { name: item.description, revenue: 0, quantity: 0 }
          }
          productSales[key].revenue += item.total || item.quantity * item.unitPrice
          productSales[key].quantity += item.quantity
        }
      }
    }

    const topProducts = Object.values(productSales)
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5)

    // Conversion rate: clients with at least 1 paid invoice vs total clients
    const [totalClients, clientsWithPaidInvoices] = await Promise.all([
      prisma.client.count({ where: { businessId } }),
      prisma.client.count({
        where: {
          businessId,
          totalSpent: { gt: 0 },
        },
      }),
    ])

    const conversionRate =
      totalClients > 0 ? (clientsWithPaidInvoices / totalClients) * 100 : 0

    res.json({
      revenue: {
        thisMonth: revenueThisMonth,
        lastMonth: revenueLastMonth,
        growth: Math.round(revenueGrowth * 100) / 100,
      },
      newClients: {
        thisMonth: newClientsThisMonth,
        lastMonth: newClientsLastMonth,
        total: totalClients,
      },
      topProducts,
      conversionRate: Math.round(conversionRate * 100) / 100,
    })
  } catch (error) {
    console.error('Error al obtener resumen de analíticas:', error)
    res.status(500).json({ error: 'Error al obtener el resumen de analíticas' })
  }
})

// GET /api/analytics/revenue?period=7d|30d|90d
router.get('/revenue', authenticate, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const businessId = req.user!.businessId
    const period = (req.query.period as string) || '30d'

    const { start, end } = getPeriodRange(period)

    const invoices = await prisma.invoice.findMany({
      where: {
        businessId,
        status: 'paid',
        paidAt: { gte: start, lte: end },
      },
      select: { paidAt: true, total: true },
      orderBy: { paidAt: 'asc' },
    })

    // Build daily revenue map
    const revenueByDate: Record<string, number> = {}
    for (const invoice of invoices) {
      if (invoice.paidAt) {
        const dateStr = invoice.paidAt.toISOString().split('T')[0]
        revenueByDate[dateStr] = (revenueByDate[dateStr] || 0) + invoice.total
      }
    }

    // Fill in all dates with 0 for missing days
    const allDates = generateDateArray(start, end)
    const dataPoints = allDates.map((date) => ({
      date,
      revenue: revenueByDate[date] || 0,
    }))

    res.json(dataPoints)
  } catch (error) {
    console.error('Error al obtener datos de ingresos:', error)
    res.status(500).json({ error: 'Error al obtener datos de ingresos' })
  }
})

// GET /api/analytics/clients — client acquisition over time
router.get('/clients', authenticate, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const businessId = req.user!.businessId
    const period = (req.query.period as string) || '30d'

    const { start, end } = getPeriodRange(period)

    const clients = await prisma.client.findMany({
      where: {
        businessId,
        createdAt: { gte: start, lte: end },
      },
      select: { createdAt: true },
      orderBy: { createdAt: 'asc' },
    })

    // Build daily client acquisition map
    const clientsByDate: Record<string, number> = {}
    for (const client of clients) {
      const dateStr = client.createdAt.toISOString().split('T')[0]
      clientsByDate[dateStr] = (clientsByDate[dateStr] || 0) + 1
    }

    // Fill in all dates
    const allDates = generateDateArray(start, end)
    const dataPoints = allDates.map((date) => ({
      date,
      newClients: clientsByDate[date] || 0,
    }))

    // Also include cumulative total
    let cumulative = await prisma.client.count({
      where: { businessId, createdAt: { lt: start } },
    })

    const dataPointsWithCumulative = dataPoints.map((point) => {
      cumulative += point.newClients
      return { ...point, totalClients: cumulative }
    })

    res.json(dataPointsWithCumulative)
  } catch (error) {
    console.error('Error al obtener datos de clientes:', error)
    res.status(500).json({ error: 'Error al obtener datos de adquisición de clientes' })
  }
})

// GET /api/analytics/products/top — top 10 products by revenue
router.get('/products/top', authenticate, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const businessId = req.user!.businessId
    const period = (req.query.period as string) || '30d'

    const { start, end } = getPeriodRange(period)

    const paidInvoices = await prisma.invoice.findMany({
      where: {
        businessId,
        status: 'paid',
        paidAt: { gte: start, lte: end },
      },
      select: { items: true },
    })

    // Aggregate product sales from invoice items
    const productSales: Record<
      string,
      { name: string; revenue: number; quantity: number; orderCount: number }
    > = {}

    for (const invoice of paidInvoices) {
      const items = invoice.items as Array<{
        description: string
        quantity: number
        unitPrice: number
        total: number
      }>

      if (Array.isArray(items)) {
        for (const item of items) {
          const key = item.description
          if (!productSales[key]) {
            productSales[key] = { name: item.description, revenue: 0, quantity: 0, orderCount: 0 }
          }
          productSales[key].revenue += item.total || item.quantity * item.unitPrice
          productSales[key].quantity += item.quantity
          productSales[key].orderCount += 1
        }
      }
    }

    const topProducts = Object.values(productSales)
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 10)
      .map((product, index) => ({ rank: index + 1, ...product }))

    res.json(topProducts)
  } catch (error) {
    console.error('Error al obtener top productos:', error)
    res.status(500).json({ error: 'Error al obtener los productos más vendidos' })
  }
})

export default router
