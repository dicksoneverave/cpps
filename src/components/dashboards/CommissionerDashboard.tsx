
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const CommissionerDashboard = () => (
  <Card className="mb-6">
    <CardHeader>
      <CardTitle>Commissioner Dashboard</CardTitle>
      <CardDescription>Oversee tribunal and high-level decisions</CardDescription>
    </CardHeader>
    <CardContent>
      <div className="space-y-2">
        <p>Quick actions:</p>
        <ul className="list-disc pl-6">
          <li>Review appeal cases</li>
          <li>Schedule tribunal hearings</li>
          <li>View decision statistics</li>
        </ul>
      </div>
    </CardContent>
  </Card>
);

export default CommissionerDashboard;
