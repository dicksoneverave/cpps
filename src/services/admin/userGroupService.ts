
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
    
    return data || [];
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
