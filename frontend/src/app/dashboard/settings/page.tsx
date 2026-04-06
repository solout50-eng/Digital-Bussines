'use client'

import { useState } from 'react'
import {
  Building2,
  User,
  CreditCard,
  Plug,
  Bell,
  Upload,
  Eye,
  EyeOff,
  Check,
  ExternalLink,
  ChevronRight,
  Zap,
  Shield,
  Globe,
  MessageCircle,
  ShoppingBag,
  Table2,
  Workflow,
} from 'lucide-react'

const TABS = [
  { id: 'negocio', label: 'Mi negocio', icon: Building2 },
  { id: 'cuenta', label: 'Cuenta', icon: User },
  { id: 'facturacion', label: 'Facturación', icon: CreditCard },
  { id: 'integraciones', label: 'Integraciones', icon: Plug },
  { id: 'notificaciones', label: 'Notificaciones', icon: Bell },
]

const COUNTRIES = [
  { code: 'MX', name: 'México' }, { code: 'CO', name: 'Colombia' },
  { code: 'AR', name: 'Argentina' }, { code: 'PE', name: 'Perú' },
  { code: 'CL', name: 'Chile' }, { code: 'EC', name: 'Ecuador' },
]

const TIMEZONES = [
  'America/Mexico_City', 'America/Bogota', 'America/Argentina/Buenos_Aires',
  'America/Lima', 'America/Santiago', 'America/Guayaquil',
]

const CURRENCIES = ['MXN', 'COP', 'ARS', 'PEN', 'CLP', 'USD']

const INTEGRATIONS = [
  { id: 'whatsapp', name: 'WhatsApp Business', icon: MessageCircle, color: 'text-emerald-600 bg-emerald-50', desc: 'Conecta tu número de WhatsApp Business para chatbot y notificaciones', connected: true },
  { id: 'stripe', name: 'Stripe', icon: CreditCard, color: 'text-brand-600 bg-brand-50', desc: 'Acepta pagos con tarjeta de crédito y débito internacionalmente', connected: true },
  { id: 'mercadolibre', name: 'Mercado Libre', icon: ShoppingBag, color: 'text-amber-600 bg-amber-50', desc: 'Sincroniza tu catálogo y pedidos con Mercado Libre', connected: false },
  { id: 'gsheets', name: 'Google Sheets', icon: Table2, color: 'text-emerald-600 bg-emerald-50', desc: 'Exporta datos de clientes e inventario automáticamente', connected: false },
  { id: 'zapier', name: 'Zapier', icon: Workflow, color: 'text-orange-600 bg-orange-50', desc: 'Conecta NegocioSmart con más de 5,000 aplicaciones', connected: false },
]

const BILLING_HISTORY = [
  { date: '01/03/2024', plan: 'Pro mensual', amount: '$299 MXN', status: 'Pagado' },
  { date: '01/02/2024', plan: 'Pro mensual', amount: '$299 MXN', status: 'Pagado' },
  { date: '01/01/2024', plan: 'Pro mensual', amount: '$299 MXN', status: 'Pagado' },
]

