
import { supabase } from "@/integrations/supabase/client";
import { saveRoleToSessionStorage } from "./sessionStorage";

/**
 * Fetch user role using auth user ID mapping - directly joining with owc_usergroups
 */
export const fetchRoleByAuthId = async (userId: string): Promise<string | null> => {
  try {
    console.log("Looking up role by auth user ID:", userId);
    
    if (!userId) {
      console.error("No user ID provided to fetchRoleByAuthId");
      return null;
    }
    
    // Query the owc_user_usergroup_map table with auth_user_id and join with owc_usergroups
    console.log("Querying owc_user_usergroup_map and joining with owc_usergroups for auth_user_id:", userId);
    const { data: userRoleData, error: userRoleError } = await supabase
      .from('owc_user_usergroup_map')
      .select(`
        group_id,
        owc_usergroups!inner(title)
      `)
      .eq('auth_user_id', userId)
      .maybeSingle();
    
    if (userRoleError) {
      console.error("Error in direct role lookup:", userRoleError);
      return null;
    }
    
    if (!userRoleData) {
      console.error("No role mapping found for auth_user_id:", userId);
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
  } catch (e) {
    console.error("Error in auth_user_id-based role lookup:", e);
    return null;
  }
};
