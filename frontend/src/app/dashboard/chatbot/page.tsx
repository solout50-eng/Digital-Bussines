'use client'

import { useState } from 'react'
import {
  Bot,
  MessageCircle,
  Send,
  Zap,
  Globe,
  Instagram,
  Facebook,
  Users,
  TrendingUp,
  Clock,
  ShoppingCart,
  CheckCircle,
  AlertCircle,
  Cpu,
  RefreshCw,
} from 'lucide-react'

interface Conversation {
  id: string
  name: string
  channel: 'web' | 'whatsapp' | 'instagram' | 'facebook'
  status: 'resuelto' | 'pendiente'
  lastMessage: string
  time: string
}

interface ChatMessage {
  role: 'user' | 'bot'
  text: string
}

const MOCK_CONVERSATIONS: Conversation[] = [
  { id: '1', name: 'María González', channel: 'whatsapp', status: 'resuelto', lastMessage: 'Gracias, ya realicé mi pedido!', time: 'hace 5 min' },
  { id: '2', name: 'Carlos Rodríguez', channel: 'instagram', status: 'pendiente', lastMessage: '¿Tienen envío a Medellín?', time: 'hace 12 min' },
  { id: '3', name: 'Ana Martínez', channel: 'web', status: 'resuelto', lastMessage: 'Perfecto, muchas gracias.', time: 'hace 28 min' },
  { id: '4', name: 'Diego Hernández', channel: 'web', status: 'pendiente', lastMessage: '¿Cuáles son los métodos de pago?', time: 'hace 45 min' },
  { id: '5', name: 'Valentina Torres', channel: 'facebook', status: 'resuelto', lastMessage: 'Ya recibí mi confirmación.', time: 'hace 1 hora' },
  { id: '6', name: 'Sofía Ramírez', channel: 'whatsapp', status: 'pendiente', lastMessage: '¿Hacen devoluciones?', time: 'hace 2 horas' },
]

const CHANNEL_CONFIG = {
  web: { icon: Globe, color: 'text-accent-600', bg: 'bg-accent-50', label: 'Web' },
  whatsapp: { icon: MessageCircle, color: 'text-emerald-600', bg: 'bg-emerald-50', label: 'WhatsApp' },
  instagram: { icon: Instagram, color: 'text-pink-600', bg: 'bg-pink-50', label: 'Instagram' },
  facebook: { icon: Facebook, color: 'text-accent-700', bg: 'bg-accent-100', label: 'Facebook' },
}

const INITIAL_CHAT: ChatMessage[] = [
  { role: 'bot', text: '¡Hola! Soy el asistente de NegocioSmart. ¿En qué puedo ayudarte hoy?' },
  { role: 'user', text: 'Hola, ¿tienen blusas talla M en color negro?' },
  { role: 'bot', text: 'Claro que sí! Tenemos la Blusa Floral Manga Larga y el Top Crop Básico Negro en talla M. ¿Deseas ver más detalles o agregar alguna al carrito?' },
  { role: 'user', text: '¿Cuánto cuesta el Top Crop?' },
  { role: 'bot', text: 'El Top Crop Básico Negro tiene un precio de $220 MXN. ¡Está en stock y podría estar en tu casa en 2-3 días hábiles! 🛍️' },
]

