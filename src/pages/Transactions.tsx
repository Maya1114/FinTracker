import { useState, useMemo } from "react";
import { FinanceLayout } from "@/components/finance/FinanceLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { 
  Search, 
  Filter, 
  Download, 
  ArrowUpDown, 
  ArrowDownIcon, 
  ArrowUpIcon,
  CalendarIcon,
  X,
  Edit2,
  Trash2
} from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useTransactions } from "@/hooks/useTransactions";
import { Expense, EXPENSE_CATEGORIES } from "@/types/finance";

const Transactions = () => {
  const { transactions, loading } = useTransactions();
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [dateRange, setDateRange] = useState<{ from?: Date; to?: Date }>({});
  const [sortBy, setSortBy] = useState<'date' | 'amount' | 'description'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Convert transactions to expenses format for compatibility
  const transactionsList: Expense[] = transactions.map(transaction => ({
    ...transaction,
    id: parseInt(transaction.id) || 0 // Convert string id to number
  }));

  // Filter and sort transactions
  const filteredTransactions = useMemo(() => {
    let filtered = transactionsList.filter(transaction => {
      // Search filter
      const matchesSearch = searchTerm === "" || 
        transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transaction.category.toLowerCase().includes(searchTerm.toLowerCase());

      // Category filter
      const matchesCategory = categoryFilter === "all" || transaction.category === categoryFilter;

      // Type filter  
      const matchesType = typeFilter === "all" || transaction.type === typeFilter;

      // Date range filter
      const transactionDate = new Date(transaction.date);
      const matchesDateRange = (!dateRange.from || transactionDate >= dateRange.from) &&
        (!dateRange.to || transactionDate <= dateRange.to);

      return matchesSearch && matchesCategory && matchesType && matchesDateRange;
    });

    // Sort transactions
    filtered.sort((a, b) => {
      let aValue: string | number;
      let bValue: string | number;

      switch (sortBy) {
        case 'date':
          aValue = new Date(a.date).getTime();
          bValue = new Date(b.date).getTime();
          break;
        case 'amount':
          aValue = a.amount;
          bValue = b.amount;
          break;
        case 'description':
          aValue = a.description.toLowerCase();
          bValue = b.description.toLowerCase();
          break;
        default:
          return 0;
      }

      if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [transactionsList, searchTerm, categoryFilter, typeFilter, dateRange, sortBy, sortOrder]);

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'Food': 'bg-blue-500/10 text-blue-400 border-blue-500/20',
      'Shopping': 'bg-purple-500/10 text-purple-400 border-purple-500/20',
      'Travel': 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
      'Health': 'bg-green-500/10 text-green-400 border-green-500/20',
      'Entertainment': 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
      'Bills': 'bg-red-500/10 text-red-400 border-red-500/20',
      'Other': 'bg-gray-500/10 text-gray-400 border-gray-500/20',
      'Income': 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
    };
    return colors[category] || colors['Other'];
  };

  const getDateRangeDisplay = () => {
    if (!dateRange.from) return "Date Range";
    
    if (dateRange.to) {
      return `${format(dateRange.from, "MMM dd")} - ${format(dateRange.to, "MMM dd")}`;
    } else {
      return format(dateRange.from, "MMM dd, yyyy");
    }
  };

  const clearFilters = () => {
    setSearchTerm("");
    setCategoryFilter("all");
    setTypeFilter("all");
    setDateRange({});
  };

  const activeFiltersCount = [
    searchTerm !== "",
    categoryFilter !== "all",
    typeFilter !== "all",
    dateRange.from || dateRange.to
  ].filter(Boolean).length;

  const totalAmount = filteredTransactions.reduce((sum, t) => sum + (t.type === 'expense' ? -t.amount : t.amount), 0);
  const totalExpenses = filteredTransactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
  const totalIncome = filteredTransactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);

  if (loading) {
    return (
      <FinanceLayout>
        <div className="space-y-6">
          <div className="flex items-center justify-center h-64">
            <div className="text-foreground-secondary">Loading your transactions...</div>
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
            <h1 className="text-3xl font-bold text-foreground">All Transactions</h1>
            <p className="text-foreground-secondary">
              Showing {filteredTransactions.length} of {transactionsList.length} transactions
            </p>
          </div>
          <Button variant="outline" className="glass-effect border-primary/30 hover:bg-primary/10">
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card className="glass-card border-primary/30 bg-primary/5">
            <CardContent className="p-4">
              <div className="text-sm text-foreground-secondary">Net Amount</div>
              <div className={`text-2xl font-bold ${totalAmount >= 0 ? 'text-success' : 'text-error'}`}>
                ${totalAmount.toFixed(2)}
              </div>
            </CardContent>
          </Card>
          <Card className="glass-card border-success/30 bg-success/5">
            <CardContent className="p-4">
              <div className="text-sm text-foreground-secondary">Total Income</div>
              <div className="text-2xl font-bold text-success">${totalIncome.toFixed(2)}</div>
            </CardContent>
          </Card>
          <Card className="glass-card border-error/30 bg-error/5">
            <CardContent className="p-4">
              <div className="text-sm text-foreground-secondary">Total Expenses</div>
              <div className="text-2xl font-bold text-error">${totalExpenses.toFixed(2)}</div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="glass-card border-card-border/50">
          <CardContent className="p-6">
            <div className="flex flex-wrap gap-4">
              {/* Search */}
              <div className="flex-1 min-w-[200px]">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-foreground-secondary" />
                  <Input
                    placeholder="Search transactions..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 glass-effect bg-input/50 border-card-border"
                  />
                </div>
              </div>

              {/* Category Filter */}
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-[150px] glass-effect bg-input/50 border-card-border">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent className="glass-card bg-card-glass border-primary/30">
                  <SelectItem value="all">All Categories</SelectItem>
                  {EXPENSE_CATEGORIES.map(category => (
                    <SelectItem key={category} value={category}>{category}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Type Filter */}
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-[120px] glass-effect bg-input/50 border-card-border">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent className="glass-card bg-card-glass border-primary/30">
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="expense">Expenses</SelectItem>
                  <SelectItem value="income">Income</SelectItem>
                </SelectContent>
              </Select>

              {/* Date Range */}
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-[200px] glass-effect bg-input/50 border-card-border justify-start text-left">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {getDateRangeDisplay()}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 glass-card bg-card-glass border-primary/30" align="start">
                  <Calendar
                    initialFocus
                    mode="range"
                    defaultMonth={dateRange.from}
                    selected={{ from: dateRange.from, to: dateRange.to }}
                    onSelect={(range) => setDateRange(range || {})}
                    numberOfMonths={2}
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>

              {/* Sort */}
              <Select value={`${sortBy}-${sortOrder}`} onValueChange={(value) => {
                const [field, order] = value.split('-') as [typeof sortBy, typeof sortOrder];
                setSortBy(field);
                setSortOrder(order);
              }}>
                <SelectTrigger className="w-[150px] glass-effect bg-input/50 border-card-border">
                  <ArrowUpDown className="mr-2 h-4 w-4" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="glass-card bg-card-glass border-primary/30">
                  <SelectItem value="date-desc">Date (Newest)</SelectItem>
                  <SelectItem value="date-asc">Date (Oldest)</SelectItem>
                  <SelectItem value="amount-desc">Amount (High)</SelectItem>
                  <SelectItem value="amount-asc">Amount (Low)</SelectItem>
                  <SelectItem value="description-asc">Name (A-Z)</SelectItem>
                  <SelectItem value="description-desc">Name (Z-A)</SelectItem>
                </SelectContent>
              </Select>

              {/* Clear Filters */}
              {activeFiltersCount > 0 && (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={clearFilters}
                  className="glass-effect border-card-border hover:bg-accent/50"
                >
                  <X className="h-4 w-4 mr-2" />
                  Clear ({activeFiltersCount})
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Transactions List */}
        <Card className="glass-card border-primary/30 bg-primary/5">
          <CardHeader>
            <CardTitle className="text-foreground">Transaction History</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {filteredTransactions.length === 0 ? (
              <div className="text-center py-8 text-foreground-secondary">
                No transactions found matching your filters.
              </div>
            ) : (
              filteredTransactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between p-4 rounded-lg glass-effect bg-card-glass/50 hover:bg-card-glass/80 transition-colors group"
                >
                  <div className="flex items-center gap-4">
                    <div className={`p-2 rounded-lg ${transaction.type === 'expense' ? 'bg-error/10' : 'bg-success/10'}`}>
                      {transaction.type === 'expense' ? (
                        <ArrowDownIcon className="h-4 w-4 text-error" />
                      ) : (
                        <ArrowUpIcon className="h-4 w-4 text-success" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-foreground">{transaction.description}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge 
                          variant="secondary" 
                          className={`text-xs ${getCategoryColor(transaction.category)}`}
                        >
                          {transaction.category}
                        </Badge>
                        <span className="text-sm text-foreground-secondary">
                          {format(new Date(transaction.date), 'MMM dd, yyyy')}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <p className={`font-semibold ${
                        transaction.type === 'expense' ? 'text-error' : 'text-success'
                      }`}>
                        {transaction.type === 'expense' ? '-' : '+'}${transaction.amount.toFixed(2)}
                      </p>
                    </div>
                    
                    {/* Action buttons - shown on hover */}
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button size="sm" variant="ghost" className="h-8 w-8 p-0 hover:bg-primary/10">
                        <Edit2 className="h-3 w-3" />
                      </Button>
                      <Button size="sm" variant="ghost" className="h-8 w-8 p-0 hover:bg-error/10 text-error">
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </FinanceLayout>
  );
};

export default Transactions;