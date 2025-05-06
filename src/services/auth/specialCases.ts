
import { supabase } from "@/integrations/supabase/client";
import { LoginResponse } from "./types";

/**
 * Handle special case for administrator login
 */
export const handleAdministratorLogin = async (email: string, password: string): Promise<LoginResponse | null> => {
  if (email !== "administrator@gmail.com" || password !== "dixman007") {
    return null;
  }
  
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
};
