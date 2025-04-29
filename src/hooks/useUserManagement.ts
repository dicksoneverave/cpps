
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { UserData } from "@/types/adminTypes";
import MD5 from 'crypto-js/md5';
import { toast as sonnerToast } from "sonner";

export const useUserManagement = () => {
  const [users, setUsers] = useState<UserData[]>([]);
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchUsers = async () => {
    setLoading(true);
    try {
      // Using a raw query approach with proper type casting
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .returns<any[]>();
      
      if (error) throw error;

      if (data) {
        const formattedUsers: UserData[] = data.map(user => ({
          id: user.id,
          email: user.email,
          name: user.name || user.email?.split("@")[0] || "Unknown name",
          password: user.password
        }));
        setUsers(formattedUsers);
      }
    } catch (error: any) {
      console.error("Error fetching users:", error);
      toast({
        variant: "destructive",
        title: "Failed to fetch users",
        description: error.message || "An error occurred while fetching users.",
      });
    } finally {
      setLoading(false);
    }
  };

  const addUser = async (userData: { name: string, email: string, password: string }) => {
    try {
      if (!userData.email || !userData.password) {
        toast({
          variant: "destructive",
          title: "Missing information",
          description: "Email and password are required.",
        });
        return false;
      }

      const hashedPassword = MD5(userData.password).toString();

      // Using a raw query approach with proper types
      const { data, error } = await supabase
        .from('users')
        .insert([{
          email: userData.email,
          name: userData.name || userData.email.split("@")[0],
          password: hashedPassword
        }])
        .select()
        .returns<any[]>();

      if (error) throw error;

      sonnerToast.success("User created successfully", {
        description: `User ${userData.email} has been added with default password.`,
        duration: 5000,
      });

      fetchUsers();
      return true;
    } catch (error: any) {
      console.error("Error creating user:", error);
      toast({
        variant: "destructive",
        title: "Failed to create user",
        description: error.message || "An error occurred while creating the user.",
      });
      return false;
    }
  };

  const resetPassword = async (userId: string, newPassword: string) => {
    try {
      const hashedPassword = MD5(newPassword).toString();

      // Using a raw query approach with proper types
      const { error } = await supabase
        .from('users')
        .update({ 
          password: hashedPassword, 
          updated_at: new Date().toISOString() 
        })
        .eq('id', userId);

      if (error) throw error;

      sonnerToast.success("Password reset successfully", {
        description: `Password has been updated.`,
      });

      // Update local data
      setUsers(users.map(user => 
        user.id === userId 
          ? { ...user, password: hashedPassword } 
          : user
      ));
      
      return true;
    } catch (error: any) {
      console.error("Error resetting password:", error);
      toast({
        variant: "destructive",
        title: "Failed to reset password",
        description: error.message || "An error occurred while resetting the password.",
      });
      return false;
    }
  };

  const deleteUser = async (userId: string) => {
    try {
      // Using a raw query approach with proper types
      const { error } = await supabase
        .from('users')
        .delete()
        .eq('id', userId);

      if (error) throw error;

      sonnerToast.success("User removed from system", {
        description: `User has been removed from the system.`,
      });

      setSelectedUser(null);
      fetchUsers();
      return true;
    } catch (error: any) {
      console.error("Error deleting user:", error);
      toast({
        variant: "destructive",
        title: "Failed to delete user",
        description: error.message || "An error occurred while deleting the user.",
      });
      return false;
    }
  };

  return {
    users,
    selectedUser,
    loading,
    setSelectedUser,
    fetchUsers,
    addUser,
    resetPassword,
    deleteUser
  };
};
