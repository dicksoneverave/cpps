
import { supabase } from "@/integrations/supabase/client";
import { UserGroup } from "@/types/adminTypes";

// Fetch user groups
export const fetchUserGroups = async (): Promise<UserGroup[]> => {
  try {
    const { data, error } = await supabase
      .from('owc_usergroups')
      .select('id, title')
      .order('title');
    
    if (error) throw error;
    
    // Convert id to string to match UserGroup type
    return data.map(group => ({
      id: group.id.toString(),
      title: group.title || ""
    }));
  } catch (error) {
    console.error("Error fetching user groups:", error);
    throw error;
  }
};

// Get a specific dashboard component name based on group title
export const getDashboardComponentByGroupTitle = (groupTitle: string | null): string => {
  if (!groupTitle) return "DefaultDashboard";
  
  const lowerTitle = groupTitle.toLowerCase();
  
  // Map specific roles to their dashboard components
  if (lowerTitle.includes('admin')) {
    return "AdminDashboard";
  } else if (lowerTitle.includes('employer')) {
    return "EmployerDashboard";
  } else if (lowerTitle.includes('deputy registrar')) {
    return "DeputyRegistrarDashboard";
  } else if (lowerTitle.includes('registrar')) {
    return "RegistrarDashboard";
  } else if (lowerTitle.includes('commissioner')) {
    return "CommissionerDashboard";
  } else if (lowerTitle.includes('payment')) {
    return "PaymentDashboard";
  } else if (lowerTitle.includes('provincial') && lowerTitle.includes('claims') || lowerTitle.includes('provincialclaimsofficer')) {
    return "ProvincialClaimsOfficerDashboard";
  } else if (lowerTitle.includes('agent') || lowerTitle.includes('lawyer')) {
    return "AgentLawyerDashboard";
  } else if (lowerTitle.includes('data entry')) {
    return "DataEntryDashboard";
  } else if (lowerTitle.includes('tribunal')) {
    return "TribunalDashboard";
  } else if (lowerTitle.includes('fos')) {
    return "FOSDashboard";
  } else if (lowerTitle.includes('insurance')) {
    return "InsuranceDashboard";
  } else if (lowerTitle.includes('solicitor')) {
    return "SolicitorDashboard";
  } else if (lowerTitle.includes('claims manager')) {
    return "ClaimsManagerDashboard";
  } else if (lowerTitle.includes('statistical')) {
    return "StatisticalDashboard";
  }
  
  // For all other roles, use the dynamic dashboard
  return "DynamicRoleDashboard";
};

// Get dashboard path based on role title for routing
export const getDashboardPathByGroupTitle = (groupTitle: string | null): string => {
  if (!groupTitle) return "/dashboard";
  
  const lowerTitle = groupTitle.toLowerCase();
  
  // Map specific roles to their dashboard URLs
  if (lowerTitle.includes('admin')) {
    return "/admin";
  } else if (lowerTitle.includes('employer')) {
    return "/employer-dashboard";
  } else if (lowerTitle.includes('deputy registrar')) {
    return "/deputy-registrar-dashboard";
  } else if (lowerTitle.includes('registrar')) {
    return "/registrar-dashboard";
  } else if (lowerTitle.includes('commissioner')) {
    return "/commissioner-dashboard";
  } else if (lowerTitle.includes('payment')) {
    return "/payment-dashboard";
  } else if (lowerTitle.includes('provincial') && lowerTitle.includes('claims') || lowerTitle.includes('provincialclaimsofficer')) {
    return "/pco-dashboard";
  } else if (lowerTitle.includes('agent') || lowerTitle.includes('lawyer')) {
    return "/agent-lawyer-dashboard";
  } else if (lowerTitle.includes('data entry')) {
    return "/data-entry-dashboard";
  } else if (lowerTitle.includes('tribunal')) {
    return "/tribunal-dashboard";
  } else if (lowerTitle.includes('fos')) {
    return "/fos-dashboard";
  } else if (lowerTitle.includes('insurance')) {
    return "/insurance-dashboard";
  } else if (lowerTitle.includes('solicitor')) {
    return "/solicitor-dashboard";
  } else if (lowerTitle.includes('claims manager')) {
    return "/claims-manager-dashboard";
  } else if (lowerTitle.includes('statistical')) {
    return "/statistical-dashboard";
  }
  
  // Default dashboard for other roles
  return "/dashboard";
};
