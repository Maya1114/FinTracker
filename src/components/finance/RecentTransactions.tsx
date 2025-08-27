import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Expense } from "@/types/finance";
import { format } from "date-fns";
import { ArrowDownIcon, ArrowUpIcon } from "lucide-react";

interface RecentTransactionsProps {
  expenses: Expense[];
}

export function RecentTransactions({ expenses }: RecentTransactionsProps) {
  const recentTransactions = expenses
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

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

  return (
    <Card className="glass-card border-primary/30 bg-primary/5">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-foreground">Recent Transactions</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {recentTransactions.length === 0 ? (
          <p className="text-foreground-secondary text-center py-4">No transactions yet</p>
        ) : (
          recentTransactions.map((transaction) => (
            <div
              key={transaction.id}
              className="flex items-center justify-between p-3 rounded-lg glass-effect bg-card-glass/50 hover:bg-card-glass/80 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${transaction.type === 'expense' ? 'bg-error/10' : 'bg-success/10'}`}>
                  {transaction.type === 'expense' ? (
                    <ArrowDownIcon className="h-4 w-4 text-error" />
                  ) : (
                    <ArrowUpIcon className="h-4 w-4 text-success" />
                  )}
                </div>
                <div>
                  <p className="font-medium text-foreground">{transaction.description}</p>
                  <p className="text-sm text-foreground-secondary">
                    {format(new Date(transaction.date), 'MMM dd, yyyy')}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className={`font-semibold ${
                  transaction.type === 'expense' ? 'text-error' : 'text-success'
                }`}>
                  {transaction.type === 'expense' ? '-' : '+'}${transaction.amount.toFixed(2)}
                </p>
                <Badge 
                  variant="secondary" 
                  className={`text-xs ${getCategoryColor(transaction.category)}`}
                >
                  {transaction.category}
                </Badge>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}