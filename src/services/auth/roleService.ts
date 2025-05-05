
import { supabase } from "@/integrations/supabase/client";
import { fetchRoleByEmail, fetchRoleByAuthId, getRoleFromSessionStorage, saveRoleToSessionStorage } from "@/utils/roles";

/**
 * Gets the user role directly from owc_user_usergroup_map using auth_user_id
 */
export const getUserRoleFromMapping = async (userId: string): Promise<string | null> => {
  try {
    console.log("Fetching role for user ID:", userId);
    
    if (!userId) {
      console.error("No user ID provided to getUserRoleFromMapping");
      return null;
    }
    
    // Now we can directly query the owc_user_usergroup_map table with auth_user_id
    const { data: userGroupMapData, error: groupMapError } = await supabase
      .from('owc_user_usergroup_map')
      .select(`
        group_id,
        owc_usergroups:owc_usergroups(title)
      `)
      .eq('auth_user_id', userId)
      .maybeSingle();
      
    if (groupMapError) {
      console.error("Error in direct user group mapping lookup:", groupMapError);
      return null;
    }
    
    if (!userGroupMapData) {
      console.log("No direct group mapping found for auth_user_id:", userId);
      return null;
    }
    
    if (userGroupMapData?.owc_usergroups) {
      const groupData = userGroupMapData.owc_usergroups as unknown as { title?: string };
      if (groupData?.title) {
        console.log("Found user role directly:", groupData.title);
        saveRoleToSessionStorage(groupData.title);
        return groupData.title;
      }
    }
    
    // Fallback to querying the group title separately
    const groupId = userGroupMapData.group_id;
    console.log("Found group_id:", groupId, "directly for auth_user_id:", userId);
    
    const { data: groupData, error: groupError } = await supabase
      .from('owc_usergroups')
      .select('title')
      .eq('id', groupId)
      .maybeSingle();
    
    if (groupError) {
      console.error("Error in user group title lookup:", groupError);
      return null;
    }
    
    if (!groupData?.title) {
      console.log("No group title found for group_id:", groupId);
      return null;
    }
    
    console.log("Found user group:", groupData.title, "for user ID:", userId);
    saveRoleToSessionStorage(groupData.title);
    return groupData.title;
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
    
    // Fallback to auth user id legacy mapping
    if (userId) {
      console.log("Trying legacy role lookup with auth_user_id:", userId);
      const authIdBasedRole = await fetchRoleByAuthId(userId);
      if (authIdBasedRole) {
        console.log("Found role via legacy auth ID mapping:", authIdBasedRole);
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
