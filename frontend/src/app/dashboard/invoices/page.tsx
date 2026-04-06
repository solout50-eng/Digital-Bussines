'use client'

import { useState } from 'react'
import {
  Plus,
  Download,
  Send,
  FileText,
  Clock,
  CheckCircle,
  AlertCircle,
  DollarSign,
  Search,
} from 'lucide-react'

type InvoiceStatus = 'pagada' | 'pendiente' | 'vencida' | 'borrador'

interface Invoice {
  id: string
  number: string
  client: string
  date: string
  dueDate: string
  total: number
  currency: string
  status: InvoiceStatus
}

const MOCK_INVOICES: Invoice[] = [
  { id: '1', number: 'FAC-2024-001', client: 'María González', date: '01/03/2024', dueDate: '31/03/2024', total: 12500, currency: 'MXN', status: 'pagada' },
  { id: '2', number: 'FAC-2024-002', client: 'Andrés López', date: '05/03/2024', dueDate: '04/04/2024', total: 856000, currency: 'COP', status: 'pendiente' },
  { id: '3', number: 'FAC-2024-003', client: 'Ana Martínez', date: '10/02/2024', dueDate: '11/03/2024', total: 22000, currency: 'MXN', status: 'vencida' },
  { id: '4', number: 'FAC-2024-004', client: 'Luis Sánchez', date: '15/03/2024', dueDate: '14/04/2024', total: 31000, currency: 'MXN', status: 'borrador' },
  { id: '5', number: 'FAC-2024-005', client: 'Roberto Jiménez', date: '18/03/2024', dueDate: '17/04/2024', total: 18700, currency: 'MXN', status: 'enviada' as any },
  { id: '6', number: 'FAC-2024-006', client: 'Valentina Torres', date: '20/02/2024', dueDate: '21/03/2024', total: 145000, currency: 'ARS', status: 'vencida' },
  { id: '7', number: 'FAC-2024-007', client: 'Carlos Rodríguez', date: '22/03/2024', dueDate: '21/04/2024', total: 420000, currency: 'COP', status: 'pendiente' },
  { id: '8', number: 'FAC-2024-008', client: 'Sofía Ramírez', date: '25/03/2024', dueDate: '24/04/2024', total: 9400, currency: 'MXN', status: 'pagada' },
]

const STATUS_CONFIG: Record<string, { label: string; classes: string; icon: any }> = {
  pagada: { label: 'Pagada', classes: 'bg-emerald-100 text-emerald-700', icon: CheckCircle },
  pendiente: { label: 'Pendiente', classes: 'bg-amber-100 text-amber-700', icon: Clock },
  vencida: { label: 'Vencida', classes: 'bg-red-100 text-red-700', icon: AlertCircle },
  borrador: { label: 'Borrador', classes: 'bg-slate-100 text-slate-600', icon: FileText },
  enviada: { label: 'Enviada', classes: 'bg-accent-100 text-accent-700', icon: Send },
}

const FILTERS = ['Todas', 'Borrador', 'Enviadas', 'Pagadas', 'Vencidas']

