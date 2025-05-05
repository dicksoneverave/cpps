
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const ProvincialClaimsOfficerDashboard = () => (
  <Card className="mb-6">
    <CardHeader>
      <CardTitle>Provincial Claims Officer Dashboard</CardTitle>
      <CardDescription>Manage and process provincial claims</CardDescription>
    </CardHeader>
    <CardContent>
      <div className="space-y-2">
        <p>Quick actions:</p>
        <ul className="list-disc pl-6">
          <li>Process pending provincial claims</li>
          <li>Review claim documentation</li>
          <li>Generate claim reports</li>
          <li>Submit claims for compensation assessment</li>
          <li>Track status of claims in your province</li>
        </ul>
      </div>
    </CardContent>
  </Card>
);

export default ProvincialClaimsOfficerDashboard;
