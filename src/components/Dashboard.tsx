
import React, { useState, useEffect, useMemo } from "react";
import { useAuth } from "@/contexts/AuthContext";
import DashboardFactory from "./dashboards/DashboardFactory";
import DebugPanel from "./dashboard/DebugPanel";
import ClaimsSummaryCharts from "./dashboard/ClaimsSummaryCharts";
import { generateMockClaimsData } from "@/utils/mockData";
import { Skeleton } from "./ui/skeleton";

interface DashboardProps {
  userRole: string;
}

const Dashboard: React.FC<DashboardProps> = ({ userRole }) => {
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  
  // Generate mock data once using useMemo instead of in an effect
  const { injuryClaims, deathClaims } = useMemo(() => {
    return generateMockClaimsData();
  }, []);
  
  // Simulate data loading with a short timeout instead of doing it in an effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 300);
    
    return () => clearTimeout(timer);
  }, []);

  // Role info for debug panel - avoid fetching from database
  const roleInfo = useMemo(() => {
    const userId = user?.id || sessionStorage.getItem('userId') || null;
    const groupId = null; // We don't need to fetch this separately anymore
    const groupTitle = userRole || sessionStorage.getItem('userRole') || null;
    
    return { userId, groupId, groupTitle };
  }, [user, userRole]);

  return (
    <div className="container mx-auto p-4 mt-8">
      <h1 className="text-2xl font-bold mb-6">
        Dashboard - {userRole || 'User'}
        {!userRole && <span className="text-sm text-gray-500 ml-2">(No role assigned)</span>}
      </h1>
      
      {/* Debug Panel with Role Data */}
      <DebugPanel 
        userRole={roleInfo.groupTitle} 
        userId={roleInfo.userId} 
        groupId={roleInfo.groupId} 
        groupTitle={roleInfo.groupTitle} 
      />
      
      {/* Role-Specific Dashboard from Factory */}
      {loading ? (
        <div className="space-y-4">
          <Skeleton className="h-40 w-full" />
          <Skeleton className="h-60 w-full" />
        </div>
      ) : (
        <>
          <DashboardFactory userRole={userRole} />
          
          {/* Common Dashboard Elements */}
          <ClaimsSummaryCharts 
            injuryClaims={injuryClaims} 
            deathClaims={deathClaims} 
          />
        </>
      )}
    </div>
  );
};

export default Dashboard;
