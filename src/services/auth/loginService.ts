
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

export interface LoginResponse {
  data: any;
  error: any;
  customUser: any;
}

/**
 * Attempts to authenticate a user using email and password
 * First checks against owc_users table, then falls back to users table
 */
export const loginWithSupabaseAuth = async (email: string, password: string): Promise<LoginResponse> => {
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
      return await handleFallbackAuthentication(email, password);
    }
    
    // Verify password against owc_users table
    console.log("OWC table - email:", email);
    console.log("OWC table - password hash from DB:", owcUserData.password);
    
    // Joomla passwords could be in different formats, use the utility function
    const isPasswordValid = verifyJoomlaPassword(password, owcUserData.password);
    
    if (!isPasswordValid) {
      throw new Error("Invalid email or password. Please try again.");
    }
    
    // If password is valid, attempt to create a Supabase auth session
    return await createOrUseExistingSession(email, password, owcUserData);
  } catch (error) {
    handleAuthError(error);
    throw error; // Re-throw after handling
  }
};

/**
 * Fallback authentication using the users table if owc_users lookup fails
 */
const handleFallbackAuthentication = async (email: string, password: string): Promise<LoginResponse> => {
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
};

/**
 * Creates a Supabase auth session or uses existing user data
 */
const createOrUseExistingSession = async (
  email: string, 
  password: string, 
  owcUserData: any
): Promise<LoginResponse> => {
  try {
    // Create a Supabase auth session if possible
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (!authError) {
      // Map the owc_user to auth user if successful authentication
      await createUserMappingIfNeeded(email, owcUserData, authData);
      
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
};

/**
 * Creates user mapping record if it doesn't exist
 */
const createUserMappingIfNeeded = async (email: string, owcUserData: any, authData: any): Promise<void> => {
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
};

/**
 * Handle specific database errors with more user-friendly messages
 */
const handleAuthError = (error: unknown): void => {
  // Handle specific database errors with more user-friendly messages
  if (error instanceof Error) {
    if (error.message.includes("Database error querying schema") || 
        error.message.includes("converting NULL to string is unsupported")) {
      console.error("Supabase database schema error:", error);
      throw new Error("Authentication service is currently unavailable. This appears to be a database configuration issue. Please contact support.");
    } 
    // Original error is already thrown by the caller
  }
};
