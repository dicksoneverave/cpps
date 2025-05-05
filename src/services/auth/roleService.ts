
import { supabase } from "@/integrations/supabase/client";
import { fetchRoleByEmail, fetchRoleByAuthId, getRoleFromSessionStorage, saveRoleToSessionStorage } from "@/utils/roles";

/**
 * Gets the user role directly from owc_user_usergroup_map using auth_user_id
 * and joining with owc_usergroups
 */
export const getUserRoleFromMapping = async (userId: string): Promise<string | null> => {
  try {
    console.log("Fetching role for user ID:", userId);
    
    if (!userId) {
      console.error("No user ID provided to getUserRoleFromMapping");
      return null;
    }
    
    // Query with a join between owc_user_usergroup_map and owc_usergroups
    const { data: userRoleData, error: userRoleError } = await supabase
      .from('owc_user_usergroup_map')
      .select(`
        group_id,
        owc_usergroups!inner(title)
      `)
      .eq('auth_user_id', userId)
      .maybeSingle();
      
    if (userRoleError) {
      console.error("Error in user role mapping lookup:", userRoleError);
      return null;
    }
    
    if (!userRoleData) {
      console.log("No role mapping found for auth_user_id:", userId);
      return null;
    }
    
    if (userRoleData.owc_usergroups?.title) {
      const roleTitle = userRoleData.owc_usergroups.title;
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
