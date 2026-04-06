import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string
    email: string
    businessId: string
    plan: string
  }
}

export function authenticate(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Token de autenticación requerido' })
  }

  const token = authHeader.split(' ')[1]

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      id: string
      email: string
      businessId: string
      plan: string
    }
    req.user = decoded
    next()
  } catch {
    return res.status(401).json({ error: 'Token inválido o expirado' })
  }
}

export function requirePlan(minPlan: 'basic' | 'pro' | 'enterprise') {
  const planLevels = { basic: 1, pro: 2, enterprise: 3 }

  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: 'No autenticado' })
    }

    const userLevel = planLevels[req.user.plan as keyof typeof planLevels] || 0
    const requiredLevel = planLevels[minPlan]

    if (userLevel < requiredLevel) {
      return res.status(403).json({
        error: `Esta función requiere el plan ${minPlan} o superior.`,
        upgrade: `/pricing?upgrade=${minPlan}`,
      })
    }

    next()
  }
}
