
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";
import { getDashboardPathByGroupTitle } from "@/services/admin/userGroupService";

interface SessionCheckerProps {
  onSessionChecked: () => void;
  setDisplayRole: React.Dispatch<React.SetStateAction<string | null>>;
}

const SessionChecker: React.FC<SessionCheckerProps> = ({ onSessionChecked, setDisplayRole }) => {
  const [isChecking, setIsChecking] = useState(true);
  const navigate = useNavigate();

  // Known email role mappings
  const knownEmailRoleMappings: Record<string, string> = {
    "dr@owc.gov.pg": "Commissioner",
    "dr@owc.govpg": "Commissioner",
  };

  useEffect(() => {
    const checkSession = async () => {
      setIsChecking(true);
      try {
        console.log("Checking session in SessionChecker...");
        const { data } = await supabase.auth.getSession();
        const storedRole = sessionStorage.getItem('userRole');
        const storedEmail = sessionStorage.getItem('currentUserEmail');
        
        if (!data.session && !storedRole && !storedEmail) {
          console.log("No session or role found in SessionChecker, redirecting to login");
          navigate("/login", { replace: true });
          return;
        } else if (data.session) {
          console.log("Session found in SessionChecker:", data.session.user.email);
          
          // Special case for administrator@gmail.com
          if (data.session.user.email === "administrator@gmail.com") {
            console.log("Admin user found, redirecting to admin page");
            navigate("/admin", { replace: true });
            return;
          }

          // Special case for known email mappings
          if (data.session.user.email && knownEmailRoleMappings[data.session.user.email]) {
            const knownRole = knownEmailRoleMappings[data.session.user.email];
            console.log(`Known email mapping found for ${data.session.user.email}: ${knownRole}`);
            setDisplayRole(knownRole);
            sessionStorage.setItem('userRole', knownRole);
            
            // Redirect to role-specific dashboard
            const dashboardPath = getDashboardPathByGroupTitle(knownRole);
            console.log("Redirecting to role-specific dashboard:", dashboardPath);
            navigate(dashboardPath, { replace: true });
            return;
          }
          
          // For all other users with sessions, check if we can directly get the role
          if (data.session.user.id) {
            // Step 1: Try to get the group_id from owc_user_usergroup_map 
            const { data: userGroupData } = await supabase
              .from('owc_user_usergroup_map')
              .select('group_id')
              .eq('auth_user_id', data.session.user.id)
              .maybeSingle();
              
            if (userGroupData?.group_id) {
              const groupId = userGroupData.group_id;
              
              // Step 2: Get the group title from owc_usergroups using group_id
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
                return;
              }
            }
          }
          
          console.log("Regular user with session found, allowing dashboard access");
        } else if (storedEmail) {
          console.log("No Supabase session but found email in sessionStorage:", storedEmail);
          
          if (storedEmail === "administrator@gmail.com") {
            console.log("Admin email found in session storage, redirecting to admin page");
            navigate("/admin", { replace: true });
            return;
          }
          
          // Check for known email mappings in sessionStorage
          if (knownEmailRoleMappings[storedEmail]) {
            const knownRole = knownEmailRoleMappings[storedEmail];
            console.log(`Known email mapping found for ${storedEmail}: ${knownRole}`);
            setDisplayRole(knownRole);
            sessionStorage.setItem('userRole', knownRole);
            
            // Redirect to role-specific dashboard
            const dashboardPath = getDashboardPathByGroupTitle(knownRole);
            console.log("Redirecting to role-specific dashboard:", dashboardPath);
            navigate(dashboardPath, { replace: true });
            return;
          }
          
          console.log("Regular user email found in session storage, allowing dashboard access");
        } else if (storedRole) {
          console.log("No Supabase session but found role in sessionStorage, allowing dashboard access");
          
          // Redirect to role-specific dashboard
          const dashboardPath = getDashboardPathByGroupTitle(storedRole);
          if (dashboardPath !== "/dashboard") {
            console.log("Redirecting to role-specific dashboard:", dashboardPath);
            navigate(dashboardPath, { replace: true });
            return;
          }
        }
      } catch (error) {
        console.error("Error checking session:", error);
      } finally {
        setIsChecking(false);
        onSessionChecked();
      }
    };
    
    checkSession();
  }, [navigate, setDisplayRole, knownEmailRoleMappings, onSessionChecked]);

  if (isChecking) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary mr-2" />
        <span>Checking session...</span>
      </div>
    );
  }

  return null;
};

export default SessionChecker;
