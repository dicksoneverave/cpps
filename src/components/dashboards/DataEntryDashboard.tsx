
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, FilePlus, Database } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const DataEntryDashboard: React.FC = () => {
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Data Entry Dashboard</CardTitle>
        <CardDescription>Manage and process claim data entry</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          <Button variant="outline" className="flex flex-col items-center justify-center p-6 h-auto" asChild>
            <Link to="/data/new-entry">
              <FilePlus className="h-8 w-8 mb-2 text-primary" />
              <span>New Data Entry</span>
            </Link>
          </Button>
          <Button variant="outline" className="flex flex-col items-center justify-center p-6 h-auto" asChild>
            <Link to="/data/pending">
              <FileText className="h-8 w-8 mb-2 text-primary" />
              <span>Pending Entries</span>
            </Link>
          </Button>
          <Button variant="outline" className="flex flex-col items-center justify-center p-6 h-auto" asChild>
            <Link to="/data/reports">
              <Database className="h-8 w-8 mb-2 text-primary" />
              <span>Data Reports</span>
            </Link>
          </Button>
        </div>
        
        <h3 className="text-lg font-medium mb-2">Recent Activity</h3>
        <ul className="space-y-2">
          <li className="p-2 bg-muted rounded-md">Form #45678 - Data entry completed</li>
          <li className="p-2 bg-muted rounded-md">Form #45679 - Pending verification</li>
          <li className="p-2 bg-muted rounded-md">Form #45680 - New submission</li>
        </ul>
      </CardContent>
    </Card>
  );
};

export default DataEntryDashboard;
