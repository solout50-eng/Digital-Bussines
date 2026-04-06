import Link from 'next/link'
import Navbar from '@/components/Navbar'
import FeatureCard from '@/components/FeatureCard'
import PricingCard from '@/components/PricingCard'
import {
  Bot,
  FileText,
  Package,
  Megaphone,
  BarChart3,
  Users,
  Shield,
  Globe,
  Star,
  ArrowRight,
  CheckCircle2,
  TrendingUp,
  Zap,
} from 'lucide-react'

const features = [
  {
    icon: Bot,
    title: 'Asistente IA 24/7',
    description:
      'Chatbot inteligente que atiende a tus clientes, responde preguntas frecuentes y cierra ventas automáticamente, incluso mientras duermes.',
    bullets: [
      'Responde en español, inglés y portugués',
      'Integración con WhatsApp, Instagram y web',
      'Aprende de cada conversación',
    ],
    gradient: 'from-violet-500 to-purple-600',
    badge: 'IA Generativa',
  },
  {
    icon: FileText,
    title: 'Facturación Electrónica',
    description:
      'Genera facturas electrónicas válidas en México, Colombia, Argentina y más países en segundos. Compatible con todos los regímenes fiscales.',
    bullets: [
      'CFDI, RADIAN, AFIP integrados',
      'Envío automático por email',
      'Control de pagos pendientes',
    ],
    gradient: 'from-blue-500 to-cyan-500',
  },
  {
    icon: Package,
    title: 'Control de Inventario',
    description:
      'Gestiona tu stock en tiempo real con alertas automáticas, múltiples almacenes y reportes de rotación de productos.',
    bullets: [
      'Alertas de stock mínimo',
      'Múltiples bodegas o tiendas',
      'Código de barras / QR',
    ],
    gradient: 'from-emerald-500 to-teal-500',
  },
  {
    icon: Megaphone,
    title: 'Marketing Automático',
    description:
      'Crea y ejecuta campañas de email, SMS y redes sociales con IA. Segmenta tu audiencia y personaliza cada mensaje.',
    bullets: [
      'Campañas de email y WhatsApp',
      'Publicaciones automáticas en redes',
      'Análisis de resultados en tiempo real',
    ],
    gradient: 'from-orange-500 to-rose-500',
  },
  {
    icon: Users,
    title: 'CRM Inteligente',
    description:
      'Centraliza toda la información de tus clientes. Historial de compras, interacciones, preferencias y oportunidades de venta.',
    bullets: [
      'Pipeline de ventas visual',
      'Seguimiento automático de leads',
      'Recordatorios y tareas',
    ],
    gradient: 'from-pink-500 to-rose-500',
  },
  {
    icon: BarChart3,
    title: 'Reportes y Analytics',
    description:
      'Dashboard en tiempo real con todas las métricas de tu negocio. Toma decisiones basadas en datos, no en suposiciones.',
    bullets: [
      'Ventas, ingresos y gastos',
      'Productos más rentables',
      'Exporta a Excel o PDF',
    ],
    gradient: 'from-indigo-500 to-blue-500',
  },
]

const plans = [
  {
    name: 'Básico',
    price: 29,
    description: 'Perfecto para emprendedores y negocios pequeños que están comenzando.',
    features: [
      'Hasta 100 clientes en CRM',
      'Facturación electrónica (50/mes)',
      'Inventario básico (500 productos)',
      'Chatbot IA (200 conversaciones/mes)',
      'Reportes básicos',
      'Soporte por email',
    ],
    cta: 'Comenzar gratis',
    ctaHref: '/register?plan=basic',
    badge: 'Ideal para empezar',
  },
  {
    name: 'Pro',
    price: 99,
    description: 'Para negocios en crecimiento que necesitan más poder y automatización.',
    features: [
      'Clientes ilimitados en CRM',
      'Facturación ilimitada',
      'Inventario ilimitado',
      'Chatbot IA ilimitado',
      'Marketing automático (5 campañas/mes)',
      'Integración WhatsApp Business',
      'Analytics avanzados',
      'Soporte prioritario 24/7',
    ],
    cta: 'Comenzar gratis 14 días',
    ctaHref: '/register?plan=pro',
    popular: true,
  },
  {
    name: 'Empresa',
    price: 299,
    description: 'Solución completa para empresas que necesitan control total y escala.',
    features: [
      'Todo lo del plan Pro',
      'Múltiples sucursales',
      'API completa',
      'Campañas de marketing ilimitadas',
      'Manager de cuenta dedicado',
      'Onboarding personalizado',
      'SLA 99.9% uptime',
      'Facturación múltiples países',
    ],
    cta: 'Contactar ventas',
    ctaHref: '/register?plan=enterprise',
    gradient: 'from-slate-700 to-slate-900',
  },
]

