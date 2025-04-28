
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  FileText,
  Users,
  Clipboard,
  File,
  Search,
  Database,
  HelpCircle,
  List
} from "lucide-react";

const MainMenu = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <Link to="/about">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">About</CardTitle>
            <FileText className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <p className="text-xs text-gray-500">Vision, Contact Us</p>
          </CardContent>
        </Card>
      </Link>
      
      <Link to="/services">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Services</CardTitle>
            <Users className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <p className="text-xs text-gray-500">Our services</p>
          </CardContent>
        </Card>
      </Link>
      
      <Link to="/cpps-online/employer-registration">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">CPPS Online</CardTitle>
            <Database className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <p className="text-xs text-gray-500">Employer Registration</p>
          </CardContent>
        </Card>
      </Link>
      
      <Link to="/attachments/injury-case">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Attachments</CardTitle>
            <Clipboard className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <p className="text-xs text-gray-500">Injury Case & Death Case Attachments</p>
          </CardContent>
        </Card>
      </Link>
      
      <Link to="/form3/new">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Form 3</CardTitle>
            <File className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <p className="text-xs text-gray-500">New & View Form 3</p>
          </CardContent>
        </Card>
      </Link>
      
      <Link to="/form4/new">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Form 4</CardTitle>
            <File className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <p className="text-xs text-gray-500">New & View Form 4</p>
          </CardContent>
        </Card>
      </Link>
      
      <Link to="/form18-notifications">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Form 18 Notifications</CardTitle>
            <Clipboard className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <p className="text-xs text-gray-500">Form 18 Injury & Death Worker Review</p>
          </CardContent>
        </Card>
      </Link>
      
      <Link to="/pending-submissions">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Pending Submissions</CardTitle>
            <List className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <p className="text-xs text-gray-500">List of pending form submissions</p>
          </CardContent>
        </Card>
      </Link>
      
      <Link to="/case-status-view">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Case Status View</CardTitle>
            <Search className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <p className="text-xs text-gray-500">View case status</p>
          </CardContent>
        </Card>
      </Link>
      
      <Link to="/worker-crn-search">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Worker CRN Search</CardTitle>
            <Search className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <p className="text-xs text-gray-500">Search worker by CRN</p>
          </CardContent>
        </Card>
      </Link>
      
      <Link to="/employer-search">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Employer Search</CardTitle>
            <Search className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <p className="text-xs text-gray-500">Search employers</p>
          </CardContent>
        </Card>
      </Link>
      
      <Link to="/total-claims">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Claims</CardTitle>
            <Database className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <p className="text-xs text-gray-500">Total number of claims</p>
          </CardContent>
        </Card>
      </Link>
      
      <Link to="/help">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Help</CardTitle>
            <HelpCircle className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <p className="text-xs text-gray-500">Help & Support</p>
          </CardContent>
        </Card>
      </Link>
      
      <Link to="/pending-list">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Pending List</CardTitle>
            <List className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <p className="text-xs text-gray-500">List of mandatory documents pending</p>
          </CardContent>
        </Card>
      </Link>
    </div>
  );
};

export default MainMenu;
