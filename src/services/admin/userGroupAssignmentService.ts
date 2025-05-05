
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
  
  // Instead of inserting directly to user_mapping view, we need to figure out
  // how to properly update the mapping. Since user_mapping is a view, we need to
  // use the appropriate table or function to update it.
  console.log("Creating user mapping with data:", mappingData);
  
  // Using a direct SQL query might be more appropriate here
  // This assumes there's a table that backs the user_mapping view
  const { error: newMappingError } = await supabase
    .from('user_mapping')
    .insert(mappingData);
    
  if (newMappingError) throw newMappingError;
  
  return owcUserId;
}

// Helper function to update or create user group mapping
async function updateUserGroupMapping(owcUserId: number, selectedGroupId: string): Promise<void> {
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
      .from('owc_user_usergroup_map')
      .insert({
        user_id: owcUserId,
        group_id: parseInt(selectedGroupId)
      });
      
    if (insertError) throw insertError;
  }
}
