
import React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { UserData } from "@/types/adminTypes";

interface UserListProps {
  title: string;
  users: UserData[];
  selectedUser: UserData | null;
  onSelectUser: (user: UserData) => void;
  emptyMessage?: string;
}

const UserList: React.FC<UserListProps> = ({
  title,
  users,
  selectedUser,
  onSelectUser,
  emptyMessage = "No users available",
}) => {
  return (
    <div className="flex flex-col h-full">
      <h3 className="font-medium mb-2">{title}</h3>
      <ScrollArea className="flex-1 border rounded-md p-2">
        <div className="space-y-1">
          {users.length > 0 ? (
            users.map((user) => (
              <div
                key={user.id}
                className={`p-2 cursor-pointer rounded ${
                  selectedUser?.id === user.id ? "bg-primary text-primary-foreground" : "hover:bg-muted"
                }`}
                onClick={() => onSelectUser(user)}
              >
                {user.email || "Unknown email"}
              </div>
            ))
          ) : (
            <div className="text-gray-500 p-2">{emptyMessage}</div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};

export default UserList;
