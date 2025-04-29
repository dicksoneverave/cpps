
import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import EmployerDashboard from "./dashboards/EmployerDashboard";
import RegistrarDashboard from "./dashboards/RegistrarDashboard";
import CommissionerDashboard from "./dashboards/CommissionerDashboard";
import PaymentDashboard from "./dashboards/PaymentDashboard";
import AdminDashboard from "./dashboards/AdminDashboard";
import DefaultDashboard from "./dashboards/DefaultDashboard";
import ClaimsChart from "./dashboards/ClaimsCharts";

interface DashboardProps {
  userRole: string;
}

interface ChartData {
  name: string;
  value: number;
  color: string;
}

const Dashboard: React.FC<DashboardProps> = ({ userRole }) => {
  const [injuryClaims, setInjuryClaims] = useState<ChartData[]>([]);
  const [deathClaims, setDeathClaims] = useState<ChartData[]>([]);
  const { user } = useAuth();
  
  useEffect(() => {
    // In a real scenario, we would fetch data from Supabase
    // This is mock data for demonstration
    const mockInjuryData = [
      { name: "Pending", value: 45, color: "#9ca360" },
      { name: "Approved", value: 30, color: "#64805E" },
      { name: "Rejected", value: 15, color: "#8B2303" },
    ];
    
    const mockDeathData = [
      { name: "Pending", value: 20, color: "#5ED0C0" },
      { name: "Approved", value: 15, color: "#30D158" },
      { name: "Rejected", value: 5, color: "#FF9F0A" },
    ];
    
    setInjuryClaims(mockInjuryData);
    setDeathClaims(mockDeathData);
  }, []);

  // Render role-specific dashboard
  const renderRoleDashboard = () => {
    const normalizedRole = userRole?.toLowerCase() || '';
    
    if (!user) return <DefaultDashboard />;
    
    if (normalizedRole.includes('employer')) {
      return <EmployerDashboard />;
    } else if (normalizedRole.includes('registrar') || normalizedRole.includes('deputy registrar')) {
      return <RegistrarDashboard />;
    } else if (normalizedRole.includes('commissioner') || normalizedRole.includes('chief commissioner')) {
      return <CommissionerDashboard />;
    } else if (normalizedRole.includes('payment')) {
      return <PaymentDashboard />;
    } else if (normalizedRole.includes('admin') || normalizedRole.includes('owc admin')) {
      return <AdminDashboard />;
    }
    
    return <DefaultDashboard />;
  };

  const injuryChartConfig = {
    pending: { color: "#9ca360" },
    approved: { color: "#64805E" },
    rejected: { color: "#8B2303" },
  };

  const deathChartConfig = {
    pending: { color: "#5ED0C0" },
    approved: { color: "#30D158" },
    rejected: { color: "#FF9F0A" },
  };

  return (
    <div className="container mx-auto p-4 mt-8">
      <h1 className="text-2xl font-bold mb-6">
        Dashboard - {userRole || 'User'}
        {!userRole && <span className="text-sm text-gray-500 ml-2">(No role assigned)</span>}
      </h1>
      
      {/* Role-Specific Dashboard */}
      {renderRoleDashboard()}
      
      {/* Common Dashboard Elements */}
      <div className="grid md:grid-cols-2 gap-6">
        <ClaimsChart
          claimData={injuryClaims}
          title="Claims for Injury this year"
          description="Distribution of injury claims by status"
          colorConfig={injuryChartConfig}
        />
        
        <ClaimsChart
          claimData={deathClaims}
          title="Claims for Death this year"
          description="Distribution of death claims by status"
          colorConfig={deathChartConfig}
        />
      </div>
    </div>
  );
};

export default Dashboard;
