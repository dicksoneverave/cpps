
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Navbar from "@/components/Navbar";
import { useAuth } from "@/contexts/AuthContext";
import AdminUserGroups from "@/components/admin/AdminUserGroups";
import AssignAdministratorButton from "@/components/admin/AssignAdministratorButton";
import GroupAssignmentForm from "@/components/admin/GroupAssignmentForm";
import UserManagement from "@/components/admin/UserManagement";
import AdminDashboardCharts from "@/components/dashboards/AdminDashboardCharts";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";

const AdminDashboardPage: React.FC = () => {
  const { user, userRole, loading, isAdmin } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (!loading && !user) {
      navigate("/login");
      return;
    }

    // Admin role check - allow administrator@gmail.com email directly
    if (!loading && user && !isAdmin && user.email !== "administrator@gmail.com") {
      toast({
        title: "Access Restricted",
        description: "You do not have permission to access the admin dashboard.",
        variant: "destructive",
      });
      navigate("/dashboard");
    }
  }, [user, userRole, loading, navigate, toast, isAdmin]);

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      <div className="flex-1 container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-6 mt-4">Admin Dashboard</h1>

        {/* Admin assignment button */}
        <AssignAdministratorButton />

        <Tabs defaultValue="dashboard" className="w-full">
          <TabsList className="mb-8 grid w-full grid-cols-2 lg:grid-cols-6">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="group-assignment">Group Assignment</TabsTrigger>
            <TabsTrigger value="users">User Management</TabsTrigger>
            <TabsTrigger value="groups">Group Management</TabsTrigger>
            <TabsTrigger value="forms">Form Management</TabsTrigger>
            <TabsTrigger value="settings">System Settings</TabsTrigger>
          </TabsList>

          {/* New Dashboard tab */}
          <TabsContent value="dashboard" className="space-y-4">
            <AdminDashboardCharts />
          </TabsContent>

          {/* Group Assignment tab */}
          <TabsContent value="group-assignment" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>User Group Assignment</CardTitle>
                <CardDescription>
                  Assign users to groups to control their access levels and dashboard views
                </CardDescription>
              </CardHeader>
              <CardContent>
                <GroupAssignmentForm />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="forms" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Form Management</CardTitle>
                <CardDescription>
                  Manage and configure system forms
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p>Form management functionality will be implemented here.</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>User Management</CardTitle>
                <CardDescription>
                  Add, edit, or remove users from the system
                </CardDescription>
              </CardHeader>
              <CardContent>
                <UserManagement />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="groups">
            <Card>
              <CardHeader>
                <CardTitle>Group Management</CardTitle>
                <CardDescription>
                  Create, edit, or remove user groups and their permissions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p>Group management functionality will be implemented here.</p>
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
