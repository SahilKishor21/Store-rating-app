import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Store,
  Star,
  User,
  Menu,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import useAuthStore from "@/stores/authStore";
import { NAVIGATION_ITEMS } from "@/utils/constants";
import { cn } from "@/lib/utils";

const iconMap = {
  LayoutDashboard,
  Users,
  Store,
  Star,
  User,
};

const SidebarContent = ({ className }) => {
  const { user } = useAuthStore();
  const location = useLocation();

  if (!user) return null;

  const navigationItems = NAVIGATION_ITEMS[user.role] || [];

  return (
    <div className={cn("flex flex-col h-full", className)}>
      <div className="flex items-center justify-start lg:p-6 h-16 border-b bg-white dark:bg-gray-900">
        <div className="flex items-center space-x-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 text-white font-bold shadow-lg group-hover:shadow-xl transition-shadow">
            <Star className="h-5 w-5" />
          </div>
          <span className="font-bold text-lg">Store Rating</span>
        </div>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-2">
        {navigationItems.map((item) => {
          const Icon = iconMap[item.icon];
          const isActive = location.pathname === item.href;

          return (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                "flex items-center space-x-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-white hover:text-foreground dark:hover:bg-gray-800",
                isActive && "bg-accent text-accent-foreground"
              )}
            >
              <Icon className="h-4 w-4" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="border-t px-4 py-4 ">
        <div className="flex items-center space-x-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-medium">
            {user.name?.charAt(0)?.toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{user.name}</p>
            <p className="text-xs text-muted-foreground truncate">
              {user.email}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const Sidebar = () => {
  const [open, setOpen] = React.useState(false);

  return (
    <>
      {/* Mobile Sidebar */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="fixed top-4 left-4 z-50 md:hidden"
          >
            <Menu className="h-4 w-4" />
            <span className="sr-only">Toggle sidebar</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0 w-72">
          <SidebarContent />
        </SheetContent>
      </Sheet>

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex md:w-72 md:flex-col md:fixed md:inset-y-0 bg-background border-r bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <SidebarContent />
      </aside>
    </>
  );
};

export default Sidebar;
