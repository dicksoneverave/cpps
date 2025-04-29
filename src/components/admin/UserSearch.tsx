
import React from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

interface UserSearchProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onSearch: () => void;
  isSearching: boolean;
}

const UserSearch: React.FC<UserSearchProps> = ({ 
  searchQuery, 
  setSearchQuery, 
  onSearch, 
  isSearching 
}) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="user-search">Search Users</Label>
      <div className="flex gap-2">
        <Input
          id="user-search"
          placeholder="Start typing name or email to filter users..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1"
        />
        <Button 
          onClick={onSearch} 
          disabled={isSearching || !searchQuery.trim()}
          title="Search in all users including those not in the current view"
        >
          <Search className="h-4 w-4 mr-1" />
          Search All
        </Button>
      </div>
      {searchQuery && (
        <p className="text-sm text-gray-500">
          Type to filter the list. Use the Search All button to search beyond the current list.
        </p>
      )}
    </div>
  );
};

export default UserSearch;