const testimonials = [
  {
    name: 'Carlos Mendoza',
    role: 'Dueño de Ferretería El Martillo',
    country: 'México 🇲🇽',
    text: 'NegocioSmart transformó mi negocio. Antes tardaba 3 horas en hacer facturas, ahora lo hago en 5 minutos. El chatbot atiende a mis clientes de WhatsApp automáticamente.',
    rating: 5,
    revenue: '+40% ventas en 3 meses',
  },
  {
    name: 'María González',
    role: 'Fundadora de Boutique Flor',
    country: 'Colombia 🇨🇴',
    text: 'El control de inventario me salvó. Ya no se me acaban los productos sin darme cuenta. Y las campañas automáticas de Instagram me trajeron 200 nuevos clientes.',
    rating: 5,
    revenue: '+200 clientes nuevos',
  },
  {
    name: 'Roberto Silva',
    role: 'CEO de Distribuidora Silva',
    country: 'Argentina 🇦🇷',
    text: 'Tengo 3 sucursales y antes era un caos. Ahora veo todo desde el dashboard. Los reportes automáticos me ahorran 10 horas a la semana. Increíble.',
    rating: 5,
    revenue: '10 horas ahorradas/semana',
  },
]

const stats = [
  { value: '15,000+', label: 'Negocios activos' },
  { value: '$2.4M', label: 'Facturado por clientes' },
  { value: '98.7%', label: 'Satisfacción de clientes' },
  { value: '12', label: 'Países de LATAM' },
]

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-hero-gradient min-h-screen flex items-center">
        {/* Background decorations */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-accent-500/10 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-brand-500/5 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          <div className="text-center max-w-4xl mx-auto">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 mb-8">
              <Zap className="w-4 h-4 text-amber-300" />
              <span className="text-white/90 text-sm font-medium">
                Nuevo: Asistente IA con GPT-4 incluido en todos los planes
              </span>
            </div>

            {/* Headline */}
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-white leading-tight mb-6">
              Haz crecer tu negocio con{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-orange-400">
                Inteligencia Artificial
              </span>
            </h1>

            {/* Subheadline */}
            <p className="text-xl md:text-2xl text-white/80 max-w-3xl mx-auto mb-10 leading-relaxed">
              La plataforma todo-en-uno para PYMEs latinoamericanas. Factura, gestiona clientes,
              controla inventario y automatiza tu marketing — todo con IA.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-14">
              <Link
                href="/register"
                className="group inline-flex items-center gap-2 bg-white text-brand-700 px-8 py-4 rounded-2xl font-bold text-lg shadow-2xl hover:bg-brand-50 transition-all hover:-translate-y-1 hover:shadow-3xl"
              >
                Comenzar gratis hoy
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="#demo"
                className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 text-white px-8 py-4 rounded-2xl font-semibold text-lg hover:bg-white/20 transition-all"
              >
                Ver demo
              </Link>
            </div>

            {/* Trust indicators */}
            <div className="flex flex-wrap justify-center gap-6 text-white/70 text-sm">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                Sin tarjeta de crédito
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                14 días gratis
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                Cancela cuando quieras
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                Soporte en español
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-slate-900 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-4xl font-black text-white mb-1">{stat.value}</div>
                <div className="text-slate-400 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-brand-100 text-brand-700 rounded-full px-4 py-2 text-sm font-semibold mb-4">
              <Zap className="w-4 h-4" />
              Funcionalidades
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-4">
              Todo lo que tu negocio necesita
            </h2>
            <p className="text-xl text-slate-500 max-w-2xl mx-auto">
              Una sola plataforma con todas las herramientas para gestionar y hacer crecer tu empresa.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature) => (
              <FeatureCard key={feature.title} {...feature} />
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-brand-100 text-brand-700 rounded-full px-4 py-2 text-sm font-semibold mb-4">
              <TrendingUp className="w-4 h-4" />
              Precios
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-4">
              Planes para cada negocio
            </h2>
            <p className="text-xl text-slate-500 max-w-2xl mx-auto">
              Precios en USD accesibles para el mercado latinoamericano. Sin sorpresas.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
            {plans.map((plan) => (
              <PricingCard key={plan.name} {...plan} />
            ))}
          </div>

          <div className="mt-12 text-center">
            <p className="text-slate-500 text-sm">
              ¿Necesitas un plan personalizado?{' '}
              <Link href="/contact" className="text-brand-600 font-semibold hover:underline">
                Contáctanos
              </Link>
            </p>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-brand-100 text-brand-700 rounded-full px-4 py-2 text-sm font-semibold mb-4">
              <Star className="w-4 h-4" />
              Casos de éxito
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-4">
              Negocios que ya crecen con NegocioSmart
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((t) => (
              <div key={t.name} className="bg-white rounded-2xl p-7 shadow-md border border-slate-100 hover:shadow-xl transition-shadow">
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-amber-400 fill-amber-400" />
                  ))}
                </div>
                <p className="text-slate-700 leading-relaxed mb-6 italic">&ldquo;{t.text}&rdquo;</p>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-bold text-slate-900">{t.name}</div>
                    <div className="text-sm text-slate-500">{t.role}</div>
                    <div className="text-xs text-slate-400 mt-0.5">{t.country}</div>
                  </div>
                  <div className="bg-emerald-100 text-emerald-700 text-xs font-bold px-3 py-1.5 rounded-full">
                    {t.revenue}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Integrations */}
      <section className="py-16 bg-white border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-slate-500 text-sm font-medium uppercase tracking-wider mb-8">
            Integrado con las herramientas que ya usas
          </p>
          <div className="flex flex-wrap justify-center gap-8 text-slate-400 font-bold text-lg">
            {['WhatsApp', 'Instagram', 'Facebook', 'Mercado Libre', 'PayPal', 'Stripe', 'Google Sheets', 'Zapier'].map((tool) => (
              <span key={tool} className="hover:text-slate-700 transition-colors cursor-default">
                {tool}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Security & Trust */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Shield className="w-12 h-12 text-brand-600 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-slate-900 mb-3">Seguridad empresarial</h3>
          <p className="text-slate-500 mb-8">
            Tus datos y los de tus clientes están protegidos con los más altos estándares de seguridad.
          </p>
          <div className="flex flex-wrap justify-center gap-6">
            {[
              'SSL/TLS Encriptado',
              'GDPR Compliant',
              'Backups diarios',
              'Servidores en LATAM',
              '99.9% Uptime SLA',
              '2FA Incluido',
            ].map((item) => (
              <div key={item} className="flex items-center gap-2 text-slate-600 text-sm font-medium">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-hero-gradient py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Globe className="w-16 h-16 text-white/30 mx-auto mb-6 animate-float" />
          <h2 className="text-4xl md:text-5xl font-black text-white mb-6">
            Listo para hacer crecer tu negocio?
          </h2>
          <p className="text-xl text-white/80 mb-10">
            Únete a 15,000+ negocios latinoamericanos que ya usan NegocioSmart.
            Comienza gratis hoy, sin tarjeta de crédito.
          </p>
          <Link
            href="/register"
            className="inline-flex items-center gap-2 bg-white text-brand-700 px-10 py-5 rounded-2xl font-bold text-xl shadow-2xl hover:bg-brand-50 transition-all hover:-translate-y-1 group"
          >
            Comenzar gratis — es fácil
            <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-600 to-accent-600 flex items-center justify-center">
                  <Zap className="w-4 h-4 text-white" />
                </div>
                <span className="text-white font-bold text-lg">NegocioSmart</span>
              </div>
              <p className="text-sm leading-relaxed">
                La plataforma de IA para PYMEs latinoamericanas. Haz crecer tu negocio.
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Producto</h4>
              <ul className="space-y-2 text-sm">
                {['Asistente IA', 'Facturación', 'Inventario', 'Marketing', 'CRM', 'Analytics'].map((i) => (
                  <li key={i}><a href="#" className="hover:text-white transition-colors">{i}</a></li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Empresa</h4>
              <ul className="space-y-2 text-sm">
                {['Sobre nosotros', 'Blog', 'Casos de éxito', 'Partners', 'Empleos'].map((i) => (
                  <li key={i}><a href="#" className="hover:text-white transition-colors">{i}</a></li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Soporte</h4>
              <ul className="space-y-2 text-sm">
                {['Centro de ayuda', 'Documentación', 'API', 'Estado del sistema', 'Contacto'].map((i) => (
                  <li key={i}><a href="#" className="hover:text-white transition-colors">{i}</a></li>
                ))}
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm">© 2025 NegocioSmart. Todos los derechos reservados.</p>
            <div className="flex gap-6 text-sm">
              <a href="#" className="hover:text-white transition-colors">Privacidad</a>
              <a href="#" className="hover:text-white transition-colors">Términos</a>
              <a href="#" className="hover:text-white transition-colors">Cookies</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
