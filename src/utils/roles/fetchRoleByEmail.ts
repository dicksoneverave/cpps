
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
      "dr@owc.govpg": "Commissioner"
    };
    
    if (knownEmailMappings[email]) {
      const role = knownEmailMappings[email];
      console.log(`${role} email detected for ${email}`);
      saveRoleToSessionStorage(role);
      return role;
    }
    
    // If not a known email, look up in the database
    console.log("Checking database for email:", email);
    
    // Step 1: Get the auth user id from user_mapping table
    const { data: userMappingData, error: userMappingError } = await supabase
      .from('user_mapping')
      .select('auth_user_id')
      .eq('email', email)
      .maybeSingle();
    
    if (userMappingError) {
      console.error("Error in user_mapping lookup:", userMappingError);
      return null;
    }
    
    if (userMappingData?.auth_user_id) {
      const authUserId = userMappingData.auth_user_id;
      console.log("Found auth_user_id for email:", email, "auth_user_id:", authUserId);
      
      // Step 2: Get the group from owc_user_usergroup_map using auth_user_id
      const { data: groupMapData, error: groupMapError } = await supabase
        .from('owc_user_usergroup_map')
        .select('group_id')
        .eq('auth_user_id', authUserId)
        .maybeSingle();
      
      if (groupMapError) {
        console.error("Error in owc_user_usergroup_map lookup:", groupMapError);
        return "User";
      }
      
      if (!groupMapData) {
        console.log("No group mapping found for auth_user_id:", authUserId);
        saveRoleToSessionStorage("User"); // Default role
        return "User";
      }
      
      const groupId = groupMapData.group_id;
      console.log("Found group_id:", groupId, "for auth_user_id:", authUserId);
      
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
