
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import UserListContainer from "./group-assignment/UserListContainer";
import GroupAssignmentHeader from "./group-assignment/GroupAssignmentHeader";
import GroupActionButtons from "./GroupActionButtons";
import { useGroupAssignment } from "./group-assignment/useGroupAssignment";

const GroupAssignmentForm: React.FC = () => {
  const {
    userGroups,
    selectedGroupId,
    setSelectedGroupId,
    availableUsers,
    groupUsers,
    selectedUser,
    selectedGroupUser,
    loading,
    handleSelectUser,
    handleSelectGroupUser,
    handleAddToGroup,
    handleRemoveFromGroup
  } = useGroupAssignment();

  return (
    <Card className="w-full">
      <CardContent className="p-6">
        <div className="flex space-x-6 h-[500px]">
          {/* Left side: Available Users */}
          <UserListContainer 
            availableUsers={availableUsers}
            groupUsers={groupUsers}
            selectedUser={selectedUser}
            selectedGroupUser={selectedGroupUser}
            onSelectUser={handleSelectUser}
            onSelectGroupUser={handleSelectGroupUser}
          />

          {/* Middle: Add/Remove buttons */}
          <GroupActionButtons
            onAddToGroup={handleAddToGroup}
            onRemoveFromGroup={handleRemoveFromGroup}
            canAdd={!!selectedUser}
            canRemove={!!selectedGroupUser}
            loading={loading}
          />

          {/* Right side: Group Selection Panel */}
          <div className="w-1/3 flex flex-col">
            {/* Group Selection Dropdown */}
            <GroupAssignmentHeader 
              userGroups={userGroups}
              selectedGroupId={selectedGroupId}
              onGroupSelect={setSelectedGroupId}
            />
            
            {/* Users in Group is handled by UserListContainer */}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default GroupAssignmentForm;
