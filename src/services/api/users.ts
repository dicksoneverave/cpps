
import { supabase } from "@/integrations/supabase/client";

export async function getUsers() {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .order('id', { ascending: false });

  if (error) {
    console.error("Error fetching users:", error);
    return [];
  }
  return data || [];
}

export async function getUserById(userId: string | number) {
  // Convert userId to string if it's a number for UUID compatibility
  const idParam = typeof userId === 'number' ? userId.toString() : userId;
  
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', idParam)
    .single();

  if (error) {
    console.error("Error fetching user by ID:", error);
    return null;
  }
  
  return data;
}

export async function getUserGroup(userId: string | number) {
  if (!userId) {
    console.error("No user ID provided to getUserGroup");
    return null;
  }
  
  // Convert userId to string if needed for UUID compatibility
  const idParam = typeof userId === 'number' ? userId.toString() : userId;
  
  // Use a direct approach to avoid type instantiation issues
  const { data, error } = await supabase
    .from('owc_user_usergroup_map')
    .select('group_id')
    .eq('auth_user_id', idParam);

  if (error) {
    console.error("Error fetching user group:", error);
    return null;
  }
  
  if (data && data.length > 0) {
    return data[0].group_id;
  }
  
  return null;
}
