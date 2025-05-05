
import React from "react";
import { UserData } from "@/types/adminTypes";
import UserList from "../UserList";

interface UserListContainerProps {
  availableUsers: UserData[];
  groupUsers: UserData[];
  selectedUser: UserData | null;
  selectedGroupUser: UserData | null;
  onSelectUser: (user: UserData) => void;
  onSelectGroupUser: (user: UserData) => void;
}

const UserListContainer: React.FC<UserListContainerProps> = ({
  availableUsers,
  groupUsers,
  selectedUser,
  selectedGroupUser,
  onSelectUser,
  onSelectGroupUser,
}) => {
  return (
    <>
      {/* Left side: All Available Users */}
      <div className="w-1/3">
        <UserList 
          title="Available Users"
          users={availableUsers}
          selectedUser={selectedUser}
          onSelectUser={onSelectUser}
          emptyMessage="No available users"
        />
      </div>

      {/* Right side: Users in Group */}
      <div className="w-1/3 flex flex-col">
        <UserList
          title="Users in Group"
          users={groupUsers}
          selectedUser={selectedGroupUser}
          onSelectUser={onSelectGroupUser}
          emptyMessage="No users in this group"
        />
      </div>
    </>
  );
};

export default UserListContainer;
