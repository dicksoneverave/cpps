
import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { getDashboardPathByGroupTitle } from "@/services/admin/userGroupService";

export const useAuth = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Hard-coded email to role mappings for testing
  const knownEmailRoleMappings: Record<string, string> = {
    "administrator@gmail.com": "OWC Admin",
    "dr@owc.gov.pg": "Commissioner",
    "dr@owc.govpg": "Commissioner",
  };

  const redirectBasedOnRole = useCallback((role: string | null, userEmail: string | null) => {
    console.log("[useAuth Debug] Redirecting based on role:", role);
    console.log("[useAuth Debug] User email:", userEmail);
    
    // Special case for administrator@gmail.com
    if (userEmail === "administrator@gmail.com") {
      console.log("[useAuth Debug] Administrator email detected, redirecting to /admin");
      navigate("/admin", { replace: true });
      return;
    }
    
    // Check for known email mappings
    if (userEmail && knownEmailRoleMappings[userEmail]) {
      const knownRole = knownEmailRoleMappings[userEmail];
      console.log(`[useAuth Debug] Known email mapping found for ${userEmail}: ${knownRole}`);
      sessionStorage.setItem('userRole', knownRole);
      
      const dashboardPath = getDashboardPathByGroupTitle(knownRole);
      console.log("[useAuth Debug] Redirecting to:", dashboardPath);
      navigate(dashboardPath, { replace: true });
      return;
    }
    
    if (role) {
      // Get dashboard path based on role
      const dashboardPath = getDashboardPathByGroupTitle(role);
      console.log("[useAuth Debug] Role found, redirecting to:", dashboardPath);
      navigate(dashboardPath, { replace: true });
    } else {
      // Default to dashboard if no role
      console.log("[useAuth Debug] No role found, redirecting to default dashboard");
      navigate("/dashboard", { replace: true });
    }
  }, [navigate, knownEmailRoleMappings]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      console.log("[useAuth Debug] Attempting login for:", email);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error("Login error:", error.message);
        setError(error.message);
        toast({
          variant: "destructive",
          title: "Login Failed",
          description: error.message,
        });
        return;
      }

      if (data.user) {
        console.log("[useAuth Debug] Login successful for:", data.user.email);
        
        // Save current user email to session storage for persistence
        sessionStorage.setItem('currentUserEmail', data.user.email || "");
        
        // Special case handling for administrator
        if (data.user.email === "administrator@gmail.com") {
          console.log("[useAuth Debug] Admin user, setting admin role");
          sessionStorage.setItem('userRole', 'OWC Admin');
          setIsAuthenticated(true);
          navigate("/admin", { replace: true });
          return;
        }

        // Special case for known email mappings
        if (data.user.email && knownEmailRoleMappings[data.user.email]) {
          const knownRole = knownEmailRoleMappings[data.user.email];
          console.log(`[useAuth Debug] Known role for ${data.user.email}: ${knownRole}`);
          sessionStorage.setItem('userRole', knownRole);
          setIsAuthenticated(true);
          
          const dashboardPath = getDashboardPathByGroupTitle(knownRole);
          console.log("[useAuth Debug] Redirecting to known role dashboard:", dashboardPath);
          navigate(dashboardPath, { replace: true });
          return;
        }

        console.log("[useAuth Debug] Fetching user role from database...");
        // Need to find the user's role from the database
        if (data.user.id) {
          try {
            // Step 1: Get group_id from owc_user_usergroup_map
            const { data: userGroupData, error: userGroupError } = await supabase
              .from('owc_user_usergroup_map')
              .select('group_id')
              .eq('auth_user_id', data.user.id)
              .maybeSingle();
              
            if (userGroupError) {
              console.error("[useAuth Debug] Error getting user's group:", userGroupError);
            }
            
            if (userGroupData && userGroupData.group_id) {
              const groupId = userGroupData.group_id;
              console.log("[useAuth Debug] Found group_id:", groupId);
              
              // Step 2: Get title from owc_usergroups using group_id
              const { data: groupData, error: groupError } = await supabase
                .from('owc_usergroups')
                .select('title')
                .eq('id', groupId)
                .maybeSingle();
                
              if (groupError) {
                console.error("[useAuth Debug] Error getting group title:", groupError);
              }
              
              if (groupData && groupData.title) {
                console.log("[useAuth Debug] Found role:", groupData.title);
                sessionStorage.setItem('userRole', groupData.title);
                setIsAuthenticated(true);
                
                // Get dashboard path based on role and redirect
                const dashboardPath = getDashboardPathByGroupTitle(groupData.title);
                console.log("[useAuth Debug] Redirecting to role dashboard:", dashboardPath);
                navigate(dashboardPath, { replace: true });
                return;
              }
            }
          } catch (error) {
            console.error("[useAuth Debug] Error fetching user role:", error);
          }
        }
        
        // If we reach here, we couldn't determine a specific role
        console.log("[useAuth Debug] No specific role found, setting as authenticated user");
        setIsAuthenticated(true);
        sessionStorage.setItem('userRole', 'User');
        navigate("/dashboard", { replace: true });
      }
    } catch (error) {
      console.error("[useAuth Debug] Unexpected error during login:", error);
      setError("An unexpected error occurred. Please try again.");
      toast({
        variant: "destructive",
        title: "Login Error",
        description: "An unexpected error occurred. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    loading,
    error,
    isAuthenticated,
    handleLogin,
    redirectBasedOnRole
  };
};
