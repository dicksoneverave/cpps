
import { supabase } from "@/integrations/supabase/client";

export async function getUsers() {
  const { data, error } = await supabase
    .from('owc_users_duplicate')
    .select('id, name, email, registerDate, username, sendEmail, block, authProvider')
    .order('id', { ascending: false });

  if (error) {
    throw new Error(`Error fetching users: ${error.message}`);
  }

  return data;
}

export async function getUserById(userId: string | number) {
  // For the query, we need to use the correct type based on the column definition
  const { data, error } = await supabase
    .from('owc_users_duplicate')
    .select('id, name, email, registerDate, username, sendEmail, block, authProvider')
    .eq('id', userId)
    .single();

  if (error) {
    throw new Error(`Error fetching user: ${error.message}`);
  }

  return data;
}

export async function getUserGroup(userId: string | number) {
  // Ensure userId is a number when it needs to be
  const numericUserId = typeof userId === 'string' ? 
    parseInt(userId, 10) : userId;
  
  // Only proceed if it's a valid number
  if (isNaN(numericUserId)) {
    console.error("Invalid user ID provided:", userId);
    return null;
  }
  
  // Use a direct approach to avoid type instantiation issues
  const { data, error } = await supabase
    .from('owc_user_usergroup_map')
    .select('group_id')
    .eq('auth_user_id', userId);

  if (error) {
    console.error("Error fetching user group:", error);
    return null;
  }

  // Return the first result if available
  return data && data.length > 0 ? data[0] : null;
}
