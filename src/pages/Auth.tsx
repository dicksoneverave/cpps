import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import MD5 from 'crypto-js/md5';

// Define interfaces for our query results
interface UserGroupData {
  group_id: number;
  owc_usergroups: {
    title: string;
  } | null;
}

interface OWCUser {
  id: number;
  name: string;
  username: string;
  email: string;
  password: string;
  block: string;
  sendEmail?: string;
  registerDate?: string;
  lastvisitDate?: string;
  activation?: string;
  resetCount?: string;
  otpKey?: string;
  otep?: string;
  requireReset?: string;
  authProvider?: string;
  params?: any;
  role?: string; // Optional property we'll add
}

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

  // Function to verify password with MD5 hash (Joomla format)
  const verifyJoomlaPassword = (plainPassword: string, hashedPassword: string): boolean => {
    try {
      // Create MD5 hash of the plain password
      const md5Hash = MD5(plainPassword).toString();
      
      // Compare the hashes - Joomla sometimes prefixes the hash
      // If the hash contains a colon, it's using a format like "md5:hash"
      if (hashedPassword.includes(':')) {
        const [, storedHash] = hashedPassword.split(':');
        return md5Hash === storedHash;
      }
      
      // Otherwise, compare directly
      return md5Hash === hashedPassword;
    } catch (err) {
      console.error("Password verification error:", err);
      return false;
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // First try standard Supabase auth
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        console.log("Supabase auth failed, trying owc_users table");
        
        // If standard auth fails, try to find the user in the owc_users table
        const { data: userData, error: userError } = await supabase
          .from('owc_users')
          .select('*')
          .eq('email', email)
          .single();

        if (userError) {
          console.error("User lookup error:", userError);
          throw new Error('Invalid email or password');
        }

        if (!userData) {
          throw new Error('User not found');
        }

        // Cast userData to our defined type
        const owcUser = userData as OWCUser;
        console.log("Found user in owc_users table:", owcUser.id);

        // Use MD5 verification for Joomla password format
        const passwordValid = verifyJoomlaPassword(password, owcUser.password);
        
        if (!passwordValid) {
          console.error("Password verification failed");
          throw new Error('Invalid password');
        }

        console.log("Password verification successful");

        try {
          // Fetch the user's role (usergroup) from the mapping table
          const { data: userGroupData, error: userGroupError } = await supabase
            .from('owc_user_usergroup_map')
            .select(`
              group_id,
              owc_usergroups:group_id(title)
            `)
            .eq('user_id', owcUser.id)
            .single();

          if (!userGroupError && userGroupData) {
            console.log("User group data:", userGroupData);
            // Add the user's role to the user data if it exists
            const typedUserGroupData = userGroupData as unknown as UserGroupData;
            if (typedUserGroupData.owc_usergroups?.title) {
              owcUser.role = typedUserGroupData.owc_usergroups.title;
            }
          } else {
            console.error("Error fetching user role:", userGroupError);
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
        return;
      }

      if (authData.user) {
        toast({
          title: "Login successful",
          description: "Welcome back!",
        });
        navigate("/dashboard");
      }
    } catch (error) {
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
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#8B2303] bg-opacity-90 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <img
            src="/lovable-uploads/e926ba6c-9a52-4f9e-aaf0-a97f1feea9e5.png"
            alt="Papua New Guinea Emblem"
            className="mx-auto mb-4 w-32 h-32 object-contain"
            onError={(e) => {
              console.error("Image failed to load");
              const target = e.target as HTMLImageElement;
              target.style.display = "none";
            }}
          />
          <h1 className="text-2xl font-bold text-white">OFFICE OF WORKERS COMPENSATION</h1>
          <h2 className="text-xl text-white">CLAIMS PROCESSING AND PAYMENT SYSTEM</h2>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-center">Login</CardTitle>
            <CardDescription className="text-center">
              Enter your credentials to access the system
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleLogin}>
            <CardContent className="space-y-4">
              {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                  {error}
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your.email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" className="w-full bg-[#8B2303] hover:bg-[#6e1c02]" disabled={loading}>
                {loading ? "Logging in..." : "Login"}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default Auth;
