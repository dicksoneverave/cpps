
import { supabase } from "@/integrations/supabase/client";
import { verifyPassword, hashPassword } from "@/utils/passwordUtils";

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

// Define a proper interface for userData that includes owc_user_id
interface CustomUserData {
  email: string;
  id: string;
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
          role: "OWC Admin"
        },
        userRole: "OWC Admin"
      };
    }
    
    // STEP 1: Authenticate in users table and get the user's ID
    console.log("Step 1: Authenticating against users table");
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
    
    console.log("User verified in users table:", email, "with ID:", userData.id);
    
    // Try to create a Supabase auth session
    let authUserId: string = userData.id;
    let authData: any = null;
    
    try {
      console.log("Attempting to create Supabase auth session");
      const { data: supabaseAuthData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (!authError && supabaseAuthData) {
        console.log("Supabase auth session created successfully");
        sessionStorage.setItem('currentUserEmail', email);
        authUserId = supabaseAuthData.user.id; // Use Supabase auth ID for next steps
        authData = supabaseAuthData;
      } else {
        console.log("Supabase auth session creation failed, using users table ID:", authUserId);
      }
    } catch (authError) {
      console.error("Authentication error:", authError);
      // Continue with users table ID
    }
    
    // STEP 2: Match the user ID with auth_user_id in owc_user_usergroup_map to get group_id
    console.log("Step 2: Finding user's group_id in owc_user_usergroup_map with auth_user_id:", authUserId);
    const { data: userGroupData, error: userGroupError } = await supabase
      .from('owc_user_usergroup_map')
      .select('group_id')
      .eq('auth_user_id', authUserId)
      .maybeSingle();
      
    if (userGroupError) {
      console.error("Error getting user's group:", userGroupError);
    }
    
    let userRole: string | null = null;
    
    if (userGroupData && userGroupData.group_id) {
      const groupId = userGroupData.group_id;
      console.log("Found user's group_id:", groupId);
      
      // STEP 3: Find the matching group_id in owc_usergroups to get title (role)
      console.log("Step 3: Getting role from owc_usergroups with group_id:", groupId);
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
    
    // Create a copy of userData as CustomUserData and include the role
    const customUserData: CustomUserData = {
      ...userData,
      role: userRole || undefined
    };
    
    // Return successful login response with all the data
    console.log("Authentication flow completed. User role:", userRole);
    return { 
      data: authData, 
      error: null,
      customUser: customUserData,
      userRole: userRole || undefined
    };
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
};
