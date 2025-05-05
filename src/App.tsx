
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import React from "react";
import Index from "./pages/Index";
import Home from "./pages/Home";
import Auth from "./pages/Auth";
import DashboardPage from "./pages/DashboardPage";
import AdminDashboardPage from "./pages/AdminDashboardPage";
import EmployerDashboardPage from "./pages/EmployerDashboardPage";
import RegistrarDashboardPage from "./pages/RegistrarDashboardPage";
import CommissionerDashboardPage from "./pages/CommissionerDashboardPage";
import PaymentDashboardPage from "./pages/PaymentDashboardPage";
import PCODashboardPage from "./pages/PCODashboardPage";
import NotFound from "./pages/NotFound";

// Create a new QueryClient instance
const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Auth />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/admin" element={<AdminDashboardPage />} />
            <Route path="/employer-dashboard" element={<EmployerDashboardPage />} />
            <Route path="/registrar-dashboard" element={<RegistrarDashboardPage />} />
            <Route path="/commissioner-dashboard" element={<CommissionerDashboardPage />} />
            <Route path="/payment-dashboard" element={<PaymentDashboardPage />} />
            <Route path="/pco-dashboard" element={<PCODashboardPage />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </TooltipProvider>
      </AuthProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
