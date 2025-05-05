
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface DynamicRoleDashboardProps {
  title: string; // This will be the owc_usergroups.title
}

const DynamicRoleDashboard: React.FC<DynamicRoleDashboardProps> = ({ title }) => {
  // Generate a description based on the role title
  const getDescription = () => {
    const lowerTitle = title.toLowerCase();
    
    // Custom descriptions for specific roles
    if (lowerTitle.includes('admin')) {
      return "Manage system users, roles, and configurations";
    } else if (lowerTitle.includes('employer')) {
      return "Manage employee claims and reports";
    } else if (lowerTitle.includes('registrar')) {
      return "Manage claim approvals and reviews";
    } else if (lowerTitle.includes('commissioner')) {
      return "Oversee tribunal and high-level decisions";
    } else if (lowerTitle.includes('payment')) {
      return "Process and manage payments";
    } else if (lowerTitle.includes('provincial') && lowerTitle.includes('claims')) {
      return "Manage and process provincial claims";
    }
    
    // Default description for other roles
    return `Manage ${title} related tasks and responsibilities`;
  };

  // Generate actions based on the role title
  const getActions = () => {
    const lowerTitle = title.toLowerCase();
    
    if (lowerTitle.includes('admin')) {
      return (
        <>
          <li>Manage users and permissions</li>
          <li>Configure system settings</li>
          <li>Generate administrative reports</li>
        </>
      );
    } else if (lowerTitle.includes('employer')) {
      return (
        <>
          <li>Submit new claim report</li>
          <li>View pending claims</li>
          <li>Check claim status</li>
        </>
      );
    } else if (lowerTitle.includes('registrar')) {
      return (
        <>
          <li>Review pending claims</li>
          <li>Approve or reject claims</li>
          <li>Generate decision reports</li>
        </>
      );
    } else if (lowerTitle.includes('commissioner')) {
      return (
        <>
          <li>Review appeal cases</li>
          <li>Schedule tribunal hearings</li>
          <li>View decision statistics</li>
        </>
      );
    } else if (lowerTitle.includes('payment')) {
      return (
        <>
          <li>Process pending payments</li>
          <li>Review payment history</li>
          <li>Generate payment reports</li>
        </>
      );
    } else if (lowerTitle.includes('provincial') && lowerTitle.includes('claims')) {
      return (
        <>
          <li>Process provincial claims</li>
          <li>Review claim documentation</li>
          <li>Submit claims for compensation assessment</li>
        </>
      );
    }
    
    // Default actions for other roles
    return (
      <>
        <li>View assigned tasks</li>
        <li>Review relevant documents</li>
        <li>Update case information</li>
      </>
    );
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>{title} Dashboard</CardTitle>
        <CardDescription>{getDescription()}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <p>Quick actions:</p>
          <ul className="list-disc pl-6">
            {getActions()}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default DynamicRoleDashboard;
