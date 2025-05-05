
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Search, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const AgentLawyerDashboard: React.FC = () => {
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Agent/Lawyer Dashboard</CardTitle>
        <CardDescription>Manage client claims and legal documentation</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          <Button variant="outline" className="flex flex-col items-center justify-center p-6 h-auto" asChild>
            <Link to="/cases/search">
              <Search className="h-8 w-8 mb-2 text-primary" />
              <span>Search Cases</span>
            </Link>
          </Button>
          <Button variant="outline" className="flex flex-col items-center justify-center p-6 h-auto" asChild>
            <Link to="/cases/pending">
              <Clock className="h-8 w-8 mb-2 text-primary" />
              <span>Pending Cases</span>
            </Link>
          </Button>
          <Button variant="outline" className="flex flex-col items-center justify-center p-6 h-auto" asChild>
            <Link to="/document/submissions">
              <FileText className="h-8 w-8 mb-2 text-primary" />
              <span>Document Submissions</span>
            </Link>
          </Button>
        </div>
        
        <h3 className="text-lg font-medium mb-2">Recent Activity</h3>
        <ul className="space-y-2">
          <li className="p-2 bg-muted rounded-md">Case #12345 - Documentation submitted</li>
          <li className="p-2 bg-muted rounded-md">Case #12346 - Pending review</li>
          <li className="p-2 bg-muted rounded-md">Case #12347 - Claim approved</li>
        </ul>
      </CardContent>
    </Card>
  );
};

export default AgentLawyerDashboard;
