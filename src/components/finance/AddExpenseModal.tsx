import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { EXPENSE_CATEGORIES, Expense } from "@/types/finance";
import { useToast } from "@/hooks/use-toast";
import { useTransactions } from "@/hooks/useTransactions";

interface AddExpenseModalProps {
  onAddExpense?: (expense: Omit<Expense, 'id'>) => void;
}

export function AddExpenseModal({ onAddExpense }: AddExpenseModalProps) {
  const { addTransaction } = useTransactions();
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState<Date>();
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    category: '',
    type: 'expense' as 'expense' | 'income'
  });
  
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.description || !formData.amount || !formData.category || !date) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    const expense: Omit<Expense, 'id'> = {
      description: formData.description,
      amount: parseFloat(formData.amount),
      category: formData.category,
      date: format(date, 'yyyy-MM-dd'),
      type: formData.type
    };

    try {
      // Use Supabase integration
      await addTransaction(expense);
      
      toast({
        title: "Success",
        description: `${formData.type === 'expense' ? 'Expense' : 'Income'} added successfully`,
      });

      // Reset form
      setFormData({ description: '', amount: '', category: '', type: 'expense' });
      setDate(undefined);
      setOpen(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add transaction. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-gradient-primary hover:opacity-90 transition-opacity">
          <Plus className="h-4 w-4 mr-2" />
          Add Transaction
        </Button>
      </DialogTrigger>
      <DialogContent className="glass-card bg-card-glass/90 border-primary/30 sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-foreground">Add New Transaction</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="type" className="text-foreground">Type</Label>
            <Select 
              value={formData.type} 
              onValueChange={(value: 'expense' | 'income') => setFormData(prev => ({ ...prev, type: value }))}
            >
              <SelectTrigger className="glass-effect bg-input/50 border-card-border">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="glass-card bg-card-glass border-primary/30">
                <SelectItem value="expense">Expense</SelectItem>
                <SelectItem value="income">Income</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-foreground">Description</Label>
            <Input
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Enter description..."
              className="glass-effect bg-input/50 border-card-border text-foreground"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount" className="text-foreground">Amount ($)</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              value={formData.amount}
              onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
              placeholder="0.00"
              className="glass-effect bg-input/50 border-card-border text-foreground"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category" className="text-foreground">Category</Label>
            <Select value={formData.category} onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}>
              <SelectTrigger className="glass-effect bg-input/50 border-card-border">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent className="glass-card bg-card-glass border-primary/30">
                {EXPENSE_CATEGORIES.map(category => (
                  <SelectItem key={category} value={category}>{category}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-foreground">Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal glass-effect bg-input/50 border-card-border",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 glass-card bg-card-glass border-primary/30" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  initialFocus
                  className="pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="flex gap-3 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setOpen(false)}
              className="flex-1 glass-effect border-card-border hover:bg-accent/50"
            >
              Cancel
            </Button>
            <Button 
              type="submit"
              className="flex-1 bg-gradient-primary hover:opacity-90 transition-opacity"
            >
              Add Transaction
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}