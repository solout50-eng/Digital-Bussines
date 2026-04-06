'use client'

import { useState } from 'react'
import {
  Plus,
  Search,
  Package,
  AlertTriangle,
  DollarSign,
  Tag,
  Filter,
} from 'lucide-react'

type StockStatus = 'ok' | 'bajo' | 'agotado'

interface Product {
  id: string
  name: string
  sku: string
  category: string
  price: number
  cost: number
  stock: number
  minStock: number
  status: StockStatus
}

const MOCK_PRODUCTS: Product[] = [
  { id: '1', name: 'Blusa Floral Manga Larga', sku: 'BL-001', category: 'Blusas', price: 450, cost: 180, stock: 24, minStock: 10, status: 'ok' },
  { id: '2', name: 'Jeans Skinny Azul Claro', sku: 'JN-002', category: 'Pantalones', price: 780, cost: 320, stock: 5, minStock: 8, status: 'bajo' },
  { id: '3', name: 'Vestido Casual Verano', sku: 'VS-003', category: 'Vestidos', price: 620, cost: 250, stock: 0, minStock: 5, status: 'agotado' },
  { id: '4', name: 'Chamarra de Mezclilla', sku: 'CH-004', category: 'Chamarras', price: 1200, cost: 490, stock: 12, minStock: 6, status: 'ok' },
  { id: '5', name: 'Falda Plisada Midi', sku: 'FA-005', category: 'Faldas', price: 380, cost: 150, stock: 3, minStock: 7, status: 'bajo' },
  { id: '6', name: 'Top Crop Básico Negro', sku: 'TP-006', category: 'Tops', price: 220, cost: 85, stock: 42, minStock: 15, status: 'ok' },
  { id: '7', name: 'Pantalón de Lino Beige', sku: 'PL-007', category: 'Pantalones', price: 560, cost: 230, stock: 8, minStock: 8, status: 'bajo' },
  { id: '8', name: 'Vestido Formal Noche', sku: 'VF-008', category: 'Vestidos', price: 1850, cost: 760, stock: 6, minStock: 3, status: 'ok' },
  { id: '9', name: 'Blusa Manga Globo', sku: 'BL-009', category: 'Blusas', price: 390, cost: 155, stock: 0, minStock: 6, status: 'agotado' },
  { id: '10', name: 'Shorts de Tela Floral', sku: 'SH-010', category: 'Shorts', price: 290, cost: 115, stock: 18, minStock: 8, status: 'ok' },
  { id: '11', name: 'Maxi Vestido Bohemio', sku: 'MV-011', category: 'Vestidos', price: 720, cost: 290, stock: 4, minStock: 5, status: 'bajo' },
  { id: '12', name: 'Cárdigan Punto Fino', sku: 'CA-012', category: 'Chamarras', price: 680, cost: 275, stock: 15, minStock: 6, status: 'ok' },
]

const CATEGORIES = ['Todas', 'Blusas', 'Pantalones', 'Vestidos', 'Chamarras', 'Faldas', 'Tops', 'Shorts']

const STATUS_CONFIG: Record<StockStatus, { label: string; classes: string; dot: string }> = {
  ok: { label: 'En stock', classes: 'bg-emerald-100 text-emerald-700', dot: 'bg-emerald-500' },
  bajo: { label: 'Stock bajo', classes: 'bg-amber-100 text-amber-700', dot: 'bg-amber-500' },
  agotado: { label: 'Agotado', classes: 'bg-red-100 text-red-700', dot: 'bg-red-500' },
}

