
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const RegistrarDashboard = () => (
  <Card className="mb-6">
    <CardHeader>
      <CardTitle>Registrar Dashboard</CardTitle>
      <CardDescription>Manage claim approvals and reviews</CardDescription>
    </CardHeader>
    <CardContent>
      <div className="space-y-2">
        <p>Quick actions:</p>
        <ul className="list-disc pl-6">
          <li>Review pending claims</li>
          <li>Approve or reject claims</li>
          <li>Generate decision reports</li>
        </ul>
      </div>
    </CardContent>
  </Card>
);

export default RegistrarDashboard;
