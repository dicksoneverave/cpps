
import React, { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2 } from "lucide-react";
import SessionChecker from "@/components/dashboard-page/SessionChecker";
import RoleChecker from "@/components/dashboard-page/RoleChecker";
import DashboardContent from "@/components/dashboard-page/DashboardContent";

const DashboardPage: React.FC = () => {
  const { loading } = useAuth();
  const [isSessionChecked, setIsSessionChecked] = useState(false);
  const [displayRole, setDisplayRole] = useState<string | null>(null);

  // Get role from session storage on mount
  useEffect(() => {
    const storedRole = sessionStorage.getItem('userRole');
    if (storedRole) {
      console.log("Found stored role in DashboardPage:", storedRole);
      setDisplayRole(storedRole);
    }
  }, []);

  if (loading || !isSessionChecked) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary mr-2" />
        <span>Loading your dashboard...</span>
      </div>
    );
  }

  return (
    <>
      {/* First check session and redirect if needed */}
      <SessionChecker 
        onSessionChecked={() => setIsSessionChecked(true)} 
        setDisplayRole={setDisplayRole} 
      />
      
      {/* Then check role and redirect if needed */}
      <RoleChecker displayRole={displayRole} setDisplayRole={setDisplayRole} />
      
      {/* Finally render the dashboard content */}
      <DashboardContent displayRole={displayRole} />
    </>
  );
};

export default DashboardPage;
