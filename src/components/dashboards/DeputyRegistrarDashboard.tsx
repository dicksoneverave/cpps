
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, CheckCircle, AlertTriangle, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const DeputyRegistrarDashboard: React.FC = () => {
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Deputy Registrar Dashboard</CardTitle>
        <CardDescription>Manage claim reviews and registrations</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          <Button variant="outline" className="flex flex-col items-center justify-center p-6 h-auto" asChild>
            <Link to="/claims/pending">
              <Clock className="h-8 w-8 mb-2 text-primary" />
              <span>Pending Reviews</span>
            </Link>
          </Button>
          <Button variant="outline" className="flex flex-col items-center justify-center p-6 h-auto" asChild>
            <Link to="/claims/approved">
              <CheckCircle className="h-8 w-8 mb-2 text-primary" />
              <span>Approved Claims</span>
            </Link>
          </Button>
          <Button variant="outline" className="flex flex-col items-center justify-center p-6 h-auto" asChild>
            <Link to="/claims/rejected">
              <AlertTriangle className="h-8 w-8 mb-2 text-primary" />
              <span>Rejected Claims</span>
            </Link>
          </Button>
          <Button variant="outline" className="flex flex-col items-center justify-center p-6 h-auto" asChild>
            <Link to="/time-barred-claims">
              <FileText className="h-8 w-8 mb-2 text-primary" />
              <span>Time-Barred Claims</span>
            </Link>
          </Button>
        </div>
        
        <h3 className="text-lg font-medium mb-2">Recent Activity</h3>
        <ul className="space-y-2">
          <li className="p-2 bg-muted rounded-md">2025-05-05 - Claim #12345 - Injury claim approved</li>
          <li className="p-2 bg-muted rounded-md">2025-05-04 - Claim #12344 - Documentation review completed</li>
          <li className="p-2 bg-muted rounded-md">2025-05-03 - Claim #12340 - Time-barred claim reviewed</li>
        </ul>
      </CardContent>
    </Card>
  );
};

export default DeputyRegistrarDashboard;
