
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { assignAdministratorToAdminGroup } from "@/services/admin/assignAdministrator";

const AssignAdministratorButton = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleAssignAdmin = async () => {
    setLoading(true);
    try {
      await assignAdministratorToAdminGroup();
      toast({
        title: "Success",
        description: "Administrator user has been assigned to the admin group.",
      });
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
