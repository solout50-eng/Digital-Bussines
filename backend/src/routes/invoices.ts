import { Router, Response } from 'express'
import { PrismaClient } from '@prisma/client'
import { authenticate, AuthenticatedRequest } from '../middleware/auth'

const router = Router()
const prisma = new PrismaClient()

interface InvoiceItem {
  description: string
  quantity: number
  unitPrice: number
  total?: number
}

// Helper: generate invoice number F-YYYY-NNN
async function generateInvoiceNumber(businessId: string): Promise<string> {
  const year = new Date().getFullYear()
  const prefix = `F-${year}-`

  const lastInvoice = await prisma.invoice.findFirst({
    where: {
      businessId,
      number: { startsWith: prefix },
    },
    orderBy: { number: 'desc' },
  })

  let nextNum = 1
  if (lastInvoice) {
    const parts = lastInvoice.number.split('-')
    const lastNum = parseInt(parts[parts.length - 1]) || 0
    nextNum = lastNum + 1
  }

  return `${prefix}${String(nextNum).padStart(3, '0')}`
}

// Helper: calculate totals from items
function calculateTotals(items: InvoiceItem[], taxRate: number = 0) {
  const processedItems = items.map((item) => ({
    description: item.description,
    quantity: Number(item.quantity),
    unitPrice: Number(item.unitPrice),
    total: Number(item.quantity) * Number(item.unitPrice),
  }))

  const subtotal = processedItems.reduce((sum, item) => sum + item.total, 0)
  const tax = subtotal * (taxRate / 100)
  const total = subtotal + tax

  return { processedItems, subtotal, tax, total }
}

// GET /api/invoices/stats — must be before /:id route
router.get('/stats', authenticate, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const businessId = req.user!.businessId

    const [invoices, countByStatus] = await Promise.all([
      prisma.invoice.findMany({
        where: { businessId },
        select: { status: true, total: true },
      }),
      prisma.invoice.groupBy({
        by: ['status'],
        where: { businessId },
        _count: { id: true },
        _sum: { total: true },
      }),
    ])

    const totalPaid = invoices
      .filter((i) => i.status === 'paid')
      .reduce((sum, i) => sum + i.total, 0)

    const totalPending = invoices
      .filter((i) => i.status === 'sent')
      .reduce((sum, i) => sum + i.total, 0)

    const totalOverdue = invoices
      .filter((i) => i.status === 'overdue')
      .reduce((sum, i) => sum + i.total, 0)

    const statusSummary = countByStatus.reduce((acc: Record<string, any>, group) => {
      acc[group.status] = {
        count: group._count.id,
        total: group._sum.total || 0,
      }
      return acc
    }, {})

    res.json({
      totalPaid,
      totalPending,
      totalOverdue,
      countByStatus: statusSummary,
    })
  } catch (error) {
    console.error('Error al obtener estadísticas de facturas:', error)
    res.status(500).json({ error: 'Error al obtener estadísticas de facturas' })
  }
})

// GET /api/invoices — list with filters
router.get('/', authenticate, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const businessId = req.user!.businessId
    const page = parseInt(req.query.page as string) || 1
    const limit = parseInt(req.query.limit as string) || 20
    const status = req.query.status as string
    const clientId = req.query.clientId as string
    const dateFrom = req.query.dateFrom as string
    const dateTo = req.query.dateTo as string

    const skip = (page - 1) * limit

    const where: any = {
      businessId,
      ...(status && { status }),
      ...(clientId && { clientId }),
      ...(dateFrom || dateTo
        ? {
            createdAt: {
              ...(dateFrom && { gte: new Date(dateFrom) }),
              ...(dateTo && { lte: new Date(dateTo) }),
            },
          }
        : {}),
    }

    const [invoices, total] = await Promise.all([
      prisma.invoice.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          client: {
            select: { id: true, name: true, email: true },
          },
        },
      }),
      prisma.invoice.count({ where }),
    ])

    res.json({
      invoices,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    })
  } catch (error) {
    console.error('Error al listar facturas:', error)
    res.status(500).json({ error: 'Error al obtener la lista de facturas' })
  }
})

// GET /api/invoices/:id — single invoice with client details
router.get('/:id', authenticate, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params
    const businessId = req.user!.businessId

    const invoice = await prisma.invoice.findFirst({
      where: { id, businessId },
      include: {
        client: true,
      },
    })

    if (!invoice) {
      return res.status(404).json({ error: 'Factura no encontrada' })
    }

    res.json(invoice)
  } catch (error) {
    console.error('Error al obtener factura:', error)
    res.status(500).json({ error: 'Error al obtener la factura' })
  }
})

