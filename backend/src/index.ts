import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import rateLimit from 'express-rate-limit'
import dotenv from 'dotenv'

import authRoutes from './routes/auth'
import subscriptionRoutes from './routes/subscription'
import aiRoutes from './routes/ai'
import businessRoutes from './routes/business'
import clientRoutes from './routes/clients'
import invoiceRoutes from './routes/invoices'
import inventoryRoutes from './routes/inventory'
import campaignRoutes from './routes/campaigns'
import analyticsRoutes from './routes/analytics'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 4000

// Security middleware
app.use(helmet())
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
}))

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: { error: 'Demasiadas solicitudes. Intenta de nuevo en 15 minutos.' },
})
app.use('/api/', limiter)

// Body parsing
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true }))

// Logging
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'))

// Health check
app.get('/health', (_req, res) => {
  res.json({
    status: 'ok',
    service: 'NegocioSmart API',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
  })
})

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/subscriptions', subscriptionRoutes)
app.use('/api/ai', aiRoutes)
app.use('/api/business', businessRoutes)
app.use('/api/clients', clientRoutes)
app.use('/api/invoices', invoiceRoutes)
app.use('/api/inventory', inventoryRoutes)
app.use('/api/campaigns', campaignRoutes)
app.use('/api/analytics', analyticsRoutes)

// 404 handler
app.use((_req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' })
})

// Global error handler
app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(err.stack)
  res.status(500).json({
    error: process.env.NODE_ENV === 'production'
      ? 'Error interno del servidor'
      : err.message,
  })
})

app.listen(PORT, () => {
  console.log(`🚀 NegocioSmart API corriendo en http://localhost:${PORT}`)
  console.log(`📋 Entorno: ${process.env.NODE_ENV || 'development'}`)
})

export default app
