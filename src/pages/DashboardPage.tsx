
import React, { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2 } from "lucide-react";
import DashboardChecker from "@/components/dashboard-page/DashboardChecker";
import DashboardContent from "@/components/dashboard-page/DashboardContent";

const DashboardPage: React.FC = () => {
  const { loading } = useAuth();
  const [isChecked, setIsChecked] = useState(false);
  const [displayRole, setDisplayRole] = useState<string | null>(null);

  // Get role from session storage on mount
  useEffect(() => {
    const storedRole = sessionStorage.getItem('userRole');
    if (storedRole) {
      console.log("Found stored role in DashboardPage:", storedRole);
      setDisplayRole(storedRole);
    }
  }, []);

  if (loading || !isChecked) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary mr-2" />
        <span>Loading your dashboard...</span>
      </div>
    );
  }

  return (
    <>
      {/* Consolidated session and role checker */}
      <DashboardChecker 
        setDisplayRole={setDisplayRole} 
        onChecked={() => setIsChecked(true)} 
      />
      
      {/* Render dashboard content once checked */}
      <DashboardContent displayRole={displayRole} />
    </>
  );
};

export default DashboardPage;
