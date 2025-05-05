import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { UserGroup, UserData } from "@/types/adminTypes";
import UserSearch from "./UserSearch";
import UserSearchResults from "./UserSearchResults";
import SelectedUser from "./SelectedUser";
import GroupSelector from "./GroupSelector";
import { fetchUserGroups } from "@/services/admin/groupService";
import { searchUsersByEmail } from "@/services/admin/userService";
import { assignUserToGroup } from "@/services/admin/userGroupAssignmentService";

const AdminUserGroups: React.FC = () => {
  const [userGroups, setUserGroups] = useState<UserGroup[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
  const [searchResults, setSearchResults] = useState<UserData[]>([]);
  const [selectedGroupId, setSelectedGroupId] = useState<string>("");
  const [isSearching, setIsSearching] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  // Fetch user groups
  useEffect(() => {
    const loadUserGroups = async () => {
      try {
        const groups = await fetchUserGroups();
        setUserGroups(groups);
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Failed to load user groups",
          description: "Please try again later.",
        });
      }
    };

    loadUserGroups();
  }, [toast]);

  // Search for users
  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    try {
      const users = await searchUsersByEmail(searchQuery);
      setSearchResults(users);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "User search failed",
        description: "There was an error searching for users.",
      });
    } finally {
      setIsSearching(false);
    }
  };

  // Handle user selection
  const handleSelectUser = (user: UserData) => {
    setSelectedUser(user);
    setSelectedGroupId(user.group_id?.toString() || "");
    setSearchResults([]);
  };

  // Handle form submission - fixed typing issue with assignUserToGroup
  const handleSubmit = async () => {
    if (!selectedUser || !selectedGroupId) {
      toast({
        variant: "destructive",
        title: "Missing information",
        description: "Please select both a user and a group.",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      // Pass the UserData object directly - our updated service can handle it
      await assignUserToGroup(selectedUser, selectedGroupId);
      
      toast({
        title: "User group updated",
        description: `User ${selectedUser.email} has been assigned to the selected group.`,
      });
      
      setSelectedUser(null);
      setSelectedGroupId("");
      setSearchQuery("");
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Failed to assign user to group",
        description: "Please try again later.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* User Search */}
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

      {/* Selected User */}
      {selectedUser && (
        <SelectedUser 
          user={selectedUser}
          onRemoveUser={() => setSelectedUser(null)}
        />
      )}

      {/* Group Selection */}
      {selectedUser && (
        <GroupSelector
          userGroups={userGroups}
          selectedGroupId={selectedGroupId}
          onGroupSelect={setSelectedGroupId}
        />
      )}

      {/* Submit Button */}
      {selectedUser && (
        <Button 
          className="w-full" 
          onClick={handleSubmit} 
          disabled={isSubmitting || !selectedGroupId}
        >
          {isSubmitting ? "Processing..." : "Assign User to Group"}
        </Button>
      )}
    </div>
  );
};

export default AdminUserGroups;