// POST /api/invoices — create invoice
router.post('/', authenticate, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const businessId = req.user!.businessId
    const { clientId, items, taxRate, currency, notes, dueDate } = req.body

    if (!clientId) {
      return res.status(400).json({ error: 'El cliente es requerido' })
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Se requiere al menos un ítem en la factura' })
    }

    // Validate items
    for (const item of items) {
      if (!item.description || item.quantity === undefined || item.unitPrice === undefined) {
        return res.status(400).json({
          error: 'Cada ítem debe tener descripción, cantidad y precio unitario',
        })
      }
      if (Number(item.quantity) <= 0 || Number(item.unitPrice) < 0) {
        return res.status(400).json({
          error: 'La cantidad debe ser mayor a 0 y el precio no puede ser negativo',
        })
      }
    }

    // Verify client belongs to business
    const client = await prisma.client.findFirst({ where: { id: clientId, businessId } })
    if (!client) {
      return res.status(404).json({ error: 'Cliente no encontrado' })
    }

    const number = await generateInvoiceNumber(businessId)
    const { processedItems, subtotal, tax, total } = calculateTotals(items, taxRate || 0)

    const invoice = await prisma.invoice.create({
      data: {
        number,
        status: 'draft',
        subtotal,
        tax,
        total,
        currency: currency || 'MXN',
        notes: notes || null,
        dueDate: dueDate ? new Date(dueDate) : null,
        items: processedItems,
        businessId,
        clientId,
      },
      include: { client: { select: { id: true, name: true, email: true } } },
    })

    res.status(201).json(invoice)
  } catch (error) {
    console.error('Error al crear factura:', error)
    res.status(500).json({ error: 'Error al crear la factura' })
  }
})

// PUT /api/invoices/:id — update invoice (only if draft)
router.put('/:id', authenticate, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params
    const businessId = req.user!.businessId
    const { clientId, items, taxRate, currency, notes, dueDate } = req.body

    const existing = await prisma.invoice.findFirst({ where: { id, businessId } })
    if (!existing) {
      return res.status(404).json({ error: 'Factura no encontrada' })
    }

    if (existing.status !== 'draft') {
      return res.status(400).json({
        error: 'Solo se pueden editar facturas en estado borrador',
      })
    }

    // If clientId is being changed, verify it belongs to the business
    if (clientId && clientId !== existing.clientId) {
      const client = await prisma.client.findFirst({ where: { id: clientId, businessId } })
      if (!client) {
        return res.status(404).json({ error: 'Cliente no encontrado' })
      }
    }

    let updateData: any = {
      ...(clientId && { clientId }),
      ...(currency && { currency }),
      ...(notes !== undefined && { notes: notes || null }),
      ...(dueDate !== undefined && { dueDate: dueDate ? new Date(dueDate) : null }),
    }

    if (items && Array.isArray(items) && items.length > 0) {
      const { processedItems, subtotal, tax, total } = calculateTotals(items, taxRate || 0)
      updateData = { ...updateData, items: processedItems, subtotal, tax, total }
    }

    const invoice = await prisma.invoice.update({
      where: { id },
      data: updateData,
      include: { client: { select: { id: true, name: true, email: true } } },
    })

    res.json(invoice)
  } catch (error) {
    console.error('Error al actualizar factura:', error)
    res.status(500).json({ error: 'Error al actualizar la factura' })
  }
})

// PATCH /api/invoices/:id/status — update invoice status
router.patch('/:id/status', authenticate, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params
    const businessId = req.user!.businessId
    const { status } = req.body

    const validStatuses = ['draft', 'sent', 'paid', 'overdue', 'cancelled']
    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({
        error: `Estado inválido. Los estados válidos son: ${validStatuses.join(', ')}`,
      })
    }

    const existing = await prisma.invoice.findFirst({ where: { id, businessId } })
    if (!existing) {
      return res.status(404).json({ error: 'Factura no encontrada' })
    }

    const updateData: any = { status }

    // If marking as paid, set paidAt and update client totalSpent
    if (status === 'paid' && existing.status !== 'paid') {
      updateData.paidAt = new Date()

      // Update client totalSpent
      await prisma.client.update({
        where: { id: existing.clientId },
        data: { totalSpent: { increment: existing.total } },
      })
    }

    // If reversing from paid, subtract from totalSpent
    if (existing.status === 'paid' && status !== 'paid') {
      updateData.paidAt = null
      await prisma.client.update({
        where: { id: existing.clientId },
        data: { totalSpent: { decrement: existing.total } },
      })
    }

    const invoice = await prisma.invoice.update({
      where: { id },
      data: updateData,
      include: { client: { select: { id: true, name: true, email: true } } },
    })

    res.json(invoice)
  } catch (error) {
    console.error('Error al actualizar estado de factura:', error)
    res.status(500).json({ error: 'Error al actualizar el estado de la factura' })
  }
})

// DELETE /api/invoices/:id — delete draft invoices only
router.delete('/:id', authenticate, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params
    const businessId = req.user!.businessId

    const existing = await prisma.invoice.findFirst({ where: { id, businessId } })
    if (!existing) {
      return res.status(404).json({ error: 'Factura no encontrada' })
    }

    if (existing.status !== 'draft') {
      return res.status(400).json({
        error: 'Solo se pueden eliminar facturas en estado borrador',
      })
    }

    await prisma.invoice.delete({ where: { id } })
    res.json({ message: 'Factura eliminada correctamente' })
  } catch (error) {
    console.error('Error al eliminar factura:', error)
    res.status(500).json({ error: 'Error al eliminar la factura' })
  }
})

export default router
