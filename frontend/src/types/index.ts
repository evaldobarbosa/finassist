// User types
export interface User {
  id: string
  phone: string
  name?: string
  email?: string
  created_at: string
  updated_at: string
}

// Account types
export interface Account {
  id: string
  name: string
  type: 'checking' | 'savings' | 'wallet' | 'investment'
  balance: number
  color?: string
  icon?: string
  is_default: boolean
  include_in_total: boolean
  created_at: string
  updated_at: string
}

// Category types
export interface Category {
  id: string
  name: string
  type: 'income' | 'expense'
  color: string
  icon?: string
  parent_id?: string
  budget_limit?: number
  created_at: string
  updated_at: string
}

// Transaction types
export type TransactionType = 'income' | 'expense' | 'transfer'

export interface Transaction {
  id: string
  description: string
  amount: number
  type: TransactionType
  date: string
  account_id: string
  category_id?: string
  destination_account_id?: string
  notes?: string
  is_recurring: boolean
  installment_number?: number
  total_installments?: number
  installment_info?: string
  created_at: string
  updated_at: string
}

// Credit Card types
export interface CreditCard {
  id: string
  name: string
  last_digits?: string
  last_four_digits?: string
  brand?: string
  limit: number
  available_limit?: number
  current_balance: number
  closing_day?: number
  due_day?: number
  color?: string
  account_id?: string
  created_at: string
  updated_at: string
}

export interface Invoice {
  id: string
  credit_card_id: string
  reference_month: string
  amount: number
  status: 'open' | 'closed' | 'paid' | 'overdue'
  due_date: string
  closing_date: string
}

// API Response types
export interface ApiResponse<T> {
  data: T
  message?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  per_page: number
  total_pages: number
}

// Dashboard types
export interface DashboardSummary {
  previous_balance: number
  income: number
  expenses: number
  current_balance: number
  period_start: string
  period_end: string
}
