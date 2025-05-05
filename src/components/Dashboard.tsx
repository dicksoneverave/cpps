
import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import DefaultDashboard from "./dashboards/DefaultDashboard";
import DynamicDashboard from "./dashboards/DynamicDashboard";
import AdminDashboard from "./dashboards/AdminDashboard";
import EmployerDashboard from "./dashboards/EmployerDashboard";
import RegistrarDashboard from "./dashboards/RegistrarDashboard";
import CommissionerDashboard from "./dashboards/CommissionerDashboard";
import PaymentDashboard from "./dashboards/PaymentDashboard";
import ProvincialClaimsOfficerDashboard from "./dashboards/ProvincialClaimsOfficerDashboard";
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

  // Improved rendering of role-specific dashboards
  const renderRoleDashboard = () => {
    if (!user || !userRole) {
      console.log("No user or role found, showing default dashboard");
      return <DefaultDashboard />;
    }
    
    console.log("Rendering dashboard for role:", userRole);
    
    // Use specific dashboards for common roles
    const lowerCaseRole = userRole.toLowerCase();
    
    if (lowerCaseRole.includes('admin')) {
      return <AdminDashboard />;
    } else if (lowerCaseRole.includes('employer')) {
      return <EmployerDashboard />;
    } else if (lowerCaseRole.includes('registrar')) {
      return <RegistrarDashboard />;
    } else if (lowerCaseRole.includes('commissioner') || lowerCaseRole.includes('chief commissioner')) {
      return <CommissionerDashboard />;
    } else if (lowerCaseRole.includes('payment')) {
      return <PaymentDashboard />;
    } else if (lowerCaseRole.includes('provincialclaimsofficer') || lowerCaseRole.includes('provincial claims officer')) {
      return <ProvincialClaimsOfficerDashboard />;
    }
    
    // If no specific dashboard found, use the DynamicDashboard
    return <DynamicDashboard groupTitle={userRole} />;
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
