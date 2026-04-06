import { Router, Response } from 'express'
import { PrismaClient } from '@prisma/client'
import { authenticate, AuthenticatedRequest } from '../middleware/auth'

const router = Router()
const prisma = new PrismaClient()

// GET /api/campaigns/stats — must be before /:id
router.get('/stats', authenticate, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const businessId = req.user!.businessId

    const campaigns = await prisma.campaign.findMany({
      where: { businessId },
      select: {
        status: true,
        recipients: true,
        opened: true,
        clicked: true,
      },
    })

    const total = campaigns.length
    const sent = campaigns.filter((c) => ['sent', 'completed'].includes(c.status)).length
    const totalRecipients = campaigns.reduce((sum, c) => sum + c.recipients, 0)

    const sentCampaigns = campaigns.filter(
      (c) => ['sent', 'completed'].includes(c.status) && c.recipients > 0
    )

    const avgOpenRate =
      sentCampaigns.length > 0
        ? sentCampaigns.reduce((sum, c) => sum + c.opened / c.recipients, 0) /
          sentCampaigns.length
        : 0

    const avgClickRate =
      sentCampaigns.length > 0
        ? sentCampaigns.reduce((sum, c) => sum + c.clicked / c.recipients, 0) /
          sentCampaigns.length
        : 0

    res.json({
      total,
      sent,
      totalRecipients,
      avgOpenRate: Math.round(avgOpenRate * 10000) / 100, // percentage with 2 decimals
      avgClickRate: Math.round(avgClickRate * 10000) / 100,
    })
  } catch (error) {
    console.error('Error al obtener estadísticas de campañas:', error)
    res.status(500).json({ error: 'Error al obtener estadísticas de campañas' })
  }
})

// GET /api/campaigns — list all campaigns
router.get('/', authenticate, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const businessId = req.user!.businessId
    const page = parseInt(req.query.page as string) || 1
    const limit = parseInt(req.query.limit as string) || 20
    const status = req.query.status as string
    const type = req.query.type as string

    const skip = (page - 1) * limit

    const where: any = {
      businessId,
      ...(status && { status }),
      ...(type && { type }),
    }

    const [campaigns, total] = await Promise.all([
      prisma.campaign.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.campaign.count({ where }),
    ])

    res.json({
      campaigns,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    })
  } catch (error) {
    console.error('Error al listar campañas:', error)
    res.status(500).json({ error: 'Error al obtener la lista de campañas' })
  }
})

// GET /api/campaigns/:id — single campaign
router.get('/:id', authenticate, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params
    const businessId = req.user!.businessId

    const campaign = await prisma.campaign.findFirst({
      where: { id, businessId },
    })

    if (!campaign) {
      return res.status(404).json({ error: 'Campaña no encontrada' })
    }

    res.json(campaign)
  } catch (error) {
    console.error('Error al obtener campaña:', error)
    res.status(500).json({ error: 'Error al obtener la campaña' })
  }
})

// POST /api/campaigns — create campaign
router.post('/', authenticate, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const businessId = req.user!.businessId
    const { name, type, subject, body, scheduledAt } = req.body

    if (!name || name.trim() === '') {
      return res.status(400).json({ error: 'El nombre de la campaña es requerido' })
    }

    const validTypes = ['email', 'whatsapp', 'sms', 'instagram', 'facebook']
    if (!type || !validTypes.includes(type)) {
      return res.status(400).json({
        error: `El tipo de campaña es inválido. Tipos válidos: ${validTypes.join(', ')}`,
      })
    }

    if (!body || body.trim() === '') {
      return res.status(400).json({ error: 'El contenido de la campaña es requerido' })
    }

    if (type === 'email' && (!subject || subject.trim() === '')) {
      return res.status(400).json({ error: 'El asunto es requerido para campañas de email' })
    }

    const campaign = await prisma.campaign.create({
      data: {
        name: name.trim(),
        type,
        status: 'draft',
        subject: subject || null,
        body: body.trim(),
        scheduledAt: scheduledAt ? new Date(scheduledAt) : null,
        businessId,
      },
    })

    res.status(201).json(campaign)
  } catch (error) {
    console.error('Error al crear campaña:', error)
    res.status(500).json({ error: 'Error al crear la campaña' })
  }
})

// PUT /api/campaigns/:id — update campaign (draft only)
router.put('/:id', authenticate, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params
    const businessId = req.user!.businessId
    const { name, type, subject, body, scheduledAt } = req.body

    const existing = await prisma.campaign.findFirst({ where: { id, businessId } })
    if (!existing) {
      return res.status(404).json({ error: 'Campaña no encontrada' })
    }

    if (existing.status !== 'draft') {
      return res.status(400).json({
        error: 'Solo se pueden editar campañas en estado borrador',
      })
    }

    if (name !== undefined && (!name || name.trim() === '')) {
      return res.status(400).json({ error: 'El nombre no puede estar vacío' })
    }

    const validTypes = ['email', 'whatsapp', 'sms', 'instagram', 'facebook']
    if (type && !validTypes.includes(type)) {
      return res.status(400).json({
        error: `Tipo de campaña inválido. Tipos válidos: ${validTypes.join(', ')}`,
      })
    }

    const campaign = await prisma.campaign.update({
      where: { id },
      data: {
        ...(name !== undefined && { name: name.trim() }),
        ...(type !== undefined && { type }),
        ...(subject !== undefined && { subject: subject || null }),
        ...(body !== undefined && { body: body.trim() }),
        ...(scheduledAt !== undefined && {
          scheduledAt: scheduledAt ? new Date(scheduledAt) : null,
        }),
      },
    })

    res.json(campaign)
  } catch (error) {
    console.error('Error al actualizar campaña:', error)
    res.status(500).json({ error: 'Error al actualizar la campaña' })
  }
})

// DELETE /api/campaigns/:id — delete draft campaign
router.delete('/:id', authenticate, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params
    const businessId = req.user!.businessId

    const existing = await prisma.campaign.findFirst({ where: { id, businessId } })
    if (!existing) {
      return res.status(404).json({ error: 'Campaña no encontrada' })
    }

    if (existing.status !== 'draft') {
      return res.status(400).json({
        error: 'Solo se pueden eliminar campañas en estado borrador',
      })
    }

    await prisma.campaign.delete({ where: { id } })
    res.json({ message: 'Campaña eliminada correctamente' })
  } catch (error) {
    console.error('Error al eliminar campaña:', error)
    res.status(500).json({ error: 'Error al eliminar la campaña' })
  }
})

// POST /api/campaigns/:id/send — mark campaign as sent
router.post('/:id/send', authenticate, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params
    const businessId = req.user!.businessId
    const { recipients } = req.body

    const existing = await prisma.campaign.findFirst({ where: { id, businessId } })
    if (!existing) {
      return res.status(404).json({ error: 'Campaña no encontrada' })
    }

    if (existing.status === 'sent' || existing.status === 'completed') {
      return res.status(400).json({ error: 'Esta campaña ya fue enviada' })
    }

    const recipientCount =
      recipients !== undefined ? Number(recipients) : existing.recipients || 0

    const campaign = await prisma.campaign.update({
      where: { id },
      data: {
        status: 'sent',
        sentAt: new Date(),
        recipients: recipientCount,
      },
    })

    res.json({
      message: `Campaña enviada exitosamente a ${recipientCount} destinatarios`,
      campaign,
    })
  } catch (error) {
    console.error('Error al enviar campaña:', error)
    res.status(500).json({ error: 'Error al enviar la campaña' })
  }
})

export default router
