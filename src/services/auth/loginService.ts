
import { supabase } from "@/integrations/supabase/client";
import { verifyPassword, hashPassword } from "@/utils/passwordUtils";

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
    console.log("Attempting authentication for:", email);
    
    // Special case for administrator
    if (email === "administrator@gmail.com" && password === "dixman007") {
      console.log("Admin login detected, creating admin session");
      try {
        // Try to create a Supabase auth session
        const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        
        // Even if Supabase auth fails, we'll proceed for the admin user
        if (!authError) {
          console.log("Admin session created successfully with Supabase auth");
          sessionStorage.setItem('currentUserEmail', email);
          return {
            data: authData,
            error: null,
            customUser: {
              email,
              name: "Administrator",
              role: "OWC Admin"
            }
          };
        }
      } catch (authError) {
        console.error("Supabase auth error for admin:", authError);
      }
      
      // Return success for admin even if Supabase auth failed
      console.log("Proceeding with admin login via custom authentication");
      sessionStorage.setItem('currentUserEmail', email);
      return {
        data: null,
        error: null,
        customUser: {
          email,
          name: "Administrator",
          role: "OWC Admin"
        }
      };
    }
    
    // Normal user authentication flow
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .maybeSingle();
      
    if (userError || !userData) {
      console.error("User lookup error:", userError);
      throw new Error("User not found. Please check your email and try again.");
    }
    
    // Verify with the password utility
    if (!verifyPassword(password, userData.password)) {
      console.error("Password verification failed");
      throw new Error("Invalid email or password. Please try again.");
    }
    
    console.log("User verified in custom users table:", email);
    
    // Try to create a Supabase auth session
    try {
      console.log("Attempting to create Supabase auth session");
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (!authError) {
        console.log("Supabase auth session created successfully");
        sessionStorage.setItem('currentUserEmail', email);
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
    console.log("Returning successful login with custom user data");
    sessionStorage.setItem('currentUserEmail', email);
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
