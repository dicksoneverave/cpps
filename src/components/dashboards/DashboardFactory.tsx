
import React from "react";
import DefaultDashboard from "./DefaultDashboard";
import AdminDashboard from "./AdminDashboard";
import EmployerDashboard from "./EmployerDashboard";
import RegistrarDashboard from "./RegistrarDashboard";
import CommissionerDashboard from "./CommissionerDashboard";
import PaymentDashboard from "./PaymentDashboard";
import ProvincialClaimsOfficerDashboard from "./ProvincialClaimsOfficerDashboard";
import AgentLawyerDashboard from "./AgentLawyerDashboard";
import DataEntryDashboard from "./DataEntryDashboard";
import TribunalDashboard from "./TribunalDashboard";
import FOSDashboard from "./FOSDashboard";
import InsuranceDashboard from "./InsuranceDashboard";
import SolicitorDashboard from "./SolicitorDashboard";
import ClaimsManagerDashboard from "./ClaimsManagerDashboard";
import StatisticalDashboard from "./StatisticalDashboard";
import DynamicRoleDashboard from "./DynamicRoleDashboard";
import { getDashboardComponentByGroupTitle } from "@/services/admin/userGroupService";

interface DashboardFactoryProps {
  userRole: string | null;
}

const DashboardFactory: React.FC<DashboardFactoryProps> = ({ userRole }) => {
  // Get the appropriate dashboard component name based on the role
  const dashboardComponent = getDashboardComponentByGroupTitle(userRole);
  
  // Return the appropriate dashboard component
  switch (dashboardComponent) {
    case "AdminDashboard":
      return <AdminDashboard />;
    case "EmployerDashboard":
      return <EmployerDashboard />;
    case "RegistrarDashboard":
      return <RegistrarDashboard />;
    case "CommissionerDashboard":
      return <CommissionerDashboard />;
    case "PaymentDashboard":
      return <PaymentDashboard />;
    case "ProvincialClaimsOfficerDashboard":
      return <ProvincialClaimsOfficerDashboard />;
    case "AgentLawyerDashboard":
      return <AgentLawyerDashboard />;
    case "DataEntryDashboard":
      return <DataEntryDashboard />;
    case "TribunalDashboard":
      return <TribunalDashboard />;
    case "FOSDashboard":
      return <FOSDashboard />;
    case "InsuranceDashboard":
      return <InsuranceDashboard />;
    case "SolicitorDashboard":
      return <SolicitorDashboard />;
    case "ClaimsManagerDashboard":
      return <ClaimsManagerDashboard />;
    case "StatisticalDashboard":
      return <StatisticalDashboard />;
    case "DynamicRoleDashboard":
      return <DynamicRoleDashboard title={userRole || "User"} />;
    case "DefaultDashboard":
    default:
      return <DefaultDashboard />;
  }
};

export default DashboardFactory;
