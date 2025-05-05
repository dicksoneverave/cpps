
import { useState, useEffect, useCallback } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { useUserRole } from "./useUserRole";

export const useAuthState = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { userRole, isAdmin, fetchUserRole, setIsAdmin } = useUserRole();

  const initializeAuth = useCallback(async () => {
    try {
      console.log("Initializing auth...");
      const { data: { session: currentSession } } = await supabase.auth.getSession();
      console.log("Initial session check:", currentSession?.user?.email);
      
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      
      if (currentSession?.user) {
        // Directly set admin flag for administrator@gmail.com
        if (currentSession.user.email === "administrator@gmail.com") {
          console.log("Setting admin flag for administrator@gmail.com");
          setIsAdmin(true);
        } else {
          console.log("Fetching user role for:", currentSession.user.email);
          await fetchUserRole(currentSession.user.id, currentSession.user.email || "");
        }
      }
    } catch (error) {
      console.error("Error initializing auth:", error);
    } finally {
      setLoading(false);
    }
  }, [fetchUserRole, setIsAdmin]);

  useEffect(() => {
    console.log("Setting up auth state listeners...");
    
    // Set up the auth state listener first to avoid missing events
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, newSession) => {
        console.log("Auth state changed:", event, newSession?.user?.email);
        
        setSession(newSession);
        setUser(newSession?.user ?? null);
        
        // If session changes, fetch the user role
        if (newSession?.user) {
          // Directly set admin flag for administrator@gmail.com
          if (newSession.user.email === "administrator@gmail.com") {
            console.log("Setting admin flag on auth state change for administrator@gmail.com");
            setIsAdmin(true);
          } else {
            // Use a timeout to avoid deadlocks in the Supabase auth state manager
            setTimeout(() => {
              console.log("Fetching user role on auth state change:", newSession.user.email);
              fetchUserRole(newSession.user.id, newSession.user.email || "");
            }, 0);
          }
        } else {
          sessionStorage.removeItem('userRole');
          setIsAdmin(false);
        }
      }
    );

    // Check for existing session
    initializeAuth();

    // Cleanup subscription on unmount
    return () => {
      console.log("Cleaning up auth state subscription");
      subscription.unsubscribe();
    };
  }, [initializeAuth, fetchUserRole, setIsAdmin]);

  return { session, user, userRole, loading, isAdmin };
};
