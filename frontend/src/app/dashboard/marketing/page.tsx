'use client'

import { useState } from 'react'
import {
  Plus,
  Megaphone,
  Mail,
  MessageCircle,
  Instagram,
  Facebook,
  Smartphone,
  Zap,
  X,
  Send,
  Users,
  Eye,
  MousePointerClick,
  TrendingUp,
  Calendar,
  Play,
  Pause,
  BarChart2,
} from 'lucide-react'

type CampaignStatus = 'activa' | 'borrador' | 'pausada' | 'completada'
type ChannelType = 'email' | 'whatsapp' | 'instagram' | 'facebook' | 'sms'

interface Campaign {
  id: string
  name: string
  type: ChannelType
  status: CampaignStatus
  recipients: number
  opened: number
  clicks: number
  date: string
}

const MOCK_CAMPAIGNS: Campaign[] = [
  { id: '1', name: 'Promo de Verano 2024', type: 'email', status: 'activa', recipients: 3420, opened: 1540, clicks: 312, date: '15/03/2024' },
  { id: '2', name: 'Reactivación clientes inactivos', type: 'whatsapp', status: 'activa', recipients: 876, opened: 702, clicks: 198, date: '20/03/2024' },
  { id: '3', name: 'Flash Sale Fin de Semana', type: 'instagram', status: 'pausada', recipients: 5200, opened: 2100, clicks: 445, date: '10/03/2024' },
  { id: '4', name: 'Bienvenida nuevos registros', type: 'email', status: 'completada', recipients: 234, opened: 189, clicks: 87, date: '01/03/2024' },
  { id: '5', name: 'Ofertas San Valentín', type: 'facebook', status: 'completada', recipients: 8900, opened: 3600, clicks: 721, date: '14/02/2024' },
]

const CHANNEL_CONFIG: Record<ChannelType, { label: string; icon: any; color: string; bg: string }> = {
  email: { label: 'Email', icon: Mail, color: 'text-brand-700', bg: 'bg-brand-100' },
  whatsapp: { label: 'WhatsApp', icon: MessageCircle, color: 'text-emerald-700', bg: 'bg-emerald-100' },
  instagram: { label: 'Instagram', icon: Instagram, color: 'text-pink-700', bg: 'bg-pink-100' },
  facebook: { label: 'Facebook', icon: Facebook, color: 'text-accent-700', bg: 'bg-accent-100' },
  sms: { label: 'SMS', icon: Smartphone, color: 'text-slate-700', bg: 'bg-slate-100' },
}

const STATUS_CONFIG: Record<CampaignStatus, { label: string; classes: string }> = {
  activa: { label: 'Activa', classes: 'bg-emerald-100 text-emerald-700' },
  borrador: { label: 'Borrador', classes: 'bg-slate-100 text-slate-600' },
  pausada: { label: 'Pausada', classes: 'bg-amber-100 text-amber-700' },
  completada: { label: 'Completada', classes: 'bg-brand-100 text-brand-700' },
}

const TABS = ['Campañas', 'Automatizaciones', 'Plantillas']

const AI_TONES = ['Profesional', 'Amigable', 'Urgente', 'Festivo', 'Informativo']

