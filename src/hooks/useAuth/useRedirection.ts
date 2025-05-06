
import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { getDashboardPathByGroupTitle } from "@/services/admin/userGroupService";

/**
 * Hook to handle redirection based on user role
 */
export const useRedirection = () => {
  const navigate = useNavigate();

  const redirectBasedOnRole = useCallback((role: string | null, userEmail: string | null) => {
    console.log("[useAuth Debug] Redirecting based on role:", role);
    console.log("[useAuth Debug] User email:", userEmail);
    
    // Special case for administrator@gmail.com
    if (userEmail === "administrator@gmail.com") {
      console.log("[useAuth Debug] Administrator email detected, redirecting to /admin");
      navigate("/admin", { replace: true });
      return;
    }
    
    if (role) {
      // Get dashboard path based on role
      const dashboardPath = getDashboardPathByGroupTitle(role);
      console.log("[useAuth Debug] Role found, redirecting to:", dashboardPath, "from role:", role);
      navigate(dashboardPath, { replace: true });
    } else {
      // Default to dashboard if no role
      console.log("[useAuth Debug] No role found, redirecting to default dashboard");
      navigate("/dashboard", { replace: true });
    }
  }, [navigate]);

  return { redirectBasedOnRole };
};
