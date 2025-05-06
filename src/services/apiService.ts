
import { supabase } from "@/integrations/supabase/client";

export interface Form {
  id: number;
  title: string;
  alias: string;
  published: string;
  elements?: any; // JSON data
  params?: any;   // JSON data
}

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

export interface MenuItem {
  id: number;
  menutype: string;
  title: string;
  alias: string;
  path: string;
  link: string;
  parent_id: string;
  published: number;
}

export interface MenuType {
  id: number;
  menutype: string;
  title: string;
  description: string;
  client_id: string;
  asset_id: number;
}

// Fetch forms from the chronoforms8 table
export const getForms = async (): Promise<Form[]> => {
  const { data, error } = await supabase
    .from('owc_chronoforms8')
    .select('*');

  if (error) {
    console.error('Error fetching forms:', error);
    return [];
  }

  return data || [];
};

// Get a specific form by alias
export const getFormByAlias = async (alias: string): Promise<Form | null> => {
  const { data, error } = await supabase
    .from('owc_chronoforms8')
    .select('*')
    .eq('alias', alias)
    .single();

  if (error) {
    console.error(`Error fetching form ${alias}:`, error);
    return null;
  }

  return data;
};

// Fetch menu items for a specific menu type
export const getMenuItems = async (menuType: string): Promise<MenuItem[]> => {
  const { data, error } = await supabase
    .from('owc_menu')
    .select('*')
    .eq('menutype', menuType)
    .order('id');

  if (error) {
    console.error(`Error fetching menu items for ${menuType}:`, error);
    return [];
  }

  return data || [];
};

// Get user details by ID
export const getUserById = async (userId: number): Promise<User | null> => {
  const { data, error } = await supabase
    .from('owc_users')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) {
    console.error(`Error fetching user ${userId}:`, error);
    return null;
  }

  return data;
};

// Get user's group - Fixed the excessive type instantiation and error handling
export const getUserGroup = async (userId: number): Promise<UserGroup | null> => {
  try {
    // First query to get the group_id
    const { data: mapData, error: mapError } = await supabase
      .from('owc_user_usergroup_map')
      .select('group_id')
      .eq('user_id', userId)
      .single();

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
      .single();

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

// Get menu types
export const getMenuTypes = async (): Promise<MenuType[]> => {
  const { data, error } = await supabase
    .from('owc_menu_types')
    .select('*');

  if (error) {
    console.error('Error fetching menu types:', error);
    return [];
  }

  return data || [];
};

// Define a stored procedure in Supabase to handle user creation
export const createStoredProcedure = `
CREATE OR REPLACE FUNCTION create_owc_user(
  p_name TEXT,
  p_username TEXT,
  p_email TEXT,
  p_password TEXT,
  p_block TEXT,
  p_send_email TEXT,
  p_register_date TEXT,
  p_require_reset TEXT,
  p_auth_provider TEXT
) RETURNS BIGINT AS $$
DECLARE
  new_id BIGINT;
BEGIN
  INSERT INTO owc_users (
    name,
    username,
    email,
    password,
    block,
    sendEmail,
    registerDate,
    requireReset,
    authProvider
  ) VALUES (
    p_name,
    p_username,
    p_email,
    p_password,
    p_block,
    p_send_email,
    p_register_date,
    p_require_reset,
    p_auth_provider
  ) RETURNING id INTO new_id;
  
  RETURN new_id;
END;
$$ LANGUAGE plpgsql;
`;
