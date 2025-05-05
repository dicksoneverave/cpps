
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, PieChart, LineChart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const StatisticalDashboard: React.FC = () => {
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Statistical Dashboard</CardTitle>
        <CardDescription>Access analytics and reporting tools</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          <Button variant="outline" className="flex flex-col items-center justify-center p-6 h-auto" asChild>
            <Link to="/statistics/claims">
              <BarChart className="h-8 w-8 mb-2 text-primary" />
              <span>Claims Statistics</span>
            </Link>
          </Button>
          <Button variant="outline" className="flex flex-col items-center justify-center p-6 h-auto" asChild>
            <Link to="/statistics/regional">
              <PieChart className="h-8 w-8 mb-2 text-primary" />
              <span>Regional Analysis</span>
            </Link>
          </Button>
          <Button variant="outline" className="flex flex-col items-center justify-center p-6 h-auto" asChild>
            <Link to="/statistics/trends">
              <LineChart className="h-8 w-8 mb-2 text-primary" />
              <span>Trend Analysis</span>
            </Link>
          </Button>
        </div>
        
        <h3 className="text-lg font-medium mb-2">Key Metrics</h3>
        <ul className="space-y-2">
          <li className="p-2 bg-muted rounded-md">Total claims in 2025: 1,245</li>
          <li className="p-2 bg-muted rounded-md">Injury claims: 78% of total</li>
          <li className="p-2 bg-muted rounded-md">Average compensation: K25,000</li>
        </ul>
      </CardContent>
    </Card>
  );
};

export default StatisticalDashboard;
