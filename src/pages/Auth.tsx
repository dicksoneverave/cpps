
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import LoginForm from "@/components/auth/LoginForm";
import AuthHeader from "@/components/auth/AuthHeader";
import { loginWithSupabaseAuth } from "@/services/auth";
import { supabase } from "@/integrations/supabase/client";
import { fetchRoleByEmail, saveRoleToSessionStorage, isAdminRole } from "@/utils/roles";

const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const checkSession = async () => {
      console.log("Checking for existing session...");
      const { data } = await supabase.auth.getSession();
      
      if (data.session) {
        console.log("Found existing session, user is already authenticated:", data.session.user.email);
        setIsAuthenticated(true);
        
        // Store the email for reference
        sessionStorage.setItem('currentUserEmail', data.session.user.email || "");
      }
    };
    
    checkSession();
  }, []);

  useEffect(() => {
    // Redirect if user is authenticated
    if (isAuthenticated) {
      console.log("User is authenticated, redirecting to appropriate dashboard");
      
      // Get role from session storage or check email directly
      const storedRole = sessionStorage.getItem('userRole');
      const currentEmail = sessionStorage.getItem('currentUserEmail') || email;
      
      // Handle role-based redirects
      redirectBasedOnRole(storedRole, currentEmail);
    }
  }, [isAuthenticated, navigate, email]);

  // Function to handle role-based redirections
  const redirectBasedOnRole = (role: string | null, userEmail: string) => {
    console.log("Redirecting based on role:", role, "for user:", userEmail);
    
    if (userEmail === "administrator@gmail.com" || (role && isAdminRole(role))) {
      console.log("Redirecting admin to /admin");
      navigate("/admin", { replace: true });
      return;
    }
    
    // Role-specific redirects
    if (role) {
      const lowerRole = role.toLowerCase();
      
      if (lowerRole.includes('employer')) {
        console.log("Redirecting employer to /employer-dashboard");
        navigate("/employer-dashboard", { replace: true });
      } else if (lowerRole.includes('registrar')) {
        console.log("Redirecting registrar to /registrar-dashboard");
        navigate("/registrar-dashboard", { replace: true });
      } else if (lowerRole.includes('commissioner')) {
        console.log("Redirecting commissioner to /commissioner-dashboard");
        navigate("/commissioner-dashboard", { replace: true });
      } else if (lowerRole.includes('payment')) {
        console.log("Redirecting payment to /payment-dashboard");
        navigate("/payment-dashboard", { replace: true });
      } else if (lowerRole.includes('provincialclaimsofficer') || lowerRole.includes('provincial claims officer')) {
        console.log("Redirecting provincial claims officer to /pco-dashboard");
        navigate("/pco-dashboard", { replace: true });
      } else {
        console.log("Redirecting user with role to /dashboard");
        navigate("/dashboard", { replace: true });
      }
    } else {
      console.log("Redirecting user without role to /dashboard");
      navigate("/dashboard", { replace: true });
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      console.log("Attempting login for email:", email);
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
          description: `Welcome back! Redirecting to your dashboard...`,
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

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#8B2303] bg-opacity-90 p-4">
      <div className="w-full max-w-md">
        <AuthHeader />
        <Card>
          <CardHeader>
            <CardTitle className="text-center">Login</CardTitle>
            <CardDescription className="text-center">
              Enter your credentials to access the system. All users have password: dixman007
            </CardDescription>
          </CardHeader>
          <CardContent>
            <LoginForm
              email={email}
              setEmail={setEmail}
              password={password}
              setPassword={setPassword}
              handleLogin={handleLogin}
              loading={loading}
              error={error}
            />
          </CardContent>
          <CardFooter className="flex flex-col justify-center">
            <div className="text-sm text-gray-500 text-center">
              Having trouble logging in? Please contact system administration.
            </div>
            <div className="text-xs text-gray-400 mt-2 text-center">
              After login, you'll be directed to your role-specific dashboard based on your user group.
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Auth;
