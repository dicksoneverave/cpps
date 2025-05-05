
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Users, ClipboardList, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const FOSDashboard: React.FC = () => {
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Field Operations Staff Dashboard</CardTitle>
        <CardDescription>Manage field operations and employer audits</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          <Button variant="outline" className="flex flex-col items-center justify-center p-6 h-auto" asChild>
            <Link to="/employer-search">
              <Search className="h-8 w-8 mb-2 text-primary" />
              <span>Employer Search</span>
            </Link>
          </Button>
          <Button variant="outline" className="flex flex-col items-center justify-center p-6 h-auto" asChild>
            <Link to="/audits/schedule">
              <ClipboardList className="h-8 w-8 mb-2 text-primary" />
              <span>Schedule Audits</span>
            </Link>
          </Button>
          <Button variant="outline" className="flex flex-col items-center justify-center p-6 h-auto" asChild>
            <Link to="/audits/reports">
              <FileText className="h-8 w-8 mb-2 text-primary" />
              <span>Audit Reports</span>
            </Link>
          </Button>
          <Button variant="outline" className="flex flex-col items-center justify-center p-6 h-auto" asChild>
            <Link to="/cpps-online/employer-registration">
              <Users className="h-8 w-8 mb-2 text-primary" />
              <span>Employer Registration</span>
            </Link>
          </Button>
        </div>
        
        <h3 className="text-lg font-medium mb-2">Upcoming Audits</h3>
        <ul className="space-y-2">
          <li className="p-2 bg-muted rounded-md">May 12, 2025 - XYZ Corporation - Port Moresby</li>
          <li className="p-2 bg-muted rounded-md">May 18, 2025 - ABC Industries - Lae</li>
          <li className="p-2 bg-muted rounded-md">May 25, 2025 - PQR Limited - Madang</li>
        </ul>
      </CardContent>
    </Card>
  );
};

export default FOSDashboard;
