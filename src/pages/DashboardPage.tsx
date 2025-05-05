
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
  const [isCheckingSession, setIsCheckingSession] = useState(true);

  useEffect(() => {
    // First, check if we already have a role saved in session storage
    const storedRole = getRoleFromSessionStorage();
    if (storedRole) {
      console.log("Using stored role in DashboardPage:", storedRole);
      setDisplayRole(storedRole);
    } else {
      setDisplayRole(userRole);
    }

    // Check for session to determine auth status
    const checkSession = async () => {
      setIsCheckingSession(true);
      try {
        console.log("Checking session in DashboardPage...");
        const { data } = await supabase.auth.getSession();
        
        if (!data.session) {
          console.log("No session found in DashboardPage, redirecting to login");
          navigate("/login", { replace: true });
          return;
        } else {
          console.log("Session found in DashboardPage:", data.session.user.email);
          // Special case for administrator@gmail.com
          if (data.session.user.email === "administrator@gmail.com") {
            console.log("Admin user found, redirecting to admin page");
            navigate("/admin", { replace: true });
            return;
          }
        }
      } catch (error) {
        console.error("Error checking session:", error);
      } finally {
        setIsCheckingSession(false);
      }
    };
    
    checkSession();
  }, [navigate, userRole]);

  useEffect(() => {
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

  if (loading || isCheckingRole || isCheckingSession) {
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
