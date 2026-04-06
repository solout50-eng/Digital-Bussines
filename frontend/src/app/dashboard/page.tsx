'use client'

import { useState } from 'react'
import {
  BarChart3,
  TrendingUp,
  Users,
  FileText,
  Package,
  Bot,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  Bell,
  Settings,
  LogOut,
  Zap,
  ShoppingCart,
  MessageSquare,
  ChevronRight,
} from 'lucide-react'

const metrics = [
  {
    label: 'Ingresos del mes',
    value: '$84,250',
    change: '+12.5%',
    positive: true,
    icon: DollarSign,
    color: 'from-emerald-500 to-teal-500',
    bg: 'bg-emerald-50',
  },
  {
    label: 'Clientes activos',
    value: '1,248',
    change: '+8.3%',
    positive: true,
    icon: Users,
    color: 'from-brand-500 to-accent-500',
    bg: 'bg-brand-50',
  },
  {
    label: 'Facturas emitidas',
    value: '347',
    change: '+24.1%',
    positive: true,
    icon: FileText,
    color: 'from-blue-500 to-cyan-500',
    bg: 'bg-blue-50',
  },
  {
    label: 'Conversaciones IA',
    value: '2,891',
    change: '+31.7%',
    positive: true,
    icon: Bot,
    color: 'from-violet-500 to-purple-500',
    bg: 'bg-violet-50',
  },
]

const recentActivity = [
  { type: 'sale', text: 'Nueva venta: Juan Pérez — $1,250 MXN', time: 'hace 5 min', icon: ShoppingCart },
  { type: 'invoice', text: 'Factura #F-1283 emitida a Distribuidora López', time: 'hace 12 min', icon: FileText },
  { type: 'chat', text: 'Chatbot cerró venta: María García — Plan Pro', time: 'hace 23 min', icon: MessageSquare },
  { type: 'alert', text: 'Stock bajo: Producto "Camiseta Talla M" — 3 unidades', time: 'hace 1 hora', icon: Package },
  { type: 'sale', text: 'Nueva venta: Roberto Sánchez — $3,400 MXN', time: 'hace 2 horas', icon: ShoppingCart },
]

const topProducts = [
  { name: 'Camiseta Premium', sold: 124, revenue: '$18,600', trend: '+15%' },
  { name: 'Pantalón Cargo', sold: 89, revenue: '$13,350', trend: '+8%' },
  { name: 'Sudadera Logo', sold: 76, revenue: '$11,400', trend: '+22%' },
  { name: 'Vestido Verano', sold: 63, revenue: '$9,450', trend: '-3%' },
  { name: 'Shorts Deportivos', sold: 54, revenue: '$8,100', trend: '+11%' },
]

const navItems = [
  { icon: BarChart3, label: 'Dashboard', active: true },
  { icon: Users, label: 'Clientes', active: false },
  { icon: FileText, label: 'Facturación', active: false },
  { icon: Package, label: 'Inventario', active: false },
  { icon: Bot, label: 'Asistente IA', active: false },
  { icon: TrendingUp, label: 'Marketing', active: false },
  { icon: Settings, label: 'Configuración', active: false },
]

