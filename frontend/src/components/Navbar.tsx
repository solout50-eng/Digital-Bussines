'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Menu, X, Zap, ChevronDown } from 'lucide-react'

const navigation = [
  {
    label: 'Producto',
    children: [
      { label: 'Asistente IA', href: '#features', description: 'Chatbot inteligente para tu negocio' },
      { label: 'Facturación', href: '#features', description: 'Facturas electrónicas en segundos' },
      { label: 'Inventario', href: '#features', description: 'Control total de tu stock' },
      { label: 'Marketing', href: '#features', description: 'Campañas automáticas con IA' },
    ],
  },
  { label: 'Precios', href: '#pricing' },
  { label: 'Casos de éxito', href: '#testimonials' },
  { label: 'Blog', href: '/blog' },
]

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/95 backdrop-blur-md shadow-md border-b border-slate-100'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-18">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-600 to-accent-600 flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className={`text-xl font-bold tracking-tight transition-colors ${scrolled ? 'text-slate-900' : 'text-white'}`}>
              NegocioSmart
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navigation.map((item) =>
              item.children ? (
                <div
                  key={item.label}
                  className="relative"
                  onMouseEnter={() => setActiveDropdown(item.label)}
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  <button
                    className={`flex items-center gap-1 px-4 py-2 rounded-lg font-medium transition-colors text-sm ${
                      scrolled
                        ? 'text-slate-600 hover:text-brand-700 hover:bg-brand-50'
                        : 'text-white/90 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    {item.label}
                    <ChevronDown className="w-4 h-4" />
                  </button>
                  {activeDropdown === item.label && (
                    <div className="absolute top-full left-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-slate-100 p-2 animate-fade-in">
                      {item.children.map((child) => (
                        <Link
                          key={child.label}
                          href={child.href}
                          className="flex items-start gap-3 px-3 py-2.5 rounded-xl hover:bg-brand-50 group/item transition-colors"
                        >
                          <div className="w-8 h-8 rounded-lg bg-brand-100 flex items-center justify-center mt-0.5 shrink-0">
                            <Zap className="w-4 h-4 text-brand-600" />
                          </div>
                          <div>
                            <div className="font-semibold text-slate-900 text-sm group-hover/item:text-brand-700">
                              {child.label}
                            </div>
                            <div className="text-xs text-slate-500 mt-0.5">{child.description}</div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  key={item.label}
                  href={item.href!}
                  className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                    scrolled
                      ? 'text-slate-600 hover:text-brand-700 hover:bg-brand-50'
                      : 'text-white/90 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {item.label}
                </Link>
              )
            )}
          </nav>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/login"
              className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                scrolled
                  ? 'text-slate-600 hover:text-brand-700'
                  : 'text-white/90 hover:text-white'
              }`}
            >
              Iniciar sesión
            </Link>
            <Link
              href="/register"
              className="px-5 py-2.5 rounded-xl font-semibold text-sm text-white bg-gradient-to-r from-brand-600 to-accent-600 hover:from-brand-700 hover:to-accent-700 transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5"
            >
              Comenzar gratis
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            className={`md:hidden p-2 rounded-lg transition-colors ${
              scrolled ? 'text-slate-700 hover:bg-slate-100' : 'text-white hover:bg-white/10'
            }`}
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-slate-100 shadow-xl animate-fade-in">
          <div className="max-w-7xl mx-auto px-4 py-4 space-y-1">
            {navigation.map((item) =>
              item.children ? (
                <div key={item.label}>
                  <div className="px-4 py-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
                    {item.label}
                  </div>
                  {item.children.map((child) => (
                    <Link
                      key={child.label}
                      href={child.href}
                      className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-slate-700 hover:text-brand-700 hover:bg-brand-50 font-medium transition-colors"
                      onClick={() => setIsOpen(false)}
                    >
                      {child.label}
                    </Link>
                  ))}
                </div>
              ) : (
                <Link
                  key={item.label}
                  href={item.href!}
                  className="flex items-center px-4 py-2.5 rounded-xl text-slate-700 hover:text-brand-700 hover:bg-brand-50 font-medium transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  {item.label}
                </Link>
              )
            )}
            <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
              <Link
                href="/login"
                className="w-full text-center px-4 py-2.5 rounded-xl font-semibold text-brand-700 border-2 border-brand-200 hover:bg-brand-50 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Iniciar sesión
              </Link>
              <Link
                href="/register"
                className="w-full text-center px-4 py-2.5 rounded-xl font-semibold text-white bg-gradient-to-r from-brand-600 to-accent-600 shadow-md"
                onClick={() => setIsOpen(false)}
              >
                Comenzar gratis
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
