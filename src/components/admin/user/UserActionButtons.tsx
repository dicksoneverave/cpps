
import React from "react";
import { Button } from "@/components/ui/button";
import { Key, Trash2 } from "lucide-react";
import { UserData } from "@/types/adminTypes";

interface UserActionButtonsProps {
  selectedUser: UserData | null;
  onResetPassword: () => void;
  onDeleteUser: () => void;
}

const UserActionButtons: React.FC<UserActionButtonsProps> = ({
  selectedUser,
  onResetPassword,
  onDeleteUser
}) => {
  return (
    <div className="mt-4 flex justify-end space-x-2">
      <Button
        variant="outline"
        disabled={!selectedUser}
        onClick={onResetPassword}
        className="flex items-center gap-1"
      >
        <Key className="w-4 h-4" />
        <span>Reset Password</span>
      </Button>

      <Button
        variant="destructive"
        disabled={!selectedUser}
        onClick={onDeleteUser}
        className="flex items-center gap-1"
      >
        <Trash2 className="w-4 h-4" />
        <span>Delete User</span>
      </Button>
    </div>
  );
};

export default UserActionButtons;
