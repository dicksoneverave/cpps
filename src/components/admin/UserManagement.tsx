
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UserData } from "@/types/adminTypes";
import { UserPlus, Trash2, Key } from "lucide-react";
import UserList from "./UserList";
import UserDetails from "./user/UserDetails";
import AddUserDialog from "./user/AddUserDialog";
import ResetPasswordDialog from "./user/ResetPasswordDialog";
import { useUserManagement } from "@/hooks/useUserManagement";

const UserManagement: React.FC = () => {
  const { 
    users, 
    selectedUser, 
    loading, 
    setSelectedUser, 
    fetchUsers,
    addUser, 
    resetPassword, 
    deleteUser 
  } = useUserManagement();
  
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [resetPasswordDialogOpen, setResetPasswordDialogOpen] = useState(false);

  // Fetch users on component mount
  useEffect(() => {
    fetchUsers();
  }, []);

  const handleSelectUser = (user: UserData) => {
    setSelectedUser(user);
  };

  const handleDeleteUser = async () => {
    if (!selectedUser) return;
    await deleteUser(selectedUser.id);
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
        <UserDetails selectedUser={selectedUser} />
      </div>

      {/* Add User Dialog */}
      <AddUserDialog 
        open={addDialogOpen} 
        onOpenChange={setAddDialogOpen} 
        onAddUser={addUser} 
      />

      {/* Reset Password Dialog */}
      <ResetPasswordDialog 
        open={resetPasswordDialogOpen} 
        onOpenChange={setResetPasswordDialogOpen}
        selectedUser={selectedUser}
        onResetPassword={resetPassword}
      />
    </div>
  );
};

export default UserManagement;
