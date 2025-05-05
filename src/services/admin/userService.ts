
import { supabase } from "@/integrations/supabase/client";
import { UserData } from "@/types/adminTypes";
import { User } from "@supabase/supabase-js";

// Search for users by email
export const searchUsersByEmail = async (searchQuery: string): Promise<UserData[]> => {
  try {
    // First look in auth users
    const { data: authData, error: authError } = await supabase.auth.admin.listUsers();
    
    if (authError) throw authError;
    
    if (!authData?.users || !Array.isArray(authData.users)) {
      throw new Error("Invalid auth data structure");
    }
    
    // Filter users by email if searchQuery is provided, otherwise return all
    const matchedUsers: UserData[] = authData.users
      .filter((user: User) => !searchQuery || (user.email && user.email.toLowerCase().includes(searchQuery.toLowerCase())))
      .map((user: User) => ({
        id: user.id,
        email: user.email || '',
        name: user.user_metadata?.name || 'Unknown'
      })) || [];
    
    // Get user group mappings
    if (matchedUsers.length > 0) {
      return await enrichUsersWithGroupData(matchedUsers);
    }
    
    return [];
  } catch (error) {
    console.error("Error searching users:", error);
    throw error;
  }
};

// Helper function to enrich users with their group data
async function enrichUsersWithGroupData(users: UserData[]): Promise<UserData[]> {
  try {
    const userIds = users.map(user => user.id);
    
    // Get user mappings
    const { data: mappings, error: mappingError } = await supabase
      .from('user_mapping')
      .select('auth_user_id, name, email');
      
    if (mappingError) throw mappingError;
    
    // Get group mappings using auth_user_id
    const { data: groupMappings, error: groupError } = await supabase
      .from('owc_user_usergroup_map')
      .select('auth_user_id, group_id');
      
    if (groupError) throw groupError;
    
    // Get group titles
    const groupIds = groupMappings?.map(gm => gm.group_id) || [];
    
    let groupTitles: Record<number, string> = {};
    
    if (groupIds.length > 0) {
      const { data: groups, error: groupsError } = await supabase
        .from('owc_usergroups')
        .select('id, title');
        
      if (groupsError) throw groupsError;
      
      if (groups) {
        groups.forEach(group => {
          groupTitles[group.id] = group.title;
        });
      }
    }
    
    // Merge data
    const enhancedUsers = users.map(user => {
      const mapping = mappings?.find(m => m.auth_user_id === user.id);
      const groupMapping = groupMappings?.find(gm => gm.auth_user_id === user.id);
        
      return {
        ...user,
        name: mapping?.name || user.name,
        group_id: groupMapping?.group_id,
        group_title: groupMapping?.group_id ? groupTitles[groupMapping.group_id] : undefined
      };
    });
    
    return enhancedUsers;
  } catch (error) {
    console.error("Error enriching users with group data:", error);
    throw error;
  }
}
