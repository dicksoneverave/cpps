
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import { UserData } from "@/types/adminTypes";

interface ResetPasswordDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedUser: UserData | null;
  onResetPassword: (userId: string, newPassword: string) => Promise<boolean>;
}

const ResetPasswordDialog: React.FC<ResetPasswordDialogProps> = ({ 
  open, 
  onOpenChange, 
  selectedUser, 
  onResetPassword 
}) => {
  const [newPassword, setNewPassword] = useState("");

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedUser) return;
    
    const success = await onResetPassword(selectedUser.id, newPassword);
    
    if (success) {
      setNewPassword("");
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Reset User Password</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleResetPassword}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="userEmail">User</Label>
              <Input
                id="userEmail"
                value={selectedUser?.email || ""}
                disabled
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="newPassword">New Password</Label>
              <Input
                id="newPassword"
                type="password"
                placeholder="New password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit">Reset Password</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ResetPasswordDialog;
