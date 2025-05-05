
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Users, BarChart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const ClaimsManagerDashboard: React.FC = () => {
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Claims Manager Dashboard</CardTitle>
        <CardDescription>Oversee all claims processing activities</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          <Button variant="outline" className="flex flex-col items-center justify-center p-6 h-auto" asChild>
            <Link to="/claims/workload">
              <FileText className="h-8 w-8 mb-2 text-primary" />
              <span>Claims Workload</span>
            </Link>
          </Button>
          <Button variant="outline" className="flex flex-col items-center justify-center p-6 h-auto" asChild>
            <Link to="/claims/staff">
              <Users className="h-8 w-8 mb-2 text-primary" />
              <span>Staff Assignments</span>
            </Link>
          </Button>
          <Button variant="outline" className="flex flex-col items-center justify-center p-6 h-auto" asChild>
            <Link to="/claims/analytics">
              <BarChart className="h-8 w-8 mb-2 text-primary" />
              <span>Claims Analytics</span>
            </Link>
          </Button>
        </div>
        
        <h3 className="text-lg font-medium mb-2">Department Performance</h3>
        <ul className="space-y-2">
          <li className="p-2 bg-muted rounded-md">45 claims processed this month</li>
          <li className="p-2 bg-muted rounded-md">Average processing time: 12 days</li>
          <li className="p-2 bg-muted rounded-md">15 cases requiring management review</li>
        </ul>
      </CardContent>
    </Card>
  );
};

export default ClaimsManagerDashboard;
