
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { PieChart, Pie, Cell, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
import { LayoutDashboard } from "lucide-react";

interface AdminChartData {
  name: string;
  value: number;
  color: string;
}

const AdminDashboardCharts: React.FC = () => {
  // Mock data for the admin dashboard
  const userActivityData = [
    { name: "Active", value: 120, color: "#0088FE" },
    { name: "Inactive", value: 45, color: "#FF8042" },
    { name: "Pending", value: 35, color: "#FFBB28" },
  ];

  const systemActivityData = [
    { name: "Employers", value: 65, fill: "#8884d8" },
    { name: "Claims Officers", value: 45, fill: "#82ca9d" },
    { name: "Registrars", value: 23, fill: "#ffc658" },
    { name: "Commissioners", value: 12, fill: "#ff8042" },
    { name: "Admins", value: 8, fill: "#0088fe" },
  ];

  const claimActivityData = [
    { name: "Mon", pending: 4, approved: 2, rejected: 1 },
    { name: "Tue", pending: 3, approved: 4, rejected: 0 },
    { name: "Wed", pending: 5, approved: 3, rejected: 2 },
    { name: "Thu", pending: 7, approved: 5, rejected: 1 },
    { name: "Fri", pending: 6, approved: 4, rejected: 2 },
    { name: "Sat", pending: 2, approved: 1, rejected: 0 },
    { name: "Sun", pending: 1, approved: 0, rejected: 0 },
  ];

  const pieChartConfig = {
    active: { color: "#0088FE" },
    inactive: { color: "#FF8042" },
    pending: { color: "#FFBB28" },
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <LayoutDashboard className="h-6 w-6 text-gray-500" />
        <h2 className="text-xl font-medium">System Overview</h2>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* User Activity Chart */}
        <Card>
          <CardHeader>
            <CardTitle>User Activity</CardTitle>
            <CardDescription>Distribution of active users in the system</CardDescription>
          </CardHeader>
          <CardContent className="h-72">
            <ChartContainer config={pieChartConfig}>
              <PieChart>
                <Pie
                  data={userActivityData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  nameKey="name"
                >
                  {userActivityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Legend />
                <ChartTooltip content={<ChartTooltipContent />} />
              </PieChart>
            </ChartContainer>
          </CardContent>
        </Card>
        
        {/* System Usage By Role Chart */}
        <Card>
          <CardHeader>
            <CardTitle>System Usage by Role</CardTitle>
            <CardDescription>Number of users per role category</CardDescription>
          </CardHeader>
          <CardContent className="h-72">
            <BarChart
              width={350}
              height={250}
              data={systemActivityData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" name="Users" />
            </BarChart>
          </CardContent>
        </Card>
        
        {/* Weekly Claim Activity */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Weekly Claim Activity</CardTitle>
            <CardDescription>Claim processing activity over the past week</CardDescription>
          </CardHeader>
          <CardContent className="h-72">
            <BarChart
              width={800}
              height={250}
              data={claimActivityData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="pending" name="Pending Claims" fill="#FFBB28" />
              <Bar dataKey="approved" name="Approved Claims" fill="#82ca9d" />
              <Bar dataKey="rejected" name="Rejected Claims" fill="#FF8042" />
            </BarChart>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboardCharts;
