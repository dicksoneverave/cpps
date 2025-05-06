
import { supabase } from "@/integrations/supabase/client";
import { verifyPassword } from "@/utils/passwordUtils";
import { CustomUserData, LoginResponse } from "./types";
import { handleAdministratorLogin } from "./specialCases";
import { resolveUserRole } from "./userRoleResolver";

/**
 * Authenticates a user using email and password against the users table
 * Following the exact process:
 * 1. Authenticate in users table and get users.id
 * 2. Match this id with auth_user_id in owc_user_usergroup_map, get group_id
 * 3. Find matching group_id in owc_usergroups, get title (role)
 * 4. Load role-specific dashboard
 */
export const loginWithSupabaseAuth = async (email: string, password: string): Promise<LoginResponse> => {
  try {
    console.log("Starting authentication flow for:", email);
    
    // Special case for administrator
    const adminLoginResult = await handleAdministratorLogin(email, password);
    if (adminLoginResult) {
      return adminLoginResult;
    }
    
    // STEP 1: Check standard users table first
    console.log("Authenticating against users table for:", email);
    
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .maybeSingle();
      
    if (userError) {
      console.error("Error querying users table:", userError);
      throw new Error("Authentication error occurred. Please check your credentials.");
    }
    
    if (!userData) {
      console.log("User not found in users table:", email);
      throw new Error("User not found. Please check your email and try again.");
    }
    
    // Verify the password
    if (!verifyPassword(password, userData.password)) {
      console.error("Password verification failed for user:", email);
      throw new Error("Invalid email or password. Please try again.");
    }
    
    console.log("User authenticated successfully in users table:", email);
    
    // Try to create a Supabase auth session
    let authData: any = null;
    
    try {
      console.log("Attempting to create Supabase auth session");
      const { data: supabaseAuthData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (!authError && supabaseAuthData) {
        console.log("Supabase auth session created successfully");
        authData = supabaseAuthData;
      }
    } catch (authError) {
      console.log("Supabase auth session creation failed, continuing with custom auth");
    }
    
    // Find user's role using the ID
    const userRole = await resolveUserRole(userData.id);
    
    // If no role found, default to User
    const effectiveRole = userRole || "User";
    if (!userRole) {
      console.log("No specific role found, defaulting to:", effectiveRole);
    }
    
    sessionStorage.setItem('currentUserEmail', email);
    sessionStorage.setItem('userRole', effectiveRole);
    
    // Create a customUserData object with all required fields
    const customUserData: CustomUserData = {
      id: userData.id,
      email: userData.email,
      name: userData.name,
      password: userData.password,
      role: effectiveRole,
      created_at: userData.created_at || new Date().toISOString(),
      updated_at: userData.updated_at || new Date().toISOString()
    };
    
    // Return successful login response with all the data
    console.log("Authentication flow completed. User role:", effectiveRole);
    return { 
      data: authData, 
      error: null,
      customUser: customUserData,
      userRole: effectiveRole
    };
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
};
