
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
    
    if (!email) {
      console.error("No email provided to fetchRoleByEmail");
      return null;
    }
    
    // Special case for administrator@gmail.com
    if (email === "administrator@gmail.com") {
      console.log("Administrator email detected, setting admin role");
      saveRoleToSessionStorage("OWC Admin");
      return "OWC Admin";
    }
    
    // First try user_mapping table which is the most direct way
    console.log("Checking user_mapping for email:", email);
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
      
      // Fetch the user's group
      console.log("Fetching user's group from owc_user_usergroup_map with user_id:", mappingData.owc_user_id);
      const { data: userGroupMapData, error: groupMapError } = await supabase
        .from('owc_user_usergroup_map')
        .select('group_id')
        .eq('user_id', mappingData.owc_user_id)
        .maybeSingle();
        
      if (groupMapError) {
        console.error("Error in owc_user_usergroup_map lookup:", groupMapError);
        return null;
      }
      
      if (!userGroupMapData) {
        console.log("No group mapping found for OWC user ID:", mappingData.owc_user_id);
        saveRoleToSessionStorage("User"); // Default role
        return "User";
      }
      
      const groupId = userGroupMapData.group_id;
      console.log("Found group_id:", groupId, "for OWC user ID:", mappingData.owc_user_id);
      
      // Now fetch the group title from owc_usergroups
      console.log("Fetching group title from owc_usergroups with group_id:", groupId);
      const { data: groupData, error: groupError } = await supabase
        .from('owc_usergroups')
        .select('title')
        .eq('id', groupId)
        .maybeSingle();
      
      if (groupError) {
        console.error("Error in owc_usergroups lookup:", groupError);
        saveRoleToSessionStorage("User"); // Default role
        return "User";
      }
      
      if (groupData?.title) {
        console.log("Found group title:", groupData.title, "for group_id:", groupId);
        // Save to session storage
        saveRoleToSessionStorage(groupData.title);
        return groupData.title;
      }
      
      console.log("No group title found for group_id:", groupId);
      saveRoleToSessionStorage("User"); // Default role
      return "User";
    }
    
    console.log("No direct mapping found in user_mapping for email:", email);
    saveRoleToSessionStorage("User"); // Default role
    return "User";
  } catch (e) {
    console.error("Error in email-based role lookup:", e);
    saveRoleToSessionStorage("User"); // Default role
    return "User";
  }
};

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
