
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
    
    // First get the user mapping to find the owc_user_id
    const { data: mappingData, error: mappingError } = await supabase
      .from('user_mapping')
      .select('owc_user_id')
      .eq('email', email)
      .maybeSingle();
    
    if (mappingError) {
      console.error("Error in user_mapping lookup:", mappingError);
      return null;
    }
    
    if (mappingData?.owc_user_id) {
      const owcUserId = mappingData.owc_user_id;
      console.log("Found mapping for email:", email, "OWC ID:", owcUserId);
      
      // Then get the group from user_usergroup_map
      const { data: userGroupMapData, error: groupMapError } = await supabase
        .from('owc_user_usergroup_map')
        .select('group_id')
        .eq('user_id', owcUserId)
        .maybeSingle();
      
      if (groupMapError) {
        console.error("Error in owc_user_usergroup_map lookup:", groupMapError);
        return "User";
      }
      
      if (!userGroupMapData) {
        console.log("No group mapping found for OWC user ID:", owcUserId);
        saveRoleToSessionStorage("User"); // Default role
        return "User";
      }
      
      const groupId = userGroupMapData.group_id;
      console.log("Found group_id:", groupId, "for OWC user ID:", owcUserId);
      
      // Group ID mappings for common roles
      const groupIdMappings: Record<number, string> = {
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
      
      // If not a known group ID, fetch the title from owc_usergroups
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

    // Try direct lookup in owc_users as a last resort
    console.log("Attempting direct lookup in owc_users for:", email);
    
    const { data: owcUserData, error: owcUserError } = await supabase
      .from('owc_users')
      .select('id')
      .eq('email', email)
      .maybeSingle();
    
    if (owcUserError) {
      console.error("Error in owc_users lookup:", owcUserError);
    }
    
    if (owcUserData?.id) {
      console.log("Found user in owc_users with ID:", owcUserData.id);
      
      // Fetch the user's group from user_usergroup_map
      const { data: groupMapData, error: groupMapError } = await supabase
        .from('owc_user_usergroup_map')
        .select('group_id')
        .eq('user_id', owcUserData.id)
        .maybeSingle();
      
      if (groupMapError) {
        console.error("Error in direct group map lookup:", groupMapError);
        saveRoleToSessionStorage("User");
        return "User";
      }
      
      if (groupMapData?.group_id) {
        const { data: groupData, error: groupError } = await supabase
          .from('owc_usergroups')
          .select('title')
          .eq('id', groupMapData.group_id)
          .maybeSingle();
        
        if (groupError) {
          console.error("Error in direct group title lookup:", groupError);
          saveRoleToSessionStorage("User");
          return "User";
        }
        
        if (groupData?.title) {
          console.log("Found direct group title:", groupData.title);
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
