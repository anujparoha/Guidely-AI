import { Outlet } from "react-router-dom";
import { GraduationCap } from "lucide-react";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

export function AuthLayout() {
  return (
    <div className="min-h-screen relative flex flex-col items-center justify-center bg-background p-4">
      {/* Ambient gradient blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-gradient-to-br from-teal-500/8 to-cyan-500/5 blur-3xl" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 rounded-full bg-gradient-to-br from-cyan-500/8 to-emerald-500/5 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-gradient-to-br from-teal-500/3 to-transparent blur-3xl" />
      </div>

      {/* Theme toggle */}
      <div className="absolute top-4 right-4 z-10">
        <ThemeToggle />
      </div>

      {/* Logo */}
      <div className="relative z-10 flex items-center gap-3 mb-8">
        <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-teal-500 to-cyan-400 flex items-center justify-center text-white shadow-lg shadow-teal-500/25">
          <GraduationCap className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-xl font-bold tracking-tight">Almigo</h1>
          <p className="text-xs text-muted-foreground">AI Mentor Assistant</p>
        </div>
      </div>

      {/* Auth Card */}
      <div className="relative z-10 w-full max-w-md">
        <div className="rounded-2xl border border-border/60 bg-card/80 backdrop-blur-xl shadow-xl shadow-black/5 dark:shadow-black/30 p-8">
          <Outlet />
        </div>
      </div>

      {/* Footer */}
      <p className="relative z-10 mt-8 text-xs text-muted-foreground/60">
        © 2026 Almigo. All rights reserved.
      </p>
    </div>
  );
}
