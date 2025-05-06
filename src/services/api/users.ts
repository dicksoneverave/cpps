
import { supabase } from "@/integrations/supabase/client";

export interface UserGroup {
  id: number;
  parent_id: number;
  title: string;
  rgt: number;
  lft: number;
}

/**
 * Get a list of all users
 */
export const getUsers = async () => {
  const { data, error } = await supabase
    .from('owc_users')
    .select('*');

  if (error) {
    console.error('Error fetching users:', error);
    return [];
  }

  return data;
};

/**
 * Get user details by ID
 */
export const getUserById = async (id: string) => {
  const { data, error } = await supabase
    .from('owc_users')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching user:', error);
    return null;
  }

  return data;
};

/**
 * Get user's group from the mapping table and usergroups table
 * Using two separate queries instead of a join to avoid excessive type recursion
 */
export const getUserGroup = async (userId: string): Promise<UserGroup | null> => {
  try {
    // First query to get group_id from mapping table
    const { data: mappingData, error: mappingError } = await supabase
      .from('owc_user_usergroup_map')
      .select('group_id')
      .eq('auth_user_id', userId)
      .maybeSingle();
    
    if (mappingError || !mappingData) {
      console.error('Error fetching user group mapping:', mappingError);
      return null;
    }
    
    // Second query to get group details using the group_id
    const { data: groupData, error: groupError } = await supabase
      .from('owc_usergroups')
      .select('*')
      .eq('id', mappingData.group_id)
      .maybeSingle();
    
    if (groupError || !groupData) {
      console.error('Error fetching user group:', groupError);
      return null;
    }
    
    return groupData as UserGroup;
  } catch (error) {
    console.error('Error in getUserGroup:', error);
    return null;
  }
};
