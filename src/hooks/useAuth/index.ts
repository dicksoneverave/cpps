
import { useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useLoginForm } from "./useLoginForm";
import { useAuthState } from "./useAuthState";
import { useRedirection } from "./useRedirection";
import { useToast } from "@/components/ui/use-toast";
import { loginWithSupabaseAuth } from "@/services/auth/loginService";
import { getDashboardPathByGroupTitle } from "@/services/admin/userGroupService";
import { useNavigate } from "react-router-dom";

export const useAuth = () => {
  const { email, setEmail, password, setPassword, loading, setLoading, error, setError } = useLoginForm();
  const { isAuthenticated, setIsAuthenticated } = useAuthState();
  const { redirectBasedOnRole } = useRedirection();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleLogin = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    console.log("[useAuth Debug] Login attempt for:", email);

    try {
      console.log("[useAuth Debug] Attempting login for:", email);
      
      // Use our custom login service which handles authentication
      try {
        const loginResponse = await loginWithSupabaseAuth(email, password);
        
        if (loginResponse.customUser) {
          console.log("[useAuth Debug] Custom login successful for:", email);
          console.log("[useAuth Debug] User role:", loginResponse.userRole);
          
          sessionStorage.setItem('currentUserEmail', email);
          
          if (loginResponse.userRole) {
            sessionStorage.setItem('userRole', loginResponse.userRole);
            setIsAuthenticated(true);
            
            toast({
              title: "Login Successful",
              description: `Welcome back, ${email}! Your role: ${loginResponse.userRole}`,
            });
            
            const dashboardPath = getDashboardPathByGroupTitle(loginResponse.userRole);
            console.log("[useAuth Debug] Redirecting to custom login dashboard:", dashboardPath);
            navigate(dashboardPath, { replace: true });
          } else {
            // If no role was found, redirect to default dashboard
            setIsAuthenticated(true);
            sessionStorage.setItem('userRole', 'User');
            toast({
              title: "Login Successful",
              description: `Welcome back, ${email}!`,
            });
            navigate("/dashboard", { replace: true });
          }
          return;
        }
      } catch (customLoginError: any) {
        console.error("[useAuth Debug] Custom login error:", customLoginError);
        
        // Show proper error message from custom login service
        if (customLoginError && customLoginError.message) {
          setError(customLoginError.message);
          toast({
            variant: "destructive",
            title: "Login Failed",
            description: customLoginError.message,
          });
        } else {
          setError("Authentication failed. Please check your credentials.");
          toast({
            variant: "destructive",
            title: "Login Failed",
            description: "Authentication failed. Please check your credentials.",
          });
        }
        
        setLoading(false);
        return;
      }
      
      // If custom login failed, try standard Supabase auth as fallback
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error("Login error:", error.message);
        
        // Special case for database error - more user-friendly message
        if (error.message.includes("Database error")) {
          setError("Authentication service temporarily unavailable. Please try again later.");
          toast({
            variant: "destructive",
            title: "Service Unavailable",
            description: "Authentication service temporarily unavailable. Please try again later.",
          });
        } else {
          // Standard error handling
          setError(error.message);
          toast({
            variant: "destructive",
            title: "Login Failed",
            description: error.message,
          });
        }
        return;
      }

      if (data.user) {
        console.log("[useAuth Debug] Standard Supabase auth login successful for:", data.user.email);
        
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
  }, [email, password, navigate, setIsAuthenticated, setError, setLoading, toast]);

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

// Re-export hooks for direct usage if needed
export { useLoginForm } from "./useLoginForm";
export { useAuthState } from "./useAuthState";
export { useRedirection } from "./useRedirection";
