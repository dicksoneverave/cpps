
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const AdminDashboard = () => (
  <Card className="mb-6">
    <CardHeader>
      <CardTitle>Admin Dashboard</CardTitle>
      <CardDescription>System administration and management</CardDescription>
    </CardHeader>
    <CardContent>
      <div className="space-y-2">
        <p>Quick actions:</p>
        <ul className="list-disc pl-6">
          <li>Manage users and permissions</li>
          <li>Configure system settings</li>
          <li><a href="/admin" className="text-blue-600 hover:underline">Go to Admin Panel</a></li>
        </ul>
      </div>
    </CardContent>
  </Card>
);

export default AdminDashboard;
