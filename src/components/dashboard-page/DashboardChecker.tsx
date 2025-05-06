
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";
import { getDashboardPathByGroupTitle } from "@/services/admin/userGroupService";
import { useToast } from "@/components/ui/use-toast";

/**
 * Consolidated component that handles both session and role checking
 */
interface DashboardCheckerProps {
  setDisplayRole: React.Dispatch<React.SetStateAction<string | null>>;
  onChecked: () => void;
}

// Define a type for the user group structure
interface UserGroup {
  title: string;
  id: string | number;
}

const DashboardChecker: React.FC<DashboardCheckerProps> = ({ 
  setDisplayRole,
  onChecked
}) => {
  const { user, loading } = useAuth();
  const [isChecking, setIsChecking] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Known email role mappings
  const knownEmailRoleMappings: Record<string, string> = {
    "dr@owc.gov.pg": "Commissioner",
    "dr@owc.govpg": "Commissioner",
    "administrator@gmail.com": "OWC Admin"
  };

  useEffect(() => {
    const checkSessionAndRole = async () => {
      setIsChecking(true);
      try {
        // First check if we already have a role in session storage
        const storedRole = sessionStorage.getItem('userRole');
        const storedEmail = sessionStorage.getItem('currentUserEmail');
        console.log("Checking stored role and email:", storedRole, storedEmail);
        
        // Check current session
        const { data } = await supabase.auth.getSession();
        
        // If no session and no stored credentials, redirect to login
        if (!data.session && !storedRole && !storedEmail) {
          console.log("No session or credentials found, redirecting to login");
          navigate("/login", { replace: true });
          return;
        }
        
        // Handle administrator users first (fastest path)
        const userEmail = data.session?.user?.email || storedEmail;
        if (userEmail === "administrator@gmail.com") {
          console.log("Admin user detected, redirecting to admin page");
          sessionStorage.setItem('userRole', 'OWC Admin');
          setDisplayRole('OWC Admin');
          navigate("/admin", { replace: true });
          return;
        }
        
        // Check for known role mappings (second fastest path)
        if (userEmail && knownEmailRoleMappings[userEmail]) {
          const knownRole = knownEmailRoleMappings[userEmail];
          console.log(`Known role mapping for ${userEmail}: ${knownRole}`);
          sessionStorage.setItem('userRole', knownRole);
          setDisplayRole(knownRole);
          
          const dashboardPath = getDashboardPathByGroupTitle(knownRole);
          navigate(dashboardPath, { replace: true });
          return;
        }
        
        // If we have a stored role, use it (third fastest path)
        if (storedRole) {
          console.log("Using stored role:", storedRole);
          setDisplayRole(storedRole);
          const dashboardPath = getDashboardPathByGroupTitle(storedRole);
          if (dashboardPath !== "/dashboard") {
            navigate(dashboardPath, { replace: true });
          }
          return;
        }
        
        // Last resort: fetch role from database
        if (data.session?.user?.id) {
          console.log("Fetching role from database for user:", data.session.user.id);
          await fetchRoleFromDatabase(data.session.user.id, userEmail);
        }
      } catch (error) {
        console.error("Error checking session/role:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to verify your session. Please try logging in again.",
        });
      } finally {
        setIsChecking(false);
        onChecked();
      }
    };
    
    if (!loading) {
      checkSessionAndRole();
    }
  }, [loading, navigate, setDisplayRole, onChecked, toast]);

  // Helper function to fetch role from database
  const fetchRoleFromDatabase = async (userId: string, userEmail: string | null) => {
    try {
      // Single database query to get user's group
      const { data: userGroupData, error: userGroupError } = await supabase
        .from('owc_user_usergroup_map')
        .select(`
          group_id,
          owc_usergroups:group_id(
            id, 
            title
          )
        `)
        .eq('auth_user_id', userId)
        .maybeSingle();
        
      if (userGroupError) {
        console.error("Error fetching user group data:", userGroupError);
        sessionStorage.setItem('userRole', 'User');
        setDisplayRole('User');
        return;
      }
      
      // Check if we have valid data and extract the user group if available
      if (userGroupData?.owc_usergroups && 
          typeof userGroupData.owc_usergroups === 'object' && 
          'title' in userGroupData.owc_usergroups &&
          'id' in userGroupData.owc_usergroups) {
        
        // Now we can safely access the title property
        const title = userGroupData.owc_usergroups.title;
        
        if (title) {
          console.log("Found user role directly:", title);
          sessionStorage.setItem('userRole', title);
          setDisplayRole(title);
          
          const dashboardPath = getDashboardPathByGroupTitle(title);
          navigate(dashboardPath, { replace: true });
          return;
        }
      }
      
      // Default to basic user if no role found
      console.log("No specific role found, setting default role");
      const defaultRole = "User";
      sessionStorage.setItem('userRole', defaultRole);
      setDisplayRole(defaultRole);
    } catch (error) {
      console.error("Error fetching role from database:", error);
      // Set a default role if lookup fails
      sessionStorage.setItem('userRole', 'User');
      setDisplayRole('User');
    }
  };

  if (loading || isChecking) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary mr-2" />
        <span>Checking session and role...</span>
      </div>
    );
  }

  return null;
};

export default DashboardChecker;
