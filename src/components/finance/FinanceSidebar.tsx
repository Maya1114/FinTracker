import { NavLink, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  TrendingUp, 
  PiggyBank, 
  Receipt, 
  Settings,
  Wallet
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

const navigationItems = [
  { title: "Overview", url: "/", icon: LayoutDashboard },
  { title: "Budget", url: "/budget", icon: PiggyBank },
  { title: "Transactions", url: "/transactions", icon: Receipt },
];

export function FinanceSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const isCollapsed = state === "collapsed";

  const getNavClass = (url: string) => {
    const isActive = location.pathname === url;
    return isActive 
      ? "bg-primary/20 text-primary border-r-2 border-primary" 
      : "text-foreground-secondary hover:bg-accent/50 hover:text-foreground";
  };

  return (
    <Sidebar className="border-r border-border/50 glass-effect bg-sidebar/30">
      <SidebarContent className="bg-transparent">
        {/* Logo/Brand */}
        <div className="flex items-center gap-2 p-4 border-b border-border/50">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-primary">
            <Wallet className="h-4 w-4 text-primary-foreground" />
          </div>
          {!isCollapsed && (
            <span className="text-lg font-semibold text-foreground">FinanceTracker</span>
          )}
        </div>

        <SidebarGroup>
          <SidebarGroupLabel className="text-foreground-secondary">
            Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild className="h-10">
                    <NavLink
                      to={item.url}
                      className={({ isActive }) => 
                        `flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 ${
                          isActive 
                            ? "bg-primary/20 text-primary border-r-2 border-primary" 
                            : "text-foreground-secondary hover:bg-accent/50 hover:text-foreground"
                        }`
                      }
                    >
                      <item.icon className="h-4 w-4" />
                      {!isCollapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}