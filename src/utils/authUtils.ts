
import { supabase } from "@/integrations/supabase/client";

// This utility function will determine the user's role from the database
export const getUserRole = async (userId: string): Promise<string | null> => {
  try {
    // In a real implementation, this would query the owc_user_usergroup_map table
    // to find the user's group ID and then query the owc_usergroups table to get the role name
    const { data, error } = await supabase
      .from('owc_user_usergroup_map')
      .select('group_id, owc_usergroups!inner(title)')
      .eq('auth_user_id', userId)
      .maybeSingle();

    if (error) {
      console.error("Error fetching user role:", error);
      return null;
    }

    // Type guard to ensure we have the correct data structure
    if (data && typeof data === 'object' && 'owc_usergroups' in data && 
        data.owc_usergroups && typeof data.owc_usergroups === 'object') {
      
      const userGroupData = data.owc_usergroups as any;
      
      if ('title' in userGroupData) {
        return userGroupData.title;
      }
    }

    return null;
  } catch (error) {
    console.error("Error in getUserRole:", error);
    return null;
  }
};

// This utility function will map role names to their corresponding menus
export const getRoleMenu = (role: string | null): string => {
  if (!role) return "MainMenu";

  // Map the role name to the menu ID as per the structure provided
  const roleMenuMap: { [key: string]: string } = {
    "Employer": "EmployerMenu",
    "Deputy Registrar": "DeputyRegistrarMenu",
    "Registrar": "RegistrarMenu",
    "Agent Lawyer": "AgentLawyerMenu",
    "Data Entry": "DataEntryMenu",
    "Provincial Claims Officer": "ProvincialClaimsOfficerMenu",
    "OWC Admin": "OWCAdminMenu",
    "Tribunal Clerk": "TribunalClerkMenu",
    "Commissioner": "CommissionerMenu",
    "Payment Section": "PaymentSectionMenu",
    "Chief Commissioner": "ChiefCommissionerMenu",
    "FOS": "FOSMenu",
    "Insurance Company": "InsuranceCompanyMenu",
    "State Solicitor": "StateSolicitorMenu",
    "Claims Manager": "ClaimsManagerMenu",
    "Statistical Department": "StatisticalDepartmentMenu"
  };

  return roleMenuMap[role] || "MainMenu";
};
