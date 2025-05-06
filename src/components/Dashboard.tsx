
import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import DashboardFactory from "./dashboards/DashboardFactory";
import DebugPanel from "./dashboard/DebugPanel";
import ClaimsSummaryCharts from "./dashboard/ClaimsSummaryCharts";
import { generateMockClaimsData } from "@/utils/mockData";
import { useRoleData } from "@/hooks/useRoleData";

interface DashboardProps {
  userRole: string;
}

const Dashboard: React.FC<DashboardProps> = ({ userRole }) => {
  const [injuryClaims, setInjuryClaims] = useState([]);
  const [deathClaims, setDeathClaims] = useState([]);
  const { user } = useAuth();
  const roleData = useRoleData();
  
  useEffect(() => {
    // Use the mock data utility function instead of inline mock data
    const { injuryClaims, deathClaims } = generateMockClaimsData();
    
    setInjuryClaims(injuryClaims);
    setDeathClaims(deathClaims);
  }, []);

  return (
    <div className="container mx-auto p-4 mt-8">
      <h1 className="text-2xl font-bold mb-6">
        Dashboard - {userRole || 'User'}
        {!userRole && <span className="text-sm text-gray-500 ml-2">(No role assigned)</span>}
      </h1>
      
      {/* Debug Panel with Role Data from custom hook */}
      <DebugPanel 
        userRole={userRole} 
        userId={roleData.userId} 
        groupId={roleData.groupId} 
        groupTitle={roleData.groupTitle} 
      />
      
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
