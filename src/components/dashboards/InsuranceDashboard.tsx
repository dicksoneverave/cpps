
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, File, Search, ClipboardList } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const InsuranceDashboard: React.FC = () => {
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Insurance Company Dashboard</CardTitle>
        <CardDescription>Manage insurance claims and policies</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          <Button variant="outline" className="flex flex-col items-center justify-center p-6 h-auto" asChild>
            <Link to="/case-status-view">
              <Search className="h-8 w-8 mb-2 text-primary" />
              <span>Claim Search</span>
            </Link>
          </Button>
          <Button variant="outline" className="flex flex-col items-center justify-center p-6 h-auto" asChild>
            <Link to="/form18-notifications">
              <FileText className="h-8 w-8 mb-2 text-primary" />
              <span>Form 18 Notifications</span>
            </Link>
          </Button>
          <Button variant="outline" className="flex flex-col items-center justify-center p-6 h-auto" asChild>
            <Link to="/pending-list">
              <ClipboardList className="h-8 w-8 mb-2 text-primary" />
              <span>Pending Documents</span>
            </Link>
          </Button>
          <Button variant="outline" className="flex flex-col items-center justify-center p-6 h-auto" asChild>
            <Link to="/form4/new">
              <File className="h-8 w-8 mb-2 text-primary" />
              <span>Submit Form 4</span>
            </Link>
          </Button>
        </div>
        
        <h3 className="text-lg font-medium mb-2">Recent Claims</h3>
        <ul className="space-y-2">
          <li className="p-2 bg-muted rounded-md">Claim #45678 - Injury Claim - Status: Pending</li>
          <li className="p-2 bg-muted rounded-md">Claim #56789 - Death Claim - Status: Under Review</li>
          <li className="p-2 bg-muted rounded-md">Claim #67890 - Injury Claim - Status: Approved</li>
        </ul>
      </CardContent>
    </Card>
  );
};

export default InsuranceDashboard;
