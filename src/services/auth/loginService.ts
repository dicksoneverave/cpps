
import { supabase } from "@/integrations/supabase/client";
import { verifyPassword } from "@/utils/passwordUtils";

// Define interfaces for our query results
export interface UserGroupData {
  group_id: number;
}

export interface LoginResponse {
  data: any;
  error: any;
  customUser: any;
  userRole?: string;
}

// Define a proper interface for userData that includes required fields
interface CustomUserData {
  id: string;
  email: string;
  name?: string;
  password: string;
  created_at: string;
  updated_at: string;
  role?: string;
}

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
    if (email === "administrator@gmail.com" && password === "dixman007") {
      console.log("Admin login detected, using admin credentials");
      
      try {
        // Try to create a Supabase auth session for administrator
        const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        
        if (!authError) {
          console.log("Admin session created successfully with Supabase auth");
          sessionStorage.setItem('currentUserEmail', email);
          return {
            data: authData,
            error: null,
            customUser: {
              email,
              name: "Administrator",
              role: "OWC Admin",
              id: authData?.user?.id || "admin-id",
              password: "not-stored",
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            },
            userRole: "OWC Admin"
          };
        }
      } catch (authError) {
        console.error("Supabase auth error for admin:", authError);
      }
      
      // Return success for admin even if Supabase auth failed
      console.log("Proceeding with admin login via custom authentication");
      sessionStorage.setItem('currentUserEmail', email);
      sessionStorage.setItem('userRole', "OWC Admin");
      return {
        data: null,
        error: null,
        customUser: {
          email,
          name: "Administrator",
          role: "OWC Admin",
          id: "admin-id",
          password: "not-stored",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        userRole: "OWC Admin"
      };
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
    
    // STEP 2: Match the user ID with auth_user_id in owc_user_usergroup_map to get group_id
    console.log("Finding user's group_id in owc_user_usergroup_map with auth_user_id:", userData.id);
    
    const { data: userGroupData, error: userGroupError } = await supabase
      .from('owc_user_usergroup_map')
      .select('group_id')
      .eq('auth_user_id', userData.id)
      .maybeSingle();
      
    if (userGroupError) {
      console.error("Error getting user's group:", userGroupError);
    }
    
    let userRole: string | null = null;
    
    if (userGroupData && userGroupData.group_id) {
      const groupId = userGroupData.group_id;
      console.log("Found user's group_id:", groupId);
      
      // STEP 3: Find the matching group_id in owc_usergroups to get title (role)
      console.log("Getting role from owc_usergroups with group_id:", groupId);
      
      const { data: groupData, error: groupError } = await supabase
        .from('owc_usergroups')
        .select('title')
        .eq('id', groupId)
        .maybeSingle();
        
      if (groupError) {
        console.error("Error getting group title:", groupError);
      }
      
      if (groupData && groupData.title) {
        userRole = groupData.title;
        console.log("Found user's role:", userRole);
        sessionStorage.setItem('userRole', userRole);
      }
    }
    
    // If no role found, default to User
    if (!userRole) {
      userRole = "User";
      sessionStorage.setItem('userRole', userRole);
      console.log("No specific role found, defaulting to:", userRole);
    }
    
    // Create a customUserData object with all required fields
    const customUserData: CustomUserData = {
      id: userData.id,
      email: userData.email,
      name: userData.name,
      password: userData.password,
      role: userRole,
      created_at: userData.created_at || new Date().toISOString(),
      updated_at: userData.updated_at || new Date().toISOString()
    };
    
    // Store email in session storage
    sessionStorage.setItem('currentUserEmail', email);
    
    // Return successful login response with all the data
    console.log("Authentication flow completed. User role:", userRole);
    return { 
      data: authData, 
      error: null,
      customUser: customUserData,
      userRole: userRole
    };
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
};
