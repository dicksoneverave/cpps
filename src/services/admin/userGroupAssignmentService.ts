
import { supabase } from "@/integrations/supabase/client";
import { UserGroupAssignment, UserData } from "@/types/adminTypes";

// Fetch user group assignments
export const fetchUserGroupAssignments = async (): Promise<UserGroupAssignment[]> => {
  try {
    const { data, error } = await supabase
      .from('owc_user_usergroup_map')
      .select('*');
    
    if (error) throw error;
    
    return data || [];
  } catch (error) {
    console.error("Error fetching user group assignments:", error);
    throw error;
  }
};

// Add a new user group assignment
export const addUserGroupAssignment = async (assignment: UserGroupAssignment): Promise<UserGroupAssignment> => {
  try {
    const { data, error } = await supabase
      .from('owc_user_usergroup_map')
      .insert([assignment])
      .select()
      .single();
    
    if (error) throw error;
    
    return data as UserGroupAssignment;
  } catch (error) {
    console.error("Error adding user group assignment:", error);
    throw error;
  }
};

// Update an existing user group assignment
export const updateUserGroupAssignment = async (id: number, updates: Partial<UserGroupAssignment>): Promise<UserGroupAssignment | null> => {
  try {
    const { data, error } = await supabase
      .from('owc_user_usergroup_map')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    
    return data as UserGroupAssignment;
  } catch (error) {
    console.error("Error updating user group assignment:", error);
    throw error;
  }
};

// Delete a user group assignment
export const deleteUserGroupAssignment = async (id: number): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('owc_user_usergroup_map')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    
    return true;
  } catch (error) {
    console.error("Error deleting user group assignment:", error);
    return false;
  }
};

// Assign a user to a group - fixed to properly handle UserData or string
export const assignUserToGroup = async (user: UserData | string, groupId: string | number): Promise<boolean> => {
  try {
    // Extract the user ID based on the input type
    const userId = typeof user === 'string' ? user : user.id;
    
    // Convert groupId to number if it's a string
    const numericGroupId = typeof groupId === 'string' ? parseInt(groupId, 10) : groupId;
    
    // First, check if the assignment already exists
    const { data: existingAssignment, error: checkError } = await supabase
      .from('owc_user_usergroup_map')
      .select('*')
      .eq('auth_user_id', userId)
      .eq('group_id', numericGroupId)
      .single();

    if (checkError && checkError.code !== 'PGRST116') {
      console.error('Error checking for existing assignment:', checkError);
      return false;
    }

    // If assignment already exists, return success
    if (existingAssignment) {
      return true;
    }
    
    const { error } = await supabase
      .from('owc_user_usergroup_map')
      .insert([{ auth_user_id: userId, group_id: numericGroupId }]);
    
    if (error) {
      console.error("Error assigning user to group:", error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error("Error assigning user to group:", error);
    return false;
  }
};

// Unassign a user from a group
export const unassignUserFromGroup = async (userId: string, groupId: number): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('owc_user_usergroup_map')
      .delete()
      .match({ auth_user_id: userId, group_id: groupId });
    
    if (error) {
      console.error("Error unassigning user from group:", error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error("Error unassigning user from group:", error);
    return false;
  }
};

// Get users by group ID
export const getUsersByGroupId = async (groupId: number): Promise<any[]> => {
    try {
        const { data, error } = await supabase
            .from('owc_user_usergroup_map')
            .select('auth_user_id')
            .eq('group_id', groupId);

        if (error) {
            console.error("Error fetching users by group ID:", error);
            return [];
        }

        return data || [];
    } catch (error) {
        console.error("Error fetching users by group ID:", error);
        return [];
    }
};
