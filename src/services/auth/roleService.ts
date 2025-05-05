
import { supabase } from "@/integrations/supabase/client";
import { fetchRoleByEmail, fetchRoleByAuthId, getRoleFromSessionStorage, saveRoleToSessionStorage } from "@/utils/roleUtils";

/**
 * Gets the user role from mapping tables
 */
export const getUserRoleFromMapping = async (userId: string): Promise<string | null> => {
  try {
    console.log("Fetching role for user ID:", userId);
    
    const { data: mappingData, error: mappingError } = await supabase
      .from('user_mapping')
      .select('owc_user_id')
      .eq('auth_user_id', userId)
      .maybeSingle();
    
    if (mappingError) {
      console.error("Error in user mapping lookup:", mappingError);
      return null;
    }
      
    if (!mappingData?.owc_user_id) {
      console.log("No mapping found for user ID:", userId);
      return null;
    }
    
    console.log("Found owc_user_id:", mappingData.owc_user_id);
    
    const { data: userGroupData, error: groupError } = await supabase
      .from('owc_user_usergroup_map')
      .select(`
        group_id,
        owc_usergroups:owc_usergroups(title)
      `)
      .eq('user_id', mappingData.owc_user_id)
      .maybeSingle();
      
    if (groupError) {
      console.error("Error in user group lookup:", groupError);
      return null;
    }
    
    if (userGroupData?.owc_usergroups) {
      const groupData = userGroupData.owc_usergroups as unknown as { title?: string };
      console.log("Found user group:", groupData?.title);
      return groupData?.title || null;
    }
    
    console.log("No group found for owc_user_id:", mappingData.owc_user_id);
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
    console.log("Fetching comprehensive role for user:", email);
    
    // First check if we have a stored role in session storage
    const storedRole = getRoleFromSessionStorage();
    if (storedRole) {
      console.log("Using stored role from session:", storedRole);
      return storedRole;
    }
    
    // Try to get role from email mapping first as it's more reliable
    const emailBasedRole = await fetchRoleByEmail(email);
    if (emailBasedRole) {
      console.log("Found role via email mapping:", emailBasedRole);
      saveRoleToSessionStorage(emailBasedRole);
      return emailBasedRole;
    }
    
    // Fallback to auth user id mapping
    const authIdBasedRole = await fetchRoleByAuthId(userId);
    if (authIdBasedRole) {
      console.log("Found role via auth ID mapping:", authIdBasedRole);
      saveRoleToSessionStorage(authIdBasedRole);
      return authIdBasedRole;
    }
    
    // Last resort, use generic role lookup
    const genericRole = await getUserRoleFromMapping(userId);
    if (genericRole) {
      console.log("Found role via generic mapping:", genericRole);
      saveRoleToSessionStorage(genericRole);
      return genericRole;
    }
    
    console.log("No role found for user:", email);
    return null;
  } catch (error) {
    console.error("Error in fetchUserRoleComprehensive:", error);
    return "User"; // Default role if all else fails
  }
};
