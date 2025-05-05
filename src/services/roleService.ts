
import { supabase } from "@/integrations/supabase/client";
import { fetchRoleByEmail, fetchRoleByAuthId, getRoleFromSessionStorage, saveRoleToSessionStorage } from "@/utils/roles";

/**
 * Gets the user role directly from owc_user_usergroup_map and owc_usergroups
 */
export const getUserRoleFromMapping = async (userId: string): Promise<string | null> => {
  try {
    if (!userId) {
      console.error("No user ID provided to getUserRoleFromMapping");
      return null;
    }
    
    console.log("Looking up role by auth user ID:", userId);
    
    // Step 1: First query to get group_id from owc_user_usergroup_map
    const { data: userGroupData, error: userGroupError } = await supabase
      .from('owc_user_usergroup_map')
      .select('group_id')
      .eq('auth_user_id', userId)
      .maybeSingle();
      
    if (userGroupError) {
      console.error("Error in user role mapping lookup:", userGroupError);
      return null;
    }
    
    if (!userGroupData) {
      console.log("No role mapping found for auth_user_id:", userId);
      return null;
    }
    
    // Step 3: Query to get title from owc_usergroups using group_id
    const { data: groupData, error: groupError } = await supabase
      .from('owc_usergroups')
      .select('title')
      .eq('id', userGroupData.group_id)
      .maybeSingle();
      
    if (groupError) {
      console.error("Error in group title lookup:", groupError);
      return null;
    }
    
    if (groupData?.title) {
      const roleTitle = groupData.title;
      console.log("Found role:", roleTitle, "for user ID:", userId);
      saveRoleToSessionStorage(roleTitle);
      return roleTitle;
    }
    
    console.log("No role title found for user ID:", userId);
    return null;
  } catch (error) {
    console.error("Error getting user role from mapping:", error);
    return null;
  }
};

/**
 * Comprehensive function to fetch user role using multiple strategies
 */
export const fetchUserRoleComprehensive = async (userId: string, email: string): Promise<string | null> => {
  try {
    if (!userId && !email) {
      console.error("Neither userId nor email provided to fetchUserRoleComprehensive");
      return null;
    }
    
    console.log("Fetching comprehensive role for user:", email || userId);
    
    // First check if we have a stored role in session storage
    const storedRole = getRoleFromSessionStorage();
    if (storedRole) {
      console.log("Using stored role from session:", storedRole);
      return storedRole;
    }
    
    // Try the direct approach using auth_user_id in owc_user_usergroup_map first
    if (userId) {
      console.log("Trying direct role lookup with auth_user_id:", userId);
      const directRole = await getUserRoleFromMapping(userId);
      if (directRole) {
        console.log("Found role via direct mapping:", directRole);
        saveRoleToSessionStorage(directRole);
        return directRole;
      }
    }
    
    // Fall back to email-based lookup
    if (email) {
      console.log("Falling back to email-based role lookup:", email);
      const emailBasedRole = await fetchRoleByEmail(email);
      if (emailBasedRole) {
        console.log("Found role via email mapping:", emailBasedRole);
        saveRoleToSessionStorage(emailBasedRole);
        return emailBasedRole;
      }
    }
    
    // Fallback to legacy auth user id mapping
    if (userId) {
      console.log("Trying legacy role lookup with auth_user_id:", userId);
      const authIdBasedRole = await fetchRoleByAuthId(userId);
      if (authIdBasedRole) {
        console.log("Found role via auth ID mapping:", authIdBasedRole);
        saveRoleToSessionStorage(authIdBasedRole);
        return authIdBasedRole;
      }
    }
    
    console.log("No role found for user:", email || userId);
    return "User"; // Default role if all else fails
  } catch (error) {
    console.error("Error in fetchUserRoleComprehensive:", error);
    return "User"; // Default role if all else fails
  }
};
