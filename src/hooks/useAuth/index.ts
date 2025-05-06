
import { useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useLoginForm } from "./useLoginForm";
import { useAuthState } from "./useAuthState";
import { useRedirection } from "./useRedirection";
import { useAuthenticator } from "./useAuthenticator";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";

export const useAuth = () => {
  const { email, setEmail, password, setPassword, loading, setLoading, error, setError } = useLoginForm();
  const { isAuthenticated, setIsAuthenticated } = useAuthState();
  const { redirectBasedOnRole } = useRedirection();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Use the extracted authenticator hook for handling login logic
  const { handleLogin } = useAuthenticator(
    email,
    password,
    setLoading,
    setError,
    setIsAuthenticated
  );

  return {
    email,
    setEmail,
    password,
    setPassword,
    loading,
    error,
    isAuthenticated,
    handleLogin,
    redirectBasedOnRole
  };
};

// Re-export hooks for direct usage if needed
export { useLoginForm } from "./useLoginForm";
export { useAuthState } from "./useAuthState";
export { useRedirection } from "./useRedirection";
