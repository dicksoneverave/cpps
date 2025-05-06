
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { getRoleFromSessionStorage, saveRoleToSessionStorage } from "@/utils/roles/sessionStorage";

// Define types for our data structures
interface UserGroupData {
  id: string;
  owc_user_usergroup_map: {
    group_id: number;
    owc_usergroups: {
      id: number;
      title: string;
    };
  }[];
}

interface RoleData {
  userId: string | null;
  groupId: number | null;
  groupTitle: string | null;
}

/**
 * Custom hook that fetches user role data from Supabase
 * @returns Object containing user ID, group ID, and group title
 */
export const useRoleData = (): RoleData => {
  // Initialize state variables for role data
  const [userId, setUserId] = useState<string | null>(null);
  const [groupId, setGroupId] = useState<number | null>(null);
  const [groupTitle, setGroupTitle] = useState<string | null>(getRoleFromSessionStorage());

  useEffect(() => {
    const fetchUserRoleDetails = async () => {
      // Get user email from session storage
      const currentEmail = sessionStorage.getItem('currentUserEmail');
      
      if (!currentEmail) {
        console.log("No email found in session storage for role lookup");
        return;
      }
      
      try {
        console.log("Fetching role data for email:", currentEmail);
        
        // First try the optimized query that joins all tables
        const { data, error } = await supabase
          .from('users')
          .select(`
            id, 
            owc_user_usergroup_map!inner(
              group_id,
              owc_usergroups!inner(
                id, 
                title
              )
            )
          `)
          .eq('email', currentEmail)
          .single();
          
        if (error) {
          console.error("Error fetching user role data:", error);
          // Fall back to step-by-step approach
        }
        
        if (data) {
          console.log("User role data fetched:", data);
          setUserId(data.id);
          
          // Cast data to UserGroupData type to access nested properties
          const userData = data as unknown as UserGroupData;
          if (userData.owc_user_usergroup_map && userData.owc_user_usergroup_map.length > 0) {
            const userGroup = userData.owc_user_usergroup_map[0];
            setGroupId(userGroup.group_id);
            
            if (userGroup.owc_usergroups) {
              const role = userGroup.owc_usergroups.title;
              setGroupTitle(role);
              
              // Persist the role in session storage
              if (role) {
                saveRoleToSessionStorage(role);
              }
            }
          }
          return;
        }
        
        // If the optimized query fails, fall back to step-by-step approach
        console.log("Using fallback approach to fetch role data");
        await fetchRoleStepByStep(currentEmail);
      } catch (error) {
        console.error("Error in role detail lookup:", error);
      }
    };
    
    fetchUserRoleDetails();
  }, []);

  /**
   * Fallback function to fetch role data step by step
   */
  const fetchRoleStepByStep = async (email: string) => {
    try {
      // Step 1: Get user ID from users table
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('id')
        .eq('email', email)
        .maybeSingle();
        
      if (userError) {
        console.error("Error fetching user ID:", userError);
        return;
      }
      
      if (userData?.id) {
        setUserId(userData.id);
        
        // Step 2: Get group ID from owc_user_usergroup_map
        console.log("Looking up group_id for user ID:", userData.id);
        const { data: groupMapData, error: groupMapError } = await supabase
          .from('owc_user_usergroup_map')
          .select('group_id')
          .eq('auth_user_id', userData.id)
          .maybeSingle();
          
        if (groupMapError) {
          console.error("Error fetching group ID:", groupMapError);
          return;
        }
        
        if (groupMapData?.group_id) {
          console.log("Found group_id:", groupMapData.group_id);
          setGroupId(groupMapData.group_id);
          
          // Step 3: Get group title from owc_usergroups
          const { data: groupData, error: groupError } = await supabase
            .from('owc_usergroups')
            .select('title')
            .eq('id', groupMapData.group_id)
            .maybeSingle();
            
          if (groupError) {
            console.error("Error fetching group title:", groupError);
            return;
          }
          
          if (groupData?.title) {
            console.log("Found group title:", groupData.title);
            const role = groupData.title;
            setGroupTitle(role);
            
            // Persist the role in session storage
            saveRoleToSessionStorage(role);
          } else {
            console.log("No title found for group ID:", groupMapData.group_id);
          }
        } else {
          console.log("No group mapping found for user ID:", userData.id);
        }
      }
    } catch (error) {
      console.error("Error in step-by-step role lookup:", error);
    }
  };

  return { userId, groupId, groupTitle };
};
