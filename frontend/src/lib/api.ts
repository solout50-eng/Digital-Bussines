const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'

export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('ns_token') : null

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Error de conexión' }))
    throw new Error(error.error || `HTTP ${response.status}`)
  }

  return response.json()
}

export const api = {
  auth: {
    login: (data: { email: string; password: string }) =>
      apiRequest<{ token: string; user: any }>('/api/auth/login', { method: 'POST', body: JSON.stringify(data) }),
    register: (data: any) =>
      apiRequest<{ token: string; user: any }>('/api/auth/register', { method: 'POST', body: JSON.stringify(data) }),
  },
  dashboard: {
    getMetrics: () => apiRequest<any>('/api/business/dashboard'),
  },
  clients: {
    list: (params?: { search?: string; page?: number }) =>
      apiRequest<any>(`/api/clients?${new URLSearchParams(params as any)}`),
    create: (data: any) => apiRequest<any>('/api/clients', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: string, data: any) => apiRequest<any>(`/api/clients/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id: string) => apiRequest<any>(`/api/clients/${id}`, { method: 'DELETE' }),
  },
  invoices: {
    list: () => apiRequest<any>('/api/invoices'),
    create: (data: any) => apiRequest<any>('/api/invoices', { method: 'POST', body: JSON.stringify(data) }),
    updateStatus: (id: string, status: string) =>
      apiRequest<any>(`/api/invoices/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) }),
  },
  inventory: {
    list: () => apiRequest<any>('/api/inventory'),
    create: (data: any) => apiRequest<any>('/api/inventory', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: string, data: any) => apiRequest<any>(`/api/inventory/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  },
  ai: {
    chat: (message: string, context?: any) =>
      apiRequest<{ reply: string }>('/api/ai/chat', { method: 'POST', body: JSON.stringify({ message, context }) }),
    generateMarketing: (data: any) =>
      apiRequest<any>('/api/ai/generate-marketing', { method: 'POST', body: JSON.stringify(data) }),
  },
}
