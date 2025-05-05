
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, FileText, ClipboardList } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const TribunalDashboard: React.FC = () => {
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Tribunal Dashboard</CardTitle>
        <CardDescription>Manage tribunal hearings and cases</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          <Button variant="outline" className="flex flex-col items-center justify-center p-6 h-auto" asChild>
            <Link to="/hearings/schedule">
              <Calendar className="h-8 w-8 mb-2 text-primary" />
              <span>Hearing Schedule</span>
            </Link>
          </Button>
          <Button variant="outline" className="flex flex-col items-center justify-center p-6 h-auto" asChild>
            <Link to="/hearings/outcomes">
              <FileText className="h-8 w-8 mb-2 text-primary" />
              <span>Hearing Outcomes</span>
            </Link>
          </Button>
          <Button variant="outline" className="flex flex-col items-center justify-center p-6 h-auto" asChild>
            <Link to="/case-status-view">
              <ClipboardList className="h-8 w-8 mb-2 text-primary" />
              <span>Case Status</span>
            </Link>
          </Button>
        </div>
        
        <h3 className="text-lg font-medium mb-2">Upcoming Hearings</h3>
        <ul className="space-y-2">
          <li className="p-2 bg-muted rounded-md">May 10, 2025 - Case #45678 - Injury Claim Hearing</li>
          <li className="p-2 bg-muted rounded-md">May 15, 2025 - Case #56789 - Death Claim Appeal</li>
          <li className="p-2 bg-muted rounded-md">May 22, 2025 - Case #67890 - Compensation Dispute</li>
        </ul>
      </CardContent>
    </Card>
  );
};

export default TribunalDashboard;
