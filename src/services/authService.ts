
import { supabase } from "@/integrations/supabase/client";
import MD5 from 'crypto-js/md5';

// Define interfaces for our query results
export interface UserGroupData {
  group_id: number;
  owc_usergroups: {
    title: string;
  } | null;
}

export const loginWithSupabaseAuth = async (email: string, password: string) => {
  try {
    // Check with our custom users table first
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .maybeSingle();
      
    if (userError) {
      throw new Error("Invalid email or password. Please try again.");
    }
    
    // Hash the password for comparison
    const hashedPassword = MD5(password).toString();
    
    // Check if password matches
    if (userData?.password !== hashedPassword) {
      throw new Error("Invalid email or password. Please try again.");
    }
    
    // If the user exists and password is correct, sign in with Supabase Auth
    const response = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    // If there's an auth error but our password check passed,
    // we'll sign up the user in Supabase Auth (migration scenario)
    if (response.error) {
      if (response.error.message.includes("Invalid login credentials")) {
        const { data: signupData, error: signupError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { name: userData?.name }
          }
        });
        
        if (signupError) throw signupError;
        
        // Return the signup data instead
        return { data: signupData, error: null };
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
