
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import LoginForm from "@/components/auth/LoginForm";
import AuthHeader from "@/components/auth/AuthHeader";
import { loginWithSupabaseAuth } from "@/services/auth";
import { supabase } from "@/integrations/supabase/client";
import { fetchRoleByEmail, saveRoleToSessionStorage } from "@/utils/roleUtils";

const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const checkSession = async () => {
      console.log("Checking for existing session...");
      const { data } = await supabase.auth.getSession();
      
      if (data.session) {
        console.log("Found existing session, redirecting...");
        // Check if the user is an admin
        const userEmail = data.session.user.email;
        if (userEmail === "administrator@gmail.com") {
          navigate("/admin");
          return;
        }
        // Force redirect to dashboard for all other authenticated users
        navigate("/dashboard", { replace: true });
      }
    };
    
    checkSession();
  }, [navigate]);

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
        
        // Check for administrator email
        if (email === "administrator@gmail.com") {
          toast({
            title: "Login successful",
            description: "Welcome back, Administrator!",
          });
          
          // Store the admin role
          saveRoleToSessionStorage("OWC Admin");
          navigate("/admin", { replace: true });
          return;
        }
        
        // For regular users, fetch their role
        const userRole = await fetchRoleByEmail(email);
        console.log("Fetched user role:", userRole);
        
        if (userRole) {
          saveRoleToSessionStorage(userRole);
        }
        
        // Success message for all other users
        toast({
          title: "Login successful",
          description: `Welcome back! Redirecting to your dashboard...`,
        });
        
        // Force navigation to dashboard immediately with replace:true
        navigate("/dashboard", { replace: true });
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
