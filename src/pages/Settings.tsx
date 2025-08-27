import { useState } from "react";
import { FinanceLayout } from "@/components/finance/FinanceLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { 
  Settings as SettingsIcon, 
  User, 
  Bell, 
  Download, 
  Upload, 
  Trash2,
  Shield,
  Palette,
  Globe,
  CreditCard
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Settings = () => {
  const [settings, setSettings] = useState({
    // Profile
    name: 'John Doe',
    email: 'john.doe@example.com',
    
    // Preferences
    currency: 'USD',
    language: 'en',
    dateFormat: 'MM/dd/yyyy',
    
    // Notifications
    emailNotifications: true,
    budgetAlerts: true,
    weeklyReports: false,
    
    // Privacy
    dataSharing: false,
    analytics: true,
    
    // Categories
    customCategories: ['Groceries', 'Utilities', 'Subscriptions']
  });

  const { toast } = useToast();

  const handleSave = () => {
    toast({
      title: "Settings Saved",
      description: "Your preferences have been updated successfully.",
    });
  };

  const handleExportData = () => {
    toast({
      title: "Export Started",
      description: "Your data export will be ready in a few minutes.",
    });
  };

  const handleImportData = () => {
    toast({
      title: "Import Started", 
      description: "Processing your data file...",
    });
  };

  const addCustomCategory = () => {
    const categoryName = prompt("Enter category name:");
    if (categoryName && categoryName.trim()) {
      setSettings(prev => ({
        ...prev,
        customCategories: [...prev.customCategories, categoryName.trim()]
      }));
      toast({
        title: "Category Added",
        description: `"${categoryName}" has been added to your categories.`,
      });
    }
  };

  const removeCustomCategory = (category: string) => {
    setSettings(prev => ({
      ...prev,
      customCategories: prev.customCategories.filter(c => c !== category)
    }));
    toast({
      title: "Category Removed",
      description: `"${category}" has been removed.`,
    });
  };

  return (
    <FinanceLayout>
      <div className="space-y-6 max-w-4xl">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-gradient-primary">
            <SettingsIcon className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Settings</h1>
            <p className="text-foreground-secondary">Manage your preferences and account settings</p>
          </div>
        </div>

        {/* Profile Settings */}
        <Card className="glass-card border-primary/30 bg-primary/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground">
              <User className="h-5 w-5" />
              Profile Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-foreground">Full Name</Label>
                <Input 
                  value={settings.name}
                  onChange={(e) => setSettings(prev => ({ ...prev, name: e.target.value }))}
                  className="glass-effect bg-input/50 border-card-border text-foreground"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-foreground">Email Address</Label>
                <Input 
                  type="email"
                  value={settings.email}
                  onChange={(e) => setSettings(prev => ({ ...prev, email: e.target.value }))}
                  className="glass-effect bg-input/50 border-card-border text-foreground"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Preferences */}
        <Card className="glass-card border-primary/30 bg-primary/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground">
              <Globe className="h-5 w-5" />
              Preferences
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label className="text-foreground">Currency</Label>
                <Select value={settings.currency} onValueChange={(value) => setSettings(prev => ({ ...prev, currency: value }))}>
                  <SelectTrigger className="glass-effect bg-input/50 border-card-border">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="glass-card bg-card-glass border-primary/30">
                    <SelectItem value="USD">USD ($)</SelectItem>
                    <SelectItem value="EUR">EUR (€)</SelectItem>
                    <SelectItem value="GBP">GBP (£)</SelectItem>
                    <SelectItem value="CAD">CAD (C$)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-foreground">Language</Label>
                <Select value={settings.language} onValueChange={(value) => setSettings(prev => ({ ...prev, language: value }))}>
                  <SelectTrigger className="glass-effect bg-input/50 border-card-border">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="glass-card bg-card-glass border-primary/30">
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="es">Spanish</SelectItem>
                    <SelectItem value="fr">French</SelectItem>
                    <SelectItem value="de">German</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-foreground">Date Format</Label>
                <Select value={settings.dateFormat} onValueChange={(value) => setSettings(prev => ({ ...prev, dateFormat: value }))}>
                  <SelectTrigger className="glass-effect bg-input/50 border-card-border">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="glass-card bg-card-glass border-primary/30">
                    <SelectItem value="MM/dd/yyyy">MM/dd/yyyy</SelectItem>
                    <SelectItem value="dd/MM/yyyy">dd/MM/yyyy</SelectItem>
                    <SelectItem value="yyyy-MM-dd">yyyy-MM-dd</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card className="glass-card border-primary/30 bg-primary/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground">
              <Bell className="h-5 w-5" />
              Notifications
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-foreground">Email Notifications</div>
                  <div className="text-sm text-foreground-secondary">Receive important updates via email</div>
                </div>
                <Switch 
                  checked={settings.emailNotifications}
                  onCheckedChange={(checked) => setSettings(prev => ({ ...prev, emailNotifications: checked }))}
                />
              </div>

              <Separator className="bg-border/50" />

              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-foreground">Budget Alerts</div>
                  <div className="text-sm text-foreground-secondary">Get notified when approaching budget limits</div>
                </div>
                <Switch 
                  checked={settings.budgetAlerts}
                  onCheckedChange={(checked) => setSettings(prev => ({ ...prev, budgetAlerts: checked }))}
                />
              </div>

              <Separator className="bg-border/50" />

              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-foreground">Weekly Reports</div>
                  <div className="text-sm text-foreground-secondary">Receive weekly spending summaries</div>
                </div>
                <Switch 
                  checked={settings.weeklyReports}
                  onCheckedChange={(checked) => setSettings(prev => ({ ...prev, weeklyReports: checked }))}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Custom Categories */}
        <Card className="glass-card border-primary/30 bg-primary/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground">
              <CreditCard className="h-5 w-5" />
              Custom Categories
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {settings.customCategories.map((category) => (
                <div key={category} className="flex items-center gap-2 px-3 py-1 rounded-lg glass-effect bg-card-glass/50 border border-card-border/50">
                  <span className="text-sm text-foreground">{category}</span>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => removeCustomCategory(category)}
                    className="h-4 w-4 p-0 hover:bg-error/10 text-error"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              ))}
              <Button
                size="sm"
                variant="outline"
                onClick={addCustomCategory}
                className="glass-effect border-dashed border-primary/30 hover:bg-primary/5"
              >
                + Add Category
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Data Management */}
        <Card className="glass-card border-primary/30 bg-primary/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground">
              <Shield className="h-5 w-5" />
              Data Management
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button 
                variant="outline" 
                onClick={handleExportData}
                className="flex items-center gap-2 glass-effect border-card-border hover:bg-accent/50"
              >
                <Download className="h-4 w-4" />
                Export Data
              </Button>
              <Button 
                variant="outline" 
                onClick={handleImportData}
                className="flex items-center gap-2 glass-effect border-card-border hover:bg-accent/50"
              >
                <Upload className="h-4 w-4" />
                Import Data
              </Button>
            </div>

            <Separator className="bg-border/50" />

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-foreground">Anonymous Analytics</div>
                  <div className="text-sm text-foreground-secondary">Help improve the app by sharing anonymous usage data</div>
                </div>
                <Switch 
                  checked={settings.analytics}
                  onCheckedChange={(checked) => setSettings(prev => ({ ...prev, analytics: checked }))}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Save Button */}
        <div className="flex justify-end">
          <Button 
            onClick={handleSave}
            className="bg-gradient-primary hover:opacity-90 transition-opacity px-8"
          >
            Save Changes
          </Button>
        </div>
      </div>
    </FinanceLayout>
  );
};

export default Settings;