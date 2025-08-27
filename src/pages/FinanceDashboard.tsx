import { useState } from "react";
import { FinanceLayout } from "@/components/finance/FinanceLayout";
import { StatsCard } from "@/components/finance/StatsCard";
import { RecentTransactions } from "@/components/finance/RecentTransactions";
import { AddExpenseModal } from "@/components/finance/AddExpenseModal";
import { ReceiptUpload } from "@/components/finance/ReceiptUpload";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, BarChart, Bar, Area, AreaChart } from 'recharts';
import { 
  Wallet, 
  TrendingDown, 
  TrendingUp, 
  Calendar,
  DollarSign,
  Download
} from "lucide-react";
import { Expense } from "@/types/finance";
import { useTransactions } from "@/hooks/useTransactions";

const FinanceDashboard = () => {
  const { transactions, addTransaction, loading } = useTransactions();
  const [timeFilter, setTimeFilter] = useState<'7d' | '30d' | '90d' | '1y'>('30d');

  const addExpense = (newExpense: Omit<Expense, 'id'>) => {
    addTransaction(newExpense);
  };

  // Convert transactions to expenses format for compatibility
  const expenseData: Expense[] = transactions.map(transaction => ({
    ...transaction,
    id: parseInt(transaction.id) || 0 // Convert string id to number
  }));

  // Filter expenses based on time period
  const getFilteredExpenses = (days: number): Expense[] => {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    
    return expenseData.filter(expense => 
      new Date(expense.date) >= cutoffDate
    );
  };

  const getDaysFromFilter = (filter: string): number => {
    switch(filter) {
      case '7d': return 7;
      case '30d': return 30;
      case '90d': return 90;
      case '1y': return 365;
      default: return 30;
    }
  };

  const filteredExpenses = getFilteredExpenses(getDaysFromFilter(timeFilter));

  // Calculate statistics using filtered data
  const totalIncome = filteredExpenses
    .filter(e => e.type === 'income')
    .reduce((sum, e) => sum + e.amount, 0);

  const totalExpenses = filteredExpenses
    .filter(e => e.type === 'expense')
    .reduce((sum, e) => sum + e.amount, 0);

  const balance = totalIncome - totalExpenses;

  // Monthly spending (current month)
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const monthlyExpenses = expenseData
    .filter(e => {
      const expenseDate = new Date(e.date);
      return e.type === 'expense' && 
             expenseDate.getMonth() === currentMonth && 
             expenseDate.getFullYear() === currentYear;
    })
    .reduce((sum, e) => sum + e.amount, 0);

  // Weekly spending (last 7 days)
  const weeklyExpenses = expenseData
    .filter(e => {
      const expenseDate = new Date(e.date);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return e.type === 'expense' && expenseDate >= weekAgo;
    })
    .reduce((sum, e) => sum + e.amount, 0);

  // Calculate trends only if there's sufficient historical data
  const calculateTrend = (current: number, previousPeriodData: number[]) => {
    if (previousPeriodData.length === 0 || expenseData.length < 10) return undefined; // Don't show trends for new users
    const previous = previousPeriodData.reduce((sum, val) => sum + val, 0);
    if (previous === 0) return undefined;
    const change = ((current - previous) / previous) * 100;
    return {
      value: Math.abs(change),
      isPositive: change >= 0
    };
  };

  // Calculate previous month spending for trend comparison
  const previousMonth = new Date();
  previousMonth.setMonth(previousMonth.getMonth() - 1);
  const prevMonthlyExpenses = expenseData
    .filter(e => {
      const expenseDate = new Date(e.date);
      return e.type === 'expense' && 
             expenseDate.getMonth() === previousMonth.getMonth() && 
             expenseDate.getFullYear() === previousMonth.getFullYear();
    })
    .map(e => e.amount);

  // Calculate previous week spending for trend comparison
  const twoWeeksAgo = new Date();
  twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
  const prevWeeklyExpenses = expenseData
    .filter(e => {
      const expenseDate = new Date(e.date);
      return e.type === 'expense' && expenseDate >= twoWeeksAgo && expenseDate < oneWeekAgo;
    })
    .map(e => e.amount);

  const last30DaysExpenses = expenseData.filter(e => {
    const expenseDate = new Date(e.date);
    const monthAgo = new Date();
    monthAgo.setDate(monthAgo.getDate() - 30);
    return e.type === 'expense' && expenseDate >= monthAgo;
  });
  
  const uniqueDaysWithExpenses = new Set(
    last30DaysExpenses.map(e => e.date)
  ).size;
  
  const totalExpensesLast30Days = last30DaysExpenses.reduce((sum, e) => sum + e.amount, 0);
  const dailyAverage = uniqueDaysWithExpenses > 0 ? totalExpensesLast30Days / uniqueDaysWithExpenses : 0;

  // Analytics data processing
  // Monthly spending trend
  const monthlyTrend = filteredExpenses
    .filter(e => e.type === 'expense')
    .reduce((acc, expense) => {
      const month = new Date(expense.date).toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
      const existing = acc.find(item => item.month === month);
      if (existing) {
        existing.amount += expense.amount;
      } else {
        acc.push({ month, amount: expense.amount });
      }
      return acc;
    }, [] as { month: string; amount: number }[])
    .sort((a, b) => new Date(a.month).getTime() - new Date(b.month).getTime());

  // Category analysis
  const categoryAnalysis = filteredExpenses
    .filter(e => e.type === 'expense')
    .reduce((acc, expense) => {
      const existing = acc.find(item => item.category === expense.category);
      if (existing) {
        existing.amount += expense.amount;
        existing.transactions += 1;
      } else {
        acc.push({ 
          category: expense.category, 
          amount: expense.amount,
          transactions: 1,
          avgTransaction: expense.amount
        });
      }
      return acc;
    }, [] as { category: string; amount: number; transactions: number; avgTransaction: number }[])
    .map(item => ({ ...item, avgTransaction: item.amount / item.transactions }))
    .sort((a, b) => b.amount - a.amount);

  // Income vs Expenses over time
  const cashFlowData = filteredExpenses
    .reduce((acc, transaction) => {
      const date = new Date(transaction.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      const existing = acc.find(item => item.date === date);
      
      if (existing) {
        if (transaction.type === 'income') {
          existing.income += transaction.amount;
        } else {
          existing.expenses += transaction.amount;
        }
      } else {
        acc.push({
          date,
          income: transaction.type === 'income' ? transaction.amount : 0,
          expenses: transaction.type === 'expense' ? transaction.amount : 0,
        });
      }
      return acc;
    }, [] as { date: string; income: number; expenses: number }[])
    .slice(-10);

  if (loading) {
    return (
      <FinanceLayout>
        <div className="space-y-6">
          <div className="flex items-center justify-center h-64">
            <div className="text-foreground-secondary">Loading your financial data...</div>
          </div>
        </div>
      </FinanceLayout>
    );
  }

  return (
    <FinanceLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Overview</h1>
            <p className="text-foreground-secondary">Complete visual insights into your financial patterns</p>
          </div>
          <div className="flex gap-3">
            <div className="flex bg-card-glass/30 rounded-lg p-1 border border-card-border/50">
              {(['7d', '30d', '90d', '1y'] as const).map((period) => (
                <Button
                  key={period}
                  size="sm"
                  variant={timeFilter === period ? "default" : "ghost"}
                  onClick={() => setTimeFilter(period)}
                  className={timeFilter === period ? "bg-primary text-primary-foreground" : "text-foreground-secondary hover:text-foreground"}
                >
                  {period}
                </Button>
              ))}
            </div>
            <Button variant="outline" className="glass-effect border-primary/30 hover:bg-primary/10">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <ReceiptUpload onProcessReceipt={addExpense} />
            <AddExpenseModal onAddExpense={addExpense} />
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard
            title="Current Balance"
            value={`$${balance.toFixed(2)}`}
            icon={<Wallet className="h-4 w-4" />}
            variant={balance >= 0 ? 'success' : 'error'}
          />
          <StatsCard
            title="Monthly Expenses"
            value={`$${monthlyExpenses.toFixed(2)}`}
            icon={<TrendingDown className="h-4 w-4" />}
            variant="warning"
            trend={calculateTrend(monthlyExpenses, prevMonthlyExpenses)}
          />
          <StatsCard
            title="Weekly Expenses"
            value={`$${weeklyExpenses.toFixed(2)}`}
            icon={<Calendar className="h-4 w-4" />}
            trend={calculateTrend(weeklyExpenses, prevWeeklyExpenses)}
          />
          <StatsCard
            title="Daily Average"
            value={`$${dailyAverage.toFixed(2)}`}
            icon={<DollarSign className="h-4 w-4" />}
          />
        </div>

        {/* Spending Trend */}
        <Card className="glass-card border-primary/30 bg-primary/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground">
              <TrendingUp className="h-5 w-5" />
              Spending Trend Over Time
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={monthlyTrend}>
                <defs>
                  <linearGradient id="expenseGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="month" stroke="rgba(255,255,255,0.6)" fontSize={12} />
                <YAxis stroke="rgba(255,255,255,0.6)" fontSize={12} tickFormatter={(value) => `$${value}`} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(15, 15, 35, 0.9)',
                    border: '1px solid rgba(99, 102, 241, 0.3)',
                    borderRadius: '8px',
                    color: 'white'
                  }}
                  formatter={(value: number) => [`$${value.toFixed(2)}`, 'Spending']}
                />
                <Area 
                  type="monotone" 
                  dataKey="amount" 
                  stroke="hsl(var(--primary))" 
                  fillOpacity={1} 
                  fill="url(#expenseGradient)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Category Breakdown */}
          <Card className="glass-card border-primary/30 bg-primary/5">
            <CardHeader>
              <CardTitle className="text-foreground">Category Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={categoryAnalysis} layout="horizontal">
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis type="number" stroke="rgba(255,255,255,0.6)" fontSize={12} tickFormatter={(value) => `$${value}`} />
                  <YAxis dataKey="category" type="category" stroke="rgba(255,255,255,0.6)" fontSize={12} width={80} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(15, 15, 35, 0.9)',
                      border: '1px solid rgba(99, 102, 241, 0.3)',
                      borderRadius: '8px',
                      color: 'white'
                    }}
                    formatter={(value: number, name: string) => [
                      name === 'amount' ? `$${value.toFixed(2)}` : value,
                      name === 'amount' ? 'Total Spent' : name
                    ]}
                  />
                  <Bar dataKey="amount" fill="hsl(var(--primary))" radius={[4, 4, 4, 4]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Cash Flow */}
          <Card className="glass-card border-primary/30 bg-primary/5">
            <CardHeader>
              <CardTitle className="text-foreground">Cash Flow Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={cashFlowData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis dataKey="date" stroke="rgba(255,255,255,0.6)" fontSize={12} />
                  <YAxis stroke="rgba(255,255,255,0.6)" fontSize={12} tickFormatter={(value) => `$${value}`} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(15, 15, 35, 0.9)',
                      border: '1px solid rgba(99, 102, 241, 0.3)',
                      borderRadius: '8px',
                      color: 'white'
                    }}
                    formatter={(value: number, name: string) => [`$${value.toFixed(2)}`, name === 'income' ? 'Income' : 'Expenses']}
                  />
                  <Bar dataKey="income" fill="hsl(var(--success))" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="expenses" fill="hsl(var(--error))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Category Insights Table */}
        <Card className="glass-card border-primary/30 bg-primary/5">
          <CardHeader>
            <CardTitle className="text-foreground">Detailed Category Insights</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {categoryAnalysis.slice(0, 5).map((category, index) => (
                <div key={category.category} className="flex items-center justify-between p-4 rounded-lg glass-effect bg-card-glass/50">
                  <div className="flex items-center gap-4">
                    <div className="text-foreground-secondary text-sm font-medium w-4">
                      #{index + 1}
                    </div>
                    <div>
                      <h4 className="font-medium text-foreground">{category.category}</h4>
                      <p className="text-sm text-foreground-secondary">
                        {category.transactions} transaction{category.transactions !== 1 ? 's' : ''}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-foreground">${category.amount.toFixed(2)}</p>
                    <p className="text-sm text-foreground-secondary">
                      ${category.avgTransaction.toFixed(2)} avg
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Transactions */}
        <RecentTransactions expenses={expenseData} />
      </div>
    </FinanceLayout>
  );
};

export default FinanceDashboard;