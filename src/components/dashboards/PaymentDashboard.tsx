
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const PaymentDashboard = () => (
  <Card className="mb-6">
    <CardHeader>
      <CardTitle>Payment Section Dashboard</CardTitle>
      <CardDescription>Process and manage payments</CardDescription>
    </CardHeader>
    <CardContent>
      <div className="space-y-2">
        <p>Quick actions:</p>
        <ul className="list-disc pl-6">
          <li>Process pending payments</li>
          <li>Review payment history</li>
          <li>Generate payment reports</li>
        </ul>
      </div>
    </CardContent>
  </Card>
);

export default PaymentDashboard;
