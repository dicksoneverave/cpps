
import { supabase } from "@/integrations/supabase/client";
import { saveRoleToSessionStorage } from "./sessionStorage";

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
    
    // Special case handling for known emails
    const knownEmailMappings: Record<string, string> = {
      "administrator@gmail.com": "OWC Admin",
      "vagi@bsp.com.pg": "ProvincialClaimsOfficer",
      "employer@gmail.com": "Employer",
      "registrar@gmail.com": "Registrar",
      "commissioner@gmail.com": "Commissioner",
      "payment@gmail.com": "Payment",
      "dr@owc.gov.pg": "Commissioner",
      "dr@owc.govpg": "Commissioner"
    };
    
    if (knownEmailMappings[email]) {
      const role = knownEmailMappings[email];
      console.log(`${role} email detected for ${email}`);
      saveRoleToSessionStorage(role);
      return role;
    }
    
    // Since user_mapping table no longer exists, let's try direct auth users approach
    console.log("Looking up user by email directly:", email);
    
    // Get the user directly from auth
    const { data: userData, error: userError } = await supabase.auth.admin.listUsers({
      page: 1,
      perPage: 1,
      query: email
    });
    
    if (userError) {
      console.error("Error looking up user by email:", userError);
      return "User"; // Default role
    }
    
    if (userData?.users && userData.users.length > 0) {
      const userId = userData.users[0].id;
      console.log("Found user with ID:", userId);
      
      // Get the group from owc_user_usergroup_map using auth_user_id
      const { data: groupMapData, error: groupMapError } = await supabase
        .from('owc_user_usergroup_map')
        .select('group_id')
        .eq('auth_user_id', userId)
        .maybeSingle();
      
      if (groupMapError) {
        console.error("Error in owc_user_usergroup_map lookup:", groupMapError);
        return "User";
      }
      
      if (!groupMapData) {
        console.log("No group mapping found for auth_user_id:", userId);
        saveRoleToSessionStorage("User"); // Default role
        return "User";
      }
      
      const groupId = groupMapData.group_id;
      console.log("Found group_id:", groupId, "for auth_user_id:", userId);
      
      // Step 3: Handle common role mappings directly
      const groupIdMappings: {[key: number]: string} = {
        1: "OWC Admin", 
        2: "Employer",
        3: "Registrar",
        4: "Commissioner",
        5: "Payment",
        19: "ProvincialClaimsOfficer"
      };
      
      if (groupIdMappings[groupId]) {
        const roleName = groupIdMappings[groupId];
        console.log(`Group ID ${groupId} found, assigning role: ${roleName}`);
        saveRoleToSessionStorage(roleName);
        return roleName;
      }
      
      // Step 3 (alternative): If not a known group ID, fetch the title from owc_usergroups
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
