
import { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";

export const useUserRole = () => {
  const [userRole, setUserRole] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  const fetchUserRole = useCallback(async (userId: string, email: string) => {
    try {
      // First check if we have a stored role in session storage
      const storedRole = sessionStorage.getItem('userRole');
      if (storedRole) {
        setUserRole(storedRole);
        setIsAdmin(storedRole === "OWC Admin" || storedRole === "owcadmin");
        return;
      }
      
      // Try to get role from email mapping first as it's more reliable
      // with the current database schema issues
      try {
        const { data: mappingData } = await supabase
          .from('user_mapping')
          .select('owc_user_id')
          .eq('email', email)
          .maybeSingle();
          
        if (mappingData?.owc_user_id) {
          const { data: userGroupData } = await supabase
            .from('owc_user_usergroup_map')
            .select(`
              group_id,
              owc_usergroups:owc_usergroups(title)
            `)
            .eq('user_id', mappingData.owc_user_id)
            .maybeSingle();
            
          if (userGroupData?.owc_usergroups) {
            const groupData = userGroupData.owc_usergroups as unknown as { title?: string };
            if (groupData?.title) {
              const role = groupData.title;
              setUserRole(role);
              setIsAdmin(role === "OWC Admin" || role === "owcadmin");
              sessionStorage.setItem('userRole', role);
              return;
            }
          }
        }
      } catch (e) {
        console.error("Error in email-based role lookup:", e);
        // Continue to fallback method
      }
      
      // Fallback to auth user id mapping
      try {
        const { data: mappingData } = await supabase
          .from('user_mapping')
          .select('owc_user_id')
          .eq('auth_user_id', userId)
          .maybeSingle();
        
        if (mappingData?.owc_user_id) {
          const { data: userGroupData } = await supabase
            .from('owc_user_usergroup_map')
            .select(`
              group_id,
              owc_usergroups:owc_usergroups(title)
            `)
            .eq('user_id', mappingData.owc_user_id)
            .maybeSingle();
            
          if (userGroupData?.owc_usergroups) {
            const groupData = userGroupData.owc_usergroups as unknown as { title?: string };
            if (groupData?.title) {
              const role = groupData.title;
              setUserRole(role);
              setIsAdmin(role === "OWC Admin" || role === "owcadmin");
              sessionStorage.setItem('userRole', role);
              return;
            }
          }
        }
      } catch (e) {
        console.error("Error in auth_user_id-based role lookup:", e);
        // Continue to fallback method
      }
      
      // Last resort, use generic role lookup
      const role = await getUserRoleFromMapping(userId);
      setUserRole(role);
      setIsAdmin(role === "OWC Admin" || role === "owcadmin");
      if (role) {
        sessionStorage.setItem('userRole', role);
      }
    } catch (error) {
      console.error("Error in fetchUserRole:", error);
      setUserRole("User"); // Default role if all else fails
      setIsAdmin(false);
    }
  }, []);

  const getUserRoleFromMapping = async (userId: string): Promise<string | null> => {
    try {
      const { data: mappingData } = await supabase
        .from('user_mapping')
        .select('owc_user_id')
        .eq('auth_user_id', userId)
        .maybeSingle();
        
      if (!mappingData?.owc_user_id) {
        return null;
      }
      
      const { data: userGroupData } = await supabase
        .from('owc_user_usergroup_map')
        .select(`
          group_id,
          owc_usergroups:owc_usergroups(title)
        `)
        .eq('user_id', mappingData.owc_user_id)
        .maybeSingle();
        
      if (userGroupData?.owc_usergroups) {
        const groupData = userGroupData.owc_usergroups as unknown as { title?: string };
        return groupData?.title || null;
      }
      
      return null;
    } catch (error) {
      console.error("Error getting user role from mapping:", error);
      return null;
    }
  };

  return {
    userRole,
    isAdmin,
    fetchUserRole,
    setUserRole,
    setIsAdmin
  };
};
