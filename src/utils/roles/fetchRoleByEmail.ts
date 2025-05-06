
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
    
    // Step 1: First look up the user in auth users
    console.log("Looking up user by email directly:", email);
    
    // Get the user directly from auth - using the proper API parameters
    const { data: userData, error: userError } = await supabase.auth.admin.listUsers({
      page: 1,
      perPage: 1000 // Increase to fetch more users since we'll filter client-side
    });
    
    if (userError) {
      console.error("Error looking up user by email:", userError);
      saveRoleToSessionStorage("User"); // Default role
      return "User";
    }
    
    // Filter users by email manually since we can't query directly
    if (userData?.users && Array.isArray(userData.users)) {
      // Type guard to ensure we're working with user objects that have an email property
      const matchedUser = userData.users.find(user => {
        // Check if user is an object and has an email property that matches
        if (!user || typeof user !== 'object') return false;
        if (!('email' in user)) return false;
        if (typeof user.email !== 'string') return false;
        return user.email === email;
      });
      
      if (matchedUser) {
        const userId = matchedUser.id;
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
      }
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
