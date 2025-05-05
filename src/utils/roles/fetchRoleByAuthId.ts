
import { supabase } from "@/integrations/supabase/client";
import { saveRoleToSessionStorage } from "./sessionStorage";

/**
 * Fetch user role using auth user ID mapping directly from owc_user_usergroup_map and owc_usergroups
 */
export const fetchRoleByAuthId = async (userId: string): Promise<string | null> => {
  try {
    console.log("Looking up role by auth user ID:", userId);
    
    if (!userId) {
      console.error("No user ID provided to fetchRoleByAuthId");
      return null;
    }
    
    // Step 1 & 2: Query the owc_user_usergroup_map table with auth_user_id
    const { data: userGroupData, error: userGroupError } = await supabase
      .from('owc_user_usergroup_map')
      .select('group_id')
      .eq('auth_user_id', userId)
      .maybeSingle();
    
    if (userGroupError) {
      console.error("Error in direct role lookup:", userGroupError);
      return null;
    }
    
    if (!userGroupData) {
      console.error("No role mapping found for auth_user_id:", userId);
      return null;
    }
    
    // Step 3: Get the group title from owc_usergroups using the group_id
    const groupId = userGroupData.group_id;
    console.log("Found group_id:", groupId, "for auth_user_id:", userId);
    
    const { data: groupData, error: groupError } = await supabase
      .from('owc_usergroups')
      .select('title')
      .eq('id', groupId)
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
  } catch (e) {
    console.error("Error in auth_user_id-based role lookup:", e);
    return null;
  }
};
