
import { useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

export const useLogout = () => {
  const { toast } = useToast();

  const logout = useCallback(async () => {
    try {
      sessionStorage.removeItem('userRole');
      
      // Sign out from Supabase Auth
      await supabase.auth.signOut();
      
      toast({
        title: "Logged out successfully",
        description: "You have been logged out of your account.",
      });
      
      return true;
    } catch (error) {
      console.error("Error during logout:", error);
      toast({
        variant: "destructive",
        title: "Logout failed",
        description: "There was an error logging out. Please try again.",
      });
      
      return false;
    }
  }, [toast]);

  return { logout };
};
