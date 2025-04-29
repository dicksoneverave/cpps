
import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { UserGroup, UserData } from "@/types/adminTypes";
import { fetchUserGroups } from "@/services/admin/groupService";
import { searchUsersByEmail } from "@/services/admin/userService";
import { assignUserToGroup } from "@/services/admin/userGroupAssignmentService";
import { useToast } from "@/components/ui/use-toast";
import UserList from "./UserList";
import GroupSelector from "./GroupSelector";
import GroupActionButtons from "./GroupActionButtons";

const GroupAssignmentForm: React.FC = () => {
  const [userGroups, setUserGroups] = useState<UserGroup[]>([]);
  const [allUsers, setAllUsers] = useState<UserData[]>([]);
  const [groupUsers, setGroupUsers] = useState<UserData[]>([]);
  const [selectedGroupId, setSelectedGroupId] = useState<string>("");
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
  const [selectedGroupUser, setSelectedGroupUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  // Load user groups
  useEffect(() => {
    const loadUserGroups = async () => {
      try {
        const groups = await fetchUserGroups();
        setUserGroups(groups);
        if (groups.length > 0) {
          setSelectedGroupId(groups[0].id.toString());
        }
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

  // Load all users
  useEffect(() => {
    const loadAllUsers = async () => {
      setLoading(true);
      try {
        // Search with empty string to get all users
        const users = await searchUsersByEmail("");
        setAllUsers(users);
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Failed to load users",
          description: "Please try again later.",
        });
      } finally {
        setLoading(false);
      }
    };

    loadAllUsers();
  }, [toast]);

  // Filter users based on selected group
  useEffect(() => {
    if (selectedGroupId) {
      setLoading(true);
      try {
        // Filter users by the selected group
        const users = allUsers.filter(user => 
          user.group_id?.toString() === selectedGroupId
        );
        setGroupUsers(users);
      } catch (error) {
        console.error("Error loading group users:", error);
      } finally {
        setLoading(false);
      }
    } else {
      setGroupUsers([]);
    }
  }, [selectedGroupId, allUsers]);

  // Handle user selection
  const handleSelectUser = (user: UserData) => {
    setSelectedUser(user);
    setSelectedGroupUser(null);
  };

  const handleSelectGroupUser = (user: UserData) => {
    setSelectedGroupUser(user);
    setSelectedUser(null);
  };

  // Add user to group
  const handleAddToGroup = async () => {
    if (!selectedUser || !selectedGroupId) {
      toast({
        variant: "destructive",
        title: "Selection required",
        description: "Please select a user and a group.",
      });
      return;
    }

    setLoading(true);
    try {
      await assignUserToGroup(selectedUser, selectedGroupId);
      
      // Update UI
      const updatedUser = { ...selectedUser, group_id: parseInt(selectedGroupId) };
      setAllUsers(prev => prev.filter(u => u.id !== selectedUser.id));
      setGroupUsers(prev => [...prev, updatedUser]);
      setSelectedUser(null);
      
      toast({
        title: "User added to group",
        description: `${selectedUser.email || 'User'} has been added to the selected group.`,
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Failed to add user to group",
        description: "Please try again later.",
      });
    } finally {
      setLoading(false);
    }
  };

  // Remove user from group
  const handleRemoveFromGroup = async () => {
    if (!selectedGroupUser) {
      toast({
        variant: "destructive",
        title: "Selection required",
        description: "Please select a user from the group.",
      });
      return;
    }

    setLoading(true);
    try {
      // For removal, we'll assign to a special "no group" value or another default group
      await assignUserToGroup(selectedGroupUser, "0"); // Assuming "0" means no group
      
      // Update UI
      const updatedUser = { ...selectedGroupUser, group_id: undefined };
      setGroupUsers(prev => prev.filter(u => u.id !== selectedGroupUser.id));
      setAllUsers(prev => [...prev, updatedUser]);
      setSelectedGroupUser(null);
      
      toast({
        title: "User removed from group",
        description: `${selectedGroupUser.email || 'User'} has been removed from the group.`,
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Failed to remove user from group",
        description: "Please try again later.",
      });
    } finally {
      setLoading(false);
    }
  };

  // Filter available users to exclude those already in the selected group
  const availableUsers = allUsers.filter(
    user => !groupUsers.some(groupUser => groupUser.id === user.id)
  );

  return (
    <Card className="w-full">
      <CardContent className="p-6">
        <div className="flex space-x-6 h-[500px]">
          {/* Left side: All Available Users */}
          <div className="w-1/3">
            <UserList 
              title="Available Users"
              users={availableUsers}
              selectedUser={selectedUser}
              onSelectUser={handleSelectUser}
              emptyMessage="No available users"
            />
          </div>

          {/* Middle: Add/Remove buttons */}
          <GroupActionButtons
            onAddToGroup={handleAddToGroup}
            onRemoveFromGroup={handleRemoveFromGroup}
            canAdd={!!selectedUser}
            canRemove={!!selectedGroupUser}
            loading={loading}
          />

          {/* Right side: Group Selection and Users in Group */}
          <div className="w-1/3 flex flex-col">
            {/* Group Selection Dropdown */}
            <div className="mb-4">
              <h3 className="font-medium mb-2">Select Group</h3>
              <GroupSelector
                userGroups={userGroups}
                selectedGroupId={selectedGroupId}
                onGroupSelect={setSelectedGroupId}
              />
            </div>

            {/* Users in Group */}
            <UserList
              title="Users in Group"
              users={groupUsers}
              selectedUser={selectedGroupUser}
              onSelectUser={handleSelectGroupUser}
              emptyMessage="No users in this group"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default GroupAssignmentForm;
