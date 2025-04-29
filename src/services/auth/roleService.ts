
import { supabase } from "@/integrations/supabase/client";
import { fetchRoleByEmail, fetchRoleByAuthId, getRoleFromSessionStorage, saveRoleToSessionStorage } from "@/utils/roleUtils";

/**
 * Gets the user role from mapping tables
 */
export const getUserRoleFromMapping = async (userId: string): Promise<string | null> => {
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

/**
 * Comprehensive function to fetch user role using multiple strategies
 */
export const fetchUserRoleComprehensive = async (userId: string, email: string): Promise<string | null> => {
  try {
    // First check if we have a stored role in session storage
    const storedRole = getRoleFromSessionStorage();
    if (storedRole) {
      return storedRole;
    }
    
    // Try to get role from email mapping first as it's more reliable
    const emailBasedRole = await fetchRoleByEmail(email);
    if (emailBasedRole) {
      saveRoleToSessionStorage(emailBasedRole);
      return emailBasedRole;
    }
    
    // Fallback to auth user id mapping
    const authIdBasedRole = await fetchRoleByAuthId(userId);
    if (authIdBasedRole) {
      saveRoleToSessionStorage(authIdBasedRole);
      return authIdBasedRole;
    }
    
    // Last resort, use generic role lookup
    const genericRole = await getUserRoleFromMapping(userId);
    if (genericRole) {
      saveRoleToSessionStorage(genericRole);
      return genericRole;
    }
    
    return null;
  } catch (error) {
    console.error("Error in fetchUserRoleComprehensive:", error);
    return "User"; // Default role if all else fails
  }
};
