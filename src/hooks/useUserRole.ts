import { useState, useCallback, useEffect } from "react";
import { fetchUserRoleComprehensive } from "@/services/auth";
import { isAdminRole, getRoleFromSessionStorage, saveRoleToSessionStorage } from "@/utils/roles";
import { supabase } from "@/integrations/supabase/client";

export const useUserRole = () => {
  // Initialize from session storage if available
  const initialRole = getRoleFromSessionStorage();
  const initialIsAdmin = isAdminRole(initialRole);
  
  const [userRole, setUserRole] = useState<string | null>(initialRole);
  const [isAdmin, setIsAdmin] = useState(initialIsAdmin);

  // When component mounts, double-check the role from session storage
  useEffect(() => {
    const storedRole = getRoleFromSessionStorage();
    if (storedRole && storedRole !== userRole) {
      console.log("Syncing role from session storage:", storedRole);
      setUserRole(storedRole);
      setIsAdmin(isAdminRole(storedRole));
    }
  }, [userRole]);

  const fetchUserRole = useCallback(async (userId: string, email: string) => {
    try {
      console.log("Starting role fetch for:", email);
      
      // Special case for administrator@gmail.com
      if (email === "administrator@gmail.com") {
        console.log("Setting admin role for administrator@gmail.com");
        const adminRole = "OWC Admin";
        setUserRole(adminRole);
        saveRoleToSessionStorage(adminRole);
        setIsAdmin(true);
        return;
      }
      
      // Check if we already have a role in session storage
      const storedRole = getRoleFromSessionStorage();
      if (storedRole) {
        console.log("Using stored role:", storedRole);
        setUserRole(storedRole);
        setIsAdmin(isAdminRole(storedRole));
        return;
      }
      
      // Follow the exact role fetching flow:
      // 1. Use auth_user_id to find group_id in owc_user_usergroup_map
      // 2. Use group_id to find title in owc_usergroups
      console.log("Fetching role following the required flow for user ID:", userId);
      
      if (userId) {
        // Step 1: Get group_id from owc_user_usergroup_map
        const { data: userGroupData, error: userGroupError } = await supabase
          .from('owc_user_usergroup_map')
          .select('group_id')
          .eq('auth_user_id', userId)
          .maybeSingle();
          
        if (userGroupError) {
          console.error("Error getting user's group:", userGroupError);
        }
        
        if (userGroupData && userGroupData.group_id) {
          const groupId = userGroupData.group_id;
          console.log("Found group_id:", groupId, "for user ID:", userId);
          
          // Step 2: Get title from owc_usergroups
          const { data: groupData, error: groupError } = await supabase
            .from('owc_usergroups')
            .select('title')
            .eq('id', groupId)
            .maybeSingle();
            
          if (groupError) {
            console.error("Error getting group title:", groupError);
          }
          
          if (groupData && groupData.title) {
            const roleTitle = groupData.title;
            console.log("Found role:", roleTitle);
            setUserRole(roleTitle);
            saveRoleToSessionStorage(roleTitle);
            setIsAdmin(isAdminRole(roleTitle));
            return;
          }
        }
      }
      
      // If direct lookup failed, try the comprehensive fallback
      console.log("Direct lookup failed, trying comprehensive fallback");
      const role = await fetchUserRoleComprehensive(userId, email);
      console.log("Fetched role result:", role);
      
      const effectiveRole = role || "User"; // Default to "User" if no role found
      setUserRole(effectiveRole);
      saveRoleToSessionStorage(effectiveRole);
      
      // Update admin status based on role
      const adminStatus = isAdminRole(effectiveRole);
      console.log("Setting admin status:", adminStatus, "based on role:", effectiveRole);
      setIsAdmin(adminStatus);
    } catch (error) {
      console.error("Error in fetchUserRole:", error);
      // Default role if all else fails
      setUserRole("User"); 
      saveRoleToSessionStorage("User");
      setIsAdmin(false);
    }
  }, []);

  return {
    userRole,
    isAdmin,
    fetchUserRole,
    setUserRole,
    setIsAdmin
  };
};
