
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";
import { getDashboardPathByGroupTitle } from "@/services/admin/userGroupService";
import { fetchRoleByEmail } from "@/utils/roles";

interface RoleCheckerProps {
  displayRole: string | null;
  setDisplayRole: React.Dispatch<React.SetStateAction<string | null>>;
}

const RoleChecker: React.FC<RoleCheckerProps> = ({ displayRole, setDisplayRole }) => {
  const { user, loading, userRole } = useAuth();
  const [isChecking, setIsChecking] = useState(true);
  const navigate = useNavigate();

  // Known email role mappings
  const knownEmailRoleMappings: Record<string, string> = {
    "dr@owc.gov.pg": "Commissioner",
    "dr@owc.govpg": "Commissioner",
  };

  useEffect(() => {
    const checkUserRole = async () => {
      if (!user && !sessionStorage.getItem('userRole') && !sessionStorage.getItem('currentUserEmail')) {
        console.log("No user, role, or email found, skipping role check");
        setIsChecking(false);
        return;
      }
      
      setIsChecking(true);
      
      try {
        // If we don't have a role yet, try to fetch it directly
        if (!displayRole && !userRole) {
          const email = user?.email || sessionStorage.getItem('currentUserEmail');
          const userId = user?.id;
          
          if (email) {
            // Check for known email mappings
            if (knownEmailRoleMappings[email]) {
              const knownRole = knownEmailRoleMappings[email];
              console.log(`Known email mapping found for ${email}: ${knownRole}`);
              setDisplayRole(knownRole);
              sessionStorage.setItem('userRole', knownRole);
              
              // Redirect to role-specific dashboard
              const dashboardPath = getDashboardPathByGroupTitle(knownRole);
              console.log("Redirecting to role-specific dashboard:", dashboardPath);
              navigate(dashboardPath, { replace: true });
              
              setIsChecking(false);
              return;
            }
            
            if (email !== "administrator@gmail.com") {
              console.log("No role found in context or session, fetching directly...");
              
              // Step 1: Try the direct approach first using auth_user_id in owc_user_usergroup_map
              if (userId) {
                // Get the group_id from owc_user_usergroup_map
                const { data: userGroupData } = await supabase
                  .from('owc_user_usergroup_map')
                  .select('group_id')
                  .eq('auth_user_id', userId)
                  .maybeSingle();
                  
                if (userGroupData?.group_id) {
                  const groupId = userGroupData.group_id;
                  
                  // Get the group title from owc_usergroups using id
                  const { data: groupData } = await supabase
                    .from('owc_usergroups')
                    .select('title')
                    .eq('id', groupId)
                    .maybeSingle();
                    
                  if (groupData?.title) {
                    console.log("Found user role directly:", groupData.title);
                    setDisplayRole(groupData.title);
                    sessionStorage.setItem('userRole', groupData.title);
                    
                    // Redirect to role-specific dashboard
                    const dashboardPath = getDashboardPathByGroupTitle(groupData.title);
                    console.log("Redirecting to role-specific dashboard:", dashboardPath);
                    navigate(dashboardPath, { replace: true });
                    
                    setIsChecking(false);
                    return;
                  }
                }
              }
              
              // Fall back to email-based lookup
              const fetchedRole = await fetchRoleByEmail(email);
              console.log("Directly fetched role:", fetchedRole);
              
              if (fetchedRole) {
                setDisplayRole(fetchedRole);
                
                // Redirect to role-specific dashboard
                const dashboardPath = getDashboardPathByGroupTitle(fetchedRole);
                console.log("Redirecting to role-specific dashboard:", dashboardPath);
                navigate(dashboardPath, { replace: true });
              }
            }
          }
        } else if (displayRole || userRole) {
          // We have a role, so redirect to the appropriate dashboard
          const effectiveRole = displayRole || userRole;
          const dashboardPath = getDashboardPathByGroupTitle(effectiveRole);
          
          if (dashboardPath !== "/dashboard") {
            console.log("Redirecting to role-specific dashboard:", dashboardPath);
            navigate(dashboardPath, { replace: true });
          }
        }
      } catch (error) {
        console.error("Error checking user role:", error);
      } finally {
        setIsChecking(false);
      }
    };
    
    if (!loading) {
      checkUserRole();
    }
  }, [user, userRole, loading, displayRole, navigate, knownEmailRoleMappings, setDisplayRole]);

  if (loading || isChecking) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary mr-2" />
        <span>Checking role...</span>
      </div>
    );
  }

  return null;
};

export default RoleChecker;
