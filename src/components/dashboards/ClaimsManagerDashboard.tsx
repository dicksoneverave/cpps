
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Users, Search, ClipboardList } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const ClaimsManagerDashboard: React.FC = () => {
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Claims Manager Dashboard</CardTitle>
        <CardDescription>Oversee claims processing and team performance</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          <Button variant="outline" className="flex flex-col items-center justify-center p-6 h-auto" asChild>
            <Link to="/case-status-view">
              <Search className="h-8 w-8 mb-2 text-primary" />
              <span>Claims Search</span>
            </Link>
          </Button>
          <Button variant="outline" className="flex flex-col items-center justify-center p-6 h-auto" asChild>
            <Link to="/team-performance">
              <Users className="h-8 w-8 mb-2 text-primary" />
              <span>Team Performance</span>
            </Link>
          </Button>
          <Button variant="outline" className="flex flex-col items-center justify-center p-6 h-auto" asChild>
            <Link to="/claim-reviews">
              <FileText className="h-8 w-8 mb-2 text-primary" />
              <span>Review Claims</span>
            </Link>
          </Button>
          <Button variant="outline" className="flex flex-col items-center justify-center p-6 h-auto" asChild>
            <Link to="/pending-list">
              <ClipboardList className="h-8 w-8 mb-2 text-primary" />
              <span>Pending Reviews</span>
            </Link>
          </Button>
        </div>
        
        <h3 className="text-lg font-medium mb-2">Claims Overview</h3>
        <ul className="space-y-2">
          <li className="p-2 bg-muted rounded-md">New claims: 15</li>
          <li className="p-2 bg-muted rounded-md">In process: 42</li>
          <li className="p-2 bg-muted rounded-md">Pending decision: 23</li>
          <li className="p-2 bg-muted rounded-md">Completed this month: 37</li>
        </ul>
      </CardContent>
    </Card>
  );
};

export default ClaimsManagerDashboard;
