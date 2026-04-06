'use client'

import { useState } from 'react'
import {
  TrendingUp,
  Users,
  Bot,
  ShoppingBag,
  Download,
  FileText,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react'

const DATE_RANGES = ['7d', '30d', '90d', 'Personalizado']

// Revenue data for bar chart (simulated)
const REVENUE_DATA_30D = [
  { label: '1 Mar', value: 12400, prev: 10200 },
  { label: '5 Mar', value: 18700, prev: 14500 },
  { label: '10 Mar', value: 15200, prev: 16800 },
  { label: '15 Mar', value: 22100, prev: 17300 },
  { label: '20 Mar', value: 19800, prev: 15900 },
  { label: '25 Mar', value: 28500, prev: 20100 },
  { label: '30 Mar', value: 31200, prev: 24600 },
]

const REVENUE_DATA_7D = [
  { label: 'Lun', value: 8200, prev: 6100 },
  { label: 'Mar', value: 11400, prev: 9800 },
  { label: 'Mié', value: 9700, prev: 8200 },
  { label: 'Jue', value: 14100, prev: 10500 },
  { label: 'Vie', value: 18600, prev: 15200 },
  { label: 'Sáb', value: 22300, prev: 19100 },
  { label: 'Dom', value: 16800, prev: 13400 },
]

const TOP_PRODUCTS = [
  { name: 'Blusa Floral Manga Larga', revenue: 45600, units: 102, trend: 12 },
  { name: 'Vestido Casual Verano', revenue: 38200, units: 67, trend: 8 },
  { name: 'Chamarra de Mezclilla', revenue: 31500, units: 28, trend: -3 },
  { name: 'Jeans Skinny Azul Claro', revenue: 28900, units: 37, trend: 22 },
  { name: 'Maxi Vestido Bohemio', revenue: 21700, units: 30, trend: 5 },
]

const TRAFFIC_SOURCES = [
  { label: 'Directo', value: 45, color: '#7c3aed' },
  { label: 'WhatsApp', value: 30, color: '#10b981' },
  { label: 'Instagram', value: 15, color: '#ec4899' },
  { label: 'Google', value: 10, color: '#2563eb' },
]

const FUNNEL_STEPS = [
  { label: 'Visitantes', value: 12840, pct: 100, color: 'bg-brand-500' },
  { label: 'Leads capturados', value: 3420, pct: 27, color: 'bg-accent-500' },
  { label: 'Prueba gratis', value: 896, pct: 7, color: 'bg-emerald-500' },
  { label: 'Clientes pagos', value: 234, pct: 2, color: 'bg-amber-500' },
]

export default function AnalyticsPage() {
  const [dateRange, setDateRange] = useState('30d')

  const data = dateRange === '7d' ? REVENUE_DATA_7D : REVENUE_DATA_30D
  const maxValue = Math.max(...data.map((d) => d.value))

  const totalRevenue = data.reduce((s, d) => s + d.value, 0)
  const prevRevenue = data.reduce((s, d) => s + d.prev, 0)
  const revenueGrowth = Math.round(((totalRevenue - prevRevenue) / prevRevenue) * 100)

  const metrics = [
    {
      label: 'Ingresos totales',
      value: `$${totalRevenue.toLocaleString()} MXN`,
      change: `+${revenueGrowth}%`,
      positive: true,
      icon: TrendingUp,
      color: 'text-brand-600 bg-brand-50',
    },
    {
      label: 'Clientes nuevos',
      value: '247',
      change: '+18%',
      positive: true,
      icon: Users,
      color: 'text-emerald-600 bg-emerald-50',
    },
    {
      label: 'Conversión chatbot',
      value: '34.2%',
      change: '+5.1%',
      positive: true,
      icon: Bot,
      color: 'text-accent-600 bg-accent-50',
    },
    {
      label: 'Ticket promedio',
      value: '$1,840 MXN',
      change: '-2.3%',
      positive: false,
      icon: ShoppingBag,
      color: 'text-amber-600 bg-amber-50',
    },
  ]

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Analytics y Reportes</h1>
          <p className="text-slate-500 text-sm mt-0.5">Mide el rendimiento de tu negocio</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {/* Date range */}
          <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-xl p-1 shadow-sm">
            {DATE_RANGES.map((r) => (
              <button
                key={r}
                onClick={() => setDateRange(r)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                  dateRange === r ? 'bg-brand-600 text-white shadow-sm' : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                {r === 'Personalizado' ? <Calendar className="w-4 h-4" /> : r}
              </button>
            ))}
          </div>
          <button className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 text-sm text-slate-700 font-medium hover:bg-slate-50 transition-colors">
            <Download className="w-4 h-4" />
            CSV
          </button>
          <button className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 text-sm text-slate-700 font-medium hover:bg-slate-50 transition-colors">
            <FileText className="w-4 h-4" />
            PDF
          </button>
        </div>
      </div>

      {/* Key metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((m) => {
          const Icon = m.icon
          return (
            <div key={m.label} className="card p-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs text-slate-500">{m.label}</p>
                <div className={`p-2 rounded-lg ${m.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <p className="text-xl font-bold text-slate-900">{m.value}</p>
              <div className={`flex items-center gap-1 mt-1 text-xs font-medium ${m.positive ? 'text-emerald-600' : 'text-red-500'}`}>
                {m.positive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                {m.change} vs período anterior
              </div>
            </div>
          )
        })}
      </div>

      {/* Revenue chart */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-base font-bold text-slate-900">Ingresos por período</h2>
          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded bg-brand-500" />
              <span className="text-slate-500">Período actual</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded bg-slate-200" />
              <span className="text-slate-500">Período anterior</span>
            </div>
          </div>
        </div>
        <div className="flex items-end gap-2 h-48">
          {data.map((d, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-1 group">
              <div className="w-full flex items-end gap-0.5 h-40">
                {/* Previous bar */}
                <div
                  className="flex-1 rounded-t-sm bg-slate-200 transition-all duration-300 group-hover:bg-slate-300"
                  style={{ height: `${(d.prev / maxValue) * 100}%` }}
                />
                {/* Current bar */}
                <div
                  className="flex-1 rounded-t-md bg-brand-500 transition-all duration-300 group-hover:bg-brand-600"
                  style={{ height: `${(d.value / maxValue) * 100}%` }}
                />
              </div>
              <span className="text-[10px] text-slate-400 whitespace-nowrap">{d.label}</span>
              {/* Tooltip on hover */}
              <div className="hidden group-hover:block absolute -translate-y-12 bg-slate-900 text-white text-xs px-2 py-1 rounded-lg whitespace-nowrap z-10 pointer-events-none">
                ${d.value.toLocaleString()} MXN
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top products */}
        <div className="lg:col-span-2 card p-5">
          <h2 className="text-base font-bold text-slate-900 mb-4">Top 5 productos por ingresos</h2>
          <div className="space-y-3">
            {TOP_PRODUCTS.map((p, i) => (
              <div key={p.name} className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-brand-100 flex items-center justify-center text-xs font-bold text-brand-700 flex-shrink-0">
                  {i + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm font-medium text-slate-800 truncate">{p.name}</p>
                    <div className={`flex items-center gap-0.5 text-xs font-semibold ml-2 flex-shrink-0 ${p.trend >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                      {p.trend >= 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                      {Math.abs(p.trend)}%
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-brand-500 rounded-full"
                        style={{ width: `${(p.revenue / TOP_PRODUCTS[0].revenue) * 100}%` }}
                      />
                    </div>
                    <span className="text-xs text-slate-500 whitespace-nowrap">${p.revenue.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Traffic sources */}
        <div className="card p-5">
          <h2 className="text-base font-bold text-slate-900 mb-4">Fuentes de tráfico</h2>
          <div className="space-y-3">
            {TRAFFIC_SOURCES.map((s) => (
              <div key={s.label}>
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="text-slate-600 font-medium">{s.label}</span>
                  <span className="font-bold text-slate-900">{s.value}%</span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${s.value}%`, backgroundColor: s.color }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Donut-like visualization */}
          <div className="mt-5 pt-5 border-t border-slate-100">
            <div className="flex flex-wrap gap-2">
              {TRAFFIC_SOURCES.map((s) => (
                <div key={s.label} className="flex items-center gap-1.5 text-xs text-slate-500">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: s.color }} />
                  {s.label}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Conversion funnel */}
      <div className="card p-6">
        <h2 className="text-base font-bold text-slate-900 mb-5">Embudo de conversión</h2>
        <div className="space-y-3">
          {FUNNEL_STEPS.map((step, i) => (
            <div key={step.label} className="flex items-center gap-4">
              <div className="w-36 text-right">
                <span className="text-sm font-medium text-slate-700">{step.label}</span>
              </div>
              <div className="flex-1 relative">
                <div className="h-9 bg-slate-100 rounded-xl overflow-hidden">
                  <div
                    className={`h-full ${step.color} rounded-xl flex items-center px-3 transition-all duration-700`}
                    style={{ width: `${Math.max(step.pct, 4)}%` }}
                  >
                    {step.pct > 10 && (
                      <span className="text-xs font-bold text-white">{step.pct}%</span>
                    )}
                  </div>
                </div>
              </div>
              <div className="w-24 text-right">
                <span className="text-sm font-bold text-slate-900">{step.value.toLocaleString()}</span>
                {step.pct <= 10 && (
                  <span className="text-xs text-slate-400 ml-1">{step.pct}%</span>
                )}
              </div>
              {i < FUNNEL_STEPS.length - 1 && (
                <div className="absolute left-36 mt-9 text-xs text-slate-400">
                  ↓
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
