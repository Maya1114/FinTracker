export interface Expense {
  id: number;
  description: string;
  category: string;
  amount: number;
  date: string; // YYYY-MM-DD format
  type: 'expense' | 'income';
}

export interface Receipt {
  id: number;
  name: string;
  amount: number;
  category: string;
  date: string;
  image: string;
}

export interface CategoryData {
  name: string;
  value: number;
  color: string;
}

export interface SpendingTrend {
  date: string;
  amount: number;
}

export const EXPENSE_CATEGORIES = [
  'Food',
  'Shopping', 
  'Travel',
  'Health',
  'Entertainment',
  'Bills',
  'Other'
] as const;

export type ExpenseCategory = typeof EXPENSE_CATEGORIES[number];