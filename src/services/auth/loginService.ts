
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
    
    // Hardcoded test accounts
    const knownRoles: Record<string, string> = {
      "dr@owc.gov.pg": "Commissioner",
      "dr@owc.govpg": "Commissioner",
      "chiefcommissioner@owc.gov.pg": "Chief Commissioner",
      "registrar@owc.gov.pg": "Registrar",
      "deputyregistrar@owc.gov.pg": "Deputy Registrar",
      "payment@owc.gov.pg": "Payment Section",
      "pco@owc.gov.pg": "Provincial Claims Officer",
      "agent@owc.gov.pg": "Agent Lawyer",
      "dataentry@owc.gov.pg": "Data Entry",
      "tribunal@owc.gov.pg": "Tribunal Clerk",
      "fos@owc.gov.pg": "FOS",
      "insurance@owc.gov.pg": "Insurance Company",
      "solicitor@owc.gov.pg": "State Solicitor",
      "claimsmanager@owc.gov.pg": "Claims Manager",
      "statistical@owc.gov.pg": "Statistical Department",
      "employer@owc.gov.pg": "Employer"
    };
    
    // Check for hardcoded test accounts
    if (email.toLowerCase() in knownRoles && password === "dixman007") {
      const role = knownRoles[email.toLowerCase()];
      console.log(`Using test account for ${email} with role ${role}`);
      sessionStorage.setItem('currentUserEmail', email);
      sessionStorage.setItem('userRole', role);
      return {
        data: null,
        error: null,
        customUser: {
          email,
          name: email.split('@')[0],
          role
        },
        userRole: role
      };
    }
    
    // Try with regular users table first
    console.log("Checking standard users table for:", email);
    try {
      const { data: regularUserData, error: regularUserError } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .maybeSingle();
        
      if (!regularUserError && regularUserData) {
        // Verify with the password utility
        if (verifyPassword(password, regularUserData.password)) {
          console.log("User authenticated via regular users table:", email);
          
          // Find role if any
          try {
            let userRole: string | null = "User"; // Default role
            
            // Try to get role from user_mapping and owc_user_usergroup_map
            const { data: userMapping } = await supabase
              .from('user_mapping')
              .select('auth_user_id')
              .eq('email', email)
              .maybeSingle();
              
            if (userMapping && userMapping.auth_user_id) {
              console.log("Found user mapping with auth_user_id:", userMapping.auth_user_id);
              
              const { data: groupMapping } = await supabase
                .from('owc_user_usergroup_map')
                .select('group_id')
                .eq('auth_user_id', userMapping.auth_user_id)
                .maybeSingle();
                
              if (groupMapping && groupMapping.group_id) {
                console.log("Found group mapping with group_id:", groupMapping.group_id);
                
                const { data: groupData } = await supabase
                  .from('owc_usergroups')
                  .select('title')
                  .eq('id', groupMapping.group_id)
                  .maybeSingle();
                  
                if (groupData && groupData.title) {
                  userRole = groupData.title;
                  console.log("Found role from group:", userRole);
                }
              }
            }
            
            // Store user information in session storage
            sessionStorage.setItem('currentUserEmail', email);
            sessionStorage.setItem('userRole', userRole);
            
            return {
              data: null,
              error: null,
              customUser: {
                ...regularUserData,
                role: userRole
              },
              userRole: userRole
            };
          } catch (roleError) {
            console.error("Error finding role:", roleError);
            
            // Still allow login but with default role
            sessionStorage.setItem('currentUserEmail', email);
            sessionStorage.setItem('userRole', "User");
            
            return {
              data: null,
              error: null,
              customUser: {
                ...regularUserData,
                role: "User"
              },
              userRole: "User"
            };
          }
        } else {
          console.error("Password verification failed for user:", email);
          throw new Error("Invalid email or password. Please try again.");
        }
      }
    } catch (regularUserError) {
      console.error("Error checking regular users:", regularUserError);
      // Continue to OWC users table
    }
    
    // STEP 1: Authenticate in owc_users table and get the user's ID
    console.log("Step 1: Authenticating against owc_users table");
    const { data: owcUserData, error: owcUserError } = await supabase
      .from('owc_users')
      .select('*')
      .eq('email', email)
      .maybeSingle();
      
    if (owcUserError || !owcUserData) {
      console.error("OWC User lookup error:", owcUserError);
      throw new Error("User not found. Please check your email and try again.");
    }
    
    // For OWC users, all have password "dixman007"
    if (password !== "dixman007") {
      console.error("Password verification failed for OWC user");
      throw new Error("Invalid email or password. Please try again.");
    }
    
    console.log("OWC User verified in owc_users table:", email, "with ID:", owcUserData.id);
    
    // Try to create a Supabase auth session
    let authUserId: string = owcUserData.id.toString();
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
        console.log("Supabase auth session creation failed, using owc_users table ID:", authUserId);
      }
    } catch (authError) {
      console.error("Authentication error:", authError);
      // Continue with owc_users table ID
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
    
    // If no role found, default to User
    if (!userRole) {
      userRole = "User";
      sessionStorage.setItem('userRole', userRole);
      console.log("No specific role found, defaulting to:", userRole);
    }
    
    // Create a copy of userData as CustomUserData and include the role
    const customUserData: CustomUserData = {
      ...owcUserData,
      id: authUserId,
      role: userRole || undefined
    };
    
    // Store email in session storage
    sessionStorage.setItem('currentUserEmail', email);
    
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
