
import React, { useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import LoginForm from "@/components/auth/LoginForm";
import AuthHeader from "@/components/auth/AuthHeader";
import { useAuth } from "@/hooks/useAuth";
import { useSessionCheck } from "@/hooks/useSessionCheck";

const Auth = () => {
  const { 
    email, 
    setEmail, 
    password, 
    setPassword, 
    loading, 
    error, 
    isAuthenticated: isAuthenticatedFromLogin, 
    handleLogin,
    redirectBasedOnRole
  } = useAuth();
  
  const { isAuthenticated: isAuthenticatedFromSession } = useSessionCheck();

  // Combine authentication states from both login and session check
  const isAuthenticated = isAuthenticatedFromLogin || isAuthenticatedFromSession;

  useEffect(() => {
    // Redirect if user is authenticated
    if (isAuthenticated) {
      console.log("User is authenticated, redirecting to appropriate dashboard");
      
      // Get role from session storage or check email directly
      const storedRole = sessionStorage.getItem('userRole');
      const currentEmail = sessionStorage.getItem('currentUserEmail') || email;
      
      console.log("[Auth Debug] Stored role:", storedRole);
      console.log("[Auth Debug] Current email:", currentEmail);
      console.log("[Auth Debug] isAuthenticated:", isAuthenticated);
      
      // Handle role-based redirects
      redirectBasedOnRole(storedRole, currentEmail);
    }
  }, [isAuthenticated, redirectBasedOnRole, email]);

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
            {error && error.includes("Database error") && (
              <div className="mt-2 p-2 bg-amber-50 border border-amber-200 rounded text-sm text-amber-700">
                Database connection issue detected. Using fallback authentication.
              </div>
            )}
          </CardContent>
          <CardFooter className="flex flex-col justify-center">
            <div className="text-sm text-gray-500 text-center">
              Having trouble logging in? Please contact system administration.
            </div>
            <div className="text-xs text-gray-400 mt-2 text-center">
              After login, you'll be directed to your role-specific dashboard based on your user group.
            </div>
            <div className="text-xs text-blue-500 mt-2 text-center">
              Session role: {sessionStorage.getItem('userRole') || 'Not set'}
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Auth;
