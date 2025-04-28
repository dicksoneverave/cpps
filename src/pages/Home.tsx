
import React from "react";
import Navbar from "@/components/Navbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const Home = () => {
  const { userRole, logout } = useAuth();

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar userRole={userRole || undefined} onLogout={logout} />
      
      <div className="flex-1">
        <div className="container mx-auto p-4 mt-8">
          <div className="text-center mb-12">
            <h1 className="text-3xl font-bold text-[#8B2303] mb-4">Welcome to Claims Processing & Payment System</h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              A comprehensive solution for managing workers compensation claims, designed for
              the Office of Workers Compensation in Papua New Guinea.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>File a New Claim</CardTitle>
                <CardDescription>Submit injury or death claims</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-gray-500">
                  Create and submit new Form3 (injury) or Form4 (death) claims through our 
                  streamlined process.
                </p>
                <Button asChild className="w-full bg-[#8B2303] hover:bg-[#6e1c02]">
                  <Link to="/forms/new">Start Claim Process</Link>
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Check Claim Status</CardTitle>
                <CardDescription>Track your pending claims</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-gray-500">
                  View the status of your submitted claims and track their progress through
                  the approval workflow.
                </p>
                <Button asChild className="w-full bg-[#8B2303] hover:bg-[#6e1c02]">
                  <Link to="/claims/status">Check Status</Link>
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Employer Registration</CardTitle>
                <CardDescription>Register your company</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-gray-500">
                  Register your organization with the Workers Compensation system to enable
                  claim submissions for your employees.
                </p>
                <Button asChild className="w-full bg-[#8B2303] hover:bg-[#6e1c02]">
                  <Link to="/cpps-online/employer-registration">Register Now</Link>
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="mt-12 text-center">
            <h2 className="text-2xl font-bold text-[#8B2303] mb-4">How It Works</h2>
            <div className="grid md:grid-cols-4 gap-4 max-w-4xl mx-auto">
              <div className="bg-white p-4 rounded-lg shadow">
                <div className="bg-[#8B2303] text-white rounded-full w-8 h-8 flex items-center justify-center mx-auto mb-2">1</div>
                <h3 className="font-semibold mb-2">File a Claim</h3>
                <p className="text-sm text-gray-600">Submit your injury or death claim through our online system</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow">
                <div className="bg-[#8B2303] text-white rounded-full w-8 h-8 flex items-center justify-center mx-auto mb-2">2</div>
                <h3 className="font-semibold mb-2">Claim Review</h3>
                <p className="text-sm text-gray-600">Your claim will be reviewed by our team</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow">
                <div className="bg-[#8B2303] text-white rounded-full w-8 h-8 flex items-center justify-center mx-auto mb-2">3</div>
                <h3 className="font-semibold mb-2">Approval Process</h3>
                <p className="text-sm text-gray-600">Claims are processed through our approval workflow</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow">
                <div className="bg-[#8B2303] text-white rounded-full w-8 h-8 flex items-center justify-center mx-auto mb-2">4</div>
                <h3 className="font-semibold mb-2">Compensation</h3>
                <p className="text-sm text-gray-600">Approved claims proceed to payment processing</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <footer className="bg-[#8B2303] text-white py-6 mt-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <p>&copy; {new Date().getFullYear()} Office of Workers Compensation</p>
              <p className="text-sm">Papua New Guinea</p>
            </div>
            <div className="flex space-x-4">
              <Link to="/help" className="hover:underline">Help</Link>
              <Link to="/about/contact" className="hover:underline">Contact</Link>
              <Link to="/privacy" className="hover:underline">Privacy Policy</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
