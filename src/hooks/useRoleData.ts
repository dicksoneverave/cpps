
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

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
  const [userId, setUserId] = useState<string | null>(null);
  const [groupId, setGroupId] = useState<number | null>(null);
  const [groupTitle, setGroupTitle] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserRoleDetails = async () => {
      // Get user ID from either auth context or session storage
      const currentEmail = sessionStorage.getItem('currentUserEmail');
      
      if (currentEmail) {
        try {
          console.log("Fetching role data for email:", currentEmail);
          
          // Get the role title using a direct query that joins all the necessary tables
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
            return;
          }
          
          if (data) {
            console.log("User role data fetched:", data);
            setUserId(data.id);
            
            // Extract the group_id and title from the nested data structure
            if (data.owc_user_usergroup_map && data.owc_user_usergroup_map.length > 0) {
              const userGroup = data.owc_user_usergroup_map[0];
              setGroupId(userGroup.group_id);
              
              if (userGroup.owc_usergroups) {
                setGroupTitle(userGroup.owc_usergroups.title);
                console.log("Found group title:", userGroup.owc_usergroups.title);
              }
            }
          } else {
            console.log("No user role data found for email:", currentEmail);
            
            // Fallback to the previous step-by-step approach
            console.log("Using fallback approach to fetch role data");
            
            // Step 1: Get user ID from users table
            const { data: userData, error: userError } = await supabase
              .from('users')
              .select('id')
              .eq('email', currentEmail)
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
                  setGroupTitle(groupData.title);
                } else {
                  console.log("No title found for group ID:", groupMapData.group_id);
                }
              } else {
                console.log("No group mapping found for user ID:", userData.id);
              }
            }
          }
        } catch (error) {
          console.error("Error in role detail lookup:", error);
        }
      } else {
        console.log("No email found in session storage for role lookup");
      }
    };
    
    fetchUserRoleDetails();
  }, []);

  return { userId, groupId, groupTitle };
};
