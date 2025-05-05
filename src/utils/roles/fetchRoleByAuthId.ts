
import { supabase } from "@/integrations/supabase/client";
import { saveRoleToSessionStorage } from "./sessionStorage";

/**
 * Fetch user role using auth user ID mapping - now using direct auth_user_id in owc_user_usergroup_map
 */
export const fetchRoleByAuthId = async (userId: string): Promise<string | null> => {
  try {
    console.log("Looking up role by auth user ID:", userId);
    
    if (!userId) {
      console.error("No user ID provided to fetchRoleByAuthId");
      return null;
    }
    
    // Now we can directly query the owc_user_usergroup_map table with auth_user_id
    console.log("Directly querying owc_user_usergroup_map with auth_user_id:", userId);
    const { data: userGroupMapData, error: groupMapError } = await supabase
      .from('owc_user_usergroup_map')
      .select(`
        group_id,
        owc_usergroups:owc_usergroups(title)
      `)
      .eq('auth_user_id', userId)
      .maybeSingle();
    
    if (groupMapError) {
      console.error("Error in direct group lookup:", groupMapError);
      return null;
    }
    
    if (!userGroupMapData) {
      console.error("No group mapping found for auth_user_id:", userId);
      return null;
    }
    
    const groupId = userGroupMapData.group_id;
    console.log("Found group_id:", groupId, "directly from auth_user_id:", userId);
    
    if (userGroupMapData?.owc_usergroups) {
      const groupData = userGroupMapData.owc_usergroups as unknown as { title?: string };
      if (groupData?.title) {
        console.log("Found group:", groupData.title);
        saveRoleToSessionStorage(groupData.title);
        return groupData.title;
      }
    }
    
    // Fallback to fetching title separately if join didn't work
    console.log("Fetching group title from owc_usergroups with group_id:", groupId);
    const { data: groupData, error: groupError } = await supabase
      .from('owc_usergroups')
      .select('title')
      .eq('id', groupId)
      .maybeSingle();
    
    if (groupError) {
      console.error("Error in group title lookup:", groupError);
      return null;
    }
    
    if (!groupData?.title) {
      console.error("No group title found for group_id:", groupId);
      return null;
    }
    
    console.log("Found group for auth ID:", userId, "Group:", groupData.title);
    saveRoleToSessionStorage(groupData.title);
    return groupData.title;
  } catch (e) {
    console.error("Error in auth_user_id-based role lookup:", e);
    return null;
  }
};
