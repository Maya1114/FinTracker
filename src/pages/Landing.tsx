import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  DollarSign,
  TrendingUp,
  PieChart,
  Receipt,
  Calendar,
  Shield,
  Zap,
  BarChart3,
  Camera,
  RefreshCw,
  ArrowRight,
  CheckCircle,
} from "lucide-react";
import { Link } from "react-router-dom";

export default function Landing() {
  const features = [
    {
      icon: <BarChart3 className="h-6 w-6" />,
      title: "Financial Dashboard",
      description:
        "Get a complete overview of your finances with beautiful charts and real-time insights into your spending patterns.",
    },
    {
      icon: <Receipt className="h-6 w-6" />,
      title: "Receipt Scanning",
      description:
        "Upload receipts and automatically extract transaction details with AI-powered processing.",
    },
    {
      icon: <PieChart className="h-6 w-6" />,
      title: "Category Analysis",
      description:
        "Understand your spending habits with detailed category breakdowns and trend analysis.",
    },
    {
      icon: <RefreshCw className="h-6 w-6" />,
      title: "Recurring Transactions",
      description:
        "Set up automatic recurring income and expenses to streamline your financial tracking.",
    },
    {
      icon: <TrendingUp className="h-6 w-6" />,
      title: "Spending Trends",
      description:
        "Visualize your financial trends over time with interactive charts and monthly comparisons.",
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: "Secure & Private",
      description:
        "Your financial data is encrypted and secure with user-level access controls and privacy protection.",
    },
  ];

  const benefits = [
    "Track income and expenses effortlessly",
    "Visualize spending patterns with charts",
    "Upload and process receipts automatically",
    "Set up recurring transactions",
    "Get insights into your financial health",
    "Export data for tax preparation",
  ];

  return (
    <div className="min-h-screen bg-gradient-background">
      {/* Header */}
      <header className="border-b border-primary/20 bg-card-glass/30 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-primary/10">
              <DollarSign className="h-6 w-6 text-primary" />
            </div>
            <span className="text-xl font-bold text-foreground">
              Finance Tracker
            </span>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/auth">
              <Button
                variant="ghost"
                className="text-foreground-secondary hover:text-foreground"
              >
                Sign In
              </Button>
            </Link>
            <Link to="/auth">
              <Button className="bg-gradient-primary hover:opacity-90">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <Badge className="mb-4 bg-primary/10 text-primary border-primary/30">
          Smart Financial Management
        </Badge>
        <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
          Take Control of Your{" "}
          <span className="bg-gradient-primary bg-clip-text text-transparent">
            Financial Future
          </span>
        </h1>
        <p className="text-xl text-foreground-secondary mb-8 max-w-2xl mx-auto leading-relaxed">
          Track expenses, analyze spending patterns, and make smarter financial
          decisions with our intuitive dashboard and AI-powered insights.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Link to="/auth">
            <Button
              size="lg"
              className="bg-gradient-primary hover:opacity-90 text-lg px-8 py-3"
            >
              Start Tracking
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>

        {/* Benefits List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-2xl mx-auto">
          {benefits.map((benefit, index) => (
            <div
              key={index}
              className="flex items-center gap-2 text-foreground-secondary"
            >
              <CheckCircle className="h-4 w-4 text-success flex-shrink-0" />
              <span className="text-sm">{benefit}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Everything You Need to Manage Your Money
          </h2>
          <p className="text-lg text-foreground-secondary max-w-2xl mx-auto">
            Powerful features designed to simplify your financial life and give
            you complete visibility into your spending.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="glass-card border-primary/30 bg-primary/5 hover:scale-105 transition-all duration-300"
            >
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-4">
                  {feature.icon}
                </div>
                <CardTitle className="text-xl text-foreground">
                  {feature.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-foreground-secondary leading-relaxed">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
            Ready to Transform Your Financial Life?
          </h2>
          <p className="text-lg text-foreground-secondary mb-8">
            Take control of your finances with our simple and intuitive
            platform.
          </p>
          <Link to="/auth">
            <Button
              size="lg"
              className="bg-gradient-primary hover:opacity-90 text-lg px-12 py-4"
            >
              <Zap className="mr-2 h-5 w-5" />
              Get Started Now - It's Free
            </Button>
          </Link>
          <p className="text-sm text-foreground-secondary mt-4">
            No credit card required • Setup in under 2 minutes
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-primary/20 bg-card-glass/30 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <div className="p-2 rounded-lg bg-primary/10">
                <DollarSign className="h-5 w-5 text-primary" />
              </div>
              <span className="font-semibold text-foreground">
                Finance Tracker
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
