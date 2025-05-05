
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import Dashboard from "@/components/Dashboard";
import Navbar from "@/components/Navbar";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { fetchRoleByEmail, getRoleFromSessionStorage } from "@/utils/roleUtils";

const DashboardPage: React.FC = () => {
  const { user, loading, userRole } = useAuth();
  const navigate = useNavigate();
  const [isCheckingRole, setIsCheckingRole] = useState(false);
  const [displayRole, setDisplayRole] = useState<string | null>(null);

  useEffect(() => {
    // Try to get the role from session storage first
    const storedRole = getRoleFromSessionStorage();
    if (storedRole) {
      console.log("Using stored role:", storedRole);
      setDisplayRole(storedRole);
    } else {
      setDisplayRole(userRole);
    }

    const checkUserRole = async () => {
      if (!user) return;
      
      setIsCheckingRole(true);
      
      try {
        // If we don't have a role yet, try to fetch it directly
        if (!displayRole && !userRole && user.email !== "administrator@gmail.com") {
          console.log("No role found in context or session, fetching directly...");
          const fetchedRole = await fetchRoleByEmail(user.email || "");
          console.log("Directly fetched role:", fetchedRole);
          setDisplayRole(fetchedRole);
        }
      } catch (error) {
        console.error("Error checking user role:", error);
      } finally {
        setIsCheckingRole(false);
      }
    };
    
    if (user && !loading) {
      checkUserRole();
    }
  }, [user, userRole, loading, displayRole]);
  
  useEffect(() => {
    // Check if session exists to prevent redirecting too early
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      
      if (!data.session) {
        // No session means not logged in
        console.log("No session found, redirecting to login");
        navigate("/login", { replace: true });
        return;
      }
      
      if (!loading && !isCheckingRole) {
        if (!user) {
          // Double-check: redirect to login if no user
          console.log("No user found, redirecting to login");
          navigate("/login", { replace: true });
          return;
        }
        
        // Special case for administrator@gmail.com
        if (user.email === "administrator@gmail.com") {
          console.log("Admin user found, redirecting to admin page");
          navigate("/admin", { replace: true });
          return;
        }
      }
    };
    
    checkSession();
  }, [user, loading, navigate, isCheckingRole]);

  if (loading || isCheckingRole) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary mr-2" />
        <span>Loading your dashboard...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <div className="flex-1 container mx-auto p-4">
        <Dashboard userRole={displayRole || ""} />
      </div>
    </div>
  );
};

export default DashboardPage;
