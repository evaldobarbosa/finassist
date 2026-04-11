import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query'
import { api } from '@/lib/api'
import type { Account, Category, Transaction, CreditCard, DashboardSummary, PaginatedResponse } from '@/types'

// Dashboard
export function useDashboard(period?: { start: string; end: string }) {
  const params = period ? `?start=${period.start}&end=${period.end}` : ''
  return useQuery({
    queryKey: ['dashboard', period],
    queryFn: () => api.get<DashboardSummary>(`/dashboard${params}`),
  })
}

// Accounts
export function useAccounts() {
  return useQuery({
    queryKey: ['accounts'],
    queryFn: () => api.get<Account[]>('/accounts'),
  })
}

export function useCreateAccount() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: Partial<Account>) => api.post<Account>('/accounts', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['accounts'] })
    },
  })
}

export function useUpdateAccount() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, ...data }: Partial<Account> & { id: string }) =>
      api.put<Account>(`/accounts/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['accounts'] })
    },
  })
}

export function useDeleteAccount() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => api.delete(`/accounts/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['accounts'] })
    },
  })
}

// Categories
export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: () => api.get<Category[]>('/categories'),
  })
}

export function useCreateCategory() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: Partial<Category>) => api.post<Category>('/categories', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] })
    },
  })
}

export function useUpdateCategory() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, ...data }: Partial<Category> & { id: string }) =>
      api.put<Category>(`/categories/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] })
    },
  })
}

export function useDeleteCategory() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => api.delete(`/categories/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] })
    },
  })
}

// Transactions
export function useTransactions(params?: {
  page?: number
  per_page?: number
  type?: string
  account_id?: string
  category_id?: string
  start_date?: string
  end_date?: string
}) {
  const searchParams = new URLSearchParams()
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        searchParams.set(key, String(value))
      }
    })
  }
  const queryString = searchParams.toString()

  return useQuery({
    queryKey: ['transactions', params],
    queryFn: () =>
      api.get<PaginatedResponse<Transaction>>(
        `/transactions${queryString ? `?${queryString}` : ''}`
      ),
  })
}

export function useCreateTransaction() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: Partial<Transaction>) => api.post<Transaction>('/transactions', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
      queryClient.invalidateQueries({ queryKey: ['accounts'] })
    },
  })
}

export function useUpdateTransaction() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, ...data }: Partial<Transaction> & { id: string }) =>
      api.put<Transaction>(`/transactions/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
      queryClient.invalidateQueries({ queryKey: ['accounts'] })
    },
  })
}

export function useDeleteTransaction() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => api.delete(`/transactions/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
      queryClient.invalidateQueries({ queryKey: ['accounts'] })
    },
  })
}

// Credit Cards
export function useCreditCards() {
  return useQuery({
    queryKey: ['credit-cards'],
    queryFn: () => api.get<CreditCard[]>('/credit-cards'),
  })
}

export function useCreateCreditCard() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: Partial<CreditCard>) => api.post<CreditCard>('/credit-cards', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['credit-cards'] })
    },
  })
}

export function useUpdateCreditCard() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, ...data }: Partial<CreditCard> & { id: string }) =>
      api.put<CreditCard>(`/credit-cards/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['credit-cards'] })
    },
  })
}

export function useDeleteCreditCard() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => api.delete(`/credit-cards/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['credit-cards'] })
    },
  })
}
