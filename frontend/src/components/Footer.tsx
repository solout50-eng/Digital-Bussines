import Link from 'next/link'
import { Zap, Twitter, Linkedin, Instagram, Facebook, Youtube } from 'lucide-react'

const LINKS = {
  Producto: [
    { label: 'Funcionalidades', href: '/#features' },
    { label: 'Precios', href: '/#pricing' },
    { label: 'Chatbot IA', href: '/features/chatbot' },
    { label: 'CRM', href: '/features/crm' },
    { label: 'Facturación', href: '/features/invoices' },
    { label: 'Marketing', href: '/features/marketing' },
  ],
  Empresa: [
    { label: 'Sobre nosotros', href: '/about' },
    { label: 'Blog', href: '/blog' },
    { label: 'Casos de éxito', href: '/cases' },
    { label: 'Afiliados', href: '/affiliates' },
    { label: 'Trabaja con nosotros', href: '/careers' },
  ],
  Soporte: [
    { label: 'Centro de ayuda', href: '/help' },
    { label: 'Documentación', href: '/docs' },
    { label: 'Estado del servicio', href: '/status' },
    { label: 'Contacto', href: '/contact' },
    { label: 'Comunidad', href: '/community' },
  ],
  Legal: [
    { label: 'Términos de uso', href: '/terms' },
    { label: 'Privacidad', href: '/privacy' },
    { label: 'Cookies', href: '/cookies' },
    { label: 'GDPR', href: '/gdpr' },
  ],
}

const SOCIAL_LINKS = [
  { icon: Twitter, href: 'https://twitter.com/negociosmart', label: 'Twitter' },
  { icon: Linkedin, href: 'https://linkedin.com/company/negociosmart', label: 'LinkedIn' },
  { icon: Instagram, href: 'https://instagram.com/negociosmart', label: 'Instagram' },
  { icon: Facebook, href: 'https://facebook.com/negociosmart', label: 'Facebook' },
  { icon: Youtube, href: 'https://youtube.com/@negociosmart', label: 'YouTube' },
]

const SUPPORTED_COUNTRIES = [
  { flag: '🇲🇽', name: 'México' },
  { flag: '🇨🇴', name: 'Colombia' },
  { flag: '🇦🇷', name: 'Argentina' },
  { flag: '🇵🇪', name: 'Perú' },
  { flag: '🇨🇱', name: 'Chile' },
]

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400">
      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8 lg:gap-12">
          {/* Brand column */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-500 to-accent-500 flex items-center justify-center shadow-lg">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">NegocioSmart</span>
            </Link>
            <p className="text-sm leading-relaxed text-slate-400 mb-6 max-w-xs">
              La plataforma de inteligencia artificial diseñada para hacer crecer las PYMEs de Latinoamérica. Gestiona, automatiza y escala tu negocio desde un solo lugar.
            </p>

            {/* Countries */}
            <div className="mb-6">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                Disponible en
              </p>
              <div className="flex flex-wrap gap-2">
                {SUPPORTED_COUNTRIES.map((c) => (
                  <div
                    key={c.name}
                    title={c.name}
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800 text-sm"
                  >
                    <span>{c.flag}</span>
                    <span className="text-xs text-slate-400">{c.name}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Social links */}
            <div className="flex gap-3">
              {SOCIAL_LINKS.map((s) => {
                const Icon = s.icon
                return (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.label}
                    className="w-9 h-9 rounded-xl bg-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:bg-brand-600 transition-all duration-150"
                  >
                    <Icon className="w-4 h-4" />
                  </a>
                )
              })}
            </div>
          </div>

          {/* Link columns */}
          {(Object.entries(LINKS) as [string, { label: string; href: string }[]][]).map(([section, links]) => (
            <div key={section}>
              <h3 className="text-sm font-semibold text-white mb-4">{section}</h3>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-slate-400 hover:text-white transition-colors duration-150"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="border-t border-slate-800 mt-12 pt-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-slate-500">
              © {new Date().getFullYear()} NegocioSmart. Todos los derechos reservados.
            </p>
            <div className="flex items-center gap-6 text-xs text-slate-500">
              <Link href="/privacy" className="hover:text-slate-300 transition-colors">Privacidad</Link>
              <Link href="/terms" className="hover:text-slate-300 transition-colors">Términos</Link>
              <Link href="/cookies" className="hover:text-slate-300 transition-colors">Cookies</Link>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
              Todos los sistemas operativos
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
