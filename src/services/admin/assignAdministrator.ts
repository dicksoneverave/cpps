
import { supabase } from "@/integrations/supabase/client";
import { UserData } from "@/types/adminTypes";

/**
 * Assigns a user as an administrator in the system
 * @param userData The user data containing id and email
 * @returns Promise<boolean> indicating success or failure
 */
export const assignUserAsAdministrator = async (userData: UserData | string): Promise<boolean> => {
  try {
    // Extract the user ID (either from UserData object or use the string directly)
    const userId = typeof userData === 'string' ? userData : userData.id;
    
    // Administrator group ID (should be configured properly)
    const adminGroupId = 8; // OWC Admin group
    
    console.log(`Assigning user ${userId} as administrator (group ID: ${adminGroupId})...`);
    
    // Direct implementation to avoid circular dependencies
    const { data: existingMapping, error: checkError } = await supabase
      .from('owc_user_usergroup_map')
      .select('*')
      .eq('auth_user_id', userId)
      .single();
    
    if (!checkError && existingMapping) {
      console.log(`User ${userId} already has a group assignment, updating to OWC Admin...`);
      
      // Update the existing mapping
      const { error: updateError } = await supabase
        .from('owc_user_usergroup_map')
        .update({ group_id: adminGroupId }) // OWC Admin group ID
        .eq('auth_user_id', userId);
      
      if (updateError) {
        console.error('Error updating user group assignment:', updateError);
        return false;
      }
      
      return true;
    }
    
    // Create a new mapping
    const { error: insertError } = await supabase
      .from('owc_user_usergroup_map')
      .insert({ auth_user_id: userId, group_id: adminGroupId }); // OWC Admin group ID
    
    if (insertError) {
      console.error('Error inserting user group assignment:', insertError);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error in assignUserAsAdministrator:', error);
    return false;
  }
};

/**
 * Assigns a user as an OWC Admin
 * This is a specialized version that ensures consistency
 */
export const assignAsOWCAdmin = async (userData: UserData | string): Promise<boolean> => {
  try {
    // Extract the user ID (either from UserData object or use the string directly)
    const userId = typeof userData === 'string' ? userData : userData.id;
    
    console.log(`Assigning user ${userId} as OWC Admin...`);
    
    // First check if the user already exists in the map
    const { data: existingMapping, error: checkError } = await supabase
      .from('owc_user_usergroup_map')
      .select('*')
      .eq('auth_user_id', userId)
      .single();
    
    if (!checkError && existingMapping) {
      console.log(`User ${userId} already has a group assignment, updating to OWC Admin...`);
      
      // Update the existing mapping
      const { error: updateError } = await supabase
        .from('owc_user_usergroup_map')
        .update({ group_id: 8 }) // OWC Admin group ID
        .eq('auth_user_id', userId);
      
      if (updateError) {
        console.error('Error updating user group assignment:', updateError);
        return false;
      }
      
      return true;
    }
    
    // Create a new mapping
    const { error: insertError } = await supabase
      .from('owc_user_usergroup_map')
      .insert({ auth_user_id: userId, group_id: 8 }); // OWC Admin group ID
    
    if (insertError) {
      console.error('Error inserting user group assignment:', insertError);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error in assignAsOWCAdmin:', error);
    return false;
  }
};
