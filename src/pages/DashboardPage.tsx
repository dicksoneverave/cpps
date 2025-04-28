
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Dashboard from "@/components/Dashboard";
import { useAuth } from "@/contexts/AuthContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";

const DashboardPage: React.FC = () => {
  const { user, userRole, loading, logout } = useAuth();
  const navigate = useNavigate();
  const [roleSpecificMenu, setRoleSpecificMenu] = useState<string>("default");
  const { toast } = useToast();

  useEffect(() => {
    if (!loading && !user) {
      navigate("/login");
    }

    // Determine the user's specific menu based on their role
    // In a real implementation, this would come from the database
    if (userRole) {
      switch (userRole.toLowerCase()) {
        case "employer":
          setRoleSpecificMenu("employer");
          break;
        case "deputy registrar":
          setRoleSpecificMenu("deputyRegistrar");
          break;
        case "registrar":
          setRoleSpecificMenu("registrar");
          break;
        case "agent lawyer":
          setRoleSpecificMenu("agentLawyer");
          break;
        case "data entry":
          setRoleSpecificMenu("dataEntry");
          break;
        case "provincial claims officer":
          setRoleSpecificMenu("provincialClaimsOfficer");
          break;
        case "owcadmin":
          setRoleSpecificMenu("owcAdmin");
          break;
        case "tribunal clerk":
          setRoleSpecificMenu("tribunalClerk");
          break;
        case "commissioner":
          setRoleSpecificMenu("commissioner");
          break;
        case "payment section":
          setRoleSpecificMenu("paymentSection");
          break;
        case "chief commissioner":
          setRoleSpecificMenu("chiefCommissioner");
          break;
        case "fos":
          setRoleSpecificMenu("fos");
          break;
        case "insurance company":
          setRoleSpecificMenu("insuranceCompany");
          break;
        case "state solicitor":
          setRoleSpecificMenu("stateSolicitor");
          break;
        case "claims manager":
          setRoleSpecificMenu("claimsManager");
          break;
        case "statistical department":
          setRoleSpecificMenu("statisticalDepartment");
          break;
        default:
          setRoleSpecificMenu("default");
      }
    }
  }, [user, userRole, loading, navigate]);

  const handleLogout = async () => {
    try {
      await logout();
      toast({
        title: "Logged out successfully",
        description: "You have been logged out of your account.",
      });
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
      toast({
        variant: "destructive",
        title: "Logout failed",
        description: "There was an error logging out. Please try again.",
      });
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar userRole={userRole || undefined} onLogout={handleLogout} />
      
      <div className="flex-1">
        <div className="container mx-auto p-4">
          <Tabs defaultValue="dashboard" className="mt-6">
            <TabsList className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 mb-8">
              <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
              <TabsTrigger value="forms">Forms</TabsTrigger>
              <TabsTrigger value="claims">Claims</TabsTrigger>
              <TabsTrigger value="reports">Reports</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
              <TabsTrigger value="help">Help</TabsTrigger>
            </TabsList>
            
            <TabsContent value="dashboard">
              <Dashboard userRole={userRole || "User"} />
            </TabsContent>
            
            <TabsContent value="forms">
              <div className="p-4 border rounded-lg bg-white">
                <h2 className="text-2xl font-bold mb-4">Forms</h2>
                <p className="text-gray-500">
                  Access and manage various forms based on your role permissions.
                </p>
                {/* Role-specific form options would be displayed here */}
              </div>
            </TabsContent>
            
            <TabsContent value="claims">
              <div className="p-4 border rounded-lg bg-white">
                <h2 className="text-2xl font-bold mb-4">Claims Management</h2>
                <p className="text-gray-500">
                  View and process claims based on your role in the system.
                </p>
                {/* Role-specific claims management options would be displayed here */}
              </div>
            </TabsContent>
            
            <TabsContent value="reports">
              <div className="p-4 border rounded-lg bg-white">
                <h2 className="text-2xl font-bold mb-4">Reports</h2>
                <p className="text-gray-500">
                  Generate and view various reports related to claims and payments.
                </p>
                {/* Role-specific reporting options would be displayed here */}
              </div>
            </TabsContent>
            
            <TabsContent value="settings">
              <div className="p-4 border rounded-lg bg-white">
                <h2 className="text-2xl font-bold mb-4">Settings</h2>
                <p className="text-gray-500">
                  Manage your account settings and preferences.
                </p>
                {/* Settings options would be displayed here */}
              </div>
            </TabsContent>
            
            <TabsContent value="help">
              <div className="p-4 border rounded-lg bg-white">
                <h2 className="text-2xl font-bold mb-4">Help & Support</h2>
                <p className="text-gray-500">
                  Get assistance with using the Claims Processing & Payment System.
                </p>
                {/* Help and support resources would be displayed here */}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
