
import { supabase } from "@/integrations/supabase/client";

/**
 * Check if a role string matches any admin role variant
 */
export const isAdminRole = (role: string | null): boolean => {
  if (!role) return false;
  const adminRoles = ["OWC Admin", "owcadmin", "OWCAdminMenu"];
  return adminRoles.some(adminRole => 
    role.toLowerCase().includes(adminRole.toLowerCase())
  );
};

/**
 * Fetch user role using email mapping
 */
export const fetchRoleByEmail = async (email: string): Promise<string | null> => {
  try {
    console.log("Looking up role by email:", email);
    
    // First try user_mapping table which is the most direct way
    const { data: mappingData, error: mappingError } = await supabase
      .from('user_mapping')
      .select('owc_user_id')
      .eq('email', email)
      .maybeSingle();
    
    if (mappingError) {
      console.error("Error in user_mapping lookup:", mappingError);
    }
    
    if (mappingData?.owc_user_id) {
      console.log("Found mapping for email via user_mapping:", email, "OWC ID:", mappingData.owc_user_id);
      
      const { data: userGroupData, error: groupError } = await supabase
        .from('owc_user_usergroup_map')
        .select(`
          group_id,
          owc_usergroups:owc_usergroups(title)
        `)
        .eq('user_id', mappingData.owc_user_id)
        .maybeSingle();
        
      if (groupError) {
        console.error("Error in owc_user_usergroup_map lookup:", groupError);
      }
        
      if (userGroupData?.owc_usergroups) {
        const groupData = userGroupData.owc_usergroups as unknown as { title?: string };
        console.log("Found group for email:", email, "Group:", groupData?.title);
        return groupData?.title || null;
      }
      console.log("No group found for OWC user ID:", mappingData.owc_user_id);
      return null;
    }
    
    // If not found in mapping, try direct lookup in owc_users
    console.log("No direct mapping found, trying owc_users directly");
    const { data: owcUserData, error: owcError } = await supabase
      .from('owc_users')
      .select('id')
      .eq('email', email)
      .maybeSingle();
    
    if (owcError) {
      console.error("Error in owc_users lookup:", owcError);
    }
    
    if (!owcUserData) {
      console.log("No direct OWC user found for email:", email);
      return null;
    }
    
    // Found direct OWC user, get their group
    const owcUserId = owcUserData.id;
    console.log("Found direct OWC user for email:", email, "ID:", owcUserId);
    
    const { data: userGroupData, error: groupError } = await supabase
      .from('owc_user_usergroup_map')
      .select(`
        group_id,
        owc_usergroups:owc_usergroups(title)
      `)
      .eq('user_id', owcUserId)
      .maybeSingle();
      
    if (groupError) {
      console.error("Error in group lookup for direct owc user:", groupError);
    }
    
    if (userGroupData?.owc_usergroups) {
      const groupData = userGroupData.owc_usergroups as unknown as { title?: string };
      console.log("Found group for email:", email, "Group:", groupData?.title);
      return groupData?.title || null;
    }
    
    console.log("No group found for user:", email);
    return null;
  } catch (e) {
    console.error("Error in email-based role lookup:", e);
    return null;
  }
};

/**
 * Fetch user role using auth user ID mapping
 */
export const fetchRoleByAuthId = async (userId: string): Promise<string | null> => {
  try {
    console.log("Looking up role by auth user ID:", userId);
    
    const { data: mappingData, error: mappingError } = await supabase
      .from('user_mapping')
      .select('owc_user_id')
      .eq('auth_user_id', userId)
      .maybeSingle();
    
    if (mappingError) {
      console.error("Error in auth_user_id mapping lookup:", mappingError);
    }
    
    if (mappingData?.owc_user_id) {
      console.log("Found mapping for auth ID:", userId, "OWC ID:", mappingData.owc_user_id);
      
      const { data: userGroupData, error: groupError } = await supabase
        .from('owc_user_usergroup_map')
        .select(`
          group_id,
          owc_usergroups:owc_usergroups(title)
        `)
        .eq('user_id', mappingData.owc_user_id)
        .maybeSingle();
        
      if (groupError) {
        console.error("Error in group lookup for mapped user:", groupError);
      }
        
      if (userGroupData?.owc_usergroups) {
        const groupData = userGroupData.owc_usergroups as unknown as { title?: string };
        console.log("Found group for auth ID:", userId, "Group:", groupData?.title);
        return groupData?.title || null;
      }
    }
    
    console.log("No role found for auth user ID:", userId);
    return null;
  } catch (e) {
    console.error("Error in auth_user_id-based role lookup:", e);
    return null;
  }
};

/**
 * Fetch role from session storage
 */
export const getRoleFromSessionStorage = (): string | null => {
  const storedRole = sessionStorage.getItem('userRole');
  if (storedRole) {
    console.log("Found role in session storage:", storedRole);
  }
  return storedRole;
};

/**
 * Save role to session storage
 */
export const saveRoleToSessionStorage = (role: string): void => {
  if (role) {
    console.log("Saving role to session storage:", role);
    sessionStorage.removeItem('userRole');
    sessionStorage.setItem('userRole', role);
  }
};
