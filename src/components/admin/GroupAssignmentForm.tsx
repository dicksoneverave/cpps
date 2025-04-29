
import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { UserGroup, UserData } from "@/types/adminTypes";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { fetchUserGroups } from "@/services/admin/groupService";
import { searchUsersByEmail } from "@/services/admin/userService";
import { assignUserToGroup } from "@/services/admin/userGroupAssignmentService";
import { useToast } from "@/components/ui/use-toast";

const GroupAssignmentForm: React.FC = () => {
  const [userGroups, setUserGroups] = useState<UserGroup[]>([]);
  const [allUsers, setAllUsers] = useState<UserData[]>([]);
  const [groupUsers, setGroupUsers] = useState<UserData[]>([]);
  const [selectedGroupId, setSelectedGroupId] = useState<string>("");
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
  const [selectedGroupUser, setSelectedGroupUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  // Fetch user groups on mount
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

  // Load all users on mount
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

  // Load users in the selected group when group changes
  useEffect(() => {
    if (selectedGroupId) {
      const loadGroupUsers = async () => {
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
      };

      loadGroupUsers();
    } else {
      setGroupUsers([]);
    }
  }, [selectedGroupId, allUsers]);

  // Handle user selection from the all users list
  const handleSelectUser = (user: UserData) => {
    setSelectedUser(user);
    setSelectedGroupUser(null);
  };

  // Handle user selection from the group users list
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
      // This depends on your application's logic for "no group" users
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

  return (
    <Card className="w-full">
      <CardContent className="p-6">
        <div className="flex space-x-6 h-[500px]">
          {/* Left side: All Users */}
          <div className="w-1/3 flex flex-col">
            <h3 className="font-medium mb-2">Available Users</h3>
            <ScrollArea className="flex-1 border rounded-md p-2">
              <div className="space-y-1">
                {allUsers
                  .filter(user => !groupUsers.some(groupUser => groupUser.id === user.id))
                  .map((user) => (
                    <div
                      key={user.id}
                      className={`p-2 cursor-pointer rounded ${
                        selectedUser?.id === user.id ? "bg-primary text-primary-foreground" : "hover:bg-muted"
                      }`}
                      onClick={() => handleSelectUser(user)}
                    >
                      {user.email || "Unknown email"}
                    </div>
                  ))}
              </div>
            </ScrollArea>
          </div>

          {/* Middle: Add/Remove buttons */}
          <div className="flex flex-col justify-center space-y-4">
            <Button 
              onClick={handleAddToGroup} 
              disabled={!selectedUser || loading}
              className="w-20 justify-center"
            >
              Add &gt;&gt;
            </Button>
            <Button 
              onClick={handleRemoveFromGroup} 
              disabled={!selectedGroupUser || loading}
              className="w-20 justify-center"
            >
              &lt;&lt; Remove
            </Button>
          </div>

          {/* Right side: Group Selection and Users in Group */}
          <div className="w-1/3 flex flex-col">
            {/* Group Selection Dropdown */}
            <div className="mb-4">
              <h3 className="font-medium mb-2">Select Group</h3>
              <Select 
                value={selectedGroupId} 
                onValueChange={setSelectedGroupId}
                disabled={loading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a group..." />
                </SelectTrigger>
                <SelectContent>
                  {userGroups.map((group) => (
                    <SelectItem key={group.id} value={group.id.toString()}>
                      {group.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Users in Group */}
            <h3 className="font-medium mb-2">Users in Group</h3>
            <ScrollArea className="flex-1 border rounded-md p-2">
              <div className="space-y-1">
                {groupUsers.map((user) => (
                  <div
                    key={user.id}
                    className={`p-2 cursor-pointer rounded ${
                      selectedGroupUser?.id === user.id ? "bg-primary text-primary-foreground" : "hover:bg-muted"
                    }`}
                    onClick={() => handleSelectGroupUser(user)}
                  >
                    {user.email || "Unknown email"}
                  </div>
                ))}
                {groupUsers.length === 0 && (
                  <div className="text-gray-500 p-2">No users in this group</div>
                )}
              </div>
            </ScrollArea>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default GroupAssignmentForm;
