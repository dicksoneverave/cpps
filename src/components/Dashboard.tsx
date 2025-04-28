
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from "recharts";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

interface DashboardProps {
  userRole: string;
}

interface ChartData {
  name: string;
  value: number;
  color: string;
}

// Role-specific dashboard components
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

const Dashboard: React.FC<DashboardProps> = ({ userRole }) => {
  const [injuryClaims, setInjuryClaims] = useState<ChartData[]>([]);
  const [deathClaims, setDeathClaims] = useState<ChartData[]>([]);
  const { user } = useAuth();
  
  useEffect(() => {
    // In a real scenario, we would fetch data from Supabase
    // This is mock data for demonstration
    const mockInjuryData = [
      { name: "Pending", value: 45, color: "#9ca360" },
      { name: "Approved", value: 30, color: "#64805E" },
      { name: "Rejected", value: 15, color: "#8B2303" },
    ];
    
    const mockDeathData = [
      { name: "Pending", value: 20, color: "#5ED0C0" },
      { name: "Approved", value: 15, color: "#30D158" },
      { name: "Rejected", value: 5, color: "#FF9F0A" },
    ];
    
    setInjuryClaims(mockInjuryData);
    setDeathClaims(mockDeathData);
  }, []);

  // Render role-specific dashboard
  const renderRoleDashboard = () => {
    const normalizedRole = userRole?.toLowerCase();
    
    if (!user) return <DefaultDashboard />;
    
    if (normalizedRole?.includes('employer')) {
      return <EmployerDashboard />;
    } else if (normalizedRole?.includes('registrar')) {
      return <RegistrarDashboard />;
    } else if (normalizedRole?.includes('commissioner')) {
      return <CommissionerDashboard />;
    } else if (normalizedRole?.includes('payment')) {
      return <PaymentDashboard />;
    } else if (normalizedRole?.includes('admin') || normalizedRole?.includes('owcadmin')) {
      return <AdminDashboard />;
    }
    
    return <DefaultDashboard />;
  };

  return (
    <div className="container mx-auto p-4 mt-8">
      <h1 className="text-2xl font-bold mb-6">Dashboard - {userRole}</h1>
      
      {/* Role-Specific Dashboard */}
      {renderRoleDashboard()}
      
      {/* Common Dashboard Elements */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Claims for Injury this year</CardTitle>
            <CardDescription>Distribution of injury claims by status</CardDescription>
          </CardHeader>
          <CardContent className="h-72">
            <ChartContainer
              config={{
                pending: { color: "#9ca360" },
                approved: { color: "#64805E" },
                rejected: { color: "#8B2303" },
              }}
            >
              <PieChart>
                <Pie
                  data={injuryClaims}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  nameKey="name"
                >
                  {injuryClaims.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Legend />
                <ChartTooltip content={<ChartTooltipContent />} />
              </PieChart>
            </ChartContainer>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Claims for Death this year</CardTitle>
            <CardDescription>Distribution of death claims by status</CardDescription>
          </CardHeader>
          <CardContent className="h-72">
            <ChartContainer
              config={{
                pending: { color: "#5ED0C0" },
                approved: { color: "#30D158" },
                rejected: { color: "#FF9F0A" },
              }}
            >
              <PieChart>
                <Pie
                  data={deathClaims}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  nameKey="name"
                >
                  {deathClaims.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Legend />
                <ChartTooltip content={<ChartTooltipContent />} />
              </PieChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
