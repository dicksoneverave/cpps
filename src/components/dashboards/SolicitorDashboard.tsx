
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Scale, Gavel } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const SolicitorDashboard: React.FC = () => {
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Solicitor Dashboard</CardTitle>
        <CardDescription>Manage legal cases and documentation</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          <Button variant="outline" className="flex flex-col items-center justify-center p-6 h-auto" asChild>
            <Link to="/legal/cases">
              <Scale className="h-8 w-8 mb-2 text-primary" />
              <span>Active Cases</span>
            </Link>
          </Button>
          <Button variant="outline" className="flex flex-col items-center justify-center p-6 h-auto" asChild>
            <Link to="/legal/documents">
              <FileText className="h-8 w-8 mb-2 text-primary" />
              <span>Legal Documents</span>
            </Link>
          </Button>
          <Button variant="outline" className="flex flex-col items-center justify-center p-6 h-auto" asChild>
            <Link to="/legal/proceedings">
              <Gavel className="h-8 w-8 mb-2 text-primary" />
              <span>Legal Proceedings</span>
            </Link>
          </Button>
        </div>
        
        <h3 className="text-lg font-medium mb-2">Priority Cases</h3>
        <ul className="space-y-2">
          <li className="p-2 bg-muted rounded-md">Case #5678 - Legal review required by May 15</li>
          <li className="p-2 bg-muted rounded-md">Case #5679 - Documentation deadline May 20</li>
          <li className="p-2 bg-muted rounded-md">Case #5680 - Court hearing scheduled for May 25</li>
        </ul>
      </CardContent>
    </Card>
  );
};

export default SolicitorDashboard;
