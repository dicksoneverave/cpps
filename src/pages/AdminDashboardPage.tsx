
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Navbar from "@/components/Navbar";
import { useAuth } from "@/contexts/AuthContext";
import AdminUserGroups from "@/components/admin/AdminUserGroups";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";

const AdminDashboardPage: React.FC = () => {
  const { user, userRole, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (!loading && !user) {
      navigate("/login");
      return;
    }

    // Admin role check - modify this based on your roles structure
    if (!loading && user && userRole !== "OWC Admin" && userRole !== "owcadmin") {
      toast({
        title: "Access Restricted",
        description: "You do not have permission to access the admin dashboard.",
        variant: "destructive",
      });
      navigate("/dashboard");
    }
  }, [user, userRole, loading, navigate, toast]);

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      <div className="flex-1 container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-6 mt-4">Admin Dashboard</h1>

        <Tabs defaultValue="users" className="w-full">
          <TabsList className="mb-8 grid w-full grid-cols-2 lg:grid-cols-4">
            <TabsTrigger value="users">User Management</TabsTrigger>
            <TabsTrigger value="groups">Group Management</TabsTrigger>
            <TabsTrigger value="forms">Form Management</TabsTrigger>
            <TabsTrigger value="settings">System Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="users" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>User Group Assignment</CardTitle>
                <CardDescription>
                  Assign users to groups to control their access levels and dashboard views
                </CardDescription>
              </CardHeader>
              <CardContent>
                <AdminUserGroups />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="groups">
            <Card>
              <CardHeader>
                <CardTitle>Group Management</CardTitle>
                <CardDescription>
                  Manage user groups and their permissions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p>Group management functionality will be implemented here.</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="forms">
            <Card>
              <CardHeader>
                <CardTitle>Form Management</CardTitle>
                <CardDescription>
                  Manage system forms and their assignments
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p>Form management functionality will be implemented here.</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>System Settings</CardTitle>
                <CardDescription>
                  Configure global system settings
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p>System settings functionality will be implemented here.</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
