
import { supabase } from "@/integrations/supabase/client";
import { saveRoleToSessionStorage } from "@/utils/roles/sessionStorage";

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
    
    // Query to get group_id from owc_user_usergroup_map
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
    
    // Query to get title from owc_usergroups
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
