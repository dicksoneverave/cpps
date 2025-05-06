
import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import DashboardFactory from "./dashboards/DashboardFactory";
import RoleDataFetcher from "./dashboard/RoleDataFetcher";
import DebugPanel from "./dashboard/DebugPanel";
import ClaimsSummaryCharts from "./dashboard/ClaimsSummaryCharts";

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

  return (
    <div className="container mx-auto p-4 mt-8">
      <h1 className="text-2xl font-bold mb-6">
        Dashboard - {userRole || 'User'}
        {!userRole && <span className="text-sm text-gray-500 ml-2">(No role assigned)</span>}
      </h1>
      
      {/* Role Data Fetcher with Debug Information */}
      <RoleDataFetcher>
        {({ userId, groupId, groupTitle }) => (
          <DebugPanel 
            userRole={userRole} 
            userId={userId} 
            groupId={groupId} 
            groupTitle={groupTitle} 
          />
        )}
      </RoleDataFetcher>
      
      {/* Role-Specific Dashboard from Factory */}
      <DashboardFactory userRole={userRole} />
      
      {/* Common Dashboard Elements */}
      <ClaimsSummaryCharts 
        injuryClaims={injuryClaims} 
        deathClaims={deathClaims} 
      />
    </div>
  );
};

export default Dashboard;
