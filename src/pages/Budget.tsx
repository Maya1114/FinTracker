import { useState } from "react";
import { FinanceLayout } from "@/components/finance/FinanceLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PiggyBank, Plus, AlertTriangle, Target, TrendingUp, Edit, Trash2 } from "lucide-react";
import { EXPENSE_CATEGORIES, Expense } from "@/types/finance";
import { useTransactions } from "@/hooks/useTransactions";
import { useToast } from "@/hooks/use-toast";

interface Budget {
  id: number;
  category: string;
  limit: number;
  spent: number;
  period: 'monthly' | 'weekly';
}

const Budget = () => {
  const { transactions, loading } = useTransactions();
  const [budgets, setBudgets] = useState<Budget[]>([]);
  
  const [open, setOpen] = useState(false);
  const [editingBudget, setEditingBudget] = useState<Budget | null>(null);
  const [newBudget, setNewBudget] = useState({
    category: '',
    limit: '',
    period: 'monthly' as 'monthly' | 'weekly'
  });
  
  const { toast } = useToast();

  // Convert transactions to expenses format for compatibility  
  const budgetExpenses: Expense[] = transactions.map(transaction => ({
    ...transaction,
    id: parseInt(transaction.id) || 0 // Convert string id to number
  }));

  // Calculate current month spending for each category
  const currentMonthSpending = budgetExpenses
    .filter(e => {
      const expenseDate = new Date(e.date);
      const currentDate = new Date();
      return e.type === 'expense' && 
             expenseDate.getMonth() === currentDate.getMonth() &&
             expenseDate.getFullYear() === currentDate.getFullYear();
    })
    .reduce((acc, expense) => {
      acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
      return acc;
    }, {} as Record<string, number>);

  // Update budgets with actual spending
  const updatedBudgets = budgets.map(budget => ({
    ...budget,
    spent: currentMonthSpending[budget.category] || 0
  }));

  const handleAddBudget = () => {
    if (!newBudget.category || !newBudget.limit) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    if (editingBudget) {
      // Update existing budget
      setBudgets(prev => prev.map(b => 
        b.id === editingBudget.id 
          ? { ...b, category: newBudget.category, limit: parseFloat(newBudget.limit), period: newBudget.period }
          : b
      ));
      toast({
        title: "Success",
        description: "Budget updated successfully",
      });
    } else {
      // Create new budget
      const budget: Budget = {
        id: Math.max(...budgets.map(b => b.id), 0) + 1,
        category: newBudget.category,
        limit: parseFloat(newBudget.limit),
        spent: currentMonthSpending[newBudget.category] || 0,
        period: newBudget.period
      };
      setBudgets(prev => [...prev, budget]);
      toast({
        title: "Success",
        description: "Budget created successfully",
      });
    }

    setNewBudget({ category: '', limit: '', period: 'monthly' });
    setEditingBudget(null);
    setOpen(false);
  };

  const handleEditBudget = (budget: Budget) => {
    setEditingBudget(budget);
    setNewBudget({
      category: budget.category,
      limit: budget.limit.toString(),
      period: budget.period
    });
    setOpen(true);
  };

  const handleDeleteBudget = (budgetId: number) => {
    setBudgets(prev => prev.filter(b => b.id !== budgetId));
    toast({
      title: "Success",
      description: "Budget deleted successfully",
    });
  };

  const getProgressColor = (spent: number, limit: number) => {
    const percentage = (spent / limit) * 100;
    if (percentage >= 90) return 'bg-error';
    if (percentage >= 75) return 'bg-warning';
    return 'bg-success';
  };

  const getProgressStatus = (spent: number, limit: number) => {
    const percentage = (spent / limit) * 100;
    if (percentage >= 100) return 'Over Budget';
    if (percentage >= 90) return 'Near Limit';
    if (percentage >= 75) return 'On Track (High)';
    return 'On Track';
  };

  const totalBudget = updatedBudgets.reduce((sum, b) => sum + b.limit, 0);
  const totalSpent = updatedBudgets.reduce((sum, b) => sum + b.spent, 0);
  const remainingBudget = totalBudget - totalSpent;

  if (loading) {
    return (
      <FinanceLayout>
        <div className="space-y-6">
          <div className="flex items-center justify-center h-64">
            <div className="text-foreground-secondary">Loading your budget data...</div>
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
            <h1 className="text-3xl font-bold text-foreground">Budget Management</h1>
            <p className="text-foreground-secondary">Track and manage your spending limits</p>
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-primary hover:opacity-90 transition-opacity">
                <Plus className="h-4 w-4 mr-2" />
                Add Budget
              </Button>
            </DialogTrigger>
            <DialogContent className="glass-card bg-card-glass/90 border-primary/30">
              <DialogHeader>
                <DialogTitle className="text-xl font-semibold text-foreground">
                  {editingBudget ? 'Edit Budget' : 'Create New Budget'}
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-foreground">Category</Label>
                  <Select value={newBudget.category} onValueChange={(value) => setNewBudget(prev => ({ ...prev, category: value }))}>
                    <SelectTrigger className="glass-effect bg-input/50 border-card-border">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent className="glass-card bg-card-glass border-primary/30">
                      {EXPENSE_CATEGORIES.filter(cat => !budgets.some(b => b.category === cat)).map(category => (
                        <SelectItem key={category} value={category}>{category}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-foreground">Budget Limit ($)</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={newBudget.limit}
                    onChange={(e) => setNewBudget(prev => ({ ...prev, limit: e.target.value }))}
                    placeholder="0.00"
                    className="glass-effect bg-input/50 border-card-border text-foreground"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-foreground">Period</Label>
                  <Select value={newBudget.period} onValueChange={(value: 'monthly' | 'weekly') => setNewBudget(prev => ({ ...prev, period: value }))}>
                    <SelectTrigger className="glass-effect bg-input/50 border-card-border">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="glass-card bg-card-glass border-primary/30">
                      <SelectItem value="monthly">Monthly</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button variant="outline" onClick={() => {
                    setOpen(false);
                    setEditingBudget(null);
                    setNewBudget({ category: '', limit: '', period: 'monthly' });
                  }} className="flex-1 glass-effect border-card-border">
                    Cancel
                  </Button>
                  <Button onClick={handleAddBudget} className="flex-1 bg-gradient-primary hover:opacity-90">
                    {editingBudget ? 'Update Budget' : 'Create Budget'}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Budget Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <Card className="glass-card border-primary/30 bg-primary/5">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-foreground-secondary">Total Budget</CardTitle>
              <PiggyBank className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">${totalBudget.toFixed(2)}</div>
            </CardContent>
          </Card>

          <Card className="glass-card border-warning/30 bg-warning/5">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-foreground-secondary">Total Spent</CardTitle>
              <TrendingUp className="h-4 w-4 text-warning" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">${totalSpent.toFixed(2)}</div>
            </CardContent>
          </Card>

          <Card className={`glass-card ${remainingBudget >= 0 ? 'border-success/30 bg-success/5' : 'border-error/30 bg-error/5'}`}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-foreground-secondary">Remaining</CardTitle>
              <Target className={`h-4 w-4 ${remainingBudget >= 0 ? 'text-success' : 'text-error'}`} />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${remainingBudget >= 0 ? 'text-success' : 'text-error'}`}>
                ${Math.abs(remainingBudget).toFixed(2)}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Budget Progress */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-foreground">Budget Progress</h2>
          {updatedBudgets.length === 0 ? (
            <Card className="glass-card border-card-border/50">
              <CardContent className="p-8 text-center">
                <p className="text-foreground-secondary">No budgets created yet. Click "Add Budget" to get started!</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {updatedBudgets.map((budget) => {
              const percentage = Math.min((budget.spent / budget.limit) * 100, 100);
              const isOverBudget = budget.spent > budget.limit;
              
              return (
                <Card key={budget.id} className="glass-card border-card-border/50">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="font-semibold text-foreground">{budget.category}</h3>
                        <p className="text-sm text-foreground-secondary capitalize">{budget.period} budget</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="text-right">
                          <p className="text-sm font-medium text-foreground">
                            ${budget.spent.toFixed(2)} / ${budget.limit.toFixed(2)}
                          </p>
                          <div className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full ${
                            isOverBudget 
                              ? 'bg-error/10 text-error' 
                              : percentage >= 75 
                              ? 'bg-warning/10 text-warning' 
                              : 'bg-success/10 text-success'
                          }`}>
                            {isOverBudget && <AlertTriangle className="h-3 w-3" />}
                            {getProgressStatus(budget.spent, budget.limit)}
                          </div>
                        </div>
                        <div className="flex gap-1">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleEditBudget(budget)}
                            className="h-8 w-8 p-0 hover:bg-primary/10"
                          >
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDeleteBudget(budget.id)}
                            className="h-8 w-8 p-0 hover:bg-error/10 text-error"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Progress 
                        value={percentage} 
                        className="h-3"
                      />
                      <div className="flex justify-between text-sm text-foreground-secondary">
                        <span>{percentage.toFixed(1)}% used</span>
                        <span>${(budget.limit - budget.spent).toFixed(2)} remaining</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
          )}
        </div>

        {/* Budget Recommendations */}
        <Card className="glass-card border-primary/30 bg-primary/5">
          <CardHeader>
            <CardTitle className="text-foreground">Smart Recommendations</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="p-4 rounded-lg glass-effect bg-card-glass/50">
                <h4 className="font-medium text-foreground mb-2">Reduce Food Spending</h4>
                <p className="text-sm text-foreground-secondary">
                  You're spending 28% of your budget on food. Consider meal planning to save ~$50/month.
                </p>
              </div>
              
              <div className="p-4 rounded-lg glass-effect bg-card-glass/50">
                <h4 className="font-medium text-foreground mb-2">Increase Emergency Fund</h4>
                <p className="text-sm text-foreground-secondary">
                  Set aside $200/month for unexpected expenses based on your spending patterns.
                </p>
              </div>
              
              <div className="p-4 rounded-lg glass-effect bg-card-glass/50">
                <h4 className="font-medium text-foreground mb-2">Entertainment Budget</h4>
                <p className="text-sm text-foreground-secondary">
                  You're well under budget for entertainment. Consider increasing it by $50 for better work-life balance.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </FinanceLayout>
  );
};

export default Budget;