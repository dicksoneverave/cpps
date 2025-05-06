
import { useState } from "react";

/**
 * Hook to manage authentication state
 */
export const useAuthState = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  
  return {
    isAuthenticated,
    setIsAuthenticated
  };
};
