import { Router, Response } from 'express'
import { PrismaClient } from '@prisma/client'
import { authenticate, AuthenticatedRequest } from '../middleware/auth'

const router = Router()
const prisma = new PrismaClient()

// GET /api/clients — list with pagination, search, tag filter
router.get('/', authenticate, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const businessId = req.user!.businessId
    const page = parseInt(req.query.page as string) || 1
    const limit = parseInt(req.query.limit as string) || 20
    const search = (req.query.search as string) || ''
    const tags = req.query.tags ? (req.query.tags as string).split(',') : []

    const skip = (page - 1) * limit

    const where: any = {
      businessId,
      ...(search && {
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { email: { contains: search, mode: 'insensitive' } },
        ],
      }),
      ...(tags.length > 0 && {
        tags: { hasSome: tags },
      }),
    }

    const [clients, total] = await Promise.all([
      prisma.client.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          address: true,
          taxId: true,
          tags: true,
          totalSpent: true,
          createdAt: true,
          updatedAt: true,
          _count: { select: { invoices: true } },
        },
      }),
      prisma.client.count({ where }),
    ])

    res.json({
      clients,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    })
  } catch (error) {
    console.error('Error al listar clientes:', error)
    res.status(500).json({ error: 'Error al obtener la lista de clientes' })
  }
})

// GET /api/clients/:id — single client with invoices
router.get('/:id', authenticate, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params
    const businessId = req.user!.businessId

    const client = await prisma.client.findFirst({
      where: { id, businessId },
      include: {
        invoices: {
          orderBy: { createdAt: 'desc' },
          take: 10,
          select: {
            id: true,
            number: true,
            status: true,
            total: true,
            currency: true,
            dueDate: true,
            paidAt: true,
            createdAt: true,
          },
        },
      },
    })

    if (!client) {
      return res.status(404).json({ error: 'Cliente no encontrado' })
    }

    res.json(client)
  } catch (error) {
    console.error('Error al obtener cliente:', error)
    res.status(500).json({ error: 'Error al obtener el cliente' })
  }
})

// POST /api/clients — create client
router.post('/', authenticate, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const businessId = req.user!.businessId
    const { name, email, phone, address, taxId, notes, tags } = req.body

    if (!name || name.trim() === '') {
      return res.status(400).json({ error: 'El nombre del cliente es requerido' })
    }

    // Check for duplicate email within same business
    if (email) {
      const existing = await prisma.client.findFirst({
        where: { businessId, email },
      })
      if (existing) {
        return res.status(409).json({ error: 'Ya existe un cliente con ese correo electrónico' })
      }
    }

    const client = await prisma.client.create({
      data: {
        name: name.trim(),
        email: email || null,
        phone: phone || null,
        address: address || null,
        taxId: taxId || null,
        notes: notes || null,
        tags: tags || [],
        businessId,
      },
    })

    res.status(201).json(client)
  } catch (error) {
    console.error('Error al crear cliente:', error)
    res.status(500).json({ error: 'Error al crear el cliente' })
  }
})

// PUT /api/clients/:id — update client
router.put('/:id', authenticate, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params
    const businessId = req.user!.businessId
    const { name, email, phone, address, taxId, notes, tags } = req.body

    const existing = await prisma.client.findFirst({ where: { id, businessId } })
    if (!existing) {
      return res.status(404).json({ error: 'Cliente no encontrado' })
    }

    if (name !== undefined && (!name || name.trim() === '')) {
      return res.status(400).json({ error: 'El nombre del cliente no puede estar vacío' })
    }

    // Check duplicate email (exclude current client)
    if (email && email !== existing.email) {
      const duplicate = await prisma.client.findFirst({
        where: { businessId, email, NOT: { id } },
      })
      if (duplicate) {
        return res.status(409).json({ error: 'Ya existe un cliente con ese correo electrónico' })
      }
    }

    const client = await prisma.client.update({
      where: { id },
      data: {
        ...(name !== undefined && { name: name.trim() }),
        ...(email !== undefined && { email: email || null }),
        ...(phone !== undefined && { phone: phone || null }),
        ...(address !== undefined && { address: address || null }),
        ...(taxId !== undefined && { taxId: taxId || null }),
        ...(notes !== undefined && { notes: notes || null }),
        ...(tags !== undefined && { tags }),
      },
    })

    res.json(client)
  } catch (error) {
    console.error('Error al actualizar cliente:', error)
    res.status(500).json({ error: 'Error al actualizar el cliente' })
  }
})

// DELETE /api/clients/:id — hard delete (or use ?soft=true for notes-based soft delete)
router.delete('/:id', authenticate, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params
    const businessId = req.user!.businessId

    const existing = await prisma.client.findFirst({ where: { id, businessId } })
    if (!existing) {
      return res.status(404).json({ error: 'Cliente no encontrado' })
    }

    // Check if client has invoices
    const invoiceCount = await prisma.invoice.count({ where: { clientId: id } })
    if (invoiceCount > 0 && req.query.force !== 'true') {
      return res.status(409).json({
        error: `El cliente tiene ${invoiceCount} factura(s) asociada(s). Use force=true para eliminar de todas formas.`,
      })
    }

    await prisma.client.delete({ where: { id } })
    res.json({ message: 'Cliente eliminado correctamente' })
  } catch (error) {
    console.error('Error al eliminar cliente:', error)
    res.status(500).json({ error: 'Error al eliminar el cliente' })
  }
})

// GET /api/clients/:id/invoices — get client invoices
router.get('/:id/invoices', authenticate, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params
    const businessId = req.user!.businessId
    const page = parseInt(req.query.page as string) || 1
    const limit = parseInt(req.query.limit as string) || 20

    const client = await prisma.client.findFirst({ where: { id, businessId } })
    if (!client) {
      return res.status(404).json({ error: 'Cliente no encontrado' })
    }

    const skip = (page - 1) * limit

    const [invoices, total] = await Promise.all([
      prisma.invoice.findMany({
        where: { clientId: id, businessId },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.invoice.count({ where: { clientId: id, businessId } }),
    ])

    res.json({
      invoices,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    })
  } catch (error) {
    console.error('Error al obtener facturas del cliente:', error)
    res.status(500).json({ error: 'Error al obtener las facturas del cliente' })
  }
})

export default router
