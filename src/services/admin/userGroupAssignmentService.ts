
import { supabase } from "@/integrations/supabase/client";
import { UserData } from "@/types/adminTypes";

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
      owcUserId = await createOwcUserAndMapping(selectedUser);
    }

    // Update or create group mapping
    await updateUserGroupMapping(owcUserId, selectedGroupId);
    
  } catch (error) {
    console.error("Error assigning user to group:", error);
    throw error;
  }
};

// Helper function to create OWC user and mapping
async function createOwcUserAndMapping(selectedUser: UserData): Promise<number> {
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
  
  const owcUserId = newUserData;
  console.log("Created new OWC user with ID:", owcUserId);
  
  if (!owcUserId) {
    throw new Error("Failed to get new user ID");
  }
  
  // Define the mapping data
  const mappingData = {
    auth_user_id: selectedUser.id,
    owc_user_id: owcUserId,
    name: selectedUser.name || selectedUser.email.split('@')[0],
    email: selectedUser.email
  };
  
  console.log("Creating user mapping with data:", mappingData);
  
  // Since user_mapping is a view, we need to handle it using a custom RPC call
  // We need to create or use an RPC function specifically for user mapping
  try {
    // Instead of using insert/upsert directly on the view, we'll use a raw SQL query
    // that will be executed by Supabase's service role
    const { error } = await supabase.rpc('insert_user_mapping', {
      p_auth_user_id: selectedUser.id,
      p_owc_user_id: owcUserId,
      p_name: selectedUser.name || selectedUser.email.split('@')[0],
      p_email: selectedUser.email
    });
    
    if (error) {
      console.error("Error creating user mapping:", error);
      throw error;
    }
  } catch (err) {
    console.error("Error with user mapping insertion:", err);
    throw new Error(`Failed to create user mapping: ${err instanceof Error ? err.message : String(err)}`);
  }
  
  return owcUserId;
}

// Helper function to update or create user group mapping
async function updateUserGroupMapping(owcUserId: number, selectedGroupId: string): Promise<void> {
  try {
    // Check if group mapping already exists
    const { data: existingMapping, error: existingError } = await supabase
      .from('owc_user_usergroup_map')
      .select()
      .eq('user_id', owcUserId)
      .maybeSingle();
      
    if (existingError) {
      console.error("Error checking existing mapping:", existingError);
      throw existingError;
    }
    
    if (existingMapping) {
      // Update existing mapping
      const { error: updateError } = await supabase
        .from('owc_user_usergroup_map')
        .update({ group_id: parseInt(selectedGroupId) })
        .eq('user_id', owcUserId);
        
      if (updateError) {
        console.error("Error updating user group mapping:", updateError);
        throw updateError;
      }
    } else {
      // Insert new mapping with properly typed data
      const groupId = parseInt(selectedGroupId);
      const insertData = {
        user_id: owcUserId,
        group_id: groupId
      };
      
      console.log("Inserting new mapping with data:", insertData);
      
      const { error: insertError } = await supabase
        .from('owc_user_usergroup_map')
        .insert([insertData]);
        
      if (insertError) {
        console.error("Error inserting user group mapping:", insertError);
        throw insertError;
      }
    }
  } catch (error) {
    console.error("Error in updateUserGroupMapping:", error);
    throw new Error(`Failed to update user group mapping: ${error instanceof Error ? error.message : String(error)}`);
  }
}
