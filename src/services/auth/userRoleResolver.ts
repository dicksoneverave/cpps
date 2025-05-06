
import { supabase } from "@/integrations/supabase/client";

/**
 * Fetches and resolves user role based on group mappings
 */
export const resolveUserRole = async (userId: string): Promise<string | null> => {
  try {
    console.log("Finding user's group_id in owc_user_usergroup_map with auth_user_id:", userId);
    
    const { data: userGroupData, error: userGroupError } = await supabase
      .from('owc_user_usergroup_map')
      .select('group_id')
      .eq('auth_user_id', userId)
      .maybeSingle();
      
    if (userGroupError) {
      console.error("Error getting user's group:", userGroupError);
      return null;
    }
    
    if (userGroupData && userGroupData.group_id) {
      const groupId = userGroupData.group_id;
      console.log("Found user's group_id:", groupId);
      
      // Find the matching group_id in owc_usergroups to get title (role)
      const { data: groupData, error: groupError } = await supabase
        .from('owc_usergroups')
        .select('title')
        .eq('id', groupId)
        .maybeSingle();
        
      if (groupError) {
        console.error("Error getting group title:", groupError);
        return null;
      }
      
      if (groupData && groupData.title) {
        const userRole = groupData.title;
        console.log("Found user's role:", userRole);
        sessionStorage.setItem('userRole', userRole);
        return userRole;
      }
    }
    
    return null;
  } catch (error) {
    console.error("Error resolving user role:", error);
    return null;
  }
};
