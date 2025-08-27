import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from './use-toast';

export interface Transaction {
  id: string;
  user_id: string;
  description: string;
  amount: number;
  category: string;
  type: 'expense' | 'income';
  date: string;
  recurring_transaction_id?: string;
  created_at: string;
  updated_at: string;
}

export interface RecurringTransaction {
  id: string;
  user_id: string;
  description: string;
  amount: number;
  category: string;
  type: 'expense' | 'income';
  frequency: 'daily' | 'weekly' | 'monthly' | 'yearly';
  start_date: string;
  end_date?: string;
  is_active: boolean;
  last_generated?: string;
  created_at: string;
  updated_at: string;
}

export function useTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [recurringTransactions, setRecurringTransactions] = useState<RecurringTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchTransactions = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: false });

      if (error) throw error;
      setTransactions((data || []) as Transaction[]);
    } catch (error) {
      console.error('Error fetching transactions:', error);
      toast({
        title: "Error",
        description: "Failed to load transactions",
        variant: "destructive",
      });
    }
  };

  const fetchRecurringTransactions = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('recurring_transactions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setRecurringTransactions((data || []) as RecurringTransaction[]);
    } catch (error) {
      console.error('Error fetching recurring transactions:', error);
      toast({
        title: "Error",
        description: "Failed to load recurring transactions",
        variant: "destructive",
      });
    }
  };

  const addTransaction = async (transactionData: Omit<Transaction, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('transactions')
        .insert([{ ...transactionData, user_id: user.id }])
        .select()
        .single();

      if (error) throw error;

      setTransactions(prev => [data as Transaction, ...prev]);
      toast({
        title: "Success",
        description: "Transaction added successfully",
      });
      return data;
    } catch (error) {
      console.error('Error adding transaction:', error);
      toast({
        title: "Error",
        description: "Failed to add transaction",
        variant: "destructive",
      });
      throw error;
    }
  };

  const addRecurringTransaction = async (recurringData: Omit<RecurringTransaction, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('recurring_transactions')
        .insert([{ ...recurringData, user_id: user.id }])
        .select()
        .single();

      if (error) throw error;

      setRecurringTransactions(prev => [data as RecurringTransaction, ...prev]);
      toast({
        title: "Success",
        description: "Recurring transaction added successfully",
      });
      return data;
    } catch (error) {
      console.error('Error adding recurring transaction:', error);
      toast({
        title: "Error",
        description: "Failed to add recurring transaction",
        variant: "destructive",
      });
      throw error;
    }
  };

  const updateTransaction = async (id: string, updates: Partial<Transaction>) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('transactions')
        .update(updates)
        .eq('id', id)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;

      setTransactions(prev => prev.map(t => t.id === id ? data as Transaction : t));
      toast({
        title: "Success",
        description: "Transaction updated successfully",
      });
      return data;
    } catch (error) {
      console.error('Error updating transaction:', error);
      toast({
        title: "Error",
        description: "Failed to update transaction",
        variant: "destructive",
      });
      throw error;
    }
  };

  const deleteTransaction = async (id: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('transactions')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;

      setTransactions(prev => prev.filter(t => t.id !== id));
      toast({
        title: "Success",
        description: "Transaction deleted successfully",
      });
    } catch (error) {
      console.error('Error deleting transaction:', error);
      toast({
        title: "Error",
        description: "Failed to delete transaction",
        variant: "destructive",
      });
      throw error;
    }
  };

  const toggleRecurringTransaction = async (id: string, isActive: boolean) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('recurring_transactions')
        .update({ is_active: isActive })
        .eq('id', id)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;

      setRecurringTransactions(prev => prev.map(rt => rt.id === id ? data as RecurringTransaction : rt));
      toast({
        title: "Success",
        description: `Recurring transaction ${isActive ? 'activated' : 'paused'}`,
      });
      return data;
    } catch (error) {
      console.error('Error toggling recurring transaction:', error);
      toast({
        title: "Error",
        description: "Failed to update recurring transaction",
        variant: "destructive",
      });
      throw error;
    }
  };

  useEffect(() => {
    if (user) {
      Promise.all([fetchTransactions(), fetchRecurringTransactions()]).finally(() => {
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
  }, [user]);

  return {
    transactions,
    recurringTransactions,
    loading,
    addTransaction,
    addRecurringTransaction,
    updateTransaction,
    deleteTransaction,
    toggleRecurringTransaction,
    fetchTransactions,
    fetchRecurringTransactions,
  };
}