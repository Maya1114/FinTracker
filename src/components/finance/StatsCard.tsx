import { ReactNode } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface StatsCardProps {
  title: string;
  value: string;
  icon: ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  variant?: 'default' | 'success' | 'warning' | 'error';
}

export function StatsCard({ title, value, icon, trend, variant = 'default' }: StatsCardProps) {
  const getVariantClasses = () => {
    switch (variant) {
      case 'success':
        return 'border-success/30 bg-success/5';
      case 'warning': 
        return 'border-warning/30 bg-warning/5';
      case 'error':
        return 'border-error/30 bg-error/5';
      default:
        return 'border-primary/30 bg-primary/5';
    }
  };

  const getIconClasses = () => {
    switch (variant) {
      case 'success':
        return 'text-success bg-success/10';
      case 'warning':
        return 'text-warning bg-warning/10';
      case 'error':
        return 'text-error bg-error/10';
      default:
        return 'text-primary bg-primary/10';
    }
  };

  return (
    <Card className={`glass-card ${getVariantClasses()} hover:scale-105 transition-transform duration-200`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-foreground-secondary">
          {title}
        </CardTitle>
        <div className={`h-8 w-8 rounded-lg flex items-center justify-center ${getIconClasses()}`}>
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-foreground">{value}</div>
        {trend && (
          <p className="text-xs text-muted-foreground">
            <span className={trend.isPositive ? "text-success" : "text-error"}>
              {trend.isPositive ? "+" : ""}{trend.value}%
            </span>{" "}
            from last month
          </p>
        )}
      </CardContent>
    </Card>
  );
}