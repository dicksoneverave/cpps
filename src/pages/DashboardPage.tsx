
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import Dashboard from "@/components/Dashboard";
import Navbar from "@/components/Navbar";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const DashboardPage: React.FC = () => {
  const { user, loading, userRole } = useAuth();
  const navigate = useNavigate();
  const [isCheckingRole, setIsCheckingRole] = useState(false);

  useEffect(() => {
    const checkUserRole = async () => {
      if (!user) return;
      
      setIsCheckingRole(true);
      
      try {
        // Double-check user role in case it wasn't properly loaded
        if (!userRole && user.email !== "administrator@gmail.com") {
          console.log("Verifying role for user:", user.email);
          
          // Try to get owc_user_id from user_mapping
          const { data: mappingData } = await supabase
            .from('user_mapping')
            .select('owc_user_id')
            .eq('email', user.email)
            .maybeSingle();
            
          if (mappingData?.owc_user_id) {
            console.log("Found owc_user_id:", mappingData.owc_user_id);
            
            // Get group from owc_user_usergroup_map
            const { data: groupData } = await supabase
              .from('owc_user_usergroup_map')
              .select('group_id, owc_usergroups:owc_usergroups(title)')
              .eq('user_id', mappingData.owc_user_id)
              .maybeSingle();
              
            if (groupData?.owc_usergroups) {
              console.log("Found group data:", groupData);
            } else {
              console.log("No group data found for user");
            }
          }
        }
      } catch (error) {
        console.error("Error checking user role:", error);
      } finally {
        setIsCheckingRole(false);
      }
    };
    
    if (user && !loading) {
      checkUserRole();
    }
  }, [user, userRole, loading]);
  
  useEffect(() => {
    if (!loading) {
      if (!user) {
        // Redirect to login if no user
        console.log("No user found, redirecting to login");
        navigate("/login");
        return;
      }
      
      // Special case for administrator@gmail.com
      if (user.email === "administrator@gmail.com") {
        console.log("Admin user found, redirecting to admin page");
        navigate("/admin");
        return;
      }
    }
  }, [user, loading, navigate]);

  if (loading || isCheckingRole) {
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
        <Dashboard userRole={userRole || ""} />
      </div>
    </div>
  );
};

export default DashboardPage;
