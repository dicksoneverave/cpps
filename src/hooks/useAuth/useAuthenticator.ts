
import { useToast } from "@/components/ui/use-toast";
import { loginWithSupabaseAuth } from "@/services/auth/loginService";
import { getDashboardPathByGroupTitle } from "@/services/admin/userGroupService";
import { useNavigate } from "react-router-dom";

/**
 * Hook to handle user authentication
 */
export const useAuthenticator = (
  email: string, 
  setLoading: (loading: boolean) => void,
  setError: (error: string | null) => void,
  setIsAuthenticated: (isAuthenticated: boolean) => void
) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    console.log("[useAuth Debug] Login attempt for:", email);

    try {
      console.log("[useAuth Debug] Attempting login for:", email);
      
      // Use our custom login service which handles authentication
      try {
        const loginResponse = await loginWithSupabaseAuth(email, password);
        
        if (loginResponse.customUser) {
          console.log("[useAuth Debug] Custom login successful for:", email);
          console.log("[useAuth Debug] User role:", loginResponse.userRole);
          
          sessionStorage.setItem('currentUserEmail', email);
          
          if (loginResponse.userRole) {
            sessionStorage.setItem('userRole', loginResponse.userRole);
            setIsAuthenticated(true);
            
            toast({
              title: "Login Successful",
              description: `Welcome back, ${email}! Your role: ${loginResponse.userRole}`,
            });
            
            const dashboardPath = getDashboardPathByGroupTitle(loginResponse.userRole);
            console.log("[useAuth Debug] Redirecting to custom login dashboard:", dashboardPath);
            navigate(dashboardPath, { replace: true });
          } else {
            // If no role was found, redirect to default dashboard
            setIsAuthenticated(true);
            sessionStorage.setItem('userRole', 'User');
            toast({
              title: "Login Successful",
              description: `Welcome back, ${email}!`,
            });
            navigate("/dashboard", { replace: true });
          }
          return;
        }
      } catch (customLoginError: any) {
        console.error("[useAuth Debug] Custom login error:", customLoginError);
        
        // Show proper error message from custom login service
        if (customLoginError && customLoginError.message) {
          setError(customLoginError.message);
          toast({
            variant: "destructive",
            title: "Login Failed",
            description: customLoginError.message,
          });
        } else {
          setError("Authentication failed. Please check your credentials.");
          toast({
            variant: "destructive",
            title: "Login Failed",
            description: "Authentication failed. Please check your credentials.",
          });
        }
        
        setLoading(false);
        return;
      }
      
      // Add error handling for missing values
      setError("Authentication failed. Please check your credentials.");
      toast({
        variant: "destructive",
        title: "Login Failed",
        description: "Authentication failed. Please check your credentials.",
      });
    } catch (error) {
      console.error("[useAuth Debug] Unexpected error during login:", error);
      setError("An unexpected error occurred. Please try again.");
      toast({
        variant: "destructive",
        title: "Login Error",
        description: "An unexpected error occurred. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return { handleLogin };
};
