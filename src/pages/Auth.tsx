
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import LoginForm from "@/components/auth/LoginForm";
import AuthHeader from "@/components/auth/AuthHeader";
import { verifyJoomlaPassword } from "@/utils/passwordUtils";
import { loginWithSupabaseAuth, fetchUserRoleFromMapping, fetchOwcUser, fetchOwcUserRole } from "@/services/authService";
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
      
      // Check for both Supabase session and owc_user in session storage
      if (data.session || sessionStorage.getItem('owc_user')) {
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
      // First try standard Supabase auth (users migrated to auth.users)
      const { data: authData, error: authError } = await loginWithSupabaseAuth(email, password);

      if (!authError && authData.user) {
        // Successfully logged in with Supabase auth
        console.log("Logged in with Supabase auth:", authData.user.id);
        
        // Get user role from the owc_users table via the mapping view
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
        return;
      }
      
      // If Supabase auth failed, try the owc_users table as fallback
      console.log("Supabase auth failed, trying owc_users table");
      await handleLegacyLogin();
    } catch (error) {
      handleLoginError(error);
    } finally {
      setLoading(false);
    }
  };

  const handleLegacyLogin = async () => {
    // Try to find the user in the owc_users table
    const { data: userData, error: userError } = await fetchOwcUser(email);

    if (userError) {
      console.error("User lookup error:", userError);
      throw new Error('Invalid email or password');
    }

    if (!userData) {
      throw new Error('User not found');
    }

    // Cast userData to our defined type
    const owcUser = userData as any; // Using any to avoid more TypeScript issues
    console.log("Found user in owc_users table:", owcUser.id);

    // Use MD5 verification for Joomla password format
    const passwordValid = verifyJoomlaPassword(password, owcUser.password);
    
    if (!passwordValid) {
      console.error("Password verification failed");
      throw new Error('Invalid password');
    }

    console.log("Password verification successful");

    try {
      // Fetch the user's role
      const userRole = await fetchOwcUserRole(owcUser.id);
      if (userRole) {
        owcUser.role = userRole;
      }
    } catch (roleError) {
      console.error("Error processing user role:", roleError);
      // Continue with login even if role fetch fails
    }

    // If authentication with owc_users is successful
    toast({
      title: "Login successful",
      description: `Welcome back, ${owcUser.name || 'User'}!`,
    });
    
    // Since we're not using Supabase Auth for this user, we need to handle session manually
    sessionStorage.setItem('owc_user', JSON.stringify(owcUser));
    navigate("/dashboard");
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
