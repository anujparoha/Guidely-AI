import { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ErrorBoundary } from "@/components/ui/ErrorBoundary";
import { ToastContainer } from "@/components/ui/ToastContainer";
import { Layout } from "@/components/layout/Layout";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { ProtectedRoute, GuestRoute } from "@/components/auth/RouteGuards";
import { useAuthStore } from "@/store/authStore";
import ChatPage from "@/pages/ChatPage";
import RoadmapPage from "@/pages/RoadmapPage";
import SummarizePage from "@/pages/SummarizePage";
import SearchPage from "@/pages/SearchPage";
import LoginPage from "@/pages/LoginPage";
import SignupPage from "@/pages/SignupPage";
import LandingPage from "@/pages/LandingPage";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 5 * 60 * 1000,
    },
    mutations: {
      retry: 1,
    },
  },
});

function AuthInitializer({ children }: { children: React.ReactNode }) {
  const initialize = useAuthStore((s) => s.initialize);

  useEffect(() => {
    initialize();
  }, [initialize]);

  return <>{children}</>;
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <ErrorBoundary>
          <AuthInitializer>
            <BrowserRouter>
              <Routes>
                {/* Guest-only routes (login/signup/landing) */}
                <Route element={<GuestRoute />}>
                  <Route path="/landing" element={<LandingPage />} />
                  <Route element={<AuthLayout />}>
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/signup" element={<SignupPage />} />
                  </Route>
                </Route>

                {/* Protected routes (require auth) */}
                <Route element={<ProtectedRoute />}>
                  <Route element={<Layout />}>
                    <Route path="/" element={<ChatPage />} />
                    <Route path="/roadmap" element={<RoadmapPage />} />
                    <Route path="/summarize" element={<SummarizePage />} />
                    <Route path="/search" element={<SearchPage />} />
                  </Route>
                </Route>
              </Routes>
            </BrowserRouter>
            <ToastContainer />
          </AuthInitializer>
        </ErrorBoundary>
      </TooltipProvider>
    </QueryClientProvider>
  );
}
