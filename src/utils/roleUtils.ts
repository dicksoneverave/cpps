
import { supabase } from "@/integrations/supabase/client";

/**
 * Check if a role string matches any admin role variant
 */
export const isAdminRole = (role: string | null): boolean => {
  if (!role) return false;
  const adminRoles = ["OWC Admin", "owcadmin", "OWCAdminMenu"];
  return adminRoles.some(adminRole => 
    role.toLowerCase().includes(adminRole.toLowerCase())
  );
};

/**
 * Fetch user role using email mapping
 */
export const fetchRoleByEmail = async (email: string): Promise<string | null> => {
  try {
    const { data: mappingData } = await supabase
      .from('user_mapping')
      .select('owc_user_id')
      .eq('email', email)
      .maybeSingle();
      
    if (mappingData?.owc_user_id) {
      const { data: userGroupData } = await supabase
        .from('owc_user_usergroup_map')
        .select(`
          group_id,
          owc_usergroups:owc_usergroups(title)
        `)
        .eq('user_id', mappingData.owc_user_id)
        .maybeSingle();
        
      if (userGroupData?.owc_usergroups) {
        const groupData = userGroupData.owc_usergroups as unknown as { title?: string };
        if (groupData?.title) {
          return groupData.title;
        }
      }
    }
    return null;
  } catch (e) {
    console.error("Error in email-based role lookup:", e);
    return null;
  }
};

/**
 * Fetch user role using auth user ID mapping
 */
export const fetchRoleByAuthId = async (userId: string): Promise<string | null> => {
  try {
    const { data: mappingData } = await supabase
      .from('user_mapping')
      .select('owc_user_id')
      .eq('auth_user_id', userId)
      .maybeSingle();
    
    if (mappingData?.owc_user_id) {
      const { data: userGroupData } = await supabase
        .from('owc_user_usergroup_map')
        .select(`
          group_id,
          owc_usergroups:owc_usergroups(title)
        `)
        .eq('user_id', mappingData.owc_user_id)
        .maybeSingle();
        
      if (userGroupData?.owc_usergroups) {
        const groupData = userGroupData.owc_usergroups as unknown as { title?: string };
        if (groupData?.title) {
          return groupData.title;
        }
      }
    }
    return null;
  } catch (e) {
    console.error("Error in auth_user_id-based role lookup:", e);
    return null;
  }
};

/**
 * Fetch role from session storage
 */
export const getRoleFromSessionStorage = (): string | null => {
  return sessionStorage.getItem('userRole');
};

/**
 * Save role to session storage
 */
export const saveRoleToSessionStorage = (role: string): void => {
  if (role) {
    sessionStorage.removeItem('userRole');
    sessionStorage.setItem('userRole', role);
  }
};
