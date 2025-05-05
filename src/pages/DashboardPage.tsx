import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import Dashboard from "@/components/Dashboard";
import Navbar from "@/components/Navbar";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { fetchRoleByEmail, getRoleFromSessionStorage } from "@/utils/roles";

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
        const storedEmail = sessionStorage.getItem('currentUserEmail');
        
        if (!data.session && !storedRole && !storedEmail) {
          console.log("No session or role found in DashboardPage, redirecting to login");
          navigate("/login", { replace: true });
          return;
        } else if (data.session) {
          console.log("Session found in DashboardPage:", data.session.user.email);
          
          // Special case for administrator@gmail.com
          if (data.session.user.email === "administrator@gmail.com") {
            console.log("Admin user found, redirecting to admin page");
            navigate("/admin", { replace: true });
            return;
          }
          
          // For all other users with sessions, we can stay on dashboard
          console.log("Regular user with session found, allowing dashboard access");
        } else if (storedEmail) {
          console.log("No Supabase session but found email in sessionStorage:", storedEmail);
          
          if (storedEmail === "administrator@gmail.com") {
            console.log("Admin email found in session storage, redirecting to admin page");
            navigate("/admin", { replace: true });
            return;
          }
          
          console.log("Regular user email found in session storage, allowing dashboard access");
        } else if (storedRole) {
          console.log("No Supabase session but found role in sessionStorage, allowing dashboard access");
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
      if (!user && !getRoleFromSessionStorage() && !sessionStorage.getItem('currentUserEmail')) {
        console.log("No user, role, or email found, skipping role check");
        return;
      }
      
      setIsCheckingRole(true);
      
      try {
        // If we don't have a role yet, try to fetch it directly
        if (!displayRole && !userRole) {
          const email = user?.email || sessionStorage.getItem('currentUserEmail');
          
          if (email && email !== "administrator@gmail.com") {
            console.log("No role found in context or session, fetching directly...");
            const fetchedRole = await fetchRoleByEmail(email);
            console.log("Directly fetched role:", fetchedRole);
            setDisplayRole(fetchedRole);
          }
        }
      } catch (error) {
        console.error("Error checking user role:", error);
      } finally {
        setIsCheckingRole(false);
      }
    };
    
    if (!loading) {
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
        <Dashboard userRole={displayRole || "User"} />
      </div>
    </div>
  );
};

export default DashboardPage;
