
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UserPlus } from "lucide-react";
import UserList from "./UserList";
import UserDetails from "./user/UserDetails";
import AddUserDialog from "./user/AddUserDialog";
import ResetPasswordDialog from "./user/ResetPasswordDialog";
import UserActionButtons from "./user/UserActionButtons";
import { useUserManagement } from "@/hooks/useUserManagement";
import { UserData } from "@/types/adminTypes";
import UserSearch from "./UserSearch";
import { searchUsersByEmail } from "@/services/admin/userService";
import UserSearchResults from "./UserSearchResults";

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
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<UserData[]>([]);
  const usersPerPage = 12;

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

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    try {
      const results = await searchUsersByEmail(searchQuery);
      setSearchResults(results);
    } catch (error) {
      console.error("Error searching users:", error);
    } finally {
      setIsSearching(false);
    }
  };

  // Reset search when query is cleared
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
    }
  }, [searchQuery]);

  // Calculate the current page's users
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(users.length / usersPerPage);

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
          <CardContent className="pb-6 space-y-4">
            {/* Search Component */}
            <UserSearch 
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              onSearch={handleSearch}
              isSearching={isSearching}
            />
            
            {/* Search Results */}
            <UserSearchResults 
              results={searchResults}
              onSelectUser={handleSelectUser}
            />
            
            <UserList
              title="Registered Users"
              users={currentUsers}
              selectedUser={selectedUser}
              onSelectUser={handleSelectUser}
              emptyMessage={loading ? "Loading users..." : "No users found"}
              totalUsers={users.length}
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
            
            {/* Action Buttons - now extracted to a separate component */}
            <UserActionButtons
              selectedUser={selectedUser}
              onResetPassword={() => setResetPasswordDialogOpen(true)}
              onDeleteUser={handleDeleteUser}
            />
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
