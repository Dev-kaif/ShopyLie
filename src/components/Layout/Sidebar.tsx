import { BarChart3, Package, Home, Command, ShoppingCart } from "lucide-react";
import { NavLink } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

const items = [
  { title: "Dashboard", url: "/", icon: Home },
  { title: "Products", url: "/products", icon: Package },
  { title: "Analytics", url: "/analytics", icon: BarChart3 },
  { title: "Orders", url: "/orders", icon: ShoppingCart },
];

export function AppSidebar() {
  const { state } = useSidebar();

  const getNavCls = ({ isActive }: { isActive: boolean }) =>
    isActive
      ? "bg-primary text-black dark:text-white font-medium"
      : "hover:bg-muted/50 text-sidebar-foreground";

  return (
    <Sidebar
      className={(state === "collapsed" ? "w-14" : "w-60") + "border-0" }
      collapsible="icon"
    >
      <SidebarContent className="bg-sidebar border-r border-sidebar-border">
        <div className="p-4 border-b border-sidebar-border">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
              <Command className="h-4 w-4 text-primary-foreground" />
            </div>
            {state !== "collapsed" && (
              <div className="flex flex-col">
                <span className="text-sidebar-foreground font-semibold text-sm">
                  ShopyLie Admin
                </span>
                <span className="text-muted-foreground text-xs">Dashboard</span>
              </div>
            )}
          </div>
        </div>

        <SidebarGroup className="px-2 py-4 ">
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.url} end className={getNavCls}>
                      <item.icon className="h-4 w-4" />
                      {state !== "collapsed" && <span>{item.title}</span>}
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
