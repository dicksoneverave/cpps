
import { supabase } from "@/integrations/supabase/client";
import MD5 from 'crypto-js/md5';

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
 * Authenticates a user using email and password against the users table
 */
export const loginWithSupabaseAuth = async (email: string, password: string): Promise<LoginResponse> => {
  try {
    // Check against users table
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
    console.log("Users table - comparing hashed password");
    
    if (userData?.password !== hashedPassword) {
      throw new Error("Invalid email or password. Please try again.");
    }
    
    // Try to create a Supabase auth session
    try {
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (!authError) {
        return { 
          data: authData, 
          error: null,
          customUser: userData
        };
      }
      
      // If Supabase auth fails but we've already verified the user, still return success
      console.log("Supabase auth session creation failed but user verified:", authError);
    } catch (authError) {
      console.error("Authentication error:", authError);
      // Continue since we've verified the user in our custom table
    }
    
    // Return success with the user data even if session creation failed
    return { 
      data: null, 
      error: null,
      customUser: userData
    };
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
};
