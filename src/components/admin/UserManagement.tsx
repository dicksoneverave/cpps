
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
import { UserPlus, Trash2 } from "lucide-react";

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<UserData[]>([]);
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [newUserData, setNewUserData] = useState({
    name: "",
    email: "",
    password: ""
  });
  const { toast } = useToast();

  // Fetch users on component mount
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.admin.listUsers();
      if (error) throw error;

      // Transform Supabase users into UserData format
      if (data?.users) {
        const formattedUsers: UserData[] = data.users.map(user => ({
          id: user.id,
          email: user.email || "Unknown email",
          name: user.user_metadata?.name || user.email?.split("@")[0] || "Unknown name"
        }));
        setUsers(formattedUsers);
      }
    } catch (error) {
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

      // Create user in Supabase
      const { data, error } = await supabase.auth.admin.createUser({
        email: newUserData.email,
        password: newUserData.password,
        email_confirm: true, // Auto confirm email
        user_metadata: { name: newUserData.name }
      });

      if (error) throw error;

      toast({
        title: "User created successfully",
        description: `User ${newUserData.email} has been added.`,
      });

      // Reset form and close dialog
      setNewUserData({ name: "", email: "", password: "" });
      setAddDialogOpen(false);

      // Refresh user list
      fetchUsers();
    } catch (error) {
      console.error("Error creating user:", error);
      toast({
        variant: "destructive",
        title: "Failed to create user",
        description: error.message || "An error occurred while creating the user.",
      });
    }
  };

  const handleDeleteUser = async () => {
    if (!selectedUser) return;

    try {
      // Delete user from Supabase
      const { error } = await supabase.auth.admin.deleteUser(selectedUser.id);
      if (error) throw error;

      toast({
        title: "User deleted successfully",
        description: `User ${selectedUser.email} has been removed.`,
      });

      // Reset selected user and refresh list
      setSelectedUser(null);
      fetchUsers();
    } catch (error) {
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
              emptyMessage="No users found"
            />
            
            {/* Delete User Button */}
            <div className="mt-4 flex justify-end">
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
                  placeholder="********"
                  required
                  value={newUserData.password}
                  onChange={handleInputChange}
                />
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
    </div>
  );
};

export default UserManagement;
