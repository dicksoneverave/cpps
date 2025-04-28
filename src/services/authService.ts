
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
      if (response.error.message.includes("Invalid login credentials")) {
        throw new Error("Invalid email or password. Please try again.");
      } else {
        throw new Error(response.error.message);
      }
    }

    return response;
  } catch (error) {
    // Handle specific database errors with more user-friendly messages
    if (error instanceof Error) {
      if (error.message.includes("Database error querying schema") || 
          error.message.includes("converting NULL to string is unsupported")) {
        console.error("Supabase database schema error:", error);
        throw new Error("Authentication service is currently unavailable. This appears to be a database configuration issue. Please contact support.");
      } else {
        // Re-throw the original error
        throw error;
      }
    } else {
      throw new Error("An unknown error occurred during login");
    }
  }
};

export const fetchUserRoleFromMapping = async (email: string) => {
  try {
    const { data: mappingData } = await supabase
      .from('user_mapping')
      .select('owc_user_id')
      .eq('email', email)
      .maybeSingle(); // Use maybeSingle instead of single to avoid errors if no data found

    if (!mappingData?.owc_user_id) {
      console.log("No mapping found for email:", email);
      return null;
    }
    
    const { data: userGroupData, error: userGroupError } = await supabase
      .from('owc_user_usergroup_map')
      .select(`
        group_id,
        owc_usergroups:owc_usergroups(title)
      `)
      .eq('user_id', mappingData.owc_user_id)
      .maybeSingle(); // Use maybeSingle instead of single

    if (userGroupError) {
      console.error("Error fetching user group data:", userGroupError);
      return null;
    }
    
    if (!userGroupData) {
      console.log("No user group found for owc_user_id:", mappingData.owc_user_id);
      return null;
    }

    // Cast to the right type structure
    const userGroup = userGroupData.owc_usergroups as unknown as { title?: string };
    if (userGroup && userGroup.title) {
      // Return the role
      return userGroup.title;
    }
    
    return null;
  } catch (error) {
    console.error("Error fetching user role:", error);
    return null;
  }
};
