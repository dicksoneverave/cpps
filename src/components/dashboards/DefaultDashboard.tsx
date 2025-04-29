
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const DefaultDashboard = () => (
  <Card className="mb-6">
    <CardHeader>
      <CardTitle>Welcome to CPPS</CardTitle>
      <CardDescription>Claims Processing & Payment System</CardDescription>
    </CardHeader>
    <CardContent>
      <p>Please select an option from the menu to get started.</p>
    </CardContent>
  </Card>
);

export default DefaultDashboard;
