'use client'

import { useState } from 'react'
import {
  Search,
  Plus,
  Filter,
  Eye,
  Pencil,
  Trash2,
  Users,
  UserPlus,
  TrendingUp,
  Activity,
  ChevronLeft,
  ChevronRight,
  X,
} from 'lucide-react'

interface Client {
  id: string
  name: string
  email: string
  phone: string
  totalPurchased: number
  currency: string
  tags: string[]
  status: 'activo' | 'inactivo'
  lastActivity: string
  country: string
}

const MOCK_CLIENTS: Client[] = [
  { id: '1', name: 'María González', email: 'maria.gonzalez@gmail.com', phone: '+52 55 1234 5678', totalPurchased: 12500, currency: 'MXN', tags: ['VIP', 'Frecuente'], status: 'activo', lastActivity: 'hace 2 días', country: 'MX' },
  { id: '2', name: 'Carlos Rodríguez', email: 'c.rodriguez@outlook.com', phone: '+57 300 456 7890', totalPurchased: 8750, currency: 'COP', tags: ['Nuevo'], status: 'activo', lastActivity: 'hace 1 día', country: 'CO' },
  { id: '3', name: 'Ana Martínez', email: 'ana.martinez@empresa.mx', phone: '+52 33 9876 5432', totalPurchased: 22000, currency: 'MXN', tags: ['VIP', 'Mayorista'], status: 'activo', lastActivity: 'hoy', country: 'MX' },
  { id: '4', name: 'Diego Hernández', email: 'diego.h@gmail.com', phone: '+54 11 2345 6789', totalPurchased: 3200, currency: 'ARS', tags: ['Ocasional'], status: 'inactivo', lastActivity: 'hace 3 semanas', country: 'AR' },
  { id: '5', name: 'Sofía Ramírez', email: 'sofia.ramirez@hotmail.com', phone: '+52 81 3456 7890', totalPurchased: 9400, currency: 'MXN', tags: ['Frecuente'], status: 'activo', lastActivity: 'hace 5 días', country: 'MX' },
  { id: '6', name: 'Andrés López', email: 'andres.lopez@empresa.co', phone: '+57 310 987 6543', totalPurchased: 15600, currency: 'COP', tags: ['VIP', 'Corporativo'], status: 'activo', lastActivity: 'hace 2 días', country: 'CO' },
  { id: '7', name: 'Valentina Torres', email: 'valen.torres@gmail.com', phone: '+54 351 234 5678', totalPurchased: 5800, currency: 'ARS', tags: ['Nuevo', 'Online'], status: 'activo', lastActivity: 'hoy', country: 'AR' },
  { id: '8', name: 'Luis Sánchez', email: 'luis.sanchez@negocio.mx', phone: '+52 664 567 8901', totalPurchased: 31000, currency: 'MXN', tags: ['VIP', 'Mayorista', 'Frecuente'], status: 'activo', lastActivity: 'ayer', country: 'MX' },
  { id: '9', name: 'Camila Flores', email: 'camila.flores@gmail.com', phone: '+57 320 123 4567', totalPurchased: 4100, currency: 'COP', tags: ['Ocasional'], status: 'inactivo', lastActivity: 'hace 2 meses', country: 'CO' },
  { id: '10', name: 'Roberto Jiménez', email: 'r.jimenez@outlook.com', phone: '+52 222 345 6789', totalPurchased: 18700, currency: 'MXN', tags: ['VIP'], status: 'activo', lastActivity: 'hace 4 días', country: 'MX' },
]

const ALL_TAGS = ['VIP', 'Frecuente', 'Nuevo', 'Mayorista', 'Ocasional', 'Corporativo', 'Online']

const PAGE_SIZE = 8

