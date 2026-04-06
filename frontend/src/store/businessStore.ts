'use client'

import { create } from 'zustand'

interface Metrics {
  revenue: { value: number; growth: string; positive: boolean }
  clients: { value: number }
  invoices: { value: number }
  aiConversations: { value: number }
  inventoryValue: number
}

interface BusinessState {
  metrics: Metrics | null
  isLoadingMetrics: boolean
  setMetrics: (metrics: Metrics) => void
  setLoadingMetrics: (loading: boolean) => void
}

export const useBusinessStore = create<BusinessState>((set) => ({
  metrics: null,
  isLoadingMetrics: false,
  setMetrics: (metrics) => set({ metrics }),
  setLoadingMetrics: (isLoadingMetrics) => set({ isLoadingMetrics }),
}))
