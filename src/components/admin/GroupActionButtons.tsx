
import React from "react";
import { Button } from "@/components/ui/button";

interface GroupActionButtonsProps {
  onAddToGroup: () => void;
  onRemoveFromGroup: () => void;
  canAdd: boolean;
  canRemove: boolean;
  loading: boolean;
}

const GroupActionButtons: React.FC<GroupActionButtonsProps> = ({
  onAddToGroup,
  onRemoveFromGroup,
  canAdd,
  canRemove,
  loading,
}) => {
  return (
    <div className="flex flex-col justify-center space-y-4">
      <Button 
        onClick={onAddToGroup} 
        disabled={!canAdd || loading}
        className="w-20 justify-center"
      >
        Add &gt;&gt;
      </Button>
      <Button 
        onClick={onRemoveFromGroup} 
        disabled={!canRemove || loading}
        className="w-20 justify-center"
      >
        &lt;&lt; Remove
      </Button>
    </div>
  );
};

export default GroupActionButtons;