export default function CRMPage() {
  const [search, setSearch] = useState('')
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [page, setPage] = useState(1)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    )
    setPage(1)
  }

  const filtered = MOCK_CLIENTS.filter((c) => {
    const matchSearch =
      !search ||
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase()) ||
      c.phone.includes(search)
    const matchTags =
      selectedTags.length === 0 || selectedTags.every((t) => c.tags.includes(t))
    return matchSearch && matchTags
  })

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE)
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const activeCount = MOCK_CLIENTS.filter((c) => c.status === 'activo').length
  const newThisMonth = 3
  const avgValue = Math.round(
    MOCK_CLIENTS.reduce((s, c) => s + c.totalPurchased, 0) / MOCK_CLIENTS.length
  )

  const stats = [
    { label: 'Total clientes', value: MOCK_CLIENTS.length.toString(), icon: Users, color: 'text-brand-600 bg-brand-50' },
    { label: 'Nuevos este mes', value: newThisMonth.toString(), icon: UserPlus, color: 'text-emerald-600 bg-emerald-50' },
    { label: 'Valor promedio', value: `$${avgValue.toLocaleString()}`, icon: TrendingUp, color: 'text-accent-600 bg-accent-50' },
    { label: 'Clientes activos', value: activeCount.toString(), icon: Activity, color: 'text-amber-600 bg-amber-50' },
  ]

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Clientes</h1>
          <p className="text-slate-500 text-sm mt-0.5">Gestiona tu base de clientes</p>
        </div>
        <button className="btn-primary gap-2">
          <Plus className="w-4 h-4" />
          Agregar cliente
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => {
          const Icon = s.icon
          return (
            <div key={s.label} className="card p-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-slate-500">{s.label}</p>
                <div className={`p-2 rounded-lg ${s.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <p className="text-2xl font-bold text-slate-900">{s.value}</p>
            </div>
          )
        })}
      </div>

      {/* Filters */}
      <div className="card p-4 space-y-3">
        <div className="flex gap-3 flex-wrap">
          <div className="relative flex-1 min-w-48">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1) }}
              placeholder="Buscar por nombre, email o teléfono..."
              className="input-field pl-9"
            />
          </div>
          <button className="btn-secondary gap-2 py-2.5">
            <Filter className="w-4 h-4" />
            Filtros
          </button>
        </div>
        <div className="flex gap-2 flex-wrap items-center">
          <span className="text-xs text-slate-500 mr-1">Etiquetas:</span>
          {ALL_TAGS.map((tag) => (
            <button
              key={tag}
              onClick={() => toggleTag(tag)}
              className={`text-xs px-3 py-1 rounded-full border font-medium transition-all duration-150 ${
                selectedTags.includes(tag)
                  ? 'bg-brand-600 text-white border-brand-600'
                  : 'border-slate-200 text-slate-600 hover:border-brand-300 hover:text-brand-600'
              }`}
            >
              {tag}
            </button>
          ))}
          {selectedTags.length > 0 && (
            <button
              onClick={() => setSelectedTags([])}
              className="text-xs text-red-500 hover:text-red-700 flex items-center gap-1 ml-1"
            >
              <X className="w-3 h-3" /> Limpiar
            </button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        {paginated.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
            <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mb-4">
              <Users className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-700 mb-1">Sin resultados</h3>
            <p className="text-slate-400 text-sm max-w-xs">
              No se encontraron clientes con los filtros actuales. Intenta con otros términos.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-4 py-3">Nombre</th>
                  <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-4 py-3">Email</th>
                  <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-4 py-3">Teléfono</th>
                  <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-4 py-3">Total comprado</th>
                  <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-4 py-3">Etiquetas</th>
                  <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-4 py-3">Última actividad</th>
                  <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-4 py-3">Estado</th>
                  <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-4 py-3">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {paginated.map((client) => (
                  <tr key={client.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-400 to-accent-400 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                          {client.name.split(' ').map((n) => n[0]).slice(0, 2).join('')}
                        </div>
                        <span className="font-medium text-slate-800 text-sm">{client.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-600">{client.email}</td>
                    <td className="px-4 py-3 text-sm text-slate-600 whitespace-nowrap">{client.phone}</td>
                    <td className="px-4 py-3 text-sm font-semibold text-slate-800 whitespace-nowrap">
                      ${client.totalPurchased.toLocaleString()} {client.currency}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1">
                        {client.tags.slice(0, 2).map((tag) => (
                          <span
                            key={tag}
                            className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                              tag === 'VIP'
                                ? 'bg-brand-100 text-brand-700'
                                : tag === 'Nuevo'
                                ? 'bg-emerald-100 text-emerald-700'
                                : tag === 'Mayorista'
                                ? 'bg-amber-100 text-amber-700'
                                : 'bg-slate-100 text-slate-600'
                            }`}
                          >
                            {tag}
                          </span>
                        ))}
                        {client.tags.length > 2 && (
                          <span className="text-xs text-slate-400">+{client.tags.length - 2}</span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-500 whitespace-nowrap">{client.lastActivity}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`text-xs px-2.5 py-1 rounded-full font-semibold ${
                          client.status === 'activo'
                            ? 'bg-emerald-100 text-emerald-700'
                            : 'bg-slate-100 text-slate-500'
                        }`}
                      >
                        {client.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <button className="p-1.5 text-slate-400 hover:text-accent-600 hover:bg-accent-50 rounded-lg transition-colors">
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button className="p-1.5 text-slate-400 hover:text-brand-600 hover:bg-brand-50 rounded-lg transition-colors">
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(client.id)}
                          className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-4 py-3 border-t border-slate-100 flex items-center justify-between">
            <p className="text-sm text-slate-500">
              Mostrando {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} de{' '}
              {filtered.length} clientes
            </p>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="p-1.5 text-slate-400 hover:text-slate-700 disabled:opacity-30 rounded-lg transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`w-7 h-7 text-sm rounded-lg transition-colors ${
                    p === page
                      ? 'bg-brand-600 text-white font-semibold'
                      : 'text-slate-500 hover:bg-slate-100'
                  }`}
                >
                  {p}
                </button>
              ))}
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="p-1.5 text-slate-400 hover:text-slate-700 disabled:opacity-30 rounded-lg transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Delete confirm modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl">
            <h3 className="text-lg font-bold text-slate-900 mb-2">Eliminar cliente</h3>
            <p className="text-slate-500 text-sm mb-5">
              ¿Estás seguro de que deseas eliminar este cliente? Esta acción no se puede deshacer.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 py-2.5 px-4 rounded-xl border border-slate-200 text-slate-700 font-medium hover:bg-slate-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 py-2.5 px-4 rounded-xl bg-red-500 text-white font-medium hover:bg-red-600 transition-colors"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
