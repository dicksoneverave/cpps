
import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import DashboardFactory from "./dashboards/DashboardFactory";
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

  // Retrieve the stored role for debugging
  const storedRole = sessionStorage.getItem('userRole');
  
  return (
    <div className="container mx-auto p-4 mt-8">
      <h1 className="text-2xl font-bold mb-6">
        Dashboard - {userRole || 'User'}
        {!userRole && <span className="text-sm text-gray-500 ml-2">(No role assigned)</span>}
      </h1>
      
      {/* Debug information */}
      <div className="bg-yellow-50 border border-yellow-200 rounded p-4 mb-6">
        <h2 className="text-lg font-semibold mb-2">Debugging Information</h2>
        <div className="space-y-1 text-sm">
          <p><strong>Passed userRole prop:</strong> {userRole || 'Not set'}</p>
          <p><strong>Stored Role in Session:</strong> {storedRole || 'Not stored in session'}</p>
          <p><strong>Current URL:</strong> {window.location.pathname}</p>
          <p><strong>Expected URL:</strong> {getDashboardPathFromRole(storedRole || userRole)}</p>
        </div>
      </div>
      
      {/* Role-Specific Dashboard from Factory */}
      <DashboardFactory userRole={userRole} />
      
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

// Helper function to determine expected dashboard path
const getDashboardPathFromRole = (role: string | null): string => {
  if (!role) return "/dashboard";
  
  const lowerRole = role.toLowerCase();
  
  if (lowerRole.includes('admin')) {
    return "/admin";
  } else if (lowerRole.includes('employer')) {
    return "/employer-dashboard";
  } else if (lowerRole.includes('deputy registrar')) {
    return "/deputy-registrar-dashboard";
  } else if (lowerRole.includes('registrar')) {
    return "/registrar-dashboard";
  } else if (lowerRole.includes('commissioner')) {
    return "/commissioner-dashboard";
  } else if (lowerRole.includes('payment')) {
    return "/payment-dashboard";
  } else if (lowerRole.includes('provincial') && lowerRole.includes('claims') || lowerRole.includes('provincialclaimsofficer')) {
    return "/pco-dashboard";
  } else if (lowerRole.includes('agent') || lowerRole.includes('lawyer')) {
    return "/agent-lawyer-dashboard";
  } else if (lowerRole.includes('data entry')) {
    return "/data-entry-dashboard";
  } else if (lowerRole.includes('tribunal')) {
    return "/tribunal-dashboard";
  } else if (lowerRole.includes('fos')) {
    return "/fos-dashboard";
  } else if (lowerRole.includes('insurance')) {
    return "/insurance-dashboard";
  } else if (lowerRole.includes('solicitor')) {
    return "/solicitor-dashboard";
  } else if (lowerRole.includes('claims manager')) {
    return "/claims-manager-dashboard";
  } else if (lowerRole.includes('statistical')) {
    return "/statistical-dashboard";
  }
  
  return "/dashboard";
};

export default Dashboard;
