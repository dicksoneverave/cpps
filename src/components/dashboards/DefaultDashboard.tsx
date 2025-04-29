
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";

const DefaultDashboard = () => (
  <Card className="mb-6">
    <CardHeader>
      <CardTitle className="text-center">Welcome to CPPS</CardTitle>
      <CardDescription className="text-center">
        Claims Processing & Payment System
      </CardDescription>
    </CardHeader>
    <CardContent>
      <div className="flex flex-col items-center space-y-4">
        <div className="p-3 bg-amber-100 text-amber-800 rounded-full">
          <AlertCircle size={24} />
        </div>
        <p className="text-center max-w-md">
          You don't have a specific role assigned yet or your role doesn't have a custom dashboard.
          Please contact system administration to get assigned to the correct user group.
        </p>
        <div className="mt-4 p-4 bg-gray-50 rounded-lg w-full">
          <h3 className="font-medium text-gray-700 mb-2">Getting Started</h3>
          <ul className="list-disc pl-6 space-y-1 text-gray-600">
            <li>Check that your email is correctly registered in the system</li>
            <li>Ensure you have been assigned to the correct user group</li>
            <li>Contact the administrator if you need access to specific features</li>
          </ul>
        </div>
      </div>
    </CardContent>
  </Card>
);

export default DefaultDashboard;