export default function MarketingPage() {
  const [activeTab, setActiveTab] = useState('Campañas')
  const [showAIModal, setShowAIModal] = useState(false)
  const [aiTopic, setAiTopic] = useState('')
  const [aiTone, setAiTone] = useState('Amigable')
  const [aiChannel, setAiChannel] = useState<ChannelType>('email')
  const [aiGenerating, setAiGenerating] = useState(false)
  const [aiResult, setAiResult] = useState('')

  const handleAIGenerate = async () => {
    if (!aiTopic.trim()) return
    setAiGenerating(true)
    setAiResult('')
    // Simulate AI generation
    await new Promise((r) => setTimeout(r, 1800))
    setAiResult(
      `¡Hola [Nombre]! 🎉\n\nQueremos compartirte algo especial sobre ${aiTopic}.\n\nEn NegocioSmart sabemos lo importante que es para ti encontrar las mejores opciones, y por eso hemos preparado una oferta exclusiva que no querrás perderte.\n\n✅ Descuento especial por tiempo limitado\n✅ Envío sin costo en tu primera compra\n✅ Garantía de satisfacción al 100%\n\nNo dejes pasar esta oportunidad. ¡Actúa ahora!\n\n[CTA: Ver oferta]`
    )
    setAiGenerating(false)
  }

  const totalActive = MOCK_CAMPAIGNS.filter((c) => c.status === 'activa').length
  const totalSent = MOCK_CAMPAIGNS.reduce((s, c) => s + c.recipients, 0)
  const avgOpenRate = Math.round(
    (MOCK_CAMPAIGNS.reduce((s, c) => s + c.opened / c.recipients, 0) / MOCK_CAMPAIGNS.length) * 100
  )
  const totalConversions = Math.round(MOCK_CAMPAIGNS.reduce((s, c) => s + c.clicks, 0) / totalSent * 100)

  const stats = [
    { label: 'Campañas activas', value: totalActive.toString(), icon: Megaphone, color: 'text-brand-600 bg-brand-50' },
    { label: 'Emails enviados', value: totalSent.toLocaleString(), icon: Send, color: 'text-accent-600 bg-accent-50' },
    { label: 'Tasa de apertura', value: `${avgOpenRate}%`, icon: Eye, color: 'text-emerald-600 bg-emerald-50' },
    { label: 'Conversiones', value: `${totalConversions}%`, icon: TrendingUp, color: 'text-amber-600 bg-amber-50' },
  ]

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Marketing</h1>
          <p className="text-slate-500 text-sm mt-0.5">Gestiona tus campañas y automatizaciones</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowAIModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 border-brand-300 text-brand-700 font-semibold hover:bg-brand-50 transition-all duration-150"
          >
            <Zap className="w-4 h-4" />
            Generar con IA
          </button>
          <button className="btn-primary gap-2">
            <Plus className="w-4 h-4" />
            Nueva campaña
          </button>
        </div>
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

      {/* Channel icons */}
      <div className="card p-4">
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Canales disponibles</p>
        <div className="flex gap-3 flex-wrap">
          {(Object.entries(CHANNEL_CONFIG) as [ChannelType, typeof CHANNEL_CONFIG[ChannelType]][]).map(([key, cfg]) => {
            const Icon = cfg.icon
            return (
              <div key={key} className={`flex items-center gap-2 px-3 py-2 rounded-xl ${cfg.bg}`}>
                <Icon className={`w-4 h-4 ${cfg.color}`} />
                <span className={`text-xs font-semibold ${cfg.color}`}>{cfg.label}</span>
              </div>
            )
          })}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-slate-200">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-5 py-2.5 text-sm font-medium transition-all duration-150 border-b-2 -mb-px ${
              activeTab === tab
                ? 'border-brand-600 text-brand-700'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Campaigns tab */}
      {activeTab === 'Campañas' && (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-4 py-3">Nombre</th>
                  <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-4 py-3">Canal</th>
                  <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-4 py-3">Estado</th>
                  <th className="text-right text-xs font-semibold text-slate-500 uppercase tracking-wider px-4 py-3">Destinatarios</th>
                  <th className="text-right text-xs font-semibold text-slate-500 uppercase tracking-wider px-4 py-3">Abiertos</th>
                  <th className="text-right text-xs font-semibold text-slate-500 uppercase tracking-wider px-4 py-3">Clicks</th>
                  <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-4 py-3">Fecha</th>
                  <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-4 py-3">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {MOCK_CAMPAIGNS.map((campaign) => {
                  const ch = CHANNEL_CONFIG[campaign.type]
                  const st = STATUS_CONFIG[campaign.status]
                  const CIcon = ch.icon
                  const openRate = Math.round((campaign.opened / campaign.recipients) * 100)
                  const clickRate = Math.round((campaign.clicks / campaign.recipients) * 100)
                  return (
                    <tr key={campaign.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-3">
                        <p className="text-sm font-semibold text-slate-800">{campaign.name}</p>
                      </td>
                      <td className="px-4 py-3">
                        <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl ${ch.bg}`}>
                          <CIcon className={`w-3.5 h-3.5 ${ch.color}`} />
                          <span className={`text-xs font-semibold ${ch.color}`}>{ch.label}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${st.classes}`}>
                          {st.label}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1 text-sm text-slate-700">
                          <Users className="w-3.5 h-3.5 text-slate-400" />
                          {campaign.recipients.toLocaleString()}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="text-sm">
                          <span className="font-semibold text-emerald-600">{openRate}%</span>
                          <span className="text-slate-400 text-xs ml-1">({campaign.opened.toLocaleString()})</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="text-sm">
                          <span className="font-semibold text-accent-600">{clickRate}%</span>
                          <span className="text-slate-400 text-xs ml-1">({campaign.clicks})</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1 text-xs text-slate-500">
                          <Calendar className="w-3 h-3" />
                          {campaign.date}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          <button className="p-1.5 text-slate-400 hover:text-brand-600 hover:bg-brand-50 rounded-lg transition-colors">
                            <BarChart2 className="w-3.5 h-3.5" />
                          </button>
                          {campaign.status === 'activa' ? (
                            <button className="p-1.5 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors">
                              <Pause className="w-3.5 h-3.5" />
                            </button>
                          ) : campaign.status === 'pausada' ? (
                            <button className="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors">
                              <Play className="w-3.5 h-3.5" />
                            </button>
                          ) : null}
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'Automatizaciones' && (
        <div className="card p-8 text-center">
          <div className="w-16 h-16 rounded-2xl bg-brand-50 flex items-center justify-center mx-auto mb-4">
            <Zap className="w-8 h-8 text-brand-500" />
          </div>
          <h3 className="text-lg font-bold text-slate-800 mb-2">Automatizaciones</h3>
          <p className="text-slate-500 text-sm mb-4 max-w-sm mx-auto">
            Crea flujos de trabajo automáticos para nutrir a tus clientes sin esfuerzo manual.
          </p>
          <button className="btn-primary gap-2">
            <Plus className="w-4 h-4" />
            Crear automatización
          </button>
        </div>
      )}

      {activeTab === 'Plantillas' && (
        <div className="card p-8 text-center">
          <div className="w-16 h-16 rounded-2xl bg-accent-50 flex items-center justify-center mx-auto mb-4">
            <Mail className="w-8 h-8 text-accent-500" />
          </div>
          <h3 className="text-lg font-bold text-slate-800 mb-2">Plantillas</h3>
          <p className="text-slate-500 text-sm mb-4 max-w-sm mx-auto">
            Guarda y reutiliza tus mejores plantillas de email, WhatsApp e Instagram.
          </p>
          <button className="btn-primary gap-2">
            <Plus className="w-4 h-4" />
            Nueva plantilla
          </button>
        </div>
      )}

      {/* AI Modal */}
      {showAIModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-lg w-full shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500 to-accent-500 flex items-center justify-center">
                  <Zap className="w-4 h-4 text-white" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">Generar contenido con IA</h3>
              </div>
              <button onClick={() => { setShowAIModal(false); setAiResult('') }} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Canal
                </label>
                <div className="flex gap-2 flex-wrap">
                  {(Object.keys(CHANNEL_CONFIG) as ChannelType[]).map((ch) => {
                    const cfg = CHANNEL_CONFIG[ch]
                    const Icon = cfg.icon
                    return (
                      <button
                        key={ch}
                        onClick={() => setAiChannel(ch)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border-2 transition-all ${
                          aiChannel === ch ? `${cfg.bg} ${cfg.color} border-current` : 'border-slate-200 text-slate-500 hover:border-slate-300'
                        }`}
                      >
                        <Icon className="w-3.5 h-3.5" />
                        {cfg.label}
                      </button>
                    )
                  })}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Tema de la campaña
                </label>
                <input
                  type="text"
                  value={aiTopic}
                  onChange={(e) => setAiTopic(e.target.value)}
                  placeholder="Ej: descuento de verano en blusas, lanzamiento de nueva colección..."
                  className="input-field"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Tono de voz
                </label>
                <div className="flex gap-2 flex-wrap">
                  {AI_TONES.map((tone) => (
                    <button
                      key={tone}
                      onClick={() => setAiTone(tone)}
                      className={`text-xs px-3 py-1.5 rounded-lg font-medium border transition-all ${
                        aiTone === tone
                          ? 'bg-brand-600 text-white border-brand-600'
                          : 'border-slate-200 text-slate-600 hover:border-brand-300'
                      }`}
                    >
                      {tone}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={handleAIGenerate}
                disabled={!aiTopic.trim() || aiGenerating}
                className="w-full btn-primary gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {aiGenerating ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Generando contenido...
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4" />
                    Generar contenido
                  </>
                )}
              </button>

              {aiResult && (
                <div className="mt-2">
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-medium text-slate-700">Contenido generado</label>
                    <span className="text-xs text-emerald-600 font-medium">✓ Listo</span>
                  </div>
                  <textarea
                    value={aiResult}
                    onChange={(e) => setAiResult(e.target.value)}
                    rows={8}
                    className="input-field text-sm resize-none font-mono"
                  />
                  <div className="flex gap-2 mt-3">
                    <button className="flex-1 btn-primary gap-2 text-sm py-2.5">
                      <Send className="w-4 h-4" />
                      Usar en campaña
                    </button>
                    <button
                      onClick={handleAIGenerate}
                      className="flex-1 btn-secondary gap-2 text-sm py-2.5"
                    >
                      <Zap className="w-4 h-4" />
                      Regenerar
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
