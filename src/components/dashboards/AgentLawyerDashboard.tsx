
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, File, Search, ClipboardList } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const AgentLawyerDashboard: React.FC = () => {
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Agent/Lawyer Dashboard</CardTitle>
        <CardDescription>Manage cases, clients, and legal documents</CardDescription>
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
            <Link to="/pending-list">
              <ClipboardList className="h-8 w-8 mb-2 text-primary" />
              <span>Pending Documents</span>
            </Link>
          </Button>
          <Button variant="outline" className="flex flex-col items-center justify-center p-6 h-auto" asChild>
            <Link to="/form18-notifications">
              <FileText className="h-8 w-8 mb-2 text-primary" />
              <span>Form 18 Notifications</span>
            </Link>
          </Button>
          <Button variant="outline" className="flex flex-col items-center justify-center p-6 h-auto" asChild>
            <Link to="/form4/new">
              <File className="h-8 w-8 mb-2 text-primary" />
              <span>Submit Form 4</span>
            </Link>
          </Button>
        </div>
        
        <h3 className="text-lg font-medium mb-2">Recent Activities</h3>
        <ul className="space-y-2">
          <li className="p-2 bg-muted rounded-md">Case #12345 - Form submission received</li>
          <li className="p-2 bg-muted rounded-md">Case #54321 - Decision pending</li>
          <li className="p-2 bg-muted rounded-md">Case #98765 - Documentation requested</li>
        </ul>
      </CardContent>
    </Card>
  );
};

export default AgentLawyerDashboard;
