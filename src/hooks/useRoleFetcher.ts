
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

  // Define type for the RPC function result
  interface GroupTitleResult {
    group_title: string;
  }
  
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
      
      // Fetch from database using direct join query if we have the email
      if (email) {
        console.log("Fetching role using direct SQL query for email:", email);
        
        // First approach: Use a structured join query
        const { data: roleData, error: roleError } = await supabase
          .from('users')
          .select(`
            id,
            group_title:owc_user_usergroup_map(
              owc_usergroups(
                title
              )
            )
          `)
          .eq('email', email)
          .maybeSingle();
          
        if (roleError) {
          console.error("Error fetching role with join query:", roleError);
        } else if (roleData && roleData.group_title && Array.isArray(roleData.group_title) && roleData.group_title.length > 0) {
          // The structure is an array of objects, each with an owc_usergroups property
          const groupData = roleData.group_title[0];
          if (groupData && typeof groupData === 'object' && 'owc_usergroups' in groupData) {
            const userGroups = groupData.owc_usergroups;
            // Safely access the title by first checking the property exists
            if (userGroups && typeof userGroups === 'object' && 'title' in userGroups) {
              const title = userGroups.title;
              
              if (title && typeof title === 'string') {
                console.log("Found role in database using join query:", title);
                sessionStorage.setItem('userRole', title);
                return {
                  role: title,
                  dashboardPath: getDashboardPathByGroupTitle(title),
                  isAdmin: isAdminRole(title)
                };
              }
            }
          }
        }
        
        // Second approach: Use the direct RPC function
        console.log("Trying alternative direct RPC function approach");
        
        const { data: directRoleData, error: directRoleError } = await supabase
          .rpc<GroupTitleResult>('get_user_group_title', { user_email: email });
          
        if (!directRoleError && directRoleData && Array.isArray(directRoleData) && directRoleData.length > 0) {
          const result = directRoleData[0];
          if (result && result.group_title) {
            const title = result.group_title;
            console.log("Found role using direct RPC call:", title);
            sessionStorage.setItem('userRole', title);
            return {
              role: title,
              dashboardPath: getDashboardPathByGroupTitle(title),
              isAdmin: isAdminRole(title)
            };
          }
        }
      }
      
      // Legacy approach - fetch using userId if available
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
        } else if (data && data.owc_usergroups) {
          // First check if owc_usergroups exists and is an object
          const userGroup = data.owc_usergroups as unknown;
          
          // Then validate that it has the expected properties
          if (userGroup && 
              typeof userGroup === 'object' && 
              'title' in userGroup && 
              'id' in userGroup &&
              typeof userGroup.title === 'string') {
            
            const title = userGroup.title;
            console.log("Found role in database:", title);
            sessionStorage.setItem('userRole', title);
            return {
              role: title,
              dashboardPath: getDashboardPathByGroupTitle(title),
              isAdmin: isAdminRole(title)
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
