
import React from "react";
import { X, UserCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { UserData } from "@/types/adminTypes";

interface SelectedUserProps {
  user: UserData;
  onRemoveUser: () => void;
}

const SelectedUser: React.FC<SelectedUserProps> = ({ user, onRemoveUser }) => {
  return (
    <div className="bg-gray-50 p-3 rounded-lg border flex justify-between items-center">
      <div className="flex items-center gap-2">
        <UserCheck className="h-4 w-4 text-green-500" />
        <span>{user.email}</span>
      </div>
      <Button variant="ghost" size="icon" onClick={onRemoveUser}>
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default SelectedUser;
