
import React, { createContext, useContext } from "react";
import { useAuthState } from "@/hooks/useAuthState";
import { useLogout } from "@/hooks/useLogout";
import { AuthContextType } from "@/types/authTypes";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ 
  children 
}) => {
  const { session, user, userRole, loading, isAdmin } = useAuthState();
  const { logout } = useLogout();

  const value = {
    session,
    user,
    userRole,
    loading,
    logout,
    isAdmin,
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
