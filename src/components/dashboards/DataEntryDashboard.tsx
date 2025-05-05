
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, File, Search, ClipboardList } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const DataEntryDashboard: React.FC = () => {
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Data Entry Dashboard</CardTitle>
        <CardDescription>Process forms and manage data entry tasks</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          <Button variant="outline" className="flex flex-col items-center justify-center p-6 h-auto" asChild>
            <Link to="/form3/new">
              <File className="h-8 w-8 mb-2 text-primary" />
              <span>Process Form 3</span>
            </Link>
          </Button>
          <Button variant="outline" className="flex flex-col items-center justify-center p-6 h-auto" asChild>
            <Link to="/form4/new">
              <File className="h-8 w-8 mb-2 text-primary" />
              <span>Process Form 4</span>
            </Link>
          </Button>
          <Button variant="outline" className="flex flex-col items-center justify-center p-6 h-auto" asChild>
            <Link to="/worker-crn-search">
              <Search className="h-8 w-8 mb-2 text-primary" />
              <span>Worker Search</span>
            </Link>
          </Button>
          <Button variant="outline" className="flex flex-col items-center justify-center p-6 h-auto" asChild>
            <Link to="/pending-submissions">
              <ClipboardList className="h-8 w-8 mb-2 text-primary" />
              <span>Pending Forms</span>
            </Link>
          </Button>
        </div>
        
        <h3 className="text-lg font-medium mb-2">Entry Tasks</h3>
        <ul className="space-y-2">
          <li className="p-2 bg-muted rounded-md">Form 3 entries pending: 12</li>
          <li className="p-2 bg-muted rounded-md">Form 4 entries pending: 8</li>
          <li className="p-2 bg-muted rounded-md">Document verification required: 5</li>
        </ul>
      </CardContent>
    </Card>
  );
};

export default DataEntryDashboard;