export default function InvoicesPage() {
  const [activeFilter, setActiveFilter] = useState('Todas')
  const [search, setSearch] = useState('')

  const filtered = MOCK_INVOICES.filter((inv) => {
    const matchFilter =
      activeFilter === 'Todas' ||
      (activeFilter === 'Borrador' && inv.status === 'borrador') ||
      (activeFilter === 'Enviadas' && inv.status === ('enviada' as any)) ||
      (activeFilter === 'Pagadas' && inv.status === 'pagada') ||
      (activeFilter === 'Vencidas' && inv.status === 'vencida')
    const matchSearch =
      !search ||
      inv.client.toLowerCase().includes(search.toLowerCase()) ||
      inv.number.toLowerCase().includes(search.toLowerCase())
    return matchFilter && matchSearch
  })

  const facturadoMes = MOCK_INVOICES.filter((i) => i.status === 'pagada' && i.currency === 'MXN').reduce((s, i) => s + i.total, 0)
  const pendiente = MOCK_INVOICES.filter((i) => i.status === 'pendiente' && i.currency === 'MXN').reduce((s, i) => s + i.total, 0)
  const pagadas = MOCK_INVOICES.filter((i) => i.status === 'pagada').length
  const vencidas = MOCK_INVOICES.filter((i) => i.status === 'vencida').length

  const stats = [
    { label: 'Facturado este mes', value: `$${facturadoMes.toLocaleString()} MXN`, icon: DollarSign, color: 'text-emerald-600 bg-emerald-50', sub: '+12% vs mes anterior' },
    { label: 'Pendiente de cobro', value: `$${pendiente.toLocaleString()} MXN`, icon: Clock, color: 'text-amber-600 bg-amber-50', sub: `${MOCK_INVOICES.filter(i => i.status === 'pendiente').length} facturas` },
    { label: 'Pagadas', value: pagadas.toString(), icon: CheckCircle, color: 'text-brand-600 bg-brand-50', sub: 'Este mes' },
    { label: 'Vencidas', value: vencidas.toString(), icon: AlertCircle, color: 'text-red-600 bg-red-50', sub: 'Requieren atención' },
  ]

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Facturación</h1>
          <p className="text-slate-500 text-sm mt-0.5">Gestiona tus facturas y cobros</p>
        </div>
        <button className="btn-primary gap-2">
          <Plus className="w-4 h-4" />
          Nueva factura
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
              <p className="text-xl font-bold text-slate-900">{s.value}</p>
              <p className="text-xs text-slate-400 mt-1">{s.sub}</p>
            </div>
          )
        })}
      </div>

      {/* Filters & search */}
      <div className="card p-4 space-y-3">
        <div className="flex gap-3 flex-wrap items-center">
          <div className="relative flex-1 min-w-48">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por cliente o número..."
              className="input-field pl-9"
            />
          </div>
        </div>
        <div className="flex gap-2 flex-wrap">
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`text-sm px-4 py-1.5 rounded-lg font-medium transition-all duration-150 ${
                activeFilter === f
                  ? 'bg-brand-600 text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
            <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mb-4">
              <FileText className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-700 mb-1">Sin facturas</h3>
            <p className="text-slate-400 text-sm">No hay facturas con los filtros seleccionados.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-4 py-3">Número</th>
                  <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-4 py-3">Cliente</th>
                  <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-4 py-3">Fecha</th>
                  <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-4 py-3">Vencimiento</th>
                  <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-4 py-3">Total</th>
                  <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-4 py-3">Estado</th>
                  <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-4 py-3">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filtered.map((inv) => {
                  const config = STATUS_CONFIG[inv.status] || STATUS_CONFIG.pendiente
                  const StatusIcon = config.icon
                  return (
                    <tr key={inv.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-3">
                        <span className="font-mono text-sm font-semibold text-brand-700">{inv.number}</span>
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-800 font-medium">{inv.client}</td>
                      <td className="px-4 py-3 text-sm text-slate-500">{inv.date}</td>
                      <td className="px-4 py-3 text-sm text-slate-500">{inv.dueDate}</td>
                      <td className="px-4 py-3 text-sm font-bold text-slate-900 whitespace-nowrap">
                        ${inv.total.toLocaleString()} {inv.currency}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full font-semibold ${config.classes}`}>
                          <StatusIcon className="w-3 h-3" />
                          {config.label}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1.5">
                          <button className="inline-flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:border-brand-300 hover:text-brand-600 transition-colors font-medium">
                            <Download className="w-3 h-3" />
                            PDF
                          </button>
                          {inv.status !== 'pagada' && inv.status !== 'vencida' && (
                            <button className="inline-flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-lg bg-brand-50 text-brand-700 hover:bg-brand-100 transition-colors font-medium">
                              <Send className="w-3 h-3" />
                              Enviar
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
        <div className="px-4 py-3 border-t border-slate-100 flex items-center justify-between">
          <p className="text-sm text-slate-500">{filtered.length} facturas</p>
          <p className="text-sm font-semibold text-slate-700">
            Total MXN:{' '}
            <span className="text-brand-700">
              ${filtered.filter(i => i.currency === 'MXN').reduce((s, i) => s + i.total, 0).toLocaleString()}
            </span>
          </p>
        </div>
      </div>
    </div>
  )
}
