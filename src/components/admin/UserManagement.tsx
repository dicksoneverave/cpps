
import React, { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import UserList from "@/components/admin/UserList";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UserData } from "@/types/adminTypes";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import { UserPlus, Trash2, Key } from "lucide-react";
import { toast as sonnerToast } from "sonner";
import MD5 from 'crypto-js/md5';

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<UserData[]>([]);
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [resetPasswordDialogOpen, setResetPasswordDialogOpen] = useState(false);
  const [newUserData, setNewUserData] = useState({
    name: "",
    email: "",
    password: "dixman007" // Default password
  });
  const [newPassword, setNewPassword] = useState("");
  const { toast } = useToast();

  // Fetch users on component mount
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      // Query our custom users table
      const { data, error } = await supabase
        .from('users')
        .select('*');
      
      if (error) throw error;

      // Transform the data into our UserData format
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

  const handleSelectUser = (user: UserData) => {
    setSelectedUser(user);
  };

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Validate input
      if (!newUserData.email || !newUserData.password) {
        toast({
          variant: "destructive",
          title: "Missing information",
          description: "Email and password are required.",
        });
        return;
      }

      // Hash the password (using MD5 as mentioned in the passwordUtils.ts)
      const hashedPassword = MD5(newUserData.password).toString();

      // Insert directly into our users table
      const { data, error } = await supabase
        .from('users')
        .insert([{
          email: newUserData.email,
          name: newUserData.name || newUserData.email.split("@")[0],
          password: hashedPassword
        }])
        .select();

      if (error) throw error;

      sonnerToast.success("User created successfully", {
        description: `User ${newUserData.email} has been added with default password.`,
        duration: 5000,
      });

      // Reset form and close dialog
      setNewUserData({ name: "", email: "", password: "dixman007" });
      setAddDialogOpen(false);

      // Refresh user list
      fetchUsers();
    } catch (error: any) {
      console.error("Error creating user:", error);
      toast({
        variant: "destructive",
        title: "Failed to create user",
        description: error.message || "An error occurred while creating the user.",
      });
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;

    try {
      // Hash the new password
      const hashedPassword = MD5(newPassword).toString();

      // Update the user's password
      const { error } = await supabase
        .from('users')
        .update({ password: hashedPassword, updated_at: new Date().toISOString() })
        .eq('id', selectedUser.id);

      if (error) throw error;

      sonnerToast.success("Password reset successfully", {
        description: `Password for ${selectedUser.email} has been updated.`,
      });

      // Reset state and close dialog
      setNewPassword("");
      setResetPasswordDialogOpen(false);
      
      // Update local data
      setUsers(users.map(user => 
        user.id === selectedUser.id 
          ? { ...user, password: hashedPassword } 
          : user
      ));
    } catch (error: any) {
      console.error("Error resetting password:", error);
      toast({
        variant: "destructive",
        title: "Failed to reset password",
        description: error.message || "An error occurred while resetting the password.",
      });
    }
  };

  const handleDeleteUser = async () => {
    if (!selectedUser) return;

    try {
      // Delete directly from our users table
      const { error } = await supabase
        .from('users')
        .delete()
        .eq('id', selectedUser.id);

      if (error) throw error;

      sonnerToast.success("User removed from system", {
        description: `User ${selectedUser.email} has been removed from the system.`,
      });

      // Reset selected user and refresh list
      setSelectedUser(null);
      fetchUsers();
    } catch (error: any) {
      console.error("Error deleting user:", error);
      toast({
        variant: "destructive",
        title: "Failed to delete user",
        description: error.message || "An error occurred while deleting the user.",
      });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewUserData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* User List Section */}
      <div className="md:col-span-2">
        <Card className="h-full">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle>User List</CardTitle>
            <Button 
              onClick={() => setAddDialogOpen(true)}
              className="flex items-center gap-1"
            >
              <UserPlus className="w-4 h-4" />
              <span>Add User</span>
            </Button>
          </CardHeader>
          <CardContent className="pb-6">
            <UserList
              title="Registered Users"
              users={users}
              selectedUser={selectedUser}
              onSelectUser={handleSelectUser}
              emptyMessage={loading ? "Loading users..." : "No users found"}
            />
            
            {/* Action Buttons */}
            <div className="mt-4 flex justify-end space-x-2">
              <Button
                variant="outline"
                disabled={!selectedUser}
                onClick={() => setResetPasswordDialogOpen(true)}
                className="flex items-center gap-1"
              >
                <Key className="w-4 h-4" />
                <span>Reset Password</span>
              </Button>

              <Button
                variant="destructive"
                disabled={!selectedUser}
                onClick={handleDeleteUser}
                className="flex items-center gap-1"
              >
                <Trash2 className="w-4 h-4" />
                <span>Delete User</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* User Details Section */}
      <div className="md:col-span-1">
        <Card className="h-full">
          <CardHeader>
            <CardTitle>User Details</CardTitle>
          </CardHeader>
          <CardContent>
            {selectedUser ? (
              <div className="space-y-4">
                <div>
                  <p className="font-medium">Name:</p>
                  <p>{selectedUser.name || "N/A"}</p>
                </div>
                <div>
                  <p className="font-medium">Email:</p>
                  <p>{selectedUser.email}</p>
                </div>
                {selectedUser.group_title && (
                  <div>
                    <p className="font-medium">Group:</p>
                    <p>{selectedUser.group_title}</p>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-gray-500">Select a user to view details</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Add User Dialog */}
      <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add New User</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAddUser}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="Full Name"
                  value={newUserData.name}
                  onChange={handleInputChange}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="user@example.com"
                  required
                  value={newUserData.email}
                  onChange={handleInputChange}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Default: dixman007"
                  value={newUserData.password}
                  onChange={handleInputChange}
                />
                <p className="text-xs text-gray-500">Default password: dixman007</p>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Add User</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Reset Password Dialog */}
      <Dialog open={resetPasswordDialogOpen} onOpenChange={setResetPasswordDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Reset User Password</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleResetPassword}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="userEmail">User</Label>
                <Input
                  id="userEmail"
                  value={selectedUser?.email || ""}
                  disabled
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="newPassword">New Password</Label>
                <Input
                  id="newPassword"
                  type="password"
                  placeholder="New password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setResetPasswordDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Reset Password</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UserManagement;
