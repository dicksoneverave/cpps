
import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Session, User } from "@supabase/supabase-js";
import { getUserRole } from "@/utils/authUtils";

interface AuthContextType {
  session: Session | null;
  user: User | null;
  userRole: string | null;
  loading: boolean;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ 
  children 
}) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set up the auth state listener first
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, newSession) => {
        setSession(newSession);
        setUser(newSession?.user ?? null);
        
        // If session changes, fetch the user role
        if (newSession?.user) {
          // Use a timeout to avoid deadlocks in the Supabase auth state manager
          setTimeout(() => {
            fetchUserRole(newSession.user.id, newSession.user.email || "");
          }, 0);
        } else {
          setUserRole(null);
        }
      }
    );

    // Check for existing session
    const initializeAuth = async () => {
      try {
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        
        if (currentSession?.user) {
          await fetchUserRole(currentSession.user.id, currentSession.user.email || "");
        }
      } catch (error) {
        console.error("Error initializing auth:", error);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    // Cleanup subscription on unmount
    return () => subscription.unsubscribe();
  }, []);

  const fetchUserRole = async (userId: string, email: string) => {
    try {
      // First check if we have a stored role in session storage
      const storedRole = sessionStorage.getItem('userRole');
      if (storedRole) {
        setUserRole(storedRole);
        return;
      }
      
      // Try to get role from email mapping first as it's more reliable
      // with the current database schema issues
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
              setUserRole(groupData.title);
              sessionStorage.setItem('userRole', groupData.title);
              return;
            }
          }
        }
      } catch (e) {
        console.error("Error in email-based role lookup:", e);
        // Continue to fallback method
      }
      
      // Fallback to auth user id mapping
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
              setUserRole(groupData.title);
              sessionStorage.setItem('userRole', groupData.title);
              return;
            }
          }
        }
      } catch (e) {
        console.error("Error in auth_user_id-based role lookup:", e);
        // Continue to fallback method
      }
      
      // Last resort, use generic role lookup
      const role = await getUserRole(userId);
      setUserRole(role);
      if (role) {
        sessionStorage.setItem('userRole', role);
      }
    } catch (error) {
      console.error("Error in fetchUserRole:", error);
      setUserRole("User"); // Default role if all else fails
    }
  };

  const logout = async () => {
    sessionStorage.removeItem('userRole');
    
    try {
      // Sign out from Supabase Auth
      await supabase.auth.signOut();
      setSession(null);
      setUser(null);
      setUserRole(null);
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  const value = {
    session,
    user,
    userRole,
    loading,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
