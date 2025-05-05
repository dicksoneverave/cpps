
import { supabase } from "@/integrations/supabase/client";
import { UserData, UserGroup } from "@/types/adminTypes";

export const fetchAvailableUsers = async (): Promise<UserData[]> => {
  try {
    const { data, error } = await supabase
      .from("users")
      .select("*");

    if (error) {
      console.error("Error fetching available users:", error);
      return [];
    }

    return data.map((user) => ({
      id: user.id,
      name: user.name || "",
      email: user.email || "",
    }));
  } catch (error) {
    console.error("Failed to fetch available users:", error);
    return [];
  }
};

export const fetchUserGroupsForAdmin = async (): Promise<UserGroup[]> => {
  try {
    const { data, error } = await supabase
      .from("owc_usergroups")
      .select("id, title");

    if (error) {
      console.error("Error fetching user groups:", error);
      return [];
    }

    return data.map((group) => ({
      id: group.id.toString(),
      title: group.title || "",
    }));
  } catch (error) {
    console.error("Failed to fetch user groups:", error);
    return [];
  }
};

// Accept either UserData or string (userId)
export const assignUserToGroup = async (
  user: UserData | string,
  groupId: string
): Promise<boolean> => {
  try {
    const userId = typeof user === 'string' ? user : user.id;
    
    // Check if the user is already in this group
    const { data: existingMapping, error: checkError } = await supabase
      .from('owc_user_usergroup_map')
      .select('*')
      .eq('auth_user_id', userId)
      .eq('group_id', groupId);

    if (checkError) {
      console.error("Error checking existing user group mapping:", checkError);
      return false;
    }

    // If user is already in this group, no need to insert
    if (existingMapping && existingMapping.length > 0) {
      console.log("User is already assigned to this group");
      return true;
    }

    // Insert new mapping
    const { error } = await supabase
      .from('owc_user_usergroup_map')
      .insert([
        { auth_user_id: userId, group_id: parseInt(groupId) }
      ]);

    if (error) {
      console.error("Error assigning user to group:", error);
      return false;
    }

    console.log(`User ${userId} successfully assigned to group ${groupId}`);
    return true;
  } catch (error) {
    console.error("Failed to assign user to group:", error);
    return false;
  }
};

export const removeUserFromGroup = async (
  user: UserData,
  groupId: string
): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('owc_user_usergroup_map')
      .delete()
      .eq('auth_user_id', user.id)
      .eq('group_id', groupId);

    if (error) {
      console.error("Error removing user from group:", error);
      return false;
    }

    console.log(`User ${user.id} successfully removed from group ${groupId}`);
    return true;
  } catch (error) {
    console.error("Failed to remove user from group:", error);
    return false;
  }
};

export const fetchUsersInGroup = async (groupId: string): Promise<UserData[]> => {
  try {
    const { data, error } = await supabase
      .from('owc_user_usergroup_map')
      .select(`
        auth_user_id
      `)
      .eq('group_id', groupId);

    if (error) {
      console.error("Error fetching users in group:", error);
      return [];
    }

    if (!data || data.length === 0) {
      return [];
    }

    // Extract user IDs
    const userIds = data.map(row => row.auth_user_id);

    // Fetch user details
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('*')
      .in('id', userIds);

    if (userError) {
      console.error("Error fetching user details:", userError);
      return [];
    }

    return userData.map(user => ({
      id: user.id,
      name: user.name || "",
      email: user.email || "",
    }));
  } catch (error) {
    console.error("Failed to fetch users in group:", error);
    return [];
  }
};
