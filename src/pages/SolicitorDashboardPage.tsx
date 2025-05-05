
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import Dashboard from "@/components/Dashboard";
import Navbar from "@/components/Navbar";
import { Loader2 } from "lucide-react";

const SolicitorDashboardPage: React.FC = () => {
  const { user, loading, userRole } = useAuth();
  const navigate = useNavigate();
  const [isCheckingRole, setIsCheckingRole] = useState(true);

  useEffect(() => {
    const checkRole = async () => {
      try {
        if (!loading) {
          const storedRole = sessionStorage.getItem('userRole');
          
          if (!user && !storedRole) {
            console.log("No authenticated user found, redirecting to login");
            navigate("/login", { replace: true });
            return;
          }
          
          // Verify this is the correct role dashboard
          if (storedRole && !storedRole.toLowerCase().includes('solicitor')) {
            console.log("User doesn't have Solicitor role, redirecting to appropriate dashboard");
            navigate("/dashboard", { replace: true });
            return;
          }
          
          setIsCheckingRole(false);
        }
      } catch (error) {
        console.error("Error checking role:", error);
        setIsCheckingRole(false);
      }
    };
    
    checkRole();
  }, [user, loading, navigate]);

  if (loading || isCheckingRole) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary mr-2" />
        <span>Loading Solicitor dashboard...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <div className="flex-1 container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-6">Solicitor Dashboard</h1>
        <Dashboard userRole="Solicitor" />
      </div>
    </div>
  );
};

export default SolicitorDashboardPage;