export default function ChatbotPage() {
  const [systemPrompt, setSystemPrompt] = useState(
    `Eres un asistente de ventas amigable y profesional para una tienda de moda latinoamericana. Tu nombre es "Luna".

Tus objetivos:
- Ayudar a los clientes a encontrar productos que se adapten a sus necesidades
- Responder preguntas sobre precios, disponibilidad y envíos
- Capturar leads solicitando email y nombre
- Cerrar ventas de forma natural y sin presión
- Hablar siempre en español, con un tono cálido y cercano

Restricciones:
- No menciones a la competencia
- Si no sabes algo, ofrece conectar con un agente humano
- Respuestas cortas y directas (máx. 3 oraciones)`
  )

  const [channels, setChannels] = useState({
    web: true,
    whatsapp: true,
    instagram: false,
    facebook: false,
  })

  const [chatInput, setChatInput] = useState('')
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(INITIAL_CHAT)
  const [selectedConv, setSelectedConv] = useState<string>('1')
  const [training, setTraining] = useState(false)

  const toggleChannel = (ch: keyof typeof channels) => {
    setChannels((prev) => ({ ...prev, [ch]: !prev[ch] }))
  }

  const sendMessage = () => {
    if (!chatInput.trim()) return
    const userMsg: ChatMessage = { role: 'user', text: chatInput }
    setChatMessages((prev) => [...prev, userMsg])
    setChatInput('')
    // Simulate bot response
    setTimeout(() => {
      const botMsg: ChatMessage = {
        role: 'bot',
        text: '¡Gracias por tu pregunta! Déjame verificar esa información para darte la mejor respuesta posible. 😊',
      }
      setChatMessages((prev) => [...prev, botMsg])
    }, 800)
  }

  const handleTrain = async () => {
    setTraining(true)
    await new Promise((r) => setTimeout(r, 2000))
    setTraining(false)
  }

  const stats = [
    { label: 'Conversaciones hoy', value: '47', icon: MessageCircle, color: 'text-brand-600 bg-brand-50' },
    { label: 'Leads capturados', value: '23', icon: Users, color: 'text-emerald-600 bg-emerald-50' },
    { label: 'Ventas cerradas por IA', value: '8', icon: ShoppingCart, color: 'text-accent-600 bg-accent-50' },
    { label: 'Tiempo respuesta prom.', value: '< 2s', icon: Clock, color: 'text-amber-600 bg-amber-50' },
  ]

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Asistente IA</h1>
          <p className="text-slate-500 text-sm mt-0.5">Configura y monitorea tu chatbot</p>
        </div>
        <button
          onClick={handleTrain}
          disabled={training}
          className="btn-primary gap-2 disabled:opacity-60"
        >
          {training ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              Entrenando...
            </>
          ) : (
            <>
              <Cpu className="w-4 h-4" />
              Entrenar con mis productos
            </>
          )}
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => {
          const Icon = s.icon
          return (
            <div key={s.label} className="card p-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs text-slate-500">{s.label}</p>
                <div className={`p-2 rounded-lg ${s.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <p className="text-2xl font-bold text-slate-900">{s.value}</p>
            </div>
          )
        })}
      </div>

      {/* Main grid: config + preview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Config panel */}
        <div className="space-y-5">
          {/* System prompt */}
          <div className="card p-5">
            <div className="flex items-center gap-2 mb-3">
              <div className="p-1.5 rounded-lg bg-brand-50">
                <Bot className="w-4 h-4 text-brand-600" />
              </div>
              <h3 className="text-sm font-bold text-slate-900">Personalidad del bot</h3>
            </div>
            <textarea
              value={systemPrompt}
              onChange={(e) => setSystemPrompt(e.target.value)}
              rows={10}
              className="input-field text-sm resize-none font-mono leading-relaxed"
              placeholder="Define la personalidad, objetivos y restricciones de tu chatbot..."
            />
            <button className="btn-primary w-full mt-3 text-sm py-2.5 gap-2">
              <Zap className="w-4 h-4" />
              Guardar configuración
            </button>
          </div>

          {/* Channel toggles */}
          <div className="card p-5">
            <h3 className="text-sm font-bold text-slate-900 mb-4">Canales activos</h3>
            <div className="space-y-3">
              {(Object.entries(CHANNEL_CONFIG) as [keyof typeof channels, typeof CHANNEL_CONFIG[keyof typeof CHANNEL_CONFIG]][]).map(([key, cfg]) => {
                const Icon = cfg.icon
                return (
                  <div key={key} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-xl ${cfg.bg}`}>
                        <Icon className={`w-4 h-4 ${cfg.color}`} />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-800">{cfg.label}</p>
                        <p className="text-xs text-slate-400">
                          {channels[key] ? 'Activo' : 'Inactivo'}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => toggleChannel(key)}
                      className={`relative w-11 h-6 rounded-full transition-all duration-200 ${
                        channels[key] ? 'bg-brand-600' : 'bg-slate-200'
                      }`}
                    >
                      <span
                        className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-all duration-200 ${
                          channels[key] ? 'left-[22px]' : 'left-0.5'
                        }`}
                      />
                    </button>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Chat preview */}
        <div className="card flex flex-col h-[600px]">
          <div className="px-4 py-3 border-b border-slate-100 flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-500 to-accent-500 flex items-center justify-center">
              <Bot className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-900">Luna — Asistente IA</p>
              <p className="text-xs text-emerald-500 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
                En línea
              </p>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {chatMessages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-sm ${
                    msg.role === 'user'
                      ? 'bg-brand-600 text-white rounded-tr-none'
                      : 'bg-slate-100 text-slate-800 rounded-tl-none'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
          </div>

          <div className="px-4 py-3 border-t border-slate-100 flex gap-2">
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
              placeholder="Escribe un mensaje de prueba..."
              className="flex-1 px-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
            />
            <button
              onClick={sendMessage}
              className="p-2 rounded-xl bg-brand-600 text-white hover:bg-brand-700 transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Recent conversations */}
      <div className="card overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100">
          <h3 className="text-sm font-bold text-slate-900">Conversaciones recientes</h3>
        </div>
        <div className="divide-y divide-slate-50">
          {MOCK_CONVERSATIONS.map((conv) => {
            const ch = CHANNEL_CONFIG[conv.channel]
            const CIcon = ch.icon
            const isSelected = selectedConv === conv.id
            return (
              <button
                key={conv.id}
                onClick={() => setSelectedConv(conv.id)}
                className={`w-full flex items-center gap-3 px-5 py-3 hover:bg-slate-50 transition-colors text-left ${
                  isSelected ? 'bg-brand-50' : ''
                }`}
              >
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-brand-400 to-accent-400 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                  {conv.name.split(' ').map((n) => n[0]).slice(0, 2).join('')}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-slate-800">{conv.name}</span>
                    <span className="text-xs text-slate-400">{conv.time}</span>
                  </div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <div className={`flex items-center gap-0.5 text-xs ${ch.color}`}>
                      <CIcon className="w-3 h-3" />
                    </div>
                    <p className="text-xs text-slate-500 truncate">{conv.lastMessage}</p>
                  </div>
                </div>
                <div className="flex-shrink-0">
                  {conv.status === 'resuelto' ? (
                    <span className="inline-flex items-center gap-1 text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-medium">
                      <CheckCircle className="w-3 h-3" />
                      Resuelto
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-medium">
                      <AlertCircle className="w-3 h-3" />
                      Pendiente
                    </span>
                  )}
                </div>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