function ToggleSwitch({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!value)}
      className={`relative w-11 h-6 rounded-full transition-all duration-200 ${value ? 'bg-brand-600' : 'bg-slate-200'}`}
    >
      <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-all duration-200 ${value ? 'left-[22px]' : 'left-0.5'}`} />
    </button>
  )
}

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('negocio')

  // Negocio state
  const [businessName, setBusinessName] = useState('Boutique Moda Latina')
  const [country, setCountry] = useState('MX')
  const [timezone, setTimezone] = useState('America/Mexico_City')
  const [currency, setCurrency] = useState('MXN')

  // Cuenta state
  const [email, setEmail] = useState('admin@modaltina.mx')
  const [currentPass, setCurrentPass] = useState('')
  const [newPass, setNewPass] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [twoFA, setTwoFA] = useState(false)

  // Integrations state
  const [integrations, setIntegrations] = useState<Record<string, boolean>>(
    Object.fromEntries(INTEGRATIONS.map((i) => [i.id, i.connected]))
  )

  // Notifications state
  const [notifications, setNotifications] = useState({
    emailNuevaVenta: true,
    emailNuevoCliente: true,
    emailNuevoLead: false,
    emailReportesSemanal: true,
    whatsappAlertaStock: true,
    whatsappNuevaVenta: false,
    reporteSemanal: true,
    reporteMensual: true,
  })

  const [savedNotification, setSavedNotification] = useState('')

  const showSaved = (msg: string) => {
    setSavedNotification(msg)
    setTimeout(() => setSavedNotification(''), 2500)
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Configuración</h1>
        <p className="text-slate-500 text-sm mt-0.5">Gestiona tu cuenta y preferencias</p>
      </div>

      {/* Saved toast */}
      {savedNotification && (
        <div className="fixed top-6 right-6 flex items-center gap-2 bg-emerald-600 text-white px-4 py-2.5 rounded-xl shadow-lg z-50 text-sm font-medium">
          <Check className="w-4 h-4" />
          {savedNotification}
        </div>
      )}

      <div className="flex gap-6 flex-col lg:flex-row">
        {/* Sidebar tabs */}
        <div className="lg:w-56 flex-shrink-0">
          <div className="card p-2">
            {TABS.map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
                    activeTab === tab.id
                      ? 'bg-brand-600 text-white'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  {tab.label}
                </button>
              )
            })}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* ===== MI NEGOCIO ===== */}
          {activeTab === 'negocio' && (
            <div className="card p-6 space-y-5">
              <h2 className="text-lg font-bold text-slate-900">Información del negocio</h2>

              {/* Logo upload */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Logo</label>
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-brand-100 to-accent-100 flex items-center justify-center border-2 border-dashed border-brand-300">
                    <Zap className="w-8 h-8 text-brand-400" />
                  </div>
                  <div>
                    <button className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 text-sm text-slate-700 font-medium hover:bg-slate-50 transition-colors">
                      <Upload className="w-4 h-4" />
                      Subir logo
                    </button>
                    <p className="text-xs text-slate-400 mt-1">PNG, JPG o SVG. Máx. 2MB</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Nombre del negocio</label>
                  <input type="text" value={businessName} onChange={(e) => setBusinessName(e.target.value)} className="input-field" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">País</label>
                  <select value={country} onChange={(e) => setCountry(e.target.value)} className="input-field">
                    {COUNTRIES.map((c) => (
                      <option key={c.code} value={c.code}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Moneda</label>
                  <select value={currency} onChange={(e) => setCurrency(e.target.value)} className="input-field">
                    {CURRENCIES.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Zona horaria</label>
                  <select value={timezone} onChange={(e) => setTimezone(e.target.value)} className="input-field">
                    {TIMEZONES.map((t) => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
              </div>

              <button onClick={() => showSaved('Cambios guardados')} className="btn-primary gap-2">
                <Check className="w-4 h-4" />
                Guardar cambios
              </button>
            </div>
          )}

          {/* ===== CUENTA ===== */}
          {activeTab === 'cuenta' && (
            <div className="space-y-5">
              <div className="card p-6 space-y-4">
                <h2 className="text-lg font-bold text-slate-900">Información de la cuenta</h2>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Correo electrónico</label>
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="input-field" />
                </div>
                <button onClick={() => showSaved('Email actualizado')} className="btn-primary gap-2">
                  <Check className="w-4 h-4" />
                  Actualizar email
                </button>
              </div>

              <div className="card p-6 space-y-4">
                <h2 className="text-lg font-bold text-slate-900">Cambiar contraseña</h2>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Contraseña actual</label>
                  <div className="relative">
                    <input
                      type={showPass ? 'text' : 'password'}
                      value={currentPass}
                      onChange={(e) => setCurrentPass(e.target.value)}
                      placeholder="••••••••"
                      className="input-field pr-10"
                    />
                    <button onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                      {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Nueva contraseña</label>
                  <input
                    type="password"
                    value={newPass}
                    onChange={(e) => setNewPass(e.target.value)}
                    placeholder="Mínimo 8 caracteres"
                    className="input-field"
                  />
                </div>
                <button onClick={() => showSaved('Contraseña actualizada')} className="btn-primary gap-2">
                  <Shield className="w-4 h-4" />
                  Actualizar contraseña
                </button>
              </div>

              <div className="card p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">Autenticación en dos pasos (2FA)</h3>
                    <p className="text-xs text-slate-500 mt-0.5">Agrega una capa extra de seguridad a tu cuenta</p>
                  </div>
                  <ToggleSwitch value={twoFA} onChange={(v) => { setTwoFA(v); showSaved(v ? '2FA activado' : '2FA desactivado') }} />
                </div>
                {twoFA && (
                  <div className="mt-3 p-3 bg-emerald-50 rounded-xl text-sm text-emerald-700 flex items-center gap-2">
                    <Check className="w-4 h-4" />
                    2FA activado. Recibirás un código en tu email al iniciar sesión.
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ===== FACTURACIÓN ===== */}
          {activeTab === 'facturacion' && (
            <div className="space-y-5">
              {/* Current plan */}
              <div className="card p-6">
                <h2 className="text-lg font-bold text-slate-900 mb-4">Plan actual</h2>
                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-brand-50 to-accent-50 rounded-xl border border-brand-200">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-lg font-bold text-brand-800">Plan Pro</span>
                      <span className="text-xs bg-brand-600 text-white px-2 py-0.5 rounded-full font-medium">Activo</span>
                    </div>
                    <p className="text-sm text-brand-600">$299 MXN / mes · Renovación: 01/04/2024</p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {['Clientes ilimitados', '5 usuarios', 'Chatbot IA', 'Marketing automation'].map((f) => (
                        <span key={f} className="text-xs bg-white text-brand-700 px-2 py-0.5 rounded-full border border-brand-200">
                          ✓ {f}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <button className="mt-4 w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-brand-600 to-accent-600 text-white font-semibold text-sm hover:from-brand-700 hover:to-accent-700 transition-all flex items-center justify-center gap-2">
                  <Zap className="w-4 h-4" />
                  Mejorar a Business — desde $699 MXN/mes
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              {/* Payment method */}
              <div className="card p-6">
                <h2 className="text-lg font-bold text-slate-900 mb-4">Método de pago</h2>
                <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl">
                  <div className="w-12 h-8 rounded-lg bg-gradient-to-r from-slate-700 to-slate-900 flex items-center justify-center">
                    <CreditCard className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-800">Visa •••• 4532</p>
                    <p className="text-xs text-slate-500">Vence 09/2026</p>
                  </div>
                  <button className="ml-auto text-sm text-brand-600 hover:text-brand-800 font-medium">Cambiar</button>
                </div>
              </div>

              {/* Billing history */}
              <div className="card p-6">
                <h2 className="text-lg font-bold text-slate-900 mb-4">Historial de pagos</h2>
                <div className="space-y-2">
                  {BILLING_HISTORY.map((b, i) => (
                    <div key={i} className="flex items-center justify-between py-3 border-b border-slate-100 last:border-0">
                      <div>
                        <p className="text-sm font-medium text-slate-800">{b.plan}</p>
                        <p className="text-xs text-slate-400">{b.date}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-bold text-slate-900">{b.amount}</span>
                        <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-medium">{b.status}</span>
                        <button className="text-slate-400 hover:text-slate-600">
                          <ExternalLink className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ===== INTEGRACIONES ===== */}
          {activeTab === 'integraciones' && (
            <div className="card overflow-hidden">
              <div className="px-5 py-4 border-b border-slate-100">
                <h2 className="text-lg font-bold text-slate-900">Integraciones</h2>
                <p className="text-sm text-slate-500 mt-0.5">Conecta NegocioSmart con tus herramientas favoritas</p>
              </div>
              <div className="divide-y divide-slate-100">
                {INTEGRATIONS.map((intg) => {
                  const Icon = intg.icon
                  const connected = integrations[intg.id]
                  return (
                    <div key={intg.id} className="flex items-center gap-4 px-5 py-4">
                      <div className={`p-3 rounded-xl flex-shrink-0 ${intg.color}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-slate-800">{intg.name}</p>
                        <p className="text-xs text-slate-500 mt-0.5">{intg.desc}</p>
                      </div>
                      <button
                        onClick={() => setIntegrations((prev) => ({ ...prev, [intg.id]: !prev[intg.id] }))}
                        className={`flex-shrink-0 text-sm px-4 py-2 rounded-xl font-semibold transition-all duration-150 ${
                          connected
                            ? 'bg-emerald-100 text-emerald-700 hover:bg-red-100 hover:text-red-600'
                            : 'bg-brand-600 text-white hover:bg-brand-700'
                        }`}
                      >
                        {connected ? (
                          <span className="flex items-center gap-1.5">
                            <Check className="w-3.5 h-3.5" />
                            Conectado
                          </span>
                        ) : (
                          'Conectar'
                        )}
                      </button>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* ===== NOTIFICACIONES ===== */}
          {activeTab === 'notificaciones' && (
            <div className="card p-6 space-y-6">
              <h2 className="text-lg font-bold text-slate-900">Preferencias de notificaciones</h2>

              {/* Email notifications */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="p-1.5 rounded-lg bg-brand-50">
                    <Globe className="w-4 h-4 text-brand-600" />
                  </div>
                  <h3 className="text-sm font-bold text-slate-700">Notificaciones por email</h3>
                </div>
                <div className="space-y-3 pl-8">
                  {[
                    { key: 'emailNuevaVenta', label: 'Nueva venta realizada', desc: 'Recibe un email cuando se complete una venta' },
                    { key: 'emailNuevoCliente', label: 'Nuevo cliente registrado', desc: 'Cuando un cliente se registra en tu tienda' },
                    { key: 'emailNuevoLead', label: 'Nuevo lead capturado', desc: 'Cuando el chatbot captura un nuevo lead' },
                    { key: 'emailReportesSemanal', label: 'Reportes semanales', desc: 'Resumen de métricas cada lunes' },
                  ].map((n) => (
                    <div key={n.key} className="flex items-center justify-between py-2">
                      <div>
                        <p className="text-sm font-medium text-slate-800">{n.label}</p>
                        <p className="text-xs text-slate-400">{n.desc}</p>
                      </div>
                      <ToggleSwitch
                        value={notifications[n.key as keyof typeof notifications]}
                        onChange={(v) => setNotifications((prev) => ({ ...prev, [n.key]: v }))}
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t border-slate-100" />

              {/* WhatsApp notifications */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="p-1.5 rounded-lg bg-emerald-50">
                    <MessageCircle className="w-4 h-4 text-emerald-600" />
                  </div>
                  <h3 className="text-sm font-bold text-slate-700">Alertas de WhatsApp</h3>
                </div>
                <div className="space-y-3 pl-8">
                  {[
                    { key: 'whatsappAlertaStock', label: 'Alerta de stock bajo', desc: 'Cuando un producto cae por debajo del mínimo' },
                    { key: 'whatsappNuevaVenta', label: 'Nueva venta', desc: 'Recibe un mensaje por cada venta confirmada' },
                  ].map((n) => (
                    <div key={n.key} className="flex items-center justify-between py-2">
                      <div>
                        <p className="text-sm font-medium text-slate-800">{n.label}</p>
                        <p className="text-xs text-slate-400">{n.desc}</p>
                      </div>
                      <ToggleSwitch
                        value={notifications[n.key as keyof typeof notifications]}
                        onChange={(v) => setNotifications((prev) => ({ ...prev, [n.key]: v }))}
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t border-slate-100" />

              {/* Reports */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="p-1.5 rounded-lg bg-accent-50">
                    <Bell className="w-4 h-4 text-accent-600" />
                  </div>
                  <h3 className="text-sm font-bold text-slate-700">Reportes automáticos</h3>
                </div>
                <div className="space-y-3 pl-8">
                  {[
                    { key: 'reporteSemanal', label: 'Reporte semanal', desc: 'Resumen del rendimiento de la semana' },
                    { key: 'reporteMensual', label: 'Reporte mensual', desc: 'Análisis detallado del mes' },
                  ].map((n) => (
                    <div key={n.key} className="flex items-center justify-between py-2">
                      <div>
                        <p className="text-sm font-medium text-slate-800">{n.label}</p>
                        <p className="text-xs text-slate-400">{n.desc}</p>
                      </div>
                      <ToggleSwitch
                        value={notifications[n.key as keyof typeof notifications]}
                        onChange={(v) => setNotifications((prev) => ({ ...prev, [n.key]: v }))}
                      />
                    </div>
                  ))}
                </div>
              </div>

              <button onClick={() => showSaved('Preferencias guardadas')} className="btn-primary gap-2">
                <Check className="w-4 h-4" />
                Guardar preferencias
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
