
import { supabase } from "@/integrations/supabase/client";

// Define interfaces for our query results
export interface UserGroupData {
  group_id: number;
  owc_usergroups: {
    title: string;
  } | null;
}

export const loginWithSupabaseAuth = async (email: string, password: string) => {
  try {
    const response = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    // Check for errors in the response
    if (response.error) {
      throw new Error(response.error.message);
    }

    return response;
  } catch (error) {
    // Handle specific database errors with more user-friendly messages
    if (error instanceof Error && error.message.includes("database error")) {
      throw new Error("Login failed due to a database error. Please try again later.");
    } else {
      // Re-throw the original error
      throw error;
    }
  }
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
