
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
          placeholder="Search by email..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1"
        />
        <Button onClick={onSearch} disabled={isSearching || !searchQuery.trim()}>
          <Search className="h-4 w-4 mr-1" />
          Search
        </Button>
      </div>
    </div>
  );
};

export default UserSearch;
