'use client'

import Link from 'next/link'
import { Check, Zap } from 'lucide-react'

interface PricingCardProps {
  name: string
  price: number
  period?: string
  description: string
  features: string[]
  cta: string
  ctaHref: string
  popular?: boolean
  badge?: string
  gradient?: string
}

export default function PricingCard({
  name,
  price,
  period = '/mes',
  description,
  features,
  cta,
  ctaHref,
  popular = false,
  badge,
  gradient = 'from-brand-600 to-accent-600',
}: PricingCardProps) {
  return (
    <div
      className={`relative flex flex-col rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1 ${
        popular
          ? 'bg-gradient-to-br from-brand-600 via-brand-700 to-accent-700 shadow-2xl shadow-brand-500/25 scale-105 border-2 border-brand-400'
          : 'bg-white shadow-md hover:shadow-xl border border-slate-100 hover:border-brand-100'
      }`}
    >
      {/* Popular badge */}
      {popular && (
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <span className="inline-flex items-center gap-1 bg-amber-400 text-amber-900 text-xs font-bold px-4 py-1.5 rounded-full shadow-md">
            <Zap className="w-3 h-3" />
            MÁS POPULAR
          </span>
        </div>
      )}

      {/* Header */}
      <div className={`p-7 ${popular ? 'pt-10' : ''}`}>
        {badge && !popular && (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-brand-100 text-brand-700 mb-4">
            {badge}
          </span>
        )}

        <div className={`text-sm font-bold uppercase tracking-widest mb-1 ${popular ? 'text-brand-200' : 'text-brand-600'}`}>
          {name}
        </div>

        <div className="flex items-baseline gap-1 mb-2">
          <span className={`text-4xl font-black ${popular ? 'text-white' : 'text-slate-900'}`}>
            ${price}
          </span>
          <span className={`text-sm font-medium ${popular ? 'text-brand-200' : 'text-slate-400'}`}>
            USD{period}
          </span>
        </div>

        <p className={`text-sm leading-relaxed ${popular ? 'text-brand-100' : 'text-slate-500'}`}>
          {description}
        </p>
      </div>

      {/* Divider */}
      <div className={`mx-7 border-t ${popular ? 'border-white/20' : 'border-slate-100'}`} />

      {/* Features */}
      <div className="p-7 flex-1">
        <ul className="space-y-3">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start gap-3 text-sm">
              <div
                className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                  popular
                    ? 'bg-white/20 text-white'
                    : 'bg-brand-100 text-brand-600'
                }`}
              >
                <Check className="w-3 h-3" strokeWidth={3} />
              </div>
              <span className={popular ? 'text-brand-50' : 'text-slate-600'}>
                {feature}
              </span>
            </li>
          ))}
        </ul>
      </div>

      {/* CTA */}
      <div className="px-7 pb-7">
        <Link
          href={ctaHref}
          className={`w-full block text-center py-3.5 px-6 rounded-xl font-bold text-sm transition-all duration-200 ${
            popular
              ? 'bg-white text-brand-700 hover:bg-brand-50 shadow-lg hover:shadow-xl hover:-translate-y-0.5'
              : `bg-gradient-to-r ${gradient} text-white hover:opacity-90 shadow-md hover:shadow-lg hover:-translate-y-0.5`
          }`}
        >
          {cta}
        </Link>
        <p className={`text-center text-xs mt-3 ${popular ? 'text-brand-200' : 'text-slate-400'}`}>
          Sin tarjeta de crédito • Cancela cuando quieras
        </p>
      </div>
    </div>
  )
}
