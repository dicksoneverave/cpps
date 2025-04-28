
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import LoginForm from "@/components/auth/LoginForm";
import AuthHeader from "@/components/auth/AuthHeader";
import { loginWithSupabaseAuth, fetchUserRoleFromMapping } from "@/services/authService";
import { supabase } from "@/integrations/supabase/client";

const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      
      if (data.session) {
        navigate("/dashboard");
      }
    };
    
    checkSession();
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Use standard Supabase auth
      const { data: authData, error: authError } = await loginWithSupabaseAuth(email, password);

      if (authError) {
        throw new Error(authError.message);
      }

      if (authData.user) {
        console.log("Logged in with Supabase auth:", authData.user.id);
        
        // Get user role from the mapping
        try {
          const userRole = await fetchUserRoleFromMapping(email);
          if (userRole) {
            // Store the role in session storage for access in the app
            sessionStorage.setItem('userRole', userRole);
          }
        } catch (roleError) {
          console.error("Error fetching user role:", roleError);
          // Continue with login even if role fetch fails
        }

        toast({
          title: "Login successful",
          description: "Welcome back!",
        });
        navigate("/dashboard");
      }
    } catch (error) {
      handleLoginError(error);
    } finally {
      setLoading(false);
    }
  };

  const handleLoginError = (error: any) => {
    console.error("Login error:", error);
    let errorMessage = "An error occurred. Please try again.";
    
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    
    setError(errorMessage);
    toast({
      variant: "destructive",
      title: "Login failed",
      description: errorMessage,
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#8B2303] bg-opacity-90 p-4">
      <div className="w-full max-w-md">
        <AuthHeader />
        <Card>
          <CardHeader>
            <CardTitle className="text-center">Login</CardTitle>
            <CardDescription className="text-center">
              Enter your credentials to access the system
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
        </Card>
      </div>
    </div>
  );
};

export default Auth;
