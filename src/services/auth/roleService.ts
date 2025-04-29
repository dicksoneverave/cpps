
import { supabase } from "@/integrations/supabase/client";

/**
 * Fetches the user's role from the user_mapping and related tables
 */
export const fetchUserRoleFromMapping = async (email: string): Promise<string | null> => {
  try {
    // First try to get the owc_user_id from user_mapping table
    const { data: mappingData } = await supabase
      .from('user_mapping')
      .select('owc_user_id')
      .eq('email', email)
      .maybeSingle();

    if (!mappingData?.owc_user_id) {
      return await fetchRoleDirectlyFromOWCUser(email);
    }
    
    // If mapping found, use the owc_user_id from mapping
    return await fetchRoleFromUserGroup(mappingData.owc_user_id);
  } catch (error) {
    console.error("Error fetching user role:", error);
    return null;
  }
};

/**
 * Fetches role directly from owc_users when no mapping exists
 */
const fetchRoleDirectlyFromOWCUser = async (email: string): Promise<string | null> => {
  // If no mapping found, try to get owc_user directly
  const { data: owcUserData } = await supabase
    .from('owc_users')
    .select('id')
    .eq('email', email)
    .maybeSingle();
    
  if (!owcUserData?.id) {
    console.log("No OWC user found for email:", email);
    return null;
  }
  
  // Use the direct owc_user id
  return await fetchRoleFromUserGroup(owcUserData.id);
};

/**
 * Fetches role from user group using user ID
 */
const fetchRoleFromUserGroup = async (userId: number): Promise<string | null> => {
  const { data: userGroupData, error: userGroupError } = await supabase
    .from('owc_user_usergroup_map')
    .select(`
      group_id,
      owc_usergroups:owc_usergroups(title)
    `)
    .eq('user_id', userId)
    .maybeSingle();
    
  if (userGroupError) {
    console.error("Error fetching user group data:", userGroupError);
    return null;
  }
  
  if (!userGroupData) {
    console.log("No user group found for owc_user_id:", userId);
    return null;
  }

  // Cast to the right type structure
  const userGroup = userGroupData.owc_usergroups as unknown as { title?: string };
  if (userGroup && userGroup.title) {
    // Return the role
    return userGroup.title;
  }
  
  return null;
};
