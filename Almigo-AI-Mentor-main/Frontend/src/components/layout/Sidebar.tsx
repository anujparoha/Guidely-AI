import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import {
  MessageSquare,
  Map,
  FileText,
  Users,
  GraduationCap,
  X,
  LogOut,
} from "lucide-react";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/authStore";
import { useToastStore } from "@/store/toastStore";
import { useChatStore } from "@/store/chatStore";

const NAV_ITEMS = [
  {
    to: "/",
    icon: MessageSquare,
    label: "Chat",
    gradient: "from-teal-500 to-cyan-400",
  },
  {
    to: "/roadmap",
    icon: Map,
    label: "Roadmap",
    gradient: "from-cyan-400 to-teal-500",
  },
  {
    to: "/summarize",
    icon: FileText,
    label: "Summarize",
    gradient: "from-teal-400 to-emerald-400",
  },
  {
    to: "/search",
    icon: Users,
    label: "Search Mentors",
    gradient: "from-emerald-500 to-cyan-400",
  },
];

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const { user, logout } = useAuthStore();
  const addToast = useToastStore((s) => s.addToast);
  const clearMessages = useChatStore((s) => s.clearMessages);

  async function handleLogout() {
    await logout();
    clearMessages();
    addToast({ type: "info", message: "Signed out successfully." });
  }

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 h-full z-50 w-64 bg-card border-r flex flex-col transition-transform duration-300",
          "lg:translate-x-0 lg:static lg:z-auto",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Logo */}
        <div className="p-4 border-b flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-teal-500 to-cyan-400 flex items-center justify-center text-white shadow-md shadow-teal-500/25">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <h1 className="font-bold text-sm leading-tight">Almigo</h1>
              <p className="text-[10px] text-muted-foreground leading-tight">
                AI Mentor
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="lg:hidden h-8 w-8"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-3 space-y-1">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={onClose}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                )
              }
            >
              {({ isActive }) => (
                <>
                  <div
                    className={cn(
                      "w-8 h-8 rounded-lg flex items-center justify-center shrink-0",
                      isActive
                        ? "bg-white/20"
                        : `bg-gradient-to-br ${item.gradient} text-white`
                    )}
                  >
                    <item.icon className="w-4 h-4" />
                  </div>
                  {item.label}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* User profile + footer */}
        <div className="p-3 border-t space-y-3">
          {/* User info */}
          {user && (
            <div className="flex items-center gap-3 px-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-teal-500 to-cyan-400 flex items-center justify-center text-white text-xs font-bold shrink-0">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{user.name}</p>
                <p className="text-[10px] text-muted-foreground truncate">
                  {user.email}
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon-xs"
                onClick={handleLogout}
                className="shrink-0 text-muted-foreground hover:text-destructive"
                title="Sign out"
              >
                <LogOut className="w-3.5 h-3.5" />
              </Button>
            </div>
          )}

          {/* Version + theme */}
          <div className="flex items-center justify-between px-2">
            <span className="text-xs text-muted-foreground">v1.0</span>
            <ThemeToggle />
          </div>
        </div>
      </aside>
    </>
  );
}
