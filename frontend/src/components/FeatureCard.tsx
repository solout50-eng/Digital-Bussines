'use client'

import { LucideIcon } from 'lucide-react'

interface FeatureCardProps {
  icon: LucideIcon
  title: string
  description: string
  bullets?: string[]
  gradient?: string
  badge?: string
}

export default function FeatureCard({
  icon: Icon,
  title,
  description,
  bullets = [],
  gradient = 'from-brand-500 to-accent-500',
  badge,
}: FeatureCardProps) {
  return (
    <div className="group relative bg-white rounded-2xl p-7 shadow-md hover:shadow-xl border border-slate-100 hover:border-brand-100 transition-all duration-300 hover:-translate-y-1 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-32 h-32 opacity-0 group-hover:opacity-5 transition-opacity duration-300">
        <div className={`w-full h-full bg-gradient-to-br ${gradient} rounded-full transform translate-x-10 -translate-y-10`} />
      </div>

      {/* Icon */}
      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center mb-5 shadow-md group-hover:scale-110 transition-transform duration-300`}>
        <Icon className="w-6 h-6 text-white" />
      </div>

      {/* Badge */}
      {badge && (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700 mb-3">
          {badge}
        </span>
      )}

      {/* Content */}
      <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-brand-700 transition-colors">
        {title}
      </h3>
      <p className="text-slate-500 leading-relaxed mb-4 text-sm">
        {description}
      </p>

      {/* Bullets */}
      {bullets.length > 0 && (
        <ul className="space-y-2">
          {bullets.map((bullet, index) => (
            <li key={index} className="flex items-start gap-2 text-sm text-slate-600">
              <span className={`w-5 h-5 rounded-full bg-gradient-to-br ${gradient} flex items-center justify-center shrink-0 mt-0.5`}>
                <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </span>
              {bullet}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
