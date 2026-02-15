import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { AppLayout } from "@/components/layout/AppLayout";
import { LandingOnly } from "@/components/LandingOnly";
import { SupabaseConfigError } from "@/components/SupabaseConfigError";
import { isSupabaseConfigured } from "@/integrations/supabase/client";
import Auth from "./pages/Auth";
import AuthCallback from "./pages/AuthCallback";
import Dashboard from "./pages/Dashboard";
import Habits from "./pages/Habits";
import Achievements from "./pages/Achievements";
import Analytics from "./pages/Analytics";
import Insights from "./pages/Insights";
import Settings from "./pages/Settings";
import SetupHelper from "./pages/SetupHelper";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <Routes>
          <Route path="/setup-helper" element={<SetupHelper />} />
          <Route path="*" element={
            isSupabaseConfigured ? (
              <AuthProvider>
                <Routes>
                  <Route path="/" element={<LandingOnly />} />
                  <Route path="/landing" element={<Navigate to="/" replace />} />
                  <Route path="/auth" element={<Auth />} />
                  <Route path="/auth/callback" element={<AuthCallback />} />
                  <Route element={
                    <ProtectedRoute>
                      <AppLayout />
                    </ProtectedRoute>
                  }>
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/habits" element={<Habits />} />
                    <Route path="/achievements" element={<Achievements />} />
                    <Route path="/analytics" element={<Analytics />} />
                    <Route path="/insights" element={<Insights />} />
                    <Route path="/settings" element={<Settings />} />
                  </Route>
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </AuthProvider>
            ) : (
              <SupabaseConfigError />
            )
          } />
        </Routes>
      </TooltipProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
