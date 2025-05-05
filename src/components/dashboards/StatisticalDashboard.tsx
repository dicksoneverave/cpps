
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, BarChart, PieChart, LineChart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const StatisticalDashboard: React.FC = () => {
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Statistical Department Dashboard</CardTitle>
        <CardDescription>Analyze claims data and generate reports</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          <Button variant="outline" className="flex flex-col items-center justify-center p-6 h-auto" asChild>
            <Link to="/reports/monthly">
              <BarChart className="h-8 w-8 mb-2 text-primary" />
              <span>Monthly Reports</span>
            </Link>
          </Button>
          <Button variant="outline" className="flex flex-col items-center justify-center p-6 h-auto" asChild>
            <Link to="/reports/trends">
              <LineChart className="h-8 w-8 mb-2 text-primary" />
              <span>Trend Analysis</span>
            </Link>
          </Button>
          <Button variant="outline" className="flex flex-col items-center justify-center p-6 h-auto" asChild>
            <Link to="/reports/distribution">
              <PieChart className="h-8 w-8 mb-2 text-primary" />
              <span>Claim Distribution</span>
            </Link>
          </Button>
          <Button variant="outline" className="flex flex-col items-center justify-center p-6 h-auto" asChild>
            <Link to="/reports/export">
              <FileText className="h-8 w-8 mb-2 text-primary" />
              <span>Export Reports</span>
            </Link>
          </Button>
        </div>
        
        <h3 className="text-lg font-medium mb-2">Report Status</h3>
        <ul className="space-y-2">
          <li className="p-2 bg-muted rounded-md">Monthly claims report - Due May 30</li>
          <li className="p-2 bg-muted rounded-md">Quarterly analysis - In progress</li>
          <li className="p-2 bg-muted rounded-md">Annual report - Planning phase</li>
        </ul>
      </CardContent>
    </Card>
  );
};

export default StatisticalDashboard;
