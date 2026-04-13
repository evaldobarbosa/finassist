// User types
export interface User {
  id: string
  name?: string
  email?: string
  phone?: string
  email_verified_at?: string
  phone_verified_at?: string
  created_at: string
  updated_at: string
}

// Auth types
export interface AuthResponse {
  message: string
  user: User
  token: string
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData {
  name: string
  email: string
  password: string
  password_confirmation: string
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

export interface TransactionsResponse {
  data: Transaction[]
  receitas: number
  despesas: number
  saldo: number
  current_page: number
  last_page: number
  per_page: number
  total: number
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

// Installment types
export interface InstallmentPurchase {
  id: string
  user_id: number
  credit_card_id?: string
  transaction_id?: string
  total_amount: number
  installment_count: number
  installment_amount: number
  purchase_date: string
  merchant?: string
  source: 'credit_card' | 'bank_loan' | 'vehicle' | 'mortgage' | 'store'
  fin_extra_info?: {
    interest_rate?: number
    interest_type?: 'monthly' | 'yearly'
    total_interest?: number
    outstanding_balance?: number
    institution_name?: string
    contract_number?: string
    first_due_date?: string
    amortization_type?: 'price' | 'sac'
  }
  credit_card?: CreditCard
  installments?: Installment[]
  created_at: string
  updated_at: string
}

export interface Installment {
  id: string
  installment_purchase_id: string
  number: number
  amount: number
  invoice_month: string
  status: 'pending' | 'paid'
  paid_at?: string
  installment_purchase?: InstallmentPurchase
  created_at: string
  updated_at: string
}

export interface InstallmentsByMonthResponse {
  invoice_month: string
  total: number
  pending_total: number
  paid_total: number
  installments_count: number
  data: Installment[]
}

// Recurrence types
export type RecurrenceFrequency = 'daily' | 'weekly' | 'monthly' | 'yearly'

export interface Recurrence {
  id: string
  user_id: number
  account_id: string
  category_id?: string
  credit_card_id?: string
  type: 'income' | 'expense'
  frequency: RecurrenceFrequency
  amount: number
  description: string
  notes?: string
  day_of_month?: number
  day_of_week?: number
  month_of_year?: number
  start_date: string
  end_date?: string
  last_generated_at?: string
  next_due_date: string
  is_active: boolean
  account?: Account
  category?: Category
  credit_card?: CreditCard
  created_at: string
  updated_at: string
}