export default function InventoryPage() {
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('Todas')

  const filtered = MOCK_PRODUCTS.filter((p) => {
    const matchSearch =
      !search ||
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.sku.toLowerCase().includes(search.toLowerCase())
    const matchCategory = category === 'Todas' || p.category === category
    return matchSearch && matchCategory
  })

  const lowStockProducts = MOCK_PRODUCTS.filter((p) => p.status === 'bajo' || p.status === 'agotado')
  const totalInventoryValue = MOCK_PRODUCTS.reduce((s, p) => s + p.cost * p.stock, 0)
  const uniqueCategories = new Set(MOCK_PRODUCTS.map((p) => p.category)).size

  const stats = [
    { label: 'Total productos', value: MOCK_PRODUCTS.length.toString(), icon: Package, color: 'text-brand-600 bg-brand-50' },
    { label: 'Valor del inventario', value: `$${totalInventoryValue.toLocaleString()} MXN`, icon: DollarSign, color: 'text-emerald-600 bg-emerald-50' },
    { label: 'Stock bajo/agotado', value: lowStockProducts.length.toString(), icon: AlertTriangle, color: 'text-amber-600 bg-amber-50' },
    { label: 'Categorías', value: uniqueCategories.toString(), icon: Tag, color: 'text-accent-600 bg-accent-50' },
  ]

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Inventario</h1>
          <p className="text-slate-500 text-sm mt-0.5">Controla tu stock y productos</p>
        </div>
        <button className="btn-primary gap-2">
          <Plus className="w-4 h-4" />
          Agregar producto
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
            </div>
          )
        })}
      </div>

      {/* Low stock alert */}
      {lowStockProducts.length > 0 && (
        <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-xl">
          <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-amber-800">Alerta de stock bajo</p>
            <p className="text-sm text-amber-700 mt-0.5">
              {lowStockProducts.length} producto{lowStockProducts.length > 1 ? 's' : ''} con stock bajo o agotado:{' '}
              {lowStockProducts.map((p) => p.name).join(', ')}.
            </p>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="card p-4 space-y-3">
        <div className="flex gap-3 flex-wrap">
          <div className="relative flex-1 min-w-48">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por nombre o SKU..."
              className="input-field pl-9"
            />
          </div>
          <button className="btn-secondary gap-2 py-2.5">
            <Filter className="w-4 h-4" />
            Exportar
          </button>
        </div>
        {/* Category tabs */}
        <div className="flex gap-1 flex-wrap">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`text-sm px-3 py-1.5 rounded-lg font-medium transition-all duration-150 ${
                category === cat
                  ? 'bg-brand-600 text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Product table */}
      <div className="card overflow-hidden">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
            <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mb-4">
              <Package className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-700 mb-1">Sin productos</h3>
            <p className="text-slate-400 text-sm">No se encontraron productos con los filtros aplicados.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-4 py-3">Producto</th>
                  <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-4 py-3">SKU</th>
                  <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-4 py-3">Categoría</th>
                  <th className="text-right text-xs font-semibold text-slate-500 uppercase tracking-wider px-4 py-3">Precio</th>
                  <th className="text-right text-xs font-semibold text-slate-500 uppercase tracking-wider px-4 py-3">Costo</th>
                  <th className="text-right text-xs font-semibold text-slate-500 uppercase tracking-wider px-4 py-3">Stock</th>
                  <th className="text-right text-xs font-semibold text-slate-500 uppercase tracking-wider px-4 py-3">Stock mín.</th>
                  <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-4 py-3">Estado</th>
                  <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-4 py-3">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filtered.map((product) => {
                  const config = STATUS_CONFIG[product.status]
                  const margin = product.price > 0 ? Math.round(((product.price - product.cost) / product.price) * 100) : 0
                  return (
                    <tr key={product.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          {/* Image placeholder */}
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-100 to-accent-100 flex items-center justify-center flex-shrink-0">
                            <Package className="w-5 h-5 text-brand-500" />
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-slate-800">{product.name}</p>
                            <p className="text-xs text-slate-400">Margen: {margin}%</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="font-mono text-xs text-slate-500 bg-slate-100 px-2 py-0.5 rounded">{product.sku}</span>
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-600">{product.category}</td>
                      <td className="px-4 py-3 text-sm font-semibold text-slate-900 text-right">${product.price.toLocaleString()}</td>
                      <td className="px-4 py-3 text-sm text-slate-500 text-right">${product.cost.toLocaleString()}</td>
                      <td className="px-4 py-3 text-right">
                        <span className={`text-sm font-bold ${product.stock === 0 ? 'text-red-600' : product.stock <= product.minStock ? 'text-amber-600' : 'text-slate-900'}`}>
                          {product.stock}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-500 text-right">{product.minStock}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full font-semibold ${config.classes}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
                          {config.label}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          <button className="text-xs px-2.5 py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:border-brand-300 hover:text-brand-600 transition-colors font-medium">
                            Editar
                          </button>
                          <button className="text-xs px-2.5 py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:border-emerald-300 hover:text-emerald-600 transition-colors font-medium">
                            Stock +/-
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
        <div className="px-4 py-3 border-t border-slate-100">
          <p className="text-sm text-slate-500">{filtered.length} productos</p>
        </div>
      </div>
    </div>
  )
}
