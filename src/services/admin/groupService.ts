
import { supabase } from "@/integrations/supabase/client";
import { UserGroup } from "@/types/adminTypes";

// Fetch user groups
export const fetchUserGroups = async (): Promise<UserGroup[]> => {
  try {
    const { data, error } = await supabase
      .from('owc_usergroups')
      .select('id, title')
      .order('title');
    
    if (error) throw error;
    
    // Convert id to string to match UserGroup type
    return data.map(group => ({
      id: group.id.toString(),
      title: group.title || ""
    })) || [];
  } catch (error) {
    console.error("Error fetching user groups:", error);
    throw error;
  }
};
