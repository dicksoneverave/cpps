
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { UserData } from "@/types/adminTypes";

interface UserDetailsProps {
  selectedUser: UserData | null;
}

const UserDetails: React.FC<UserDetailsProps> = ({ selectedUser }) => {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>User Details</CardTitle>
      </CardHeader>
      <CardContent>
        {selectedUser ? (
          <div className="space-y-4">
            <div>
              <p className="font-medium">Name:</p>
              <p>{selectedUser.name || "N/A"}</p>
            </div>
            <div>
              <p className="font-medium">Email:</p>
              <p>{selectedUser.email}</p>
            </div>
            {selectedUser.group_title && (
              <div>
                <p className="font-medium">Group:</p>
                <p>{selectedUser.group_title}</p>
              </div>
            )}
          </div>
        ) : (
          <p className="text-gray-500">Select a user to view details</p>
        )}
      </CardContent>
    </Card>
  );
};

export default UserDetails;
