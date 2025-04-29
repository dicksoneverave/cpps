
import React from "react";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UserGroup } from "@/types/adminTypes";

interface GroupSelectorProps {
  userGroups: UserGroup[];
  selectedGroupId: string;
  onGroupSelect: (groupId: string) => void;
}

const GroupSelector: React.FC<GroupSelectorProps> = ({
  userGroups,
  selectedGroupId,
  onGroupSelect,
}) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="group-select">Select Group</Label>
      <Select value={selectedGroupId} onValueChange={onGroupSelect}>
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
  );
};

export default GroupSelector;
