import { Router, Request, Response } from 'express'
import { body, validationResult } from 'express-validator'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { PrismaClient } from '@prisma/client'

const router = Router()
const prisma = new PrismaClient()

// POST /api/auth/register
router.post(
  '/register',
  [
    body('email').isEmail().normalizeEmail().withMessage('Email inválido'),
    body('password').isLength({ min: 8 }).withMessage('La contraseña debe tener al menos 8 caracteres'),
    body('businessName').notEmpty().trim().withMessage('El nombre del negocio es requerido'),
    body('country').isIn(['MX', 'CO', 'AR', 'PE', 'CL', 'EC', 'VE', 'BO', 'PY', 'UY', 'GT', 'CR']).withMessage('País no válido'),
  ],
  async (req: Request, res: Response) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    const { email, password, businessName, country, plan = 'basic' } = req.body

    try {
      const existingUser = await prisma.user.findUnique({ where: { email } })
      if (existingUser) {
        return res.status(409).json({ error: 'Ya existe una cuenta con ese email' })
      }

      const hashedPassword = await bcrypt.hash(password, 12)

      const user = await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          business: {
            create: {
              name: businessName,
              country,
              plan,
              trialEndsAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days
            },
          },
        },
        include: { business: true },
      })

      const token = jwt.sign(
        {
          id: user.id,
          email: user.email,
          businessId: user.business!.id,
          plan: user.business!.plan,
        },
        process.env.JWT_SECRET!,
        { expiresIn: '7d' }
      )

      res.status(201).json({
        message: 'Cuenta creada exitosamente. ¡Bienvenido a NegocioSmart!',
        token,
        user: {
          id: user.id,
          email: user.email,
          businessName: user.business!.name,
          plan: user.business!.plan,
          trialEndsAt: user.business!.trialEndsAt,
        },
      })
    } catch (error) {
      console.error('Register error:', error)
      res.status(500).json({ error: 'Error al crear la cuenta' })
    }
  }
)

// POST /api/auth/login
router.post(
  '/login',
  [
    body('email').isEmail().normalizeEmail(),
    body('password').notEmpty(),
  ],
  async (req: Request, res: Response) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    const { email, password } = req.body

    try {
      const user = await prisma.user.findUnique({
        where: { email },
        include: { business: true },
      })

      if (!user || !user.business) {
        return res.status(401).json({ error: 'Credenciales incorrectas' })
      }

      const isValid = await bcrypt.compare(password, user.password)
      if (!isValid) {
        return res.status(401).json({ error: 'Credenciales incorrectas' })
      }

      const token = jwt.sign(
        {
          id: user.id,
          email: user.email,
          businessId: user.business.id,
          plan: user.business.plan,
        },
        process.env.JWT_SECRET!,
        { expiresIn: '7d' }
      )

      res.json({
        token,
        user: {
          id: user.id,
          email: user.email,
          businessName: user.business.name,
          plan: user.business.plan,
        },
      })
    } catch (error) {
      console.error('Login error:', error)
      res.status(500).json({ error: 'Error al iniciar sesión' })
    }
  }
)

// POST /api/auth/forgot-password
router.post(
  '/forgot-password',
  [body('email').isEmail().normalizeEmail()],
  async (req: Request, res: Response) => {
    const { email } = req.body
    // In production: generate reset token and send email
    // Here we return a generic response to prevent email enumeration
    res.json({
      message: 'Si existe una cuenta con ese email, recibirás un enlace de recuperación.',
    })
  }
)

export default router
