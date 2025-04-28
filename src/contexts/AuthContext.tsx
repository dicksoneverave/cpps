
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
          fetchUserRole(newSession.user.id);
        } else {
          setUserRole(null);
        }
      }
    );

    // Check for existing session
    const initializeAuth = async () => {
      const { data: { session: currentSession } } = await supabase.auth.getSession();
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      
      if (currentSession?.user) {
        await fetchUserRole(currentSession.user.id);
      }
      
      setLoading(false);
    };

    initializeAuth();

    // Cleanup subscription on unmount
    return () => subscription.unsubscribe();
  }, []);

  const fetchUserRole = async (userId: string) => {
    try {
      // First check if we can find a mapping to an owc_user
      const { data: mappingData } = await supabase
        .from('user_mapping')
        .select('owc_user_id')
        .eq('auth_user_id', userId);
      
      // If we found a mapping, use the owc_user_id to get the role
      if (mappingData && mappingData.length > 0) {
        const owcUserId = mappingData[0].owc_user_id;
        
        // Fetch the user's group from the mapping table
        const { data: userGroupData } = await supabase
          .from('owc_user_usergroup_map')
          .select(`
            group_id,
            owc_usergroups:owc_usergroups(title)
          `)
          .eq('user_id', owcUserId)
          .single();
          
        if (userGroupData && userGroupData.owc_usergroups) {
          // Handle the data as an unknown type first, then cast it properly
          const groupData = userGroupData.owc_usergroups as unknown as { title?: string };
          if (groupData && groupData.title) {
            setUserRole(groupData.title);
            return;
          }
        }
      }
      
      // If no mapping found or no role found, fall back to the stored role
      const storedRole = sessionStorage.getItem('userRole');
      if (storedRole) {
        setUserRole(storedRole);
        return;
      }
      
      // Last resort, use generic role lookup
      const role = await getUserRole(userId);
      setUserRole(role);
    } catch (error) {
      console.error("Error in fetchUserRole:", error);
      setUserRole("User");
    }
  };

  const logout = async () => {
    sessionStorage.removeItem('userRole');
    
    // Sign out from Supabase Auth
    await supabase.auth.signOut();
    setSession(null);
    setUser(null);
    setUserRole(null);
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
