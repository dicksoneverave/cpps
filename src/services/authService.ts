
import { supabase } from "@/integrations/supabase/client";
import MD5 from 'crypto-js/md5';
import { verifyJoomlaPassword } from "@/utils/passwordUtils";

// Define interfaces for our query results
export interface UserGroupData {
  group_id: number;
  owc_usergroups: {
    title: string;
  } | null;
}

export const loginWithSupabaseAuth = async (email: string, password: string) => {
  try {
    // Check with our owc_users table first
    const { data: owcUserData, error: owcUserError } = await supabase
      .from('owc_users')
      .select('*')
      .eq('email', email)
      .maybeSingle();
      
    if (owcUserError) {
      console.error("Error fetching owc_user:", owcUserError);
      throw new Error("Authentication service error. Please try again.");
    }
    
    if (!owcUserData) {
      // Fallback to check users table if no owc_user found
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .maybeSingle();
        
      if (userError || !userData) {
        throw new Error("User not found. Please check your email and try again.");
      }
      
      // For users table, verify with MD5
      const hashedPassword = MD5(password).toString();
      console.log("Users table - email:", email);
      console.log("Users table - comparing:", hashedPassword, "with", userData.password);
      
      if (userData?.password !== hashedPassword) {
        throw new Error("Invalid email or password. Please try again.");
      }
      
      // Return success with the user data
      return { 
        data: null, 
        error: null,
        customUser: userData
      };
    }
    
    // Verify password against owc_users table
    console.log("OWC table - email:", email);
    console.log("OWC table - password hash from DB:", owcUserData.password);
    
    // Joomla passwords could be in different formats, use the utility function
    const isPasswordValid = verifyJoomlaPassword(password, owcUserData.password);
    
    if (!isPasswordValid) {
      throw new Error("Invalid email or password. Please try again.");
    }
    
    // If the user exists and password is correct, manually create a session
    try {
      // Create a Supabase auth session if possible
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (!authError) {
        // Map the owc_user to auth user if successful authentication
        try {
          const { data: mappingData } = await supabase
            .from('user_mapping')
            .select('*')
            .eq('email', email)
            .maybeSingle();
            
          if (!mappingData) {
            // Create mapping if it doesn't exist
            await supabase
              .from('user_mapping')
              .insert({
                email: email,
                owc_user_id: owcUserData.id,
                auth_user_id: authData.user?.id,
                name: owcUserData.name
              } as any); // Use type assertion to bypass TypeScript check
          }
        } catch (mappingError) {
          console.error("Error with user mapping:", mappingError);
          // Continue even if mapping fails
        }
        
        return { 
          data: authData, 
          error: null,
          customUser: owcUserData
        };
      }
      
      // If Supabase auth fails, still return success since we verified the custom user
      console.log("Supabase auth failed but OWC user verified:", authError);
      return {
        data: null,
        error: null,
        customUser: owcUserData
      };
      
    } catch (authError) {
      console.error("Authentication error:", authError);
      
      // Even if Supabase auth fails, we can still return success since we validated the custom user
      return {
        data: null,
        error: null,
        customUser: owcUserData
      };
    }
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
    // First try to get the owc_user_id from user_mapping table
    const { data: mappingData } = await supabase
      .from('user_mapping')
      .select('owc_user_id')
      .eq('email', email)
      .maybeSingle();

    if (!mappingData?.owc_user_id) {
      // If no mapping found, try to get owc_user directly
      const { data: owcUserData } = await supabase
        .from('owc_users')
        .select('id')
        .eq('email', email)
        .maybeSingle();
        
      if (!owcUserData?.id) {
        console.log("No OWC user found for email:", email);
        return null;
      }
      
      // Use the direct owc_user id
      const { data: userGroupData, error: userGroupError } = await supabase
        .from('owc_user_usergroup_map')
        .select(`
          group_id,
          owc_usergroups:owc_usergroups(title)
        `)
        .eq('user_id', owcUserData.id)
        .maybeSingle();
        
      if (userGroupError) {
        console.error("Error fetching user group data:", userGroupError);
        return null;
      }
      
      if (!userGroupData) {
        console.log("No user group found for owc_user_id:", owcUserData.id);
        return null;
      }
      
      // Cast to the right type structure
      const userGroup = userGroupData.owc_usergroups as unknown as { title?: string };
      if (userGroup && userGroup.title) {
        return userGroup.title;
      }
      
      return null;
    }
    
    // If mapping found, use the owc_user_id from mapping
    const { data: userGroupData, error: userGroupError } = await supabase
      .from('owc_user_usergroup_map')
      .select(`
        group_id,
        owc_usergroups:owc_usergroups(title)
      `)
      .eq('user_id', mappingData.owc_user_id)
      .maybeSingle();

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
