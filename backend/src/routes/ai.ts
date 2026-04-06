import { Router, Response } from 'express'
import OpenAI from 'openai'
import { PrismaClient } from '@prisma/client'
import { authenticate, AuthenticatedRequest, requirePlan } from '../middleware/auth'

const router = Router()
const prisma = new PrismaClient()
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

// POST /api/ai/chat — AI business assistant
router.post('/chat', authenticate, async (req: AuthenticatedRequest, res: Response) => {
  const { message, context } = req.body

  if (!message || typeof message !== 'string') {
    return res.status(400).json({ error: 'Mensaje requerido' })
  }

  try {
    const business = await prisma.business.findUnique({
      where: { id: req.user!.businessId },
      select: { name: true, country: true, plan: true },
    })

    const systemPrompt = `Eres el asistente de inteligencia artificial de NegocioSmart para el negocio "${business?.name}" ubicado en ${business?.country}.

Eres un experto en ventas, marketing, gestión empresarial y finanzas para PYMEs latinoamericanas.
Responde siempre en español, de forma clara, práctica y útil.
Si el usuario pregunta sobre funciones no disponibles en su plan (${business?.plan}), sugiérele amablemente actualizar.
Contexto del negocio: ${JSON.stringify(context || {})}`

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: message },
      ],
      max_tokens: 1000,
      temperature: 0.7,
    })

    const reply = completion.choices[0]?.message?.content || 'Lo siento, no pude procesar tu consulta.'

    res.json({ reply, model: 'gpt-4o-mini' })
  } catch (error) {
    console.error('AI chat error:', error)
    res.status(500).json({ error: 'Error al procesar la consulta con IA' })
  }
})

// POST /api/ai/generate-marketing — generate marketing content
router.post('/generate-marketing', authenticate, requirePlan('pro'), async (req: AuthenticatedRequest, res: Response) => {
  const { type, product, audience, tone = 'profesional' } = req.body

  const validTypes = ['email', 'whatsapp', 'instagram', 'facebook', 'sms']
  if (!validTypes.includes(type)) {
    return res.status(400).json({ error: 'Tipo de contenido inválido' })
  }

  try {
    const business = await prisma.business.findUnique({
      where: { id: req.user!.businessId },
      select: { name: true, country: true },
    })

    const prompt = `Crea contenido de marketing para ${type} para el negocio "${business?.name}".
Producto/servicio: ${product}
Audiencia objetivo: ${audience}
Tono: ${tone}
País: ${business?.country}

Genera el contenido de marketing optimizado para conversión, incluyendo un llamado a la acción claro.
Formato la respuesta como JSON con campos: subject (si aplica), body, cta, hashtags (si aplica).`

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [{ role: 'user', content: prompt }],
      response_format: { type: 'json_object' },
      max_tokens: 800,
    })

    const content = JSON.parse(completion.choices[0]?.message?.content || '{}')
    res.json({ content, type })
  } catch (error) {
    console.error('Marketing generation error:', error)
    res.status(500).json({ error: 'Error al generar contenido de marketing' })
  }
})

// POST /api/ai/analyze-sales — analyze sales data and provide insights
router.post('/analyze-sales', authenticate, requirePlan('pro'), async (req: AuthenticatedRequest, res: Response) => {
  const { salesData } = req.body

  try {
    const prompt = `Analiza los siguientes datos de ventas y proporciona:
1. Tendencias principales
2. Productos más rentables
3. Oportunidades de mejora
4. Recomendaciones accionables para los próximos 30 días

Datos de ventas: ${JSON.stringify(salesData)}

Responde en español con insights específicos y prácticos.`

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 1200,
    })

    res.json({ analysis: completion.choices[0]?.message?.content })
  } catch (error) {
    console.error('Sales analysis error:', error)
    res.status(500).json({ error: 'Error al analizar ventas' })
  }
})

// POST /api/ai/chatbot-response — for customer-facing chatbot
router.post('/chatbot-response', async (req: AuthenticatedRequest, res: Response) => {
  const { businessId, customerMessage, conversationHistory = [] } = req.body

  if (!businessId || !customerMessage) {
    return res.status(400).json({ error: 'Datos incompletos' })
  }

  try {
    const business = await prisma.business.findUnique({
      where: { id: businessId },
      select: { name: true, country: true, chatbotPrompt: true },
    })

    if (!business) {
      return res.status(404).json({ error: 'Negocio no encontrado' })
    }

    const systemPrompt = business.chatbotPrompt ||
      `Eres el asistente virtual de "${business.name}".
Ayuda a los clientes con sus preguntas sobre productos, precios y servicios.
Sé amable, profesional y habla en español.
Si no puedes responder algo, ofrece conectar al cliente con un agente humano.`

    const messages = [
      { role: 'system' as const, content: systemPrompt },
      ...conversationHistory.slice(-10),
      { role: 'user' as const, content: customerMessage },
    ]

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages,
      max_tokens: 500,
      temperature: 0.6,
    })

    res.json({ reply: completion.choices[0]?.message?.content })
  } catch (error) {
    console.error('Chatbot error:', error)
    res.status(500).json({ error: 'Error en el chatbot' })
  }
})

export default router
