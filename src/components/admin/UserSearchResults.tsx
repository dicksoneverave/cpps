
import React from "react";
import { User } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { UserData } from "@/types/adminTypes";

interface UserSearchResultsProps {
  results: UserData[];
  onSelectUser: (user: UserData) => void;
}

const UserSearchResults: React.FC<UserSearchResultsProps> = ({
  results,
  onSelectUser,
}) => {
  if (results.length === 0) return null;

  return (
    <Card className="max-h-[200px] overflow-auto">
      <CardContent className="p-3">
        <ul className="space-y-2">
          {results.map((user) => (
            <li
              key={user.id}
              className="flex justify-between items-center p-2 hover:bg-gray-100 rounded cursor-pointer"
              onClick={() => onSelectUser(user)}
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
  );
};

export default UserSearchResults;
