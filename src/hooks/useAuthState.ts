
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
      
      if (currentSession) {
        setSession(currentSession);
        setUser(currentSession.user);
        
        if (currentSession.user) {
          // Save current user email to session storage for persistence
          sessionStorage.setItem('currentUserEmail', currentSession.user.email || "");
          
          // Directly set admin flag for administrator@gmail.com
          if (currentSession.user.email === "administrator@gmail.com") {
            console.log("Setting admin flag for administrator@gmail.com");
            setIsAdmin(true);
          } else {
            console.log("Fetching user role for:", currentSession.user.email);
            await fetchUserRole(currentSession.user.id, currentSession.user.email || "");
          }
        }
      } else {
        // Try to work with session storage if no active Supabase session
        const storedRole = sessionStorage.getItem('userRole');
        const storedEmail = sessionStorage.getItem('currentUserEmail');
        
        if (storedRole && storedEmail) {
          console.log("No Supabase session but found stored role and email:", storedRole, storedEmail);
          // We can work with stored information despite no Supabase session
        } else {
          console.log("No session data found in Supabase or session storage");
          // Clear session data if no active session
          setSession(null);
          setUser(null);
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
        
        if (newSession) {
          setSession(newSession);
          setUser(newSession.user);
          
          // If session changes, fetch the user role
          if (newSession.user) {
            // Save current user email to session storage for persistence
            sessionStorage.setItem('currentUserEmail', newSession.user.email || "");
            
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
          }
        } else if (event === 'SIGNED_OUT') {
          // Clear session data on logout
          console.log("User signed out, clearing session data");
          sessionStorage.removeItem('userRole');
          sessionStorage.removeItem('currentUserEmail');
          setSession(null);
          setUser(null);
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
