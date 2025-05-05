
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, File, Search, ClipboardList } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const SolicitorDashboard: React.FC = () => {
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>State Solicitor Dashboard</CardTitle>
        <CardDescription>Manage legal reviews and case documents</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          <Button variant="outline" className="flex flex-col items-center justify-center p-6 h-auto" asChild>
            <Link to="/case-status-view">
              <Search className="h-8 w-8 mb-2 text-primary" />
              <span>Case Search</span>
            </Link>
          </Button>
          <Button variant="outline" className="flex flex-col items-center justify-center p-6 h-auto" asChild>
            <Link to="/legal-reviews">
              <FileText className="h-8 w-8 mb-2 text-primary" />
              <span>Legal Reviews</span>
            </Link>
          </Button>
          <Button variant="outline" className="flex flex-col items-center justify-center p-6 h-auto" asChild>
            <Link to="/pending-list">
              <ClipboardList className="h-8 w-8 mb-2 text-primary" />
              <span>Pending Documents</span>
            </Link>
          </Button>
          <Button variant="outline" className="flex flex-col items-center justify-center p-6 h-auto" asChild>
            <Link to="/legal-opinions">
              <File className="h-8 w-8 mb-2 text-primary" />
              <span>Submit Legal Opinion</span>
            </Link>
          </Button>
        </div>
        
        <h3 className="text-lg font-medium mb-2">Cases Requiring Legal Review</h3>
        <ul className="space-y-2">
          <li className="p-2 bg-muted rounded-md">Case #45678 - Time-barred claim dispute</li>
          <li className="p-2 bg-muted rounded-md">Case #56789 - Jurisdiction question</li>
          <li className="p-2 bg-muted rounded-md">Case #67890 - Compensation calculation appeal</li>
        </ul>
      </CardContent>
    </Card>
  );
};

export default SolicitorDashboard;
