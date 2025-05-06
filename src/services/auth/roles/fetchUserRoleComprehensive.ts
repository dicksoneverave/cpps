
import { supabase } from "@/integrations/supabase/client";
import { fetchRoleByEmail, fetchRoleByAuthId } from "@/utils/roles";
import { saveRoleToSessionStorage } from "@/utils/roles/sessionStorage";
import { getUserRoleFromMapping } from "./getUserRoleFromMapping";

/**
 * Comprehensive function to fetch user role using multiple strategies
 */
export const fetchUserRoleComprehensive = async (userId: string, email: string): Promise<string | null> => {
  try {
    if (!userId && !email) {
      console.error("Neither userId nor email provided to fetchUserRoleComprehensive");
      return null;
    }
    
    console.log("Fetching comprehensive role for user:", email || userId);
    
    // First check if we have a stored role in session storage
    const storedRole = sessionStorage.getItem('userRole');
    if (storedRole) {
      console.log("Using stored role from session:", storedRole);
      return storedRole;
    }
    
    // Try the direct approach using auth_user_id in owc_user_usergroup_map first
    if (userId) {
      console.log("Trying direct role lookup with auth_user_id:", userId);
      const directRole = await getUserRoleFromMapping(userId);
      if (directRole) {
        console.log("Found role via direct mapping:", directRole);
        saveRoleToSessionStorage(directRole);
        return directRole;
      }
    }
    
    // Fall back to email-based lookup
    if (email) {
      console.log("Falling back to email-based role lookup:", email);
      const emailBasedRole = await fetchRoleByEmail(email);
      if (emailBasedRole) {
        console.log("Found role via email mapping:", emailBasedRole);
        saveRoleToSessionStorage(emailBasedRole);
        return emailBasedRole;
      }
    }
    
    // Fallback to legacy auth user id mapping
    if (userId) {
      console.log("Trying legacy role lookup with auth_user_id:", userId);
      const authIdBasedRole = await fetchRoleByAuthId(userId);
      if (authIdBasedRole) {
        console.log("Found role via auth ID mapping:", authIdBasedRole);
        saveRoleToSessionStorage(authIdBasedRole);
        return authIdBasedRole;
      }
    }
    
    console.log("No role found for user:", email || userId);
    return "User"; // Default role if all else fails
  } catch (error) {
    console.error("Error in fetchUserRoleComprehensive:", error);
    return "User"; // Default role if all else fails
  }
};
