'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Eye, EyeOff, Zap, Check, ChevronRight } from 'lucide-react'

const COUNTRIES = [
  { code: 'MX', name: 'México', flag: '🇲🇽' },
  { code: 'CO', name: 'Colombia', flag: '🇨🇴' },
  { code: 'AR', name: 'Argentina', flag: '🇦🇷' },
  { code: 'PE', name: 'Perú', flag: '🇵🇪' },
  { code: 'CL', name: 'Chile', flag: '🇨🇱' },
  { code: 'EC', name: 'Ecuador', flag: '🇪🇨' },
  { code: 'VE', name: 'Venezuela', flag: '🇻🇪' },
  { code: 'BO', name: 'Bolivia', flag: '🇧🇴' },
  { code: 'PY', name: 'Paraguay', flag: '🇵🇾' },
  { code: 'UY', name: 'Uruguay', flag: '🇺🇾' },
  { code: 'GT', name: 'Guatemala', flag: '🇬🇹' },
  { code: 'CR', name: 'Costa Rica', flag: '🇨🇷' },
]

const PLANS = [
  {
    id: 'starter',
    name: 'Starter',
    price: 'Gratis 14 días',
    description: 'Para negocios pequeños',
    features: ['Hasta 500 clientes', '1 usuario', 'Chatbot básico'],
  },
  {
    id: 'pro',
    name: 'Pro',
    price: '$299 MXN/mes',
    description: 'Para negocios en crecimiento',
    features: ['Clientes ilimitados', '5 usuarios', 'Chatbot IA avanzado', 'Marketing automation'],
    recommended: true,
  },
  {
    id: 'business',
    name: 'Business',
    price: '$699 MXN/mes',
    description: 'Para empresas establecidas',
    features: ['Todo lo de Pro', 'Usuarios ilimitados', 'API access', 'Soporte prioritario'],
  },
]

interface FormData {
  email: string
  password: string
  confirmPassword: string
  businessName: string
  country: string
  plan: string
}

