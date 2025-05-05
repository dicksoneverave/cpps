
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
    if (email === "administrator@gmail.com") {
      console.log("Administrator email detected, setting admin role");
      saveRoleToSessionStorage("OWC Admin");
      return "OWC Admin";
    }
    
    // Special case for vagi@bsp.com.pg - Provincial Claims Officer
    if (email === "vagi@bsp.com.pg") {
      console.log("Provincial Claims Officer email detected");
      saveRoleToSessionStorage("ProvincialClaimsOfficer");
      return "ProvincialClaimsOfficer";
    }
    
    // Special case for employer@gmail.com - Employer
    if (email === "employer@gmail.com") {
      console.log("Employer email detected");
      saveRoleToSessionStorage("Employer");
      return "Employer";
    }
    
    // Special case for registrar@gmail.com - Registrar
    if (email === "registrar@gmail.com") {
      console.log("Registrar email detected");
      saveRoleToSessionStorage("Registrar");
      return "Registrar";
    }
    
    // Special case for commissioner@gmail.com - Commissioner
    if (email === "commissioner@gmail.com") {
      console.log("Commissioner email detected");
      saveRoleToSessionStorage("Commissioner");
      return "Commissioner";
    }
    
    // Special case for payment@gmail.com - Payment
    if (email === "payment@gmail.com") {
      console.log("Payment Officer email detected");
      saveRoleToSessionStorage("Payment");
      return "Payment";
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
        return "User";
      }
      
      if (!userGroupMapData) {
        console.log("No group mapping found for OWC user ID:", mappingData.owc_user_id);
        saveRoleToSessionStorage("User"); // Default role
        return "User";
      }
      
      const groupId = userGroupMapData.group_id;
      console.log("Found group_id:", groupId, "for OWC user ID:", mappingData.owc_user_id);
      
      // Special handling for known group IDs
      if (groupId === 19) {
        console.log("Group ID 19 found, assigning ProvincialClaimsOfficer role");
        saveRoleToSessionStorage("ProvincialClaimsOfficer");
        return "ProvincialClaimsOfficer";
      }
      
      // Group ID mappings for common roles
      const groupIdMappings: Record<number, string> = {
        1: "OWC Admin", 
        2: "Employer",
        3: "Registrar",
        4: "Commissioner",
        5: "Payment"
      };
      
      if (groupIdMappings[groupId]) {
        const roleName = groupIdMappings[groupId];
        console.log(`Group ID ${groupId} found, assigning role: ${roleName}`);
        saveRoleToSessionStorage(roleName);
        return roleName;
      }
      
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
    console.log("Attempting direct lookup in owc_users for:", email);
    
    // Try direct lookup in owc_users table
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
      
      if (!groupMapData) {
        console.log("No direct group mapping found for OWC user ID:", owcUserData.id);
        saveRoleToSessionStorage("User");
        return "User";
      }
      
      // Get the group title
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
    
    // If no role was found, save default and return
    console.log("No role mapping found for email:", email);
    saveRoleToSessionStorage("User");
    return "User";
  } catch (e) {
    console.error("Error in email-based role lookup:", e);
    saveRoleToSessionStorage("User"); // Default role
    return "User";
  }
};
