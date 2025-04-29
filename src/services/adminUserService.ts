
import { supabase } from "@/integrations/supabase/client";
import { User as SupabaseUser } from "@supabase/supabase-js";
import { UserData, UserGroup, UserMappingInsert, Database } from "@/types/adminTypes";

// Search for users by email
export const searchUsersByEmail = async (searchQuery: string): Promise<UserData[]> => {
  try {
    // First look in auth users
    const { data: authData, error: authError } = await supabase.auth.admin.listUsers();
    
    if (authError) throw authError;
    
    if (!authData?.users || !Array.isArray(authData.users)) {
      throw new Error("Invalid auth data structure");
    }
    
    // Filter users by email
    const matchedUsers: UserData[] = authData.users
      .filter(user => user.email && user.email.toLowerCase().includes(searchQuery.toLowerCase()))
      .map(user => ({
        id: user.id,
        email: user.email,
        name: user.user_metadata?.name || 'Unknown'
      })) || [];
    
    // Get user group mappings
    if (matchedUsers.length > 0) {
      const userIds = matchedUsers.map(user => user.id);
      
      // Get user mappings
      const { data: mappings, error: mappingError } = await supabase
        .from('user_mapping')
        .select('auth_user_id, owc_user_id, name, email');
        
      if (mappingError) throw mappingError;
      
      // Get group mappings
      const owcUserIds = mappings?.map(m => m.owc_user_id).filter(Boolean) || [];
      
      if (owcUserIds.length > 0) {
        const { data: groupMappings, error: groupError } = await supabase
          .from('owc_user_usergroup_map')
          .select('user_id, group_id');
          
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
        const enhancedUsers = matchedUsers.map(user => {
          const mapping = mappings?.find(m => m.auth_user_id === user.id);
          const groupMapping = mapping?.owc_user_id 
            ? groupMappings?.find(gm => gm.user_id === mapping.owc_user_id)
            : undefined;
            
          return {
            ...user,
            name: mapping?.name || user.name,
            owc_user_id: mapping?.owc_user_id,
            group_id: groupMapping?.group_id,
            group_title: groupMapping?.group_id ? groupTitles[groupMapping.group_id] : undefined
          };
        });
        
        return enhancedUsers;
      } else {
        return matchedUsers;
      }
    }
    
    return [];
  } catch (error) {
    console.error("Error searching users:", error);
    throw error;
  }
};

// Fetch user groups
export const fetchUserGroups = async (): Promise<UserGroup[]> => {
  try {
    const { data, error } = await supabase
      .from('owc_usergroups')
      .select('id, title, parent_id')
      .order('title');
    
    if (error) throw error;
    
    return data || [];
  } catch (error) {
    console.error("Error fetching user groups:", error);
    throw error;
  }
};

// Assign user to group
export const assignUserToGroup = async (
  selectedUser: UserData, 
  selectedGroupId: string
): Promise<void> => {
  try {
    // First get owc_user_id from user_mapping
    const { data: mapping, error: mappingError } = await supabase
      .from('user_mapping')
      .select('owc_user_id')
      .eq('auth_user_id', selectedUser.id)
      .maybeSingle();
      
    if (mappingError) throw mappingError;
    
    let owcUserId = mapping?.owc_user_id;
    
    // If mapping doesn't exist, create an OWC user entry and mapping
    if (!owcUserId) {
      // Generate a random username based on email
      const username = selectedUser.email?.split('@')[0] + '_' + Math.floor(Math.random() * 10000);
      
      if (!username || !selectedUser.email) {
        throw new Error("Invalid email or username");
      }
      
      // Insert into owc_users using RPC to handle the ID generation
      const { data: newUserData, error: rpcError } = await supabase.rpc('create_owc_user', {
        p_name: selectedUser.name || selectedUser.email.split('@')[0],
        p_username: username,
        p_email: selectedUser.email,
        p_password: '',
        p_block: '0',
        p_send_email: '0',
        p_register_date: new Date().toISOString(),
        p_require_reset: '0',
        p_auth_provider: 'supabase'
      });
      
      if (rpcError) {
        console.error("RPC error:", rpcError);
        throw new Error(`Failed to create user: ${rpcError.message}`);
      }
      
      owcUserId = newUserData;
      console.log("Created new OWC user with ID:", owcUserId);
      
      if (!owcUserId) {
        throw new Error("Failed to get new user ID");
      }
      
      // Create mapping
      const mappingData: UserMappingInsert = {
        auth_user_id: selectedUser.id,
        owc_user_id: owcUserId,
        name: selectedUser.name || selectedUser.email.split('@')[0],
        email: selectedUser.email
      };
      
      const { error: newMappingError } = await supabase
        .from<'user_mapping', Database['public']['Tables']['user_mapping']['Insert']>('user_mapping')
        .insert(mappingData);
        
      if (newMappingError) throw newMappingError;
    }
    
    // Check if group mapping already exists
    const { data: existingMapping, error: existingError } = await supabase
      .from('owc_user_usergroup_map')
      .select()
      .eq('user_id', owcUserId)
      .maybeSingle();
      
    if (existingError) throw existingError;
    
    if (existingMapping) {
      // Update existing mapping
      const { error: updateError } = await supabase
        .from('owc_user_usergroup_map')
        .update({ group_id: parseInt(selectedGroupId) })
        .eq('user_id', owcUserId);
        
      if (updateError) throw updateError;
    } else {
      // Insert new mapping
      const { error: insertError } = await supabase
        .from<'owc_user_usergroup_map', Database['public']['Tables']['owc_user_usergroup_map']['Insert']>('owc_user_usergroup_map')
        .insert({
          user_id: owcUserId,
          group_id: parseInt(selectedGroupId)
        });
        
      if (insertError) throw insertError;
    }
  } catch (error) {
    console.error("Error assigning user to group:", error);
    throw error;
  }
};
