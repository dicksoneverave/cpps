
import React from "react";

interface DebugPanelProps {
  userRole: string | null;
  userId: string | null;
  groupId: number | null;
  groupTitle: string | null;
}

const DebugPanel: React.FC<DebugPanelProps> = ({
  userRole,
  userId,
  groupId,
  groupTitle
}) => {
  // Retrieve the stored role for debugging
  const storedRole = sessionStorage.getItem('userRole');
  
  return (
    <div className="bg-yellow-50 border border-yellow-200 rounded p-4 mb-6">
      <h2 className="text-lg font-semibold mb-2">Debugging Information</h2>
      <div className="space-y-1 text-sm">
        <p><strong>Passed userRole prop:</strong> {userRole || 'Not set'}</p>
        <p><strong>Stored Role in Session:</strong> {storedRole || 'Not stored in session'}</p>
        <p><strong>Current URL:</strong> {window.location.pathname}</p>
        <p><strong>Expected URL:</strong> {getDashboardPathFromRole(storedRole || userRole)}</p>
        <p><strong>User ID from users:</strong> {userId || 'Not found'}</p>
        <p><strong>Group ID from owc_user_usergroup_map:</strong> {groupId !== null ? groupId : 'Not found'}</p>
        <p><strong>Group Title from owc_usergroups:</strong> {groupTitle || 'Not found'}</p>
      </div>
    </div>
  );
};

// Helper function to determine expected dashboard path
const getDashboardPathFromRole = (role: string | null): string => {
  if (!role) return "/dashboard";
  
  const lowerRole = role.toLowerCase();
  
  if (lowerRole.includes('admin')) {
    return "/admin";
  } else if (lowerRole.includes('employer')) {
    return "/employer-dashboard";
  } else if (lowerRole.includes('deputy registrar')) {
    return "/deputy-registrar-dashboard";
  } else if (lowerRole.includes('registrar')) {
    return "/registrar-dashboard";
  } else if (lowerRole.includes('commissioner')) {
    return "/commissioner-dashboard";
  } else if (lowerRole.includes('payment')) {
    return "/payment-dashboard";
  } else if (lowerRole.includes('provincial') && lowerRole.includes('claims') || lowerRole.includes('provincialclaimsofficer')) {
    return "/pco-dashboard";
  } else if (lowerRole.includes('agent') || lowerRole.includes('lawyer')) {
    return "/agent-lawyer-dashboard";
  } else if (lowerRole.includes('data entry')) {
    return "/data-entry-dashboard";
  } else if (lowerRole.includes('tribunal')) {
    return "/tribunal-dashboard";
  } else if (lowerRole.includes('fos')) {
    return "/fos-dashboard";
  } else if (lowerRole.includes('insurance')) {
    return "/insurance-dashboard";
  } else if (lowerRole.includes('solicitor')) {
    return "/solicitor-dashboard";
  } else if (lowerRole.includes('claims manager')) {
    return "/claims-manager-dashboard";
  } else if (lowerRole.includes('statistical')) {
    return "/statistical-dashboard";
  }
  
  return "/dashboard";
};

export default DebugPanel;
