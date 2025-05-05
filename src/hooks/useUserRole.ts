
import { useState, useCallback, useEffect } from "react";
import { fetchUserRoleComprehensive } from "@/services/auth";
import { isAdminRole, getRoleFromSessionStorage, saveRoleToSessionStorage } from "@/utils/roleUtils";

export const useUserRole = () => {
  // Initialize from session storage if available
  const initialRole = getRoleFromSessionStorage();
  const initialIsAdmin = isAdminRole(initialRole);
  
  const [userRole, setUserRole] = useState<string | null>(initialRole);
  const [isAdmin, setIsAdmin] = useState(initialIsAdmin);

  // When component mounts, double-check the role from session storage
  useEffect(() => {
    const storedRole = getRoleFromSessionStorage();
    if (storedRole && storedRole !== userRole) {
      console.log("Syncing role from session storage:", storedRole);
      setUserRole(storedRole);
      setIsAdmin(isAdminRole(storedRole));
    }
  }, [userRole]);

  const fetchUserRole = useCallback(async (userId: string, email: string) => {
    try {
      console.log("Starting role fetch for:", email);
      
      // Special case for administrator@gmail.com
      if (email === "administrator@gmail.com") {
        console.log("Setting admin role for administrator@gmail.com");
        setUserRole("OWC Admin");
        saveRoleToSessionStorage("OWC Admin");
        setIsAdmin(true);
        return;
      }
      
      // Check if we already have a role in session storage
      const storedRole = getRoleFromSessionStorage();
      if (storedRole) {
        console.log("Using stored role:", storedRole);
        setUserRole(storedRole);
        setIsAdmin(isAdminRole(storedRole));
        return;
      }
      
      // Try to get the role using comprehensive lookup
      console.log("Fetching role comprehensively for:", email);
      const role = await fetchUserRoleComprehensive(userId, email);
      console.log("Fetched role result:", role);
      
      setUserRole(role);
      saveRoleToSessionStorage(role || "User");
      
      // Update admin status based on role
      const adminStatus = isAdminRole(role);
      console.log("Setting admin status:", adminStatus, "based on role:", role);
      setIsAdmin(adminStatus);
    } catch (error) {
      console.error("Error in fetchUserRole:", error);
      setUserRole("User"); // Default role if all else fails
      saveRoleToSessionStorage("User");
      setIsAdmin(false);
    }
  }, []);

  return {
    userRole,
    isAdmin,
    fetchUserRole,
    setUserRole,
    setIsAdmin
  };
};
