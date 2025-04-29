
import React, { useState, useEffect } from "react";
import { 
  Card, 
  CardContent 
} from "@/components/ui/card";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Search, User, UserCheck, X } from "lucide-react";
import { User as SupabaseUser } from "@supabase/supabase-js";
import { Database } from "@/integrations/supabase/types";

interface UserGroup {
  id: number;
  title: string;
  parent_id: string;
}

interface UserData {
  id: string;
  email: string | null;
  name?: string;
  group_id?: number;
  group_title?: string;
  owc_user_id?: number;
}

// Define types for our table schemas
type UserMappingInsert = {
  auth_user_id: string;
  owc_user_id: number;
  name: string;
  email: string | null;
};

type OWCUserInsert = {
  name: string;
  username: string;
  email: string;
  password: string;
  block: string;
  sendEmail: string;
  registerDate: string;
  requireReset: string;
  authProvider: string;
};

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
    const fetchUserGroups = async () => {
      try {
        const { data, error } = await supabase
          .from('owc_usergroups')
          .select('id, title, parent_id')
          .order('title');
        
        if (error) throw error;
        
        setUserGroups(data || []);
      } catch (error) {
        console.error("Error fetching user groups:", error);
        toast({
          variant: "destructive",
          title: "Failed to load user groups",
          description: "Please try again later.",
        });
      }
    };

    fetchUserGroups();
  }, [toast]);

  // Search for users
  const searchUsers = async () => {
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    try {
      // First look in auth users
      const { data: authData, error: authError } = await supabase.auth.admin.listUsers();
      
      if (authError) throw authError;
      
      // Type guard to ensure we have the correct data structure
      if (!authData || !authData.users || !Array.isArray(authData.users)) {
        throw new Error("Invalid auth data structure");
      }
      
      // Filter users by email
      const matchedUsers = authData.users
        .filter(user => user.email?.toLowerCase().includes(searchQuery.toLowerCase()))
        .map(user => ({
          id: user.id,
          email: user.email,
          name: user.user_metadata?.name || 'Unknown'
        })) || [];
      
      // Get user group mappings
      if (matchedUsers.length > 0) {
        const userIds = matchedUsers.map(user => user.id);
        
        // Get user mappings
        const { data: mappings, error: mappingError } = await supabase
          .from('user_mapping')
          .select('auth_user_id, owc_user_id, name, email')
          .in('auth_user_id', userIds);
          
        if (mappingError) throw mappingError;
        
        // Get group mappings
        const owcUserIds = mappings?.map(m => m.owc_user_id).filter(Boolean) || [];
        
        if (owcUserIds.length > 0) {
          const { data: groupMappings, error: groupError } = await supabase
            .from('owc_user_usergroup_map')
            .select('user_id, group_id')
            .in('user_id', owcUserIds);
            
          if (groupError) throw groupError;
          
          // Get group titles
          const groupIds = groupMappings?.map(gm => gm.group_id) || [];
          
          let groupTitles: Record<number, string> = {};
          
          if (groupIds.length > 0) {
            const { data: groups, error: groupsError } = await supabase
              .from('owc_usergroups')
              .select('id, title')
              .in('id', groupIds);
              
            if (groupsError) throw groupsError;
            
            if (groups) {
              groups.forEach(group => {
                groupTitles[group.id] = group.title;
              });
            }
          }
          
          // Merge data
          const enhancedUsers = matchedUsers.map(user => {
            const mapping = mappings?.find(m => m.auth_user_id === user.id);
            const groupMapping = mapping?.owc_user_id 
              ? groupMappings?.find(gm => gm.user_id === mapping.owc_user_id)
              : undefined;
              
            return {
              ...user,
              name: mapping?.name || user.name,
              owc_user_id: mapping?.owc_user_id,
              group_id: groupMapping?.group_id,
              group_title: groupMapping?.group_id ? groupTitles[groupMapping.group_id] : undefined
            };
          });
          
          setSearchResults(enhancedUsers);
        } else {
          setSearchResults(matchedUsers);
        }
      } else {
        setSearchResults([]);
      }
    } catch (error) {
      console.error("Error searching users:", error);
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
  const selectUser = (user: UserData) => {
    setSelectedUser(user);
    setSelectedGroupId(user.group_id?.toString() || "");
    setSearchResults([]);
  };

  // Handle form submission
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
      // First get owc_user_id from user_mapping
      const { data: mapping, error: mappingError } = await supabase
        .from('user_mapping')
        .select('owc_user_id')
        .eq('auth_user_id', selectedUser.id)
        .maybeSingle();
        
      if (mappingError) throw mappingError;
      
      let owcUserId = mapping?.owc_user_id;
      
      // If mapping doesn't exist, create an OWC user entry and mapping
      if (!owcUserId) {
        // Generate a random username based on email
        const username = selectedUser.email?.split('@')[0] + '_' + Math.floor(Math.random() * 10000);
        
        if (!username || !selectedUser.email) {
          throw new Error("Invalid email or username");
        }
        
        // Insert into owc_users using RPC to handle the ID generation
        const { data: newUserData, error: rpcError } = await supabase.rpc('create_owc_user', {
          p_name: selectedUser.name || selectedUser.email.split('@')[0],
          p_username: username,
          p_email: selectedUser.email,
          p_password: '',
          p_block: '0',
          p_send_email: '0',
          p_register_date: new Date().toISOString(),
          p_require_reset: '0',
          p_auth_provider: 'supabase'
        });
        
        if (rpcError) {
          console.error("RPC error:", rpcError);
          throw new Error(`Failed to create user: ${rpcError.message}`);
        }
        
        owcUserId = newUserData;
        console.log("Created new OWC user with ID:", owcUserId);
        
        if (!owcUserId) {
          throw new Error("Failed to get new user ID");
        }
        
        // Create mapping
        const mappingData: UserMappingInsert = {
          auth_user_id: selectedUser.id,
          owc_user_id: owcUserId,
          name: selectedUser.name || selectedUser.email.split('@')[0],
          email: selectedUser.email
        };
        
        const { error: newMappingError } = await supabase
          .from('user_mapping')
          .insert(mappingData);
          
        if (newMappingError) throw newMappingError;
      }
      
      // Check if group mapping already exists
      const { data: existingMapping, error: existingError } = await supabase
        .from('owc_user_usergroup_map')
        .select()
        .eq('user_id', owcUserId)
        .maybeSingle();
        
      if (existingError) throw existingError;
      
      if (existingMapping) {
        // Update existing mapping
        const { error: updateError } = await supabase
          .from('owc_user_usergroup_map')
          .update({ group_id: parseInt(selectedGroupId) })
          .eq('user_id', owcUserId);
          
        if (updateError) throw updateError;
      } else {
        // Insert new mapping
        const { error: insertError } = await supabase
          .from('owc_user_usergroup_map')
          .insert({
            user_id: owcUserId,
            group_id: parseInt(selectedGroupId)
          });
          
        if (insertError) throw insertError;
      }
      
      toast({
        title: "User group updated",
        description: `User ${selectedUser.email} has been assigned to the selected group.`,
      });
      
      setSelectedUser(null);
      setSelectedGroupId("");
      setSearchQuery("");
    } catch (error) {
      console.error("Error assigning user to group:", error);
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
      <div className="space-y-2">
        <Label htmlFor="user-search">Search Users</Label>
        <div className="flex gap-2">
          <Input
            id="user-search"
            placeholder="Search by email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1"
          />
          <Button 
            onClick={searchUsers} 
            disabled={isSearching || !searchQuery.trim()}
          >
            <Search className="h-4 w-4 mr-1" />
            Search
          </Button>
        </div>
      </div>

      {/* Search Results */}
      {searchResults.length > 0 && (
        <Card className="max-h-[200px] overflow-auto">
          <CardContent className="p-3">
            <ul className="space-y-2">
              {searchResults.map((user) => (
                <li 
                  key={user.id}
                  className="flex justify-between items-center p-2 hover:bg-gray-100 rounded cursor-pointer"
                  onClick={() => selectUser(user)}
                >
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-gray-500" />
                    <div>
                      <p className="font-medium">{user.email}</p>
                      {user.group_title && (
                        <p className="text-sm text-gray-500">Current group: {user.group_title}</p>
                      )}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Selected User */}
      {selectedUser && (
        <div className="bg-gray-50 p-3 rounded-lg border flex justify-between items-center">
          <div className="flex items-center gap-2">
            <UserCheck className="h-4 w-4 text-green-500" />
            <span>{selectedUser.email}</span>
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setSelectedUser(null)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* Group Selection */}
      {selectedUser && (
        <div className="space-y-2">
          <Label htmlFor="group-select">Select Group</Label>
          <Select 
            value={selectedGroupId} 
            onValueChange={setSelectedGroupId}
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

