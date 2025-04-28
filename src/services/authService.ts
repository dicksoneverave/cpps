
import { supabase } from "@/integrations/supabase/client";

// Define interfaces for our query results
export interface UserGroupData {
  group_id: number;
  owc_usergroups: {
    title: string;
  } | null;
}

export interface OWCUser {
  id: number;
  name: string;
  username: string;
  email: string;
  password: string;
  block: string;
  sendEmail?: string;
  registerDate?: string;
  lastvisitDate?: string;
  activation?: string;
  resetCount?: string;
  otpKey?: string;
  otep?: string;
  requireReset?: string;
  authProvider?: string;
  params?: any;
  role?: string;
}

export const loginWithSupabaseAuth = async (email: string, password: string) => {
  return await supabase.auth.signInWithPassword({
    email,
    password,
  });
};

export const fetchUserRoleFromMapping = async (email: string) => {
  try {
    const { data: mappingData } = await supabase
      .from('user_mapping')
      .select('owc_user_id')
      .eq('email', email)
      .single();

    if (mappingData?.owc_user_id) {
      const { data: userGroupData, error: userGroupError } = await supabase
        .from('owc_user_usergroup_map')
        .select(`
          group_id,
          owc_usergroups:owc_usergroups(title)
        `)
        .eq('user_id', mappingData.owc_user_id)
        .single();

      if (!userGroupError && userGroupData && userGroupData.owc_usergroups) {
        // Cast to the right type structure
        const userGroup = userGroupData.owc_usergroups as unknown as { title?: string };
        if (userGroup && userGroup.title) {
          // Return the role
          return userGroup.title;
        }
      }
    }
    return null;
  } catch (error) {
    console.error("Error fetching user role:", error);
    return null;
  }
};

export const fetchOwcUser = async (email: string) => {
  return await supabase
    .from('owc_users')
    .select('*')
    .eq('email', email)
    .single();
};

export const fetchOwcUserRole = async (userId: number) => {
  try {
    const { data: userGroupData, error: userGroupError } = await supabase
      .from('owc_user_usergroup_map')
      .select(`
        group_id,
        owc_usergroups:owc_usergroups(title)
      `)
      .eq('user_id', userId)
      .single();

    if (!userGroupError && userGroupData) {
      // Correctly handle the nested object structure
      const userGroup = userGroupData.owc_usergroups as unknown as { title?: string };
      if (userGroup && userGroup.title) {
        return userGroup.title;
      }
    }
    return null;
  } catch (error) {
    console.error("Error processing user role:", error);
    return null;
  }
};
