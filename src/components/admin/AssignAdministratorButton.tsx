
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { assignAsOWCAdmin } from "@/services/admin/assignAdministrator";

const AssignAdministratorButton = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleAssignAdmin = async () => {
    setLoading(true);
    try {
      // Use the "administrator@gmail.com" email as the administrator user
      const adminEmail = "administrator@gmail.com";
      
      // Use the existing assignAsOWCAdmin function
      const success = await assignAsOWCAdmin(adminEmail);
      
      if (success) {
        toast({
          title: "Success",
          description: "Administrator user has been assigned to the admin group.",
        });
      } else {
        throw new Error("Failed to assign administrator to admin group");
      }
    } catch (error) {
      console.error("Error assigning admin:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to assign administrator to admin group.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button 
      onClick={handleAssignAdmin} 
      disabled={loading}
      className="mb-4"
    >
      {loading ? "Assigning..." : "Assign Administrator to Admin Group"}
    </Button>
  );
};

export default AssignAdministratorButton;