export default function DashboardPage() {
  const [activeNav, setActiveNav] = useState('Dashboard')

  return (
    <div className="flex h-screen bg-slate-100 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-xl flex flex-col shrink-0">
        {/* Logo */}
        <div className="flex items-center gap-2 px-6 py-5 border-b border-slate-100">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-600 to-accent-600 flex items-center justify-center shadow">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold text-slate-900">NegocioSmart</span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map((item) => (
            <button
              key={item.label}
              onClick={() => setActiveNav(item.label)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                activeNav === item.label
                  ? 'bg-gradient-to-r from-brand-600 to-accent-600 text-white shadow-md'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <item.icon className="w-5 h-5 shrink-0" />
              {item.label}
            </button>
          ))}
        </nav>

        {/* User */}
        <div className="p-4 border-t border-slate-100">
          <div className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-slate-100 cursor-pointer group">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-brand-400 to-accent-400 flex items-center justify-center text-white font-bold text-sm shrink-0">
              MG
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold text-slate-900 truncate">Mi Negocio</div>
              <div className="text-xs text-slate-500 truncate">Plan Pro</div>
            </div>
            <LogOut className="w-4 h-4 text-slate-400 group-hover:text-slate-700 shrink-0" />
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        {/* Top bar */}
        <header className="bg-white border-b border-slate-200 px-8 py-4 flex items-center justify-between sticky top-0 z-10">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
            <p className="text-sm text-slate-500">Bienvenido de vuelta. Aquí está el resumen de hoy.</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="relative p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 transition-colors text-slate-600">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
            </button>
            <button className="flex items-center gap-2 bg-gradient-to-r from-brand-600 to-accent-600 text-white px-4 py-2 rounded-xl text-sm font-semibold shadow hover:shadow-md transition-all">
              <Bot className="w-4 h-4" />
              Asistente IA
            </button>
          </div>
        </header>

        <div className="p-8 space-y-8">
          {/* Metrics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
            {metrics.map((metric) => (
              <div key={metric.label} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${metric.color} flex items-center justify-center shadow`}>
                    <metric.icon className="w-5 h-5 text-white" />
                  </div>
                  <span className={`flex items-center gap-1 text-sm font-semibold ${metric.positive ? 'text-emerald-600' : 'text-red-500'}`}>
                    {metric.positive ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                    {metric.change}
                  </span>
                </div>
                <div className="text-2xl font-black text-slate-900 mb-1">{metric.value}</div>
                <div className="text-sm text-slate-500">{metric.label}</div>
              </div>
            ))}
          </div>

          {/* Charts & Activity Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Revenue Chart Placeholder */}
            <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="font-bold text-slate-900">Ingresos — últimos 7 días</h3>
                  <p className="text-sm text-slate-500">$84,250 MXN en el período</p>
                </div>
                <div className="flex gap-2">
                  {['7d', '30d', '90d'].map((p) => (
                    <button key={p} className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${p === '7d' ? 'bg-brand-600 text-white' : 'text-slate-500 hover:bg-slate-100'}`}>
                      {p}
                    </button>
                  ))}
                </div>
              </div>
              {/* Simple bar chart visualization */}
              <div className="flex items-end gap-2 h-40">
                {[65, 82, 45, 90, 75, 88, 95].map((h, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1">
                    <div
                      className="w-full rounded-t-lg bg-gradient-to-t from-brand-600 to-accent-400 transition-all hover:opacity-80"
                      style={{ height: `${h}%` }}
                    />
                    <span className="text-xs text-slate-400">
                      {['L', 'M', 'X', 'J', 'V', 'S', 'D'][i]}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Activity Feed */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
              <h3 className="font-bold text-slate-900 mb-4">Actividad reciente</h3>
              <div className="space-y-4">
                {recentActivity.map((item, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center shrink-0">
                      <item.icon className="w-4 h-4 text-slate-600" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm text-slate-700 leading-tight">{item.text}</p>
                      <p className="text-xs text-slate-400 mt-0.5">{item.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Top Products */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-slate-900">Productos más vendidos</h3>
              <button className="flex items-center gap-1 text-brand-600 text-sm font-semibold hover:gap-2 transition-all">
                Ver todos <ChevronRight className="w-4 h-4" />
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-100">
                    <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider pb-3">Producto</th>
                    <th className="text-right text-xs font-semibold text-slate-500 uppercase tracking-wider pb-3">Vendidos</th>
                    <th className="text-right text-xs font-semibold text-slate-500 uppercase tracking-wider pb-3">Ingresos</th>
                    <th className="text-right text-xs font-semibold text-slate-500 uppercase tracking-wider pb-3">Tendencia</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {topProducts.map((product, index) => (
                    <tr key={index} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3 pr-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-100 to-accent-100 flex items-center justify-center text-brand-700 font-bold text-xs">
                            {index + 1}
                          </div>
                          <span className="text-sm font-medium text-slate-900">{product.name}</span>
                        </div>
                      </td>
                      <td className="py-3 text-right text-sm text-slate-600">{product.sold}</td>
                      <td className="py-3 text-right text-sm font-semibold text-slate-900">{product.revenue}</td>
                      <td className="py-3 text-right">
                        <span className={`text-xs font-semibold ${product.trend.startsWith('+') ? 'text-emerald-600' : 'text-red-500'}`}>
                          {product.trend}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
