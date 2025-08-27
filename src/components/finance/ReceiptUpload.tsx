import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Upload, Receipt as ReceiptIcon, Check } from "lucide-react";
import { Receipt, Expense } from "@/types/finance";
import { sampleReceipts } from "@/data/mockData";
import { useToast } from "@/hooks/use-toast";

interface ReceiptUploadProps {
  onProcessReceipt: (expense: Omit<Expense, 'id'>) => void;
}

export function ReceiptUpload({ onProcessReceipt }: ReceiptUploadProps) {
  const [open, setOpen] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState<Receipt | null>(null);
  const [processing, setProcessing] = useState(false);
  
  const { toast } = useToast();

  const handleProcessReceipt = async (receipt: Receipt) => {
    setProcessing(true);
    setSelectedReceipt(receipt);

    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 2000));

    const expense: Omit<Expense, 'id'> = {
      description: receipt.name,
      amount: receipt.amount,
      category: receipt.category,
      date: receipt.date,
      type: 'expense'
    };

    onProcessReceipt(expense);
    
    toast({
      title: "Receipt Processed!",
      description: `Added expense: ${receipt.name} - $${receipt.amount}`,
    });

    setProcessing(false);
    setSelectedReceipt(null);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="glass-effect border-primary/30 hover:bg-primary/10">
          <Upload className="h-4 w-4 mr-2" />
          Upload Receipt
        </Button>
      </DialogTrigger>
      <DialogContent className="glass-card bg-card-glass/90 border-primary/30 sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-foreground flex items-center gap-2">
            <ReceiptIcon className="h-5 w-5" />
            Process Receipt
          </DialogTitle>
        </DialogHeader>
        
        {processing ? (
          <div className="flex flex-col items-center justify-center py-8 space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            <p className="text-foreground">Processing receipt...</p>
            <p className="text-sm text-foreground-secondary">Extracting expense data</p>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-foreground-secondary">
              Select a sample receipt to process into an expense:
            </p>
            
            <div className="grid grid-cols-2 gap-4 max-h-[400px] overflow-y-auto">
              {sampleReceipts.map((receipt) => (
                <Card 
                  key={receipt.id}
                  className="glass-card border-card-border/50 hover:border-primary/50 cursor-pointer transition-all duration-200 hover:scale-105"
                  onClick={() => handleProcessReceipt(receipt)}
                >
                  <CardContent className="p-4">
                    <div className="aspect-[3/4] bg-gradient-card rounded-lg mb-3 flex items-center justify-center">
                      <ReceiptIcon className="h-8 w-8 text-primary/60" />
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-medium text-foreground text-sm">{receipt.name}</h4>
                      <div className="flex justify-between items-center">
                        <span className="font-semibold text-success">${receipt.amount}</span>
                        <Badge 
                          variant="secondary"
                          className="text-xs bg-primary/10 text-primary border-primary/20"
                        >
                          {receipt.category}
                        </Badge>
                      </div>
                      <p className="text-xs text-foreground-secondary">{receipt.date}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            <div className="border-t border-border/50 pt-4">
              <Button 
                variant="outline" 
                className="w-full glass-effect border-dashed border-primary/30 hover:bg-primary/5"
              >
                <Upload className="h-4 w-4 mr-2" />
                Upload Your Own Receipt (Demo)
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}