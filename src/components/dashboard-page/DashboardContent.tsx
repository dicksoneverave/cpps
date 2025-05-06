
import React from "react";
import Dashboard from "@/components/Dashboard";
import Navbar from "@/components/Navbar";

interface DashboardContentProps {
  displayRole: string | null;
}

const DashboardContent: React.FC<DashboardContentProps> = ({ displayRole }) => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <div className="flex-1 container mx-auto p-4">
        <Dashboard userRole={displayRole || "User"} />
      </div>
    </div>
  );
};

export default DashboardContent;
