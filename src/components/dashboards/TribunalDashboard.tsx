
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, FileText, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const TribunalDashboard: React.FC = () => {
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Tribunal Dashboard</CardTitle>
        <CardDescription>Manage tribunal hearings and decisions</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          <Button variant="outline" className="flex flex-col items-center justify-center p-6 h-auto" asChild>
            <Link to="/tribunal/schedule">
              <Calendar className="h-8 w-8 mb-2 text-primary" />
              <span>Hearing Schedule</span>
            </Link>
          </Button>
          <Button variant="outline" className="flex flex-col items-center justify-center p-6 h-auto" asChild>
            <Link to="/tribunal/cases">
              <FileText className="h-8 w-8 mb-2 text-primary" />
              <span>Case Management</span>
            </Link>
          </Button>
          <Button variant="outline" className="flex flex-col items-center justify-center p-6 h-auto" asChild>
            <Link to="/tribunal/members">
              <Users className="h-8 w-8 mb-2 text-primary" />
              <span>Tribunal Members</span>
            </Link>
          </Button>
        </div>
        
        <h3 className="text-lg font-medium mb-2">Upcoming Hearings</h3>
        <ul className="space-y-2">
          <li className="p-2 bg-muted rounded-md">May 10, 2025 - Case #12345 - Injury claim review</li>
          <li className="p-2 bg-muted rounded-md">May 15, 2025 - Case #12346 - Employer appeal</li>
          <li className="p-2 bg-muted rounded-md">May 20, 2025 - Case #12347 - Death benefit determination</li>
        </ul>
      </CardContent>
    </Card>
  );
};

export default TribunalDashboard;
