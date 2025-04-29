
import { useState, useCallback } from "react";
import { fetchUserRoleComprehensive } from "@/services/auth";
import { isAdminRole } from "@/utils/roleUtils";

export const useUserRole = () => {
  const [userRole, setUserRole] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  const fetchUserRole = useCallback(async (userId: string, email: string) => {
    try {
      // Special case for administrator@gmail.com
      if (email === "administrator@gmail.com") {
        setUserRole("OWC Admin");
        setIsAdmin(true);
        return;
      }
      
      const role = await fetchUserRoleComprehensive(userId, email);
      setUserRole(role);
      setIsAdmin(isAdminRole(role));
    } catch (error) {
      console.error("Error in fetchUserRole:", error);
      setUserRole("User"); // Default role if all else fails
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
