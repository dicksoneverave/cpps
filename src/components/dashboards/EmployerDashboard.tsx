
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const EmployerDashboard = () => (
  <Card className="mb-6">
    <CardHeader>
      <CardTitle>Employer Dashboard</CardTitle>
      <CardDescription>Manage your employee claims and reports</CardDescription>
    </CardHeader>
    <CardContent>
      <div className="space-y-2">
        <p>Quick actions:</p>
        <ul className="list-disc pl-6">
          <li>Submit new claim report</li>
          <li>View pending claims</li>
          <li>Check claim status</li>
        </ul>
      </div>
    </CardContent>
  </Card>
);

export default EmployerDashboard;
