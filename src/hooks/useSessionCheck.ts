
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export const useSessionCheck = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkSession = async () => {
      console.log("Checking for existing session...");
      const { data } = await supabase.auth.getSession();
      
      if (data.session) {
        console.log("Found existing session, user is already authenticated:", data.session.user.email);
        setIsAuthenticated(true);
        
        // Store the email for reference
        sessionStorage.setItem('currentUserEmail', data.session.user.email || "");
      }
    };
    
    checkSession();
  }, []);

  return { isAuthenticated, setIsAuthenticated };
};
