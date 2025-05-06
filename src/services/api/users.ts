
import { supabase } from "@/integrations/supabase/client";

export interface User {
  id: number;
  name: string;
  username: string;
  email: string;
  password: string;
  block: string;
  sendEmail: string;
  registerDate: string;
  lastvisitDate: string;
  activation: string;
  resetCount: string;
  otpKey: string;
  otep: string;
  requireReset: string;
  authProvider: string;
}

export interface UserGroup {
  id: number;
  parent_id: string;
  title: string;
  rgt: number;
  lft: number;
}

export interface UserGroupMap {
  user_id: number;
  group_id: number;
}

// Get user details by ID
export const getUserById = async (userId: number): Promise<User | null> => {
  const { data, error } = await supabase
    .from('owc_users')
    .select('*')
    .eq('id', userId)
    .maybeSingle();

  if (error) {
    console.error(`Error fetching user ${userId}:`, error);
    return null;
  }

  return data;
};

// Get user's group - Fixed the type instantiation issue by separating the queries
export const getUserGroup = async (userId: number): Promise<UserGroup | null> => {
  try {
    // First query to get the group_id
    const { data: mapData, error: mapError } = await supabase
      .from('owc_user_usergroup_map')
      .select('group_id')
      .eq('user_id', userId)
      .maybeSingle();

    if (mapError) {
      console.error(`Error fetching user group mapping for user ${userId}:`, mapError);
      return null;
    }

    if (!mapData || !mapData.group_id) {
      console.log(`No group mapping found for user ${userId}`);
      return null;
    }

    // Second query to get the group data
    const { data: groupData, error: groupError } = await supabase
      .from('owc_usergroups')
      .select('*')
      .eq('id', mapData.group_id)
      .maybeSingle();

    if (groupError) {
      console.error(`Error fetching user group with id ${mapData.group_id}:`, groupError);
      return null;
    }

    return groupData as UserGroup;
  } catch (error) {
    console.error(`Error in getUserGroup:`, error);
    return null;
  }
};
