
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
        // Check if the user is an admin
        const userEmail = data.session.user.email;
        if (userEmail === "administrator@gmail.com") {
          navigate("/admin");
          return;
        }
        
        if (userEmail) {
          try {
            const userRole = await fetchUserRoleFromMapping(userEmail);
            if (userRole === "OWC Admin" || userRole === "owcadmin") {
              navigate("/admin");
              return;
            }
          } catch (error) {
            console.error("Error checking user role:", error);
          }
        }
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
      const { data: authData } = await loginWithSupabaseAuth(email, password);

      if (authData.user) {
        console.log("Logged in with Supabase auth:", authData.user.id);
        
        // Specifically check for administrator@gmail.com
        if (authData.user.email === "administrator@gmail.com") {
          toast({
            title: "Login successful",
            description: "Welcome back, Administrator!",
          });
          navigate("/admin");
          return;
        }
        
        // For other users, get role from the mapping
        try {
          const userRole = await fetchUserRoleFromMapping(email);
          if (userRole) {
            // Store the role in session storage for access in the app
            sessionStorage.setItem('userRole', userRole);
            
            // Redirect based on role
            if (userRole === "OWC Admin" || userRole === "owcadmin") {
              toast({
                title: "Login successful",
                description: "Welcome back, Administrator!",
              });
              navigate("/admin");
              return;
            }
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
          <CardFooter className="flex justify-center">
            <div className="text-sm text-gray-500">
              Having trouble logging in? Please contact system administration.
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Auth;