export default function RegisterPage() {
  const [step, setStep] = useState(1)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Partial<FormData>>({})
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: '',
    confirmPassword: '',
    businessName: '',
    country: '',
    plan: 'pro',
  })

  const update = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    setErrors((prev) => ({ ...prev, [field]: '' }))
  }

  const validateStep1 = () => {
    const newErrors: Partial<FormData> = {}
    if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Ingresa un correo válido'
    }
    if (!formData.password || formData.password.length < 8) {
      newErrors.password = 'La contraseña debe tener al menos 8 caracteres'
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden'
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const validateStep2 = () => {
    const newErrors: Partial<FormData> = {}
    if (!formData.businessName.trim()) newErrors.businessName = 'El nombre del negocio es requerido'
    if (!formData.country) newErrors.country = 'Selecciona un país'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = () => {
    if (validateStep1()) setStep(2)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateStep2()) return
    setLoading(true)
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error || 'Error al registrarse')
      }
      const data = await res.json()
      if (data.token) {
        localStorage.setItem('ns_token', data.token)
        window.location.href = '/dashboard'
      }
    } catch (err: any) {
      setErrors({ email: err.message })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-brand-900 via-brand-700 to-accent-700 py-12 px-4">
      {/* Background blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-accent-500/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-brand-400/20 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-lg">
        {/* Logo */}
        <div className="text-center mb-6">
          <Link href="/" className="inline-flex items-center gap-2 mb-2">
            <div className="w-9 h-9 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-white">NegocioSmart</span>
          </Link>
        </div>

        {/* Card */}
        <div className="glass rounded-2xl p-8 shadow-2xl border border-white/20">
          {/* Progress */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <h1 className="text-xl font-bold text-white">
                {step === 1 ? 'Crea tu cuenta' : 'Tu negocio'}
              </h1>
              <span className="text-brand-200 text-sm">Paso {step} de 2</span>
            </div>
            <div className="flex gap-2">
              <div className="h-1.5 flex-1 rounded-full bg-white transition-all duration-300" />
              <div
                className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                  step === 2 ? 'bg-white' : 'bg-white/20'
                }`}
              />
            </div>
          </div>

          {step === 1 ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-brand-100 mb-1.5">
                  Correo electrónico
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => update('email', e.target.value)}
                  placeholder="tu@empresa.com"
                  className={`w-full px-4 py-3 rounded-xl border bg-white/10 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-white/40 focus:border-transparent transition-all duration-150 backdrop-blur-sm ${
                    errors.email ? 'border-red-400' : 'border-white/20'
                  }`}
                />
                {errors.email && (
                  <p className="mt-1 text-xs text-red-300">{errors.email}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-brand-100 mb-1.5">
                  Contraseña
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={(e) => update('password', e.target.value)}
                    placeholder="Mínimo 8 caracteres"
                    className={`w-full px-4 py-3 pr-12 rounded-xl border bg-white/10 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-white/40 focus:border-transparent transition-all duration-150 backdrop-blur-sm ${
                      errors.password ? 'border-red-400' : 'border-white/20'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1 text-xs text-red-300">{errors.password}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-brand-100 mb-1.5">
                  Confirmar contraseña
                </label>
                <div className="relative">
                  <input
                    type={showConfirm ? 'text' : 'password'}
                    value={formData.confirmPassword}
                    onChange={(e) => update('confirmPassword', e.target.value)}
                    placeholder="Repite tu contraseña"
                    className={`w-full px-4 py-3 pr-12 rounded-xl border bg-white/10 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-white/40 focus:border-transparent transition-all duration-150 backdrop-blur-sm ${
                      errors.confirmPassword ? 'border-red-400' : 'border-white/20'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-colors"
                  >
                    {showConfirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="mt-1 text-xs text-red-300">{errors.confirmPassword}</p>
                )}
              </div>

              {/* Password strength indicator */}
              {formData.password && (
                <div className="space-y-1">
                  {[
                    { label: 'Al menos 8 caracteres', valid: formData.password.length >= 8 },
                    { label: 'Contiene un número', valid: /\d/.test(formData.password) },
                    { label: 'Contiene una mayúscula', valid: /[A-Z]/.test(formData.password) },
                  ].map((rule) => (
                    <div key={rule.label} className="flex items-center gap-2 text-xs">
                      <div
                        className={`w-4 h-4 rounded-full flex items-center justify-center transition-colors ${
                          rule.valid ? 'bg-emerald-400' : 'bg-white/20'
                        }`}
                      >
                        {rule.valid && <Check className="w-2.5 h-2.5 text-white" />}
                      </div>
                      <span className={rule.valid ? 'text-emerald-300' : 'text-white/50'}>
                        {rule.label}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              <button
                type="button"
                onClick={handleNext}
                className="w-full py-3 px-6 rounded-xl font-semibold text-brand-900 bg-white hover:bg-brand-50 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center gap-2 mt-2"
              >
                Continuar
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-brand-100 mb-1.5">
                  Nombre de tu negocio
                </label>
                <input
                  type="text"
                  value={formData.businessName}
                  onChange={(e) => update('businessName', e.target.value)}
                  placeholder="Ej: Boutique Moda Latina"
                  className={`w-full px-4 py-3 rounded-xl border bg-white/10 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-white/40 focus:border-transparent transition-all duration-150 backdrop-blur-sm ${
                    errors.businessName ? 'border-red-400' : 'border-white/20'
                  }`}
                />
                {errors.businessName && (
                  <p className="mt-1 text-xs text-red-300">{errors.businessName}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-brand-100 mb-1.5">País</label>
                <select
                  value={formData.country}
                  onChange={(e) => update('country', e.target.value)}
                  className={`w-full px-4 py-3 rounded-xl border bg-white/10 text-white focus:outline-none focus:ring-2 focus:ring-white/40 focus:border-transparent transition-all duration-150 backdrop-blur-sm appearance-none ${
                    errors.country ? 'border-red-400' : 'border-white/20'
                  }`}
                >
                  <option value="" className="text-slate-900">Selecciona tu país</option>
                  {COUNTRIES.map((c) => (
                    <option key={c.code} value={c.code} className="text-slate-900">
                      {c.flag} {c.name}
                    </option>
                  ))}
                </select>
                {errors.country && (
                  <p className="mt-1 text-xs text-red-300">{errors.country}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-brand-100 mb-2">
                  Elige tu plan
                </label>
                <div className="space-y-2">
                  {PLANS.map((plan) => (
                    <label
                      key={plan.id}
                      className={`block relative cursor-pointer rounded-xl border p-3 transition-all duration-150 ${
                        formData.plan === plan.id
                          ? 'border-white bg-white/20'
                          : 'border-white/20 bg-white/5 hover:bg-white/10'
                      }`}
                    >
                      <input
                        type="radio"
                        name="plan"
                        value={plan.id}
                        checked={formData.plan === plan.id}
                        onChange={(e) => update('plan', e.target.value)}
                        className="sr-only"
                      />
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-semibold text-white">{plan.name}</span>
                            {plan.recommended && (
                              <span className="text-xs bg-accent-500 text-white px-2 py-0.5 rounded-full font-medium">
                                Recomendado
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-brand-200 mt-0.5">{plan.description}</p>
                        </div>
                        <span className="text-xs font-semibold text-brand-100 whitespace-nowrap ml-2">
                          {plan.price}
                        </span>
                      </div>
                      {formData.plan === plan.id && (
                        <div className="mt-2 flex flex-wrap gap-1">
                          {plan.features.map((f) => (
                            <span key={f} className="text-xs text-emerald-300 flex items-center gap-1">
                              <Check className="w-3 h-3" />
                              {f}
                            </span>
                          ))}
                        </div>
                      )}
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="flex-1 py-3 px-6 rounded-xl font-semibold text-white border border-white/30 hover:bg-white/10 transition-all duration-200"
                >
                  Atrás
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-3 px-6 rounded-xl font-semibold text-brand-900 bg-white hover:bg-brand-50 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <div className="w-4 h-4 border-2 border-brand-600/30 border-t-brand-600 rounded-full animate-spin" />
                  ) : (
                    'Comenzar 14 días gratis'
                  )}
                </button>
              </div>
            </form>
          )}

          <p className="mt-5 text-center text-xs text-brand-300">
            Sin tarjeta de crédito • Cancela cuando quieras
          </p>
        </div>

        <p className="mt-4 text-center text-sm text-brand-200">
          ¿Ya tienes cuenta?{' '}
          <Link href="/login" className="text-white font-semibold hover:underline">
            Iniciar sesión
          </Link>
        </p>
      </div>
    </div>
  )
}
