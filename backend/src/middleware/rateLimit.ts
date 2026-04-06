import rateLimit from 'express-rate-limit'
import { Request, Response } from 'express'

// General API rate limit
export const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200,
  message: { error: 'Demasiadas solicitudes. Intenta de nuevo en 15 minutos.' },
  standardHeaders: true,
  legacyHeaders: false,
})

// Strict limit for auth endpoints
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { error: 'Demasiados intentos de autenticación. Intenta de nuevo en 15 minutos.' },
  skipSuccessfulRequests: true,
})

// AI endpoints — more expensive, tighter limit
export const aiLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 20,
  message: { error: 'Límite de solicitudes a IA alcanzado. Espera un momento.' },
})
