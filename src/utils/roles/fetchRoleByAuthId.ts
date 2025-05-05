
import { supabase } from "@/integrations/supabase/client";
import { saveRoleToSessionStorage } from "./sessionStorage";

/**
 * Fetch user role using auth user ID mapping
 */
export const fetchRoleByAuthId = async (userId: string): Promise<string | null> => {
  try {
    console.log("Looking up role by auth user ID:", userId);
    
    if (!userId) {
      console.error("No user ID provided to fetchRoleByAuthId");
      return null;
    }
    
    // Step 1: Get the owc_user_id from user_mapping
    console.log("Fetching owc_user_id from user_mapping with auth_user_id:", userId);
    const { data: mappingData, error: mappingError } = await supabase
      .from('user_mapping')
      .select('owc_user_id')
      .eq('auth_user_id', userId)
      .maybeSingle();
    
    if (mappingError) {
      console.error("Error in auth_user_id mapping lookup:", mappingError);
      return null;
    }
    
    if (!mappingData?.owc_user_id) {
      console.error("No owc_user_id found for auth_user_id:", userId);
      return null;
    }
    
    console.log("Found mapping for auth ID:", userId, "OWC ID:", mappingData.owc_user_id);
    
    // Step 2: Get the group_id from owc_user_usergroup_map
    console.log("Fetching group_id from owc_user_usergroup_map with user_id:", mappingData.owc_user_id);
    const { data: userGroupMapData, error: groupMapError } = await supabase
      .from('owc_user_usergroup_map')
      .select('group_id')
      .eq('user_id', mappingData.owc_user_id)
      .maybeSingle();
      
    if (groupMapError) {
      console.error("Error in group lookup for mapped user:", groupMapError);
      return null;
    }
    
    if (!userGroupMapData) {
      console.error("No group mapping found for OWC user ID:", mappingData.owc_user_id);
      return null;
    }
    
    const groupId = userGroupMapData.group_id;
    console.log("Found group_id:", groupId, "for OWC user ID:", mappingData.owc_user_id);
    
    // Step 3: Get the group title from owc_usergroups
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
