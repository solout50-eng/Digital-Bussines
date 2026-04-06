import type { Metadata, Viewport } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: {
    default: 'NegocioSmart — IA para PYMEs Latinoamericanas',
    template: '%s | NegocioSmart',
  },
  description:
    'Plataforma de inteligencia artificial diseñada para hacer crecer tu negocio. Gestiona clientes, automatiza marketing, controla inventario y factura desde un solo lugar.',
  keywords: [
    'software gestión empresarial',
    'IA para negocios',
    'marketing digital PYME',
    'facturación electrónica',
    'CRM latinoamérica',
    'automatización marketing',
    'gestión inventario',
    'software empresarial México',
    'software empresarial Colombia',
    'software empresarial Argentina',
  ],
  authors: [{ name: 'NegocioSmart', url: 'https://negociosmart.com' }],
  creator: 'NegocioSmart',
  publisher: 'NegocioSmart',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'es_LA',
    url: 'https://negociosmart.com',
    siteName: 'NegocioSmart',
    title: 'NegocioSmart — IA para PYMEs Latinoamericanas',
    description:
      'Haz crecer tu negocio con Inteligencia Artificial. Gestiona clientes, automatiza marketing y factura desde un solo lugar.',
    images: [
      {
        url: 'https://negociosmart.com/og-image.png',
        width: 1200,
        height: 630,
        alt: 'NegocioSmart — Plataforma IA para PYMEs',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'NegocioSmart — IA para PYMEs Latinoamericanas',
    description:
      'Haz crecer tu negocio con Inteligencia Artificial.',
    images: ['https://negociosmart.com/twitter-image.png'],
    creator: '@negociosmart',
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#7c3aed' },
    { media: '(prefers-color-scheme: dark)', color: '#4c1d95' },
  ],
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased bg-slate-50 text-slate-900 min-h-screen">
        {children}
      </body>
    </html>
  )
}
