
import { supabase } from "@/integrations/supabase/client";
import { assignUserToGroup } from "./userGroupAssignmentService";
import { UserData } from "@/types/adminTypes";

export const assignAdministratorToAdminGroup = async (adminEmail: string = "administrator@gmail.com") => {
  try {
    // First, find the admin user
    const { data: authData, error: authError } = await supabase.auth.admin.listUsers();
    
    if (authError) {
      console.error("Error fetching auth users:", authError);
      throw authError;
    }
    
    if (!authData?.users || !Array.isArray(authData.users)) {
      throw new Error("Invalid auth data structure");
    }
    
    // Find the admin user by email
    const adminUser = authData.users.find(user => user.email === adminEmail);
    
    if (!adminUser) {
      throw new Error(`Admin user with email ${adminEmail} not found`);
    }
    
    // Find the OWC Admin group
    const { data: groups, error: groupError } = await supabase
      .from('owc_usergroups')
      .select('id, title')
      .eq('title', 'OWC Admin')
      .maybeSingle();
      
    if (groupError) {
      console.error("Error fetching admin group:", groupError);
      throw groupError;
    }
    
    if (!groups) {
      throw new Error("Admin group not found");
    }
    
    // Convert admin user to UserData format
    const userData: UserData = {
      id: adminUser.id,
      email: adminUser.email || "",
      name: adminUser.user_metadata?.name || 'Administrator'
    };
    
    // Assign admin user to admin group
    await assignUserToGroup(userData, groups.id.toString());
    
    console.log(`Successfully assigned ${adminEmail} to admin group`);
    return true;
  } catch (error) {
    console.error("Error assigning admin to group:", error);
    throw error;
  }
};
