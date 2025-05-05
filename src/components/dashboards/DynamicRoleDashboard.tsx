
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
    } else if (lowerTitle.includes('deputy') && lowerTitle.includes('registrar')) {
      return "Assist in claim reviews and registrar processes";
    } else if (lowerTitle.includes('chief') && lowerTitle.includes('commissioner')) {
      return "Lead the commission and oversee all tribunal activities";
    } else if (lowerTitle.includes('secretary')) {
      return "Manage administrative tasks and documentation";
    } else if (lowerTitle.includes('director')) {
      return "Oversee departmental operations and strategic decisions";
    } else if (lowerTitle.includes('officer')) {
      return "Process and review assigned cases";
    } else if (lowerTitle.includes('manager')) {
      return "Supervise team operations and reporting";
    } else if (lowerTitle.includes('executive')) {
      return "Execute high-level decisions and policy implementation";
    } else if (lowerTitle.includes('assistant')) {
      return "Provide support for departmental operations";
    } else if (lowerTitle.includes('accountant')) {
      return "Manage financial records and processes";
    } else if (lowerTitle.includes('legal')) {
      return "Handle legal aspects of claims and cases";
    } else if (lowerTitle.includes('medical')) {
      return "Review medical aspects of injury claims";
    } else if (lowerTitle.includes('inspector')) {
      return "Conduct site inspections and compliance checks";
    } else if (lowerTitle.includes('analyst')) {
      return "Analyze data and prepare reports";
    } else if (lowerTitle.includes('supervisor')) {
      return "Oversee staff operations and workflow";
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
          <li>Monitor system activities</li>
        </>
      );
    } else if (lowerTitle.includes('employer')) {
      return (
        <>
          <li>Submit new claim report</li>
          <li>View pending claims</li>
          <li>Check claim status</li>
          <li>Update employee information</li>
        </>
      );
    } else if (lowerTitle.includes('registrar') || lowerTitle.includes('deputy registrar')) {
      return (
        <>
          <li>Review pending claims</li>
          <li>Approve or reject claims</li>
          <li>Generate decision reports</li>
          <li>Manage case documentation</li>
        </>
      );
    } else if (lowerTitle.includes('commissioner') || lowerTitle.includes('chief commissioner')) {
      return (
        <>
          <li>Review appeal cases</li>
          <li>Schedule tribunal hearings</li>
          <li>View decision statistics</li>
          <li>Issue final rulings on contested cases</li>
        </>
      );
    } else if (lowerTitle.includes('payment')) {
      return (
        <>
          <li>Process pending payments</li>
          <li>Review payment history</li>
          <li>Generate payment reports</li>
          <li>Reconcile financial records</li>
        </>
      );
    } else if (lowerTitle.includes('provincial') && lowerTitle.includes('claims')) {
      return (
        <>
          <li>Process provincial claims</li>
          <li>Review claim documentation</li>
          <li>Submit claims for compensation assessment</li>
          <li>Coordinate with regional offices</li>
        </>
      );
    } else if (lowerTitle.includes('secretary')) {
      return (
        <>
          <li>Manage correspondence</li>
          <li>Schedule meetings</li>
          <li>Organize documentation</li>
          <li>Assist with administrative tasks</li>
        </>
      );
    } else if (lowerTitle.includes('director')) {
      return (
        <>
          <li>Review departmental performance</li>
          <li>Approve strategic initiatives</li>
          <li>Oversee budget allocation</li>
          <li>Report to executive leadership</li>
        </>
      );
    } else if (lowerTitle.includes('officer')) {
      return (
        <>
          <li>Process assigned cases</li>
          <li>Update case information</li>
          <li>Generate status reports</li>
          <li>Communicate with stakeholders</li>
        </>
      );
    } else if (lowerTitle.includes('manager')) {
      return (
        <>
          <li>Supervise team activities</li>
          <li>Review staff performance</li>
          <li>Allocate resources</li>
          <li>Report on department metrics</li>
        </>
      );
    } else if (lowerTitle.includes('executive')) {
      return (
        <>
          <li>Implement strategic decisions</li>
          <li>Review organizational performance</li>
          <li>Approve policy changes</li>
          <li>Represent the organization</li>
        </>
      );
    } else if (lowerTitle.includes('assistant')) {
      return (
        <>
          <li>Support department operations</li>
          <li>Process documentation</li>
          <li>Respond to inquiries</li>
          <li>Maintain records</li>
        </>
      );
    } else if (lowerTitle.includes('accountant')) {
      return (
        <>
          <li>Process financial transactions</li>
          <li>Prepare financial reports</li>
          <li>Reconcile accounts</li>
          <li>Monitor budget compliance</li>
        </>
      );
    } else if (lowerTitle.includes('legal')) {
      return (
        <>
          <li>Review case legal aspects</li>
          <li>Prepare legal documents</li>
          <li>Advise on compliance matters</li>
          <li>Represent in legal proceedings</li>
        </>
      );
    } else if (lowerTitle.includes('medical')) {
      return (
        <>
          <li>Review medical documentation</li>
          <li>Assess injury claims</li>
          <li>Recommend treatment paths</li>
          <li>Determine disability percentages</li>
        </>
      );
    } else if (lowerTitle.includes('inspector')) {
      return (
        <>
          <li>Conduct site inspections</li>
          <li>Document compliance status</li>
          <li>Issue correction notices</li>
          <li>Follow up on remediation</li>
        </>
      );
    } else if (lowerTitle.includes('analyst')) {
      return (
        <>
          <li>Analyze system data</li>
          <li>Prepare statistical reports</li>
          <li>Identify trends and patterns</li>
          <li>Make recommendations based on findings</li>
        </>
      );
    } else if (lowerTitle.includes('supervisor')) {
      return (
        <>
          <li>Oversee daily operations</li>
          <li>Manage staff schedules</li>
          <li>Ensure quality standards</li>
          <li>Report on team performance</li>
        </>
      );
    }
    
    // Default actions for other roles
    return (
      <>
        <li>View assigned tasks</li>
        <li>Review relevant documents</li>
        <li>Update case information</li>
        <li>Generate reports</li>
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
