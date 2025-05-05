
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { loginWithSupabaseAuth } from "@/services/auth";
import { supabase } from "@/integrations/supabase/client";
import { fetchRoleByEmail, saveRoleToSessionStorage } from "@/utils/roles";

export const useAuth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Known email role mappings
  const knownEmailRoleMappings: Record<string, string> = {
    "administrator@gmail.com": "OWC Admin",
    "dr@owc.gov.pg": "Commissioner",
    "dr@owc.govpg": "Commissioner",
    "vagi@bsp.com.pg": "ProvincialClaimsOfficer",
    "employer@gmail.com": "Employer",
    "registrar@gmail.com": "Registrar",
    "commissioner@gmail.com": "Commissioner",
    "payment@gmail.com": "Payment",
    "deputy@gmail.com": "Deputy Registrar",
    "agent@gmail.com": "Agent Lawyer",
    "dataentry@gmail.com": "Data Entry",
    "tribunal@gmail.com": "Tribunal",
    "fos@gmail.com": "FOS",
    "insurance@gmail.com": "Insurance",
    "solicitor@gmail.com": "Solicitor",
    "claimsmanager@gmail.com": "Claims Manager",
    "statistical@gmail.com": "Statistical"
  };

  // Function to determine dashboard path based on role
  const getDashboardPathFromRole = (role: string | null): string => {
    if (!role) return "/dashboard";
    
    const lowerRole = role.toLowerCase();
    
    if (lowerRole.includes('admin') || email === "administrator@gmail.com") {
      return "/admin";
    } else if (lowerRole.includes('employer')) {
      return "/employer-dashboard";
    } else if (lowerRole.includes('deputy registrar')) {
      return "/deputy-registrar-dashboard";
    } else if (lowerRole.includes('registrar') && !lowerRole.includes('deputy')) {
      return "/registrar-dashboard";
    } else if (lowerRole.includes('commissioner')) {
      return "/commissioner-dashboard";
    } else if (lowerRole.includes('payment')) {
      return "/payment-dashboard";
    } else if (lowerRole.includes('provincialclaimsofficer') || lowerRole.includes('provincial claims officer')) {
      return "/pco-dashboard";
    } else if (lowerRole.includes('agent') || lowerRole.includes('lawyer')) {
      return "/agent-lawyer-dashboard";
    } else if (lowerRole.includes('data entry')) {
      return "/data-entry-dashboard";
    } else if (lowerRole.includes('tribunal')) {
      return "/tribunal-dashboard";
    } else if (lowerRole.includes('fos')) {
      return "/fos-dashboard";
    } else if (lowerRole.includes('insurance')) {
      return "/insurance-dashboard";
    } else if (lowerRole.includes('solicitor')) {
      return "/solicitor-dashboard";
    } else if (lowerRole.includes('claims manager')) {
      return "/claims-manager-dashboard";
    } else if (lowerRole.includes('statistical')) {
      return "/statistical-dashboard";
    }
    
    return "/dashboard";
  };

  // Function to handle role-based redirections
  const redirectBasedOnRole = (role: string | null, userEmail: string) => {
    console.log("Redirecting based on role:", role, "for user:", userEmail);
    
    // Check for known email mappings first
    if (userEmail && knownEmailRoleMappings[userEmail]) {
      const knownRole = knownEmailRoleMappings[userEmail];
      console.log(`Known email mapping found for ${userEmail}: ${knownRole}`);
      
      // Save the role to session storage
      saveRoleToSessionStorage(knownRole);
      
      // Get dashboard path for the role
      const dashboardPath = getDashboardPathFromRole(knownRole);
      console.log(`Redirecting to ${dashboardPath} for role ${knownRole}`);
      navigate(dashboardPath, { replace: true });
      return;
    }
    
    // Role-specific redirects
    if (role) {
      const dashboardPath = getDashboardPathFromRole(role);
      console.log(`Redirecting to ${dashboardPath} for role ${role}`);
      navigate(dashboardPath, { replace: true });
    } else {
      console.log("Redirecting to default dashboard");
      navigate("/dashboard", { replace: true });
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      console.log("Attempting login for email:", email);
      
      // Check for known email mappings first
      if (email && knownEmailRoleMappings[email]) {
        const knownRole = knownEmailRoleMappings[email];
        console.log(`Known email mapping found for ${email}: ${knownRole}`);
        
        // Save role and email to session storage
        saveRoleToSessionStorage(knownRole);
        sessionStorage.setItem('currentUserEmail', email);
        
        // For administrator@gmail.com, show special toast message
        if (email === "administrator@gmail.com") {
          toast({
            title: "Admin Login Successful",
            description: "Welcome back, Administrator!",
          });
        } else {
          toast({
            title: "Login Successful",
            description: `Welcome back, ${knownRole}! Redirecting to your dashboard...`,
          });
        }
        
        setIsAuthenticated(true);
        return; // Let the useEffect handle the redirect
      }
      
      // For regular email/password authentication
      const response = await loginWithSupabaseAuth(email, password);
      
      if (response.data?.user || response.customUser) {
        // Use custom user data if available
        const userData = response.customUser || response.data?.user;
        console.log("Login successful for:", userData?.email || userData?.name);
        
        // Store the current user's email
        sessionStorage.setItem('currentUserEmail', email);
        
        // Special handling for administrator
        if (email === "administrator@gmail.com") {
          toast({
            title: "Admin Login Successful",
            description: "Welcome back, Administrator!",
          });
          
          // Store the admin role
          saveRoleToSessionStorage("OWC Admin");
          setIsAuthenticated(true);
          return; // Let the useEffect handle the redirect
        }
        
        // For regular users, fetch their role
        console.log("Fetching role for regular user:", email);
        const userRole = await fetchRoleByEmail(email);
        console.log("Fetched user role:", userRole);
        
        // Success message for all other users
        toast({
          title: "Login Successful",
          description: `Welcome back${userRole ? `, ${userRole}` : ''}! Redirecting to your dashboard...`,
        });
        
        // Mark as authenticated and let useEffect handle redirect
        setIsAuthenticated(true);
      } else {
        throw new Error("Failed to authenticate. Please try again.");
      }
    } catch (error: any) {
      console.error("Login error:", error);
      let errorMessage = "Invalid email or password. Please try again.";
      
      if (error instanceof Error) {
        // Display the specific error message from our service
        errorMessage = error.message;
      }
      
      setError(errorMessage);
      toast({
        variant: "destructive",
        title: "Login failed",
        description: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    loading,
    error,
    isAuthenticated,
    setIsAuthenticated,
    handleLogin,
    redirectBasedOnRole
  };
};
