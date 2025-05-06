
import { supabase } from "@/integrations/supabase/client";
import { saveRoleToSessionStorage } from "./sessionStorage";

/**
 * Fetch user role using email mapping
 * Following the exact process:
 * 1. Authenticate in 'users' table and get users.id
 * 2. Match this id with auth_user_id in owc_user_usergroup_map, get group_id
 * 3. Find matching group_id in owc_usergroups, get title (role)
 * 4. Load role-specific dashboard
 */
export const fetchRoleByEmail = async (email: string): Promise<string | null> => {
  try {
    console.log("Looking up role by email:", email);
    
    if (!email) {
      console.error("No email provided to fetchRoleByEmail");
      return null;
    }
    
    // Special case handling only for administrator
    if (email === "administrator@gmail.com") {
      const role = "OWC Admin";
      console.log(`${role} email detected for ${email}`);
      saveRoleToSessionStorage(role);
      return role;
    }
    
    // Step 1: First look up the user in our custom users table
    console.log("Looking up user by email in users table:", email);
    
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .maybeSingle();
    
    if (userError) {
      console.error("Error looking up user in users table:", userError);
      saveRoleToSessionStorage("User"); // Default role
      return "User";
    }
    
    if (!userData) {
      console.log("No user found with email:", email);
      saveRoleToSessionStorage("User"); // Default role
      return "User";
    }
    
    const userId = userData.id;
    console.log("Found user with ID:", userId);
    
    // Step 2: Get the group from owc_user_usergroup_map using auth_user_id
    const { data: groupMapData, error: groupMapError } = await supabase
      .from('owc_user_usergroup_map')
      .select('group_id')
      .eq('auth_user_id', userId)
      .maybeSingle();
    
    if (groupMapError) {
      console.error("Error in owc_user_usergroup_map lookup:", groupMapError);
      saveRoleToSessionStorage("User");
      return "User";
    }
    
    if (!groupMapData) {
      console.log("No group mapping found for auth_user_id:", userId);
      saveRoleToSessionStorage("User"); // Default role
      return "User";
    }
    
    const groupId = groupMapData.group_id;
    console.log("Found group_id:", groupId, "for auth_user_id:", userId);
    
    // Step 3: Fetch the title from owc_usergroups using group_id
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
      saveRoleToSessionStorage(groupData.title);
      return groupData.title;
    }

    // Default if no role was found
    console.log("No role mapping found for email:", email);
    saveRoleToSessionStorage("User");
    return "User";
  } catch (e) {
    console.error("Error in email-based role lookup:", e);
    saveRoleToSessionStorage("User"); // Default role
    return "User";
  }
};
