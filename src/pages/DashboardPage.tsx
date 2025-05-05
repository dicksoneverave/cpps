import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import Dashboard from "@/components/Dashboard";
import Navbar from "@/components/Navbar";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { fetchRoleByEmail, getRoleFromSessionStorage, saveRoleToSessionStorage } from "@/utils/roles";
import { getDashboardPathByGroupTitle } from "@/services/admin/userGroupService";

const DashboardPage: React.FC = () => {
  const { user, loading, userRole } = useAuth();
  const navigate = useNavigate();
  const [isCheckingRole, setIsCheckingRole] = useState(false);
  const [displayRole, setDisplayRole] = useState<string | null>(null);
  const [isCheckingSession, setIsCheckingSession] = useState(true);

  // Known email role mappings
  const knownEmailRoleMappings: Record<string, string> = {
    "dr@owc.gov.pg": "Commissioner",
    "dr@owc.govpg": "Commissioner",
  };

  useEffect(() => {
    // First, check if we already have a role saved in session storage
    const storedRole = getRoleFromSessionStorage();
    if (storedRole) {
      console.log("Using stored role in DashboardPage:", storedRole);
      setDisplayRole(storedRole);
      
      // Redirect to role-specific dashboard
      const dashboardPath = getDashboardPathByGroupTitle(storedRole);
      if (dashboardPath !== "/dashboard") {
        console.log("Redirecting to role-specific dashboard:", dashboardPath);
        navigate(dashboardPath, { replace: true });
        return;
      }
    } else {
      setDisplayRole(userRole);
      
      // Redirect to role-specific dashboard if userRole is available
      if (userRole) {
        const dashboardPath = getDashboardPathByGroupTitle(userRole);
        if (dashboardPath !== "/dashboard") {
          console.log("Redirecting to role-specific dashboard based on userRole:", dashboardPath);
          navigate(dashboardPath, { replace: true });
          return;
        }
      }
    }

    // Check for session to determine auth status
    const checkSession = async () => {
      setIsCheckingSession(true);
      try {
        console.log("Checking session in DashboardPage...");
        const { data } = await supabase.auth.getSession();
        const storedEmail = sessionStorage.getItem('currentUserEmail');
        
        if (!data.session && !storedRole && !storedEmail) {
          console.log("No session or role found in DashboardPage, redirecting to login");
          navigate("/login", { replace: true });
          return;
        } else if (data.session) {
          console.log("Session found in DashboardPage:", data.session.user.email);
          
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
            saveRoleToSessionStorage(knownRole);
            
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
                saveRoleToSessionStorage(groupData.title);
                
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
            saveRoleToSessionStorage(knownRole);
            
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
        setIsCheckingSession(false);
      }
    };
    
    checkSession();
  }, [navigate, userRole, knownEmailRoleMappings]);

  useEffect(() => {
    const checkUserRole = async () => {
      if (!user && !getRoleFromSessionStorage() && !sessionStorage.getItem('currentUserEmail')) {
        console.log("No user, role, or email found, skipping role check");
        return;
      }
      
      setIsCheckingRole(true);
      
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
              saveRoleToSessionStorage(knownRole);
              
              // Redirect to role-specific dashboard
              const dashboardPath = getDashboardPathByGroupTitle(knownRole);
              console.log("Redirecting to role-specific dashboard:", dashboardPath);
              navigate(dashboardPath, { replace: true });
              
              setIsCheckingRole(false);
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
                    saveRoleToSessionStorage(groupData.title);
                    
                    // Redirect to role-specific dashboard
                    const dashboardPath = getDashboardPathByGroupTitle(groupData.title);
                    console.log("Redirecting to role-specific dashboard:", dashboardPath);
                    navigate(dashboardPath, { replace: true });
                    
                    setIsCheckingRole(false);
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
        setIsCheckingRole(false);
      }
    };
    
    if (!loading) {
      checkUserRole();
    }
  }, [user, userRole, loading, displayRole, navigate, knownEmailRoleMappings]);

  if (loading || isCheckingRole || isCheckingSession) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary mr-2" />
        <span>Loading your dashboard...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <div className="flex-1 container mx-auto p-4">
        <Dashboard userRole={displayRole || "User"} />
      </div>
    </div>
  );
};

export default DashboardPage;
