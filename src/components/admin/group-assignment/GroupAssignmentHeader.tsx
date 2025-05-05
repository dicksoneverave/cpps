
import React from "react";
import { UserGroup } from "@/types/adminTypes";
import GroupSelector from "../GroupSelector";

interface GroupAssignmentHeaderProps {
  userGroups: UserGroup[];
  selectedGroupId: string;
  onGroupSelect: (groupId: string) => void;
}

const GroupAssignmentHeader: React.FC<GroupAssignmentHeaderProps> = ({
  userGroups,
  selectedGroupId,
  onGroupSelect,
}) => {
  return (
    <div className="mb-4">
      <h3 className="font-medium mb-2">Select Group</h3>
      <GroupSelector
        userGroups={userGroups}
        selectedGroupId={selectedGroupId}
        onGroupSelect={onGroupSelect}
      />
    </div>
  );
};

export default GroupAssignmentHeader;
