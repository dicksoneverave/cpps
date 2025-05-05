
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
import DeputyRegistrarDashboardPage from "./pages/DeputyRegistrarDashboardPage";
import AgentLawyerDashboardPage from "./pages/AgentLawyerDashboardPage";
import DataEntryDashboardPage from "./pages/DataEntryDashboardPage";
import TribunalDashboardPage from "./pages/TribunalDashboardPage";
import FOSDashboardPage from "./pages/FOSDashboardPage";
import InsuranceDashboardPage from "./pages/InsuranceDashboardPage";
import SolicitorDashboardPage from "./pages/SolicitorDashboardPage";
import ClaimsManagerDashboardPage from "./pages/ClaimsManagerDashboardPage";
import StatisticalDashboardPage from "./pages/StatisticalDashboardPage";
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
            <Route path="/deputy-registrar-dashboard" element={<DeputyRegistrarDashboardPage />} />
            <Route path="/agent-lawyer-dashboard" element={<AgentLawyerDashboardPage />} />
            <Route path="/data-entry-dashboard" element={<DataEntryDashboardPage />} />
            <Route path="/tribunal-dashboard" element={<TribunalDashboardPage />} />
            <Route path="/fos-dashboard" element={<FOSDashboardPage />} />
            <Route path="/insurance-dashboard" element={<InsuranceDashboardPage />} />
            <Route path="/solicitor-dashboard" element={<SolicitorDashboardPage />} />
            <Route path="/claims-manager-dashboard" element={<ClaimsManagerDashboardPage />} />
            <Route path="/statistical-dashboard" element={<StatisticalDashboardPage />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </TooltipProvider>
      </AuthProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
