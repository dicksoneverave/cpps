
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface DynamicDashboardProps {
  groupTitle: string;
  description?: string;
}

const DynamicDashboard = ({ groupTitle, description }: DynamicDashboardProps) => {
  // Generate description based on group title if none provided
  const dashboardDescription = description || `Manage ${groupTitle.toLowerCase()} tasks and activities`;
  
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>{groupTitle} Dashboard</CardTitle>
        <CardDescription>{dashboardDescription}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <p>Quick actions:</p>
          <ul className="list-disc pl-6">
            {groupTitle.toLowerCase().includes('employer') && (
              <>
                <li>Submit new claim report</li>
                <li>View pending claims</li>
                <li>Check claim status</li>
              </>
            )}
            {(groupTitle.toLowerCase().includes('registrar') || groupTitle.toLowerCase().includes('deputy registrar')) && (
              <>
                <li>Review pending claims</li>
                <li>Approve or reject claims</li>
                <li>Generate decision reports</li>
              </>
            )}
            {(groupTitle.toLowerCase().includes('commissioner') || groupTitle.toLowerCase().includes('chief commissioner')) && (
              <>
                <li>Review appeal cases</li>
                <li>Schedule tribunal hearings</li>
                <li>View decision statistics</li>
              </>
            )}
            {groupTitle.toLowerCase().includes('payment') && (
              <>
                <li>Process pending payments</li>
                <li>Review payment history</li>
                <li>Generate payment reports</li>
              </>
            )}
            {groupTitle.toLowerCase().includes('admin') && (
              <>
                <li>Manage users and permissions</li>
                <li>Configure system settings</li>
                <li><a href="/admin" className="text-blue-600 hover:underline">Go to Admin Panel</a></li>
              </>
            )}
            {/* Default actions for all other groups */}
            {!groupTitle.toLowerCase().includes('employer') && 
             !groupTitle.toLowerCase().includes('registrar') && 
             !groupTitle.toLowerCase().includes('commissioner') &&
             !groupTitle.toLowerCase().includes('payment') &&
             !groupTitle.toLowerCase().includes('admin') && (
              <>
                <li>View assigned tasks</li>
                <li>Review relevant documents</li>
                <li>Update case information</li>
              </>
            )}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default DynamicDashboard;
