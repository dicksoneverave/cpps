
import { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { getDashboardPathByGroupTitle } from "@/services/admin/userGroupService";
import { isAdminRole } from "@/utils/roles";

/**
 * A simplified hook for fetching user roles with caching
 */
export const useRoleFetcher = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Define a type for the user group structure
  type UserGroup = {
    title: string;
    id: string | number;
  };
  
  // Get role with optimized fetching strategy
  const fetchRole = useCallback(async (userId?: string, email?: string): Promise<{
    role: string;
    dashboardPath: string;
    isAdmin: boolean;
  }> => {
    setIsLoading(true);
    setError(null);
    
    try {
      // First check session storage (fastest)
      const storedRole = sessionStorage.getItem('userRole');
      if (storedRole) {
        console.log("Using cached role from session storage:", storedRole);
        return {
          role: storedRole,
          dashboardPath: getDashboardPathByGroupTitle(storedRole),
          isAdmin: isAdminRole(storedRole)
        };
      }
      
      // Handle known emails (second fastest)
      const knownEmailRoleMappings: Record<string, string> = {
        "dr@owc.gov.pg": "Commissioner",
        "dr@owc.govpg": "Commissioner",
        "administrator@gmail.com": "OWC Admin"
      };
      
      if (email && knownEmailRoleMappings[email]) {
        const role = knownEmailRoleMappings[email];
        console.log(`Using known role mapping for ${email}: ${role}`);
        sessionStorage.setItem('userRole', role);
        return {
          role,
          dashboardPath: getDashboardPathByGroupTitle(role),
          isAdmin: isAdminRole(role)
        };
      }
      
      // Fetch from database if we have user ID (slower)
      if (userId) {
        console.log("Fetching role from database for userId:", userId);
        const { data, error } = await supabase
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
          
        if (error) {
          console.error("Database error fetching role:", error);
        } else if (data?.owc_usergroups) {
          // Safe access with type assertion since we've confirmed owc_usergroups exists
          const userGroup = data.owc_usergroups as UserGroup;
          
          if (userGroup.title) {
            console.log("Found role in database:", userGroup.title);
            sessionStorage.setItem('userRole', userGroup.title);
            return {
              role: userGroup.title,
              dashboardPath: getDashboardPathByGroupTitle(userGroup.title),
              isAdmin: isAdminRole(userGroup.title)
            };
          }
        }
      }
      
      // Default role as last resort
      console.log("No role found, using default User role");
      const defaultRole = "User";
      sessionStorage.setItem('userRole', defaultRole);
      return {
        role: defaultRole,
        dashboardPath: getDashboardPathByGroupTitle(defaultRole),
        isAdmin: false
      };
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Unknown error fetching role";
      setError(errorMsg);
      console.error("Error in useRoleFetcher:", err);
      
      // Default role on error
      return {
        role: "User",
        dashboardPath: "/dashboard",
        isAdmin: false
      };
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  // Clear cached role (for logout)
  const clearRole = useCallback(() => {
    sessionStorage.removeItem('userRole');
  }, []);
  
  return {
    fetchRole,
    clearRole,
    isLoading,
    error
  };
};
