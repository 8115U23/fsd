import { Outlet, Link, useLocation } from "react-router";
import { useState } from "react";
import {
  Home,
  Calendar,
  Target,
  Heart,
  Mic,
  BarChart3,
  Clock,
  Users,
  ShoppingCart,
  MessageSquare,
  FileText,
  Lightbulb,
  Focus,
  Layout,
  Bell,
  AlertCircle,
  User,
  Menu,
  X,
  Palette,
  Moon,
  Sun,
  Monitor,
} from "lucide-react";
import { Button } from "../components/ui/button";
import { useTheme } from "../providers/theme-provider";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";

const navItems = [
  { path: "/", label: "Home", icon: Home },
  { path: "/planner", label: "Planner", icon: Calendar },
  { path: "/goals", label: "Goals", icon: Target },
  { path: "/wellness", label: "Wellness", icon: Heart },
  { path: "/voice", label: "Voice", icon: Mic },
  { path: "/analytics", label: "Analytics", icon: BarChart3 },
  { path: "/routines", label: "Routines", icon: Clock },
  { path: "/collaboration", label: "Team", icon: Users },
  { path: "/shopping", label: "Shopping", icon: ShoppingCart },
  { path: "/communication", label: "Messages", icon: MessageSquare },
  { path: "/documents", label: "Documents", icon: FileText },
  { path: "/devices", label: "Devices", icon: Lightbulb },
  { path: "/focus", label: "Focus", icon: Focus },
  { path: "/editor", label: "Editor", icon: Layout },
  { path: "/notifications", label: "Notifications", icon: Bell },
  { path: "/emergency", label: "Emergency", icon: AlertCircle },
  { path: "/profile", label: "Profile", icon: User },
  { path: "/design-system", label: "Design System", icon: Palette },
];

export function MainLayout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { setTheme, theme } = useTheme();

  const isActive = (path: string) => {
    if (path === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex md:flex-col md:w-64 border-r border-border bg-card">
        <div className="p-6 border-b border-border">
          <h1 className="text-xl font-bold bg-gradient-to-r from-[#6366f1] to-[#a855f7] bg-clip-text text-transparent">
            Life Orchestration
          </h1>
          <p className="text-xs text-muted-foreground mt-1">Your unified platform</p>
        </div>
        
        <nav className="flex-1 overflow-y-auto p-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${
                  active
                    ? "bg-gradient-to-r from-[#6366f1]/10 to-[#a855f7]/10 text-[#6366f1] font-medium"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-sm">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-border">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="w-full justify-start gap-2">
                {theme === "light" && <Sun className="w-4 h-4" />}
                {theme === "dark" && <Moon className="w-4 h-4" />}
                {theme === "system" && <Monitor className="w-4 h-4" />}
                <span className="text-sm">Theme</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuItem onClick={() => setTheme("light")}>
                <Sun className="w-4 h-4 mr-2" />
                Light
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("dark")}>
                <Moon className="w-4 h-4 mr-2" />
                Dark
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("system")}>
                <Monitor className="w-4 h-4 mr-2" />
                System
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 bg-card border-b border-border">
        <div className="flex items-center justify-between p-4">
          <h1 className="font-bold bg-gradient-to-r from-[#6366f1] to-[#a855f7] bg-clip-text text-transparent">
            Life Orchestration
          </h1>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="absolute top-full left-0 right-0 bg-card border-b border-border max-h-[calc(100vh-64px)] overflow-y-auto">
            <nav className="p-4 space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.path);
                
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${
                      active
                        ? "bg-gradient-to-r from-[#6366f1]/10 to-[#a855f7]/10 text-[#6366f1] font-medium"
                        : "text-muted-foreground hover:bg-accent"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="text-sm">{item.label}</span>
                  </Link>
                );
              })}
            </nav>
            <div className="p-4 border-t border-border">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="w-full justify-start gap-2">
                    {theme === "light" && <Sun className="w-4 h-4" />}
                    {theme === "dark" && <Moon className="w-4 h-4" />}
                    {theme === "system" && <Monitor className="w-4 h-4" />}
                    <span className="text-sm">Theme</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                  <DropdownMenuItem onClick={() => setTheme("light")}>
                    <Sun className="w-4 h-4 mr-2" />
                    Light
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setTheme("dark")}>
                    <Moon className="w-4 h-4 mr-2" />
                    Dark
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setTheme("system")}>
                    <Monitor className="w-4 h-4 mr-2" />
                    System
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        )}
      </div>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto pt-16 md:pt-0">
        <Outlet />
      </main>
    </div>
  );
}
