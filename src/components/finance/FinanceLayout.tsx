import { useState } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { FinanceSidebar } from "./FinanceSidebar";
import { Toaster } from "@/components/ui/toaster";
import { Button } from "@/components/ui/button";
import { Settings, LogOut } from "lucide-react";
import { NavLink } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

interface FinanceLayoutProps {
  children: React.ReactNode;
}

export function FinanceLayout({ children }: FinanceLayoutProps) {
  const { user } = useAuth();
  const { toast } = useToast();

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({
        title: "Error",
        description: "Failed to sign out",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-background">
      <SidebarProvider>
        <div className="flex min-h-screen w-full">
          <FinanceSidebar />
          <main className="flex-1 overflow-hidden">
            <header className="flex items-center justify-between h-16 px-6 border-b border-border/50 glass-effect bg-card-glass/30">
              <div className="flex items-center">
                <SidebarTrigger className="text-foreground hover:bg-accent/50" />
                <h1 className="ml-4 text-xl font-semibold text-foreground">Finance Tracker</h1>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-foreground-secondary">{user?.email}</span>
                <Button variant="ghost" size="sm" asChild className="text-foreground-secondary hover:text-foreground">
                  <NavLink to="/settings">
                    <Settings className="h-4 w-4" />
                  </NavLink>
                </Button>
                <Button variant="ghost" size="sm" onClick={handleSignOut} className="text-foreground-secondary hover:text-foreground">
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            </header>
            <div className="p-6 h-[calc(100vh-4rem)] overflow-y-auto">
              {children}
            </div>
          </main>
        </div>
        <Toaster />
      </SidebarProvider>
    </div>
  );
}