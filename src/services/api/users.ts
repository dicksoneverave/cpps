
import { supabase } from "@/integrations/supabase/client";

export async function getUsers() {
  const { data, error } = await supabase
    .from('owc_users')
    .select('id, name, email, registerDate, username, sendEmail, block, authProvider')
    .order('id', { ascending: false });

  if (error) {
    throw new Error(`Error fetching users: ${error.message}`);
  }

  return data;
}

export async function getUserById(userId: string | number) {
  const { data, error } = await supabase
    .from('owc_users')
    .select('id, name, email, registerDate, username, sendEmail, block, authProvider')
    .eq('id', userId)
    .single();

  if (error) {
    throw new Error(`Error fetching user: ${error.message}`);
  }

  return data;
}

export async function getUserGroup(userId: string | number) {
  // Convert userId to number if it's a string containing only digits
  const numericUserId = typeof userId === 'string' ? 
    /^\d+$/.test(userId) ? parseInt(userId, 10) : userId : 
    userId;
  
  const { data, error } = await supabase
    .from('owc_user_usergroup_map')
    .select('group_id')
    .eq('user_id', numericUserId)
    .maybeSingle();

  if (error) {
    console.error("Error fetching user group:", error);
    return null;
  }

  return data;
}
